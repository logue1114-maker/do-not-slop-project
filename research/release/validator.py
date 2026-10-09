#!/usr/bin/env python3
"""Read-only, deterministic structural validation for the Do Not Slop release.

This intentionally implements a bounded JSON Schema 2020-12 vocabulary, not
all of JSON Schema. Unsupported keywords are errors even in unused branches.
References resolve only within the supplied schema, never to a file or network.
A successful result establishes structure only, never visual or input quality.
"""
from __future__ import annotations

import argparse
import json
import math
import re
from pathlib import Path
from typing import Any

VALIDATION_KEYWORDS = frozenset({
    "type", "required", "properties", "additionalProperties", "items", "minItems",
    "minLength", "enum", "minimum", "uniqueItems", "$ref", "anyOf",
})
ANNOTATION_KEYWORDS = frozenset({
    "$schema", "$id", "title", "description", "$comment", "default", "examples",
})
CONTAINER_KEYWORDS = frozenset({"$defs", "definitions"})
SUPPORTED_KEYWORDS = VALIDATION_KEYWORDS | ANNOTATION_KEYWORDS | CONTAINER_KEYWORDS
JSON_TYPES = frozenset({"null", "boolean", "object", "array", "number", "integer", "string"})


def pointer(path: str, component: Any) -> str:
    return path + "/" + str(component).replace("~", "~0").replace("/", "~1")


def error(path: str, code: str, message: str, schema_path: str | None = None) -> dict:
    result = {"path": path, "code": code, "message": message}
    if schema_path is not None:
        result["schema_path"] = schema_path
    return result


def ordered(errors: list[dict]) -> list[dict]:
    """Make error ordering independent of object insertion order."""
    return sorted(errors, key=lambda e: (
        e["path"], e["code"], e.get("schema_path", ""), e["message"],
    ))


def report(mode: str, errors: list[dict], **metadata: Any) -> dict:
    return {
        "mode": mode, "valid": not errors,
        "structure_only": True, "visual_quality": "not_assessed",
        "behavior": "not_executed", "errors": ordered(errors), **metadata,
    }


def is_number(value: Any) -> bool:
    return (isinstance(value, (int, float)) and not isinstance(value, bool)
            and (not isinstance(value, float) or math.isfinite(value)))


def is_type(value: Any, name: str) -> bool:
    if name == "null":
        return value is None
    if name == "boolean":
        return isinstance(value, bool)
    if name == "object":
        return isinstance(value, dict)
    if name == "array":
        return isinstance(value, list)
    if name == "string":
        return isinstance(value, str)
    if name == "number":
        return is_number(value)
    if name == "integer":
        return is_number(value) and (isinstance(value, int) or value.is_integer())
    return False


def frozen(value: Any) -> Any:
    """JSON equality, including numeric equality without bool/int conflation."""
    if value is None:
        return ("null",)
    if isinstance(value, bool):
        return ("boolean", value)
    if is_number(value):
        return ("number", value)
    if isinstance(value, str):
        return ("string", value)
    if isinstance(value, list):
        return ("array", tuple(frozen(v) for v in value))
    if isinstance(value, dict):
        return ("object", tuple((k, frozen(v)) for k, v in sorted(value.items())))
    return ("invalid", type(value).__name__, repr(value))


