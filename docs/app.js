const painExamples = {
  followups: {
    title: "Follow-up helper",
    simple: "This assistant does not run your sales or client work. It checks a small list of open items, suggests who may need a follow-up, and drafts a message. A human approves everything.",
    goodBecause: ["the work repeats", "the input is usually written down", "the output can be reviewed", "mistakes are manageable if you start small"],
    source: "CRM view, spreadsheet, or inbox label for open follow-ups",
    manual: "I check open items, decide who needs a follow-up, and write a short message.",
    assistantJob: "Flag stale items, explain why they may need follow-up, and draft a message for review.",
    limits: "Do not send messages. Do not update CRM records. Do not mark anything complete without approval.",
    reviewer: "Business owner or account manager",
    success: "Fewer missed follow-ups and 30 minutes saved each week",
  },
  intake: {
    title: "Intake helper",
    simple: "This assistant reads new requests, summarizes what the person needs, lists missing information, and drafts a reply. A human checks the draft before sending.",
    goodBecause: ["new requests often follow patterns", "missing information can be listed", "drafts are easy to review", "the assistant does not need to send anything"],
    source: "Gmail label called New Intake, or a form submission spreadsheet",
    manual: "I read each request, figure out what is missing, and write a follow-up reply.",
    assistantJob: "Summarize the request, list missing information, and draft a short reply for review.",
    limits: "Do not send emails. Do not promise services. Do not give legal, medical, or financial advice.",
    reviewer: "Office manager",
    success: "Faster first replies and fewer missing-information mistakes",
  },
  documents: {
    title: "Document review helper",
    simple: "This assistant does not make final decisions. It summarizes documents, labels what each one appears to be, and flags anything missing or unclear for a human to review.",
    goodBecause: ["documents can be sampled safely", "summaries are easy to check", "classification can be reviewed", "sensitive actions can stay blocked"],
    source: "Folder of uploaded documents, document list, or intake spreadsheet",
    manual: "I open documents, summarize them, identify what type they are, and check what is missing.",
    assistantJob: "Summarize each document, classify it, and flag missing or unclear items.",
    limits: "Do not make final legal, medical, financial, or compliance decisions. Do not delete, move, or rename files.",
    reviewer: "Workflow owner or specialist",
    success: "Faster first review and fewer missing-document surprises",
  },
  meetings: {
    title: "Meeting cleanup helper",
    simple: "This assistant turns messy notes into a short summary, decisions, action items, and a follow-up draft. A human checks it before anything is sent or assigned.",
    goodBecause: ["meeting notes are written input", "summaries can be reviewed", "action items are visible", "sending can stay manual"],
    source: "Calendar event and pasted meeting notes",
    manual: "I reread notes, pull out decisions, write next steps, and draft follow-up messages.",
    assistantJob: "Summarize decisions, list action items, and draft a follow-up note.",
    limits: "Do not send follow-ups. Do not schedule meetings. Do not assign tasks without review.",
    reviewer: "Meeting owner",
    success: "Fewer forgotten action items and faster meeting cleanup",
  },
  research: {
    title: "Research helper",
    simple: "This assistant gathers and organizes information for a repeated research task. It does not decide strategy. It prepares a brief for a human to judge.",
    goodBecause: ["research steps repeat", "sources can be listed", "briefs are easy to review", "the final decision stays human"],
    source: "Search notes, spreadsheet of targets, saved links, or a list of companies/people/topics",
    manual: "I search for similar information, skim sources, and turn notes into a short brief.",
    assistantJob: "Collect relevant notes, summarize sources, and create a short research brief with links.",
    limits: "Do not claim facts without sources. Do not contact anyone. Do not make final recommendations without review.",
    reviewer: "Founder, analyst, or project owner",
    success: "Research briefs are faster and more consistent",
  },
  unsure: {
    title: "Safe first idea finder",
    simple: "If you are not sure, start with work that repeats, is written down, and can be reviewed before anything happens. Avoid anything urgent, high-risk, or fully automated.",
    goodBecause: ["you can start with examples", "you do not need integrations", "the human stays in control", "you can stop if it is not useful"],
    source: "A small spreadsheet with 5 examples of repeated work",
    manual: "I repeatedly read something, decide what matters, and write a summary, checklist, or draft.",
    assistantJob: "Summarize the input, suggest the next step, and draft something for review.",
    limits: "Do not send, delete, update, schedule, purchase, or give professional advice without approval.",
    reviewer: "The person who owns the work",
    success: "The draft or checklist is useful enough that I would try it again",
  },

};

