"""Adversarial tests for structural checks, references, readiness, and safe CLI.

Run from the release directory: python -m unittest discover -s tests -v
No network, optional packages, external fixture services, or file mutations by
validator are needed. Temporary test inputs are created by these tests only.
"""
from __future__ import annotations

import copy
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

RELEASE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RELEASE))
import validator  # noqa: E402


def minimal(schema):
    """Construct the smallest schema-shaped input, then add semantic IDs below."""
    if schema is True:
        return None
    if "enum" in schema:
        return copy.deepcopy(schema["enum"][0])
    if "anyOf" in schema:
        return minimal(schema["anyOf"][0])
    name = schema.get("type", "object")
    if isinstance(name, list):
        name = name[0]
    if name == "object":
        return {key: minimal(schema.get("properties", {}).get(key, {}))
                for key in schema.get("required", [])}
    if name == "array":
        return [minimal(schema.get("items", {})) for _ in range(schema.get("minItems", 0))]
    if name == "string":
        return "value" if schema.get("minLength", 0) else ""
    if name in {"number", "integer"}:
        return max(1, schema.get("minimum", 0))
    if name == "boolean":
        return False
    return None


class BriefTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.schema = json.loads((RELEASE / "brief.schema.json").read_text())
        cls.prototype = minimal(cls.schema)
        cls.prototype["task"]["current_state"] = "entry"
        cls.prototype["screen_flow"][0]["state"] = "entry"
        cls.prototype["screen_flow"][0]["transitions"] = [{
            "event": "continue", "to": "entry", "preserves": ["settings"],
            "resets": [], "input_owner": "entry-controller",
        }]
        cls.prototype["layer_owners"][0]["layer"] = "entry-face"
        cls.prototype["layer_owners"][0]["states"] = ["entry"]
        cls.prototype["source_evidence"][0]["id"] = "evidence-1"
        cls.prototype["source_evidence"][0]["source_id"] = "source-1"
        cls.prototype["selected_recipes"] = ["recipe-1"]
        cls.catalog = {"recipes": [{"id": "recipe-1", "source_ids": ["source-1"]}]}
        cls.sources = {"sources": [{"id": "source-1"}]}

    def setUp(self):
        self.brief = copy.deepcopy(self.prototype)

    def validate(self, brief=None, catalog=None, sources=None):
        return validator.validate_brief(
            self.brief if brief is None else brief, self.schema,
            self.catalog if catalog is None else catalog,
            self.sources if sources is None else sources,
        )

    def assert_error(self, result, code, path):
        self.assertFalse(result["valid"], result)
        self.assertIn((code, path), [(e["code"], e["path"]) for e in result["errors"]])

    def test_valid_brief(self):
        self.assertTrue(self.validate()["valid"], self.validate())

    def test_missing_required_field(self):
        del self.brief["task"]["player_goal"]
        self.assert_error(self.validate(), "required", "/task/player_goal")

    def test_missing_entire_required_section(self):
        del self.brief["protected_behavior"]
        self.assert_error(self.validate(), "required", "/protected_behavior")

    def test_unexpected_property_root_and_nested(self):
        self.brief["freeform_override"] = True
        self.brief["task"]["approve_without_review"] = True
        result = self.validate()
        self.assert_error(result, "unexpected_property", "/freeform_override")
        self.assert_error(result, "unexpected_property", "/task/approve_without_review")

    def test_wrong_enum(self):
        self.brief["readiness"] = "visually_perfect"
        self.assert_error(self.validate(), "enum", "/readiness")

    def test_wrong_type(self):
        self.brief["layer_owners"][0]["priority"] = True
        self.assert_error(self.validate(), "type", "/layer_owners/0/priority")

    def test_numeric_minimum(self):
        self.brief["layer_owners"][0]["priority"] = -1
        self.assert_error(self.validate(), "minimum", "/layer_owners/0/priority")

    def test_array_minimum(self):
        self.brief["protected_behavior"] = []
        self.assert_error(self.validate(), "min_items", "/protected_behavior")

    def test_string_minimum(self):
        self.brief["task"]["player_goal"] = ""
        self.assert_error(self.validate(), "min_length", "/task/player_goal")

    def test_unresolved_values_allowed_for_proposal(self):
        self.brief["visual_grammar"]["unresolved_values"] = ["Texture scale pending"]
        self.brief["platform_adapter"]["coordinate_mapping_status"] = "unknown"
        self.brief["task"]["unknowns"] = ["Awaiting owner decision"]
        self.brief["screen_flow"][0]["unknowns"] = ["Transition reset policy unresolved"]
        self.assertTrue(self.validate()["valid"], self.validate())

    def test_implementation_ready_rejects_unresolved_values(self):
        self.brief["readiness"] = "implementation_ready"
        self.brief["visual_grammar"]["unresolved_values"] = ["Texture scale pending"]
        self.assert_error(self.validate(), "readiness_unresolved", "/visual_grammar/unresolved_values")

    def test_implementation_ready_rejects_unverified_mapping(self):
        self.brief["readiness"] = "implementation_ready"
        self.brief["platform_adapter"]["coordinate_mapping_status"] = "unknown"
        self.assert_error(self.validate(), "readiness_unresolved", "/platform_adapter/coordinate_mapping_status")

    def test_implementation_ready_rejects_task_and_flow_unknowns(self):
        self.brief["readiness"] = "implementation_ready"
        self.brief["task"]["unknowns"] = ["Awaiting owner decision"]
        self.brief["screen_flow"][0]["unknowns"] = ["Unknown route"]
        result = self.validate()
        self.assert_error(result, "readiness_unresolved", "/task/unknowns")
        self.assert_error(result, "readiness_unresolved", "/screen_flow/0/unknowns")

    def test_resolved_implementation_ready_is_structure_only(self):
        self.brief["readiness"] = "implementation_ready"
        result = self.validate()
        self.assertTrue(result["valid"], result)
        self.assertIs(result["structure_only"], True)
        self.assertEqual(result["visual_quality"], "not_assessed")
        self.assertEqual(result["behavior"], "not_executed")

    def test_readiness_does_not_guess_unknowns_from_prose(self):
        self.brief["readiness"] = "implementation_ready"
        self.brief["visual_grammar"]["art_statement"] = "A landscape with unknown stars"
        self.assertTrue(self.validate()["valid"], self.validate())

    def test_validator_does_not_award_visual_or_input_pass(self):
        for kind in ("visual", "input", "device", "user_review"):
            with self.subTest(kind=kind):
                gate = self.brief["verification"]["gates"][0]
                gate.update({"kind": kind, "status": "pass"})
                self.brief["verification"]["user_review"] = "approved_for_named_scope"
                result = self.validate()
                self.assertTrue(result["valid"], result)
                self.assertEqual(result["visual_quality"], "not_assessed")
                self.assertEqual(result["behavior"], "not_executed")

    def test_impossible_transition(self):
        self.brief["screen_flow"][0]["transitions"][0]["to"] = "missing-state"
        self.assert_error(self.validate(), "unknown_reference", "/screen_flow/0/transitions/0/to")

    def test_impossible_current_state(self):
        self.brief["task"]["current_state"] = "missing-state"
        self.assert_error(self.validate(), "unknown_reference", "/task/current_state")

    def test_impossible_layer_state(self):
        self.brief["layer_owners"][0]["states"] = ["missing-state"]
        self.assert_error(self.validate(), "unknown_reference", "/layer_owners/0/states/0")

    def test_duplicate_state_ids(self):
        self.brief["screen_flow"].append(copy.deepcopy(self.brief["screen_flow"][0]))
        self.assert_error(self.validate(), "duplicate_id", "/screen_flow/1/state")

    def test_duplicate_layer_ids(self):
        self.brief["layer_owners"].append(copy.deepcopy(self.brief["layer_owners"][0]))
        self.assert_error(self.validate(), "duplicate_id", "/layer_owners/1/layer")

    def test_duplicate_evidence_ids(self):
        self.brief["source_evidence"].append(copy.deepcopy(self.brief["source_evidence"][0]))
        self.assert_error(self.validate(), "duplicate_id", "/source_evidence/1/id")

    def test_duplicate_gate_ids(self):
        self.brief["verification"]["gates"].append(copy.deepcopy(self.brief["verification"]["gates"][0]))
        self.assert_error(self.validate(), "duplicate_id", "/verification/gates/1/id")

    def test_duplicate_viewport_ids(self):
        self.brief["platform_adapter"]["viewports"].append(copy.deepcopy(self.brief["platform_adapter"]["viewports"][0]))
        self.assert_error(self.validate(), "duplicate_id", "/platform_adapter/viewports/1/id")

    def test_duplicate_selected_recipes(self):
        self.brief["selected_recipes"].append("recipe-1")
        self.assert_error(self.validate(), "unique_items", "/selected_recipes/1")

    def test_missing_recipe_reference(self):
        self.brief["selected_recipes"] = ["missing-recipe"]
        self.assert_error(self.validate(), "unknown_reference", "/selected_recipes/0")

    def test_missing_source_reference(self):
        self.brief["source_evidence"][0]["source_id"] = "missing-source"
        self.assert_error(self.validate(), "unknown_reference", "/source_evidence/0/source_id")

    def test_missing_evidence_reference(self):
        self.brief["verification"]["gates"][0]["evidence_ids"] = ["missing-evidence"]
        self.assert_error(self.validate(), "unknown_reference", "/verification/gates/0/evidence_ids/0")

    def test_bad_catalog_shape_not_silently_ignored(self):
        result = self.validate(catalog={"recipes": "wrong"})
        self.assert_error(result, "catalog_shape", "/catalog/recipes")

    def test_optional_reference_checks_reported_when_absent(self):
        result = validator.validate_brief(self.brief, self.schema)
        self.assertTrue(result["valid"], result)
        self.assertEqual(result["reference_checks"], {"recipes": False, "sources": False})

    def test_no_input_mutation(self):
        before = copy.deepcopy((self.brief, self.schema, self.catalog, self.sources))
        self.validate()
        self.assertEqual((self.brief, self.schema, self.catalog, self.sources), before)

    def test_stable_order_despite_json_key_order(self):
        self.brief["z_extra"] = 1
        self.brief["a_extra"] = 2
        self.brief["task"]["player_goal"] = ""
        result = self.validate()
        reverse = {k: self.brief[k] for k in reversed(list(self.brief))}
        self.assertEqual(result, self.validate(brief=reverse))
        self.assertEqual(result["errors"], validator.ordered(result["errors"]))


