const $ = (s) => document.querySelector(s);

const providers = [
  { id: "mock", name: "Demo Brain", note: "No key needed. Shows the full mission with simulated model behavior." },
  { id: "openrouter", name: "OpenRouter", note: "Bring your key. The local server can run the agents with it." },
  { id: "openai", name: "OpenAI", note: "Bring your key. Good default for first real runs." },
  { id: "anthropic", name: "Anthropic", note: "Bring your Claude key when the server is running." },
  { id: "google", name: "Google Gemini", note: "Bring your Gemini key when the server is running." },
];

const modelTypes = {
  fast: { name: "Fast Scout", model: "Small fast model", limit: 4200, cost: "$", strength: "cheap scanning", risk: "can miss details" },
  long: { name: "Long Context", model: "Large-context model", limit: 16000, cost: "$$$", strength: "holds more transcript", risk: "slower, pricier" },
  structure: { name: "Structure Pro", model: "Structured-output model", limit: 8000, cost: "$$", strength: "JSON/checklists", risk: "less natural writing" },
  reasoning: { name: "Careful Judge", model: "Reasoning model", limit: 12000, cost: "$$$", strength: "risk review", risk: "slower" },
  writer: { name: "Warm Writer", model: "Writing model", limit: 7000, cost: "$$", strength: "clear human copy", risk: "can smooth over uncertainty" },
};

const fullTranscript = `meeting-transcript-full.txt
Duration: 62 minutes
Participants: Greg, Aster, Dana, Morgan, Riley, Avery
Topic: AgentWorks Academy workshop kit and mission simulator

[00:00] Greg: I want this to feel like people are watching real agent work, not reading a diagram. If the agent receives a file, I want them to see the file.
[00:42] Aster: So the first mission can start with a full meeting transcript. The agent should not just say it read the transcript. It should open it, scan it, and produce an artifact.
[01:18] Dana: My concern is that beginners will get overwhelmed if we show too many terms at once. Context window, tokens, embeddings, model routing, all of that matters, but it needs to be optional.
[02:05] Greg: Exactly. The play should teach by showing consequences. If the context window is too small, the agent loses details. If we use a bigger model, it keeps more of the conversation but costs more.
[03:14] Morgan: We also need the final output to be something useful. A meeting recap, action items, risk review, maybe a client follow-up email.
[04:22] Riley: What about using different models for different agents? Fast model for scouting, structured model for extraction, reasoning model for risk review, writing model for email.
[05:11] Greg: That is the interesting educational part. We can show the outcome of changing models across tasks. Not as a lecture. As a game result.
[06:02] Aster: Then the mission map can have stations. Transcript File, Scout, Context Gate, Structure Builder, Risk Reviewer, Follow-up Writer, Outcome Room.
[07:30] Dana: The context gate should be visual. Like a meter filling up. If it overflows, the user has to choose chunking, summarizing, or a larger model.
[08:15] Greg: But don't dive deep into the terminology during play. Put a help option next to the term. If they click, they can learn more.
[09:50] Morgan: We should have glossary cards with short definitions and links to educational YouTube searches, not long essays.
[11:04] Riley: For the demo, use fake meeting data. The transcript should be long enough that it feels real. It can include repeated interruptions, uncertain decisions, and missing owners.
[12:17] Greg: The user should see what gets passed forward. Not just "summary output." Show scout-notes.json, context-plan.md, action-items.json, risk-review.md, follow-up-email.md.
[14:28] Aster: We can also show tradeoffs after the run. All cheap models missed details. Mixed models caught more. One big model worked but wasted cost.
[16:03] Dana: The educational outcome is not "learn what a token is." It is "understand why context management and model choice change the result."
[18:44] Morgan: For approvals, make it clear nothing gets sent automatically. The final email is a draft for human review.
[21:10] Greg: The map should feel playful. More like a mission path, maybe a board game or RPG map. Data files move from station to station.
[24:35] Riley: Users should be able to click the file and inspect it. The raw transcript should remain available, not disappear into a black box.
[28:02] Dana: Add a warning when an agent is using a model that is too small for the file. The warning should be visual, not scary.
[33:49] Aster: So the run teaches three things: real inputs become real artifacts, context window limits matter, and model choice affects quality/cost.
[41:18] Greg: That is the direction. We need to stop polishing cards and start building the simulator around that.
[52:11] Morgan: Final deliverables should include an action list, owner list, unresolved questions, and follow-up email.
[61:30] Greg: Good. Keep it beginner friendly, but don't hide the real mechanics. Let people inspect the machinery when they want.`;

const templates = {
  meeting: {
    title: "Mission: Messy Meeting to Client Follow-Up",
    plain: "Watch real-looking meeting data move through agents, context windows, model choices, and final artifacts.",
    dataLabel: "Full practice transcript file",
    fakeData: fullTranscript,
    agents: [
      { id: "scout", icon: "🧭", name: "Transcript Scout", modelKey: "fast", role: "Open the full transcript and find raw facts without rewriting them.", prompt: "Scan the full transcript. List speakers, decisions, action candidates, risks, missing owners, and important quotes. Do not invent details." },
      { id: "context", icon: "🪟", name: "Context Manager", modelKey: "long", role: "Decide what must stay in context and what can be compressed.", prompt: "Review the transcript and scout notes. Create a context plan: keep, compress, split, or ignore. Explain any overflow risk." },
      { id: "structure", icon: "🧩", name: "Structure Builder", modelKey: "structure", role: "Turn the working context into machine-readable task files.", prompt: "Create structured action items, owners, decisions, risks, and unresolved questions from the context packet." },
      { id: "review", icon: "🛡️", name: "Risk Reviewer", modelKey: "reasoning", role: "Check uncertainty, approvals, and missing evidence.", prompt: "Review the structured artifacts. Flag uncertain claims, missing owners, risky automation, and required human approval." },
      { id: "writer", icon: "✉️", name: "Follow-up Writer", modelKey: "writer", role: "Draft the final human-reviewed client follow-up.", prompt: "Write a friendly follow-up email and checklist using only the approved artifacts. Keep uncertainty visible." },
    ],
  },
};

