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
  showStep(2);
}

function renderExample() {
  const example = painExamples[state.pain] || painExamples.unsure;
  qs("#example-output").innerHTML = `
    <h3>${example.title}</h3>
    <p class="large-copy">${example.simple}</p>
    <div class="why-box">
      <p class="mini-label">Why this is a good first test</p>
      <ul>${example.goodBecause.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>
    <p class="safe-note"><strong>Important:</strong> the first version should draft, check, summarize, or flag. It should not send, delete, update records, or make final decisions.</p>
  `;
}

function prefillForm() {
  const form = qs("#idea-form");
  const example = painExamples[state.pain] || painExamples.unsure;
  if (!form) return;
  ["source", "manual", "assistantJob", "limits", "reviewer", "success"].forEach((field) => {
    form.elements[field].value = example[field] || "";
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

function makePlan() {
  const plan = `# First AI assistant idea: ${currentTitle()}

## What problem this helps with
${currentTitle()}

## Where the work shows up
${value("source")}

## What you do manually today
${value("manual")}

## What the assistant should draft, check, or summarize
${value("assistantJob")}

## What the assistant must not do
${value("limits", "Do not send, delete, update, schedule, or make final decisions without human approval.")}

## Human review rule
${value("reviewer", "A human reviewer")} reviews the output before anything is sent, changed, scheduled, filed, or marked complete.

## First safe test
Copy or export 5 examples. Put them in a simple table. Ask the assistant to draft/check/summarize. Review every output manually.

Do not connect Gmail, Calendar, CRM, or private tools until this manual test is useful.

## What would make it worth using
${value("success")}

## Next step
If this feels clear, open the workshop kit files for the workflow map, assistant spec, signal source template, and evaluation checklist. If this still feels broad, make the task smaller.`;

  qs("#plan-output").textContent = plan;
  localStorage.setItem("aw-plan", plan);
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
  if (plan) qs("#plan-output").textContent = plan;
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

function downloadPlan() {
  const text = qs("#plan-output")?.innerText || "";
  const blob = new Blob([text], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "first-ai-assistant-idea.md";
  link.click();
  URL.revokeObjectURL(url);
}

function startOver() {
  ["aw-pain", "aw-form", "aw-plan"].forEach((key) => localStorage.removeItem(key));
  state.pain = "";
  qs("#idea-form")?.reset();
  qs("#plan-output").textContent = "Create a plan to see the result.";
  qsa(".choice-card").forEach((card) => card.classList.remove("selected"));
  showStep(1);
}

function init() {
  qsa("[data-pain]").forEach((button) => button.addEventListener("click", () => selectPain(button.dataset.pain)));
  qsa("[data-next]").forEach((button) => button.addEventListener("click", () => showStep(button.dataset.next)));
  qsa("[data-back]").forEach((button) => button.addEventListener("click", () => showStep(button.dataset.back)));
  qsa("[data-copy]").forEach((button) => button.addEventListener("click", () => copyElementText(button.dataset.copy, button)));
  qs("#make-plan")?.addEventListener("click", makePlan);
  qs("#download-plan")?.addEventListener("click", downloadPlan);
  qs("#start-over")?.addEventListener("click", startOver);
  qs("#idea-form")?.addEventListener("input", saveForm);

  restoreForm();
  if (state.pain && painExamples[state.pain]) {
    qsa(".choice-card").forEach((card) => card.classList.toggle("selected", card.dataset.pain === state.pain));
    renderExample();
  }
}

document.addEventListener("DOMContentLoaded", init);
