# Tools and Platforms

This repo is platform-agnostic. Choose tools after you know the workflow.

## Manual testing

- ChatGPT
- Claude
- Gemini

Good for first samples and workshop demos.

## Agent platforms and frameworks

Think in layers:

### 1. Manual loop testing

- ChatGPT
- Claude
- Gemini

Use these for the first workshop samples. Prove the workflow before building infrastructure.

### 2. Agent runtimes and orchestration

- Hermes Agent: useful for tool-using personal/company agents, Telegram/email workflows, files, web, cron, and multi-agent work.
- OpenAI Agents SDK: useful for OpenAI-first teams that need tools, handoffs, sessions, human-in-the-loop controls, guardrails, and tracing.
- LangGraph / LangChain: useful for custom app workflows that need durable execution, graph-based orchestration, memory, middleware, inspection, and human-in-the-loop tool approval. Their 1.0 releases are a good sign for teams that need framework stability, but they are still overkill for a first workshop sample.
- Google ADK: useful for code-first Gemini/Vertex AI workflows, multi-agent orchestration, evaluation, deployment, and long-running stateful agents.
- CrewAI / AutoGen-style systems: useful for multi-agent experiments, but keep production workflows tightly scoped.
- Dify and similar platforms: useful for low-code internal AI apps and workflow demos, especially when the team needs a visual builder before custom code.

### 3. Workflow glue and signal points

- n8n / Make / Zapier: useful for no-code workflow glue once the human approval path is clear.
- Gmail, Calendar, CRM, forms, folders, and spreadsheets: useful signal points, but start with exports and read-only access before live automation.

See the [signal points integration guide](signal-points-integration-guide.md) before connecting accounts.

### 4. Tool interoperability

- Model Context Protocol, or MCP: useful as a standard way to connect agents to external tools and data sources. Treat every tool connection as a permissioned capability, not a blank check.
- Some platforms now support MCP in both directions: using MCP servers as tools and exposing an agent or workflow as an MCP server. That is useful for interoperability, but it also means the workflow can become a tool used by another system. Document who may call it, what it can do, and what it logs.

### 5. Production controls to look for

Before using any platform on a client workflow, check whether it supports:

- **Run records or traces:** can a reviewer see model calls, tool calls, handoffs, guardrails, and errors?
- **Human approval interruptions:** can risky tool calls pause, wait for approval or rejection, and then resume the same run?
- **Durable state:** can a multi-day workflow remember status, owner, waiting condition, and next action without relying only on chat history?
- **Least-privilege tools:** can you expose only the specific tools and data sources needed for this workflow?
- **Evaluation hooks:** can you replay samples or grade runs against the workshop evaluation checklist?
- **Data minimization and governance:** can you limit what data the agent sees, redact or avoid sensitive fields, and keep a simple risk record for conservative teams?

## Selection rule

Do not choose a platform because it is exciting.
Choose it because the workflow needs its specific capabilities.

If the team cannot describe the workflow, approval point, and evaluation metric, it is too early to pick a platform.