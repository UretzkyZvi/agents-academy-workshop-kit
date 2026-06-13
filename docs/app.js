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
  screen: "title", cursor: 0, provider: "mock", apiKey: "",
  appText: "I want to organize all the information from conversations and meetings. Show decisions, action items, risks, follow-ups, and what needs human approval.",
  template: "conversations", data: "", agents: [], runLog: [], chat: [],
  activeAgent: -1, packetFrom: -1, runPhase: "idle", running: false, score: 0,
};
const flow = ["title", "brain", "define", "data", "agents", "run", "export"];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const esc = (s = "") => String(s).replace(/[&<>"]/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const currentTemplate = () => templates[state.template] || templates.conversations;
const addScore = n => state.score = Math.min(9999, state.score + n);
const actorPalettes = [
  { hair: "#2b2440", skin: "#ffd0a2", shirt: "#33d6d9", pants: "#263b67", shoe: "#162033" },
  { hair: "#814922", skin: "#ffd8ae", shirt: "#ffd256", pants: "#25506d", shoe: "#162033" },
  { hair: "#1f2638", skin: "#f3bd8d", shirt: "#5fe07a", pants: "#563f9a", shoe: "#162033" },
  { hair: "#6b3a20", skin: "#ffd2b8", shirt: "#ff7fac", pants: "#25506d", shoe: "#162033" },
];
function pixelActor(i, label){
  const p = actorPalettes[i % actorPalettes.length];
  return `<svg class="pixel-actor person-${i%4}" viewBox="0 0 96 128" role="img" aria-label="${esc(label)} pixel character" shape-rendering="crispEdges">
    <ellipse cx="48" cy="121" rx="28" ry="5" fill="rgba(30,40,62,.22)"/>
    <rect x="30" y="18" width="36" height="34" rx="4" fill="${p.skin}" stroke="#1f2a44" stroke-width="4"/>
    <rect x="26" y="12" width="44" height="14" rx="2" fill="${p.hair}"/><rect x="24" y="24" width="10" height="24" fill="${p.hair}"/><rect x="62" y="24" width="10" height="24" fill="${p.hair}"/>
    <rect x="39" y="34" width="6" height="6" fill="#1f2a44"/><rect x="55" y="34" width="6" height="6" fill="#1f2a44"/><rect x="43" y="45" width="18" height="4" fill="#d46f62"/>
    <rect x="27" y="58" width="42" height="38" rx="5" fill="${p.shirt}" stroke="#1f2a44" stroke-width="4"/>
    <rect x="15" y="63" width="16" height="34" rx="4" fill="${p.skin}" stroke="#1f2a44" stroke-width="4"/><rect x="65" y="63" width="16" height="34" rx="4" fill="${p.skin}" stroke="#1f2a44" stroke-width="4"/>
    <rect x="31" y="96" width="15" height="22" fill="${p.pants}" stroke="#1f2a44" stroke-width="4"/><rect x="50" y="96" width="15" height="22" fill="${p.pants}" stroke="#1f2a44" stroke-width="4"/>
    <rect x="25" y="116" width="23" height="8" fill="${p.shoe}"/><rect x="50" y="116" width="23" height="8" fill="${p.shoe}"/>
  </svg>`;
}
function setScreen(screen){ state.screen = screen; state.cursor = 0; render(); }
function inferTemplate(text){ const t=text.toLowerCase(); if(t.includes("document")||t.includes("pdf")||t.includes("file")) return "document"; if(t.includes("meeting")||t.includes("transcript")||t.includes("summary")) return "meeting"; return "conversations"; }
function generateFromDefinition(){ state.template = inferTemplate(state.appText); const t=currentTemplate(); state.data=t.fakeData; state.agents=JSON.parse(JSON.stringify(t.agents)); addScore(300); }
function agentInput(i){ return i===0 ? state.data : (state.runLog[i-1]?.output || state.data); }
function mockAgentOutput(agent,input,i){
  if(i===0) return `Found from the actual input:\n- Work type: ${currentTemplate().title}\n- Source items: meeting notes, chat follow-up, and ops sync\n- People named: Avery, Morgan, Riley, Dana\n- Raw facts to carry forward: Friday draft, data export owner, missing approval owner, fake-notes-first decision`;
  if(i===1) return `Structured from the previous output:\n- Decisions: start with fake notes first; show handoffs clearly\n- Action items: Morgan owns data export; draft follow-up by Friday; collect 5 safe examples\n- Risks: client-sensitive details in tests; automatic sending is not approved\n- Missing info: who approves the final email; success criteria; real system to connect later`;
  if(i===2) return `Checked against the structured packet:\n- Safe to do now: summarize, draft, organize, create review checklist\n- Needs human approval: final email, CRM updates, any real client data use\n- Uncertain or missing: approval owner and success criteria\n- Recommendation: keep this as a copy/paste review workflow before automation`;
  return `Final human-review package created from the safety check:\nSummary: the agent team turned messy notes into decisions, actions, risks, missing approvals, and safe next steps.\nHuman checklist:\n1. Confirm the facts are correct.\n2. Name the approval owner.\n3. Remove sensitive client details.\n4. Approve or edit the draft before sending anything.\nNext safe step: run this with 5 fake examples before connecting real tools.`;
}
function chatIntro(){
  return {type:"intro", who:"Byte", title:"Watch the data, not magic", note:"Each card below shows the actual text packet an agent receives and the actual text packet it creates. The output from one agent becomes the input for the next."};
}
function chatReceive(agent, fromName, input){
  return {type:"receive", who:agent.name, title:"ACTUAL INPUT RECEIVED", from:fromName, input, note:"This is the exact packet on the agent's desk before it does anything."};
}
function chatWork(agent, input){
  return {type:"work", who:agent.name, title:"PROMPT + SAME INPUT", prompt:agent.prompt, input, note:"The prompt tells the agent what transformation to make. The input below is still unchanged at this moment."};
}
function chatOutput(agent, toName, input, output){
  return {type:"output", who:agent.name, title:"ACTUAL OUTPUT PRODUCED", to:toName, input, output, note:"Compare input vs output. This new output is the exact packet passed forward."};
}
function chatError(agent, output){
  return {type:"output", who:agent.name, title:"DEMO OUTPUT AFTER API ERROR", output, note:"The real call failed, so the demo produced a safe local packet to keep the lesson moving."};
}
function chatFinal(output){
  return {type:"final", who:"Byte", title:"FINAL OUTPUT FOR HUMAN REVIEW", output, note:"This is the last packet. A human reviews it before anything real is sent or changed."};
}
function renderChatEntry(m){
  if(!m || !m.type) return `<p><b>${esc(m?.who || 'Byte')}:</b><span>${esc(m?.text || '')}</span></p>`;
  return `<article class="chat-card chat-${esc(m.type)}">
    <header><b>${esc(m.who)}</b><strong>${esc(m.title)}</strong></header>
    ${m.from?`<div class="route-label">From: ${esc(m.from)}</div>`:''}
    ${m.to?`<div class="route-label">To: ${esc(m.to)}</div>`:''}
    ${m.prompt?`<section><h4>PROMPT USED</h4><pre>${esc(m.prompt)}</pre></section>`:''}
    ${m.input?`<section><h4>ACTUAL INPUT DATA</h4><pre>${esc(m.input)}</pre></section>`:''}
    ${m.output?`<section><h4>ACTUAL OUTPUT DATA</h4><pre>${esc(m.output)}</pre></section>`:''}
    ${m.note?`<small>${esc(m.note)}</small>`:''}
  </article>`;
}
async function callServerAgent(agent,input,index){ const res=await fetch("/api/run-agent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:state.provider,apiKey:state.apiKey,agent,input,appText:state.appText,index})}); if(!res.ok) throw new Error(await res.text()); return (await res.json()).output; }
async function runAgents(){
  if(!state.agents.length) generateFromDefinition();
  state.running=true; state.runLog=[]; state.chat=[chatIntro()]; state.activeAgent=-1; state.packetFrom=-1; state.runPhase="idle"; setScreen("run");
  for(let i=0;i<state.agents.length;i++){
    const agent=state.agents[i]; const fromName=i===0?'Input Tray':state.agents[i-1].name; const toName=state.agents[i+1]?.name || 'Output Tray';
    const input=agentInput(i);
    state.activeAgent=i; state.packetFrom=i-1; state.runPhase="receive"; state.chat.push(chatReceive(agent, fromName, input)); render(); await sleep(2400);
    const step={icon:agent.icon,name:agent.name,role:agent.role,prompt:agent.prompt,input,call:state.provider==="mock"?"Demo Brain local simulation":`${providers.find(p=>p.id===state.provider)?.name} via local /api/run-agent`,doing:"Compare the actual input packet with the output packet this agent creates.",output:"working..."};
    state.runLog.push(step); state.runPhase="work"; state.chat.push(chatWork(agent, input)); render(); await sleep(3400);
    try{ step.output = state.provider==="mock" || !state.apiKey ? mockAgentOutput(agent,input,i) : await callServerAgent(agent,input,i); state.runPhase="handoff"; state.chat.push(chatOutput(agent, toName, input, step.output)); }
    catch(err){ step.output=`Server/API failed, demo mode continued.\nReason: ${err.message}\n\n${mockAgentOutput(agent,input,i)}`; state.runPhase="handoff"; state.chat.push(chatError(agent, step.output)); }
    addScore(250); render(); await sleep(2800);
  }
  state.activeAgent=-1; state.packetFrom=state.agents.length-1; state.runPhase="complete"; state.chat.push(chatFinal(state.runLog.at(-1)?.output || '')); state.running=false; addScore(500); render();
}
function makeMarkdownSpec(){ return `# AgentWorks Quest Agent Team\n\n## Application\n${state.appText}\n\n## Fake Data\n${state.data}\n\n## Agents\n${state.agents.map(a=>`### ${a.name}\n- Role: ${a.role}\n- Prompt: ${a.prompt}`).join("\n\n")}\n\n## Run Log\n${state.runLog.map(s=>`### ${s.name}\nPrompt: ${s.prompt}\n\nInput:\n${s.input}\n\nCall:\n${s.call}\n\nOutput:\n${s.output}`).join("\n\n")}`; }
function makeLangGraph(){ return `from typing import TypedDict\nfrom langgraph.graph import StateGraph, START, END\n\nclass AgentState(TypedDict):\n    text: str\n    log: list[str]\n\ndef call_agent(name, prompt, text):\n    return f"{name} processed: {text[:200]}"\n\n${state.agents.map(a=>`def ${a.name.toLowerCase().replace(/[^a-z0-9]+/g,"_")}(state: AgentState):\n    out = call_agent(${JSON.stringify(a.name)}, ${JSON.stringify(a.prompt)}, state["text"])\n    return {"text": out, "log": state["log"] + [out]}\n`).join("\n")}\ngraph = StateGraph(AgentState)\n${state.agents.map(a=>`graph.add_node("${a.name}", ${a.name.toLowerCase().replace(/[^a-z0-9]+/g,"_")})`).join("\n")}\ngraph.add_edge(START, "${state.agents[0]?.name||"Agent"}")\n${state.agents.slice(0,-1).map((a,i)=>`graph.add_edge("${a.name}", "${state.agents[i+1].name}")`).join("\n")}\ngraph.add_edge("${state.agents.at(-1)?.name||"Agent"}", END)\napp = graph.compile()\nprint(app.invoke({"text": ${JSON.stringify(state.data)}, "log": []}))`; }
function makeCrewAI(){ return `from crewai import Agent, Task, Crew\n\n${state.agents.map(a=>`${a.name.toLowerCase().replace(/[^a-z0-9]+/g,"_")}_agent = Agent(role=${JSON.stringify(a.name)}, goal=${JSON.stringify(a.role)}, backstory=${JSON.stringify(a.prompt)})`).join("\n\n")}\n\n${state.agents.map((a,i)=>`task_${i+1} = Task(description=${JSON.stringify(`${a.prompt}\n\nInput:\n${i===0?state.data:'Use the previous task output.'}`)}, agent=${a.name.toLowerCase().replace(/[^a-z0-9]+/g,"_")}_agent, expected_output="Clear structured output for the next helper")`).join("\n\n")}\n\ncrew = Crew(agents=[${state.agents.map(a=>`${a.name.toLowerCase().replace(/[^a-z0-9]+/g,"_")}_agent`).join(", ")}], tasks=[${state.agents.map((_,i)=>`task_${i+1}`).join(", ")}])\nprint(crew.kickoff())`; }
async function copyText(text){ try{ await navigator.clipboard.writeText(text); setStatus("COPIED"); }catch{ window.prompt("Copy this", text); } }
function download(text,filename,type="text/plain"){ const blob=new Blob([text],{type}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url); setStatus(`SAVED ${filename}`); }
function saveDefineFields(){ const app=$("#app-text"),key=$("#api-key"); if(app) state.appText=app.value; if(key) state.apiKey=key.value.trim(); }
function saveDataField(){ const d=$("#fake-data"); if(d) state.data=d.value; }
function saveAgentFields(){ state.agents=state.agents.map((a,i)=>({...a,role:$(`#agent-role-${i}`)?.value||a.role,prompt:$(`#agent-prompt-${i}`)?.value||a.prompt})); }
function menuForScreen(){
  if(state.screen==="title") return [["START",()=>setScreen("brain")],["PLAY DEMO RUN",()=>{generateFromDefinition();runAgents();}],["EXPORT EXAMPLES",()=>{generateFromDefinition();setScreen("export");}]];
  if(state.screen==="brain") return providers.map(p=>[p.name.toUpperCase(),()=>{state.provider=p.id;addScore(100);setScreen("define");},p.note]);
  if(state.screen==="define") return [["GENERATE FAKE WORK + AGENTS",()=>{saveDefineFields();generateFromDefinition();setScreen("data");}],["SKIP TO AGENT PROFILES",()=>{saveDefineFields();generateFromDefinition();setScreen("agents");}]];
  if(state.screen==="data") return [["APPROVE FAKE DATA",()=>{saveDataField();setScreen("agents");}],["REGENERATE FROM DEFINITION",()=>{saveDataField();generateFromDefinition();setScreen("data");}],["EDIT APPLICATION",()=>setScreen("define")]];
  if(state.screen==="agents") return [["APPROVE PROFILES",()=>{saveAgentFields();addScore(250);setScreen("run");}],["PLAY AGENTS NOW",()=>{saveAgentFields();runAgents();}],["BACK TO FAKE DATA",()=>setScreen("data")]];
  if(state.screen==="run") return state.running ? [] : [[state.runLog.length?"PLAY AGAIN":"PLAY AGENTS",()=>{if(!state.running)runAgents();}],["EXPORT RUN",()=>setScreen("export")],["EDIT AGENTS",()=>setScreen("agents")]];
  if(state.screen==="export") return [["COPY AGENT SPEC",()=>copyText(makeMarkdownSpec())],["DOWNLOAD AGENT SPEC",()=>download(makeMarkdownSpec(),"agent-spec.md","text/markdown")],["DOWNLOAD LANGGRAPH PY",()=>download(makeLangGraph(),"agentworks_langgraph.py","text/x-python")],["DOWNLOAD CREWAI PY",()=>download(makeCrewAI(),"agentworks_crewai.py","text/x-python")],["DOWNLOAD RUN JSON",()=>download(JSON.stringify({app:state.appText,data:state.data,agents:state.agents,runLog:state.runLog},null,2),"agentworks-run.json","application/json")],["START OVER",()=>setScreen("title")]];
  return [];
}
function detailsForScreen(){
  const provider=providers.find(p=>p.id===state.provider)||providers[0];
  if(state.screen==="brain") return `<div class="choice-grid">${providers.map(p=>`<div class="chip ${p.id===state.provider?'on':''}"><strong>${p.name}</strong><span>${p.note}</span></div>`).join("")}</div><p class="friendly-note">Demo mode runs anywhere. Real API keys work when the local server is running.</p>`;
  if(state.screen==="define") return `<label class="field"><span>What should this agent team help with?</span><textarea id="app-text">${esc(state.appText)}</textarea></label><label class="field"><span>${provider.name} key ${state.provider==='mock'?'(optional)':'(used by local server)'}</span><input id="api-key" type="password" value="${esc(state.apiKey)}" placeholder="Paste key for a real run, or leave empty for demo" /></label>`;
  if(state.screen==="data") return `<label class="field"><span>${esc(currentTemplate().dataLabel)}</span><textarea id="fake-data">${esc(state.data||currentTemplate().fakeData)}</textarea></label><p class="friendly-note">Users see the fake conversations, meetings, or documents before agents touch anything real.</p>`;
  if(state.screen==="agents") return `<div class="agent-grid">${state.agents.map((a,i)=>`<article class="agent-card"><div class="avatar">${a.icon}</div><h3>${esc(a.name)}</h3><label>Profile<input id="agent-role-${i}" value="${esc(a.role)}" /></label><label>Prompt<textarea id="agent-prompt-${i}">${esc(a.prompt)}</textarea></label></article>`).join("")}</div>`;
  if(state.screen==="run") {
    const active = state.activeAgent;
    const xs = [9, 26, 43, 60, 77, 93];
    const deskNames = ["Input Tray", ...state.agents.map(a => a.name), "Output Tray"];
    const phaseText = state.runPhase === "receive" ? "RECEIVE INPUT" : state.runPhase === "work" ? "WORK AT DESK" : state.runPhase === "handoff" ? "PASS OUTPUT" : state.runPhase === "complete" ? "READY FOR HUMAN REVIEW" : "READY";
    const activeStep = active >= 0 ? state.runLog[active] : null;
    const packetInput = activeStep?.input || state.data || currentTemplate().fakeData;
    const packetOutput = activeStep?.output && activeStep.output !== "working..." ? activeStep.output : "Output appears here after this agent finishes its desk work.";
    const finalOutput = state.runLog.at(-1)?.output || "";
    const packetIndex = state.runPhase === "complete" ? state.agents.length + 1 : active < 0 ? 0 : state.runPhase === "handoff" ? active + 2 : active + 1;
    return `<div class="office-run chain-run">
      <div class="office-floor chain-floor" aria-label="Agent office chain from input to output">
        <div class="chain-path"></div>
        ${deskNames.map((name,i)=>`<div class="chain-desk ${i===0?'input-desk':''} ${i===deskNames.length-1?'output-desk':''} ${i===active+1?'active-desk':''} ${i>0&&i<=state.runLog.length?'done-desk':''}" style="--x:${xs[i]}%">
          <span>${i===0?'📥':i===deskNames.length-1?'📤':state.agents[i-1]?.icon}</span>
          <b>${esc(name)}</b>
          <small>${i===0?'raw notes':i===deskNames.length-1?'review package':i===active+1?phaseText:i<=state.runLog.length?'output sent':'waiting'}</small>
          <em>${i>0&&i<deskNames.length-1 ? 'IN → DO → OUT' : i===0 ? 'INPUT' : 'OUTPUT'}</em>
        </div>`).join("")}
        ${state.agents.map((a,i)=>{ const done=state.runLog[i]&&state.runLog[i].output!=='working...'; const x=xs[i+1]; return `<div class="mini-agent chain-agent ${active===i?'walking':''} ${done?'done':''}" style="--home-x:${x}%;--home-y:62%;--target-x:${x}%;--target-y:${state.runPhase==='work'?50:56}%;--delay:${i*.1}s">
          <div class="agent-bubble">${active===i?phaseText:a.name}</div>
          ${pixelActor(i, a.name)}
        </div>`;}).join("")}
        <div class="data-packet chain-packet ${state.running||state.runPhase==='complete'?'moving':''}" style="--packet-x:${xs[packetIndex]||93}%;--packet-y:${state.runPhase==='work'?37:45}%">${state.runPhase==='handoff'?'OUT':'DATA'}</div>
        <div class="chain-caption"><strong>${phaseText}</strong><span>${active>=0?`${esc(state.agents[active].name)} receives input, works at the desk, then shares output to the next desk.`:state.runLog.length?'The output chain is complete. Human review comes next.':'Press Play to watch data move through the office chain.'}</span></div>
      </div>
      <aside class="office-side chain-side">
        <div class="mini-focus packet-teacher">${active>=0?`<h3>${state.agents[active].icon} ${esc(state.agents[active].name)} · ${phaseText}</h3><p>${esc(state.runLog[active]?.doing||'Walking to the desk to receive input...')}</p><small><b>Input from:</b> ${active===0?'Input Tray':esc(state.agents[active-1]?.name||'Previous agent')} · <b>Output to:</b> ${esc(state.agents[active+1]?.name||'Output Tray')}</small>`:`<h3>${state.runLog.length?'✅ Output ready':'Ready'}</h3><p>${state.runLog.length?'The full receive → prompt → output chain is in the teaching chat below. Scroll there to inspect every packet.':'The agents will pass the packet desk by desk. The chat will fill with the exact text each agent receives and creates.'}</p>`}</div>
        <div class="auto-log office-log teaching-log" id="auto-log">${state.chat.map(renderChatEntry).join("")}</div>
        ${!state.running?`<div class="stage-actions"><button id="stage-play">${state.runLog.length?'Play Again':'Play Agents'}</button>${state.runLog.length?'<button id="stage-export">Export Run</button>':''}<button id="stage-edit">Edit Agents</button></div>`:''}
      </aside>
    </div>`;
  }
  if(state.screen==="export") return `<div class="export-preview"><h3>Export includes</h3><ul><li>Agent profile cards</li><li>Full run log</li><li>LangGraph scaffold</li><li>CrewAI scaffold</li><li>JSON manifest</li></ul><pre>${esc(makeMarkdownSpec()).slice(0,1000)}...</pre></div>`;
  return `<div class="welcome-card"><div class="big-avatar">🤖</div><p>No black-box magic. Users watch little agents work step by step on fake conversations, meetings, or documents.</p><p class="friendly-note">Bright arcade mode. Less terminal. More training game.</p></div>`;
}
function contentForScreen(){
  const t=currentTemplate();
  if(state.screen==="brain") return {label:"CHOOSE BRAIN",kicker:"STEP 1",title:"Pick how Byte thinks.",copy:"Use demo mode or paste a key for local server runs."};
  if(state.screen==="define") return {label:"DEFINE APP",kicker:"STEP 2",title:"Tell Byte the job.",copy:"Example: organize conversations and meetings into decisions, action items, risks, and follow-ups."};
  if(state.screen==="data") return {label:"FAKE WORK",kicker:"STEP 3",title:"Generate safe practice data.",copy:`Current application: ${t.title}. Users see the fake work before any agent runs.`};
  if(state.screen==="agents") return {label:"AGENT CARDS",kicker:"STEP 4",title:"Approve the characters.",copy:"Each character is an agent profile. Users can edit the role and prompt before pressing Play."};
  if(state.screen==="run") return {label:"LIVE RUN",kicker:"",title:"",copy:""};
  if(state.screen==="export") return {label:"EXPORT",kicker:"STEP 6",title:"Take the agent team out.",copy:"Export a plain spec, run JSON, LangGraph scaffold, or CrewAI scaffold."};
  return {label:"TITLE",kicker:"WELCOME",title:"Train agent characters.",copy:"Define the application, generate fake work, approve profiles, then press Play and watch the agents pass work to each other."};
}
function setStatus(t){ $("#status").textContent=t; }
function render(){
  document.body.classList.toggle("play-mode", state.screen==="run");
  const content=contentForScreen(), menu=menuForScreen();
  $("#screen-label").textContent=content.label; $("#kicker").textContent=content.kicker; $("#screen-title").textContent=content.title; $("#screen-copy").textContent=content.copy; $("#details").innerHTML=detailsForScreen();
  $("#score").textContent=String(state.score).padStart(4,"0"); $("#run-readout").textContent=state.running?"LIVE":state.runLog.length?"DONE":"IDLE"; $("#brain-readout").textContent=(providers.find(p=>p.id===state.provider)?.name||"Demo").split(" ")[0].toUpperCase();
  $("#progress").textContent=`BRAIN: ${state.provider.toUpperCase()} · APP: ${state.appText?"SET":"--"} · DATA: ${state.data?"READY":"--"} · AGENTS: ${state.agents.length||"--"} · RUN: ${state.runLog.length?"DONE":"--"}`;
  $("#menu").innerHTML=menu.map(([label,,hint],i)=>`<button class="menu-item ${i===state.cursor?'active':''}" type="button" data-i="${i}"><span>${i===state.cursor?'▶':' '}</span><strong>${label}</strong>${hint?`<small>${esc(hint)}</small>`:''}</button>`).join("");
  $("#menu").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{state.cursor=Number(b.dataset.i);select();}));
  $("#stage-play")?.addEventListener("click",runAgents); $("#stage-export")?.addEventListener("click",()=>setScreen("export")); $("#stage-edit")?.addEventListener("click",()=>setScreen("agents")); const log=$("#auto-log"); if(log) log.scrollTop=log.scrollHeight;
  setStatus(state.screen==="run"?(state.running?"WATCHING AGENTS WORK · NO MENU DURING RUN":"READY TO PLAY AGENTS"):"USE MENU OR KEYBOARD");
}
function select(){ const item=menuForScreen()[state.cursor]; if(item) item[1](); }
function back(){ const idx=flow.indexOf(state.screen); if(idx>0 && !state.running) setScreen(flow[idx-1]); }
document.addEventListener("keydown",e=>{ const menu=menuForScreen(); if(["ArrowDown","ArrowUp","Enter"," ","Escape"].includes(e.key)) e.preventDefault(); if(menu.length&&e.key==="ArrowDown"){state.cursor=(state.cursor+1)%menu.length;render();} if(menu.length&&e.key==="ArrowUp"){state.cursor=(state.cursor-1+menu.length)%menu.length;render();} if(e.key==="Enter"||e.key===" ") select(); if(e.key==="Escape") back(); if(/^[1-9]$/.test(e.key)&&menu[Number(e.key)-1]){state.cursor=Number(e.key)-1;select();} });
const canvas=$("#arena"), ctx=canvas.getContext("2d"); let tick=0;
function drawAgent(x,y,label,emoji,active){ ctx.fillStyle=active?"#fff3a7":"#ffffff"; ctx.strokeStyle=active?"#ff7a59":"#58b6ff"; ctx.lineWidth=5; ctx.fillRect(x-54,y-38,108,76); ctx.strokeRect(x-54,y-38,108,76); ctx.font="28px serif"; ctx.textAlign="center"; ctx.fillText(emoji,x,y-4); ctx.fillStyle="#274060"; ctx.font="12px monospace"; ctx.fillText(label,x,y+22); }
function draw(){ tick++; const w=canvas.width,h=canvas.height; ctx.fillStyle="#fff7df"; ctx.fillRect(0,0,w,h); ctx.strokeStyle="rgba(88,182,255,.28)"; ctx.lineWidth=2; for(let x=0;x<w;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();} for(let y=0;y<h;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();} ctx.fillStyle="rgba(255,212,92,.35)"; ctx.fillRect(0,360,w,180); const agents=state.agents.length?state.agents:currentTemplate().agents; agents.slice(0,4).forEach((a,i)=>drawAgent(170+i*205,170+(i%2)*105,a.name,a.icon,state.screen==="run"&&state.activeAgent===i)); ctx.strokeStyle="#ff7a59"; ctx.lineWidth=6; ctx.setLineDash([14,12]); ctx.beginPath(); ctx.moveTo(224,170); ctx.lineTo(733,275); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle="#6ee7b7"; ctx.beginPath(); ctx.arc(480+Math.sin(tick/20)*18,430+Math.cos(tick/25)*8,36,0,Math.PI*2); ctx.fill(); ctx.strokeStyle="#274060"; ctx.lineWidth=5; ctx.stroke(); ctx.fillStyle="#274060"; ctx.font="18px monospace"; ctx.textAlign="center"; ctx.fillText("BYTE",480,436); requestAnimationFrame(draw); }
render(); draw();
