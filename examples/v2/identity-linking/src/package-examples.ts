import assert from 'node:assert/strict';

// #region inspect-iid
import { inspectIntuitionId, SCHEMES } from '@0xintuition/iid';

const canonicalIsrc = SCHEMES.isrc.canonicalize('US-RC1-76-07839');
if (canonicalIsrc === undefined) throw new Error('Invalid ISRC');
const identifier = `int:isrc:${canonicalIsrc}`;
const inspection = inspectIntuitionId(identifier);
if (!inspection.valid) throw new Error(inspection.reason);
console.log({ iid: identifier, anchorEligible: inspection.anchorEligible });
// #endregion

// #region provider-plan
import {
  classificationForIid,
  identifierHintsForIid,
  providersForIid,
} from '@0xintuition/iid-registry';

const inputIid = 'int:isrc:USRC17607839';
const classification = classificationForIid(inputIid);
const providerPlan = providersForIid(inputIid);
const hints = identifierHintsForIid(inputIid);
const unmapped = classificationForIid('int:iswc:T0345246801');
console.log({ classification, providerPlan, hints, unmapped });
// #endregion

// #region project-ladder
import { projectIdentifierLadder } from '@0xintuition/iid-ladder';

const selection = projectIdentifierLadder({
  strongIdentifiers: { isrc: 'US-RC1-76-07839' },
  canonicalUrl: 'https://example.com/recording',
});
if (selection.iid === null) {
  console.log({ needsIdentityEvidence: true, reason: selection.reason });
} else {
  console.log({ iid: selection.iid, selectedFrom: selection.rung });
}
const noIdentifier = projectIdentifierLadder({});
console.log(noIdentifier);
// #endregion

// #region conformance-data
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const vectorsPath = require.resolve(
  '@0xintuition/iid-spec/conformance/canonicalization.json',
);
const packagedVectors: unknown = JSON.parse(readFileSync(vectorsPath, 'utf8'));
console.log({ loadedConformanceDocument: typeof packagedVectors === 'object' });
// #endregion

assert.equal(identifier, 'int:isrc:USRC17607839');
assert.equal(inspection.anchorEligible, true);
assert.equal(classification?.slug, 'music-recording');
assert.deepEqual(providerPlan, ['musicbrainz', 'spotify', 'apple-music']);
assert.equal(unmapped, undefined);
assert.equal(selection.iid, identifier);
assert.equal(selection.rung, 'strong');
assert.equal(noIdentifier.iid, null);
assert.notEqual(packagedVectors, null);
