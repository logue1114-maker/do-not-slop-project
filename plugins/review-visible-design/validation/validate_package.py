#!/usr/bin/env python3
"""Public-copy offline validator. No network, model, browser, install or mutation.

This independently authored validator exercises every included synthetic fixture
and verifies the public package declarations. It does not replace host or user tests.
"""
import argparse
import ast
import hashlib
import importlib.util
import json
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

sys.dont_write_bytecode = True
RESULT_PATH = 'validation/results.json'
GATES = ('natural_language_activation_and_output', 'browser_and_input_regressions',
         'same_content_rendered_before_after', 'visual_effectiveness', 'host_loading',
         'full_remote_agent_plugins_json_schema', 'source_claim_currentness', 'user_review')


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def validate(root):
    checks, fixtures = [], []
    def record(name, condition, detail=None):
        checks.append({'name': name, 'passed': bool(condition), 'detail': detail})
    paths = sorted(p for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts)
    record('portable_regular_files', all(not p.is_symlink() and p.resolve().is_relative_to(root.resolve()) for p in root.rglob('*')))
    parsed = {}
    for path in paths:
        rel = path.relative_to(root).as_posix()
        if path.suffix == '.json':
            try:
                parsed[rel] = read(path)
                record('json:' + rel, True)
            except (ValueError, UnicodeError) as error:
                record('json:' + rel, False, str(error))
        if path.suffix == '.py':
            try:
                ast.parse(path.read_text())
                record('python:' + rel, True)
            except SyntaxError as error:
                record('python:' + rel, False, str(error))
    manifest = parsed['plugin.json']
    record('documented_minimal_manifest', set(manifest) == {'$schema', 'name', 'version', 'description'}
           and manifest['$schema'] == 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json')
    record('provisional_name_and_draft_version', manifest['name'] == 'anti-ai-slop-draft'
           and manifest['version'] == '0.1.0-draft.3'
           and bool(re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', manifest['name'])))
    record('manifest_description', isinstance(manifest['description'], str) and 0 < len(manifest['description']) <= 1024)
    skill = root / 'skills/review-visible-design'
    source = (skill / 'SKILL.md').read_text()
    match = re.match(r'^---\n(.*?)\n---\n(.+)', source, re.S)
    header = {} if not match else dict(line.split(':', 1) for line in match[1].splitlines())
    record('one_complete_product_skill', len(list((root / 'skills').glob('*/SKILL.md'))) == 1
           and set(header) == {'name', 'description'} and header.get('name', '').strip() == skill.name
           and 0 < len(header.get('description', '').strip()) <= 1024
           and bool(match and match[2].strip()) and not any(x in source for x in ('[TODO', '[TBD', 'TODO:')))
    metadata = (skill / 'agents/openai.yaml').read_text().splitlines()
    ui = {key: json.loads(value.strip()) for line in metadata[1:] for key, value in [line.strip().split(':', 1)]}
    record('bounded_ui_metadata', metadata[0] == 'interface:' and set(ui) == {'display_name', 'short_description', 'default_prompt'}
           and 25 <= len(ui['short_description']) <= 64 and '$review-visible-design' in ui['default_prompt'])
    for link in re.findall(r'\[[^\]]*\]\(([^)]+)\)', source):
        if '://' not in link:
            target = (skill / link.split('#', 1)[0]).resolve()
            record('skill_link:' + link, target.is_file() and target.is_relative_to(skill.resolve()))
    sources = parsed['skills/review-visible-design/references/sources.json']['sources']
    ids = {s['id'] for s in sources}
    record('unique_namespaced_sources', len(ids) == len(sources) and all(':' in x for x in ids))
    record('source_links_no_credentials', all(s['url'].startswith('https://') and '@' not in s['url'].split('/')[2] for s in sources))
    record('third_party_rights_remain_unknown', all(s['rights']['status'] == 'unknown'
           and s['rights']['license'] is None and s['rights']['third_party_bytes_included'] is False for s in sources))
    routing = parsed['skills/review-visible-design/references/routing.json']
    branches = routing['branches']
    refs = [b['reference'] for b in branches]
    policy = routing['reference_loading_policy']
    record('seven_isolated_routes', len(branches) == len({b['purpose'] for b in branches}) == len(set(refs)) == 7
           and 'game.action_controls' in {b['purpose'] for b in branches}
           and all('#' not in r and r not in {'references/game-corrections.md', 'references/web-corrections.md'} for r in refs))
    record('section_first_bounded_loading', policy['branch_references_are_isolated'] is True
           and policy['load_sibling_recipes'] is False and policy['unsupported_loads_domain_recipe'] is False)
    for branch in branches:
        record('route:' + branch['purpose'], (skill / branch['reference']).is_file() and set(branch['source_ids']) <= ids)
    for path in (skill / 'references').glob('*.md'):
        cited = set(re.findall(r'\b(?:AS:S\d+|GCTRL2:S\d+|WCV2:S\d+|OA:[A-Z]+)\b', path.read_text()))
        record('source_trace:' + path.name, cited <= ids, sorted(cited - ids))
    record('no_bundled_assets_or_install_configuration', all(p.suffix in {'.json', '.md', '.yaml', '.py'} for p in paths)
           and not any((root / p).exists() for p in ('.agents', '.codex', '.codex-plugin', 'mcp.json', '.mcp.json', 'hooks', 'LICENSE')))
    record('no_machine_paths_in_runtime', all('/workspace/' not in p.read_text() and '/home/agent/' not in p.read_text()
           for p in [skill / 'SKILL.md', *list((skill / 'references').iterdir())] if p.is_file()))
    status = parsed['DRAFT_STATUS.json']
    record('draft_uninstalled_unadopted', status['status'] == 'DRAFT_NOT_ADOPTED_NOT_INSTALLED' and status['version'] == manifest['version'])
    record('unrun_gates_preserved', set(status['gates']) == set(GATES) and all(status['gates'][gate] == 'not_run' for gate in GATES))
    provenance = parsed['PROVENANCE.json']
    actual_paths = {p.relative_to(root).as_posix() for p in paths} - {RESULT_PATH}
    declared = {entry['path'] for entry in provenance['package_inventory']}
    record('exact_public_inventory', actual_paths == declared and len(declared) == len(provenance['package_inventory']),
           {'missing': sorted(actual_paths - declared), 'extra': sorted(declared - actual_paths)})
    record('bounded_public_authority_pending_license', provenance['public_redistribution'] == 'authorized_source_release_only'
           and provenance['license_choice'] == 'pending_user_decision' and provenance['third_party_rights'] == 'unknown_link_only')
    for rel, expected in provenance['preserved_input_sha256'].items():
        record('unchanged_input:' + rel, (root / rel).is_file() and hashlib.sha256((root / rel).read_bytes()).hexdigest() == expected)
    spec = importlib.util.spec_from_file_location('public_review_contract', skill / 'scripts/review_contract.py')
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    contract = parsed['skills/review-visible-design/references/evidence-contract.json']
    schema = contract['comparison_value_schema']
    record('canonical_and_invariant_contract', contract['hash_policies']['canonical_json']['policy_id'] == helper.CANONICAL_POLICY
           and contract['comparison_invariants'] == list(helper.INVARIANTS))
    record('exact_known_null_schema', schema['policy_id'] == 'required-metadata-known-empty-control-state-v1'
           and schema['nullable_paths'] == [['initial_state', 'selectedId'], ['initial_state', 'focusId'], ['initial_state', 'pressedId']]
           and schema['control_state_required_together'] == ['selectedId', 'focusId', 'pressedId']
           and all(x in schema for x in ('initial_state_policy', 'required_metadata_policy', 'evidence_policy')))
    record('evidence_kind_mapping', set(contract['test_evidence_kinds']) == set(contract['test_kinds'])
           and all(set(v) <= set(contract['evidence_kinds']) for v in contract['test_evidence_kinds'].values())
           and contract['test_evidence_kinds']['structural'] == ['source_code', 'validation_log'])
    jobs = [('request_cases.json', helper.route, 'status'), ('comparison_cases.json', helper.compare, 'metadata_result'),
            ('known_null_state_cases.json', helper.compare, 'metadata_result'), ('report_cases.json', helper.check_report, 'contract_result')]
    for filename, function, key in jobs:
        for case in parsed['tests/' + filename]['cases']:
            actual = function(case.get('normalized_input', case.get('input')))
            errors = []
            def expect(condition, label):
                if not condition:
                    errors.append(label)
            expect(actual[key] == case['expected_' + key], key)
            for field, output in [('manual_ids', 'selected_manual_ids'), ('overlay_ids', 'selected_overlay_ids'),
                                  ('loaded_references', 'loaded_references'), ('unknowns', 'unknowns'), ('mismatches', 'mismatches'),
                                  ('declared_known_absence_paths', 'declared_known_absence_paths'),
                                  ('visual_effectiveness', 'visual_effectiveness'), ('representation_only_hash_difference', 'representation_only_hash_difference')]:
                if 'expected_' + field in case:
                    expect(actual.get(output) == case['expected_' + field], field)
            if key == 'metadata_result':
                expect(all(actual[field] == 'not_run' for field in ('visual_effectiveness', 'behavioral_result', 'required_information_visibility'))
                       and actual['user_review'] == 'pending', 'evidence boundaries')
                expect(actual['before_fixture_sha256'] == actual['before_comparison_canonical_sha256']
                       and actual['after_fixture_sha256'] == actual['after_comparison_canonical_sha256'], 'canonical aliases')
                expect(actual['comparison_value_policy'] == schema['policy_id'], 'known-null policy')
                if 'expected_original_draft1_payload_hash' in case:
                    expect(actual['before_comparison_canonical_sha256'] == actual['after_comparison_canonical_sha256']
                           == case['expected_original_draft1_payload_hash'], 'preserved canonical hash')
                if 'expected_canonical_hashes_equal' in case:
                    expect((actual['before_comparison_canonical_sha256'] == actual['after_comparison_canonical_sha256'])
                           == case['expected_canonical_hashes_equal'], 'hash equivalence')
                if 'expected_invalid_field_contains' in case:
                    expect(any(case['expected_invalid_field_contains'] in f for f in actual['invalid_fields']), 'invalid field')
            if 'expected_error_contains' in case:
                expect(any(case['expected_error_contains'] in f for f in actual['errors']), 'report error')
            fixtures.append({'case_id': case['case_id'], 'family': filename, 'passed': not errors, 'failures': errors})
    for case in parsed['tests/hash_cases.json']['cases']:
        actual = helper.hash_json(root / 'tests' / case['input_file'])
        passed = actual['status'] == case['expected_status'] and all(actual[k] == case[k] for k in ('raw_file_sha256', 'canonical_json_sha256'))
        fixtures.append({'case_id': case['case_id'], 'family': 'actual_hash', 'passed': passed, 'actual': actual})
    raw = [helper.hash_json(root / 'tests' / name) for name in ('hash_fixture.json', 'hash_fixture_reformatted.json')]
    record('raw_bytes_differ_canonical_value_equal', raw[0]['raw_file_sha256'] != raw[1]['raw_file_sha256'] and raw[0]['canonical_json_sha256'] == raw[1]['canonical_json_sha256'])
    with tempfile.TemporaryDirectory(prefix='public-contract-') as temporary:
        relocated = Path(temporary) / 'package'
        shutil.copytree(root, relocated, ignore=shutil.ignore_patterns('__pycache__'))
        cli = relocated / 'skills/review-visible-design/scripts/review_contract.py'
        samples = [('route', 'sample_request.json', 'status', 'routed'), ('route', 'sample_action_request.json', 'status', 'proposal_only'),
                   ('compare', 'sample_comparison.json', 'metadata_result', 'pass'), ('compare', 'sample_known_null_comparison.json', 'metadata_result', 'pass'),
                   ('check-report', 'sample_report.json', 'contract_result', 'pass'), ('hash-json', 'hash_fixture.json', 'status', 'hashed')]
        for command, filename, key, value in samples:
            process = subprocess.run([sys.executable, str(cli), command, '--input', str(relocated / 'tests' / filename)], cwd=relocated, capture_output=True, text=True)
            answer = json.loads(process.stdout)
            record('relocated_cli:' + command + ':' + filename, process.returncode == 0 and answer[key] == value)
        for case in parsed['tests/invalid_json_cases.json']['cases']:
            invalid = Path(temporary) / 'invalid.json'
            invalid.write_text(case['text'], encoding='utf-8')
            process = subprocess.run([sys.executable, str(cli), 'hash-json', '--input', str(invalid)], cwd=relocated, capture_output=True, text=True)
            answer = json.loads(process.stdout)
            fixtures.append({'case_id': case['case_id'], 'family': 'invalid_json_cli',
                             'passed': process.returncode == 1 and answer['status'] == case['expected_status'] and bool(answer['errors'])})
    record('all_151_preserved_fixtures', len(fixtures) == 151 and all(f['passed'] for f in fixtures))
    failures = [c['name'] for c in checks if not c['passed']]
    return {'validator_version': 'public-copy-1.0.0', 'validated_at_utc': datetime.now(timezone.utc).isoformat(),
            'status': 'passed_offline_public_copy_checks' if not failures else 'failed_offline_public_copy_checks',
            'scope': 'New public validator: local shape, source references, exact inventory, preserved input bytes, 151 deterministic fixtures and relocated CLI',
            'network_requests': 0, 'model_calls': 0, 'checks': checks, 'fixtures': fixtures,
            'counts': {'checks': len(checks), 'failed_checks': len(failures), 'deterministic_fixtures': len(fixtures),
                       'fixture_failures': sum(not f['passed'] for f in fixtures)},
            'unrun_gates': status['gates'], 'license_choice': 'pending_user_decision', 'official_approval': 'not_claimed',
            'limitations': ['Remote manifest JSON Schema not fetched', 'Normalized requests do not prove natural-language activation',
                            'No browser, input, visual-effectiveness, host-loading or participant study is performed by this validator'],
            'artifact_sha256': {p.relative_to(root).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in paths if p.relative_to(root).as_posix() != RESULT_PATH}}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    root = parser.parse_args().root.resolve()
    try:
        report = validate(root)
    except Exception as error:
        report = {'status': 'failed_offline_public_copy_checks', 'error': str(error)}
    (root / RESULT_PATH).write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'status': report['status'], 'counts': report.get('counts'), 'error': report.get('error'),
                      'failed_checks': [c['name'] for c in report.get('checks', []) if not c['passed']]}, indent=2))
    return 0 if report['status'] == 'passed_offline_public_copy_checks' else 1


if __name__ == '__main__':
    raise SystemExit(main())
