#!/usr/bin/env python3
"""Portable public fixture/source/DOM-string checks, using only Python and Node.

The included state_checks.mjs executes the real inline JavaScript in a Node VM
with a minimal DOM stub. HTMLParser inspects its rendered strings here. Neither
stage runs a browser or establishes visual, accessibility, or usability results.
"""
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import sys

BASE = Path(__file__).resolve().parent.parent
HTML_BYTES = (BASE / "same_fixture_learning.html").read_bytes()
HTML = HTML_BYTES.decode("utf-8")
FIXTURE_BYTES = (BASE / "fixture.json").read_bytes()
FIXTURE = json.loads(FIXTURE_BYTES)
COURSES = {course["id"]: course for course in FIXTURE["courses"]}
RESULTS = []


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def equal(actual, expected, message):
    require(actual == expected, f"{message}: expected {expected!r}, got {actual!r}")


def test(name, check):
    try:
        check()
        RESULTS.append({"name": name, "status": "passed"})
        print("PASS", name)
    except Exception as error:
        detail = str(error).replace(str(BASE), ".")
        RESULTS.append({"name": name, "status": "failed", "detail": detail})
        print("FAIL", name, detail, file=sys.stderr)


class Node:
    def __init__(self, tag, attrs=None, parent=None):
        self.tag = tag
        self.attrs = dict(attrs or [])
        self.parent = parent
        self.children = []
        self.text = []

    def all(self):
        for child in self.children:
            yield child
            yield from child.all()

    def content(self):
        return "".join(self.text).strip()

    def classes(self):
        return (self.attrs.get("class") or "").split()


class Parser(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self, markup):
        super().__init__(convert_charrefs=True)
        self.root = Node("root")
        self.stack = [self.root]
        self.feed(markup)
        self.close()

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs, self.stack[-1])
        self.stack[-1].children.append(node)
        if tag not in self.VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        for node in self.stack:
            node.text.append(data)


def nodes(root, *, tag=None, attr=None, cls=None):
    return [node for node in root.all()
            if (tag is None or node.tag == tag)
            and (attr is None or attr in node.attrs)
            and (cls is None or cls in node.classes())]


def facts(root):
    output = {}
    for node in nodes(root, attr="data-fact-key"):
        key = node.attrs["data-fact-key"]
        require(key not in output, f"Fact {key!r} occurs more than once")
        value = node.attrs.get("data-fact-value")
        require(value is not None, f"Fact {key!r} has no value")
        if key.endswith(".thumbnail"):
            value = json.loads(value)
        else:
            equal(node.content(), value, f"Visible text for {key}")
        output[key] = value
    return output


def expected_facts(state):
    output = {}
    if not state["enrolled"]:
        output.update({"empty.title": "아직 수강 중인 강의가 없습니다",
                       "empty.explanation": "이 비교 상태에는 등록 강의가 없습니다. 기본 예시 강의를 불러오면 3개 강의가 표시됩니다."})
    for course_id in state["enrolled"]:
        course = COURSES[course_id]
        done = len(state["completed"][course_id])
        total = len(course["lessons"])
        percent = int(done / total * 100 + 0.5)
        next_lesson = next((lesson for lesson in course["lessons"] if lesson["id"] not in state["completed"][course_id]), None)
        title = FIXTURE["longTitle"] if state["caseId"] == "long_title" and course_id == "observe" else course["title"]
        values = {
            "selection": "현재 강의" if state["selectedCourseId"] == course_id else "수강 강의",
            "title": title, "category": course["category"], "level": course["level"],
            "totalDuration": f"{sum(lesson['minutes'] for lesson in course['lessons'])}분",
            "objective": course["objective"], "prerequisite": course["prerequisite"], "access": course["access"],
            "thumbnail": course["thumbnail"], "status": "완료" if done == total else "학습 중" if done else "시작 전",
            "progress": f"{done}/{total}수업 · {percent}%", "nextLabel": "다음 수업" if next_lesson else "남은 수업",
            "nextTitle": next_lesson["title"] if next_lesson else "모든 수업 완료",
            "nextDuration": f"{next_lesson['minutes']}분" if next_lesson else "첫 수업부터 복습 가능",
            "nextId": next_lesson["id"] if next_lesson else "none",
        }
        output.update({f"{course_id}.{key}": value for key, value in values.items()})
    active = state["active"]
    if active:
        course = COURSES[active["courseId"]]
        lesson = next(lesson for lesson in course["lessons"] if lesson["id"] == active["lessonId"])
        review = lesson["id"] in state["completed"][course["id"]]
        prefix = f"lesson.{course['id']}.{lesson['id']}"
        values = {"position": f"{course['lessons'].index(lesson) + 1}/{len(course['lessons'])}수업",
                  "duration": f"{lesson['minutes']}분", "mode": "복습" if review else "학습",
                  "course": output[f"{course['id']}.title"], "title": lesson["title"], "question": lesson["question"],
                  "policy": "이미 완료한 수업을 복습하고 있습니다. 복습을 마쳐도 진행률은 바뀌지 않습니다." if review else "정답을 확인한 뒤 학습 완료를 누르면 진행률이 올라가고 다음 수업이 열립니다."}
        values.update({f"body{index}": body for index, body in enumerate(lesson["body"])})
        values.update({f"option{index}": option for index, option in enumerate(lesson["options"])})
        if state["feedback"]:
            values["feedback"] = state["feedback"]["text"]
        output.update({f"{prefix}.{key}": value for key, value in values.items()})
    return output


