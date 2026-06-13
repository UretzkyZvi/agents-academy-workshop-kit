const $ = (s) => document.querySelector(s);

const providers = [
  { id: "mock", name: "Demo Brain", note: "No key needed. Shows the full agent run with fake work." },
  { id: "openrouter", name: "OpenRouter", note: "Bring your key. The local server can run the agents with it." },
  { id: "openai", name: "OpenAI", note: "Bring your key. Good default for first real runs." },
  { id: "anthropic", name: "Anthropic", note: "Bring your Claude key when the server is running." },
  { id: "google", name: "Google Gemini", note: "Bring your Gemini key when the server is running." },
];

const templates = {
  conversations: {
    title: "Conversation Organizer",
    plain: "Organize conversations and meetings into decisions, action items, risks, and follow-ups.",
    dataLabel: "Fake conversation + meeting notes",
    fakeData: `Meeting: Client kickoff\nAvery said the biggest issue is losing track of decisions after calls. Morgan owns the data export. The team wants a draft follow-up by Friday. Nobody confirmed who approves the final email.\n\nChat: Slack follow-up\nRiley asked whether the assistant can summarize client calls and create tasks. Dana warned not to send anything automatically yet.\n\nMeeting: Ops sync\nDecision: start with fake notes first. Action: collect 5 examples. Risk: mixing client-sensitive details into tests.`,
    agents: [
      { icon: "🧭", name: "Scouter", role: "Find the important pieces in messy conversations.", prompt: "Read the input and identify meetings, chats, people, dates, decisions, and unresolved topics. Do not invent anything." },
      { icon: "🧩", name: "Extractor", role: "Turn messy notes into structured fields.", prompt: "Extract decisions, action items, owners, deadlines, risks, and open questions. If a field is missing, say missing." },
      { icon: "✅", name: "Checker", role: "Check safety and uncertainty.", prompt: "Review the extracted structure. Flag uncertain claims, missing approvals, sensitive information, and anything that should not be automated." },
      { icon: "✉️", name: "Drafter", role: "Create a human-approved summary.", prompt: "Draft a concise meeting summary and follow-up checklist. Do not send it. Make approval steps obvious." },
    ],
  },
  document: {
    title: "Document Organizer",
    plain: "Read a document-like example and produce a summary, missing info, and review checklist.",
    dataLabel: "Fake document",
    fakeData: `Document: Intake Request Draft\nClient asks for an AI workflow to organize renewal emails. They mention a March deadline and 200 accounts. Missing: exact data source, approval owner, and what counts as success. The draft includes one risky line: 'The AI can update the CRM automatically.'`,
    agents: [
      { icon: "📄", name: "Reader", role: "Read the document and summarize it plainly.", prompt: "Read the document and summarize the purpose, key facts, and missing information." },
      { icon: "🔍", name: "Extractor", role: "Pull out fields and risks.", prompt: "Extract fields, dates, numbers, stakeholders, missing details, and risky claims." },
      { icon: "🛡️", name: "Safety Checker", role: "Spot actions that need approval.", prompt: "Flag anything that should require human approval before automation." },
      { icon: "📝", name: "Drafter", role: "Prepare a safe next-step checklist.", prompt: "Create a review checklist and draft next steps for a human." },
    ],
  },
  meeting: {
    title: "Meeting Summary Builder",
    plain: "Turn meeting notes into a clean recap and follow-up list.",
    dataLabel: "Fake meeting transcript",
    fakeData: `Transcript excerpt\nGreg: We need one place where the agent shows what it read and what it passed to the next helper.\nAster: The first helper can scout the data, then an extractor can structure it.\nGreg: Make it bright and non-technical. Also maybe LangGraph or CrewAI later.\nAster: For MVP, we can export those scaffolds and run a local server for real LLM calls.`,
    agents: [
      { icon: "🎧", name: "Listener", role: "Read the transcript like a careful note-taker.", prompt: "Summarize the conversation without adding new claims." },
      { icon: "📌", name: "Action Finder", role: "Find decisions and next actions.", prompt: "Extract decisions, action items, owners if named, and open questions." },
      { icon: "🧪", name: "Reality Checker", role: "Separate facts from assumptions.", prompt: "Flag assumptions, unclear items, and things needing approval." },
      { icon: "📬", name: "Recap Writer", role: "Draft a friendly recap.", prompt: "Write a short recap and follow-up checklist for human review." },
    ],
  },
};

