#!/usr/bin/env python3
"""Offline request routing and evidence-contract checks, never product mutation.

Passing checks do not inspect pixels, exercise a UI, or grant permission.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]
MODES = {'diagnose', 'propose', 'implement'}
STATUSES = {'pass', 'fail', 'not_run', 'blocked'}
KINDS = {'observed_visible', 'observed_behavior', 'hypothesis', 'proposal'}
CANONICAL_POLICY = 'python-json-compact-sorted-utf8-v1'
INVARIANTS = ('task', 'fixture_id', 'data', 'initial_state', 'scenario_id',
              'state_id', 'viewport_css', 'dpr', 'zoom_percent', 'locale',
              'input_mode', 'camera', 'visual_asset_hashes', 'required_information')


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f'duplicate JSON object key: {key}')
        result[key] = value
    return result


def reject_constant(value):
    raise ValueError(f'non-finite JSON constant: {value}')


def validate_json_value(value):
    """Reject values outside the published canonicalization domain."""
    if isinstance(value, str):
        if any(0xD800 <= ord(character) <= 0xDFFF for character in value):
            raise ValueError('unpaired Unicode surrogate is not supported')
    elif type(value) is float and not math.isfinite(value):
        raise ValueError('non-finite JSON number is not supported')
    elif isinstance(value, dict):
        for key, item in value.items():
            if not isinstance(key, str):
                raise ValueError('JSON object keys must be strings')
            validate_json_value(key)
            validate_json_value(item)
    elif isinstance(value, list):
        for item in value:
            validate_json_value(item)
    elif value is not None and type(value) not in (bool, int, float):
        raise ValueError(f'unsupported JSON value type: {type(value).__name__}')


def read_json(path):
    value = json.loads(Path(path).read_text(encoding='utf-8'),
                       object_pairs_hook=unique_object, parse_constant=reject_constant)
    validate_json_value(value)
    return value


def digest(value):
    validate_json_value(value)
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':'), allow_nan=False).encode('utf-8')).hexdigest()


def hash_json(path):
    """Different scopes: original bytes versus the specified parsed encoding."""
    return {'status': 'hashed', 'raw_file_sha256': hashlib.sha256(Path(path).read_bytes()).hexdigest(),
            'canonical_json_sha256': digest(read_json(path)),
            'canonical_policy': CANONICAL_POLICY, 'canonical_scope': 'entire parsed JSON value',
            'semantic_comparison': 'not_performed',
            'note': 'Different raw and canonical hashes are not evidence of changed content.'}


def semantic_equal(a, b):
    """Compare JSON values without treating booleans as numbers or 1.0 as new data."""
    if type(a) in (int, float) and type(b) in (int, float):
        return a == b
    if type(a) is not type(b):
        return False
    if isinstance(a, dict):
        return a.keys() == b.keys() and all(semantic_equal(a[key], b[key]) for key in a)
    if isinstance(a, list):
        return len(a) == len(b) and all(semantic_equal(x, y) for x, y in zip(a, b))
    return a == b


def route(request):
    config = read_json(SKILL / 'references/routing.json')
    purpose = request.get('purpose')
    if purpose == 'not_interface':
        return {'status': 'not_applicable', 'selected_manual_ids': [],
                'selected_overlay_ids': [], 'loaded_references': []}
    if purpose is not None and not isinstance(purpose, str):
        return {'status': 'invalid_input', 'errors': ['purpose must be a string'], 'loaded_references': []}
    missing = [k for k in ('purpose', 'task', 'platform', 'mode')
               if not isinstance(request.get(k), str) or not request[k].strip()
               or (k in ('purpose', 'task') and request[k] == 'unknown')]
    if missing:
        return {'status': 'needs_input', 'missing': missing, 'loaded_references': []}
    if request['mode'] not in MODES:
        return {'status': 'invalid_input', 'errors': ['invalid mode'], 'loaded_references': []}
    if request['platform'] not in config['platforms']:
        return {'status': 'invalid_input', 'errors': ['invalid platform'], 'loaded_references': []}
    branch = next((b for b in config['branches'] if b['purpose'] == purpose), None)
    if branch is None:
        return {'status': 'unsupported', 'purpose': purpose, 'loaded_references': []}
    context = request.get('context', {})
    if not isinstance(context, dict):
        return {'status': 'invalid_input', 'errors': ['context must be an object'], 'loaded_references': []}
    inputs = context.get('input_modes', [])
    if not isinstance(inputs, list) or any(not isinstance(x, str) for x in inputs):
        return {'status': 'invalid_input', 'errors': ['input_modes must be a string array'], 'loaded_references': []}
    overlays = []
    if request['platform'] == 'web':
        overlays.append('OV:web')
    if 'touch' in inputs:
        overlays.append('OV:touch')
    if 'controller' in inputs:
        overlays.append('OV:controller')
    if 'keyboard' in inputs:
        overlays.append('OV:keyboard')
    if context.get('locale') not in (None, 'unknown', 'en', 'en-US') or context.get('long_strings') is True:
        overlays.append('OV:localization')
    reference = request.get('interface_ref', {})
    if not isinstance(reference, dict):
        return {'status': 'invalid_input', 'errors': ['interface_ref must be an object'], 'loaded_references': []}
    kind = reference.get('kind', 'none')
    if kind not in {'none', 'source', 'screenshot', 'live-interface'}:
        return {'status': 'invalid_input', 'errors': ['invalid interface_ref kind'], 'loaded_references': []}
    has_view = kind in {'screenshot', 'live-interface'} and bool(reference.get('location'))
    status = 'routed' if has_view else 'proposal_only'
    return {'status': status, 'purpose': purpose, 'mode': request['mode'],
            'selected_manual_ids': branch['manual_ids'],
            'selected_overlay_ids': overlays,
            'loaded_references': [branch['reference'], 'references/evidence-contract.json'],
            'candidate_source_ids': branch['source_ids'],
            'view_observation': 'required_not_proven_by_router' if has_view else 'unavailable',
            'implementation_authorization': 'must_be_checked_by_host',
            'unknowns': [k for k in ('viewport_css', 'dpr', 'zoom_percent', 'locale', 'art_direction')
                         if context.get(k) in (None, 'unknown')]}


def unresolved(value, nullable_paths=frozenset(), path=()):
    """Only exact schema-declared paths can use null as known absence."""
    if value is None:
        return path not in nullable_paths
    if value == "unknown":
        return True
    if isinstance(value, dict):
        return any(unresolved(v, nullable_paths, path + (key,))
                   for key, v in value.items())
    if isinstance(value, list):
        return any(unresolved(v, nullable_paths, path + (index,))
                   for index, v in enumerate(value))
    return False


def compare(pair):
    before, after = pair.get('before', {}), pair.get('after', {})
    if not isinstance(before, dict) or not isinstance(after, dict):
        return {'metadata_result': 'fail', 'errors': ['before/after must be objects'],
                'visual_effectiveness': 'not_run', 'behavioral_result': 'not_run'}
    schema = read_json(SKILL / 'references/evidence-contract.json')['comparison_value_schema']
    nullable_paths = frozenset(tuple(path) for path in schema['nullable_paths'])
    control_state_fields = schema['control_state_required_together']

    def field_unresolved(field, value):
        if field == 'initial_state' and isinstance(value, dict):
            if not value:
                return True
            if any(key in value for key in control_state_fields) and any(
                    key not in value for key in control_state_fields):
                return True
        return unresolved(value, nullable_paths, (field,))

    unknowns, mismatches, invalid = [], [], []
    for field in INVARIANTS:
        a, b = before.get(field), after.get(field)
        if field_unresolved(field, a) or field_unresolved(field, b):
            unknowns.append(field)
        elif not semantic_equal(a, b):
            mismatches.append(field)
    for label, side in [('before', before), ('after', after)]:
        for field in ('data', 'initial_state', 'visual_asset_hashes'):
            if field in side and not field_unresolved(field, side[field]) and not isinstance(side[field], dict):
                invalid.append(f'{label}.{field}: object required')
        state = side.get('initial_state')
        if isinstance(state, dict):
            for key in control_state_fields:
                if key in state and not unresolved(state[key], nullable_paths, ('initial_state', key)):
                    value = state[key]
                    if value is not None and (not isinstance(value, str) or not value.strip()):
                        invalid.append(f'{label}.initial_state.{key}: null or nonempty string ID required')
        viewport = side.get('viewport_css')
        if not unresolved(viewport) and (not isinstance(viewport, list) or len(viewport) != 2 or any(type(v) not in (int, float) or v <= 0 for v in viewport)):
            invalid.append(f'{label}.viewport_css: two positive numeric dimensions required')
        for field in ('dpr', 'zoom_percent'):
            value = side.get(field)
            if not unresolved(value) and (type(value) not in (int, float) or value <= 0):
                invalid.append(f'{label}.{field}: positive number required')
        items = side.get('required_information')
        if not unresolved(items) and (not isinstance(items, list) or not items or any(not isinstance(x, str) or not x for x in items)):
            invalid.append(f'{label}.required_information: nonempty string array required')
    payload_before = {k: before.get(k) for k in INVARIANTS}
    payload_after = {k: after.get(k) for k in INVARIANTS}
    canonical_hashes = {}
    for label, payload in [('before', payload_before), ('after', payload_after)]:
        try:
            canonical_hashes[label] = digest(payload)
        except ValueError as exc:
            canonical_hashes[label] = None
            invalid.append(f'{label}.canonical_payload: {exc}')
    metadata_result = 'fail' if mismatches or invalid else 'inconclusive' if unknowns else 'pass'
    captures = []
    for label, side in [('before', before), ('after', after)]:
        ref = side.get('capture_ref')
        captures.append({'side': label, 'capture_ref': ref,
                         'status': 'declared_not_inspected' if ref else 'not_run'})
    return {'metadata_result': metadata_result, 'mismatches': mismatches, 'invalid_fields': invalid,
            'unknowns': unknowns,
            'comparison_value_policy': schema['policy_id'],
            'declared_known_absence_paths': {
                label: ['.'.join(path) for path in sorted(nullable_paths)
                        if isinstance(side.get('initial_state'), dict)
                        and path[-1] in side['initial_state']
                        and side['initial_state'][path[-1]] is None]
                for label, side in [('before', before), ('after', after)]},
            'before_comparison_canonical_sha256': canonical_hashes['before'],
            'after_comparison_canonical_sha256': canonical_hashes['after'],
            'comparison_hash_policy': CANONICAL_POLICY,
            'comparison_hash_scope': list(INVARIANTS),
            'before_fixture_sha256': canonical_hashes['before'],
            'after_fixture_sha256': canonical_hashes['after'],
            'legacy_hash_fields': 'Aliases for the invariant payload hash, never original fixture bytes',
            'declared_raw_file_sha256': {label: side.get('raw_file_sha256', side.get('raw_bytes_sha256'))
                                         for label, side in [('before', before), ('after', after)]},
            'raw_file_hash_validation': 'not_assessed',
            'representation_only_hash_difference': metadata_result == 'pass' and canonical_hashes['before'] != canonical_hashes['after'],
            'captures': captures,
            'required_information_visibility': 'not_run',
            'visual_effectiveness': 'not_run', 'behavioral_result': 'not_run',
            'user_review': 'pending',
            'note': 'Parsed invariant values determine metadata outcome. Hash representation differences alone do not prove content changes. Equal metadata is not screenshot, interaction, or visual validation.'}


def check_report(report):
    contract = read_json(SKILL / 'references/evidence-contract.json')
    errors = [f'missing report field: {key}' for key in contract['required_report_fields'] if key not in report]
    evidence_list = report.get('evidence', [])
    if not isinstance(evidence_list, list):
        evidence_list = []
        errors.append('evidence must be an array')
    evidence = {e.get('id'): e for e in evidence_list if isinstance(e, dict)}
    if None in evidence or len(evidence) != len(evidence_list):
        errors.append('evidence IDs must exist and be unique')
    for i, item in enumerate(evidence_list):
        if isinstance(item, dict) and item.get('kind') not in contract['evidence_kinds']:
            supplied = item.get('kind')
            mapped = contract['evidence_kind_mapping'].get(supplied) if isinstance(supplied, str) else None
            hint = f'; use {mapped}' if mapped else ''
            errors.append(f'evidence {i}: invalid kind{hint}; see evidence-contract.json evidence_kinds')
    known_source_ids = {s['id'] for s in read_json(SKILL / 'references/sources.json')['sources']}
    for source in report.get('additional_sources', []):
        if isinstance(source, dict) and isinstance(source.get('id'), str) and ':' in source['id'] and source.get('url', '').startswith('https://'):
            known_source_ids.add(source['id'])
        else:
            errors.append('additional_sources require a namespaced ID and HTTPS URL')
    findings = report.get('findings', [])
    if not isinstance(findings, list):
        findings = []
        errors.append('findings must be an array')
    for i, finding in enumerate(findings):
        if not isinstance(finding, dict):
            errors.append(f'finding {i} must be an object')
            continue
        if finding.get('kind') not in KINDS:
            errors.append(f'finding {i}: invalid kind')
        for key in contract['required_finding_fields']:
            if key not in finding:
                errors.append(f'finding {i}: missing {key}')
        if not finding.get('locator'):
            errors.append(f'finding {i}: exact locator required')
        refs = finding.get('evidence_ids', [])
        if not isinstance(refs, list):
            errors.append(f'finding {i}: evidence_ids must be an array')
            refs = []
        if any(ref not in evidence for ref in refs):
            errors.append(f'finding {i}: dangling evidence ID')
        if finding.get('kind') in {'observed_visible', 'observed_behavior'}:
            if not refs:
                errors.append(f'finding {i}: observation requires evidence')
            for ref in refs:
                e = evidence.get(ref, {})
                if not e.get('artifact_ref') or e.get('inspection_status') != 'inspected':
                    errors.append(f'finding {i}: observation evidence must be inspected and locatable')
                if finding.get('kind') == 'observed_visible' and e.get('kind') not in contract['finding_evidence_kinds']['observed_visible']:
                    errors.append(f'finding {i}: visible observation needs visual evidence, not source-only inference')
                if finding.get('kind') == 'observed_behavior' and e.get('kind') not in contract['finding_evidence_kinds']['observed_behavior']:
                    errors.append(f'finding {i}: behavior observation needs an interaction trace')
                if e.get('kind') == 'synthetic_visual' and finding.get('observed_scope') != 'synthetic_fixture_only':
                    errors.append(f'finding {i}: synthetic visual cannot prove live product behavior')
        source_refs = finding.get('source_ids', [])
        if not isinstance(source_refs, list) or any(ref not in known_source_ids for ref in source_refs):
            errors.append(f'finding {i}: source IDs must resolve in packaged or explicit additional sources')
        command = finding.get('correction_command')
        if not isinstance(command, dict):
            errors.append(f'finding {i}: correction_command must be an object')
        else:
            for key in contract['required_command_fields']:
                if not command.get(key):
                    errors.append(f'finding {i}: command requires {key}')
    tests = report.get('test_results', [])
    if not isinstance(tests, list):
        tests = []
        errors.append('test_results must be an array')
    for i, test in enumerate(tests):
        if not isinstance(test, dict):
            errors.append(f'test {i} must be an object')
            continue
        if test.get('status') not in STATUSES:
            errors.append(f'test {i}: invalid status')
        if test.get('status') in {'pass', 'fail'}:
            for key in ('test_kind', 'input', 'expected_result', 'environment', 'revision', 'actual_result', 'evidence_ids'):
                if not test.get(key):
                    errors.append(f'test {i}: executed result requires {key}')
            test_refs = test.get('evidence_ids', [])
            if not isinstance(test_refs, list):
                errors.append(f'test {i}: evidence_ids must be an array')
                test_refs = []
            if any(ref not in evidence for ref in test_refs):
                errors.append(f'test {i}: dangling evidence ID')
            for ref in test_refs:
                e = evidence.get(ref, {})
                if not e.get('artifact_ref') or e.get('inspection_status') != 'inspected':
                    errors.append(f'test {i}: executed result needs inspected, locatable evidence')
                required_kind = contract['test_evidence_kinds'].get(test.get('test_kind'))
                if required_kind is None or e.get('kind') not in required_kind:
                    errors.append(f'test {i}: evidence kind must match test kind')
    return {'contract_result': 'fail' if errors else 'pass', 'errors': errors,
            'visual_validation': 'not_assessed', 'behavioral_validation': 'not_assessed',
            'authorization': 'not_assessed', 'note': 'Field integrity is not proof that declared observations occurred.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['route', 'compare', 'check-report', 'hash-json'])
    parser.add_argument('--input', required=True, type=Path)
    args = parser.parse_args()
    try:
        if args.command == 'hash-json':
            print(json.dumps(hash_json(args.input), ensure_ascii=False, indent=2))
            return 0
        value = read_json(args.input)
    except (OSError, UnicodeError, ValueError) as exc:
        print(json.dumps({'status': 'invalid_input', 'errors': [str(exc)]}, ensure_ascii=False, indent=2))
        return 1
    if not isinstance(value, dict):
        parser.error('input must be a JSON object')
    fn = {'route': route, 'compare': compare, 'check-report': check_report}[args.command]
    result = fn(value)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    failed = result.get('contract_result') == 'fail' or result.get('metadata_result') == 'fail' or result.get('status') == 'invalid_input'
    return 1 if failed else 0


if __name__ == '__main__':
    raise SystemExit(main())
