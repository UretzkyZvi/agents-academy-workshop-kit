# Agent Evaluation Checklist

Run this after each sample.

```text
Sample ID:
Date:
Reviewer:
Run / trace link, if available:
Platform/product used and export path for specs, samples, rubrics, and logs:
Data sources used:
External systems or tools touched:
Runtime / sandbox / platform used:
PII/confidential material minimized? yes/no

Did the agent follow the spec? yes/no
Where did it drift?
Was the output accurate?
What needed correction?
Did it guess where it should have flagged uncertainty?
Were the right tools used?
Were tool descriptions and parameters clear enough to prevent the wrong tool or wrong inputs?
Were any tool calls unnecessary or risky?
Did any sensitive action pause for human approval?
Did approval prompts feel clear and limited, or noisy/repetitive?
If the workflow paused, could it resume from saved state?
Was the active context small and relevant, or polluted by stale tool output/history?
Was the output useful?
How long did review take?
How long would manual work have taken?
Risk level after review: low / medium / high
Decision: build / refine / stop
Next change:
Reviewer feedback converted into a reusable eval case? yes/no
If yes, eval case ID/path:
```

## Scores

1 = poor, 5 = strong

```text
Spec compliance:
Accuracy:
Usefulness:
Review effort:
Risk control:
Time saved:
```
