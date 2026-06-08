# Agents Academy Workshop Kit

Build your first useful AI agent, not another chatbot demo.

This is a practical, free workshop kit from AgentWorks Academy for founders, operators, and small professional-service teams who want to turn one real workflow into an AI agent with clear inputs, tools, memory, human approval, and evaluation.

The goal is not to automate everything.
The goal is to find one workflow where an agent is actually worth using.

## Who this is for

This kit is written for different levels of AI-agent experience.

- curious beginners who want a plain-English explanation
- parents, workers, and busy people exploring whether agents can reduce mental load
- small law firms
- insurance agencies and brokerages
- founder-led service businesses
- operators who own repetitive document, intake, follow-up, or internal-knowledge workflows
- technical builders turning a workflow into an implementation
- trainers teaching teams how to use agents responsibly

Start here: [pick your path](start-here.md).

Prefer a guided front door? Use the interactive website in [`docs/`](docs/README.md). It helps a beginner start from a recognizable pain, see a plain-English example, answer a few questions, and leave with a one-page AI assistant idea before opening the deeper workshop files.

## Explanation levels

Different people need different language.

- New to AI agents? Read [AI agents in plain English](resources/ai-agents-in-plain-english.md).
- Running a business workflow? Start with [choose one workflow](workshop/01-choose-a-workflow.md).
- Building the implementation? Read [technical builder notes](resources/technical-builder-notes.md).
- Teaching this material? Use the [language guide](resources/language-guide.md).

The safety pattern stays the same: small workflow, clear limits, human approval, and evaluation.

The explanation changes by audience.

## What you will produce

By the end of the workshop path, you should have:

- a mapped workflow
- a written agent spec
- a first agent loop you can run manually or in an agent platform
- a human-approval checkpoint
- an evaluation checklist
- a decision on whether to build, refine, or kill the agent idea

## Workshop path

If you are new, start with [Start Here](start-here.md) before using the workshop path.

1. [Choose one workflow](workshop/01-choose-a-workflow.md)
2. [Write the agent spec](workshop/02-write-an-agent-spec.md)
3. [Run the first agent loop](workshop/03-run-the-first-agent.md)
4. [Review and improve it](workshop/04-review-and-improve.md)

## Templates

- [Workflow map](templates/workflow-map.md)
- [Agent spec](templates/agent-spec.md)
- [Signal source template](templates/signal-source-template.md)
- [Evaluation checklist](templates/eval-checklist.md)
- [Human approval flow](templates/human-approval-flow.md)

## Resources

- [AI agents in plain English](resources/ai-agents-in-plain-english.md)
- [Language guide](resources/language-guide.md)
- [Signal points integration guide](resources/signal-points-integration-guide.md)
- [Technical builder notes](resources/technical-builder-notes.md)
- [Agent patterns](resources/agent-patterns.md)
- [Common failure modes](resources/common-failure-modes.md)
- [Tools and platforms](resources/tools-and-platforms.md)

## Helper scripts

The repo includes small local-first scripts for testing integrations without connecting real accounts first.

- [Scripts guide](scripts/README.md)
- `scripts/normalize_signal_csv.py`: normalize Gmail/Calendar/CRM exports into one signal format
- `scripts/make_signal_review_brief.py`: turn normalized signals into an agent review brief

## Example agents

- [Legal intake summary agent](examples/legal-intake-summary-agent.md)
- [Insurance renewal follow-up agent](examples/insurance-renewal-follow-up-agent.md)
- [Founder research brief agent](examples/founder-research-brief-agent.md)

## Core pattern

```text
Workflow -> Agent Spec -> Tool Access -> Human Review -> Evaluation -> Iteration
```

Most failed agent projects skip the first and last steps. They start with prompts, not workflows, and they never measure whether the agent helped.

## Use this repo in a live workshop

A simple 90-minute session:

- 10 min: what agents are and are not
- 20 min: identify safe use cases
- 20 min: map one workflow
- 20 min: write the first agent spec
- 10 min: define human approval and evaluation
- 10 min: pick the next step

## Paid help

AgentWorks Academy runs live implementation workshops for teams that want to build this with guidance.

Bring one workflow. Leave with a mapped process, an agent spec, an evaluation plan, and a practical next step.

CTA: request a 30-minute workflow review.

## License

MIT. Use it, adapt it, teach from it. Attribution appreciated.
