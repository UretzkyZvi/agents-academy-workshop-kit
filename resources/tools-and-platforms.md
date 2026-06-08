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
- LangGraph / LangChain: useful for custom app workflows, durable execution, graph-based orchestration, memory, and human-in-the-loop control.
- CrewAI / AutoGen-style systems: useful for multi-agent experiments, but keep production workflows tightly scoped.
- Dify and similar platforms: useful for low-code internal AI apps and workflow demos.

### 3. Workflow glue and signal points

- n8n / Make / Zapier: useful for no-code workflow glue once the human approval path is clear.
- Gmail, Calendar, CRM, forms, folders, and spreadsheets: useful signal points, but start with exports and read-only access before live automation.

See the [signal points integration guide](signal-points-integration-guide.md) before connecting accounts.

### 4. Tool interoperability

- Model Context Protocol, or MCP: useful as a standard way to connect agents to external tools and data sources. Treat every tool connection as a permissioned capability, not a blank check.

## Selection rule

Do not choose a platform because it is exciting.
Choose it because the workflow needs its specific capabilities.

If the team cannot describe the workflow, approval point, and evaluation metric, it is too early to pick a platform.