const mockDataExamples = {
  followups: [
    { name: "Jordan Lee", item: "Proposal sent", lastContact: "12 days ago", note: "Asked for pricing options, no reply yet", status: "Needs gentle follow-up" },
    { name: "Maya Patel", item: "Renewal discussion", lastContact: "8 days ago", note: "Wanted to confirm team size before renewing", status: "Waiting on client" },
    { name: "Chris Morgan", item: "Demo recap", lastContact: "15 days ago", note: "Said they would share internally", status: "May be stale" },
    { name: "Sam Rivera", item: "Invoice question", lastContact: "5 days ago", note: "Asked if payment terms could be extended", status: "Needs answer" },
    { name: "Taylor Brooks", item: "Pilot next step", lastContact: "21 days ago", note: "Pilot looked promising but no next meeting booked", status: "High priority follow-up" },
  ],
  intake: [
    { from: "Avery Chen", request: "Needs help setting up a workshop", missing: "Date, audience size, budget", urgency: "This month" },
    { from: "Morgan Smith", request: "Asked about document review automation", missing: "Document type, volume, approval owner", urgency: "Not stated" },
    { from: "Riley Johnson", request: "Wants a quote for training", missing: "Team size, location, preferred format", urgency: "Next quarter" },
    { from: "Casey Brown", request: "Asked if an assistant can sort incoming leads", missing: "Source system, categories, review process", urgency: "Soon" },
    { from: "Jamie Wilson", request: "Needs follow-up drafts for client emails", missing: "Example emails, tone preference, reviewer", urgency: "This week" },
  ],
  documents: [
    { file: "intake-form-a.pdf", type: "Client intake", summary: "Basic background is present", flag: "Missing signed consent" },
    { file: "invoice-042.pdf", type: "Invoice", summary: "Vendor billed for March services", flag: "Amount needs review" },
    { file: "notes-upload.docx", type: "Meeting notes", summary: "Several action items mentioned", flag: "No owner assigned" },
    { file: "contract-draft.pdf", type: "Draft agreement", summary: "Service terms appear outlined", flag: "Do not treat as legal review" },
    { file: "receipt-photo.jpg", type: "Receipt", summary: "Travel expense receipt", flag: "Date is hard to read" },
  ],
  meetings: [
    { meeting: "Client kickoff", notes: "Discussed timeline, owner for data export, and next check-in", looseEnd: "Confirm data export owner" },
    { meeting: "Sales handoff", notes: "Lead asked for pilot scope and sample agenda", looseEnd: "Draft pilot recap" },
    { meeting: "Ops sync", notes: "Team agreed to test with five fake examples first", looseEnd: "Collect fake examples" },
    { meeting: "Partner call", notes: "Partner can introduce two prospects after reviewing one-pager", looseEnd: "Send one-pager" },
    { meeting: "Training review", notes: "Attendees liked examples but wanted simpler language", looseEnd: "Rewrite instructions" },
  ],
  research: [
    { target: "Acme Health", question: "Could they use intake automation?", source: "Public website", note: "Mentions manual onboarding" },
    { target: "Northstar Legal", question: "Do they publish client resources?", source: "Blog", note: "Several articles on document-heavy workflows" },
    { target: "Blue Ridge Ops", question: "Who owns operations?", source: "LinkedIn snippet", note: "Ops director listed publicly" },
    { target: "ClearPath Clinics", question: "Repeated admin pain?", source: "Careers page", note: "Hiring for intake coordinator" },
    { target: "Summit Advisors", question: "Could follow-up helper fit?", source: "Case study", note: "Long sales cycle mentioned" },
  ],
  unsure: [
    { example: "Unread messages", input: "Five copied messages", assistantOutput: "Summary and suggested next step", humanCheck: "Approve before replying" },
    { example: "Meeting notes", input: "Five messy notes", assistantOutput: "Decisions and action items", humanCheck: "Check accuracy" },
    { example: "Open tasks", input: "Five stale tasks", assistantOutput: "Priority flag and draft nudge", humanCheck: "Decide what matters" },
    { example: "Uploaded files", input: "Five fake file names and descriptions", assistantOutput: "Label and missing-info flag", humanCheck: "Confirm label" },
    { example: "Research targets", input: "Five public targets", assistantOutput: "Short brief with unknowns", humanCheck: "Verify sources" },
  ],
};

