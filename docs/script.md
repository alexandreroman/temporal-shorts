# Script and timeline (v2, English, 2:59)

Subtitles are the only narration (no audio). Timings are computed in `src/engine.js` from text length
(`autoDur`: chars / 16 + 0.6 s, clamped 2.4 to 8 s), plus per-subtitle `after` pauses. Run `make timeline`
for the live values; this table is a snapshot from 2026-10-05.

| # | Chapter | Start | Subtitle | What the animation shows |
|---|---|---|---|---|
| 0 | Intro | 0:01 | AI agents search, book and send emails for us. But how do they actually work? | Temporal logo, title "How does an AI agent work?", LLM orb with orbiting tool icons |
| 1 | 01 LLM calls | 0:08 | At the heart of every AI agent is an LLM: a large language model, like those from OpenAI, Anthropic or Google. | Orb appears, tags OPENAI / ANTHROPIC / GOOGLE |
| | | 0:16 | An app sends it some text. The model reads it, then writes a reply, word by word. | App window, "LLM call" arrow, question card flies in, reply typed word by word |
| | | 0:22 | That's an LLM call: text in, text out. Nothing more. | TEXT IN -> orb -> TEXT OUT |
| 2 | 02 Stateless by design | 0:28 | Surprise: the model has no memory. Tell it your name… | Call 1: "Hi, I'm Alex." / "Nice to meet you, Alex!", "Alex" bubble above orb |
| | | 0:33 | …then ask again in the next call. It has already forgotten. | Bubble wiped, Call 2: "What's my name?" / "I don't know…" (red) |
| | | 0:39 | That's by design: LLMs are stateless. So the app resends the whole conversation with every call. | STATELESS tag, "Full history" card sent, "You're Alex!" |
| 3 | 03 The context window | 0:48 | Everything sent to the model fits on one page: the context window. Instructions, history, documents, the new question. | Page fills with 4 blocks, size gauge |
| | | 0:57 | It's the only thing the model sees. It has a size limit, and every word on it is billed, at every call. | Vision cone, "Yesterday's email: not in context", gauge FULL, token counter "billed at every call" |
| 4 | 04 Tools | 1:06 | The model can't check the weather or send an email. So we give it tools. | Crossed-out icons, toolbox: Weather / Calendar / Email / Web search |
| | | 1:12 | When it needs one, the model writes a request: "use the Weather tool, for Paris". The app runs it… | Request card (tool: weather, city: Paris) goes to the app, app calls the tool, "18°C, sunny" |
| | | 1:20 | …adds the result to the context, and calls the model again. | "Full context" bundle, Call 2, answer card |
| 5 | 05 The agentic loop | 1:28 | Repeat until the goal is reached: think, act, observe. That's the agentic loop. | Think / Act / Observe loop with travelling token |
| | | 1:35 | "Book lunch with Marie on Thursday": check the calendar, find a restaurant, book a table, send the invite. | 4 loop turns, each fills a task row, GOAL REACHED |
| | | 1:43 | An AI agent is a model, plus tools, plus a loop, working toward a goal. | MODEL + TOOLS + LOOP = AI AGENT |
| 6 | 06 When the agent crashes | 1:50 | Now the app running the agent crashes in the middle of the booking. Restarts, deploys, network cuts: it happens every day. | 4 steps, APP MEMORY blocks, LLM CALLS BILLED counter (3), ticket "1 booking", flash + APP CRASH |
| | | 1:59 | The context lived in the app's memory, not in the LLM. It's gone, so the agent has to start over. | Memory blocks fall, EMPTY, "Start over" arrow |
| | | 2:06 | Every LLM call is made, and paid for, a second time, just to rebuild the context. And the table gets booked twice. | Steps re-run, counter 6 with "+3 wasted", "2 BOOKINGS!" |
| 7 | 07 Durable Execution with Temporal | 2:16 | Durable Execution with Temporal fixes this. Every completed step is recorded in an Event History. | Large Temporal logo, then APP INSTANCE A writing to the EVENT HISTORY (stored outside the app), each row tagged "SAVED" |
| | | 2:25 | If the app crashes, another copy of it takes over, replays the history, and resumes exactly where it stopped. | A crashes: "APP CRASHED HERE" line under row 6, rows 1 to 6 grouped as kept. APP INSTANCE B replays (scan), tags turn "REUSED", step 4 runs (rows 7 and 8 "SAVED"), AGENT COMPLETE |
| | | 2:34 | Previous LLM calls aren't lost: their results come straight from the history. Nothing is re-run, no token is paid twice. | Tags rows 1 to 6: "REUSED, NOT RE-BILLED" (LLM calls) / "REUSED, NOT RE-RUN" (tool results), then budget chart: 7 calls (3 wasted) vs 4 calls (0 wasted), "43% less LLM spend in this example" |
| | | 2:43 | No duplicate booking either. Plus automatic retries, waiting days for a human, and full visibility. | 4 tiles: One booking only / Automatic retries / Waits for humans / Full visibility |
| 8 | Outro | 2:52 | Durable AI agents never lose their progress, or your budget. | "Durable AI agents", Temporal logo |

The budget numbers are deliberately illustrative ("in this example"): 4 steps = 4 LLM calls; a crash after
3 steps without durable execution re-runs those 3, so 7 calls in total (3/7 ≈ 43% wasted).
