const $ = (s) => document.querySelector(s);

const providers = [
  ["mock", "MOCK MODE", "Ready now. No API key. Byte uses scripted mission generation."],
  ["openrouter", "OPENROUTER", "BYOK path. Many models through one key. Prototype UI only."],
  ["openai", "OPENAI", "BYOK path. GPT models. Prototype UI only."],
  ["anthropic", "ANTHROPIC", "BYOK path. Claude models. Prototype UI only."],
  ["google", "GOOGLE GEMINI", "BYOK path. Gemini models. Prototype UI only."],
];

const missions = {
  intake: {
    name: "INTAKE CLEANUP",
    brief: "New requests arrive messy. Train a team to summarize the request, find missing info, draft a reply, and stop at approval.",
    sample: "Avery needs a workshop next month but forgot date, audience size, budget, and decision owner.",
    agents: ["SCOUT reads the request", "CHECKER finds missing facts", "WRITER drafts a reply", "GATEKEEPER blocks risky actions"],
    output: "Missing info: date, audience size, budget, decision owner. Draft reply prepared for human review only.",
  },
  followups: {
    name: "FOLLOW-UP PATROL",
    brief: "Open items go stale. Train a team to spot stale follow-ups and draft safe nudges.",
    sample: "Jordan received a proposal 12 days ago and never replied. Pricing options were the last topic.",
    agents: ["SCOUT reads open items", "TIMER finds stale work", "WRITER drafts nudges", "GATEKEEPER blocks sending"],
    output: "Stale item flagged. Draft nudge prepared. Sending remains locked until human approval.",
  },
  meetings: {
    name: "MEETING CLEANUP",
    brief: "Notes are chaotic. Train a team to extract decisions, action items, and a follow-up draft.",
    sample: "Kickoff notes mention timeline, export owner, and next check-in. No owner was confirmed.",
    agents: ["SCOUT reads notes", "SORTER separates decisions", "WRITER drafts recap", "GATEKEEPER blocks sending"],
    output: "Action items extracted. Missing owner flagged. Follow-up recap drafted for review.",
  },
  documents: {
    name: "DOCUMENT TRIAGE",
    brief: "Documents pile up. Train a team to classify, summarize, and flag unclear items.",
    sample: "intake-form-a.pdf has background info but signed consent is missing.",
    agents: ["SCOUT reads excerpts", "LABELER classifies docs", "CHECKER flags gaps", "GATEKEEPER blocks final advice"],
    output: "Document labeled. Consent missing. Human review required before any professional conclusion.",
  },
  research: {
    name: "RESEARCH SCOUT",
    brief: "Research repeats. Train a team to organize notes into facts, unknowns, and a short brief.",
    sample: "Acme Health site mentions manual onboarding and a growing operations team.",
    agents: ["SCOUT reads public notes", "VERIFIER splits facts from guesses", "WRITER drafts brief", "GATEKEEPER blocks unsupported claims"],
    output: "Facts separated from guesses. Short brief drafted with unknowns and source notes.",
  },
};

const locks = ["SEND MESSAGES", "DELETE RECORDS", "UPDATE TOOLS", "FINAL DECISIONS", "PROFESSIONAL ADVICE"];

const state = {
  screen: "title",
  cursor: 0,
  provider: "mock",
  mission: "intake",
  locks: new Set(locks),
  score: 0,
  testRun: false,
};

const flow = ["title", "brain", "mission", "team", "locks", "test", "export"];

function currentMission() { return missions[state.mission]; }
function pad(n) { return String(n).padStart(4, "0"); }
function setScreen(screen) { state.screen = screen; state.cursor = 0; render(); }
function addScore(n) { state.score = Math.min(9999, state.score + n); }

