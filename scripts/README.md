# Helper Scripts

These scripts help people test signal points before connecting real accounts.

They are local-first and do not call Gmail, Calendar, CRM, or any AI model.

## Why scripts instead of direct integrations first?

Direct integrations are where beginners get stuck:

- OAuth consent screens
- API scopes
- CRM field names
- private data
- rate limits
- write permissions
- fear of breaking something

So the first version uses exports.

```text
Export CSV -> normalize rows -> create review brief -> run agent/manual LLM -> human review
```

## Scripts

### `normalize_signal_csv.py`

Converts a Gmail/Calendar/CRM/spreadsheet export into a shared signal format:

```text
source,id,date,person,organization,title,body,status,url
```

Example:

```bash
python scripts/normalize_signal_csv.py examples/sample-signals.csv outputs/normalized.csv \
  --source sample \
  --id id \
  --date date \
  --person person \
  --organization organization \
  --title title \
  --body body \
  --status status \
  --url url
```

### `make_signal_review_brief.py`

Turns normalized rows into a markdown brief you can paste into an LLM or agent.

Example:

```bash
python scripts/make_signal_review_brief.py outputs/normalized.csv outputs/review-brief.md \
  --workflow "Client intake follow-up"
```

## Next scripts to add

Only add direct integrations after the export flow proves useful.

Good candidates:

- Gmail read-only label fetcher
- Google Calendar next-7-days fetcher
- HubSpot/Pipedrive read-only deal export
- Google Sheets signal queue
- local folder document watcher

Each direct script should default to read-only.
