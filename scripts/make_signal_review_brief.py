#!/usr/bin/env python3
"""
Create an agent review brief from a normalized signal CSV.

Usage:
  python scripts/make_signal_review_brief.py normalized.csv review.md --workflow "Client intake follow-up"

The brief is meant to be pasted into an LLM or given to an agent with an
agent spec. It does not call any model or external API.
"""

from __future__ import annotations

import argparse
import csv
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a markdown review brief from normalized signal rows.")
    parser.add_argument("input", help="Normalized CSV with source,id,date,person,organization,title,body,status,url")
    parser.add_argument("output", help="Markdown review brief")
    parser.add_argument("--workflow", default="Signal review", help="Workflow name")
    parser.add_argument("--limit", type=int, default=20, help="Maximum rows to include")
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    with input_path.open("r", encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))[: args.limit]

    lines: list[str] = []
    lines.append(f"# {args.workflow}")
    lines.append("")
    lines.append("Use this brief with an agent spec. The agent may summarize, classify, draft, and flag. It must not send or update anything without human approval.")
    lines.append("")
    lines.append("## Signal rows")
    lines.append("")

    for i, row in enumerate(rows, start=1):
        lines.append(f"### Signal {i}: {row.get('title', '').strip() or '(no title)'}")
        lines.append("")
        for field in ["source", "id", "date", "person", "organization", "status", "url"]:
            value = (row.get(field) or "").strip()
            if value:
                lines.append(f"- {field}: {value}")
        body = (row.get("body") or "").strip()
        if body:
            lines.append("")
            lines.append("Body excerpt:")
            lines.append("")
            lines.append("```text")
            lines.append(body)
            lines.append("```")
        lines.append("")

    lines.append("## Agent task")
    lines.append("")
    lines.append("For each signal, produce:")
    lines.append("")
    lines.append("- category")
    lines.append("- short summary")
    lines.append("- suggested next action")
    lines.append("- draft response or checklist if useful")
    lines.append("- missing information")
    lines.append("- risk/uncertainty flags")
    lines.append("- whether human approval is required before action")
    lines.append("")
    lines.append("Do not invent missing facts. Flag uncertainty.")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote review brief for {len(rows)} signals to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