const state = {
  pain: localStorage.getItem("aw-pain") || "",
};

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

function showStep(step) {
  qsa(".wizard-step").forEach((el) => el.classList.toggle("active", el.dataset.step === String(step)));
  qsa(".progress-pill").forEach((el) => {
    const number = Number(el.dataset.progress);
    el.classList.toggle("active", number === Number(step));
    el.classList.toggle("done", number < Number(step));
  });
  qs("#guided-flow")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectPain(pain) {
  state.pain = pain;
  localStorage.setItem("aw-pain", pain);
  qsa(".choice-card").forEach((card) => card.classList.toggle("selected", card.dataset.pain === pain));
  renderExample();
  prefillForm();
  makePlan();
}

function renderExample() {
  const example = painExamples[state.pain] || painExamples.unsure;
  qs("#example-output").innerHTML = `
    <h3>${example.title}</h3>
    <p class="large-copy">${example.simple}</p>
    <div class="why-box">
      <p class="mini-label">Good first test because</p>
      <ul>${example.goodBecause.slice(0, 3).map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>
    <p class="safe-note"><strong>Keep it safe:</strong> draft, check, summarize, or flag only. A human decides what happens next.</p>
  `;
}

function prefillForm() {
  const form = qs("#idea-form");
  const example = painExamples[state.pain] || painExamples.unsure;
  if (!form) return;
  ["source", "assistantJob", "limits", "success"].forEach((field) => {
    if (form.elements[field]) form.elements[field].value = example[field] || "";
  });
  saveForm();
}

function value(field, fallback = "Not decided yet") {
  const form = qs("#idea-form");
  const text = String(form?.elements[field]?.value || "").trim();
  return text || fallback;
}

function currentTitle() {
  return (painExamples[state.pain] || painExamples.unsure).title;
}

function starterPromptText() {
  return `You are helping me test one small AI task.

The task: ${currentTitle()}

Use the fake examples I paste below. For each example, ${value("assistantJob").toLowerCase()}

Rules:
- Use only the fake examples in this chat.
- ${value("limits", "Do not send, delete, update, schedule, or make final decisions without human approval.")}
- Draft, check, summarize, or flag only.
- Wait for my approval before anything else.`;
}

function makePlan() {
  const starterPrompt = starterPromptText();
  const plan = `# Starter AI assistant idea: ${currentTitle()}

## 1. The tiny job
Help with: ${currentTitle()}

## 2. Start with five examples
Copy five examples from: ${value("source")}

Start with the fake sample data generated below. Then try five sanitized real examples. Do not connect Gmail, Calendar, CRM, or private tools yet.

## 3. Ask the assistant to do only this
${value("assistantJob")}

## 4. Hard safety rule
${value("limits", "Do not send, delete, update, schedule, or make final decisions without human approval.")}

A human reviews every draft, flag, checklist, or summary before anything happens.

## 5. Success check
${value("success")}

## Copy/paste starter prompt
${starterPrompt}

## How to attach the data
No real attachment needed. Paste the fake examples under the starter prompt in the same chat.

## If this is useful
Then use the next-step files to make this more detailed. If it feels too broad, make the task smaller.`;

  qs("#starter-prompt-output").textContent = starterPrompt;
  qs("#plan-output").textContent = plan;
  localStorage.setItem("aw-starter-prompt", starterPrompt);
  localStorage.setItem("aw-plan", plan);
  generateMockData();
  saveForm();
  showStep(4);
}

function saveForm() {
  const form = qs("#idea-form");
  if (!form) return;
  localStorage.setItem("aw-form", JSON.stringify(Object.fromEntries(new FormData(form).entries())));
}

function restoreForm() {
  const form = qs("#idea-form");
  if (!form) return;
  const saved = localStorage.getItem("aw-form");
  if (saved) {
    try {
      const values = JSON.parse(saved);
      Object.entries(values).forEach(([key, val]) => {
        if (form.elements[key]) form.elements[key].value = val;
      });
    } catch {
      localStorage.removeItem("aw-form");
    }
  }
  const plan = localStorage.getItem("aw-plan");
  const starterPrompt = localStorage.getItem("aw-starter-prompt");
  if (starterPrompt && qs("#starter-prompt-output")) qs("#starter-prompt-output").textContent = starterPrompt;
  if (plan) qs("#plan-output").textContent = plan;
  const mockData = localStorage.getItem("aw-mock-data");
  if (mockData && qs("#mock-data-output")) qs("#mock-data-output").textContent = mockData;
}

async function copyElementText(id, button) {
  const element = document.getElementById(id);
  if (!element) return;
  const text = element.innerText;
  try {
    await navigator.clipboard.writeText(text);
    const old = button.textContent;
    button.textContent = "Copied";
    setTimeout(() => (button.textContent = old), 1200);
  } catch {
    window.prompt("Copy this text", text);
  }
}

function readableLabel(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function mockDataMarkdown() {
  const rows = mockDataExamples[state.pain] || mockDataExamples.unsure;
  const title = currentTitle();
  const headers = Object.keys(rows[0]);
  const lines = [
    `Fake examples for: ${title}`,
    "",
    "These are made up. Use them before using private or real data.",
    "",
  ];

  rows.forEach((row, index) => {
    lines.push(`Example ${index + 1}`);
    headers.forEach((key) => lines.push(`- ${readableLabel(key)}: ${row[key]}`));
    lines.push("");
  });

  lines.push("Paste this under the starter prompt.");
  lines.push("Tell the assistant: Use this fake data only. Draft/check/summarize only. Do not send, delete, update, schedule, or make final decisions.");
  return lines.join("\n");
}

function generateMockData() {
  const output = qs("#mock-data-output");
  if (!output) return;
  const data = mockDataMarkdown();
  output.textContent = data;
  localStorage.setItem("aw-mock-data", data);
}

function downloadText(text, filename) {
  const blob = new Blob([text], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadMockData() {
  const text = qs("#mock-data-output")?.innerText || mockDataMarkdown();
  downloadText(text, "fake-sample-data.md");
}

function downloadPlan() {
  const text = qs("#plan-output")?.innerText || "";
  downloadText(text, "first-ai-assistant-idea.md");
}

function startOver() {
  ["aw-pain", "aw-form", "aw-starter-prompt", "aw-plan", "aw-mock-data"].forEach((key) => localStorage.removeItem(key));
  state.pain = "";
  qs("#idea-form")?.reset();
  qs("#starter-prompt-output").textContent = "Choose a task to create a starter prompt.";
  qs("#plan-output").textContent = "Create a plan to see the result.";
  qs("#mock-data-output").textContent = "Choose a task to generate fake examples.";
  qsa(".choice-card").forEach((card) => card.classList.remove("selected"));
  showStep(1);
}

function init() {
  qsa("[data-pain]").forEach((button) => button.addEventListener("click", () => selectPain(button.dataset.pain)));
  qsa("[data-next]").forEach((button) => button.addEventListener("click", () => showStep(button.dataset.next)));
  qsa("[data-back]").forEach((button) => button.addEventListener("click", () => showStep(button.dataset.back)));
  qsa("[data-copy]").forEach((button) => button.addEventListener("click", () => copyElementText(button.dataset.copy, button)));
  qs("#make-plan")?.addEventListener("click", makePlan);
  qs("#quick-plan")?.addEventListener("click", makePlan);
  qs("#download-plan")?.addEventListener("click", downloadPlan);
  qs("#refresh-mock-data")?.addEventListener("click", generateMockData);
  qs("#download-mock-data")?.addEventListener("click", downloadMockData);
  qs("#start-over")?.addEventListener("click", startOver);
  qs("#idea-form")?.addEventListener("input", saveForm);

  restoreForm();
  if (state.pain && painExamples[state.pain]) {
    qsa(".choice-card").forEach((card) => card.classList.toggle("selected", card.dataset.pain === state.pain));
    renderExample();
  }
}

document.addEventListener("DOMContentLoaded", init);
