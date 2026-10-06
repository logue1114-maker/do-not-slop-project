#!/usr/bin/env python3
"""Inspect the exact local public source tree. Read-only except its scoped report."""
import argparse
import hashlib
import json
import re
import sys
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

SELF_REPORT = 'validation/release-checks.json'
TRIAL_CAPTURE_PATHS = {
    'research/instruction_trial_01/screenshots/' + name + '.jpg'
    for name in ('reference-desktop', 'alpha-desktop', 'beta-desktop', 'alpha-narrow', 'beta-narrow')
}
GUIDED_CAPTURE_PATHS = {
    'research/instruction_trial_02/screenshots/' + name + '.jpg'
    for name in ('revision2-desktop', 'revision2-narrow')
}

WHITE_PALETTE_CAPTURE_PATHS = {
    'research/white_surface_palettes_v1/screenshots/' + name + '.jpg'
    for name in ('work-ink', 'work-cobalt', 'order-forest', 'order-terracotta',
                 'learning-plum', 'learning-petrol', 'order-narrow')
}

GAME_PRESET_ROOT = 'research/game_interface_presets_v1/'
GAME_CANONICAL_NAMES = {genre + '-' + viewport
                        for genre in ('rpg', 'card', 'puzzle', 'strategy', 'action')
                        for viewport in ('desktop', 'narrow')}
GAME_SHARED_NAMES = {'rpg-desktop-first', 'action-pause-desktop'}
GAME_FLOW_NAMES = {'rpg-rank-blocked-narrow', 'rpg-equipped-narrow', 'card-win-narrow',
                   'puzzle-solved-narrow', 'strategy-blocked-with-prior-order-narrow',
                   'action-pause-narrow', 'action-lost-narrow'}
GAME_PRESET_CAPTURE_PATHS = (
    {GAME_PRESET_ROOT + 'screenshots/' + name + '.png'
     for name in GAME_CANONICAL_NAMES | GAME_SHARED_NAMES | GAME_FLOW_NAMES}
    | {GAME_PRESET_ROOT + 'first-pass/screenshots/' + name + '.png'
       for name in GAME_CANONICAL_NAMES | GAME_SHARED_NAMES}
    | {GAME_PRESET_ROOT + 'contact-sheet-' + viewport + '.png'
       for viewport in ('desktop', 'narrow')}
)


WEB_PRESET_ROOT = 'research/web_interface_presets_v1/'
WEB_PRESET_CAPTURE_PATHS = {
    WEB_PRESET_ROOT + 'checks/final/booking-confirmed-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/booking-confirmed-390x844.png',
    WEB_PRESET_ROOT + 'checks/final/booking-conflict-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/booking-conflict-390x844.png',
    WEB_PRESET_ROOT + 'checks/final/booking-entry-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/booking-entry-390x844.png',
    WEB_PRESET_ROOT + 'checks/final/booking-no-times-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/booking-review-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/community-entry-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/community-entry-390x844.png',
    WEB_PRESET_ROOT + 'checks/final/community-preview-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/community-preview-390x844.png',
    WEB_PRESET_ROOT + 'checks/final/course-complete-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/course-entry-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/course-entry-390x844.png',
    WEB_PRESET_ROOT + 'checks/final/course-incorrect-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/course-incorrect-390x844.png',
    WEB_PRESET_ROOT + 'checks/final/information-article-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/information-article-390x844.png',
    WEB_PRESET_ROOT + 'checks/final/information-empty-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/information-entry-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/information-entry-390x844.png',
    WEB_PRESET_ROOT + 'checks/final/shopping-empty-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/shopping-entry-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/shopping-entry-390x844.png',
    WEB_PRESET_ROOT + 'checks/final/shopping-keyboard-focus-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/shopping-review-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/shopping-review-390x844.png',
    WEB_PRESET_ROOT + 'checks/final/work-edit-390x844.png',
    WEB_PRESET_ROOT + 'checks/final/work-empty-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/work-entry-1165x747.png',
    WEB_PRESET_ROOT + 'checks/final/work-entry-390x844.png',
    WEB_PRESET_ROOT + 'checks/final/work-saved-1165x747.png',
    WEB_PRESET_ROOT + 'first-pass/screenshots/booking-entry-1165x747.png',
    WEB_PRESET_ROOT + 'first-pass/screenshots/booking-entry-390x844.png',
    WEB_PRESET_ROOT + 'first-pass/screenshots/community-entry-1165x747.png',
    WEB_PRESET_ROOT + 'first-pass/screenshots/community-entry-390x844.png',
    WEB_PRESET_ROOT + 'first-pass/screenshots/course-entry-1165x747.png',
    WEB_PRESET_ROOT + 'first-pass/screenshots/course-entry-390x844.png',
    WEB_PRESET_ROOT + 'first-pass/screenshots/information-entry-1165x747.png',
    WEB_PRESET_ROOT + 'first-pass/screenshots/information-entry-390x844.png',
    WEB_PRESET_ROOT + 'first-pass/screenshots/shopping-entry-1165x747.png',
    WEB_PRESET_ROOT + 'first-pass/screenshots/shopping-entry-390x844.png',
    WEB_PRESET_ROOT + 'first-pass/screenshots/work-entry-1165x747.png',
    WEB_PRESET_ROOT + 'first-pass/screenshots/work-entry-390x844.png',
}