class SchemaValidator:
    """Preflight the complete schema before inspecting an instance."""

    def __init__(self, schema: Any):
        self.schema = schema
        self.schema_errors: list[dict] = []
        self._checked: set[int] = set()
        self._check_schema(schema, "")
        self.schema_errors = ordered(self.schema_errors)

    def _schema_error(self, path: str, message: str, code: str = "invalid_schema") -> None:
        self.schema_errors.append(error(path, code, message, path))

    def _resolve(self, ref: str) -> tuple[Any, str]:
        if not isinstance(ref, str) or not (ref == "#" or ref.startswith("#/")):
            raise ValueError("$ref must be a local JSON Pointer fragment (# or #/...)")
        if ref == "#":
            return self.schema, ""
        # This bounded implementation accepts literal JSON Pointer fragments;
        # percent-encoded URI fragments are explicitly rejected, never fetched.
        if "%" in ref:
            raise ValueError("Percent-encoded $ref fragments are unsupported")
        target = self.schema
        target_path = ""
        for token in ref[2:].split("/"):
            if re.search(r"~(?![01])", token):
                raise ValueError("Malformed JSON Pointer escape in $ref")
            token = token.replace("~1", "/").replace("~0", "~")
            target_path = pointer(target_path, token)
            if isinstance(target, dict) and token in target:
                target = target[token]
            elif (isinstance(target, list) and re.fullmatch(r"0|[1-9][0-9]*", token)
                  and int(token) < len(target)):
                target = target[int(token)]
            else:
                raise ValueError("$ref target does not exist: " + ref)
        if not isinstance(target, (dict, bool)):
            raise ValueError("$ref target is not an object or boolean schema: " + ref)
        return target, target_path

    def _check_schema(self, schema: Any, path: str) -> None:
        if isinstance(schema, bool):
            return
        if not isinstance(schema, dict):
            self._schema_error(path, "A schema must be an object or boolean")
            return
        if id(schema) in self._checked:
            return
        self._checked.add(id(schema))
        for key in sorted(schema):
            if key not in SUPPORTED_KEYWORDS:
                self._schema_error(pointer(path, key), "Unsupported schema keyword: " + key,
                                   "unsupported_keyword")
        if "type" in schema:
            types = schema["type"]
            if isinstance(types, str):
                types = [types]
            if (not isinstance(types, list) or not types
                    or any(not isinstance(t, str) or t not in JSON_TYPES for t in types)
                    or len(types) != len(set(types))):
                self._schema_error(pointer(path, "type"), "type must name known, unique JSON types")
        if "required" in schema:
            names = schema["required"]
            if (not isinstance(names, list) or any(not isinstance(n, str) for n in names)
                    or len(names) != len(set(names))):
                self._schema_error(pointer(path, "required"), "required must contain unique strings")
        for keyword in ("minItems", "minLength"):
            if keyword in schema and (not is_type(schema[keyword], "integer") or schema[keyword] < 0):
                self._schema_error(pointer(path, keyword), keyword + " must be a nonnegative integer")
        if "minimum" in schema and not is_number(schema["minimum"]):
            self._schema_error(pointer(path, "minimum"), "minimum must be a finite number")
        if "uniqueItems" in schema and not isinstance(schema["uniqueItems"], bool):
            self._schema_error(pointer(path, "uniqueItems"), "uniqueItems must be boolean")
        if "enum" in schema:
            values = schema["enum"]
            if not isinstance(values, list) or not values:
                self._schema_error(pointer(path, "enum"), "enum must be a nonempty array")
            elif len({frozen(v) for v in values}) != len(values):
                self._schema_error(pointer(path, "enum"), "enum values must be unique")
        for keyword in ("properties", "$defs", "definitions"):
            if keyword in schema:
                children = schema[keyword]
                if not isinstance(children, dict):
                    self._schema_error(pointer(path, keyword), keyword + " must be an object")
                else:
                    for key in sorted(children):
                        self._check_schema(children[key], pointer(pointer(path, keyword), key))
        for keyword in ("items", "additionalProperties"):
            if keyword in schema:
                self._check_schema(schema[keyword], pointer(path, keyword))
        if "anyOf" in schema:
            children = schema["anyOf"]
            if not isinstance(children, list) or not children:
                self._schema_error(pointer(path, "anyOf"), "anyOf must be a nonempty schema array")
            else:
                for index, child in enumerate(children):
                    self._check_schema(child, pointer(pointer(path, "anyOf"), index))
        if "$ref" in schema:
            try:
                target, target_path = self._resolve(schema["$ref"])
            except ValueError as exc:
                self._schema_error(pointer(path, "$ref"), str(exc), "invalid_ref")
            else:
                self._check_schema(target, target_path)

    def validate(self, instance: Any) -> list[dict]:
        if self.schema_errors:
            return list(self.schema_errors)
        return ordered(self._validate(instance, self.schema, "", "", set()))

    def _validate(self, value: Any, schema: Any, path: str, schema_path: str,
                  active: set[tuple[int, int]]) -> list[dict]:
        if schema is True:
            return []
        if schema is False:
            return [error(path, "false_schema", "Value is forbidden by this schema", schema_path)]
        pair = (id(schema), id(value))
        if pair in active:
            return [error(path, "circular_ref", "Schema reference cycles without consuming an instance", schema_path)]
        active = active | {pair}
        errors: list[dict] = []
        if "$ref" in schema:
            target, target_path = self._resolve(schema["$ref"])
            errors.extend(self._validate(value, target, path, target_path, active))
        if "type" in schema:
            types = schema["type"] if isinstance(schema["type"], list) else [schema["type"]]
            if not any(is_type(value, name) for name in types):
                errors.append(error(path, "type", "Expected type: " + " or ".join(types), pointer(schema_path, "type")))
        if "enum" in schema and frozen(value) not in {frozen(v) for v in schema["enum"]}:
            errors.append(error(path, "enum", "Value is not in the allowed enum", pointer(schema_path, "enum")))
        if "anyOf" in schema:
            branches = [self._validate(value, branch, path,
                        pointer(pointer(schema_path, "anyOf"), i), active)
                        for i, branch in enumerate(schema["anyOf"])]
            if not any(not branch_errors for branch_errors in branches):
                errors.append(error(path, "any_of", "Value does not match any anyOf branch", pointer(schema_path, "anyOf")))
        if isinstance(value, dict):
            properties = schema.get("properties", {})
            for name in sorted(schema.get("required", [])):
                if name not in value:
                    errors.append(error(pointer(path, name), "required", "Required property is missing", pointer(schema_path, "required")))
            for name in sorted(value):
                child_path = pointer(path, name)
                if name in properties:
                    errors.extend(self._validate(value[name], properties[name], child_path,
                                  pointer(pointer(schema_path, "properties"), name), active))
                elif "additionalProperties" in schema:
                    extra = schema["additionalProperties"]
                    if extra is False:
                        errors.append(error(child_path, "unexpected_property", "Property is not allowed", pointer(schema_path, "additionalProperties")))
                    elif extra is not True:
                        errors.extend(self._validate(value[name], extra, child_path,
                                      pointer(schema_path, "additionalProperties"), active))
        if isinstance(value, list):
            if "minItems" in schema and len(value) < schema["minItems"]:
                errors.append(error(path, "min_items", "Array has fewer than " + str(schema["minItems"]) + " items", pointer(schema_path, "minItems")))
            if schema.get("uniqueItems"):
                seen: dict[Any, int] = {}
                for index, item in enumerate(value):
                    key = frozen(item)
                    if key in seen:
                        errors.append(error(pointer(path, index), "unique_items", "Item duplicates index " + str(seen[key]), pointer(schema_path, "uniqueItems")))
                    else:
                        seen[key] = index
            if "items" in schema:
                for index, item in enumerate(value):
                    errors.extend(self._validate(item, schema["items"], pointer(path, index), pointer(schema_path, "items"), active))
        if isinstance(value, str) and "minLength" in schema and len(value) < schema["minLength"]:
            errors.append(error(path, "min_length", "String is shorter than " + str(schema["minLength"]), pointer(schema_path, "minLength")))
        if is_number(value) and "minimum" in schema and value < schema["minimum"]:
            errors.append(error(path, "minimum", "Number is below " + str(schema["minimum"]), pointer(schema_path, "minimum")))
        return errors


