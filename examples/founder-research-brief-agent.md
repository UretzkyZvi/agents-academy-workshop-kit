# Example: Founder Research Brief Agent

## Use case

Create a daily or weekly brief on a market, competitor, or lead list.

## Agent spec

```text
Agent name: Founder research brief agent
Job: Research a defined topic and produce a short decision brief.
Trigger: Daily or weekly scheduled run.
Inputs: Topic, target companies, search constraints, prior brief if available.
Allowed tools: Web search, source extraction, notes file, summary writing.
Forbidden actions: Contact leads, invent facts, make claims without source links.
Output format:
- What changed
- Why it matters
- Source links
- Suggested action
- Open questions
Human approval required before: outreach, publishing, or strategy changes.
Success metric: founder can decide next action in under 5 minutes.
Failure conditions: weak sources, no meaningful changes, conflicting information.
Escalation rule: say "no strong signal" instead of forcing a take.
```
