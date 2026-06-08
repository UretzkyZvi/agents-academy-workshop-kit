# 01 - Choose One Workflow

Do not start with "we need an AI agent."

Start with one workflow that already exists and hurts enough to matter.

## Good first workflows

A good first agent workflow is:

- repetitive
- text/document heavy
- easy to review by a human
- annoying enough that people want help
- low enough risk that a mistake can be caught before harm
- bounded enough to describe in one page

## Bad first workflows

Avoid workflows where the agent would:

- give final legal, medical, financial, or insurance advice
- contact customers without approval
- make binding decisions
- handle sensitive data in an unapproved environment
- require deep system integration before any learning happens
- replace a whole employee role

## Examples

### Small law firm

- consultation notes -> intake summary draft
- client email -> response draft for lawyer approval
- matter details -> next-step checklist
- firm SOPs -> internal FAQ answer

### Insurance agency

- renewal list -> follow-up drafts
- customer inquiry -> triage summary and draft response
- carrier notes -> internal process answer
- missing documents -> checklist and reminder draft

### Founder/operator

- market notes -> weekly brief
- leads -> personalized outreach drafts
- meeting notes -> follow-up tasks
- support messages -> categorized issue list

## Worksheet

Copy this into `templates/workflow-map.md` or your own notes.

```text
Workflow name:
Who owns it today:
Trigger:
Inputs:
Steps:
Output:
Where time is wasted:
Where errors happen:
What an agent could draft/summarize/check:
Where human approval is required:
Risk level: low / medium / high
Business value if improved:
```

## Selection score

Score 1-5:

```text
Time saved:
Risk, lower is better:
Ease:
Staff adoption:
Business urgency:
Reviewability:
```

Pick the workflow with high time saved, high reviewability, and low risk.