def records(document: Any, key: str) -> list:
    if isinstance(document, list):
        return document
    if isinstance(document, dict) and isinstance(document.get(key), list):
        return document[key]
    return []


def collect_ids(items: list, path: str, field: str, errors: list[dict],
                require_ids: bool = False) -> set[str]:
    found: dict[str, int] = {}
    for index, item in enumerate(items):
        item_path = pointer(pointer(path, index), field)
        identifier = item.get(field) if isinstance(item, dict) else None
        if not isinstance(identifier, str) or not identifier:
            if require_ids:
                errors.append(error(item_path, "invalid_id", "A nonempty string ID is required"))
            continue
        if identifier in found:
            errors.append(error(item_path, "duplicate_id", "ID duplicates index " + str(found[identifier]) + ": " + identifier))
        else:
            found[identifier] = index
    return set(found)


def check_reference(value: Any, known: set[str], path: str, kind: str,
                    errors: list[dict]) -> None:
    # Type and absence are handled by the brief schema; package refs have their
    # own type check because package catalogs do not have a separate schema.
    if not isinstance(value, str) or not value:
        errors.append(error(path, "invalid_reference", kind + " reference must be a nonempty string"))
    elif value not in known:
        errors.append(error(path, "unknown_reference", "Unknown " + kind + " ID: " + value))


