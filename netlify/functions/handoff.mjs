import { handoff } from '../../chat-core.js';

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  let p;
  try { p = await req.json(); } catch {}
  const { code, body } = await handoff(p, process.env);
  return new Response(JSON.stringify(body), { status: code, headers: { 'content-type': 'application/json' } });
};
