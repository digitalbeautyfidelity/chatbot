import assert from 'node:assert';
import { sanitize } from './chat-core.js';
assert.equal(sanitize([]), null);
assert.equal(sanitize('x'), null);
assert.deepEqual(sanitize([{ role: 'assistant', content: 'hi' }, { role: 'user', content: 'Quelles formules ?' }]), [{ role: 'user', content: 'Quelles formules ?' }]);
assert.equal(sanitize([{ role: 'user', content: 'a' }, { role: 'assistant', content: 'b' }]), null);
console.log('ok'); process.exit(0);
