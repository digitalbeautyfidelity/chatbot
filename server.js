import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { answer } from './chat-core.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// .env minimal (sans dépendance)
try {
  for (const l of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split('\n')) {
    const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };

function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

// Limiteur simple par IP : 20 requêtes / minute
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 60000);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 20;
}

async function chat(req, res) {
  if (limited(req.socket.remoteAddress)) return json(res, 429, { error: 'Trop de messages, réessayez dans une minute.' });
  let body = '';
  for await (const c of req) { body += c; if (body.length > 20000) return json(res, 413, { error: 'Trop gros' }); }
  let msgs; try { msgs = JSON.parse(body).messages; } catch {}
  const { code, body: out } = await answer(msgs, API_KEY);
  json(res, code, out);
}

export const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/chat') return chat(req, res);
  if (req.method !== 'GET') { res.writeHead(405); return res.end(); }
  const p = req.url.split('?')[0];
  const file = path.join(__dirname, 'public', p === '/' ? 'index.html' : p);
  if (!file.startsWith(path.join(__dirname, 'public')) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); return res.end('Not found');
  }
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}
