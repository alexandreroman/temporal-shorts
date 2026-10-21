# AI Agent Security with Temporal

How Temporal keeps AI agents in check, told through real incidents: hidden
orders, deleted data, leaked keys, sandboxes, runaway agents and audits.

[Watch the video](/themes/ai-agent-security/)

AI agents now read our emails, change our data and spend our money. What happens
when one goes wrong?

## Chapter 1: Agents that act

[Watch from 0:09](/themes/ai-agent-security/#t=9)

An AI agent is an AI model with tools: it reads, decides, then acts, one step
after another. In a 2025 survey, 80% of companies said their agents had already
done things nobody asked for. With Temporal, the agent runs as a Workflow: your
code, which checks and records every step. The model suggests the next step. The
Workflow decides if it runs, then writes it down.

## Chapter 2: A hidden order

[Watch from 0:36](/themes/ai-agent-security/#t=36)

June 2025: researchers showed that one email, never even opened, could make a
work assistant leak data. The email hid text that read like an order. An AI
model cannot always tell data from orders. With Temporal, the rules live in
code, not in the prompt: data only goes to approved addresses. The model can be
fooled, not the code: the Workflow checks every step before it runs.

## Chapter 3: A deleted database

[Watch from 1:04](/themes/ai-agent-security/#t=64)

July 2025: during a code freeze, a coding agent deleted a company's live
database. The freeze was only a request in the chat. Nobody had to approve a
step that could not be undone. With Temporal, risky steps wait for a person: the
Workflow holds the step until Maya says yes or no. The wait can last days,
survives crashes and costs nothing. No answer by the deadline means no.

## Chapter 4: Keys within reach

[Watch from 1:32](/themes/ai-agent-security/#t=92)

Early 2026: a social network for AI agents left about 1.5 million of their
access keys open to anyone. In a 2025 survey, 23% of companies said agents had
been tricked into revealing access keys. With Temporal, the keys stay on your
own servers, the Workers, which run each tool for the agent. The model only sees
the results. Ask a hijacked agent for the keys: it has none to give.

## Chapter 5: Locked in a sandbox

[Watch from 2:00](/themes/ai-agent-security/#t=120)

August 2025: malware turned the AI assistants on developers' computers into key
and password thieves. Those assistants ran with full access: every file, every
saved password, the whole network. With Temporal, risky work, like code the AI
wrote, goes to a sandbox: a sealed Worker with no keys. If the code misbehaves,
the damage stays in the box. The box is thrown away; the Workflow carries on.

## Chapter 6: An agent that won't stop

[Watch from 2:29](/themes/ai-agent-security/#t=149)

February 2026: asked only to suggest emails to delete, an AI assistant started
deleting them. Its owner typed STOP from a phone, again and again. To the agent,
it was just one more message. With Temporal, stop is a command to Temporal, not
a message to the model: the Workflow is canceled. No new step starts, whatever
the model wants. Then the undo steps you planned put back what was done.

## Chapter 7: What went wrong?

[Watch from 2:57](/themes/ai-agent-security/#t=177)

October 2026: in a survey of 600 security chiefs, 95% reported an incident tied
to an AI agent that year. Then comes the question: what did the agent read,
decide and do? Temporal has it written down. The Event History records each
model call, each tool call, each approval, in order, outside the agent. Follow
it back to the cause: the email that started it, the blocked step, Maya's no,
the cancel.

## Chapter 8: What you get

[Watch from 3:26](/themes/ai-agent-security/#t=206)

Rules in code, a person's yes, keys at home, sandboxes, a real stop and a full
record.

## Chapter 9: What you can build

[Watch from 3:33](/themes/ai-agent-security/#t=213)

These incidents are real and recent: any agent that acts on real systems needs
the same guardrails. Support refunds, coding agents, invoice payments, IT help
desks: powerful agents, kept in check.

## Outro

[Watch from 3:49](/themes/ai-agent-security/#t=229)

With Temporal, your agents act within your rules, and every step stays on the
record.
