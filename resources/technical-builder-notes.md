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

## Containment and blast radius

Human approval is necessary, but it is not the only safety control. Reviewers can get tired of prompts, especially if the system asks for approval too often.

For any agent with tools, also define what the agent is technically unable to do:

```text
File or folder boundary:
Network / egress boundary:
External accounts reachable:
Write actions disabled by default:
Sandbox or test environment:
Rollback path if something goes wrong:
```

Good workshop default: start in a sandbox, with export files or read-only access, then add approval-gated writes only after sample runs are passing.

### MCP implementation note

MCP can make tool connections cleaner, especially when several agents or apps need the same source. It does not make the source safe by default.

For each MCP server or connector, record:

```text
Server / connector:
Workflow that may use it:
Read permissions:
Write permissions:
Who may invoke it:
Approval required before:
Run log location:
Owner:
```

If an agent or workflow is exposed as an MCP server, treat it like a new internal tool. Decide who can call it and what it is allowed to do before connecting it to other systems.

## State and memory

Most first agents do not need complex memory.

Use simple state first:

- current task input
- relevant template
- prior approved examples
- previous run summary if useful
- reviewer notes

Avoid letting memory silently change behavior. If memory affects output, make it visible or reviewable.

## Modular instructions

Do not cram every policy, checklist, style guide, and playbook into one giant prompt. Policy-heavy agents are easier to review when instructions are modular.

For each instruction module, record:

```text
Name:
When to load it:
Owner:
Source document:
Last reviewed:
Allowed workflow:
```

Examples: intake checklist, renewal follow-up rules, client communication style, jurisdiction-specific legal disclaimer, compliance escalation rule.

## Human approval

Human-in-the-loop is not a weakness.

It is the control layer.

Use approval before:

- external messages are sent
- records are changed
- recommendations become final
- sensitive documents are moved
- anything legal, medical, financial, insurance, or compliance-related is acted on

## Lightweight governance record

Conservative teams do not need a large governance program to start, but they do need a visible record. For each proposed agent, keep one short note:

```text
Workflow owner:
Business purpose:
Data touched:
External systems touched:
Actions the agent may take without approval:
Actions requiring approval:
Evaluation evidence:
Failure / rollback plan:
Review cadence:
```

This maps well to the NIST-style pattern of governing the use case, mapping risks, measuring results, and managing changes.

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
- LangGraph is useful when the workflow needs durable graph orchestration, state, memory, middleware, interrupts, and inspection.
- MCP can make tool connections more modular, but it does not remove the need for permissions, data minimization, approval, and review.
- Treat sandboxing, egress limits, read-only modes, and tool scopes as first-class product requirements, not optional hardening.
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
