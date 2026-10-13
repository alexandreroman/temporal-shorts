# Human-in-the-Loop with Temporal

How a Temporal Workflow waits for a person's approval, for minutes or days, with
deadlines and reminders, then picks up where it left off.

[Watch the video](/themes/human-in-the-loop/)

Some processes need a person to decide: approve a purchase, review a contract.
How does the app wait?

## Chapter 1: A step that needs a person

[Watch from 0:10](/themes/human-in-the-loop/#t=10)

Take a simple process: Sam orders a new laptop for $2,400. Above $1,000, a
manager must approve it. The app checks the request, then asks Maria, the
manager, to approve it. Now it waits for an answer. Maria may answer in two
minutes, or in three days: busy in meetings, traveling, or on vacation.

## Chapter 2: Waiting is the hard part

[Watch from 0:36](/themes/human-in-the-loop/#t=36)

But the app can't simply pause for three days. Its memory lives on one machine,
and machines restart. So teams build the waiting by hand: a database, status
flags, scheduled jobs, code to resume later. That's a lot of plumbing to get
right. One missed case, and a request is stuck, or ordered twice.

## Chapter 3: A Workflow that waits

[Watch from 1:02](/themes/human-in-the-loop/#t=62)

With Temporal, the whole process is a Workflow: ordinary code that runs the
steps in order. When it reaches the approval, the Workflow just waits, as long
as it takes. A minute or a month. Temporal keeps its Event History, outside the
app. Restarts and deploys come and go; the wait survives.

## Chapter 4: The decision arrives

[Watch from 1:29](/themes/human-in-the-loop/#t=89)

On day three, Maria taps Approve. Temporal records the decision in the history
as a Signal. Any running copy of the app picks it up, replays the history, and
resumes right after the wait. The order is placed and Sam is notified. No step
was redone, and nothing was lost along the way.

## Chapter 5: Deadlines and reminders

[Watch from 1:54](/themes/human-in-the-loop/#t=114)

No answer? The Workflow can also wait on a timer: a reminder after two days,
escalation after five.

## Chapter 6: What you get

[Watch from 2:04](/themes/human-in-the-loop/#t=124)

The Workflow waits for days with no code running, survives restarts and deploys,
and never redoes a saved step.

## Chapter 7: What you can build

[Watch from 2:13](/themes/human-in-the-loop/#t=133)

Sam's laptop is one case: any step where a person decides fits the same pattern.
Fraud reviews, identity checks, deploy approvals, an AI agent's tool calls: the
Workflow waits for a person.

## Outro

[Watch from 2:28](/themes/human-in-the-loop/#t=148)

Temporal Workflows wait for people as long as it takes, and pick up right where
they left off.