def check_named_references(value: Any, path: str, recipe_ids: set[str] | None,
                           source_ids: set[str] | None, errors: list[dict]) -> None:
    """Only explicit ID-bearing fields are references; never interpret prose."""
    if isinstance(value, dict):
        for name in sorted(value):
            child = value[name]
            child_path = pointer(path, name)
            known = recipe_ids if name in {"recipe_id", "recipe_ids", "selected_recipes"} else (
                source_ids if name in {"source_id", "source_ids"} else None)
            if known is not None:
                if name in {"recipe_ids", "source_ids", "selected_recipes"}:
                    if not isinstance(child, list):
                        errors.append(error(child_path, "invalid_reference", name + " must be an array of IDs"))
                    else:
                        for index, identifier in enumerate(child):
                            check_reference(identifier, known, pointer(child_path, index),
                                            "recipe" if name != "source_ids" else "source", errors)
                else:
                    check_reference(child, known, child_path,
                                    "recipe" if name == "recipe_id" else "source", errors)
            else:
                check_named_references(child, child_path, recipe_ids, source_ids, errors)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            check_named_references(child, pointer(path, index), recipe_ids, source_ids, errors)


def catalog_ids(document: Any, key: str, path: str, errors: list[dict]) -> set[str]:
    if not isinstance(document, dict) or not isinstance(document.get(key), list):
        errors.append(error(pointer(path, key), "catalog_shape", "Catalog requires an object with a " + key + " array"))
        return set()
    return collect_ids(document[key], pointer(path, key), "id", errors, require_ids=True)


