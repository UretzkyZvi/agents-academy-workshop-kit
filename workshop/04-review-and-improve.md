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

## Turn review into the next test

After each sample run, save one short run record:

```text
Sample ID:
Trace / log link, if available:
Reviewer correction:
Expected behavior next time:
Spec, tool, or template change needed:
Reusable eval case created: yes/no
```

Do not rely on memory or vibes. If the same correction would matter on a client, claim, intake, renewal, or founder-ops workflow, turn it into a reusable eval case before the next run.

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
