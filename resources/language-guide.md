# Language Guide for Teaching AI Agents

Different audiences need different explanations.

The mistake is not simplifying.
The mistake is using the wrong level of detail for the person in front of you.

## Rule of thumb

Start with the person's life or work.
Then explain the agent.
Then introduce technical terms only when they help.

## Audience levels

### Level 1: Curious beginner

Example person: a single mother exploring AI agents because she wants less mental load.

Use language like:

- helper
- task
- weekly plan
- draft
- reminder
- review before sending
- keep you in control

Avoid starting with:

- orchestration
- MCP
- vector database
- function calling
- autonomous workflows
- eval harness

Good explanation:

```text
An agent is a helper you can give a repeated job to. For example: every Sunday, turn your notes, appointments, school messages, and errands into a weekly plan. It can draft messages, but you approve before anything is sent.
```

### Level 2: Small business owner

Example person: a law firm owner, insurance agency owner, or practice manager.

Use language like:

- repetitive admin work
- intake
- follow-up
- checklist
- staff review
- approval step
- safer first pilot
- time saved

Good explanation:

```text
An agent can prepare the work your team already reviews: intake summaries, follow-up drafts, missing-information checklists, and internal process answers. The team keeps control because the agent drafts and flags, but does not decide or send without approval.
```

### Level 3: Operator or manager

Example person: someone who owns the process but does not write code.

Use language like:

- trigger
- inputs
- steps
- output
- owner
- exception
- approval point
- success metric

Good explanation:

```text
Before choosing tools, write the workflow down: what starts it, what information comes in, what steps happen, what the output should be, where errors happen, and where a human must approve.
```

### Level 4: Technical developer

Example person: an engineer building the agent loop.

Use language like:

- state
- tool permissions
- structured output
- logs
- evals
- tracing
- retries
- human-in-the-loop
- integration boundary

Good explanation:

```text
Implement the smallest controlled loop: input, context assembly, model/tool step, structured output, approval checkpoint, log, eval, and iteration. Keep tool access allowlisted and make approval explicit before external side effects.
```

## Same concept, four explanations

Concept: human approval.

### Beginner

```text
The agent can help you write or organize things, but you still check before anything important happens.
```

### Business owner

```text
The agent drafts the work. Your team approves before it goes to a client or changes a record.
```

### Operator

```text
Add an approval checkpoint between the agent output and the final action.
```

### Developer

```text
Gate external side effects behind an explicit approval state. Log the reviewer, decision, timestamp, output version, and final action.
```

## Writing checklist

Before publishing a workshop doc, ask:

- Who is this page for?
- What do they already understand?
- What words might scare them off?
- What words are too vague for them?
- What action should they take next?
- Does the page keep humans responsible for important decisions?

## Editorial stance

Use plain language by default.
Add technical depth as a second layer.
Never make beginners feel stupid.
Never make developers guess the implementation boundary.