function makePrompt() {
  const m = currentMission();
  return `You are my ${m.name} helper.\n\nMission: ${m.brief}\n\nAgent team:\n${m.agents.map((a) => `- ${a}`).join("\n")}\n\nSafety locks:\n${locks.map((l) => `- ${l}: locked until human approval`).join("\n")}\n\nRules:\n- Use only the examples I provide.\n- Draft, check, summarize, or flag only.\n- Do not send messages, delete records, update tools, make final decisions, or give professional advice.\n- Wait for human approval.\n\nFake example:\n${m.sample}`;
}

function makeSpec() {
  const m = currentMission();
  return `# AgentWorks Quest Export: ${m.name}\n\n## Mission\n${m.brief}\n\n## Agent Team\n${m.agents.map((a) => `- ${a}`).join("\n")}\n\n## Safety Locks\n${locks.map((l) => `- ${l}: locked`).join("\n")}\n\n## Fake Test\nInput: ${m.sample}\nOutput: ${m.output}\n\n## Starter Prompt\n${makePrompt()}\n`;
}

function manifest() {
  const m = currentMission();
  return { format: "agentworks.quest.console.v1", provider: state.provider, mission: m.name, brief: m.brief, agents: m.agents, locks, fake_test: { input: m.sample, expected_output: m.output }, prompt: makePrompt() };
}

function hermesSkill() {
  const m = currentMission();
  return `---\nname: ${m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-helper\ndescription: ${m.brief}\n---\n\n# ${m.name} Helper\n\n${m.brief}\n\n## Team\n${m.agents.map((a) => `- ${a}`).join("\n")}\n\n## Safety\n${locks.map((l) => `- ${l}: locked until explicit human approval`).join("\n")}\n\n## Starter Prompt\n${makePrompt()}\n`;
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); setStatus("COPIED TO CLIPBOARD"); }
  catch { window.prompt("Copy this", text); }
}
function download(text, filename, type = "text/markdown") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  setStatus(`DOWNLOADED ${filename.toUpperCase()}`);
}

function menuForScreen() {
  if (state.screen === "title") return [
    ["START NEW QUEST", () => setScreen("brain")],
    ["LOAD DEMO MISSION", () => { state.provider = "mock"; state.mission = "intake"; addScore(100); setScreen("team"); }],
    ["EXPORT SAMPLE", () => setScreen("export")],
  ];
  if (state.screen === "brain") return providers.map(([id, name, note]) => [name, () => { state.provider = id; addScore(id === "mock" ? 100 : 150); setScreen("mission"); }, note]);
  if (state.screen === "mission") return Object.entries(missions).map(([id, m]) => [m.name, () => { state.mission = id; addScore(200); setScreen("team"); }, m.brief]);
  if (state.screen === "team") return [["CONTINUE TO SAFETY LOCKS", () => { addScore(150); setScreen("locks"); }], ["CHANGE MISSION", () => setScreen("mission")], ["VIEW EXPORT PREVIEW", () => setScreen("export")]];
  if (state.screen === "locks") return [["LOCK ALL RISKY POWERS", () => { state.locks = new Set(locks); addScore(200); setScreen("test"); }], ["CONTINUE TO TEST LAB", () => setScreen("test")], ["BACK TO TEAM", () => setScreen("team")]];
  if (state.screen === "test") return [["RUN FAKE-DATA TEST", () => { state.testRun = true; addScore(300); render(); }], ["APPROVE MOCK OUTPUT", () => { state.testRun = true; addScore(250); setScreen("export"); }], ["CHANGE MISSION", () => setScreen("mission")]];
  if (state.screen === "export") return [["COPY STARTER PROMPT", () => copyText(makePrompt())], ["DOWNLOAD AGENT SPEC", () => download(makeSpec(), "agent-spec.md")], ["DOWNLOAD JSON MANIFEST", () => download(JSON.stringify(manifest(), null, 2), "agentworks-agent.json", "application/json")], ["DOWNLOAD HERMES SKILL", () => download(hermesSkill(), "SKILL.md")], ["DOWNLOAD AI INSTRUCTIONS", () => download(makePrompt(), "ai-instructions.md")], ["START OVER", () => setScreen("title")]];
  return [];
}