const state = {
  screen: "title",
  cursor: 0,
  provider: "mock",
  apiKey: "",
  appText: "I want to organize all the information from conversations and meetings. Show decisions, action items, risks, follow-ups, and what needs human approval.",
  template: "conversations",
  data: "",
  agents: [],
  runLog: [],
  running: false,
  score: 0,
};

const flow = ["title", "brain", "define", "data", "agents", "run", "export"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const escapeHtml = (s = "") => String(s).replace(/[&<>"]/g, (m) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[m]));
const currentTemplate = () => templates[state.template] || templates.conversations;

function setScreen(screen) { state.screen = screen; state.cursor = 0; render(); }
function addScore(n) { state.score = Math.min(9999, state.score + n); }
function setStatus(text) { $("#status").textContent = text; }

function inferTemplate(text) {
  const t = text.toLowerCase();
  if (t.includes("document") || t.includes("pdf") || t.includes("file")) return "document";
  if (t.includes("meeting") || t.includes("transcript") || t.includes("summary")) return "meeting";
  return "conversations";
}

function generateFromDefinition() {
  state.template = inferTemplate(state.appText);
  const t = currentTemplate();
  state.data = t.fakeData;
  state.agents = JSON.parse(JSON.stringify(t.agents));
  addScore(300);
}

function agentInput(index) {
  if (index === 0) return state.data;
  const prev = state.runLog[index - 1];
  return prev ? prev.output : state.data;
}

function mockAgentOutput(agent, input, index) {
  const title = currentTemplate().title;
  if (index === 0) return `${agent.name} found the main work type: ${title}.\nKey source material: meetings/chats/doc notes.\nImportant signals: decisions, owners, risks, follow-ups, and missing approvals.`;
  if (index === 1) return `Structured output:\n- Decisions: start with fake examples; show agent handoffs clearly.\n- Action items: collect examples; approve profiles; run the agent chain.\n- Owners: named only when present.\n- Open questions: which real system connects later?\n- Missing info: approval owner and success criteria.`;
  if (index === 2) return `Safety check:\n- Do not send messages automatically.\n- Do not update CRM/docs yet.\n- Flag sensitive client details before real runs.\n- Human approval required before using real data or external tools.`;
  return `Human-ready output:\nSummary: The agent team organized the messy information into decisions, action items, risks, and follow-ups.\nNext step: Human reviews the summary, edits anything wrong, then approves export or another test run.`;
}

async function callServerAgent(agent, input, index) {
  const res = await fetch("/api/run-agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider: state.provider, apiKey: state.apiKey, agent, input, appText: state.appText, index }),
  });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return json.output;
}

async function runAgents() {
  if (!state.agents.length) generateFromDefinition();
  state.running = true;
  state.runLog = [];
  setScreen("run");
  for (let i = 0; i < state.agents.length; i++) {
    const agent = state.agents[i];
    const input = agentInput(i);
    const step = {
      icon: agent.icon,
      name: agent.name,
      role: agent.role,
      prompt: agent.prompt,
      input,
      call: state.provider === "mock" ? "Demo Brain local simulation" : `${providers.find(p => p.id === state.provider)?.name} via local /api/run-agent`,
      doing: "Reading input, applying its profile, producing output for the next helper...",
      output: "working...",
    };
    state.runLog.push(step);
    render();
    await sleep(700);
    try {
      step.output = state.provider === "mock" || !state.apiKey ? mockAgentOutput(agent, input, i) : await callServerAgent(agent, input, i);
    } catch (err) {
      step.output = `Server/API run failed, so Byte fell back to demo mode.\nReason: ${err.message}\n\n${mockAgentOutput(agent, input, i)}`;
    }
    addScore(250);
    render();
    await sleep(450);
  }
  state.running = false;
  addScore(500);
  render();
}

function makeMarkdownSpec() {
  return `# AgentWorks Quest Agent Team\n\n## Application\n${state.appText}\n\n## Fake Data\n${state.data}\n\n## Agents\n${state.agents.map(a => `### ${a.name}\n- Role: ${a.role}\n- Prompt: ${a.prompt}`).join("\n\n")}\n\n## Run Log\n${state.runLog.map(s => `### ${s.name}\nPrompt: ${s.prompt}\n\nInput:\n${s.input}\n\nCall:\n${s.call}\n\nOutput:\n${s.output}`).join("\n\n")}\n`;
}
function makeLangGraph() {
  return `from typing import TypedDict\nfrom langgraph.graph import StateGraph, START, END\n\nclass AgentState(TypedDict):\n    text: str\n    log: list[str]\n\ndef call_agent(name, prompt, text):\n    # Replace this with your LLM call.\n    return f"{name} processed: {text[:200]}"\n\n${state.agents.map(a => `def ${a.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}(state: AgentState):\n    out = call_agent(${JSON.stringify(a.name)}, ${JSON.stringify(a.prompt)}, state["text"])\n    return {"text": out, "log": state["log"] + [out]}\n`).join("\n")}\ngraph = StateGraph(AgentState)\n${state.agents.map(a => `graph.add_node("${a.name}", ${a.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")})`).join("\n")}\ngraph.add_edge(START, "${state.agents[0]?.name || "Agent"}")\n${state.agents.slice(0,-1).map((a,i) => `graph.add_edge("${a.name}", "${state.agents[i+1].name}")`).join("\n")}\ngraph.add_edge("${state.agents.at(-1)?.name || "Agent"}", END)\napp = graph.compile()\nprint(app.invoke({"text": ${JSON.stringify(state.data)}, "log": []}))\n`;
}
function makeCrewAI() {
  return `from crewai import Agent, Task, Crew\n\n${state.agents.map(a => `${a.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_agent = Agent(\n    role=${JSON.stringify(a.name)},\n    goal=${JSON.stringify(a.role)},\n    backstory=${JSON.stringify(a.prompt)}\n)`).join("\n\n")}\n\n${state.agents.map((a,i) => `task_${i+1} = Task(\n    description=${JSON.stringify(`${a.prompt}\n\nInput:\n${i === 0 ? state.data : 'Use the previous task output.'}`)},\n    agent=${a.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_agent,\n    expected_output="Clear structured output for the next helper"\n)`).join("\n\n")}\n\ncrew = Crew(agents=[${state.agents.map(a => `${a.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_agent`).join(", ")}], tasks=[${state.agents.map((_,i) => `task_${i+1}`).join(", ")}])\nprint(crew.kickoff())\n`;
}

async function copyText(text) { try { await navigator.clipboard.writeText(text); setStatus("COPIED"); } catch { window.prompt("Copy this", text); } }
function download(text, filename, type="text/plain") { const blob = new Blob([text], {type}); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url); setStatus(`SAVED ${filename}`); }

function menuForScreen() {
  if (state.screen === "title") return [["START", () => setScreen("brain")], ["PLAY DEMO RUN", () => { generateFromDefinition(); runAgents(); }], ["EXPORT EXAMPLES", () => { generateFromDefinition(); setScreen("export"); }]];
  if (state.screen === "brain") return providers.map(p => [p.name.toUpperCase(), () => { state.provider = p.id; addScore(100); setScreen("define"); }, p.note]);
  if (state.screen === "define") return [["GENERATE FAKE WORK + AGENTS", () => { saveDefineFields(); generateFromDefinition(); setScreen("data"); }], ["SKIP TO AGENT PROFILES", () => { saveDefineFields(); generateFromDefinition(); setScreen("agents"); }]];
  if (state.screen === "data") return [["APPROVE FAKE DATA", () => { saveDataField(); setScreen("agents"); }], ["REGENERATE FROM DEFINITION", () => { saveDataField(); generateFromDefinition(); setScreen("data"); }], ["EDIT APPLICATION", () => setScreen("define")]];
  if (state.screen === "agents") return [["APPROVE PROFILES", () => { saveAgentFields(); addScore(250); setScreen("run"); }], ["PLAY AGENTS NOW", () => { saveAgentFields(); runAgents(); }], ["BACK TO FAKE DATA", () => setScreen("data")]];
  if (state.screen === "run") return [[state.running ? "AGENTS RUNNING..." : "PLAY AGENTS", () => { if (!state.running) runAgents(); }], ["EXPORT RUN", () => setScreen("export")], ["EDIT AGENTS", () => setScreen("agents")]];
  if (state.screen === "export") return [["COPY AGENT SPEC", () => copyText(makeMarkdownSpec())], ["DOWNLOAD AGENT SPEC", () => download(makeMarkdownSpec(), "agent-spec.md", "text/markdown")], ["DOWNLOAD LANGGRAPH PY", () => download(makeLangGraph(), "agentworks_langgraph.py", "text/x-python")], ["DOWNLOAD CREWAI PY", () => download(makeCrewAI(), "agentworks_crewai.py", "text/x-python")], ["DOWNLOAD RUN JSON", () => download(JSON.stringify({ app: state.appText, data: state.data, agents: state.agents, runLog: state.runLog }, null, 2), "agentworks-run.json", "application/json")], ["START OVER", () => setScreen("title")]];
  return [];
}

function saveDefineFields() { const app = $("#app-text"); const key = $("#api-key"); if (app) state.appText = app.value; if (key) state.apiKey = key.value.trim(); }
function saveDataField() { const data = $("#fake-data"); if (data) state.data = data.value; }
function saveAgentFields() {
  state.agents = state.agents.map((a, i) => ({ ...a, role: $(`#agent-role-${i}`)?.value || a.role, prompt: $(`#agent-prompt-${i}`)?.value || a.prompt }));
}

function detailsForScreen() {
  const provider = providers.find(p => p.id === state.provider) || providers[0];
  if (state.screen === "brain") return `<div class="choice-grid">${providers.map(p => `<div class="chip ${p.id===state.provider?'on':''}"><strong>${p.name}</strong><span>${p.note}</span></div>`).join("")}</div><p class="friendly-note">For MVP: demo mode runs anywhere. Real API keys work when the local server is running.</p>`;
  if (state.screen === "define") return `<label class="field"><span>What should this agent team help with?</span><textarea id="app-text">${escapeHtml(state.appText)}</textarea></label><label class="field"><span>${provider.name} key ${state.provider==='mock'?'(optional)':('(used by local server)')}</span><input id="api-key" type="password" value="${escapeHtml(state.apiKey)}" placeholder="Paste key for a real run, or leave empty for demo" /></label>`;
  if (state.screen === "data") return `<label class="field"><span>${escapeHtml(currentTemplate().dataLabel)}</span><textarea id="fake-data">${escapeHtml(state.data || currentTemplate().fakeData)}</textarea></label><p class="friendly-note">This is where users see the fake conversations, meetings, or documents before agents touch anything real.</p>`;
  if (state.screen === "agents") return `<div class="agent-grid">${state.agents.map((a,i) => `<article class="agent-card"><div class="avatar">${a.icon}</div><h3>${escapeHtml(a.name)}</h3><label>Profile<input id="agent-role-${i}" value="${escapeHtml(a.role)}" /></label><label>Prompt<textarea id="agent-prompt-${i}">${escapeHtml(a.prompt)}</textarea></label></article>`).join("")}</div>`;
  if (state.screen === "run") return state.runLog.length ? `<div class="run-lane">${state.runLog.map((s,i) => `<article class="run-card ${s.output==='working...'?'working':''}"><div class="avatar">${s.icon}</div><h3>${escapeHtml(s.name)}</h3><p><b>Prompted:</b> ${escapeHtml(s.prompt)}</p><p><b>Input:</b> ${escapeHtml(s.input).slice(0,280)}</p><p><b>Calling:</b> ${escapeHtml(s.call)}</p><p><b>Doing:</b> ${escapeHtml(s.doing)}</p><pre>${escapeHtml(s.output)}</pre><small>Output passes to ${state.agents[i+1]?.name || 'the human review screen'}.</small></article>`).join("")}</div>` : `<div class="play-pad"><div class="big-avatar">▶</div><p>Press Play. Each character will reveal what it was prompted, what it read, what it called, what it did, and what it passed forward.</p></div>`;
  if (state.screen === "export") return `<div class="export-preview"><h3>Export includes</h3><ul><li>Agent profile cards</li><li>Full run log</li><li>LangGraph scaffold</li><li>CrewAI scaffold</li><li>JSON manifest</li></ul><pre>${escapeHtml(makeMarkdownSpec()).slice(0,1000)}...</pre></div>`;
  return `<div class="welcome-card"><div class="big-avatar">🤖</div><p>No black-box magic. Users watch the little agents work step by step on fake conversations, meetings, or documents.</p><p class="friendly-note">Bright arcade mode. Less terminal. More training game.</p></div>`;
}

function contentForScreen() {
  const t = currentTemplate();
  const base = { label: "TITLE", kicker: "WELCOME", title: "Train agent characters.", copy: "Define the application, generate fake work, approve profiles, then press Play and watch the agents pass work to each other." };
  if (state.screen === "brain") return { label: "CHOOSE BRAIN", kicker: "STEP 1", title: "Pick how Byte thinks.", copy: "Use demo mode or paste a key for local server runs. The point is to show real agent behavior, not just a static mockup." };
  if (state.screen === "define") return { label: "DEFINE APP", kicker: "STEP 2", title: "Tell Byte the job.", copy: "Example: organize conversations and meetings into decisions, action items, risks, and follow-ups." };
  if (state.screen === "data") return { label: "FAKE WORK", kicker: "STEP 3", title: "Generate safe practice data.", copy: `Current application: ${t.title}. Users see the fake work before any agent runs.` };
  if (state.screen === "agents") return { label: "AGENT CARDS", kicker: "STEP 4", title: "Approve the characters.", copy: "Each character is an agent profile. Users can edit the role and prompt before pressing Play." };
  if (state.screen === "run") return { label: "LIVE RUN", kicker: "STEP 5", title: "Agents are working.", copy: "Watch prompt → input → call → action → output. Each output becomes the next agent's input." };
  if (state.screen === "export") return { label: "EXPORT", kicker: "STEP 6", title: "Take the agent team out.", copy: "Export a plain spec, run JSON, LangGraph scaffold, or CrewAI scaffold." };
  return base;
}

function render() {
  const content = contentForScreen();
  const menu = menuForScreen();
  $("#screen-label").textContent = content.label;
  $("#kicker").textContent = content.kicker;
  $("#screen-title").textContent = content.title;
  $("#screen-copy").textContent = content.copy;
  $("#details").innerHTML = detailsForScreen();
  $("#score").textContent = String(state.score).padStart(4, "0");
  $("#run-readout").textContent = state.running ? "LIVE" : state.runLog.length ? "DONE" : "IDLE";
  $("#brain-readout").textContent = (providers.find(p => p.id === state.provider)?.name || "Demo").split(" ")[0].toUpperCase();
  $("#progress").textContent = `BRAIN: ${state.provider.toUpperCase()} · APP: ${state.appText ? "SET" : "--"} · DATA: ${state.data ? "READY" : "--"} · AGENTS: ${state.agents.length || "--"} · RUN: ${state.runLog.length ? "DONE" : "--"}`;
  $("#menu").innerHTML = menu.map(([label,,hint], i) => `<button class="menu-item ${i===state.cursor?'active':''}" type="button" data-i="${i}"><span>${i===state.cursor?'▶':' '}</span><strong>${label}</strong>${hint?`<small>${escapeHtml(hint)}</small>`:''}</button>`).join("");
  $("#menu").querySelectorAll("button").forEach(b => b.addEventListener("click", () => { state.cursor = Number(b.dataset.i); select(); }));
  setStatus(state.screen === "run" ? (state.running ? "AGENTS ARE WORKING" : "READY TO PLAY AGENTS") : "USE MENU OR KEYBOARD");
}
function select() { const item = menuForScreen()[state.cursor]; if (item) item[1](); }
function back() { const idx = flow.indexOf(state.screen); if (idx > 0) setScreen(flow[idx - 1]); }

document.addEventListener("keydown", (e) => {
  const menu = menuForScreen();
  if (["ArrowDown","ArrowUp","Enter"," ","Escape"].includes(e.key)) e.preventDefault();
  if (e.key === "ArrowDown") { state.cursor = (state.cursor + 1) % menu.length; render(); }
  if (e.key === "ArrowUp") { state.cursor = (state.cursor - 1 + menu.length) % menu.length; render(); }
  if (e.key === "Enter" || e.key === " ") select();
  if (e.key === "Escape") back();
  if (/^[1-9]$/.test(e.key) && menu[Number(e.key)-1]) { state.cursor = Number(e.key)-1; select(); }
});

const canvas = $("#arena");
const ctx = canvas.getContext("2d");
let tick = 0;
function drawAgent(x,y,label,emoji,active){
  ctx.fillStyle = active ? "#fff3a7" : "#ffffff";
  ctx.strokeStyle = active ? "#ff7a59" : "#58b6ff";
  ctx.lineWidth = 5;
  ctx.fillRect(x-54,y-38,108,76); ctx.strokeRect(x-54,y-38,108,76);
  ctx.font = "28px serif"; ctx.textAlign="center"; ctx.fillText(emoji,x,y-4);
  ctx.fillStyle="#274060"; ctx.font="12px monospace"; ctx.fillText(label,x,y+22);
}
function draw(){
  tick++;
  const w=canvas.width,h=canvas.height;
  ctx.fillStyle="#fff7df"; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(88,182,255,.28)"; ctx.lineWidth=2;
  for(let x=0;x<w;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=0;y<h;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  ctx.fillStyle="rgba(255,212,92,.35)"; ctx.fillRect(0,360,w,180);
  const agents = state.agents.length ? state.agents : currentTemplate().agents;
  agents.slice(0,4).forEach((a,i)=>drawAgent(170+i*205,170+(i%2)*105,a.name,a.icon,state.screen==="run" && state.runLog[i]));
  ctx.strokeStyle="#ff7a59"; ctx.lineWidth=6; ctx.setLineDash([14,12]);
  ctx.beginPath(); ctx.moveTo(224,170); ctx.lineTo(733,275); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle="#6ee7b7"; ctx.beginPath(); ctx.arc(480+Math.sin(tick/20)*18,430+Math.cos(tick/25)*8,36,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#274060"; ctx.lineWidth=5; ctx.stroke();
  ctx.fillStyle="#274060"; ctx.font="18px monospace"; ctx.textAlign="center"; ctx.fillText("BYTE",480,436);
  requestAnimationFrame(draw);
}

render(); draw();
