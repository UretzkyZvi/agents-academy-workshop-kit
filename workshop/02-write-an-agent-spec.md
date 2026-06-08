# 02 - Write the Agent Spec

An agent spec is the contract between the human and the agent.

If the job is vague, the agent will improvise. That is usually where demos turn into risk.

## Minimum agent spec

Use this structure:

```text
Agent name:
Job:
Trigger:
Inputs:
Allowed tools:
Forbidden actions:
Steps:
Output format:
Human approval required before:
Success metric:
Failure conditions:
Escalation rule:
```

## Example

```text
Agent name: Legal intake summary agent
Job: Turn consultation notes into a structured intake summary draft.
Trigger: Staff uploads notes after a consultation.
Inputs: Notes, client-provided facts, matter type, jurisdiction if already known.
Allowed tools: Read provided notes, use firm-approved template, draft summary.
Forbidden actions: Give legal advice, promise outcomes, contact client, file anything.
Steps:
1. Identify matter type.
2. Extract key facts.
3. List missing information.
4. Draft next-step checklist for lawyer review.
Output format: intake summary, missing info, suggested next steps, risk flags.
Human approval required before: anything is sent to client or added as final matter record.
Success metric: lawyer can review in under 5 minutes.
Failure conditions: missing source notes, uncertain matter type, privilege/sensitive handling concern.
Escalation rule: flag uncertainty instead of guessing.
```

## Guardrail language

Good agent specs say:

- draft, summarize, classify, checklist, flag

Risky specs say:

- decide, approve, advise, guarantee, autonomously send, replace

## Done condition

You are done when another person can read the spec and know exactly:

- what the agent does
- what it must not do
- what the human reviews
- how success will be judged
