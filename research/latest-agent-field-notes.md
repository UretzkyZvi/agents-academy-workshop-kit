# Latest Agent Field Notes

Last updated: 2026-06-12

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

### 2026-06-12

#### Field scan

- OpenAI's AgentKit page now carries an important lifecycle note: Agent Builder and Evals are being wound down, with availability ending after November 30, 2026. Workshop implication: avoid teaching proprietary visual builders or hosted eval products as durable foundations unless the team has an export/migration plan; keep specs, eval rubrics, and sample sets portable. Source: https://openai.com/index/introducing-agentkit/
- Microsoft Agent Framework reached 1.0 for .NET and Python and is positioned as the convergence of Semantic Kernel and AutoGen, with stable APIs, long-term support, multi-agent workflow patterns, checkpointing, human-in-the-loop approvals, pause/resume, A2A, and MCP. Workshop implication: Microsoft-heavy conservative teams now have a more enterprise-aligned framework option, but it still belongs after workflow mapping and local evals, not before. Sources: https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/ and https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-at-build-2026-announce/
- Microsoft's Build 2026 Agent Harness framing is useful because it treats shell/filesystem access, approval flows, context management, managed session state, observability, and versioning as production concerns. Workshop implication: when a team wants agents that touch files or systems, require a harness/run-record conversation before granting write tools.
- Dify documentation now clearly shows MCP in both directions: Dify workflows can use MCP tools, and Dify apps can be exposed as MCP servers. The docs also warn that MCP does not remove app latency and recommend progress indicators or breaking complex workflows into smaller operations. Workshop implication: low-code MCP demos should document server IDs, dev/staging/prod consistency, who may call the app-as-tool, expected latency, and logs. Sources: https://docs.dify.ai/en/use-dify/build/mcp and https://docs.dify.ai/en/use-dify/publish/publish-mcp
- Anthropic's tool-writing guidance remains a strong practical reminder: agent performance often depends on tool descriptions, tool ergonomics, and tool-specific evals, not only model choice. Workshop implication: include tool description quality and parameter safety in builder reviews. Source: https://www.anthropic.com/engineering/writing-tools-for-agents

#### Repo changes made

- Updated `resources/tools-and-platforms.md` with Microsoft Agent Framework, OpenAI product-lifecycle caution, low-code MCP publication caveats, and latency/run-record selection criteria.
- Updated `resources/technical-builder-notes.md` with a short tool-design review block covering descriptions, parameter modes, latency, and tool-specific evals.
- Updated `templates/eval-checklist.md` so reviewers capture platform/product lifecycle risk and tool-description/parameter issues.

#### Recommendation change

No change to the core stance. Slightly strengthen portability guidance: workshop assets should remain platform-independent. Treat hosted builders and eval dashboards as useful conveniences, not the source of truth; keep workflow maps, specs, sample sets, approval rules, and eval rubrics in files the team controls.

### 2026-06-11

#### Field scan

- Anthropic's containment write-up is a useful corrective to naive human-in-the-loop advice: permission prompts alone create approval fatigue, and users approved roughly 93% of prompts in Claude Code telemetry. Their recommended control pattern is to cap blast radius with environment boundaries such as sandboxes, VMs, and egress controls, while still using human review where it matters. Workshop implication: approval remains required for sensitive actions, but conservative teams should also ask what the agent is technically unable to do. Source: https://www.anthropic.com/engineering/how-we-contain-claude
- Anthropic's agentic-coding eval note shows infrastructure can move benchmark results by several percentage points because agent tests include runtime resources, time limits, dependency installs, and sandbox behavior. Workshop implication: local evals should record the environment and tool constraints, not only the model name or final answer. Source: https://www.anthropic.com/engineering/infrastructure-noise
- Google's ADK SkillToolset guide describes progressive disclosure for agent skills: load small metadata by default, full instructions only when needed, and resources only on demand. Workshop implication: for legal, insurance, and operations playbooks, do not cram every policy into one system prompt; keep domain instructions modular, named, reviewed, and loaded only for the current workflow. Source: https://developers.googleblog.com/developers-guide-to-building-adk-agents-with-skills/
- The current MCP specification keeps security and trust front-and-center: explicit user consent, data privacy, tool safety, and OAuth-style authorization for HTTP transports. Workshop implication: MCP belongs in the kit as an interoperability pattern, but every connector still needs a permission record, allowed scopes, and logging. Sources: https://modelcontextprotocol.io/specification/2025-11-25 and https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization

#### Repo changes made

- Updated `resources/technical-builder-notes.md` with a short containment/blast-radius section and a modular-instructions note for policy-heavy workflows.
- Updated `templates/human-approval-flow.md` so approval design captures prompt volume and technical containment, not just reviewer choice.
- Updated `templates/eval-checklist.md` to record runtime/tool environment and prompt/approval fatigue.
- Updated `resources/common-failure-modes.md` with approval fatigue and monolithic prompt failure modes.

#### Recommendation change

Slight strengthening of the recommendation: human approval is necessary but not sufficient. For any agent with tools, teach two controls together: (1) explicit approvals for sensitive decisions and side effects, and (2) containment that limits what the agent can access or change even if a prompt or model step goes wrong.

### 2026-06-10

#### Field scan

- LangChain and LangGraph reached 1.0, with LangGraph positioned around durable state and LangChain adding standardized agents plus middleware for human-in-the-loop tool approval, summarization, and PII redaction. Workshop implication: keep LangGraph in the "build when you need state, branching, interrupts, and inspection" bucket rather than as a default first tool. Source: https://blog.langchain.com/langchain-langgraph-1dot0/
- Anthropic's finance/insurance agent announcement shows vertical agent products moving toward governed connectors, Microsoft 365 integration, MCP apps, and benchmarked financial workflows. Workshop implication: for insurance and professional-services teams, the practical pattern is still governed data access plus draft/review workflows; do not imply that vertical agents remove supervision, confidentiality review, or firm policy. Source: https://www.anthropic.com/news/finance-agents
- Anthropic's MCP/code-execution guidance says agents can scale tool use by writing code that calls MCP tools instead of loading every tool definition and result into the model context, reducing context overhead substantially. Workshop implication: for builder audiences, treat MCP as a tool boundary and routing layer; teach least-privilege server access and logs even when the model uses code to call tools. Source: https://www.anthropic.com/engineering/code-execution-with-mcp
- NIST continues to extend the AI Risk Management Framework, including a 2026 concept note for trustworthy AI in critical infrastructure. Workshop implication: conservative teams should map each agent workflow to risk controls: govern, map, measure, manage; for small firms this becomes a simple record of data touched, action authority, evaluation evidence, and owner. Source: https://www.nist.gov/itl/ai-risk-management-framework

#### Repo changes made

- Updated `resources/tools-and-platforms.md` to note LangChain/LangGraph 1.0, two-way MCP interoperability as a selection consideration, and governance/risk-record criteria.
- Updated `resources/technical-builder-notes.md` with a short MCP implementation note and a NIST-style governance record for conservative teams.
- Updated `templates/eval-checklist.md` so reviewers capture data sources, external actions, and whether PII/confidential material was minimized.

#### Recommendation change

No change to the core stance. The new signal reinforces the kit's workflow-first advice: use mature agent frameworks and MCP when they solve a real integration/state problem, but keep approvals, run records, data minimization, and local evals as default requirements.

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