def command_signature(root):
    return sorted((node.attrs["data-command"], node.attrs.get("data-course", ""), node.attrs.get("data-case", ""),
                   "disabled" in node.attrs, node.content()) for node in nodes(root, tag="button", attr="data-command"))


def check_courses(before, after, state):
    old = nodes(before, attr="data-course-record")
    new = nodes(after, attr="data-course-record")
    equal([node.attrs["data-course-record"] for node in old], state["enrolled"], "Before course order")
    ordered = [state["selectedCourseId"]] + [course_id for course_id in state["enrolled"] if course_id != state["selectedCourseId"]] if state["enrolled"] else []
    equal([node.attrs["data-course-record"] for node in new], ordered, "After selected-first course order")
    require(all(node.tag == "li" and "course-card" in node.classes() for node in old), "Before uses course list items")
    equal([next(cls for cls in node.classes() if cls.startswith("course-")) for node in new],
          ["course-focus"] + ["course-row"] * (len(new) - 1) if new else [], "After focus and row roles")


def check_progress(before, after, state):
    signatures = []
    for root in [before, after]:
        found = {}
        for record in nodes(root, attr="data-course-record"):
            course_id = record.attrs["data-course-record"]
            bars = [node for node in record.all() if node.attrs.get("role") == "progressbar"]
            equal(len(bars), 1, f"Progress bar count for {course_id}")
            bar = bars[0]
            done, total = len(state["completed"][course_id]), len(COURSES[course_id]["lessons"])
            percent = int(done / total * 100 + 0.5)
            title = expected_facts(state)[f"{course_id}.title"]
            expected = {"aria-valuemin": "0", "aria-valuemax": str(total), "aria-valuenow": str(done),
                        "aria-valuetext": f"{done}/{total}수업 · {percent}%", "aria-label": f"{title} 학습 진행"}
            equal({key: bar.attrs.get(key) for key in expected}, expected, f"Progress attributes for {course_id}")
            fills = nodes(bar, tag="span")
            equal(len(fills), 1, "Progress fill count")
            equal(fills[0].attrs.get("style"), f"--progress:{percent}%", "Progress fill source value")
            found[course_id] = expected
        signatures.append(found)
    equal(signatures[0], signatures[1], "Progress attributes agree between views")


