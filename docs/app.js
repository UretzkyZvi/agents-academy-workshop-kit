const providers = [
  { id: "mock", name: "Mock mode", note: "Free demo brain. No key needed.", status: "Ready now" },
  { id: "openrouter", name: "OpenRouter", note: "Many models through one key.", status: "BYOK soon" },
  { id: "openai", name: "OpenAI", note: "GPT models with your key.", status: "BYOK soon" },
  { id: "anthropic", name: "Anthropic", note: "Claude models with your key.", status: "BYOK soon" },
  { id: "google", name: "Google Gemini", note: "Gemini models with your key.", status: "BYOK soon" },
];

const missionTemplates = {
  intake: {
    title: "Intake Cleanup",
    icon: "📥",
    pitch: "New requests are messy and someone has to find what is missing.",
    summary: "Byte trains a team that summarizes new requests, finds missing information, drafts a reply, and stops at human approval.",
    input: "new request text",
    output: "summary, missing-info checklist, reply draft",
    sample: [
      { title: "Avery Chen", body: "Needs help setting up a workshop but did not include date, audience size, or budget." },
      { title: "Morgan Smith", body: "Asked about document review automation but did not say document type, volume, or reviewer." },
      { title: "Riley Johnson", body: "Wants training pricing but did not include team size, location, or preferred format." },
    ],
    agents: [
      ["Scout", "Reads the request and writes a plain summary.", "request text", "short summary"],
      ["Checker", "Finds missing facts and risk flags.", "request + summary", "missing-info checklist"],
      ["Writer", "Drafts a gentle reply for review.", "checklist", "draft reply"],
      ["Gatekeeper", "Blocks sending until a human approves.", "draft + locks", "approval queue"],
    ],
  },
  followups: {
    title: "Follow-up Patrol",
    icon: "⏰",
    pitch: "Leads, clients, renewals, or tasks go stale.",
    summary: "Byte trains a team that checks open items, flags stale follow-ups, drafts a nudge, and waits for approval.",
    input: "open follow-up list",
    output: "stale-item flags and draft nudges",
    sample: [
      { title: "Jordan Lee", body: "Proposal sent 12 days ago. Asked for pricing options. No reply yet." },
      { title: "Maya Patel", body: "Renewal discussion 8 days ago. Needed team size confirmation." },
      { title: "Taylor Brooks", body: "Pilot looked promising 21 days ago but no next meeting was booked." },
    ],
    agents: [
      ["Scout", "Reads open follow-up items.", "task list", "status summary"],
      ["Timer", "Finds stale or high-priority items.", "status summary", "follow-up flags"],
      ["Writer", "Drafts short nudges.", "flags", "draft message"],
      ["Gatekeeper", "Blocks sending and CRM updates.", "draft + locks", "approval queue"],
    ],
  },
  meetings: {
    title: "Meeting Cleanup",
    icon: "🗓️",
    pitch: "Notes, decisions, and action items get scattered.",
    summary: "Byte trains a team that turns messy notes into decisions, action items, and a follow-up draft.",
    input: "meeting notes",
    output: "summary, decisions, action items, follow-up draft",
    sample: [
      { title: "Client kickoff", body: "Discussed timeline, data export owner, and next check-in. No owner confirmed." },
      { title: "Ops sync", body: "Team agreed to test five fake examples first. Someone needs to collect them." },
      { title: "Partner call", body: "Partner can introduce prospects after reviewing a one-pager." },
    ],
    agents: [
      ["Scout", "Reads messy meeting notes.", "notes", "short summary"],
      ["Sorter", "Separates decisions from action items.", "summary + notes", "decision/action list"],
      ["Writer", "Drafts a follow-up note.", "action list", "draft follow-up"],
      ["Gatekeeper", "Blocks sending and task assignment.", "draft + locks", "approval queue"],
    ],
  },
  documents: {
    title: "Document Triage",
    icon: "📄",
    pitch: "Documents pile up and need first-pass review.",
    summary: "Byte trains a team that labels documents, summarizes them, and flags missing or unclear items.",
    input: "document names and pasted excerpts",
    output: "document label, summary, missing/unclear flags",
    sample: [
      { title: "intake-form-a.pdf", body: "Basic background is present, but signed consent is missing." },
      { title: "contract-draft.pdf", body: "Service terms appear outlined. Needs human legal review." },
      { title: "receipt-photo.jpg", body: "Travel expense receipt. Date is hard to read." },
    ],
    agents: [
      ["Scout", "Reads names and excerpts.", "document text", "plain summary"],
      ["Labeler", "Classifies the document type.", "summary", "document label"],
      ["Checker", "Flags unclear or missing items.", "label + text", "review flags"],
      ["Gatekeeper", "Blocks final legal, medical, or compliance decisions.", "flags + locks", "review queue"],
    ],
  },
  research: {
    title: "Research Scout",
    icon: "🔎",
    pitch: "You keep looking up similar people, companies, or topics.",
    summary: "Byte trains a team that organizes public research notes and creates a sourced brief for review.",
    input: "public links or notes",
    output: "short research brief with unknowns and source list",
    sample: [
      { title: "Acme Health", body: "Website mentions manual onboarding and a growing ops team." },
      { title: "Northstar Legal", body: "Blog posts suggest document-heavy client intake workflows." },
      { title: "ClearPath Clinics", body: "Careers page lists intake coordinator role." },
    ],
    agents: [
      ["Scout", "Reads public notes or links.", "research notes", "source summary"],
      ["Verifier", "Separates facts from guesses.", "source summary", "fact/unknown list"],
      ["Writer", "Creates a short brief.", "facts + unknowns", "research brief"],
      ["Gatekeeper", "Blocks unsupported claims and outreach.", "brief + locks", "review queue"],
    ],
  },
};

