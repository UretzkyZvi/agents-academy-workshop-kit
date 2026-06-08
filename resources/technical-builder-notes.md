# Technical Builder Notes

This repo is not an agent framework.

It is a workflow design kit. The technical job is to turn a clear workflow and agent spec into the smallest reliable implementation.

## Implementation principle

Build a controlled loop first.

```text
Input -> context assembly -> model/tool step -> structured output -> human review -> log -> eval -> next run
```

Avoid starting with an autonomous multi-agent architecture unless the workflow proves it needs that complexity.

## Minimum viable agent architecture

A practical first build needs:

- a trigger: manual, scheduled, webhook, inbox event, form submission
- signal points: Gmail, Calendar, CRM, forms, folders, spreadsheets, or other sources that tell the agent what needs attention
- input sources: files, notes, CRM records, emails, tickets, documents
- context rules: what the agent may read and what must stay out
- tool permissions: explicit allowlist
- output schema: predictable format
- approval checkpoint: who reviews and what they approve
- logging: inputs, outputs, tool calls, reviewer decision
- evaluation: spec compliance, accuracy, usefulness, review effort, risk

## Tool boundary

Every tool is a capability.

Define:

```text
Tool name:
Purpose:
Allowed inputs:
Forbidden inputs:
Allowed actions:
Forbidden actions:
Approval required before:
Logging required:
Failure behavior:
```

Do not give broad tool access because it is convenient.
Give narrow access because the workflow requires it.

## State and memory

Most first agents do not need complex memory.

Use simple state first:

- current task input
- relevant template
- prior approved examples
- previous run summary if useful
- reviewer notes

Avoid letting memory silently change behavior. If memory affects output, make it visible or reviewable.

## Human approval

Human-in-the-loop is not a weakness.

It is the control layer.

Use approval before:

- external messages are sent
- records are changed
- recommendations become final
- sensitive documents are moved
- anything legal, medical, financial, insurance, or compliance-related is acted on

## Evaluation

Do not evaluate only with vibes.

Track:

```text
Spec compliance: 1-5
Accuracy: 1-5
Usefulness: 1-5
Review effort: minutes
Risk control: 1-5
Time saved: minutes
Reviewer decision: approve / edit / reject / escalate
```

For business teams, local workflow evals matter more than public benchmark scores.

## Platform notes

- Manual LLM chat is enough for early samples.
- Hermes Agent is useful for tool-using workflows, files, messaging, cron, browser/web, and multi-agent operations.
- OpenAI Agents SDK is useful for OpenAI-first applications with tools, handoffs, sessions, guardrails, human-in-the-loop, and tracing.
- LangGraph is useful when the workflow needs durable graph orchestration, state, memory, and inspection.
- MCP can make tool connections more modular, but it does not remove the need for permissions and review.
- Signal point integrations should usually start as export-based tests, then read-only API access, then approval-gated write actions if needed.
- n8n, Make, and Zapier are useful after the approval flow is clear.

## Anti-patterns

Avoid:

- agent-first design
- vague system prompts
- unrestricted tools
- hidden memory that changes behavior
- autonomous customer communication
- no logs
- no evals
- no kill criteria

## Good first technical milestone

The first milestone should be boring:

```text
Given one sample input, the agent produces the expected structured draft, logs the run, and waits for human approval.
```

If that works across three samples, then automate the trigger.