def check_actions(before, after, state):
    equal(command_signature(before), command_signature(after), "Both views have equivalent command, label and disabled attributes")
    for root in [before, after]:
        buttons = nodes(root, tag="button", attr="data-command")
        require(all(node.attrs.get("type") == "button" for node in buttons), "All rendered command buttons use type=button")
        open_buttons = [node for node in buttons if node.attrs["data-command"] == "OPEN_COURSE"]
        equal(sorted(node.attrs.get("data-course") for node in open_buttons), sorted(state["enrolled"]), "One open command per enrolled course")
        for button in open_buttons:
            course_id = button.attrs["data-course"]
            course = COURSES[course_id]
            complete = len(state["completed"][course_id]) == len(course["lessons"])
            label = "처음부터 복습" if complete else "학습 열기"
            equal(button.content(), label, "Course action meaning")
            equal(button.attrs.get("aria-label"), expected_facts(state)[f"{course_id}.title"] + " " + label, "Course action source label")
            require("disabled" not in button.attrs, "Course open command remains enabled")
        restore = [node for node in buttons if node.attrs["data-command"] == "CASE"]
        equal(len(restore), 0 if state["enrolled"] else 1, "Empty-state restoration count")
        if restore:
            equal(restore[0].attrs.get("data-case"), "baseline", "Empty state restores baseline")


def check_lesson(before, after, state):
    for view, root in [("before", before), ("after", after)]:
        workspaces = nodes(root, cls="lesson-workspace")
        equal(len(workspaces), 1 if state["active"] else 0, "Lesson workspace count")
        radios = nodes(root, tag="input")
        if not state["active"]:
            equal(radios, [], "No answer controls without active lesson")
            require(not any(node.attrs.get("data-command") in {"CLOSE_LESSON", "SUBMIT_ANSWER", "COMPLETE_LESSON"}
                            for node in nodes(root, tag="button")), "No lesson commands without active lesson")
            continue
        workspace = workspaces[0]
        equal(workspace.attrs.get("id"), f"{view}-lesson-workspace", "View-specific lesson ID")
        equal(workspace.attrs.get("aria-label"), "현재 수업", "Lesson source label")
        active = state["active"]
        course = COURSES[active["courseId"]]
        lesson = next(lesson for lesson in course["lessons"] if lesson["id"] == active["lessonId"])
        equal(len(radios), len(lesson["options"]), "Answer control count")
        equal([node.attrs.get("value") for node in radios], [str(index) for index in range(len(lesson["options"]))], "Answer values")
        for index, radio in enumerate(radios):
            equal(radio.attrs.get("type"), "radio", "Answer is a native radio input")
            equal(radio.attrs.get("data-command"), "ANSWER", "Answer command")
            equal(radio.attrs.get("name"), f"{view}-checkpoint", "View-specific radio group")
            equal("checked" in radio.attrs, state["answer"] == index, "Answer checked state")
            require("disabled" not in radio.attrs, "Answer remains editable")
        buttons = {node.attrs["data-command"]: node for node in nodes(workspace, tag="button", attr="data-command")}
        equal(set(buttons), {"CLOSE_LESSON", "SUBMIT_ANSWER", "COMPLETE_LESSON"}, "Lesson commands")
        equal("disabled" in buttons["COMPLETE_LESSON"].attrs, not state["ready"], "Completion requires checked answer")
        review = lesson["id"] in state["completed"][course["id"]]
        equal(buttons["COMPLETE_LESSON"].content(), "복습 마치기" if review else "학습 완료", "Completion action meaning")
        feedback = nodes(workspace, cls="lesson-feedback")
        equal(len(feedback), 1 if state["feedback"] else 0, "Feedback element count")
        if feedback:
            equal(feedback[0].attrs.get("role"), "status", "Feedback source role")
            equal("error" in feedback[0].classes(), state["feedback"]["kind"] == "error", "Feedback source class")
            equal(feedback[0].content(), state["feedback"]["text"], "Feedback text")


def check_ids_labels(before, after):
    all_nodes = list(before.all()) + list(after.all())
    ids = [node.attrs["id"] for node in all_nodes if "id" in node.attrs]
    equal(len(ids), len(set(ids)), "IDs remain unique across paired rendered fragments")
    for node in all_nodes:
        if node.tag == "label" and "for" in node.attrs:
            targets = [target for target in all_nodes if target.attrs.get("id") == node.attrs["for"]]
            equal(len(targets), 1, "Label has one matching control")
            equal(targets[0].tag, "input", "Rendered answer label targets an input")


