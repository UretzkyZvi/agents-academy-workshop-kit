#!/usr/bin/env python3
"""
Normalize exported signal CSVs into a simple format agents can read.

This script is intentionally boring and local-first. It does not connect to Gmail,
Calendar, or a CRM. Export first, normalize second, automate later.

Usage:
  python scripts/normalize_signal_csv.py input.csv output.csv \
    --source gmail \
    --id Message-ID \
    --date Date \
    --person From \
    --title Subject \
    --body Body

Recommended output columns:
  source,id,date,person,organization,title,body,status,url
"""

from __future__ import annotations

import argparse
import csv
from pathlib import Path

OUTPUT_FIELDS = [
    "source",
    "id",
    "date",
    "person",
    "organization",
    "title",
    "body",
    "status",
    "url",
]


def get(row: dict[str, str], column: str | None) -> str:
    if not column:
        return ""
    return (row.get(column) or "").strip()


def main() -> int:
    parser = argparse.ArgumentParser(description="Normalize exported signal CSVs for agent review.")
    parser.add_argument("input", help="Input CSV exported from Gmail/Calendar/CRM/spreadsheet")
    parser.add_argument("output", help="Output normalized CSV")
    parser.add_argument("--source", required=True, help="Signal source name, e.g. gmail, calendar, crm")
    parser.add_argument("--id", dest="id_col", help="Input column for unique ID")
    parser.add_argument("--date", dest="date_col", help="Input column for date/time")
    parser.add_argument("--person", dest="person_col", help="Input column for person/contact")
    parser.add_argument("--organization", dest="organization_col", help="Input column for company/org")
    parser.add_argument("--title", dest="title_col", help="Input column for subject/title")
    parser.add_argument("--body", dest="body_col", help="Input column for body/notes/description")
    parser.add_argument("--status", dest="status_col", help="Input column for status/stage")
    parser.add_argument("--url", dest="url_col", help="Input column for URL/link")
    parser.add_argument("--max-body", type=int, default=1200, help="Truncate body text to this many chars")
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    with input_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=OUTPUT_FIELDS)
        writer.writeheader()
        for index, row in enumerate(rows, start=1):
            body = get(row, args.body_col)
            if len(body) > args.max_body:
                body = body[: args.max_body].rstrip() + "..."
            writer.writerow(
                {
                    "source": args.source,
                    "id": get(row, args.id_col) or f"{args.source}-{index}",
                    "date": get(row, args.date_col),
                    "person": get(row, args.person_col),
                    "organization": get(row, args.organization_col),
                    "title": get(row, args.title_col),
                    "body": body,
                    "status": get(row, args.status_col),
                    "url": get(row, args.url_col),
                }
            )

    print(f"Wrote {len(rows)} normalized signal rows to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
