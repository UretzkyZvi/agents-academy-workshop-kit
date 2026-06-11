# Human Approval Flow Template

Use this before an agent sends, files, approves, or finalizes anything.

```text
Agent output:
Reviewer:
What reviewer checks:
Approval options:
- approve as-is
- approve with edits
- reject
- escalate

Agent may proceed only after:

Where approval is logged:

What happens if reviewer does not respond:
What actions are never allowed without approval:
How many approval prompts should this workflow create per run:
What can the agent technically not access or change:
Sandbox / read-only mode used before live action: yes/no
```

Approval prompts are not a substitute for containment. If a reviewer would see many prompts, reduce the agent's permissions or split the workflow so only the meaningful decision reaches a human.
