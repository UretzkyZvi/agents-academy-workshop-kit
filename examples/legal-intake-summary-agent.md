# Example: Legal Intake Summary Agent

## Use case

Turn consultation notes into a structured intake summary draft for lawyer review.

## Agent spec

```text
Agent name: Legal intake summary agent
Job: Draft a structured intake summary from notes.
Trigger: Consultation notes are added after a call.
Inputs: Notes, matter type if known, client-provided facts.
Allowed tools: Read notes, use approved summary template, draft checklist.
Forbidden actions: Give legal advice, contact client, promise outcomes, file documents, make final legal conclusions.
Output format:
- Matter type if known
- Key facts
- Timeline
- Missing information
- Questions for lawyer
- Draft next-step checklist
Human approval required before: summary becomes final matter record or client communication.
Success metric: lawyer can review and correct in under 5 minutes.
Failure conditions: missing notes, conflicting facts, unclear matter type, sensitive-data handling concern.
Escalation rule: flag uncertainty instead of guessing.
```

## Why this is a good first agent

It is useful, reviewable, and bounded. The lawyer keeps control.