function contentForScreen() {
  const m = currentMission();
  const providerName = providers.find((p) => p[0] === state.provider)?.[1] || "MOCK";
  const base = {
    label: state.screen.toUpperCase(),
    kicker: "AGENT TRAINING CONSOLE",
    title: "Train tiny helpers. Export real agent specs.",
    copy: "Operate Byte’s console. Everything happens in this one arcade screen.",
    details: "",
  };
  if (state.screen === "brain") return { label: "BRAIN SELECT", kicker: "CHOOSE BYTE'S BRAIN", title: "Pick the model source.", copy: "Mock mode is ready now. BYOK options are shown as the future path.", details: providers.map(([id, name, note]) => `${state.provider === id ? ">" : " "} ${name}: ${note}`).join("\n") };
  if (state.screen === "mission") return { label: "MISSION SELECT", kicker: "PICK THE PROBLEM", title: "Choose one annoying workflow.", copy: "One mission becomes an agent team, safety locks, fake test, and export package.", details: Object.values(missions).map((x) => `${x.name}: ${x.brief}`).join("\n\n") };
  if (state.screen === "team") return { label: "TEAM BUILDER", kicker: m.name, title: "Your tiny helper team is online.", copy: m.brief, details: m.agents.map((a) => `▣ ${a}`).join("\n") };
  if (state.screen === "locks") return { label: "SAFETY LOCKS", kicker: "LOCK RISKY POWERS", title: "Do not let Byte act too soon.", copy: "MVP rule: draft, check, summarize, and flag only. Humans approve anything risky.", details: locks.map((l) => `[X] ${l}`).join("\n") };
  if (state.screen === "test") return { label: "TEST LAB", kicker: "FAKE DATA ONLY", title: "Run the mock test.", copy: m.sample, details: state.testRun ? `BYTE TEAM OUTPUT:\n${m.output}\n\nGATEKEEPER:\nSending locked. Tool updates locked. Human approval required.` : "Press RUN FAKE-DATA TEST." };
  if (state.screen === "export") return { label: "EXPORT PORTAL", kicker: "PACKAGE READY", title: "Export the trained helper.", copy: `${m.name} · ${providerName} · fake-data tested`, details: makeSpec().slice(0, 900) + "\n..." };
  return { ...base, label: "TITLE SCREEN", kicker: "INSERT COIN", title: "AgentWorks Quest", copy: "A one-screen arcade console where non-technical humans train AI helpers, lock risky powers, test on fake work, and export agent specs.", details: "ROBOTRON MODE: NO SCROLLING. ONE SCREEN. MENU DRIVEN.\n\nPRESS START NEW QUEST." };
}

function setStatus(text) { $("#status").textContent = text; }
function render() {
  const content = contentForScreen();
  const menu = menuForScreen();
  $("#screen-label").textContent = content.label;
  $("#kicker").textContent = content.kicker;
  $("#screen-title").textContent = content.title;
  $("#screen-copy").textContent = content.copy;
  $("#details").textContent = content.details;
  $("#score").textContent = pad(state.score);
  $("#trust").textContent = `LEVEL ${state.screen === "title" ? 0 : Math.min(4, flow.indexOf(state.screen))}`;
  $("#brain-readout").textContent = (providers.find((p) => p[0] === state.provider)?.[1] || "MOCK").replace(" MODE", "");
  $("#progress").textContent = `BRAIN: ${state.provider.toUpperCase()} · MISSION: ${currentMission().name} · TEAM: ${flow.indexOf(state.screen) >= 3 ? "ON" : "--"} · TEST: ${state.testRun ? "PASS" : "--"} · EXPORT: ${state.screen === "export" ? "READY" : "--"}`;
  $("#menu").innerHTML = menu.map(([label, , hint], i) => `<button class="menu-item ${i === state.cursor ? "active" : ""}" type="button" data-i="${i}"><span>${i === state.cursor ? ">" : " "}</span><strong>${label}</strong>${hint ? `<small>${hint}</small>` : ""}</button>`).join("");
  $("#menu").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { state.cursor = Number(b.dataset.i); select(); }));
  setStatus(statusText());
}

