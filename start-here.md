# Start Here

This repo has different paths because people come to AI agents with very different needs.

A single mother exploring AI agents for the first time does not need the same explanation as a technical developer building an agent runtime.

Both deserve clear language.

## Pick your path

### 1. Curious beginner

Use this path if you are asking:

- What is an AI agent?
- Could this help me with work or life admin?
- What is safe to try first?
- How do I avoid getting overwhelmed?

Start with:

1. [AI agents in plain English](resources/ai-agents-in-plain-english.md)
2. [Choose one workflow](workshop/01-choose-a-workflow.md)
3. [Workflow map template](templates/workflow-map.md)

Goal: find one small, safe task where an agent can help draft, summarize, organize, or remind.

### 2. Small business owner or team lead

Use this path if you are asking:

- Where can agents save time in my business?
- What should my team not automate?
- How do I keep a human in control?
- What would a first pilot look like?

Start with:

1. [Choose one workflow](workshop/01-choose-a-workflow.md)
2. [Write the agent spec](workshop/02-write-an-agent-spec.md)
3. [Human approval flow](templates/human-approval-flow.md)
4. [Evaluation checklist](templates/eval-checklist.md)

Goal: leave with one low-risk pilot workflow and a clear review process.

### 3. Non-technical operator

Use this path if you own a workflow but do not write code.

Start with:

1. [AI agents in plain English](resources/ai-agents-in-plain-english.md)
2. [Workflow map template](templates/workflow-map.md)
3. [Agent spec template](templates/agent-spec.md)
4. [Run the first agent loop](workshop/03-run-the-first-agent.md)

Goal: describe the agent well enough that a tool, developer, or consultant can build the right thing.

### 4. Technical developer

Use this path if you are asking:

- How do I turn the workflow into an implementation?
- What tools should the agent be allowed to call?
- Where do state, logs, evals, and approvals live?
- How should I avoid unsafe autonomy?

Start with:

1. [Technical builder notes](resources/technical-builder-notes.md)
2. [Agent spec template](templates/agent-spec.md)
3. [Tools and platforms](resources/tools-and-platforms.md)
4. [Evaluation checklist](templates/eval-checklist.md)

Goal: implement the smallest useful loop with clear boundaries, observability, and human approval.

## The shared idea

No matter which path you choose, the pattern is the same:

```text
Pick one real workflow
-> describe the agent's job
-> define tools and limits
-> require human approval where needed
-> test with real or synthetic samples
-> decide build / refine / stop
```

The language changes by audience.
The safety pattern does not.