def validate_declared_consistency(document: dict, errors: list[dict]) -> dict:
    """Check opt-in relational declarations; never infer arbitrary prose truth."""
    flow = records(document, "screen_flow")
    state_ids = {state["state"] for state in flow
                 if isinstance(state, dict) and isinstance(state.get("state"), str)}
    all_events = {transition["event"] for state in flow if isinstance(state, dict)
                  for transition in records(state, "transitions")
                  if isinstance(transition, dict) and isinstance(transition.get("event"), str)}
    checked_states = 0
    for index, state in enumerate(flow):
        if not isinstance(state, dict) or not ({"input_mode", "action_events"} & state.keys()):
            continue
        checked_states += 1
        base = f"/screen_flow/{index}"
        mode, actions = state.get("input_mode"), state.get("action_events")
        if not isinstance(mode, str) or mode not in {"interactive", "read_only"} or not isinstance(actions, list):
            errors.append(error(base, "input_contract", "Explicit input contract requires input_mode and action_events"))
            continue
        action_ids = {value for value in actions if isinstance(value, str)}
        user_events = set()
        for offset, transition in enumerate(records(state, "transitions")):
            if not isinstance(transition, dict):
                continue
            kind = transition.get("trigger_kind")
            if not isinstance(kind, str) or kind not in {"user_input", "internal_event"}:
                errors.append(error(f"{base}/transitions/{offset}/trigger_kind", "input_contract",
                                    "Declared input contract requires explicit user_input/internal_event classification"))
            if kind == "user_input" and isinstance(transition.get("event"), str):
                user_events.add(transition["event"])
        for offset, action in enumerate(actions):
            check_reference(action, user_events, f"{base}/action_events/{offset}", "user-input event", errors)
        if action_ids != user_events:
            errors.append(error(base + "/action_events", "action_coverage",
                                "action_events must match this state's declared user_input transitions"))
        if mode == "read_only" and (actions or user_events or state.get("secondary_actions")):
            errors.append(error(base, "read_only_actions", "read_only state cannot expose user-input transitions, action_events or secondary_actions"))

    checked_gates = 0
    verification = document.get("verification")
    if isinstance(verification, dict):
        for index, gate in enumerate(records(verification, "gates")):
            if not isinstance(gate, dict):
                continue
            base = f"/verification/gates/{index}"
            if {"state_ids", "event_names", "covers_complete_flow"} & gate.keys():
                checked_gates += 1
            for name, known, kind in (("state_ids", state_ids, "state"), ("event_names", all_events, "transition event")):
                refs = gate.get(name)
                if isinstance(refs, list):
                    for offset, ref in enumerate(refs):
                        check_reference(ref, known, f"{base}/{name}/{offset}", kind, errors)
            if gate.get("covers_complete_flow") is True:
                declared_states = {value for value in records(gate, "state_ids") if isinstance(value, str)}
                if declared_states != state_ids:
                    errors.append(error(base + "/state_ids", "flow_coverage", "Complete-flow gate must cover all declared state IDs"))
                if gate.get("kind") == "input":
                    declared_events = {value for value in records(gate, "event_names") if isinstance(value, str)}
                    if declared_events != all_events:
                        errors.append(error(base + "/event_names", "flow_coverage", "Complete-flow input gate must cover all declared transition events, including separately classified internal events"))

    resolved_spacing = None
    grammar = document.get("visual_grammar")
    if isinstance(grammar, dict):
        token_records = records(grammar, "values_and_units")
        token_ids = collect_ids(token_records, "/visual_grammar/values_and_units", "name", errors)
        tokens = {record["name"]: record for record in token_records
                  if isinstance(record, dict) and isinstance(record.get("name"), str)}
        spacing = grammar.get("spacing")
        if isinstance(spacing, dict) and isinstance(spacing.get("token_refs"), dict):
            refs, strategy = spacing["token_refs"], spacing.get("strategy")
            if isinstance(strategy, str):
                template_tokens = re.findall(r"\$\{([^{}]+)\}", strategy)
                declared = {value for value in refs.values() if isinstance(value, str)}
                for slot, ref in refs.items():
                    check_reference(ref, token_ids, "/visual_grammar/spacing/token_refs/" + slot, "value token", errors)
                if set(template_tokens) != declared:
                    errors.append(error("/visual_grammar/spacing/strategy", "token_template",
                                        "Spacing template must reference every declared token and no undeclared token"))
                prose = re.sub(r"\$\{[^{}]+\}", "", strategy)
                if re.search(r"(?<![\w.])\d+(?:\.\d+)?\s*(?:CSS\s*px|px|pt|dp|em|rem|%)", prose):
                    errors.append(error("/visual_grammar/spacing/strategy", "numeric_prose_drift",
                                        "Token-referenced spacing strategy must not duplicate numeric measurements"))
                valid_values = True
                for name in declared & token_ids:
                    token = tokens[name]
                    if not is_number(token.get("value")) or not isinstance(token.get("unit"), str) or not token["unit"]:
                        valid_values = False
                        errors.append(error("/visual_grammar/spacing/token_refs", "token_value",
                                            "Referenced spacing token must declare a finite number and nonempty native unit: " + name))
                if declared <= token_ids and set(template_tokens) == declared and valid_values:
                    resolved_spacing = re.sub(r"\$\{([^{}]+)\}",
                                              lambda match: str(tokens[match[1]]["value"]) + " " + tokens[match[1]]["unit"], strategy)
    return {"input_contract_states": checked_states, "referenced_gates": checked_gates,
            "resolved_spacing_strategy": resolved_spacing, "declarations_only": True}