class SchemaTests(unittest.TestCase):
    def errors(self, instance, schema):
        return validator.SchemaValidator(schema).validate(instance)

    def test_local_ref_and_sibling_constraints(self):
        schema = {"$defs": {"word": {"type": "string", "minLength": 2}},
                  "$ref": "#/$defs/word", "enum": ["ok"]}
        self.assertEqual(self.errors("ok", schema), [])
        self.assertEqual(self.errors("other", schema)[0]["code"], "enum")
        self.assertIn("min_length", [e["code"] for e in self.errors("x", schema)])

    def test_local_ref_pointer_escapes(self):
        schema = {"$defs": {"a/b~c": {"type": "integer"}}, "$ref": "#/$defs/a~1b~0c"}
        self.assertEqual(self.errors(2, schema), [])

    def test_local_ref_anyof_array_pointer(self):
        schema = {"$defs": {"x": {"anyOf": [{"type": "string"}, {"type": "number"}]}},
                  "$ref": "#/$defs/x/anyOf/1"}
        self.assertEqual(self.errors(2, schema), [])

    def test_anyof_valid_and_invalid(self):
        schema = {"anyOf": [{"type": "string", "minLength": 1}, {"type": "number"}]}
        self.assertEqual(self.errors(0, schema), [])
        self.assertEqual(self.errors("x", schema), [])
        self.assertEqual(self.errors(False, schema)[0]["code"], "any_of")

    def test_unknown_keyword_in_unused_anyof_branch_is_rejected(self):
        schema = {"anyOf": [{"type": "string"}, {"pattern": ".*"}]}
        errors = self.errors("already matches", schema)
        self.assertEqual(errors[0]["code"], "unsupported_keyword")
        self.assertEqual(errors[0]["path"], "/anyOf/1/pattern")

    def test_unknown_keywords_do_not_get_silently_ignored(self):
        for keyword in ("maxLength", "format", "oneOf", "if", "x-hidden", "unevaluatedProperties"):
            with self.subTest(keyword=keyword):
                self.assertEqual(self.errors({}, {keyword: 1})[0]["code"], "unsupported_keyword")

    def test_malicious_external_refs_are_never_resolved(self):
        for ref in ("file:///etc/passwd", "../../secret.json", "https://evil.invalid/schema",
                    "other.json#/properties/x", "#/../etc/passwd", "#/%2e%2e/secret", "#/a~9b"):
            with self.subTest(ref=ref):
                self.assertEqual(self.errors({}, {"$ref": ref})[0]["code"], "invalid_ref")

    def test_missing_ref_and_scalar_ref(self):
        self.assertEqual(self.errors({}, {"$ref": "#/$defs/missing"})[0]["code"], "invalid_ref")
        self.assertEqual(self.errors({}, {"title": "scalar", "$ref": "#/title"})[0]["code"], "invalid_ref")

    def test_ref_cycle_has_structured_error(self):
        self.assertEqual(self.errors({}, {"$ref": "#"})[0]["code"], "circular_ref")

    def test_consuming_recursive_schema_supports_finite_trees(self):
        schema = {"type": "object", "properties": {"child": {"$ref": "#"}}, "additionalProperties": False}
        self.assertEqual(self.errors({"child": {"child": {}}}, schema), [])
        self.assertEqual(self.errors({"child": {"wrong": 1}}, schema)[0]["path"], "/child/wrong")

    def test_boolean_schemas(self):
        self.assertEqual(self.errors(1, True), [])
        self.assertEqual(self.errors(1, False)[0]["code"], "false_schema")

    def test_schema_keyword_type_errors(self):
        cases = [{"type": "banana"}, {"type": ["string", "string"]}, {"required": [1]},
                 {"required": ["a", "a"]}, {"properties": []}, {"$defs": []},
                 {"items": []}, {"additionalProperties": "false"}, {"minItems": -1},
                 {"minLength": True}, {"minimum": "zero"}, {"uniqueItems": "yes"},
                 {"anyOf": []}, {"enum": []}, {"enum": [1, 1.0]}]
        for schema in cases:
            with self.subTest(schema=schema):
                self.assertEqual(self.errors({}, schema)[0]["code"], "invalid_schema")

    def test_json_type_semantics(self):
        for name, allowed, denied in (
                ("null", [None], [False, 0]),
                ("boolean", [True, False], [0, 1]),
                ("integer", [1, 1.0, -3], [True, 1.5, "1"]),
                ("number", [1, 1.5], [True, "1"]),
                ("array", [[]], [{}]),
                ("object", [{}], [[]]),
                ("string", [""], [None])):
            for value in allowed:
                self.assertEqual(self.errors(value, {"type": name}), [], (name, value))
            for value in denied:
                self.assertEqual(self.errors(value, {"type": name})[0]["code"], "type")

    def test_enum_does_not_confuse_bool_and_number(self):
        self.assertEqual(self.errors(1, {"enum": [True]})[0]["code"], "enum")
        self.assertEqual(self.errors(1.0, {"enum": [1]}), [])

    def test_unique_json_equality(self):
        self.assertEqual(self.errors([True, 1, "1"], {"uniqueItems": True}), [])
        self.assertEqual(self.errors([1, 1.0], {"uniqueItems": True})[0]["code"], "unique_items")
        values = [{"a": 1, "b": 2}, {"b": 2, "a": 1}]
        self.assertEqual(self.errors(values, {"uniqueItems": True})[0]["code"], "unique_items")

    def test_additional_properties_schema(self):
        self.assertEqual(self.errors({"x": 2}, {"additionalProperties": {"type": "number"}}), [])
        self.assertEqual(self.errors({"x": "2"}, {"additionalProperties": {"type": "number"}})[0]["path"], "/x")

    def test_constraints_apply_only_to_their_instance_type(self):
        self.assertEqual(self.errors(True, {"minimum": 2, "minLength": 4, "minItems": 4,
                                            "required": ["x"]}), [])

    def test_json_pointer_error_paths_escape_member_names(self):
        errors = self.errors({"a/b~c": False}, {"additionalProperties": False})
        self.assertEqual(errors[0]["path"], "/a~1b~0c")


class PackageTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.documents = {
            "brief.schema.json": {"type": "object"},
            "recipe-catalog.json": {"recipes": [{"id": "recipe-1", "source_ids": ["source-1"]}]},
            "sources.json": {"sources": [{"id": "source-1"}]},
            "display.json": {
                "stages": [{"id": "stage-1", "recipe_ids": ["recipe-1"],
                            "source_evidence": [{"source_id": "source-1"}]}],
                "recipes": [{"id": "recipe-1", "source_evidence": [{"source_id": "source-1"}]}],
                "applications": [{"id": "app-1", "recipe_ids": ["recipe-1"], "source_ids": ["source-1"]}],
            },
        }

    def write(self):
        for name, document in self.documents.items():
            (self.root / name).write_text(json.dumps(document), encoding="utf-8")

    def validate(self):
        self.write()
        return validator.validate_package(self.root)

    def assert_error(self, result, code, path):
        self.assertFalse(result["valid"], result)
        self.assertIn((code, path), [(e["code"], e["path"]) for e in result["errors"]])

    def test_valid_package(self):
        result = self.validate()
        self.assertTrue(result["valid"], result)
        self.assertIs(result["structure_only"], True)
        self.assertEqual(result["visual_quality"], "not_assessed")
        self.assertEqual(result["behavior"], "not_executed")

    def test_duplicate_recipe_source_display_ids(self):
        for filename, key in (("recipe-catalog.json", "recipes"), ("sources.json", "sources"),
                              ("display.json", "stages"), ("display.json", "recipes"),
                              ("display.json", "applications")):
            with self.subTest(filename=filename, key=key):
                entries = self.documents[filename][key]
                entries.append(copy.deepcopy(entries[0]))
                self.assert_error(self.validate(), "duplicate_id", f"/{filename}/{key}/1/id")
                entries.pop()

    def test_recipe_source_reference(self):
        self.documents["recipe-catalog.json"]["recipes"][0]["source_ids"] = ["missing"]
        self.assert_error(self.validate(), "unknown_reference", "/recipe-catalog.json/recipes/0/source_ids/0")

    def test_display_stage_recipe_reference(self):
        self.documents["display.json"]["stages"][0]["recipe_ids"] = ["missing"]
        self.assert_error(self.validate(), "unknown_reference", "/display.json/stages/0/recipe_ids/0")

    def test_display_recipe_id_reference(self):
        self.documents["display.json"]["recipes"][0]["id"] = "missing"
        self.assert_error(self.validate(), "unknown_reference", "/display.json/recipes/0/id")

    def test_display_source_evidence_reference(self):
        self.documents["display.json"]["stages"][0]["source_evidence"][0]["source_id"] = "missing"
        self.assert_error(self.validate(), "unknown_reference", "/display.json/stages/0/source_evidence/0/source_id")

    def test_display_application_reference(self):
        self.documents["display.json"]["applications"][0]["source_ids"] = ["missing"]
        self.assert_error(self.validate(), "unknown_reference", "/display.json/applications/0/source_ids/0")

    def test_invalid_reference_type(self):
        self.documents["display.json"]["applications"][0]["source_ids"] = [True]
        self.assert_error(self.validate(), "invalid_reference", "/display.json/applications/0/source_ids/0")

    def test_invalid_catalog_shape_and_null(self):
        for value in (None, {}, {"sources": []}, {"recipes": "x"}):
            with self.subTest(value=value):
                self.documents["recipe-catalog.json"] = value
                self.assert_error(self.validate(), "catalog_shape", "/recipe-catalog.json/recipes")

    def test_null_schema_and_null_display_are_invalid(self):
        self.documents["brief.schema.json"] = None
        self.documents["display.json"] = None
        result = self.validate()
        self.assert_error(result, "invalid_schema", "/brief.schema.json")
        self.assert_error(result, "display_shape", "/display.json")

    def test_missing_required_files(self):
        self.write()
        (self.root / "sources.json").unlink()
        self.assert_error(validator.validate_package(self.root), "missing_file", "/sources.json")

    def test_parse_all_package_json(self):
        self.write()
        (self.root / "additional.json").write_text("{bad}")
        self.assert_error(validator.validate_package(self.root), "json_parse", "/additional.json")

    def test_duplicate_json_keys_rejected(self):
        self.write()
        (self.root / "sources.json").write_text('{"sources": [], "sources": [{"id":"x"}]}')
        self.assert_error(validator.validate_package(self.root), "json_parse", "/sources.json")

    def test_nonfinite_json_numbers_rejected(self):
        self.write()
        for number in ("NaN", "Infinity", "-Infinity", "1e999"):
            with self.subTest(number=number):
                (self.root / "additional.json").write_text(number)
                self.assert_error(validator.validate_package(self.root), "json_parse", "/additional.json")

    def test_schema_unsupported_keyword_rejected_at_package_preflight(self):
        self.documents["brief.schema.json"] = {"format": "uri"}
        self.assert_error(self.validate(), "unsupported_keyword", "/brief.schema.json/format")

    def test_package_symlink_escape_disallowed(self):
        self.write()
        with tempfile.TemporaryDirectory() as other:
            external = Path(other) / "outside.json"
            external.write_text("{}")
            (self.root / "escape.json").symlink_to(external)
            self.assert_error(validator.validate_package(self.root), "external_file", "/escape.json")

    def test_no_package_file_mutation(self):
        self.write()
        before = {p.name: p.read_bytes() for p in self.root.iterdir()}
        validator.validate_package(self.root)
        self.assertEqual({p.name: p.read_bytes() for p in self.root.iterdir()}, before)


