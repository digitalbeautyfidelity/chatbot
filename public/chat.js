const $ = id => document.getElementById(id);
const hist = [];
const box = $('cb-m');
function add(text, cls) { const d = document.createElement('div'); d.className = 'msg ' + cls; d.textContent = text; box.appendChild(d); box.scrollTop = box.scrollHeight; return d; }
$('cb-btn').onclick = () => { $('cb').classList.toggle('open'); if (!box.children.length) add("Bonjour 👋 Je suis l'assistant Beauty Fidelity. Posez-moi vos questions sur nos cartes de fidélité, nos formules ou notre fonctionnement.", 'bot'); };
async function send(text) {
  if (!text.trim()) return;
  $('cb-s')?.remove();
  add(text, 'me'); hist.push({ role: 'user', content: text });
  const w = add('…', 'bot');
  try {
    const r = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: hist }) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error);
    w.textContent = d.reply; hist.push({ role: 'assistant', content: d.reply });
  } catch (e) { w.textContent = e.message || 'Erreur, réessayez.'; hist.pop(); }
  box.scrollTop = box.scrollHeight;
}
$('cb-f').onsubmit = e => { e.preventDefault(); const v = $('cb-i').value; $('cb-i').value = ''; send(v); };
document.querySelectorAll('#cb-s button').forEach(b => b.onclick = () => send(b.textContent));
