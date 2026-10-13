# Temporal Agent Harness

Run AI agents as durable Temporal Workflows with the AI SDKs you already use:
turns, human approvals, one event stream, typed subagents and Code Mode.

[Watch the video](/themes/agent-harness/)

Meet Temporal Agent Harness: an experimental project to build durable AI agents
on Temporal.

## Chapter 1: An agent harness

[Watch from 0:11](/themes/agent-harness/#t=11)

An AI agent is a model, plus tools, plus a loop. You write that loop with the AI
SDK you already know. The harness doesn't replace your loop, it wraps it: every
agent runs as a durable Temporal Workflow. A message starts a turn: the harness
runs your loop, streams the reply, then waits for the next message. The next
message opens turn 2. The agent stays alive between turns, with its state
intact. Each model or tool call is one step. A turn runs until the agent is
idle: often many steps. The harness saves each call as it completes, and streams
every step of the turn live. It adds what is painful to build yourself: crash
recovery, approvals, observability, composition.

## Chapter 2: Survives crashes

[Watch from 1:17](/themes/agent-harness/#t=77)

Every model call and tool call is saved in the agent's Temporal history as soon
as it completes. The next step starts only after the previous result is saved,
outside the app. If the app crashes mid-turn, another copy picks up the agent
exactly where it left off. Instance B replays the history: steps 1 to 4 return
their saved results, then step 5 runs for real. Saved results are reused, not
redone: no finished model call is paid again, no finished tool reruns.

## Chapter 3: Human approvals

[Watch from 2:01](/themes/agent-harness/#t=121)

Some tool calls need a person's OK first, like a payment. The approval policy
decides which ones. The call pauses inside the Workflow, for minutes or days,
then resumes as soon as someone approves. Auto mode lets code or a model approve
routine calls, judged against criteria you define. It can also deny a call, like
a $6,800 suite: the tool never runs and the model is told why. Calls it
escalates, like a $2,400 hotel, still go to a human.

## Chapter 4: One event stream

[Watch from 2:46](/themes/agent-harness/#t=166)

Every agent publishes the same event stream: turns, model calls, tool calls,
approvals and token usage. Watch an agent live: each event shows up in the
console as soon as it happens. Or replay it afterward: exactly what it did, what
it cost and where a human stepped in.

## Chapter 5: Typed, composable agents

[Watch from 3:12](/themes/agent-harness/#t=192)

An agent is more than text in, text out: it exposes typed operations, with their
inputs and outputs. Other agents read that interface and add its operations to
their own tools. To use it, the parent starts TravelAgent as a child workflow: a
new instance with its own history. A typed request goes in, TravelAgent does the
work, and a typed result comes back. When its work is done, the parent closes
the instance: a subagent never outlives its parent.

## Chapter 6: Code Mode

[Watch from 3:54](/themes/agent-harness/#t=234)

Without Code Mode, the model calls its tools one at a time: one round trip per
call. With Code Mode, the model writes a short Python script instead. Parallel
calls and the logic between them run inside the script, as one tool call. Every
call stays durable, gated and visible, and the whole script takes one round
trip, not three.

## Chapter 7: Callback tools

[Watch from 4:29](/themes/agent-harness/#t=269)

Callback tools run where the agent can't reach, like the user's laptop or a
private network. The agent waits durably for the result, for seconds or days,
without tying up compute.

## Chapter 8: Typed sessions

[Watch from 4:46](/themes/agent-harness/#t=286)

The harness generates TypeScript types from your agent's Python class: its state
and its messages. Typed React and Svelte SDKs turn your agent into a live, typed
session inside your product UI.

## Chapter 9: What you get

[Watch from 5:07](/themes/agent-harness/#t=307)

Durable, observable, composable agents with human approvals, built with the AI
SDKs you already use.

## Outro

[Watch from 5:19](/themes/agent-harness/#t=319)

Temporal Agent Harness is experimental and open source. Try the examples and
build your own agents.
