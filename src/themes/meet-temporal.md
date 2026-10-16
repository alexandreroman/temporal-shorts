# Meet Temporal

Who created Temporal, its path from Amazon SWF to Uber Cadence, what it does,
where it is used, and why it matters for AI.

[Watch the video](/themes/meet-temporal/)

Many apps you use every day run on Temporal. What is it, and where does it come
from?

## Chapter 1: Where it comes from

[Watch from 0:09](/themes/meet-temporal/#t=9)

Meet Maxim Fateev and Samar Abbas, the creators of Temporal. Temporal's ideas
come from projects they built at Amazon, Microsoft and Uber. 2015: they join
Uber, where they create Cadence, the standard for Uber's critical processes.
2019: they found Temporal, a fork of Cadence, to bring it to every company.

## Chapter 2: What Temporal does

[Watch from 0:38](/themes/meet-temporal/#t=38)

The idea is Durable Execution: an app runs in steps, and Temporal records each
one outside the app. If the app crashes, another copy of the app takes over. It
gets the saved results back from the history, then picks up where it left off.
No progress is lost.

## Chapter 3: Where Temporal is used

[Watch from 1:00](/themes/meet-temporal/#t=60)

A Workflow is any process that must finish correctly: payments, orders,
bookings, subscriptions. Teams also run infrastructure, data pipelines and, more
and more, AI on Temporal.

## Chapter 4: Why it matters for AI

[Watch from 1:17](/themes/meet-temporal/#t=77)

AI agents are long processes too: many LLM calls, tools to run, and waits for a
person. With Temporal, every step the agent takes is saved in an Event History,
outside the app. When the app crashes in production, a new instance replays the
history: the agent keeps its context. No progress is lost and no tokens are
wasted: no finished LLM call is paid twice. OpenAI runs Codex on Temporal, and
Cursor and Lovable rely on it too.

## Chapter 5: How Temporal Cloud works

[Watch from 2:00](/themes/meet-temporal/#t=120)

With Temporal Cloud, your Workers run your Workflow and Activity code in your
own environment. Temporal Cloud orchestrates your Workflows and Activities, and
persists their history. You can encrypt data with your own keys before it
leaves: Temporal never sees your payloads.

## Chapter 6: Temporal today

[Watch from 2:57](/themes/meet-temporal/#t=177)

Today, more than 4,300 companies pay for Temporal, and the team has doubled in a
year. Its open source SDKs support Go, Java, Python, TypeScript, .NET, PHP, Ruby
and Rust. And they plug into AI frameworks: OpenAI Agents SDK, Vercel AI SDK,
Pydantic AI, Google ADK, LangGraph, and more. In September 2026, investors
valued Temporal at $12.55 billion. That's more than 8 times its 2022 value:
investors see it as core infrastructure for AI.

## Outro

[Watch from 3:46](/themes/meet-temporal/#t=226)

Temporal keeps code running through crashes and outages, from everyday apps to
AI agents.
