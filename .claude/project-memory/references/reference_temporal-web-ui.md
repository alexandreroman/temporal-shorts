---
name: "Temporal Web UI reference"
description: "How to see the real Temporal Web UI locally to check UI-like scenes, and its dark-mode look"
type: reference
---

# Temporal Web UI reference

The Temporal CLI bundles the Web UI: `temporal server start-dev --port 7299
--ui-port 8299 --db-filename <file>` serves it on `http://localhost:8299`
(CLI 1.9.1 ships Web UI 2.54.1). A scratch Worker in any SDK, run against
that server, fills it with real Workflows to capture (Playwright,
`color_scheme="dark"`).

Dark-mode look (Web UI 2.54.1): sidebar and header #191919, content
#111111, table header row #222222; a text sidebar (Namespaces, Workflows,
Schedules, Batch, Workers, Nexus, Archive, Docs) with the active item on
#1C202D; status pills are small, fully rounded, mono uppercase (Running
#113264 with #77ADDC text, Completed #193B2D with green text, Failed
#641723 with light red text); primary button #3A5BC7. The details page puts
the status badge before the Workflow ID, then a summary grid and the tabs
Timeline, Event History, Relationships, Workers, Pending Activities, Call
Stack, Queries, User Metadata, Search Attributes, Memo (the video shows
Timeline, Event History, Workers and Pending Activities, in that order).
The Timeline stacks Activity bars (#30A46C) bottom-up under a full-width
Workflow bar; labels are name pills with no duration; bar-end squares
hold the `ti-activity` icon (Workflow bar: `ti-workflow`). A retried
Activity, crashed or failed alike, reads: white square, `ti-retry` icon,
"N • name" pill, on a band from its first start to its last attempt's
start (`linear-gradient(255deg, #30A46C, #E5484D)` at opacity 0.35), then
the last attempt in the same gradient at full opacity. Pending Activities shows
the attempt as "3 / UNLIMITED", the last Worker identity and the Last
Failure as JSON. The UI shows no Worker crash marker: the video adds it as
an annotation outside the UI style.

**Why:** chapter 7 of `durable-execution` reproduces the Web UI, and viewers
who know Temporal must recognize it.

**How to access:** start the dev server as above, run Workflows against it,
then open or screenshot the pages; stop the server and Workers afterwards.