def check_framing(before, after):
    equal([node.attrs["data-redundant-framing"] for node in nodes(before, attr="data-redundant-framing")],
          ["welcome", "selection"], "Before framing containers")
    equal(nodes(after, attr="data-redundant-framing"), [], "After removes redundant framing containers")
    require(not nodes(after, cls="generic-hero") and not nodes(after, cls="redundant-guide"), "After has no empty framing slots")


def check_order(before, after, state):
    for root, view in [(before, "before"), (after, "after")]:
        ordered = list(root.all())
        lesson = nodes(root, cls="lesson-workspace")
        lists = nodes(root, cls="generic-course-grid" if view == "before" else "task-course-list")
        equal(len(lists), 1 if state["enrolled"] else 0, "Course list container count")
        if lesson and lists:
            equal(ordered.index(lesson[0]) < ordered.index(lists[0]), view == "after", "Lesson-before-list ordering in After")


def check_state(state):
    equal(set(state["completed"]), set(COURSES), "Shared completion record keys")
    for course_id, completed in state["completed"].items():
        equal(len(completed), len(set(completed)), "No duplicate completion IDs")
        require(set(completed) <= {lesson["id"] for lesson in COURSES[course_id]["lessons"]}, "No phantom completed lesson")
    equal(state["caseId"] in {case["id"] for case in FIXTURE["cases"]}, True, "Known comparison case")
    equal(state["mobileView"] in {"before", "after"}, True, "Known mobile view")
    if state["enrolled"]:
        require(state["selectedCourseId"] in state["enrolled"], "Selected course is enrolled")
    else:
        equal(state["selectedCourseId"], None, "Empty case has no selected course")
        equal(state["active"], None, "Empty case has no active lesson")
    if state["ready"]:
        require(state["active"] and state["feedback"] and state["feedback"]["kind"] == "success", "Ready completion has active lesson and success feedback")
        course = COURSES[state["active"]["courseId"]]
        lesson = next(lesson for lesson in course["lessons"] if lesson["id"] == state["active"]["lessonId"])
        equal(state["answer"], lesson["correctIndex"], "Ready completion has the correct answer")


