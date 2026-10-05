---
name: "Budget figure"
description: "The 43% LLM spend saving is illustrative and stays marked 'in this example'"
type: project
---

# Budget figure

The budget comparison in chapter 7 is illustrative: 4 steps = 4 LLM calls;
without Durable Execution, the crash after 3 steps forces 3 calls to be
redone, so 7 calls (3/7 ≈ 43% less LLM spend with Temporal).

**Why:** the number depends on the scenario, not on a measured benchmark.

**How to apply:** keep the "in this example" label next to the percentage and
keep the figure consistent with the step count if the scenario changes.