class DeclaredConsistencyTests(unittest.TestCase):
    """Relational regressions for the authored adaptation, never runtime acceptance."""

    def setUp(self):
        self.schema = json.loads((RELEASE / "brief.schema.json").read_text())
        self.brief = json.loads((RELEASE / "examples/industrial-adaptation.brief.json").read_text())
        self.catalog = json.loads((RELEASE / "recipe-catalog.json").read_text())
        self.sources = json.loads((RELEASE / "sources.json").read_text())

    def validate(self):
        return validator.validate_brief(self.brief, self.schema, self.catalog, self.sources)

    def assert_code(self, code):
        result = self.validate()
        self.assertFalse(result["valid"], result)
        self.assertIn(code, [issue["code"] for issue in result["errors"]])

    def test_adaptation_contract_matches_state_events_and_numeric_tokens(self):
        result = self.validate()
        self.assertTrue(result["valid"], result)
        flow = self.brief["screen_flow"]
        states = {state["state"] for state in flow}
        events = {transition["event"] for state in flow for transition in state["transitions"]}
        gates = {gate["kind"]: gate for gate in self.brief["verification"]["gates"]}
        self.assertEqual(set(gates["visual"]["state_ids"]), states)
        self.assertEqual(set(gates["input"]["state_ids"]), states)
        self.assertEqual(set(gates["input"]["event_names"]), events)
        for state in flow:
            expected = {transition["event"] for transition in state["transitions"]
                        if transition["trigger_kind"] == "user_input"}
            self.assertEqual(set(state["action_events"]), expected)
        pending = next(state for state in flow if state["input_mode"] == "read_only")
        self.assertEqual(pending["action_events"], [])
        self.assertEqual(pending["secondary_actions"], [])
        self.assertTrue(all(transition["trigger_kind"] == "internal_event" for transition in pending["transitions"]))
        grammar = self.brief["visual_grammar"]
        tokens = {token["name"]: token for token in grammar["values_and_units"]}
        resolved = result["declared_consistency"]["resolved_spacing_strategy"]
        for token_name in grammar["spacing"]["token_refs"].values():
            token = tokens[token_name]
            self.assertIn(str(token["value"]) + " " + token["unit"], resolved)
        self.assertNotIn("${", resolved)
        self.assertIs(result["declared_consistency"]["declarations_only"], True)
        self.assertTrue(all(gate["status"] == "not_run" for gate in gates.values()))
        record = next(record for record in self.sources["sources"] if record["id"] == self.brief["source_evidence"][0]["source_id"])
        self.assertEqual(record["url"], "../release/examples/industrial-adaptation.brief.json")

    def test_unknown_gate_state_and_event_references_are_rejected(self):
        self.brief["verification"]["gates"][0]["state_ids"][0] = "missing-state"
        self.brief["verification"]["gates"][1]["event_names"][0] = "missing-event"
        self.assert_code("unknown_reference")

    def test_complete_flow_gate_rejects_missing_actual_scope(self):
        self.brief["verification"]["gates"][1]["event_names"].pop()
        self.assert_code("flow_coverage")

    def test_read_only_pending_rejects_advertised_return(self):
        self.brief["screen_flow"][2]["secondary_actions"] = ["Return"]
        self.assert_code("read_only_actions")

    def test_action_declarations_must_match_local_user_transitions(self):
        self.brief["screen_flow"][0]["action_events"] = ["Return"]
        self.assert_code("unknown_reference")
        self.assert_code("action_coverage")

    def test_spacing_rejects_missing_and_duplicate_token_names(self):
        self.brief["visual_grammar"]["values_and_units"].pop(8)
        self.assert_code("unknown_reference")
        self.brief["visual_grammar"]["values_and_units"].append(copy.deepcopy(self.brief["visual_grammar"]["values_and_units"][0]))
        self.assert_code("duplicate_id")

    def test_spacing_literals_cannot_drift_from_referenced_token_values(self):
        self.brief["visual_grammar"]["spacing"]["strategy"] += ";16 CSS px duplicate inline inset"
        self.assert_code("numeric_prose_drift")

    def test_declared_contract_wrong_types_return_errors_without_crashing(self):
        self.brief["screen_flow"][0]["input_mode"] = []
        self.brief["screen_flow"][2]["transitions"][0]["trigger_kind"] = {}
        self.assert_code("input_contract")