def main():
    document = Parser(HTML).root
    scripts = {node.attrs.get("id"): node for node in nodes(document, tag="script")}
    fixture_text = scripts["fixture-data"].content()
    app = scripts["learning-app"].content()
    css = nodes(document, tag="style")[0].content()
    test("Embedded fixture preserves exact JSON text except the file's final LF", lambda: equal(fixture_text.encode("utf-8"), FIXTURE_BYTES.removesuffix(b"\n"), "Embedded fixture bytes"))
    test("Embedded fixture JSON values equal the preserved source fixture", lambda: equal(json.loads(fixture_text), FIXTURE, "Fixture values"))
    test("Fixture identity and approval remain explicitly constructed and pending", lambda: (
        equal(FIXTURE["identity"], "own_constructed_comparison", "Constructed identity"),
        equal(FIXTURE["userApprovalStatus"], "pending", "Approval status")))
    test("Fixture contains three unique courses and exactly four comparison cases", lambda: (
        equal(len(FIXTURE["courses"]), 3, "Course count"), equal(len(COURSES), 3, "Unique course IDs"),
        equal([case["id"] for case in FIXTURE["cases"]], ["baseline", "empty", "completed", "long_title"], "Comparison cases")))
    test("Fixture lesson IDs are unique and initial completions belong to their course", lambda: [(
        equal(len({lesson["id"] for lesson in course["lessons"]}), len(course["lessons"]), "Unique lesson IDs"),
        require(set(FIXTURE["initialCompleted"][course["id"]]) <= {lesson["id"] for lesson in course["lessons"]}, "Initial completion IDs exist"),
        equal(len(FIXTURE["initialCompleted"][course["id"]]), len(set(FIXTURE["initialCompleted"][course["id"]])), "Unique initial completions"))
        for course in FIXTURE["courses"]])
    test("HTML includes only one JSON fixture script and one inline application script", lambda: (
        equal(len(nodes(document, tag="script")), 2, "Script count"),
        equal(scripts["fixture-data"].attrs.get("type"), "application/json", "Fixture script type"),
        require(not any("src" in node.attrs for node in nodes(document, tag="script")), "No external script sources")))
    test("Static HTML has unique IDs and valid toolbar label targets", lambda: (
        equal(len([node.attrs["id"] for node in nodes(document, attr="id")]), len({node.attrs["id"] for node in nodes(document, attr="id")}), "Static IDs unique"),
        require(all(any(target.attrs.get("id") == label.attrs["for"] for target in document.all()) for label in nodes(document, tag="label", attr="for")), "Toolbar labels target existing controls")))
    test("Static HTML keeps the Korean locale, viewport and unapproved comparison notice", lambda: (
        equal(nodes(document, tag="html")[0].attrs.get("lang"), "ko", "Document language"),
        require(any(node.attrs.get("name") == "viewport" for node in nodes(document, tag="meta")), "Viewport exists"),
        require("사용자 검수 대기" in HTML and "측정된 사용성 개선을 뜻하지 않습니다" in HTML, "Scope and approval notices remain")))
    test("App reads one fixture and uses one shared mutable state", lambda: (
        equal(len(re.findall(r"JSON\.parse\(document\.getElementById\('fixture-data'\)\.textContent\)", app)), 1, "Fixture parse count"),
        equal(len(re.findall(r"\blet state\s*;", app)), 1, "Shared state declaration count"),
        require("deepFreeze(fixture)" in app, "Fixture deep freeze source exists")))
    test("Both presentation roots use the shared renderView and dispatcher", lambda: (
        require("innerHTML=renderView('before')" in app and "innerHTML=renderView('after')" in app, "Shared rendering source"),
        require("function dispatch(command,payload={})" in app, "Shared dispatcher source"),
        require("render();return true" in app, "Accepted actions render both roots")))
    test("Runtime source contains no explicit network or persistent-storage API calls", lambda: (
        require(not re.search(r"\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(", app), "No explicit network API calls"),
        require(not re.search(r"\b(?:localStorage|sessionStorage|indexedDB)\b|document\.cookie\s*=", app), "No persistent-storage APIs"),
        require(not re.search(r"@import|url\(\s*['\"]?(?:https?:)?//", css, re.I), "No external CSS resources"),
        require(not nodes(document, tag="iframe") and not nodes(document, tag="video") and not nodes(document, tag="form"), "No iframe, simulated video or submission form")))
    test("Authored CSS has wrapping guards without title-clamp rules", lambda: (
        require("word-break:keep-all" in css and "overflow-wrap:anywhere" in css and "min-width:0" in css, "Text wrapping source guards"),
        require(not re.search(r"line-clamp|text-overflow\s*:\s*ellipsis", css), "No title clamp or ellipsis rule")))
    test("Authored compact course rows have no fixed height", lambda: [
        require(not re.search(r"(?:^|;)\s*(?:height|max-height)\s*:", body), "Course-row rule has no fixed or maximum height")
        for selectors, body in re.findall(r"([^{}]+)\{([^{}]*)\}", css)
        if any(selector.strip() == ".course-row" for selector in selectors.split(","))])
    test("Authored CSS includes mobile-panel switching and reduced-motion handling", lambda: (
        require("@media(max-width:900px)" in css and 'body[data-mobile-view="before"]' in css and 'body[data-mobile-view="after"]' in css, "Mobile switching source"),
        require("prefers-reduced-motion:reduce" in css, "Reduced-motion source rule")))
    try:
        run = subprocess.run(["node", "tests/state_checks.mjs"], cwd=BASE, capture_output=True, text=True, check=False)
        data = json.loads(run.stdout)
    except (OSError, ValueError):
        test("Included Node state runner executes and returns valid JSON", lambda: require(False, "Node runner unavailable or invalid JSON output"))
        data, run = {"results": [], "snapshots": []}, None
    if run is not None:
        test("Included Node state runner exits successfully", lambda: equal(run.returncode, 0, "Node runner exit code"))
    for result in data["results"]:
        test("State runner: " + result["name"], lambda result=result: require(result["status"] == "pass", result.get("detail", "State check failed")))
    snapshots = data["snapshots"]
    test("State runner emits all 18 unique public source-state snapshots", lambda: (
        equal(len(snapshots), 18, "Snapshot count"), equal(len({snapshot["name"] for snapshot in snapshots}), 18, "Unique snapshot names")))
    test("Source-state snapshots cover all four fixture cases", lambda: equal({snapshot["caseId"] for snapshot in snapshots}, {case["id"] for case in FIXTURE["cases"]}, "Case coverage"))
    for snapshot in snapshots:
        before, after = Parser(snapshot["before"]).root, Parser(snapshot["after"]).root
        state = snapshot["state"]
        prefix = snapshot["name"] + ": "
        checks = [
            ("shared state has no phantom or duplicate lesson completion", lambda: check_state(state)),
            ("course membership, order and layout roles follow the shared state", lambda: check_courses(before, after, state)),
            ("Before unique facts and text match the fixture and state", lambda: equal(facts(before), expected_facts(state), "Before facts")),
            ("After unique facts and text match the fixture and state", lambda: equal(facts(after), expected_facts(state), "After facts")),
            ("both presentations preserve identical unique fact values", lambda: equal(facts(before), facts(after), "Presentation fact equivalence")),
            ("commands, labels and enabled states preserve their meanings", lambda: check_actions(before, after, state)),
            ("progress attributes and fill source values match completion", lambda: check_progress(before, after, state)),
            ("lesson, radio, feedback and completion-control state agree", lambda: check_lesson(before, after, state)),
            ("paired IDs and answer labels remain unique and connected", lambda: check_ids_labels(before, after)),
            ("After removes redundant framing containers and empty slots", lambda: check_framing(before, after)),
            ("lesson DOM order is before the course list only in After", lambda: check_order(before, after, state)),
        ]
        for name, check in checks:
            test(prefix + name, check)
    test("Checks leave the preserved fixture and HTML bytes unchanged", lambda: (
        equal((BASE / "fixture.json").read_bytes(), FIXTURE_BYTES, "Preserved fixture bytes"),
        equal((BASE / "same_fixture_learning.html").read_bytes(), HTML_BYTES, "Preserved HTML bytes")))
    report = {"method": "Public fixture/static-source checks plus included Node VM state checks and Python HTMLParser inspection of DOM strings",
              "total": len(RESULTS), "passed": sum(result["status"] == "passed" for result in RESULTS),
              "failed": sum(result["status"] == "failed" for result in RESULTS),
              "node_state_checks": len(data["results"]), "rendered_source_states": len(snapshots),
              "fixture_byte_sha256": hashlib.sha256(FIXTURE_BYTES).hexdigest(), "results": RESULTS,
              "browser_runtime": "not_run", "visual_rendering": "not_run", "manual_keyboard": "not_run",
              "screen_reader": "not_run", "accessibility_audit": "not_run", "usability_measurement": "not_run", "user_approval": "pending"}
    (BASE / "tests" / "source-test-results.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (BASE / "tests" / "source-test-results.md").write_text(
        "# Public learning fixture/source/DOM-string checks\n\nCommand: `python3 tests/test_source.py`\n\n"
        f"{report['passed']}/{report['total']} checks passed; {report['failed']} failed. "
        f"Includes {report['node_state_checks']} Node state checks and {report['rendered_source_states']} rendered source states.\n\n"
        "Scope: exact embedded fixture text (allowing the fixture file's final LF), fixture values, static local-only source guards, "
        "shared state and course order, independently expected unique facts, action meaning/enabled attributes, progress attributes, "
        "lesson and radio state, ID/label wiring, framing removal, and lesson DOM order.\n\n"
        "These are source checks, not a browser test. Browser runtime, visual rendering, real keyboard behavior, screen readers, "
        "accessibility auditing, and usability measurement were not run. User approval remains pending.\n", encoding="utf-8")
    print(f"\n{report['passed']}/{report['total']} public fixture/source/DOM-string checks passed; {report['failed']} failed; {len(snapshots)} source states.")
    return 1 if report["failed"] else 0


if __name__ == "__main__":
    sys.exit(main())