def validate_brief(document: Any, schema: Any, catalog: Any = None,
                   sources: Any = None) -> dict:
    errors = SchemaValidator(schema).validate(document)
    consistency = None
    if isinstance(document, dict):
        consistency = validate_declared_consistency(document, errors)
        flow = records(document, "screen_flow")
        state_ids = collect_ids(flow, "/screen_flow", "state", errors)
        task = document.get("task")
        if isinstance(task, dict) and isinstance(task.get("current_state"), str):
            check_reference(task["current_state"], state_ids,
                            "/task/current_state", "state", errors)
        for index, state in enumerate(flow):
            if not isinstance(state, dict):
                continue
            transitions = state.get("transitions", [])
            if isinstance(transitions, list):
                for offset, transition in enumerate(transitions):
                    if isinstance(transition, dict) and isinstance(transition.get("to"), str):
                        check_reference(transition["to"], state_ids,
                                        f"/screen_flow/{index}/transitions/{offset}/to", "state", errors)
        layers = records(document, "layer_owners")
        collect_ids(layers, "/layer_owners", "layer", errors)
        for index, layer in enumerate(layers):
            if isinstance(layer, dict) and isinstance(layer.get("states"), list):
                for offset, state in enumerate(layer["states"]):
                    if isinstance(state, str):
                        check_reference(state, state_ids, f"/layer_owners/{index}/states/{offset}", "state", errors)
        evidence_ids = collect_ids(records(document, "source_evidence"), "/source_evidence", "id", errors)
        adapter = document.get("platform_adapter")
        if isinstance(adapter, dict):
            collect_ids(records(adapter, "viewports"), "/platform_adapter/viewports", "id", errors)
        verification = document.get("verification")
        if isinstance(verification, dict):
            gates = records(verification, "gates")
            collect_ids(gates, "/verification/gates", "id", errors)
            for index, gate in enumerate(gates):
                if isinstance(gate, dict) and isinstance(gate.get("evidence_ids"), list):
                    for offset, identifier in enumerate(gate["evidence_ids"]):
                        if isinstance(identifier, str):
                            check_reference(identifier, evidence_ids,
                                            f"/verification/gates/{index}/evidence_ids/{offset}",
                                            "evidence", errors)
        recipe_ids = catalog_ids(catalog, "recipes", "/catalog", errors) if catalog is not None else None
        source_ids = catalog_ids(sources, "sources", "/sources", errors) if sources is not None else None
        check_named_references(document, "", recipe_ids, source_ids, errors)
        if document.get("readiness") == "implementation_ready":
            task = document.get("task")
            if isinstance(task, dict) and task.get("unknowns"):
                errors.append(error("/task/unknowns", "readiness_unresolved",
                                    "implementation_ready requires no unresolved task unknowns"))
            for index, state in enumerate(flow):
                if isinstance(state, dict) and state.get("unknowns"):
                    errors.append(error(f"/screen_flow/{index}/unknowns", "readiness_unresolved",
                                        "implementation_ready requires no unresolved screen-flow unknowns"))
            grammar = document.get("visual_grammar")
            if isinstance(grammar, dict) and grammar.get("unresolved_values"):
                errors.append(error("/visual_grammar/unresolved_values", "readiness_unresolved",
                                    "implementation_ready requires no unresolved visual values"))
            if isinstance(adapter, dict) and adapter.get("coordinate_mapping_status") != "verified":
                errors.append(error("/platform_adapter/coordinate_mapping_status", "readiness_unresolved",
                                    "implementation_ready requires verified coordinate mapping"))
    return report("brief", errors,
                  reference_checks={"recipes": catalog is not None, "sources": sources is not None},
                  declared_consistency=consistency)


def _object_pairs(pairs: list[tuple[str, Any]]) -> dict:
    result: dict[str, Any] = {}
    for name, value in pairs:
        if name in result:
            raise ValueError("Duplicate JSON object key: " + name)
        result[name] = value
    return result


def _constant(value: str) -> None:
    raise ValueError("Non-finite JSON number is disallowed: " + value)


def _float(value: str) -> float:
    number = float(value)
    if not math.isfinite(number):
        raise ValueError("Non-finite JSON number is disallowed: " + value)
    return number


def load_json(path: Path, errors: list[dict], location: str = "") -> Any:
    try:
        with path.open("r", encoding="utf-8") as stream:
            return json.load(stream, object_pairs_hook=_object_pairs,
                             parse_constant=_constant, parse_float=_float)
    except FileNotFoundError:
        errors.append(error(location, "missing_file", "Required JSON file is missing: " + path.name))
    except (OSError, UnicodeError) as exc:
        errors.append(error(location, "file_read", "Cannot read JSON: " + str(exc)))
    except (ValueError, RecursionError) as exc:
        errors.append(error(location, "json_parse", "Invalid JSON: " + str(exc)))
    return None


