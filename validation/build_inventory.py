#!/usr/bin/env python3
"""Regenerate the public file-byte inventory after tests/reports finish."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

root = Path(__file__).resolve().parents[1]
records = []
for path in sorted(root.rglob('*')):
    if not path.is_file() or '__pycache__' in path.parts or path.is_symlink():
        continue
    rel = path.relative_to(root).as_posix()
    if rel == 'FILES.sha256.json':
        continue
    raw = path.read_bytes()
    records.append({'path': rel, 'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()})
report = {'project': 'Do Not Slop Project', 'created_at_utc': datetime.now(timezone.utc).isoformat(),
          'hash_algorithm': 'sha256', 'self_hash': 'not included to avoid recursive self-reference',
          'license_choice': 'pending_user_decision', 'files': records}
(root / 'FILES.sha256.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(f'{len(records)} files inventoried; manifest itself excluded')
