import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', 'docs');
const port = Number(process.env.PORT || 8787);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'content-type': type, 'access-control-allow-origin': '*' });
  res.end(body);
}

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return JSON.parse(raw || '{}');
}

function fallbackOutput(agent, input, index) {
  const names = ['scouted the source material', 'extracted structure', 'checked safety', 'drafted a human-ready summary'];
  return `${agent.name} ${names[index] || 'processed the handoff'}.\n\nInput reviewed:\n${String(input).slice(0, 500)}\n\nOutput:\n- Key points found\n- Missing details flagged\n- Next helper can continue\n- Human approval still required`;
}

async function callOpenAICompatible({ endpoint, model, apiKey, agent, input, appText }) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: `You are ${agent.name}. Role: ${agent.role}. Prompt: ${agent.prompt}. Be concise and show structured output for the next agent. Do not claim external tool access.` },
        { role: 'user', content: `Application: ${appText}\n\nInput from previous step:\n${input}` },
      ],
      temperature: 0.2,
    }),
  });
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  const json = await response.json();
  return json.choices?.[0]?.message?.content || JSON.stringify(json);
}

async function callAnthropic({ apiKey, agent, input, appText }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 700,
      system: `You are ${agent.name}. Role: ${agent.role}. Prompt: ${agent.prompt}. Be concise and structured.`,
      messages: [{ role: 'user', content: `Application: ${appText}\n\nInput from previous step:\n${input}` }],
    }),
  });
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  const json = await response.json();
  return json.content?.map(p => p.text || '').join('\n') || JSON.stringify(json);
}

async function callGoogle({ apiKey, agent, input, appText }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: `You are ${agent.name}. Role: ${agent.role}. Prompt: ${agent.prompt}.\n\nApplication: ${appText}\n\nInput:\n${input}` }] }] }),
  });
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  const json = await response.json();
  return json.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('\n') || JSON.stringify(json);
}

async function runAgent(payload) {
  const { provider, apiKey, agent, input, appText, index = 0 } = payload;
  if (!apiKey || provider === 'mock') return fallbackOutput(agent, input, index);
  if (provider === 'openai') return callOpenAICompatible({ endpoint: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini', apiKey, agent, input, appText });
  if (provider === 'openrouter') return callOpenAICompatible({ endpoint: 'https://openrouter.ai/api/v1/chat/completions', model: 'openai/gpt-4o-mini', apiKey, agent, input, appText });
  if (provider === 'anthropic') return callAnthropic({ apiKey, agent, input, appText });
  if (provider === 'google') return callGoogle({ apiKey, agent, input, appText });
  return fallbackOutput(agent, input, index);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') return send(res, 204, '');
    if (req.method === 'POST' && req.url === '/api/run-agent') {
      const body = await readJson(req);
      const output = await runAgent(body);
      return send(res, 200, JSON.stringify({ output }));
    }
    if (req.method !== 'GET') return send(res, 405, 'Method not allowed', 'text/plain');
    const url = new URL(req.url, `http://localhost:${port}`);
    const reqPath = url.pathname === '/' ? '/index.html' : url.pathname;
    const safe = normalize(reqPath).replace(/^([/\\])+/, '');
    const file = join(root, safe);
    const data = await readFile(file);
    return send(res, 200, data, mime[extname(file)] || 'application/octet-stream');
  } catch (err) {
    if (req.url?.startsWith('/api/')) return send(res, 500, JSON.stringify({ error: err.message }));
    try {
      const data = await readFile(join(root, 'index.html'));
      return send(res, 200, data, mime['.html']);
    } catch {
      return send(res, 404, 'Not found', 'text/plain');
    }
  }
});

server.listen(port, () => {
  console.log(`AgentWorks Quest server: http://localhost:${port}`);
});