def validate_package(root: Path | str = ".") -> dict:
    root = Path(root).resolve()
    errors: list[dict] = []
    required = {"brief.schema.json", "recipe-catalog.json", "sources.json", "display.json"}
    paths = {path.relative_to(root).as_posix(): path for path in root.rglob("*.json") if path.is_file()}
    for name in required:
        paths.setdefault(name, root / name)
    documents: dict[str, Any] = {}
    for name in sorted(paths):
        path = paths[name]
        if not path.resolve().is_relative_to(root):
            errors.append(error(pointer("", name), "external_file", "Package JSON may not resolve outside its root"))
            continue
        documents[name] = load_json(path, errors, pointer("", name))
    schema = documents.get("brief.schema.json")
    bad_files = {issue["path"] for issue in errors}
    if "/brief.schema.json" not in bad_files:
        for issue in SchemaValidator(schema).schema_errors:
            errors.append({**issue, "path": "/brief.schema.json" + issue["path"]})
    recipes = documents.get("recipe-catalog.json")
    sources = documents.get("sources.json")
    recipe_ids = catalog_ids(recipes, "recipes", "/recipe-catalog.json", errors) if "/recipe-catalog.json" not in bad_files else set()
    source_ids = catalog_ids(sources, "sources", "/sources.json", errors) if "/sources.json" not in bad_files else set()
    if recipes is not None:
        check_named_references(recipes, "/recipe-catalog.json", recipe_ids, source_ids, errors)
    if sources is not None:
        check_named_references(sources, "/sources.json", recipe_ids, source_ids, errors)
    display = documents.get("display.json")
    if "/display.json" not in bad_files:
        if not isinstance(display, dict):
            errors.append(error("/display.json", "display_shape", "Display must be an object"))
        else:
            for key in ("stages", "recipes", "applications"):
                if key in display:
                    if not isinstance(display[key], list):
                        errors.append(error(pointer("/display.json", key), "display_shape", key + " must be an array"))
                    else:
                        collect_ids(display[key], pointer("/display.json", key), "id", errors, require_ids=True)
                        if key == "recipes":
                            for index, recipe in enumerate(display[key]):
                                if isinstance(recipe, dict) and isinstance(recipe.get("id"), str):
                                    check_reference(recipe["id"], recipe_ids,
                                                    f"/display.json/recipes/{index}/id", "recipe", errors)
            check_named_references(display, "/display.json", recipe_ids, source_ids, errors)
    return report("package", errors, json_files_checked=len(documents))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    modes = parser.add_subparsers(dest="mode", required=True)
    brief = modes.add_parser("brief", help="Check a brief's structure and available local references")
    brief.add_argument("input", type=Path)
    brief.add_argument("--schema", type=Path, default=Path(__file__).resolve().with_name("brief.schema.json"))
    brief.add_argument("--catalog", type=Path, default=None)
    brief.add_argument("--sources", type=Path, default=None)
    package = modes.add_parser("package", help="Check package JSON, schema vocabulary, IDs, and references")
    package.add_argument("--root", type=Path, default=Path("."))
    args = parser.parse_args(argv)
    try:
        if args.mode == "package":
            result = validate_package(args.root)
        else:
            errors: list[dict] = []
            instance = load_json(args.input, errors, "/input")
            schema = load_json(args.schema, errors, "/schema")
            # Defaults are optional adjacent catalogs. Explicit missing files are errors.
            catalog_path = args.catalog or args.schema.with_name("recipe-catalog.json")
            sources_path = args.sources or args.schema.with_name("sources.json")
            catalog_available = args.catalog is not None or catalog_path.exists()
            sources_available = args.sources is not None or sources_path.exists()
            catalog = load_json(catalog_path, errors, "/catalog") if catalog_available else None
            sources = load_json(sources_path, errors, "/sources") if sources_available else None
            if catalog_available and catalog is None and not any(e["path"] == "/catalog" for e in errors):
                errors.append(error("/catalog/recipes", "catalog_shape", "Catalog requires an object with a recipes array"))
            if sources_available and sources is None and not any(e["path"] == "/sources" for e in errors):
                errors.append(error("/sources/sources", "catalog_shape", "Catalog requires an object with a sources array"))
            if errors:
                result = report("brief", errors)
            else:
                result = validate_brief(instance, schema, catalog, sources)
    except RecursionError:
        result = report(args.mode, [error("", "validation_limit", "JSON or schema exceeds the supported recursion depth")])
    print(json.dumps(result, indent=2, sort_keys=True, ensure_ascii=False, allow_nan=False))
    return 0 if result["valid"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
