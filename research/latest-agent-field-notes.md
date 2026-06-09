# Latest Agent Field Notes

Last seeded: 2026-06-09

This file is maintained by a daily Hermes cron task. It should capture useful changes in the AI-agent field that improve the workshop kit.

## Baseline editorial stance

- Prefer production lessons over hype.
- Prefer workflow patterns over tool lists.
- Prefer safety, human approval, and evaluation over autonomous-agent claims.
- Add citations and links when a change affects workshop material.

## Current watch areas

- agent evaluation and benchmarks
- tool-use reliability
- human-in-the-loop patterns
- MCP and tool interoperability
- browser/computer-use agents
- no-code/low-code agent workflow platforms
- legal, insurance, and healthcare adoption examples
- governance, privacy, and data-handling guidance

## Update log

### 2026-06-09

#### Field scan

- OpenAI's agent evaluation guidance now treats traces as the first debugging surface for agent workflows: a trace should capture model calls, tool calls, guardrails, handoffs, and custom spans, then be graded against structured criteria. Workshop implication: the evaluation checklist should ask reviewers to inspect the actual run record when a platform exposes one, not only the final answer. Source: https://developers.openai.com/api/docs/guides/agent-evals
- OpenAI's guardrails and human-review guidance is explicit that approvals are the human-in-the-loop path for sensitive tool calls: the run pauses, records an interruption, returns resumable state, and continues after approval or rejection. Workshop implication: approval is an implementation requirement for side effects, not an optional governance slide. Source: https://developers.openai.com/api/docs/guides/agents/guardrails-approvals
- Google's ADK long-running-agent guidance emphasizes durable state machines, persistent sessions, pause/resume behavior, and approval gates for real enterprise workflows that stretch over days or weeks. Workshop implication: for small firms, a scheduled or long-running agent should have an explicit status field, waiting condition, owner, and next human action. Source: https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk/
- Anthropic donated MCP to the Agentic AI Foundation under the Linux Foundation, with support across major vendors, and noted a growing registry, SDKs, async operations, statelessness, and server identity. Workshop implication: keep MCP in the kit as the main interoperability pattern, while still teaching least-privilege tool access and approval gates. Source: https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation
- Google's Gemini 2.5 Computer Use model preview shows the direction of browser/UI agents: the model runs in an iterative screenshot/action loop and may request end-user confirmation for sensitive actions such as purchases. Workshop implication: browser/computer-use demos should stay in sandbox or read-only mode unless the team has clear confirmation and rollback rules. Source: https://blog.google/technology/google-deepmind/gemini-computer-use-model/

#### Repo changes made

- Updated `resources/tools-and-platforms.md` to add durable state, pause/resume, observability, and approval-boundary selection criteria.
- Updated `resources/agent-patterns.md` with a long-running workflow agent pattern and explicit state guidance.
- Updated `templates/eval-checklist.md` so workshop reviews capture tool calls, approvals, trace/run links, and state/resume behavior.

#### Recommendation change

No change to the core stance. Strengthen it: teach agents as workflow systems with run records, approval interruptions, and durable state before discussing autonomy.

### 2026-06-08

Initial repo scaffold created.

#### Field scan

- OpenAI's Agents SDK documentation frames production agents around tools, handoffs, sessions, human-in-the-loop controls, guardrails, and tracing. Workshop implication: teach agent design as an operational loop with observability, not just prompting. Source: https://openai.github.io/openai-agents-python/
- OpenAI's API guide separates simple tool-using model calls from applications that own orchestration, approvals, and state. Workshop implication: small teams should start with application-owned approval and state, not pretend the model owns the whole process. Source: https://developers.openai.com/api/docs/guides/agents
- Anthropic's Model Context Protocol has become a key pattern for connecting assistants to external systems and tools. Workshop implication: keep tool access modular and explicit; teach allowed tools/forbidden actions as part of every agent spec. Source: https://www.anthropic.com/news/model-context-protocol
- LangGraph's public positioning emphasizes durable agents, memory, and human-in-the-loop control. Workshop implication: human review checkpoints are not a workaround. They are a core production pattern. Source: https://www.langchain.com/langgraph
- Agent benchmark discussion continues to center around task completion, web/OS interaction, software engineering, and reliability. Workshop implication: for business workshops, use local workflow evals instead of abstract benchmark claims. Measure review time, spec compliance, accuracy, and risk control.

#### Repo change recommendation

Keep the public kit platform-agnostic, but make the `Tools and Platforms` resource clearer about the split between:

1. manual agent loop testing,
2. orchestration/state/tracing frameworks,
3. tool interoperability such as MCP,
4. human approval as a normal production pattern.