class CLITests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.schema = self.root / "brief.schema.json"
        self.input = self.root / "input.json"
        self.schema.write_text('{"type": "object", "additionalProperties": false}')
        self.input.write_text('{}')

    def run_cli(self, *args):
        process = subprocess.run([sys.executable, str(RELEASE / "validator.py"), *map(str, args)],
                                 cwd=self.root, capture_output=True, text=True, check=False)
        self.assertEqual(process.stderr, "", process.stderr)
        return process.returncode, json.loads(process.stdout)

    def test_valid_and_invalid_cli_exit_status(self):
        code, result = self.run_cli("brief", self.input, "--schema", self.schema)
        self.assertEqual(code, 0)
        self.assertTrue(result["valid"])
        self.assertIs(result["structure_only"], True)
        self.assertEqual(result["visual_quality"], "not_assessed")
        self.input.write_text('{"extra":true}')
        code, result = self.run_cli("brief", self.input, "--schema", self.schema)
        self.assertEqual(code, 1)
        self.assertEqual(result["errors"][0]["code"], "unexpected_property")

    def test_explicit_missing_catalog_not_silently_skipped(self):
        code, result = self.run_cli("brief", self.input, "--schema", self.schema,
                                    "--catalog", self.root / "missing.json")
        self.assertEqual(code, 1)
        self.assertEqual(result["errors"][0]["code"], "missing_file")

    def test_implicit_adjacent_catalogs_are_checked(self):
        self.schema.write_text('{"type":"object"}')
        self.input.write_text('{"selected_recipes":["missing"]}')
        (self.root / "recipe-catalog.json").write_text('{"recipes":[{"id":"recipe-1"}]}')
        (self.root / "sources.json").write_text('{"sources":[{"id":"source-1"}]}')
        code, result = self.run_cli("brief", self.input, "--schema", self.schema)
        self.assertEqual(code, 1)
        self.assertEqual(result["reference_checks"], {"recipes": True, "sources": True})

    def test_null_adjacent_catalog_is_not_treated_as_absent(self):
        (self.root / "recipe-catalog.json").write_text("null")
        code, result = self.run_cli("brief", self.input, "--schema", self.schema)
        self.assertEqual(code, 1)
        self.assertEqual(result["errors"][0]["code"], "catalog_shape")

    def test_malformed_json_reports_structured_error(self):
        self.input.write_text('{')
        code, result = self.run_cli("brief", self.input, "--schema", self.schema)
        self.assertEqual(code, 1)
        self.assertEqual(result["errors"][0]["path"], "/input")
        self.assertEqual(result["behavior"], "not_executed")

    def test_package_cli_missing_root_files_fails(self):
        code, result = self.run_cli("package", "--root", self.root)
        self.assertEqual(code, 1)
        self.assertEqual(result["mode"], "package")
        self.assertIn("missing_file", [e["code"] for e in result["errors"]])