const locks = [
  ["send", "Send messages", "Locked until human approval is wired."],
  ["delete", "Delete records", "Locked for MVP and early real tests."],
  ["update", "Update tools", "Locked until read-only tests pass."],
  ["decide", "Make final decisions", "Humans own final calls."],
  ["advice", "Give professional advice", "Legal, medical, financial, and compliance advice stays blocked."],
];

const state = {
  provider: "mock",
  mission: "intake",
  sample: 0,
  approvals: [],
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function mission() { return missionTemplates[state.mission] || missionTemplates.intake; }

function renderProviders() {
  $("#provider-grid").innerHTML = providers.map((p) => `
    <button class="provider-card ${state.provider === p.id ? "selected" : ""}" type="button" data-provider="${p.id}">
      <strong>${p.name}</strong>
      <span>${p.note}</span>
      <em>${p.status}</em>
    </button>
  `).join("");
  $("#key-console").hidden = state.provider === "mock";
  $("#key-label").textContent = `${providers.find((p) => p.id === state.provider)?.name || "Provider"} API key`;
}

function renderMissions() {
  $("#mission-grid").innerHTML = Object.entries(missionTemplates).map(([id, m]) => `
    <button class="mission-card ${state.mission === id ? "selected" : ""}" type="button" data-mission="${id}">
      <span>${m.icon}</span><strong>${m.title}</strong><small>${m.pitch}</small>
    </button>
  `).join("");
}

function renderTeam() {
  const m = mission();
  $("#mission-title").textContent = `Mission: ${m.title}`;
  $("#mission-summary").textContent = m.summary;
  $("#agent-cards").innerHTML = m.agents.map(([name, job, reads, produces], index) => `
    <article class="agent-card">
      <div class="agent-avatar">${["🧭", "🔍", "✍️", "🛡️"][index] || "🤖"}</div>
      <h3>${name}</h3>
      <p>${job}</p>
      <dl><dt>Reads</dt><dd>${reads}</dd><dt>Produces</dt><dd>${produces}</dd><dt>Cannot</dt><dd>send, delete, update, or decide without approval</dd></dl>
    </article>
  `).join("");
  $("#export-preview").textContent = makeSpec();
  renderSample();
}

function renderLocks() {
  $("#lock-grid").innerHTML = locks.map(([id, label, desc]) => `
    <button class="lock-card ${state.approvals.includes(id) ? "locked" : ""}" type="button" data-lock="${id}">
      <span>${state.approvals.includes(id) ? "🔒" : "🔓"}</span>
      <strong>${label}</strong>
      <small>${desc}</small>
    </button>
  `).join("");
}

function renderSample() {
  const m = mission();
  const s = m.sample[state.sample % m.sample.length];
  $("#sample-title").textContent = s.title;
  $("#sample-body").textContent = s.body;
}

function mockOutput() {
  const m = mission();
  const s = m.sample[state.sample % m.sample.length];
  const missingLine = m.title.includes("Intake") ? "Missing info: date, audience size, budget, owner, or urgency." : "Flags: unclear owner, missing next step, and needs human review.";
  return `${m.title} test run\n\nInput card: ${s.title}\n${s.body}\n\nScout summary:\n- ${s.body}\n\nChecker output:\n- ${missingLine}\n\nWriter draft:\n- Here is a safe draft/checklist a human can review before anything is sent or changed.\n\nGatekeeper:\n- Sending locked\n- Tool updates locked\n- Final decisions locked\n- Human approval required`;
}

function starterPrompt() {
  const m = mission();
  return `You are my ${m.title} helper.\n\nYour job: ${m.summary}\n\nRead: ${m.input}\nProduce: ${m.output}\n\nRules:\n- Use only the examples I provide.\n- Draft, check, summarize, or flag only.\n- Do not send messages, delete records, update tools, make final decisions, or give professional advice.\n- Wait for human approval before anything else.\n\nStart by processing the fake examples below.`;
}

function manifest() {
  const m = mission();
  return {
    format: "agentworks.quest.v1",
    provider: state.provider,
    mission: m.title,
    summary: m.summary,
    input: m.input,
    output: m.output,
    agents: m.agents.map(([name, job, reads, produces]) => ({ name, job, reads, produces, cannot: ["send", "delete", "update", "final_decision", "professional_advice"] })),
    locks: locks.map(([id, label]) => ({ id, label, locked: true })),
    fake_examples: m.sample,
  };
}

function makeSpec() {
  const m = mission();
  return `# AgentWorks Quest Export: ${m.title}\n\n## Mission\n${m.summary}\n\n## Input\n${m.input}\n\n## Output\n${m.output}\n\n## Agent team\n${m.agents.map(([name, job, reads, produces]) => `### ${name}\n- Job: ${job}\n- Reads: ${reads}\n- Produces: ${produces}\n- Cannot: send, delete, update, or decide without approval`).join("\n\n")}\n\n## Safety locks\n${locks.map(([, label]) => `- ${label}: locked`).join("\n")}\n\n## Starter prompt\n${starterPrompt()}\n\n## Fake examples\n${m.sample.map((s, i) => `Example ${i + 1}: ${s.title}\n${s.body}`).join("\n\n")}`;
}

function hermesSkill() {
  const m = mission();
  return `---\nname: ${m.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-helper\ndescription: ${m.summary}\n---\n\n# ${m.title} Helper\n\nUse this when the user wants help with: ${m.input}.\n\n## Workflow\n\n${m.agents.map(([name, job], i) => `${i + 1}. ${name}: ${job}`).join("\n")}\n\n## Safety\n\nDo not send messages, delete records, update systems, make final decisions, or give professional advice without explicit human approval.\n\n## Starter prompt\n\n${starterPrompt()}\n`;
}

function download(text, filename, type = "text/markdown") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch { window.prompt("Copy this text", text); }
}

