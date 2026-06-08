# Latest Agent Field Notes

Last seeded: 2026-06-08

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
