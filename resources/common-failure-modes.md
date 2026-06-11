# Common Agent Failure Modes

## Vague job

Symptom: generic output.

Fix: narrow the workflow and define the output format.

## Too much autonomy

Symptom: agent takes actions the team is not ready to trust.

Fix: move to draft-only and add human approval.

## No evaluation

Symptom: everyone debates vibes.

Fix: use the evaluation checklist after every sample.

## Wrong first workflow

Symptom: too risky, too integrated, or too broad.

Fix: choose a lower-risk, document-heavy workflow first.

## Tool-first thinking

Symptom: team asks "which platform?" before defining the work.

Fix: map the workflow before picking tools.

## Approval fatigue

Symptom: reviewer clicks approve because there are too many low-value prompts.

Fix: reduce the agent's permissions, batch low-risk checks, and keep human approval for meaningful decisions or side effects.

## Giant prompt / hidden playbook

Symptom: the agent behaves inconsistently because too many policies, examples, and edge cases are packed into one prompt.

Fix: split instructions into named modules or checklists, load only what the workflow needs, and assign an owner for each module.
