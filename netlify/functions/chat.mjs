import { answer } from '../../chat-core.js';

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  let msgs;
  try { msgs = (await req.json()).messages; } catch {}
  const { code, body } = await answer(msgs, process.env.ANTHROPIC_API_KEY);
  return new Response(JSON.stringify(body), { status: code, headers: { 'content-type': 'application/json' } });
};
