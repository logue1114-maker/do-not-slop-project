# Public learning fixture/source/DOM-string checks

Command: `python3 tests/test_source.py`

245/245 checks passed; 0 failed. Includes 29 Node state checks and 18 rendered source states.

Scope: exact embedded fixture text (allowing the fixture file's final LF), fixture values, static local-only source guards, shared state and course order, independently expected unique facts, action meaning/enabled attributes, progress attributes, lesson and radio state, ID/label wiring, framing removal, and lesson DOM order.

These are source checks, not a browser test. Browser runtime, visual rendering, real keyboard behavior, screen readers, accessibility auditing, and usability measurement were not run. User approval remains pending.