function exportArtifact(kind) {
  if (kind === "prompt") return copyText(starterPrompt());
  if (kind === "spec") return download(makeSpec(), "agent-spec.md");
  if (kind === "json") return download(JSON.stringify(manifest(), null, 2), "agentworks-agent.json", "application/json");
  if (kind === "hermes") return download(hermesSkill(), "SKILL.md");
  if (kind === "instructions") return download(starterPrompt(), "ai-instructions.md");
}

function init() {
  renderProviders(); renderMissions(); renderLocks(); renderTeam();

  $("#provider-grid").addEventListener("click", (e) => {
    const card = e.target.closest("[data-provider]");
    if (!card) return;
    state.provider = card.dataset.provider;
    renderProviders(); renderTeam();
  });
  $("#mission-grid").addEventListener("click", (e) => {
    const card = e.target.closest("[data-mission]");
    if (!card) return;
    state.mission = card.dataset.mission;
    state.sample = 0;
    renderMissions(); renderTeam();
    $("#team-room").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#build-custom").addEventListener("click", () => {
    const text = $("#custom-mission").value.toLowerCase();
    state.mission = text.includes("meeting") ? "meetings" : text.includes("document") || text.includes("file") ? "documents" : text.includes("research") ? "research" : text.includes("follow") ? "followups" : "intake";
    renderMissions(); renderTeam();
    $("#team-room").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#lock-grid").addEventListener("click", (e) => {
    const lock = e.target.closest("[data-lock]");
    if (!lock) return;
    const id = lock.dataset.lock;
    state.approvals = state.approvals.includes(id) ? state.approvals.filter((x) => x !== id) : [...state.approvals, id];
    renderLocks();
  });
  $("#next-sample").addEventListener("click", () => { state.sample += 1; renderSample(); });
  $("#run-test").addEventListener("click", () => { $("#test-output").textContent = mockOutput(); });
  $$('[data-approve], [data-reject], [data-unsafe]').forEach((b) => b.addEventListener("click", () => {
    $("#test-output").textContent += `\n\nHuman review: ${b.textContent.trim()}`;
  }));
  $$('[data-export]').forEach((b) => b.addEventListener("click", () => exportArtifact(b.dataset.export)));
  $('[data-scroll-export]').addEventListener('click', () => $('#export-portal').scrollIntoView({ behavior: 'smooth' }));
}

document.addEventListener("DOMContentLoaded", init);
