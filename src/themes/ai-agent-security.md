# AI Agent Security with Temporal

How Temporal keeps AI agents in check, told through real incidents: malicious
add-ons, a wiped database, a hidden order and the audit that follows.

[Watch the video](/themes/ai-agent-security/)

AI agents now read our emails, change our data and spend our money. What happens
when one goes wrong?

## Chapter 1: Agents that act

[Watch from 0:11](/themes/ai-agent-security/#t=11)

An AI agent is an AI model with tools: it reads, decides, then acts, one step
after another. Its tools are often a terminal, a browser or code: almost
anything is possible, the bad included. With Temporal, the agent runs as a
Workflow: your code, which runs and records every step. The model thinks, the
tools act, each where you choose. Temporal keeps the state and the record.

## Chapter 2: Locked in a sandbox

[Watch from 0:40](/themes/ai-agent-security/#t=40)

February 2026: a hidden instruction in an issue title made an AI bot install an
attacker's code. The bot's code poisoned a cache shared with the release
pipeline, exposing its publishing keys. With Temporal, the agent's tools run in
a sandbox, such as Amazon Bedrock AgentCore, Modal, E2B or Daytona. No keys, no
internet, a fresh box at will: poison does not stay, and progress lives in
Temporal.

Sources: [Adnan Khan, February 2026](https://adnanthekhan.com/posts/clinejection/), [Project post-mortem, February 2026](https://cline.bot/blog/post-mortem-unauthorized-cline-cli-npm), [Temporal blog, April 2026](https://temporal.io/blog/introducing-temporal-and-agentic-sandboxes-openai-agents-sdk), [Temporal blog, September 2026](https://temporal.io/blog/amazon-bedrock-agentcore-with-temporal-serverless-workers)

## Chapter 3: Keys out of reach

[Watch from 1:12](/themes/ai-agent-security/#t=72)

April 2026: a coding agent deleted a company's production database and its
backups, in 9 seconds. It found a key in an unrelated file, made for domains but
with full access, and called the cloud itself. With Temporal, the box cannot
reach the cloud, key or not. The database stays with its team, behind Nexus.
Only listed teams get in, and a step that cannot be undone waits for a person:
Maya says no, on record.

Sources: [Hackread, April 2026](https://hackread.com/cursor-ai-agent-wipes-pocketos-database-backups/), [AI Incident Database](https://incidentdatabase.ai/cite/1469/), [Temporal docs, Nexus security](https://docs.temporal.io/nexus/security)

## Chapter 4: A hidden order

[Watch from 1:44](/themes/ai-agent-security/#t=104)

August 2026: researchers showed that hidden text in a document could make a work
assistant leak data. No filter catches every trick: a fooled agent can hide data
in a link, a ticket or a search. With Temporal, the Workflow notes that outside
content came in, and the model cannot erase that note. From then on, any step
that reaches outside waits for a person, and the box has no other way out. With
the Temporal Agent Harness, allowed tools run; others wait for a person or a
rule that can refuse.

Sources: [PromptArmor, August 2026](https://www.promptarmor.com/resources/atlassian-rovo-exfiltrates-data), [Meta, October 2025](https://ai.meta.com/blog/practical-ai-agent-security/), [Temporal blog, August 2026](https://temporal.io/blog/temporal-agent-harness-durable-agent-infrastructure), [Temporal Agent Harness](https://github.com/temporal-community/temporal-agent-harness)

## Chapter 5: What went wrong?

[Watch from 2:23](/themes/ai-agent-security/#t=143)

October 2026: in a survey of 600 security chiefs, 95% tied an insider incident
to an AI agent in a year. Then come the questions: what did the agent read,
decide and do? Its own account may be wrong. The Event History records each
model call, tool call and approval, in order, out of the agent's reach. Follow
it back to the cause, then find every other run that read the same document.

Sources: [Help Net Security, October 2026](https://www.helpnetsecurity.com/2026/10/14/ciso-ai-agent-insider-risk/), [Temporal docs, Search Attributes](https://docs.temporal.io/search-attribute)

## Chapter 6: What you get

[Watch from 2:53](/themes/ai-agent-security/#t=173)

Throwaway sandboxes, keys kept apart, a person's yes when it counts, and a
record of every step.

## Outro

[Watch from 3:02](/themes/ai-agent-security/#t=182)

With Temporal, your agents act within your rules, and every step stays on the
record.