GAME_PLAYGROUND_ROOT = 'research/game_ui_playground_v1/'
GAME_PLAYGROUND_CAPTURE_PATHS = {
    GAME_PLAYGROUND_ROOT + 'screenshots/' + name + '.png'
    for name in ('01-minimap-desktop', '02-inventory-compare-desktop', '03-shop-confirm-desktop',
                 '04-hud-low-health-desktop', '05-dialogue-reward-desktop', '06-internal-portrait',
                 'dialogue-390x844', 'hud-844x390', 'inventory-320x568', 'inventory-390x844',
                 'minimap-390x844', 'minimap-844x390', 'play-view-hud-844x390',
                 'play-view-inventory-390x844', 'play-view-minimap-844x390',
                 'play-view-shop-844x390', 'shop-390x844', 'shop-844x390',
                 'shop-purchase-complete-desktop')
} | {GAME_PLAYGROUND_ROOT + 'contact-sheet-' + view + '.png' for view in ('desktop', 'mobile')} \
  | {GAME_PLAYGROUND_ROOT + 'check-history/minimap-landscape-before-caption-fix.png'}

GAMEPLAY_DETAILS_ROOT = 'research/gameplay_details_v1/'
GAMEPLAY_DETAILS_NAMES = {view + '-' + study for view in ('desktop', 'narrow', 'landscape') for study in ('jump', 'interaction', 'feedback', 'recovery')} | {'desktop-jump-coyote', 'desktop-jump-buffer', 'desktop-target-occluded', 'desktop-feedback-both', 'desktop-recovery-recovered', 'desktop-recovery-lost'}
GAMEPLAY_FEEDBACK_NAMES = {'desktop-feedback', 'desktop-feedback-both', 'narrow-feedback', 'landscape-feedback'}
GAMEPLAY_DETAILS_CAPTURE_PATHS = ({GAMEPLAY_DETAILS_ROOT + 'captures/final/' + name + suffix + '.png' for name in GAMEPLAY_DETAILS_NAMES for suffix in ('', '-frame')} | {GAMEPLAY_DETAILS_ROOT + 'captures/first-browser/' + name + '.png' for name in GAMEPLAY_DETAILS_NAMES} | {GAMEPLAY_DETAILS_ROOT + 'captures/pre-contrast/' + name + suffix + '.png' for name in GAMEPLAY_FEEDBACK_NAMES for suffix in ('', '-frame')})

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.targets = []
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ('href', 'src') and value:
                self.targets.append(value)


