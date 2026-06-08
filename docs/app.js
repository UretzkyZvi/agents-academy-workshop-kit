const pathRecommendations = {
  beginner: {
    title: "Curious beginner path",
    intro: "Start with language and one safe use case. Do not choose tools yet.",
    links: [
      ["AI agents in plain English", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/resources/ai-agents-in-plain-english.md"],
      ["Choose one workflow", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/workshop/01-choose-a-workflow.md"],
      ["Workflow map template", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/templates/workflow-map.md"],
    ],
  },
  owner: {
    title: "Business owner / team lead path",
    intro: "Start with a low-risk pilot, a human approval rule, and a way to measure whether it helped.",
    links: [
      ["Choose one workflow", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/workshop/01-choose-a-workflow.md"],
      ["Write the agent spec", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/workshop/02-write-an-agent-spec.md"],
      ["Human approval flow", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/templates/human-approval-flow.md"],
      ["Evaluation checklist", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/templates/eval-checklist.md"],
    ],
  },
  operator: {
    title: "Non-technical operator path",
    intro: "Describe the workflow clearly enough that an agent tool, developer, or consultant can build the right thing.",
    links: [
      ["AI agents in plain English", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/resources/ai-agents-in-plain-english.md"],
      ["Workflow map template", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/templates/workflow-map.md"],
      ["Agent spec template", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/templates/agent-spec.md"],
      ["Run the first agent loop", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/workshop/03-run-the-first-agent.md"],
    ],
  },
  builder: {
    title: "Technical builder path",
    intro: "Turn the workflow into a small observable loop with limited tools, logs, evals, and human approval.",
    links: [
      ["Technical builder notes", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/resources/technical-builder-notes.md"],
      ["Agent spec template", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/templates/agent-spec.md"],
      ["Tools and platforms", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/resources/tools-and-platforms.md"],
      ["Evaluation checklist", "https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/templates/eval-checklist.md"],
    ],
  },
};

const signalRecommendations = {
  gmail: {
    title: "Gmail signal plan",
    firstTest: "Export or copy 5-10 emails from one label or search query into a CSV.",
    fields: ["date", "from/person", "organization", "subject/title", "body excerpt", "status/thread label", "url if available"],
    guardrails: ["Read-only first", "One label or query", "No sending", "No inbox-wide access", "Human approval for every reply"],
  },
  calendar: {
    title: "Calendar signal plan",
    firstTest: "Create a sample CSV of upcoming events or export the next 7-14 days.",
    fields: ["date", "person/attendees", "organization", "event title", "notes/body", "status", "event url"],
    guardrails: ["Read-only first", "Short time window", "No event edits", "No invite sending", "Human approval before scheduling changes"],
  },
  crm: {
    title: "CRM signal plan",
    firstTest: "Export one filtered view: renewals due, stale deals, new leads, or missing documents.",
    fields: ["date", "person/contact", "organization/account", "deal/client title", "notes/body", "status/stage", "record url"],
    guardrails: ["Read-only first", "One pipeline/view", "No record updates", "No bulk actions", "Human approval before CRM writes"],
  },
  sheets: {
    title: "Spreadsheet signal plan",
    firstTest: "Use a sheet as a simple signal queue. Add one row per item that needs agent review.",
    fields: ["date", "person", "organization", "title", "body/notes", "status", "url"],
    guardrails: ["Manual import/export first", "No formulas overwritten", "No write-back until reviewed", "Keep sensitive columns out"],
  },
};

function listLinks(links) {
  return links.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("");
}

function setPath(pathName) {
  const data = pathRecommendations[pathName];
  const output = document.querySelector("#path-output");
  if (!data || !output) return;

  document.querySelectorAll(".path-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.path === pathName);
  });

  output.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.intro}</p>
    <ul>${listLinks(data.links)}</ul>
  `;
  localStorage.setItem("agentworks-path", pathName);
}

function formatValue(value, fallback = "TBD") {
  const trimmed = String(value || "").trim();
  return trimmed || fallback;
}

function generateSpec(form) {
  const data = new FormData(form);
  const workflow = formatValue(data.get("workflow"), "Untitled workflow");
  const owner = formatValue(data.get("owner"));
  const trigger = formatValue(data.get("trigger"));
  const job = formatValue(data.get("job"));
  const limits = formatValue(data.get("limits"), "Do not send, update, delete, or make final decisions without human approval.");
  const approver = formatValue(data.get("approver"));
  const evalRule = formatValue(data.get("eval"));

  return `# Agent spec: ${workflow}

## Workflow owner
${owner}

## Trigger / signal
${trigger}

## Agent job
${job}

## Inputs needed
- Signal row or message/event/CRM record
- Relevant context supplied by the human or source export
- Any policy, checklist, or examples the agent must follow

## Outputs
- Summary of what happened
- Recommended next step
- Draft message or checklist, if useful
- Confidence / uncertainty notes

## Limits
${limits}

## Human approval
${approver} must approve before anything is sent, scheduled, updated, or filed.

## Evaluation
${evalRule}

## First test
Use 3-5 sample rows before connecting a real account. If the output is not useful with samples, do not add integrations yet.
`;
}

function setSignal(sourceName) {
  const data = signalRecommendations[sourceName];
  const output = document.querySelector("#signal-output");
  if (!data || !output) return;

  document.querySelectorAll(".signal-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.source === sourceName);
  });

  output.innerHTML = `
    <h3>${data.title}</h3>
    <p><strong>First test:</strong> ${data.firstTest}</p>
    <p><strong>Fields to map:</strong></p>
    <ul>${data.fields.map((item) => `<li>${item}</li>`).join("")}</ul>
    <p><strong>Guardrails:</strong></p>
    <ul>${data.guardrails.map((item) => `<li>${item}</li>`).join("")}</ul>
    <p><a href="https://github.com/UretzkyZvi/agents-academy-workshop-kit/blob/main/templates/signal-source-template.md">Open the signal source template</a></p>
  `;
  localStorage.setItem("agentworks-signal", sourceName);
}

async function copyElementText(elementId, button) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const text = element.innerText;
  try {
    await navigator.clipboard.writeText(text);
    const oldText = button.textContent;
    button.textContent = "Copied";
    setTimeout(() => {
      button.textContent = oldText;
    }, 1200);
  } catch (error) {
    window.prompt("Copy this text", text);
  }
}

function restoreForm() {
  const form = document.querySelector("#spec-form");
  const output = document.querySelector("#spec-output");
  const saved = localStorage.getItem("agentworks-spec-form");
  if (!form || !output || !saved) return;

  try {
    const values = JSON.parse(saved);
    Object.entries(values).forEach(([key, value]) => {
      const field = form.elements.namedItem(key);
      if (field) field.value = value;
    });
    output.textContent = generateSpec(form);
  } catch (error) {
    localStorage.removeItem("agentworks-spec-form");
  }
}

function saveForm(form) {
  const values = Object.fromEntries(new FormData(form).entries());
  localStorage.setItem("agentworks-spec-form", JSON.stringify(values));
}

function init() {
  document.querySelectorAll(".path-card").forEach((card) => {
    card.addEventListener("click", () => setPath(card.dataset.path));
  });

  document.querySelectorAll(".signal-card").forEach((card) => {
    card.addEventListener("click", () => setSignal(card.dataset.source));
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => copyElementText(button.dataset.copy, button));
  });

  const form = document.querySelector("#spec-form");
  const output = document.querySelector("#spec-output");
  if (form && output) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      output.textContent = generateSpec(form);
      saveForm(form);
    });

    form.addEventListener("input", () => saveForm(form));

    document.querySelector("#clear-spec")?.addEventListener("click", () => {
      form.reset();
      localStorage.removeItem("agentworks-spec-form");
      output.textContent = "Fill out the form to generate a starter spec.";
    });
  }

  restoreForm();
  setPath(localStorage.getItem("agentworks-path") || "owner");
  setSignal(localStorage.getItem("agentworks-signal") || "gmail");
}

document.addEventListener("DOMContentLoaded", init);
