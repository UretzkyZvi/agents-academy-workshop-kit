# 03 - Run the First Agent Loop

The first loop can be manual. You do not need a full automation stack yet.

## Manual loop

```text
1. Human provides one real or synthetic sample.
2. Agent follows the spec.
3. Agent produces the required output.
4. Human reviews the output.
5. Human logs problems.
6. Spec is updated.
```

## Platform options

Use whatever is already comfortable:

- ChatGPT / Claude / Gemini for manual testing
- Hermes Agent for tool-using workflows, scheduled jobs, files, browser, Telegram, email, and multi-agent work
- n8n / Make / Zapier for no-code workflow glue
- custom scripts for repeatable internal jobs

This kit is platform-agnostic. The important part is the workflow design and review loop.

## First run checklist

Before running:

- [ ] The input is safe to use in the selected tool.
- [ ] The agent has a written spec.
- [ ] The output format is clear.
- [ ] The human reviewer is named.
- [ ] The agent cannot send or finalize anything without approval.

After running:

- [ ] Did the agent follow the spec?
- [ ] Did it guess where it should have flagged uncertainty?
- [ ] Did it produce something faster than a human draft?
- [ ] Was review easy?
- [ ] What needs to change before another run?

## Tiny prompt wrapper

Use the agent spec as context, then ask:

```text
Follow the agent spec below. Do not exceed the allowed actions. If required information is missing, flag it instead of guessing.

[PASTE AGENT SPEC]

Input:
[PASTE SAMPLE]
```
