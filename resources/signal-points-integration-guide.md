# Signal Points Integration Guide

Most useful agents need signals.

A signal is a thing that tells the agent what needs attention.

Examples:

- a new Gmail message from a client
- a calendar event tomorrow
- a CRM deal with no follow-up
- a form submission
- a document added to a folder
- a support ticket with no owner

This is often the hardest part for beginners. The prompt is not the hard part. The hard part is connecting the agent to the right signals safely.

## The safe integration pattern

Start read-only.

```text
Signal source -> filtered view -> agent draft/checklist -> human approval -> optional action
```

Do not start here:

```text
Signal source -> agent decides -> agent sends/updates/deletes
```

## Step 1: Choose one signal source

Pick one source only.

Good first sources:

- Gmail or inbox labels
- Google Calendar events
- CRM export CSV
- spreadsheet rows
- folder of documents
- website form submissions

Bad first sources:

- every inbox
- every calendar
- full CRM write access
- production database
- unrestricted customer messaging

## Step 2: Define the signal

Use this worksheet:

```text
Signal source:
Signal name:
What event matters:
Filter rules:
Fields needed:
Fields forbidden:
How often to check:
Who reviews output:
What the agent may do:
What the agent must not do:
```

Example:

```text
Signal source: Gmail
Signal name: unhandled client intake email
What event matters: email in label "Intake" with no reply yet
Filter rules: newer than 7 days, not archived, not from internal staff
Fields needed: sender, subject, date, body excerpt
Fields forbidden: unrelated inbox, attachments unless approved
How often to check: daily at 9am
Who reviews output: intake coordinator
What the agent may do: summarize, classify, draft reply, list missing info
What the agent must not do: send email, give legal advice, create matter record
```

## Step 3: Export before integrating

Before OAuth, APIs, or automation, test with exports.

Use:

- Gmail search results copied into CSV
- Google Calendar export or manual event CSV
- CRM export CSV
- spreadsheet copy
- sample documents with private data removed

Why:

- faster to teach
- safer for beginners
- easier to debug
- avoids permission anxiety
- proves whether the agent is useful before wiring accounts

## Step 4: Normalize the signal

Turn every source into a simple row format.

Recommended fields:

```text
source,id,date,person,organization,title,body,status,url
```

The agent should not care whether the signal came from Gmail, Calendar, or CRM at first.

It should read normalized rows and produce useful review output.

## Step 5: Add human approval

For every signal, define the action gate.

```text
Agent can draft:
Agent can summarize:
Agent can classify:
Agent can recommend:
Agent cannot send/update/finalize until:
Approval is recorded in:
```

## Gmail path

Beginner version:

1. Create a Gmail label such as `Agent Review`.
2. Manually label 5-10 example emails.
3. Copy sender, subject, date, and body excerpt into a CSV.
4. Run the agent on the CSV.
5. Review the drafts manually.

Technical version:

1. Use Gmail API or Google Workspace tooling.
2. Request read-only scopes first.
3. Query only the label or search string needed.
4. Store message IDs and excerpts, not the whole mailbox.
5. Draft outputs to a file, sheet, or review queue.
6. Add send/update only after approval works.

## Calendar path

Beginner version:

1. Pick one calendar.
2. Export or copy events for the next 7 days.
3. Ask the agent for a prep brief or follow-up checklist.
4. Review manually.

Technical version:

1. Use calendar read-only access.
2. Pull events in a bounded window, such as next 7 days.
3. Exclude private calendars unless explicitly approved.
4. Summarize only what is needed for the workflow.
5. Never create or modify events until approval is designed.

## CRM path

Beginner version:

1. Export a CSV from the CRM.
2. Keep only safe columns: company, person, stage, last contact, next step, notes excerpt.
3. Remove sensitive notes before workshop use.
4. Ask the agent to flag stale deals or draft follow-up suggestions.

Technical version:

1. Start with read-only API access.
2. Query a narrow view, not the whole CRM.
3. Map CRM fields into normalized signal rows.
4. Write recommendations to a review queue.
5. Do not update CRM records until review and rollback are clear.

## Integration readiness checklist

Do not automate the integration until these are true:

- [ ] The workflow is written down.
- [ ] The signal source is specific.
- [ ] The filter is narrow.
- [ ] The fields are listed.
- [ ] Sensitive fields are excluded or approved.
- [ ] The agent output format is clear.
- [ ] Human approval is defined.
- [ ] Three sample runs were reviewed.
- [ ] The team knows what happens when the agent is wrong.

## Teaching note

For workshops, use exports first.

For implementation work, convert the winning export workflow into a read-only integration.

Only then consider write actions.
