const examples = {
  intake: {
    task: "Follow up with new client intake emails",
    source: "Gmail label called New Intake, or a form submission spreadsheet",
    output: "Summarize the request, list missing information, and draft a short reply for a human to review.",
    limits: "Do not send the email. Do not promise services or advice. Do not update client records without approval.",
    reviewer: "Office manager",
    success: "Fewer missed intake replies and less time spent figuring out what information is missing.",
  },
  followup: {
    task: "Find follow-ups that might be slipping through the cracks",
    source: "CRM view, spreadsheet, or inbox label for open follow-ups",
    output: "List who needs a follow-up, explain why, and draft a message for review.",
    limits: "Do not send messages. Do not change CRM status. Do not mark anything complete by itself.",
    reviewer: "Business owner or account manager",
    success: "Catch stale follow-ups earlier and save 30 minutes per week.",
  },
  meeting: {
    task: "Turn meeting notes into clear next steps",
    source: "Calendar event and pasted meeting notes",
    output: "Summarize decisions, list action items, and draft a follow-up note.",
    limits: "Do not send the follow-up. Do not schedule meetings. Do not assign tasks without review.",
    reviewer: "Meeting owner",
    success: "Less time rewriting notes and fewer forgotten action items.",
  },
  docs: {
    task: "Review documents before work moves forward",
    source: "Folder of uploaded documents, document list, or intake spreadsheet",
    output: "Summarize each document, classify what it is, and flag missing or unclear items.",
    limits: "Do not make final legal, medical, financial, or compliance decisions. Do not delete or move files.",
    reviewer: "Workflow owner or specialist",
    success: "Faster first review and fewer missing-document surprises.",
  },
};

function valueOrFallback(value, fallback = "Not decided yet") {
  const text = String(value || "").trim();
  return text || fallback;
}

function makePlan(form) {
  const data = new FormData(form);
  const task = valueOrFallback(data.get("task"), "Untitled assistant idea");
  const source = valueOrFallback(data.get("source"));
  const output = valueOrFallback(data.get("output"));
  const limits = valueOrFallback(
    data.get("limits"),
    "Do not send, delete, update, schedule, or make final decisions without human approval."
  );
  const reviewer = valueOrFallback(data.get("reviewer"));
  const success = valueOrFallback(data.get("success"));

  return `# First assistant plan: ${task}

## 1. The task
${task}

## 2. Where the work shows up
${source}

This is the signal point. It is the place where the assistant knows there is something to review.

## 3. What the assistant should produce
${output}

## 4. What the assistant must not do
${limits}

## 5. Human review
${reviewer} reviews the output before anything is sent, changed, scheduled, filed, or marked complete.

## 6. First safe test
Use 3-5 copied examples or sample rows. Do not connect a real account yet.

## 7. Success test
${success}

## Next step
If this plan looks clear, use the workflow map and agent spec templates in the workshop kit. If it still feels vague, make the task smaller.`;
}

function fillExample(name) {
  const form = document.querySelector("#plan-form");
  const output = document.querySelector("#plan-output");
  const example = examples[name];
  if (!form || !output || !example) return;

  Object.entries(example).forEach(([field, value]) => {
    if (form.elements[field]) form.elements[field].value = value;
  });

  document.querySelectorAll(".problem-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.example === name);
  });

  output.textContent = makePlan(form);
  saveForm(form);
  localStorage.setItem("agentworks-example", name);
  document.querySelector("#builder")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function saveForm(form) {
  const values = Object.fromEntries(new FormData(form).entries());
  localStorage.setItem("agentworks-plan-form", JSON.stringify(values));
}

function restoreForm() {
  const form = document.querySelector("#plan-form");
  const output = document.querySelector("#plan-output");
  if (!form || !output) return;

  const saved = localStorage.getItem("agentworks-plan-form");
  if (!saved) return;

  try {
    const values = JSON.parse(saved);
    Object.entries(values).forEach(([field, value]) => {
      if (form.elements[field]) form.elements[field].value = value;
    });
    output.textContent = makePlan(form);
  } catch (error) {
    localStorage.removeItem("agentworks-plan-form");
  }
}

async function copyElementText(elementId, button) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const text = element.innerText;
  try {
    await navigator.clipboard.writeText(text);
    const original = button.textContent;
    button.textContent = "Copied";
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  } catch (error) {
    window.prompt("Copy this text", text);
  }
}

function init() {
  const form = document.querySelector("#plan-form");
  const output = document.querySelector("#plan-output");

  document.querySelectorAll(".problem-card").forEach((card) => {
    card.addEventListener("click", () => fillExample(card.dataset.example));
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => copyElementText(button.dataset.copy, button));
  });

  if (form && output) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      output.textContent = makePlan(form);
      saveForm(form);
    });

    form.addEventListener("input", () => saveForm(form));

    document.querySelector("#clear-plan")?.addEventListener("click", () => {
      form.reset();
      localStorage.removeItem("agentworks-plan-form");
      localStorage.removeItem("agentworks-example");
      document.querySelectorAll(".problem-card").forEach((card) => card.classList.remove("active"));
      output.textContent = "Choose an example or fill out the form to create your first plan.";
    });
  }

  restoreForm();
  const selected = localStorage.getItem("agentworks-example");
  if (selected) {
    document.querySelectorAll(".problem-card").forEach((card) => {
      card.classList.toggle("active", card.dataset.example === selected);
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
