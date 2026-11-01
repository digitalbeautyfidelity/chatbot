import assert from 'node:assert';
import { sanitize } from './chat-core.js';
assert.equal(sanitize([]), null);
assert.equal(sanitize('x'), null);
assert.deepEqual(sanitize([{ role: 'assistant', content: 'hi' }, { role: 'user', content: 'Quelles formules ?' }]), [{ role: 'user', content: 'Quelles formules ?' }]);
assert.equal(sanitize([{ role: 'user', content: 'a' }, { role: 'assistant', content: 'b' }]), null);

import { answer, handoff } from './chat-core.js';
const u = i => ({ role: 'user', content: 'q' + i }), a = { role: 'assistant', content: 'r' };
const six = [u(1), a, u(2), a, u(3), a, u(4), a, u(5), a, u(6)];
const r = await answer(six, 'k', {});
assert.equal(r.body.handoff, true); // 6e question : relais humain sans appel API
assert.equal((await handoff({ email: 'pas-un-mail' }, {})).code, 400);
assert.equal((await handoff({ email: 'a@b.fr' }, {})).code, 502); // Resend non configuré
console.log('ok'); process.exit(0);
