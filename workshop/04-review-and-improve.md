# 04 - Review and Improve

Agents get useful through review loops, not one perfect prompt.

## Review dimensions

Score 1-5:

```text
Spec compliance:
Accuracy:
Usefulness:
Review effort:
Risk control:
Time saved:
```

## Decision

After three sample runs, choose one:

- **Build:** useful, reviewable, low enough risk
- **Refine:** promising but the spec or workflow is unclear
- **Stop:** not valuable, too risky, or easier to do manually

## Common fixes

If the output is generic:

- narrow the workflow
- provide a better template
- define the intended reader

If the output hallucinates:

- require source quotes
- add "flag uncertainty" rules
- lower autonomy

If review takes too long:

- shorten the output
- split into checklist first, prose second
- require risk flags at the top

If the workflow feels risky:

- move the agent earlier in the process
- make it draft-only
- remove external sending
- add approval checkpoints

## Final workshop output

```text
Workflow chosen:
Agent spec completed: yes/no
Sample runs completed:
Main failure found:
Next change:
Build/refine/stop decision:
Owner:
Next review date:
```
