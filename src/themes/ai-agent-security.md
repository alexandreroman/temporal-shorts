# AI Agent Security with Temporal

How Temporal keeps AI agents in check, told through real incidents: hidden
orders, deleted data, leaked keys, sandboxes, runaway agents and audits.

[Watch the video](/themes/ai-agent-security/)

AI agents now read our emails, change our data and spend our money. What happens
when one goes wrong?

## Chapter 1: Agents that act

[Watch from 0:11](/themes/ai-agent-security/#t=11)

An AI agent is an AI model with tools: it reads, decides, then acts, one step
after another. In a 2025 survey, 80% of companies said their agents had already
done things nobody asked for. With Temporal, the agent runs as a Workflow: your
code, which checks and records every step. The model suggests the next step. The
Workflow decides if it runs, then writes it down.

Source: [SailPoint survey, May 2025](https://www.hpcwire.com/aiwire/2025/06/04/sailpoint-research-reveals-ai-agents-as-enterprise-security-blind-spot/)

## Chapter 2: A hidden order

[Watch from 0:39](/themes/ai-agent-security/#t=39)

August 2026: researchers showed that hidden text in a document could make a work
assistant leak data. The document hid text that read like an order. An AI model
cannot always tell data from orders. With Temporal, the rules live in code, not
in the prompt: data only goes to approved addresses. The model can be fooled,
not the code: the Workflow checks every step before it runs.

Source: [PromptArmor, August 2026](https://www.promptarmor.com/resources/atlassian-rovo-exfiltrates-data)

## Chapter 3: A deleted database

[Watch from 1:07](/themes/ai-agent-security/#t=67)

April 2026: a coding agent deleted a company's production database and its
backups, in 9 seconds. It found a key with too much power and used it. Nobody
had to approve a step that could not be undone. With Temporal, risky steps wait
for a person: the Workflow holds the step until Maya says yes or no. The wait
can last days, survives crashes and costs nothing. No answer by the deadline
means no.

Sources: [Hackread, April 2026](https://hackread.com/cursor-ai-agent-wipes-pocketos-database-backups/), [AI Incident Database](https://incidentdatabase.ai/cite/1469/)

## Chapter 4: Keys within reach

[Watch from 1:38](/themes/ai-agent-security/#t=98)

February 2026: a social network for AI agents left about 1.5 million of their
access keys open to anyone. March 2026: researchers showed a cloud AI agent
using its own keys to read every storage bucket of its project. With Temporal,
the keys stay on your own servers, the Workers, which run each tool for the
agent. The model only sees the results. Ask a hijacked agent for the keys: it
has none to give.

Sources: [Wiz, February 2026](https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys), [Unit 42, March 2026](https://unit42.paloaltonetworks.com/double-agents-vertex-ai/)

## Chapter 5: Locked in a sandbox

[Watch from 2:08](/themes/ai-agent-security/#t=128)

February 2026: 341 malicious add-ons for an AI assistant were found, most
installing a password thief. Those add-ons ran with full access: every file,
every saved password, the whole network. With Temporal, risky work like add-ons
or AI-written code goes to a sandbox: a sealed Worker, no keys. If the code
misbehaves, the damage stays in the box. The box is thrown away; the Workflow
carries on.

Source: [The Hacker News, February 2026](https://thehackernews.com/2026/02/researchers-find-341-malicious-clawhub.html)

## Chapter 6: An agent that won't stop

[Watch from 2:40](/themes/ai-agent-security/#t=160)

February 2026: asked only to suggest emails to delete, an AI assistant started
deleting them. Its owner typed STOP from a phone, again and again. To the agent,
it was just one more message. With Temporal, stop is a command to Temporal, not
a message to the model: the Workflow is canceled. No new step starts, whatever
the model wants. Then the undo steps you planned put back what was done.

Source: [SF Standard, February 2026](https://sfstandard.com/2026/02/25/openclaw-goes-rogue/)

## Chapter 7: What went wrong?

[Watch from 3:09](/themes/ai-agent-security/#t=189)

October 2026: in a survey of 600 security chiefs, 95% reported an incident tied
to an AI agent that year. Then comes the question: what did the agent read,
decide and do? Temporal has it written down. The Event History records each
model call, each tool call, each approval, in order, outside the agent. Follow
it back to the cause: the document that started it, the blocked step, Maya's no,
the cancel.

Source: [Help Net Security, October 2026](https://www.helpnetsecurity.com/2026/10/14/ciso-ai-agent-insider-risk/)

## Chapter 8: What you get

[Watch from 3:39](/themes/ai-agent-security/#t=219)

Rules in code, a person's yes, keys at home, sandboxes, a real stop and a full
record.

## Chapter 9: What you can build

[Watch from 3:47](/themes/ai-agent-security/#t=227)

These incidents are real and recent: any agent that acts on real systems needs
the same guardrails. Support refunds, coding agents, invoice payments, IT help
desks: powerful agents, kept in check.

## Outro

[Watch from 4:02](/themes/ai-agent-security/#t=242)

With Temporal, your agents act within your rules, and every step stays on the
record.