const glossary = {
  "context-window": { title: "Context window", body: "The amount of information a model can keep in view at one time. In this mission, the transcript and every artifact compete for that space.", video: "pW0vHyPD_2Y" },
  tokens: { title: "Tokens", body: "Small chunks of text the model reads and writes. Longer files use more tokens and fill the context window faster.", video: "B6qD2rYgtEM" },
  model: { title: "Model", body: "The AI brain assigned to a station. Different models can be faster, cheaper, larger-context, better at reasoning, or better at writing.", video: "RhPKBmeYNuI" },
  chunking: { title: "Chunking", body: "Splitting a long file into smaller pieces so the agent can process it without overflowing the context window.", video: "anDROnsic7k" },
  embeddings: { title: "Embeddings", body: "A way to turn text into searchable meaning. Useful later when an agent needs to find the right chunk from many files.", video: "wggqEHPSpdM" },
  artifact: { title: "Artifact", body: "A real output file created by an agent, like scout-notes.json, risk-review.md, or follow-up-email.md.", video: "GFITotKju_k" },
};

const state = {
  screen: "title", cursor: 0, provider: "mock", apiKey: "",
  appText: "Turn a full messy meeting transcript into a client-ready follow-up while showing context windows, model choices, and artifacts.",
  template: "meeting", data: "", agents: [], runLog: [], chat: [], artifacts: [],
  activeAgent: -1, runPhase: "idle", running: false, score: 0, helpTerm: null, activeArtifact: null,
  paused: false, stepRequested: false,
};
const flow = ["title", "brain", "define", "data", "agents", "run", "export"];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const esc = (s = "") => String(s).replace(/[&<>"]/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const currentTemplate = () => templates.meeting;
const addScore = n => state.score = Math.min(9999, state.score + n);
const estimateTokens = (text="") => Math.max(1, Math.ceil(String(text).length / 4));
const modelFor = (agent) => modelTypes[agent.modelKey] || modelTypes.fast;
const artifactNameFor = (agent) => ({scout:"scout-notes.json", context:"context-plan.md", structure:"action-items.json", review:"risk-review.md", writer:"follow-up-email.md"}[agent.id] || `${agent.name.toLowerCase().replace(/[^a-z0-9]+/g,"-")}.md`);

function pixelActor(i, label){
  const colors = ["#33d6d9", "#ffd256", "#5fe07a", "#ff7fac", "#a78bfa"];
  const shirt = colors[i % colors.length];
  return `<svg class="pixel-actor" viewBox="0 0 96 128" role="img" aria-label="${esc(label)} pixel character" shape-rendering="crispEdges">
    <ellipse cx="48" cy="121" rx="28" ry="5" fill="rgba(30,40,62,.22)"/>
    <rect x="30" y="18" width="36" height="34" rx="4" fill="#ffd0a2" stroke="#1f2a44" stroke-width="4"/>
    <rect x="26" y="12" width="44" height="14" rx="2" fill="#2b2440"/><rect x="24" y="24" width="10" height="24" fill="#2b2440"/><rect x="62" y="24" width="10" height="24" fill="#2b2440"/>
    <rect x="39" y="34" width="6" height="6" fill="#1f2a44"/><rect x="55" y="34" width="6" height="6" fill="#1f2a44"/><rect x="43" y="45" width="18" height="4" fill="#d46f62"/>
    <rect x="27" y="58" width="42" height="38" rx="5" fill="${shirt}" stroke="#1f2a44" stroke-width="4"/>
    <rect x="15" y="63" width="16" height="34" rx="4" fill="#ffd0a2" stroke="#1f2a44" stroke-width="4"/><rect x="65" y="63" width="16" height="34" rx="4" fill="#ffd0a2" stroke="#1f2a44" stroke-width="4"/>
    <rect x="31" y="96" width="15" height="22" fill="#263b67" stroke="#1f2a44" stroke-width="4"/><rect x="50" y="96" width="15" height="22" fill="#263b67" stroke="#1f2a44" stroke-width="4"/>
    <rect x="25" y="116" width="23" height="8" fill="#162033"/><rect x="50" y="116" width="23" height="8" fill="#162033"/>
  </svg>`;
}

function setScreen(screen){ state.screen = screen; state.cursor = 0; render(); }
function generateFromDefinition(){ const t=currentTemplate(); state.template="meeting"; state.data=t.fakeData; state.agents=JSON.parse(JSON.stringify(t.agents)); addScore(300); }
function agentInput(i){ return i===0 ? state.data : (state.runLog[i-1]?.output || state.data); }
function soloChatbotDraft(){
  return `# solo-chatbot-draft.md
(One general chatbot tried to read the transcript and do every job at once.)

Quick summary attempt:
- The team talked about a workshop demo with agents.
- Greg seems to be leading. A few others chimed in.
- They might want to ship something soon — not fully sure.

Decisions (mixed with my guesses):
- Use a mission map (I think this was agreed).
- Maybe show some model comparison? Unclear.
- Something about uploads — I'm not sure who decided what.

Action items (incomplete owners):
- Build the map — owner: ???
- Add help cards — owner: ??? (maybe Aster?)
- Decide on uploads — owner: not sure

What I likely missed:
- Specific approval rules near the end of the meeting.
- Subtle warnings about context window and model size.
- Exact quotes I could not hold in mind all at once.

Note from this chatbot:
I'm one model trying to scan, decide, structure, review, and write the email in one shot.
That is why this draft is shallow and uncertain. Splitting the work across specialized agents
(scout, context manager, structure builder, risk reviewer, writer) catches more — and each
agent leaves a named file you can open and check.`;
}

function scoutNotesFor(agent){
  const key = agent.modelKey;
  const route = `${modelFor(agent).name} (${modelFor(agent).model})`;
  if(key === "fast"){
    return `{
  "file": "scout-notes.json",
  "source": "meeting-transcript-full.txt",
  "model_route": "${route}",
  "speakers_caught": ["Greg", "Aster", "Dana", "Morgan"],
  "speakers_likely_missed": ["Riley", "Avery"],
  "important_quotes": [
    "I want them to see the file.",
    "Show scout-notes.json, context-plan.md..."
  ],
  "decisions_found": [
    "Use a mission map instead of polishing cards.",
    "Start with a full fake transcript file."
  ],
  "action_candidates": [
    "Build Transcript File station",
    "Add artifact files moving through stations"
  ],
  "missing_or_unclear": [
    "did not catch every speaker",
    "skipped subtle approval and context details late in the transcript",
    "did not flag the warning about model being too small for the file"
  ],
  "scout_self_check": "Fast Scout: I scanned quickly and likely missed nuance. Use a larger or reasoning model if accuracy matters."
}`;
  }
  if(key === "long" || key === "reasoning"){
    return `{
  "file": "scout-notes.json",
  "source": "meeting-transcript-full.txt",
  "model_route": "${route}",
  "speakers": ["Greg", "Aster", "Dana", "Morgan", "Riley", "Avery"],
  "important_quotes": [
    "I want them to see the file.",
    "If the context window is too small, the agent loses details.",
    "Show scout-notes.json, context-plan.md, action-items.json, risk-review.md, follow-up-email.md.",
    "Add a warning when an agent is using a model that is too small for the file.",
    "Final email is a draft for human review."
  ],
  "decisions_found": [
    "Use a mission map instead of polishing office cards.",
    "Start with a full fake transcript file.",
    "Make terminology optional through help cards.",
    "Show model choice as a gameplay consequence.",
    "Outputs should be inspectable artifact files, not summaries.",
    "Final email is a draft for human review, not auto-send."
  ],
  "action_candidates": [
    "Build Transcript File station",
    "Add Context Window meter",
    "Show artifact files moving through stations",
    "Create final follow-up email and run comparison",
    "Add glossary/help cards next to terminology",
    "Add a warning when model is too small for the input"
  ],
  "missing_or_unclear": ["exact approval owner", "which real model menu ships first", "whether user can upload their own transcript in v1"],
  "scout_self_check": "${modelFor(agent).name}: held the full transcript in view. High confidence on coverage."
}`;
  }
  return `{
  "file": "scout-notes.json",
  "source": "meeting-transcript-full.txt",
  "model_route": "${route}",
  "speakers": ["Greg", "Aster", "Dana", "Morgan", "Riley"],
  "important_quotes": [
    "I want them to see the file.",
    "Show scout-notes.json, context-plan.md, action-items.json, risk-review.md, follow-up-email.md."
  ],
  "decisions_found": [
    "Use a mission map instead of polishing cards.",
    "Start with a full fake transcript file.",
    "Make terminology optional through help cards.",
    "Show model choice as a gameplay consequence."
  ],
  "action_candidates": [
    "Build Transcript File station",
    "Add Context Window meter",
    "Show artifact files moving through stations",
    "Create final follow-up email"
  ],
  "missing_or_unclear": ["exact approval owner", "subtle details about the model menu"],
  "scout_self_check": "${modelFor(agent).name} is not tuned for scout work. Try Fast Scout for cheap scanning or Long Context for full coverage."
}`;
}

function riskReviewFor(agent){
  if(agent.modelKey === "reasoning"){
    return `# risk-review.md

Reviewer model: ${modelFor(agent).name} (reasoning model — recommended for this job)

Safe to show:
- Fake transcript file
- Model badges and cost/quality tradeoffs
- Context overflow meter
- Draft follow-up artifacts

Needs human approval:
- Any real client transcript upload
- Any automatic sending of follow-up emails
- Any claims about exact model pricing or benchmark quality

Uncertainty flags:
- The current run is simulated, not using real provider APIs unless a local key/server is connected.
- Context token counts are estimates for teaching, not provider-exact billing.
- YouTube links are educational search links until curated videos are selected.

Things this reviewer specifically caught:
- Action items missing a real owner (multiple tasks default to Aster).
- Open questions in action-items.json hint at unresolved scope not surfaced in the draft email.
- No named human reviewer for the final follow-up before it leaves the system.

Recommendation:
Hold the email for human approval. Confirm owners before anything is sent.`;
  }
  return `# risk-review.md

Reviewer model: ${modelFor(agent).name} (NOT a reasoning model — this review is shallow)

> SHALLOW REVIEW WARNING
> The Risk Reviewer station is running on a model that is fine at other jobs
> but is not tuned for careful judgment. Many real risks below are surface-level
> or missed entirely. Switch the Risk Reviewer to "Careful Judge" and replay
> to get a proper review.

Quick scan:
- Looks roughly fine.
- Some unknowns noted.
- Email seems okay to me.

Things this reviewer probably missed:
- Approval ownership (who signs off before the email goes out).
- Risky automation paths (anything that could send without a human).
- Uncertainty about which decisions are final vs still being debated.

Recommendation:
Do not rely on this review alone. Reassign the Risk Reviewer to a reasoning model and re-run.`;
}

function outputForAgent(agent, input, i){
  if(agent.id === "scout") return scoutNotesFor(agent);
  if(agent.id === "review") return riskReviewFor(agent);
  if(agent.id === "context") return `# context-plan.md

Input files in context:
- meeting-transcript-full.txt: ${estimateTokens(state.data)} estimated tokens
- scout-notes.json: ${estimateTokens(input)} estimated tokens

Chosen strategy:
1. Keep the raw transcript available in the file viewer.
2. Pass scout-notes.json forward as the compact working memory.
3. Keep exact quotes for product direction.
4. Compress repeated discussion about visual style.
5. Do not drop uncertainty or approval warnings.

Context window result:
- Small fast model: likely overflow or missed details.
- Long-context model: safe for the full transcript.
- Mixed-model workflow: best educational tradeoff.

Why this matters:
The next agent should not receive a vague summary. It receives this context plan plus the scout artifact, so it knows what was kept, compressed, and why.`;
  if(agent.id === "structure") return `{
  "file": "action-items.json",
  "decisions": [
    {"decision": "Move from card UI to mission simulator map", "evidence": "Greg: stop polishing cards and start building the simulator"},
    {"decision": "Use full transcript as the first mission input", "evidence": "Greg: like a real file, not a summary"},
    {"decision": "Teach context and model choice through consequences", "evidence": "show outcome of changing models"}
  ],
  "actions": [
    {"task": "Create game map stations", "owner": "Aster", "status": "in progress"},
    {"task": "Add context window meter", "owner": "Aster", "status": "in progress"},
    {"task": "Add glossary/help option", "owner": "Aster", "status": "in progress"},
    {"task": "Design model comparison outcome", "owner": "Aster", "status": "next"}
  ],
  "open_questions": ["Should users upload files in this prototype?", "Which educational videos should be curated instead of search links?"],
  "risks": ["too much terminology during play", "outputs still feeling summarized instead of file-like", "map feeling static instead of game-like"]
}`;
  return `# follow-up-email.md

Subject: Follow-up from the AgentWorks mission simulator meeting

Hi team,

Here is the human-review draft from the meeting transcript.

What we decided:
- Move the experience from explanation cards to a playful mission simulator.
- Start with a full meeting transcript file so users see real data going through the workflow.
- Show context window limits as a visible meter, not a lecture.
- Use different model types for different agent jobs, then show the outcome tradeoff.
- Keep terminology available through a help option instead of forcing it into the main play.

Action items:
- Build the mission map with file stations.
- Show the transcript file, context plan, structured actions, risk review, and final email as artifacts.
- Add optional help cards for context window, tokens, models, chunking, embeddings, and artifacts.
- Add a comparison screen for cheap vs mixed vs large-model runs.

Needs approval:
- Curated education links.
- Whether uploads are allowed in the public demo.
- Which model presets should appear first.

Please review before anything is sent or connected to real tools.`;
}
function chatIntro(){ return {type:"intro", who:"Byte", title:"Mission started", note:"A real-looking transcript file will move through the map. Each station creates an artifact file, and the context window meter shows why model choice matters."}; }
function chatBaseline(draft){ return {type:"baseline", who:"Byte", title:"BEFORE: ONE CHATBOT TRIED ALONE", output:draft, note:"One general chatbot read the whole transcript and tried to do every job in one shot. The draft above misses owners, mixes guesses with decisions, and admits it may have missed risks. That is why we split the work across specialized agents — each one focuses on a single job and leaves a named file you can inspect."}; }
function chatReflection(){
  const scout = state.agents.find(a=>a.id==='scout');
  const review = state.agents.find(a=>a.id==='review');
  const scoutName = scout ? modelFor(scout).name : "your scout";
  const reviewName = review ? modelFor(review).name : "your reviewer";
  const reviewWarn = review && review.modelKey !== 'reasoning' ? " (a non-reasoning model, so the risk review is shallow)" : "";
  const body = `<ol class="reflection-list">
    <li><b>Why agents, not one chatbot.</b> The cold-open <code>solo-chatbot-draft.md</code> tried to do everything alone and missed owners and approvals. The agent run produced separate, named files you can open and check.</li>
    <li><b>Why model and context choices matter.</b> Your Scout ran on <b>${esc(scoutName)}</b> and your Risk Reviewer ran on <b>${esc(reviewName)}</b>${esc(reviewWarn)}. A smaller scout misses subtle decisions; a non-reasoning reviewer skips approval risks. Open <code>scout-notes.json</code> and <code>risk-review.md</code> to see the difference.</li>
    <li><b>Why humans inspect artifacts.</b> Every file in the FILES shelf is a draft, not a sent message. A person should open <code>risk-review.md</code> and <code>follow-up-email.md</code> before acting on them.</li>
  </ol>
  <p class="reflection-next"><b>Next:</b> tap <em>Edit Models</em>, change the Scout model (try Fast Scout vs Long Context), and Play Again. Watch <code>scout-notes.json</code> and <code>model-comparison.md</code> change.</p>`;
  return {type:"reflection", who:"Byte", title:"MISSION DEBRIEF · 3 TAKEAWAYS", body, note:"Plain-language wrap-up. Use the artifact shelf above to compare runs."};
}
async function pauseGate(){
  if(!state.paused) return;
  setStatus("PAUSED · STEP to advance one phase");
  while(state.paused && !state.stepRequested){ await sleep(120); }
  state.stepRequested = false;
  if(state.paused) setStatus("PAUSED · STEP to advance one phase");
}
function chatReceive(agent, fromName, input){ return {type:"receive", who:agent.name, title:`OPENED INPUT FROM ${fromName}`, input, note:`Model loaded: ${modelFor(agent).model}. This station is reading a real packet, not just a summary.`}; }
function chatWork(agent, input){ const model=modelFor(agent); return {type:"work", who:agent.name, title:"MODEL + CONTEXT CHECK", prompt:agent.prompt, input, note:`${model.name}: ${model.strength}. Context use: ${Math.min(100, Math.round((estimateTokens(input)/model.limit)*100))}% of this model's teaching limit.`}; }
function chatOutput(agent, toName, input, output){ return {type:"output", who:agent.name, title:`CREATED ${artifactNameFor(agent)}`, to:toName, input, output, note:`This artifact file is passed to the next station.`}; }
function chatFinal(output){ return {type:"final", who:"Byte", title:"MISSION OUTCOME", output, note:"The outcome is a set of inspectable files, plus a visible lesson about context and model routing."}; }
function renderChatEntry(m){
  if(!m || !m.type) return `<p><b>${esc(m?.who || 'Byte')}:</b><span>${esc(m?.text || '')}</span></p>`;
  return `<article class="chat-card chat-${esc(m.type)}">
    <header><b>${esc(m.who)}</b><strong>${esc(m.title)}</strong></header>
    ${m.to?`<div class="route-label">To: ${esc(m.to)}</div>`:''}
    ${m.prompt?`<section><h4>PROMPT USED</h4><pre>${esc(m.prompt)}</pre></section>`:''}
    ${m.input?`<section><h4>INPUT FILE / ARTIFACT</h4><pre>${esc(m.input)}</pre></section>`:''}
    ${m.output?`<section><h4>OUTPUT ARTIFACT</h4><pre>${esc(m.output)}</pre></section>`:''}
    ${m.body?`<section class="reflection-body">${m.body}</section>`:''}
    ${m.note?`<small>${esc(m.note)}</small>`:''}
  </article>`;
}
async function callServerAgent(agent,input,index){ const res=await fetch("/api/run-agent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:state.provider,apiKey:state.apiKey,agent,input,appText:state.appText,index})}); if(!res.ok) throw new Error(await res.text()); return (await res.json()).output; }
function modelComparisonArtifact(){
  const scoutAgent = state.agents.find(a=>a.id==='scout');
  const reviewAgent = state.agents.find(a=>a.id==='review');
  const route = state.agents.map(a => `${a.name}: ${modelFor(a).name}`).join("\n- ");
  const scoutKey = scoutAgent?.modelKey;
  const reviewKey = reviewAgent?.modelKey;
  const scoutConsequence = scoutKey === 'fast'
    ? `Fast Scout caught the main decisions cheaply, but scout-notes.json shows it likely missed two speakers and skipped subtle approval/context details. Good for first-pass, risky as the only scout.`
    : (scoutKey === 'long' || scoutKey === 'reasoning')
      ? `${modelFor(scoutAgent).name} held the full transcript and produced complete scout notes (all six speakers, more decisions, more quotes). Higher cost, but stronger recall.`
      : `${modelFor(scoutAgent).name} is not a scouting specialist. Coverage was partial. Try Fast Scout (cheap scan) or Long Context (full coverage).`;
  const reviewConsequence = reviewKey === 'reasoning'
    ? `Careful Judge produced a real risk review, flagging missing owners and approval gaps.`
    : `${modelFor(reviewAgent).name} produced a SHALLOW review (see warning in risk-review.md). Switch the Risk Reviewer to "Careful Judge" for a proper review.`;
  return `# model-comparison.md

## Your current route
- ${route}

## What your route actually produced
- Scout: ${scoutConsequence}
- Risk Review: ${reviewConsequence}

## General tradeoffs (for comparison)
Run A — all cheap/fast models
- Cost: low, Speed: high
- Misses subtle decisions, approval risks, long-transcript details.

Run B — mixed specialist route
- Cost: medium, Speed: medium
- Better artifact quality — each station uses a model suited to its task.

Run C — one huge model for every station
- Cost: high, Speed: lower
- Strong quality, but wasteful for simple scanning and formatting.

## Try this
Tap Edit Models, change the Scout model from "${modelFor(scoutAgent).name}" to a different option, and Play Again.
Open scout-notes.json each time and compare what changes.`;
}
async function runAgents(){
  if(!state.agents.length) generateFromDefinition();
  state.running=true; state.paused=false; state.stepRequested=false;
  state.runLog=[]; state.chat=[chatIntro()];
  state.artifacts=[{name:"meeting-transcript-full.txt", kind:"input", text:state.data}];
  state.activeAgent=-1; state.runPhase="file"; setScreen("run");
  await sleep(1200);

  // Cold open: one solo chatbot tries to do everything alone, badly.
  const soloDraft = soloChatbotDraft();
  state.artifacts.push({name:"solo-chatbot-draft.md", kind:"output", text:soloDraft, agent:"Solo Chatbot"});
  state.runPhase="baseline"; state.chat.push(chatBaseline(soloDraft)); render();
  await sleep(2400); await pauseGate();

  for(let i=0;i<state.agents.length;i++){
    const agent=state.agents[i]; const fromName=i===0?'Transcript File':state.agents[i-1].name; const toName=state.agents[i+1]?.name || 'Outcome Room'; const input=agentInput(i);
    await pauseGate();
    state.activeAgent=i; state.runPhase="receive"; state.chat.push(chatReceive(agent, fromName, input)); render(); await sleep(1800);
    await pauseGate();
    const step={icon:agent.icon,id:agent.id,name:agent.name,role:agent.role,prompt:agent.prompt,model:modelFor(agent),input,call:state.provider==="mock"?`${modelFor(agent).model} simulation`:`${providers.find(p=>p.id===state.provider)?.name} via local /api/run-agent`,doing:"Reading the input file, checking context size, and creating a named artifact.",artifact:artifactNameFor(agent),output:"working..."};
    state.runLog.push(step); state.runPhase="context"; state.chat.push(chatWork(agent, input)); render(); await sleep(2300);
    try{ step.output = state.provider==="mock" || !state.apiKey ? outputForAgent(agent,input,i) : await callServerAgent(agent,input,i); }
    catch(err){ step.output=`# ${artifactNameFor(agent)}\n\nReal call failed, so demo mode continued.\nReason: ${err.message}\n\n${outputForAgent(agent,input,i)}`; }
    state.artifacts.push({name:step.artifact, kind:"output", text:step.output, agent:agent.name});
    await pauseGate();
    state.runPhase="artifact"; state.chat.push(chatOutput(agent, toName, input, step.output)); addScore(250); render(); await sleep(2200);
  }
  await pauseGate();
  state.activeAgent=-1; state.runPhase="complete";
  const comparison = modelComparisonArtifact();
  state.artifacts.push({name:"model-comparison.md", kind:"output", text:comparison, agent:"Outcome Room"});
  const final = `${state.runLog.at(-1)?.output || ''}\n\n---\n\n${comparison}`;
  state.chat.push(chatFinal(final));
  state.chat.push(chatReflection());
  state.running=false; state.paused=false; state.stepRequested=false;
  addScore(500); render();
}

function makeMarkdownSpec(){ return `# AgentWorks Quest Mission Run\n\n## Application\n${state.appText}\n\n## Input File\n${state.data}\n\n## Agents\n${state.agents.map(a=>`### ${a.name}\n- Role: ${a.role}\n- Model: ${modelFor(a).model}\n- Prompt: ${a.prompt}`).join("\n\n")}\n\n## Artifacts\n${state.artifacts.map(a=>`### ${a.name}\nCreated by: ${a.agent || 'Input'}\n\n${a.text}`).join("\n\n")}`; }
function makeLangGraph(){ return `# LangGraph scaffold placeholder for AgentWorks Quest\n# Export includes mission state and artifact chain.\nprint("Build nodes for: ${state.agents.map(a=>a.name).join(' -> ')}")`; }
function makeCrewAI(){ return `# CrewAI scaffold placeholder for AgentWorks Quest\nprint("Build crew for: ${state.agents.map(a=>a.name).join(', ')}")`; }
async function copyText(text){ try{ await navigator.clipboard.writeText(text); setStatus("COPIED"); }catch{ window.prompt("Copy this", text); } }
function download(text,filename,type="text/plain"){ const blob=new Blob([text],{type}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url); setStatus(`SAVED ${filename}`); }
function saveDefineFields(){ const app=$("#app-text"),key=$("#api-key"); if(app) state.appText=app.value; if(key) state.apiKey=key.value.trim(); }
function saveDataField(){ const d=$("#fake-data"); if(d) state.data=d.value; }
function saveAgentFields(){ state.agents=state.agents.map((a,i)=>({...a,role:$(`#agent-role-${i}`)?.value||a.role,prompt:$(`#agent-prompt-${i}`)?.value||a.prompt,modelKey:$(`#agent-model-${i}`)?.value||a.modelKey})); }
function menuForScreen(){
  if(state.screen==="title") return [["START",()=>setScreen("brain")],["PLAY MISSION",()=>{generateFromDefinition();runAgents();}],["EXPORT EXAMPLES",()=>{generateFromDefinition();setScreen("export");}]];
  if(state.screen==="brain") return providers.map(p=>[p.name.toUpperCase(),()=>{state.provider=p.id;addScore(100);setScreen("define");},p.note]);
  if(state.screen==="define") return [["GENERATE TRANSCRIPT MISSION",()=>{saveDefineFields();generateFromDefinition();setScreen("data");}],["SKIP TO AGENT MAP",()=>{saveDefineFields();generateFromDefinition();setScreen("agents");}]];
  if(state.screen==="data") return [["APPROVE TRANSCRIPT FILE",()=>{saveDataField();setScreen("agents");}],["RESET SAMPLE TRANSCRIPT",()=>{generateFromDefinition();setScreen("data");}],["EDIT MISSION",()=>setScreen("define")]];
  if(state.screen==="agents") return [["APPROVE MODEL ROUTE",()=>{saveAgentFields();addScore(250);setScreen("run");}],["PLAY MISSION NOW",()=>{saveAgentFields();runAgents();}],["BACK TO TRANSCRIPT",()=>setScreen("data")]];
  if(state.screen==="run") return state.running ? [] : [[state.runLog.length?"PLAY AGAIN":"PLAY MISSION",()=>{if(!state.running)runAgents();}],["EXPORT RUN",()=>setScreen("export")],["EDIT MODELS",()=>setScreen("agents")]];
  if(state.screen==="export") return [["COPY MISSION SPEC",()=>copyText(makeMarkdownSpec())],["DOWNLOAD MISSION SPEC",()=>download(makeMarkdownSpec(),"agentworks-mission.md","text/markdown")],["DOWNLOAD LANGGRAPH PY",()=>download(makeLangGraph(),"agentworks_langgraph.py","text/x-python")],["DOWNLOAD CREWAI PY",()=>download(makeCrewAI(),"agentworks_crewai.py","text/x-python")],["DOWNLOAD RUN JSON",()=>download(JSON.stringify({app:state.appText,data:state.data,agents:state.agents,artifacts:state.artifacts,runLog:state.runLog},null,2),"agentworks-run.json","application/json")],["START OVER",()=>setScreen("title")]];
  return [];
}
function helpModal(){
  const term = state.helpTerm ? glossary[state.helpTerm] : null;
  if(!term) return "";
  const src = `https://www.youtube-nocookie.com/embed/${term.video}?rel=0`;
  return `<div class="help-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="help-title">
    <section class="help-modal">
      <button id="close-help" class="modal-close" aria-label="Close help">×</button>
      <p class="kicker">QUICK LESSON</p>
      <h3 id="help-title">${esc(term.title)}</h3>
      <p>${esc(term.body)}</p>
      <div class="video-frame"><iframe title="${esc(term.title)} explainer videos" src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
      <small>Video stays inside the simulator so beginners do not lose their place.</small>
    </section>
  </div>`;
}
function artifactModal(){
  const artifact = state.activeArtifact ? state.artifacts.find(a => a.name === state.activeArtifact) : null;
  if(!artifact) return "";
  return `<div class="artifact-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="artifact-title">
    <section class="artifact-modal">
      <button id="close-artifact" class="modal-close" aria-label="Close artifact">×</button>
      <p class="kicker">ARTIFACT FILE</p>
      <h3 id="artifact-title">${esc(artifact.name)}</h3>
      <small>${esc(artifact.agent ? `Created by ${artifact.agent}` : 'Original mission input')}</small>
      <pre>${esc(artifact.text)}</pre>
      <div class="artifact-modal-actions">
        <button id="copy-artifact">Copy file text</button>
        <button id="download-artifact">Download file</button>
      </div>
    </section>
  </div>`;
}
function termButtons(){ return `<div class="term-row">${Object.keys(glossary).map(k=>`<button class="term-help" data-term="${k}">? ${esc(glossary[k].title)}</button>`).join("")}</div>`; }
function contextMeter(input, agent){ const model = modelFor(agent); const pct = Math.min(100, Math.round((estimateTokens(input)/model.limit)*100)); return `<div class="context-meter"><div><b>Context window</b><button class="term-help tiny-help" data-term="context-window">?</button><span>${estimateTokens(input)} / ${model.limit} teaching tokens</span></div><meter min="0" max="100" value="${pct}"></meter><strong>${pct}% full</strong></div>`; }
function detailsForScreen(){
  const provider=providers.find(p=>p.id===state.provider)||providers[0];
  if(state.screen==="brain") return `<div class="choice-grid">${providers.map(p=>`<div class="chip ${p.id===state.provider?'on':''}"><strong>${p.name}</strong><span>${p.note}</span></div>`).join("")}</div><p class="friendly-note">Demo mode is a simulator. Real API keys work when the local server is running.</p>`;
  if(state.screen==="define") return `<label class="field"><span>Mission goal</span><textarea id="app-text">${esc(state.appText)}</textarea></label><label class="field"><span>${provider.name} key ${state.provider==='mock'?'(optional)':'(used by local server)'}</span><input id="api-key" type="password" value="${esc(state.apiKey)}" placeholder="Paste key for a real run, or leave empty for demo" /></label>`;
  if(state.screen==="data") return `<label class="field"><span>${esc(currentTemplate().dataLabel)}</span><textarea id="fake-data" class="transcript-editor">${esc(state.data||currentTemplate().fakeData)}</textarea></label><p class="friendly-note">This is intentionally file-like. The mission starts with this whole transcript, then agents create artifact files from it.</p>`;
  if(state.screen==="agents") return `<div class="agent-grid model-grid">${state.agents.map((a,i)=>`<article class="agent-card"><div class="avatar">${a.icon}</div><h3>${esc(a.name)}</h3><label>Model<select id="agent-model-${i}">${Object.entries(modelTypes).map(([k,m])=>`<option value="${k}" ${a.modelKey===k?'selected':''}>${m.name} · ${m.cost}</option>`).join("")}</select></label><label>Profile<input id="agent-role-${i}" value="${esc(a.role)}" /></label><label>Prompt<textarea id="agent-prompt-${i}">${esc(a.prompt)}</textarea></label></article>`).join("")}</div>`;
  if(state.screen==="run") return runScreen();
  if(state.screen==="export") return `<div class="export-preview"><h3>Export includes</h3><ul><li>Full transcript input</li><li>Model route</li><li>Context notes</li><li>Artifact chain</li><li>LangGraph/CrewAI placeholder scaffolds</li></ul><pre>${esc(makeMarkdownSpec()).slice(0,1400)}...</pre></div>`;
  return `<div class="welcome-card"><div class="big-avatar">🗺️</div><p>Play a mission: a full meeting transcript moves through model-powered agent stations and becomes real output files.</p><p class="friendly-note">The educational part is visible: context limits, model choices, artifact quality, and human approval.</p></div>`;
}
function stationLayout(i){
  return [
    {x:9, y:50, room:"mailroom", label:"INPUT DOCK"},
    {x:25, y:28, room:"scout", label:"SCAN DESK"},
    {x:43, y:62, room:"context", label:"CONTEXT LAB"},
    {x:58, y:28, room:"structure", label:"BUILD ROOM"},
    {x:73, y:62, room:"review", label:"REVIEW BAY"},
    {x:83, y:27, room:"writer", label:"WRITER NOOK"},
    {x:91, y:52, room:"outcome", label:"OUTCOME VAULT"},
  ][i] || {x:50, y:50, room:"extra", label:"STATION"};
}
function decoObjects(){
  const items = [
    ["plant",13,24,"🌿"],["server",34,45,"▦"],["rug",47,43,""],["coffee",63,47,"☕"],["board",70,22,"▤"],["plant",89,73,"🌵"],["crate",19,71,"▣"],["books",53,78,"▤"],["lamp",78,42,"◌"],
  ];
  return items.map(([cls,x,y,txt])=>`<span class="map-prop prop-${cls}" style="--x:${x};--y:${y}">${txt}</span>`).join("");
}
function runScreen(){
  const active = state.activeAgent;
  const activeAgent = active >= 0 ? state.agents[active] : null;
  const activeInput = active >= 0 ? agentInput(active) : (state.data || currentTemplate().fakeData);
  const phaseText = state.runPhase === "receive" ? "OPEN FILE" : state.runPhase === "context" ? "CONTEXT CHECK" : state.runPhase === "artifact" ? "CREATE ARTIFACT" : state.runPhase === "complete" ? "OUTCOME VAULT" : "MISSION FLOOR";
  const stations = ["Transcript File", ...state.agents.map(a=>a.name), "Outcome Room"];
  return `<div class="mission-run">
    <section class="mission-map topdown-map" aria-label="Top-down mission floor map">
      <div class="map-title"><strong>Messy Meeting Mission</strong><span>${phaseText}</span></div>
      <div class="tile-floor" aria-hidden="true"></div>
      <div class="map-walls" aria-hidden="true"></div>
      <div class="map-route" aria-hidden="true"></div>
      ${decoObjects()}
      ${stations.map((name,i)=>{ const pos=stationLayout(i); const agent=state.agents[i-1]; return `<div class="map-room room-${pos.room} ${i===0?'file-node':''} ${i===stations.length-1?'outcome-node':''} ${i===active+1?'active':''} ${i>0&&i<=state.runLog.length?'done':''}" style="--x:${pos.x};--y:${pos.y}">
        <span class="room-sign">${esc(pos.label)}</span>
        <span class="room-icon">${i===0?'📄':i===stations.length-1?'🏁':agent?.icon}</span>
        <b>${esc(name)}</b>
        <small>${i===0?'full transcript':i===stations.length-1?'final files':i===active+1?phaseText:i<=state.runLog.length?'artifact made':'waiting'}</small>
        ${agent?`<em>${esc(modelFor(agent).name)}</em>`:''}
      </div>`}).join("")}
      ${activeAgent?`<div class="map-agent" style="--x:${stationLayout(active+1).x};--y:${stationLayout(active+1).y}">${pixelActor(active, activeAgent.name)}<b>${esc(activeAgent.name)}</b></div>`:''}
      <div class="file-packet ${state.running||state.runPhase==='complete'?'moving':''}" style="--x:${stationLayout(active<0?0:active+1).x};--y:${stationLayout(active<0?0:active+1).y}">${state.runPhase==='artifact'?'FILE OUT':'FILE'}</div>
      <div class="artifact-shelf"><h3>FILES</h3>${state.artifacts.map(a=>`<button class="artifact-chip ${a.kind==='input'?'is-input':'is-output'}" data-artifact="${esc(a.name)}" title="Open ${esc(a.name)}" aria-label="Open artifact file ${esc(a.name)}">${esc(a.name)}</button>`).join("")}</div>
    </section>
    <aside class="mission-side">
      <div class="mission-focus">${activeAgent?`<h3>${activeAgent.icon} ${esc(activeAgent.name)}</h3><p>${esc(activeAgent.role)}</p><div class="model-badge"><b>${esc(modelFor(activeAgent).model)}</b><span>${esc(modelFor(activeAgent).strength)} · ${esc(modelFor(activeAgent).cost)}</span><button class="term-help tiny-help" data-term="model">?</button></div>${contextMeter(activeInput, activeAgent)}`:`<h3>${state.runLog.length?'🏁 Outcome ready':'Mission ready'}</h3><p>${state.runLog.length?'Inspect the artifact chain below. The same transcript produced files, not just explanations.':'Press Play to move a full transcript through model-specific rooms on the mission floor.'}</p>${termButtons()}`}</div>
      <div class="auto-log office-log teaching-log" id="auto-log">${state.chat.map(renderChatEntry).join("")}</div>
      ${state.running
        ? `<div class="stage-actions run-controls"><span class="run-state-tag">${state.paused?'PAUSED':'AUTOPLAY'}</span><button id="stage-pause">${state.paused?'Resume':'Pause'}</button><button id="stage-step" ${state.paused?'':'disabled'} title="Advance one phase (Pause first)">Step</button></div>`
        : `<div class="stage-actions"><button id="stage-play">${state.runLog.length?'Play Again':'Play Mission'}</button>${state.runLog.length?'<button id="stage-export">Export Run</button>':''}<button id="stage-edit">Edit Models</button></div>`}
    </aside>
    ${helpModal()}
    ${artifactModal()}
  </div>`;
}
function contentForScreen(){
  if(state.screen==="brain") return {label:"CHOOSE BRAIN",kicker:"STEP 1",title:"Pick how the simulator thinks.",copy:"Use demo mode or connect real models through the local server."};
  if(state.screen==="define") return {label:"MISSION",kicker:"STEP 2",title:"Set the learning mission.",copy:"Default mission: turn a full messy meeting transcript into useful client follow-up artifacts."};
  if(state.screen==="data") return {label:"INPUT FILE",kicker:"STEP 3",title:"Inspect the transcript file.",copy:"This is the real input object for the mission, not a short summary."};
  if(state.screen==="agents") return {label:"MODEL ROUTE",kicker:"STEP 4",title:"Assign models to agent stations.",copy:"Different jobs use different model strengths. Change the route, then compare outcomes."};
  if(state.screen==="run") return {label:"LIVE MISSION",kicker:"",title:"",copy:""};
  if(state.screen==="export") return {label:"EXPORT",kicker:"STEP 6",title:"Take the mission out.",copy:"Export the transcript, model route, artifacts, and scaffold placeholders."};
  return {label:"TITLE",kicker:"WELCOME",title:"AgentWorks Quest: Mission Simulator",copy:"Watch a real-looking transcript file move through agents, context windows, model choices, and output artifacts."};
}
function setStatus(t){ $("#status").textContent=t; }
function render(){
  document.body.classList.toggle("play-mode", state.screen==="run");
  const content=contentForScreen(), menu=menuForScreen();
  $("#screen-label").textContent=content.label; $("#kicker").textContent=content.kicker; $("#screen-title").textContent=content.title; $("#screen-copy").textContent=content.copy; $("#details").innerHTML=detailsForScreen();
  $("#score").textContent=String(state.score).padStart(4,"0"); $("#run-readout").textContent=state.running?"LIVE":state.runLog.length?"DONE":"IDLE"; $("#brain-readout").textContent=(providers.find(p=>p.id===state.provider)?.name||"Demo").split(" ")[0].toUpperCase();
  $("#progress").textContent=`BRAIN: ${state.provider.toUpperCase()} · MISSION: ${state.appText?"SET":"--"} · FILE: ${state.data?"READY":"--"} · AGENTS: ${state.agents.length||"--"} · RUN: ${state.runLog.length?"DONE":"--"}`;
  $("#menu").innerHTML=menu.map(([label,,hint],i)=>`<button class="menu-item ${i===state.cursor?'active':''}" type="button" data-i="${i}"><span>${i===state.cursor?'▶':' '}</span><strong>${label}</strong>${hint?`<small>${esc(hint)}</small>`:''}</button>`).join("");
  $("#menu").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{state.cursor=Number(b.dataset.i);select();}));
  $("#stage-play")?.addEventListener("click",runAgents); $("#stage-export")?.addEventListener("click",()=>setScreen("export")); $("#stage-edit")?.addEventListener("click",()=>setScreen("agents"));
  $("#stage-pause")?.addEventListener("click",()=>{ state.paused = !state.paused; if(!state.paused) state.stepRequested = false; render(); });
  $("#stage-step")?.addEventListener("click",()=>{ if(state.paused){ state.stepRequested = true; } });
  document.querySelectorAll(".term-help").forEach(b=>b.addEventListener("click",()=>{state.helpTerm=b.dataset.term; render();}));
  $("#close-help")?.addEventListener("click",()=>{state.helpTerm=null; render();});
  document.querySelector(".help-modal-backdrop")?.addEventListener("click",(e)=>{ if(e.target.classList.contains("help-modal-backdrop")){ state.helpTerm=null; render(); } });
  document.querySelectorAll(".artifact-chip").forEach(b=>b.addEventListener("click",()=>{state.activeArtifact=b.dataset.artifact; render();}));
  $("#close-artifact")?.addEventListener("click",()=>{state.activeArtifact=null; render();});
  document.querySelector(".artifact-modal-backdrop")?.addEventListener("click",(e)=>{ if(e.target.classList.contains("artifact-modal-backdrop")){ state.activeArtifact=null; render(); } });
  $("#copy-artifact")?.addEventListener("click",()=>{ const a=state.artifacts.find(x=>x.name===state.activeArtifact); if(a) copyText(a.text); });
  $("#download-artifact")?.addEventListener("click",()=>{ const a=state.artifacts.find(x=>x.name===state.activeArtifact); if(a) download(a.text,a.name,a.name.endsWith('.json')?'application/json':'text/plain'); });
  const log=$("#auto-log"); if(log) log.scrollTop=log.scrollHeight;
  setStatus(state.screen==="run"?(state.running?(state.paused?"PAUSED · STEP to advance one phase":"MISSION RUNNING · WATCH FILES MOVE"):"READY TO PLAY MISSION"):"USE MENU OR KEYBOARD");
}
function select(){ const item=menuForScreen()[state.cursor]; if(item) item[1](); }
function back(){ const idx=flow.indexOf(state.screen); if(idx>0 && !state.running) setScreen(flow[idx-1]); }
document.addEventListener("keydown",e=>{ const menu=menuForScreen(); if(["ArrowDown","ArrowUp","Enter"," ","Escape"].includes(e.key)) e.preventDefault(); if(menu.length&&e.key==="ArrowDown"){state.cursor=(state.cursor+1)%menu.length;render();} if(menu.length&&e.key==="ArrowUp"){state.cursor=(state.cursor-1+menu.length)%menu.length;render();} if(e.key==="Enter"||e.key===" ") select(); if(e.key==="Escape"){ if(state.activeArtifact){ state.activeArtifact=null; render(); } else if(state.helpTerm){ state.helpTerm=null; render(); } else back(); } if(/^[1-9]$/.test(e.key)&&menu[Number(e.key)-1]){state.cursor=Number(e.key)-1;select();} });
const canvas=$("#arena"), ctx=canvas.getContext("2d"); let tick=0;
function draw(){ tick++; const w=canvas.width,h=canvas.height; ctx.fillStyle="#fff7df"; ctx.fillRect(0,0,w,h); ctx.strokeStyle="rgba(88,182,255,.22)"; ctx.lineWidth=2; for(let x=0;x<w;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();} for(let y=0;y<h;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();} ctx.fillStyle="rgba(255,212,92,.32)"; ctx.fillRect(0,360,w,180); ctx.fillStyle="#6ee7b7"; ctx.beginPath(); ctx.arc(480+Math.sin(tick/20)*18,430+Math.cos(tick/25)*8,36,0,Math.PI*2); ctx.fill(); ctx.strokeStyle="#274060"; ctx.lineWidth=5; ctx.stroke(); ctx.fillStyle="#274060"; ctx.font="18px monospace"; ctx.textAlign="center"; ctx.fillText("QUEST",480,436); requestAnimationFrame(draw); }
generateFromDefinition(); render(); draw();