class ReleaseFixtureTests(unittest.TestCase):
    """Keep the shipped catalog and authored examples wired to the validator."""

    def test_real_package_is_structurally_consistent(self):
        result = validator.validate_package(RELEASE)
        self.assertTrue(result["valid"], result)

    def test_reader_handoff_contains_exact_complete_maker_instructions(self):
        display = json.loads((RELEASE / "display.json").read_text(encoding="utf-8"))
        instructions = (RELEASE / "AI_INSTRUCTIONS.md").read_bytes()
        self.assertEqual(display["maker_instructions"].encode("utf-8"), instructions)
        self.assertEqual(display["maker_instructions_source"], "../release/AI_INSTRUCTIONS.md")
        self.assertIn("## Execute in this dependency order", display["maker_instructions"])
        self.assertIn("### 6. Inspect, repair and deliver actual evidence", display["maker_instructions"])

    def test_public_variant_sources_are_explicit_public_or_authored_records(self):
        sources = json.loads((RELEASE / "sources.json").read_text())
        expected = {"VW-S01", "VW-S02", "VW-S03", "VW-S04", "VW-V01", "VW-V02",
                    "VW-EXAMPLE", "AUTH-CATALOG", "AUTH-BUTTON", "AUTH-GUIDE", "AUTH-MAINT",
                    "SUP-LAYERS", "SUP-INPUT", "SUP-CRAFT", "AUTHORED-TRIAL", "AUTHORED-INDUSTRIAL"}
        self.assertEqual({record["id"] for record in sources["sources"]}, expected)
        self.assertIn("omitted", sources["public_variant_scope"])
        authority = json.loads((RELEASE / "authority-index.json").read_text())
        self.assertEqual(set(authority), {"version", "authority_lock", "original_rules_preserved",
                                         "promoted_rules", "extension_namespace", "supplementary_snapshot", "policy"})
        records = authority["authority_lock"]["files"]
        self.assertEqual(len(records), 14)
        self.assertEqual(len({record["path"] for record in records}), 14)
        for record in records:
            self.assertEqual(len(record["raw_file_sha256"]), 64)
            self.assertEqual(len(record["git_blob_sha"]), 40)
            self.assertTrue(record["url"].startswith("https://github.com/"))


    def test_public_variant_candidate_provenance_is_deliberately_omitted(self):
        details = json.loads((RELEASE / "recipe-details.json").read_text())
        self.assertEqual(len(details["candidates"]), 30)
        self.assertEqual(len(details["merge_map"]), 20)
        for candidate in details["candidates"]:
            if candidate["id"].startswith(("RB-", "RS-")):
                self.assertEqual(candidate["source_urls"], [])
                original = candidate["original_record"]
                self.assertEqual(original.get("evidence", original.get("sources")), [])
                self.assertIn("omitted", candidate["provenance_scope"])
                for field in ("input", "when", "process", "output", "test", "exception"):
                    self.assertTrue(candidate[field], candidate["id"] + ": " + field)

    def test_public_variant_applications_are_authored_hypotheticals(self):
        patterns = json.loads((RELEASE / "application-patterns.json").read_text())
        display = json.loads((RELEASE / "display.json").read_text())
        self.assertEqual(patterns["source_applications"], display["applications"])
        self.assertEqual(len(display["applications"]), 4)
        for scenario in display["applications"]:
            self.assertTrue(scenario["id"].startswith("authored-"))
            self.assertEqual(scenario["status"], "original_authored_scenario_not_source_inspection")
            self.assertEqual(scenario["source_ids"], [])
            self.assertTrue(scenario["recipe_ids"])
            self.assertIn("Fictional authored", scenario["limitations"][0])

    def test_real_examples_have_valid_refs_and_keep_target_gates_unexecuted(self):
        schema = json.loads((RELEASE / "brief.schema.json").read_text())
        catalog = json.loads((RELEASE / "recipe-catalog.json").read_text())
        sources = json.loads((RELEASE / "sources.json").read_text())
        for filename in ("painted-entry.brief.json", "industrial-adaptation.brief.json"):
            with self.subTest(filename=filename):
                example = json.loads((RELEASE / "examples" / filename).read_text())
                result = validator.validate_brief(example, schema, catalog, sources)
                self.assertTrue(result["valid"], result)
                self.assertEqual(example["readiness"], "proposal")
                self.assertTrue(all(g["status"] == "not_run" for g in example["verification"]["gates"]))
                self.assertEqual(result["reference_checks"], {"recipes": True, "sources": True})
                self.assertEqual(result["visual_quality"], "not_assessed")
                self.assertEqual(result["behavior"], "not_executed")


if __name__ == "__main__":
    unittest.main()