def inspect(root):
    results = []
    def check(name, value, detail=None):
        results.append({'name': name, 'passed': bool(value), 'detail': detail})
    files = sorted(p for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts)
    relative = {p.relative_to(root).as_posix(): p for p in files}
    check('regular_contained_files', not any(p.is_symlink() or not p.resolve().is_relative_to(root.resolve()) for p in root.rglob('*')))
    provenance = json.loads(relative['docs/PROVENANCE.json'].read_text())
    approved_captures_v1 = provenance.get('instruction_trial_01', {}).get('approved_synthetic_capture_sha256', {})
    approved_captures_v2 = provenance.get('instruction_trial_02', {}).get('approved_synthetic_capture_sha256', {})
    approved_captures_palettes = provenance.get('white_surface_palettes_v1', {}).get('approved_synthetic_capture_sha256', {})
    approved_captures_games = provenance.get('game_interface_presets_v1', {}).get('approved_synthetic_capture_sha256', {})
    approved_captures_web = provenance.get('web_interface_presets_v1', {}).get('approved_synthetic_capture_sha256', {})
    approved_captures_playground = provenance.get('game_ui_playground_v1', {}).get('approved_synthetic_capture_sha256', {})
    approved_captures_details = provenance.get('gameplay_details_v1', {}).get('approved_synthetic_capture_sha256', {})
    approved_captures = {**approved_captures_details, **approved_captures_v1, **approved_captures_v2, **approved_captures_palettes, **approved_captures_games, **approved_captures_web, **approved_captures_playground}
    denied_parts = {'.git', '.openai', '.aws', '.codex', '.agents', 'node_modules', 'evidence', 'browser_qa', 'public_release_audit'}
    forbidden = [r for r, p in relative.items() if set(p.relative_to(root).parts) & denied_parts
                 or re.search(r'(?:evaluation|private|audit_report)', r, re.I)
                 or (p.suffix.lower() in {'.zip', '.mp4', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.woff', '.woff2', '.ttf', '.otf', '.pem', '.key'}
                     and not (p.suffix.lower() == '.jpg' and r in (TRIAL_CAPTURE_PATHS | GUIDED_CAPTURE_PATHS | WHITE_PALETTE_CAPTURE_PATHS) and r in approved_captures))
                 or p.name == 'LICENSE' or p.name.startswith('.env')]
    check('excluded_media_archives_configuration_absent', not forbidden, forbidden)
    required = ['README.md', 'docs/RIGHTS_AND_SCOPE.md', 'docs/VERIFICATION.md', 'docs/PROVENANCE.json',
                'docs/PRESERVED_INPUTS.sha256.json', 'FILES.sha256.json',
                'research/strategy_controls_oct4/demo/index.html', 'research/booking_flows_oct4/demo/index.html',
                'research/booking_flows_oct4/fixture.json', 'research/comparison_assets/learning_layout/same_fixture_learning.html',
                'research/do_not_slop_copy/copy_examples.html', 'plugins/review-visible-design/validation/validate_package.py']
    check('required_release_content', all(r in relative for r in required), [r for r in required if r not in relative])
    check('exact_project_title', relative['README.md'].read_text().splitlines()[0] == '# Do Not Slop Project')
    for rel, path in relative.items():
        if path.suffix == '.json':
            try:
                json.loads(path.read_text())
                check('json:' + rel, True)
            except (ValueError, UnicodeError) as error:
                check('json:' + rel, False, str(error))
    preserved = json.loads(relative['docs/PRESERVED_INPUTS.sha256.json'].read_text())['files']
    for entry in preserved:
        path = root / entry['path']
        check('preserved_bytes:' + entry['path'], path.is_file() and hashlib.sha256(path.read_bytes()).hexdigest() == entry['sha256'])
    provenance = json.loads(relative['docs/PROVENANCE.json'].read_text())
    check('source_authority_and_license_boundaries', provenance['public_redistribution'] == 'authorized_source_release_only'
          and provenance['license_choice'] == 'pending_user_decision' and provenance['external_rights'] == 'unknown_link_only')
    approved_art = provenance['approved_authored_board_sha256']
    art_paths = {r for r, p in relative.items() if p.suffix in {'.png', '.svg'} and r not in (GAME_PRESET_CAPTURE_PATHS | WEB_PRESET_CAPTURE_PATHS | GAME_PLAYGROUND_CAPTURE_PATHS | GAMEPLAY_DETAILS_CAPTURE_PATHS)}
    check('exact_authored_board_allowlist', set(approved_art) == art_paths and len(art_paths) == 46)
    for rel in sorted(art_paths):
        path = relative[rel]
        check('authored_board_bytes:' + rel, hashlib.sha256(path.read_bytes()).hexdigest() == approved_art.get(rel))
        if path.suffix == '.svg':
            document = ET.fromstring(path.read_text())
            check('vector_no_embedded_media:' + rel, not any(element.tag.split('}')[-1] in {'image', 'script', 'foreignObject'} for element in document.iter())
                  and 'data:' not in path.read_text() and '@font-face' not in path.read_text())
    capture_paths = {r for r, p in relative.items() if p.suffix.lower() in {'.jpg', '.jpeg'}
                     or (p.suffix.lower() == '.png' and r.startswith((GAME_PRESET_ROOT, WEB_PRESET_ROOT, GAME_PLAYGROUND_ROOT, GAMEPLAY_DETAILS_ROOT)))}
    check('exact_original_capture_allowlist', set(approved_captures_v1) == TRIAL_CAPTURE_PATHS)
    check('exact_guided_iteration_capture_allowlist', set(approved_captures_v2) == GUIDED_CAPTURE_PATHS)
    check('exact_white_palette_capture_allowlist', set(approved_captures_palettes) == WHITE_PALETTE_CAPTURE_PATHS)
    check('exact_game_preset_capture_allowlist', set(approved_captures_games) == GAME_PRESET_CAPTURE_PATHS
          and len(GAME_PRESET_CAPTURE_PATHS) == 33)
    check('exact_web_preset_capture_allowlist', set(approved_captures_web) == WEB_PRESET_CAPTURE_PATHS
          and len(WEB_PRESET_CAPTURE_PATHS) == 45)
    check('exact_game_playground_capture_allowlist', set(approved_captures_playground) == GAME_PLAYGROUND_CAPTURE_PATHS
          and len(GAME_PLAYGROUND_CAPTURE_PATHS) == 22)
    check('exact_gameplay_details_capture_allowlist', set(approved_captures_details) == GAMEPLAY_DETAILS_CAPTURE_PATHS and len(GAMEPLAY_DETAILS_CAPTURE_PATHS) == 62)
    check('exact_synthetic_capture_allowlist', set(approved_captures) == (TRIAL_CAPTURE_PATHS | GUIDED_CAPTURE_PATHS | WHITE_PALETTE_CAPTURE_PATHS | GAME_PRESET_CAPTURE_PATHS | WEB_PRESET_CAPTURE_PATHS | GAME_PLAYGROUND_CAPTURE_PATHS | GAMEPLAY_DETAILS_CAPTURE_PATHS) == capture_paths)
    for rel in sorted(capture_paths):
        check('synthetic_capture_bytes:' + rel, hashlib.sha256(relative[rel].read_bytes()).hexdigest() == approved_captures.get(rel))
    broken, escaped = [], []
    for rel, path in relative.items():
        targets = []
        if path.suffix == '.md':
            targets.extend(re.findall(r'!?\[[^\]]*\]\(([^)]+)\)', path.read_text()))
        if path.suffix == '.html':
            parser = Links()
            parser.feed(path.read_text())
            targets.extend(parser.targets)
        for target in targets:
            target = target.strip().split(' "', 1)[0]
            url = urllib.parse.urlsplit(target)
            if url.scheme or target.startswith('//') or not url.path:
                continue
            resolved = (path.parent / urllib.parse.unquote(url.path)).resolve()
            if not resolved.is_relative_to(root.resolve()):
                escaped.append({'file': rel, 'target': target})
            elif not resolved.exists():
                broken.append({'file': rel, 'target': target})
    check('local_markdown_html_links_exist', not broken and not escaped, {'missing': broken, 'escaped': escaped})
    sensitive = []
    patterns = {
        'private_machine_path': re.compile('/' + r'(?:workspace|home/agent|root)/[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)+'),
        'windows_machine_path': re.compile(r'(?<![A-Za-z0-9\\])\b[A-Za-z]:[\\/](?=[A-Za-z0-9_.-])'),
        'credential': re.compile(r'\b(?:gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{30,})\b'),
        'signed_download': re.compile(r'https?://[^\s"<>]+[?&](?:sig|X-Amz-Signature|token|access_token)='),
        'embedded_auth': re.compile(r'https?://[^/\s:]+:[^/\s@]+@'),
        'internal_coordination': re.compile('cloud' + r'_threads|collaboration' + r'\.|agent' + '_notes|sediment:' + '//|codex:' + '//|library_' + 'file_id'),
        'transfer_identity': re.compile('lib' + r'file_[A-Za-z0-9]+|\b' + 'file_' + r'[A-Za-z0-9]{12,}'),
        'real_contact_candidate': re.compile(r'\b[A-Za-z0-9._%+-]+@(?!(?:example\.(?:test|com|org|net))\b)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'),
    }
    for rel, path in relative.items():
        if path.suffix.lower() not in {'.png', '.jpg', '.jpeg'} and rel != SELF_REPORT:
            text = path.read_text(encoding='utf-8')
            for kind, pattern in patterns.items():
                matches = pattern.findall(text)
                if matches:
                    sensitive.append({'file': rel, 'kind': kind, 'count': len(matches)})
    check('secret_path_contact_coordination_scan', not sensitive, sensitive)
    inventory = json.loads(relative['FILES.sha256.json'].read_text())
    inventory_paths = {entry['path'] for entry in inventory['files']}
    expected_paths = set(relative) - {'FILES.sha256.json'}
    check('release_inventory_complete', inventory_paths == expected_paths,
          {'missing': sorted(expected_paths - inventory_paths), 'extra': sorted(inventory_paths - expected_paths)})
    drift = []
    for entry in inventory['files']:
        if entry['path'] == SELF_REPORT:
            continue
        path = root / entry['path']
        if not path.is_file() or len(path.read_bytes()) != entry['bytes'] or hashlib.sha256(path.read_bytes()).hexdigest() != entry['sha256']:
            drift.append(entry['path'])
    check('release_inventory_bytes', not drift, drift)
    failures = [r for r in results if not r['passed']]
    return {'project': 'Do Not Slop Project', 'validated_at_utc': datetime.now(timezone.utc).isoformat(),
            'status': 'passed_public_tree_checks' if not failures else 'failed_public_tree_checks',
            'scope': 'Local bytes, declared preserved inputs, authored board and synthetic capture allowlists, JSON, local Markdown/HTML links and bounded secret/path/contact scan',
            'network_requests': 0, 'counts': {'files': len(files), 'checks': len(results), 'failed_checks': len(failures)},
            'checks': results, 'limitations': ['This scan is bounded and cannot certify absence of every possible secret',
              'External links were not fetched by this validator', 'Browser rendering, accessibility, source currentness and usability are separate gates'],
            'receipt_hash_policy': 'This report is excluded from its own byte verification; regenerate FILES.sha256.json after the report is written'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    root = parser.parse_args().root.resolve()
    report = inspect(root)
    (root / SELF_REPORT).write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'status': report['status'], 'counts': report['counts'],
                      'failed_checks': [r for r in report['checks'] if not r['passed']]}, ensure_ascii=False, indent=2))
    return 0 if report['status'] == 'passed_public_tree_checks' else 1


if __name__ == '__main__':
    raise SystemExit(main())