function statusText() {
  if (state.screen === "title") return "SYSTEM READY · PRESS START";
  if (state.screen === "brain") return "CHOOSE MODEL SOURCE · MOCK MODE RECOMMENDED";
  if (state.screen === "mission") return "SELECT ONE PAIN · NO GIANT WORKFLOWS";
  if (state.screen === "team") return "TEAM BUILT · EACH HELPER HAS ONE JOB";
  if (state.screen === "locks") return "RISKY POWERS LOCKED BEFORE REAL DATA";
  if (state.screen === "test") return "FAKE-DATA TEST LAB · PRACTICE BEFORE REAL WORK";
  return "EXPORT PORTAL · COPY OR DOWNLOAD AGENT PACKAGE";
}

function select() {
  const item = menuForScreen()[state.cursor];
  if (item) item[1]();
}
function back() {
  const idx = flow.indexOf(state.screen);
  if (idx > 0) setScreen(flow[idx - 1]);
}

document.addEventListener("keydown", (e) => {
  const menu = menuForScreen();
  if (["ArrowDown", "ArrowUp", "Enter", " ", "Escape"].includes(e.key)) e.preventDefault();
  if (e.key === "ArrowDown") { state.cursor = (state.cursor + 1) % menu.length; render(); }
  if (e.key === "ArrowUp") { state.cursor = (state.cursor - 1 + menu.length) % menu.length; render(); }
  if (e.key === "Enter" || e.key === " ") select();
  if (e.key === "Escape") back();
  if (/^[1-9]$/.test(e.key) && menu[Number(e.key) - 1]) { state.cursor = Number(e.key) - 1; select(); }
});

// Canvas arcade backdrop
const canvas = $("#arena");
const ctx = canvas.getContext("2d");
let t = 0;
function draw() {
  t += 1;
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = "#070817";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(64,248,255,.18)";
  ctx.lineWidth = 2;
  for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  const nodes = [[180,140,"BRAIN"],[780,140,"MISSION"],[180,400,"LOCKS"],[780,400,"EXPORT"],[480,270,"BYTE"]];
  for (const [x,y,label] of nodes) {
    ctx.fillStyle = label === "BYTE" ? "#ffe45c" : "#111b4d";
    ctx.strokeStyle = label === "BYTE" ? "#ff4fd8" : "#40f8ff";
    ctx.lineWidth = 5;
    ctx.fillRect(x - 54, y - 28, 108, 56);
    ctx.strokeRect(x - 54, y - 28, 108, 56);
    ctx.fillStyle = "#f8f7ff";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y + 5);
  }
  const bx = 480 + Math.sin(t / 24) * 16;
  const by = 270 + Math.cos(t / 30) * 10;
  ctx.fillStyle = "#3c5cff";
  ctx.strokeStyle = "#f8f7ff";
  ctx.lineWidth = 4;
  ctx.fillRect(bx - 18, by - 26, 36, 44);
  ctx.strokeRect(bx - 18, by - 26, 36, 44);
  ctx.fillStyle = "#fff";
  ctx.fillRect(bx - 10, by - 12, 6, 6);
  ctx.fillRect(bx + 5, by - 12, 6, 6);
  ctx.fillStyle = "#ff4f5e";
  for (let i = 0; i < 8; i++) {
    const x = (i * 137 + t * (i % 2 ? 1 : -1)) % w;
    const y = (i * 83 + t * .7) % h;
    ctx.fillRect((x + w) % w, y, 12, 12);
  }
  requestAnimationFrame(draw);
}

render(); draw();
