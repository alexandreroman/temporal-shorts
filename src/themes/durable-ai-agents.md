# Durable AI Agents with Temporal

How an AI agent works, from LLM calls and tools to the agentic loop, and why it
needs Durable Execution with Temporal to keep its progress.

[Watch the video](/themes/durable-ai-agents/)

AI agents search, book and send emails for us. But how do they actually work?

## Chapter 1: LLM calls

[Watch from 0:08](/themes/durable-ai-agents/#t=8)

At the heart of every AI agent is an LLM: a large language model, like those
from OpenAI, Anthropic or Google. An app sends it some text. The model reads it,
then writes a reply, word by word. That's an LLM call: text in, text out.
Nothing more.

## Chapter 2: Stateless by design

[Watch from 0:28](/themes/durable-ai-agents/#t=28)

Surprise: the model has no memory. Tell it your name. Then ask again in the next
call: it has already forgotten. That's by design: LLMs are stateless. So the
whole conversation is sent again with every call.

## Chapter 3: The context window

[Watch from 0:47](/themes/durable-ai-agents/#t=47)

Everything sent to the model fits on one page: the context window. Instructions,
history, documents, the new question. It's the only thing the model sees. It has
a size limit, and every word on it is billed, at every call.

## Chapter 4: Tools

[Watch from 1:04](/themes/durable-ai-agents/#t=64)

The model can't check the weather or send an email. So we give it tools. When it
needs one, the model writes a request: "use the Weather tool, for Paris". The
app runs it. The app adds the result to the context, then calls the model again.

## Chapter 5: The agentic loop

[Watch from 1:26](/themes/durable-ai-agents/#t=86)

Repeat until the goal is reached: think, act, observe. That's the agentic loop.
"Book lunch with Marie on Thursday": check the calendar, find a restaurant, book
a table, send the invite. An AI agent is a model, plus tools, plus a loop,
working toward a goal.

## Chapter 6: When the agent crashes

[Watch from 1:47](/themes/durable-ai-agents/#t=107)

Now the app running the agent crashes just before the invite goes out. Restarts,
deploys, outages: it happens every day. The context lived in the app's memory,
not in the LLM. It's gone, so the agent has to start over. The LLM calls are
made, and paid for, a second time, just to rebuild the context. And the table
gets booked twice.

## Chapter 7: Durable Execution with Temporal

[Watch from 2:13](/themes/durable-ai-agents/#t=133)

Durable Execution with Temporal fixes this. Temporal keeps an Event History of
the agent, outside the app. After each LLM call or tool call, Temporal saves the
result in the history before the agent moves on. If the app crashes, another
copy runs the agent again from the start. For each saved step, Temporal returns
the result from the history. The LLM isn't called again: the context is rebuilt
for free.

## Chapter 8: What you get

[Watch from 2:43](/themes/durable-ai-agents/#t=163)

No saved LLM call is paid for twice, and no saved step runs again. Plus retries,
human waits and full visibility.

## Chapter 9: What you can build

[Watch from 2:53](/themes/durable-ai-agents/#t=173)

Lunch with Marie is one example: any agent that works through many steps needs
Durable Execution. Deep research, multi-agent teams, chatbots with human
approval, background agents: all survive crashes.

## Outro

[Watch from 3:09](/themes/durable-ai-agents/#t=189)

Durable AI agents keep their progress and your budget.
