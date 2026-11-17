// #region profiles
import assert from 'node:assert/strict';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';

const fields = { givenName: 'Ada', familyName: 'Lovelace' };
const contextual = buildIidAnchor('person', fields);
if (!contextual.success) throw new Error(contextual.errors.join('; '));
assert.equal(contextual.value.profile, 'p1');
assert.equal(contextual.value.class, 'C');

const forcedAnchor = buildIidAnchor('person', fields, { profile: 'p0' });
assert.equal(forcedAnchor.success, false);
// #endregion
