import assert from 'node:assert/strict';

// #region schema-vocabulary
import { getPropertiesFor } from '@0xintuition/schema-org';
import { schemaOrgBook } from '@0xintuition/schema-org/Book';

const titleProperty = getPropertiesFor('Book').find(
  (property) => property.name === 'name',
);
console.log({
  type: schemaOrgBook.name,
  titleOrigin: titleProperty?.originType,
});
// #endregion

// #region creation-profile
import {
  buildAtomData,
  validateClassificationValues,
} from '@0xintuition/classifications';
import { musicRecordingCreationProfile } from '@0xintuition/classifications/creation/music-recording';

const recordingValues = {
  name: 'Example recording',
  byArtist: 'Example artist',
};
const issues = validateClassificationValues('music-recording', recordingValues);
if (issues.length > 0) {
  throw new Error(issues.map((issue) => issue.message).join('; '));
}
const recordingData = buildAtomData('music-recording', recordingValues);
const artistRelationship = musicRecordingCreationProfile.relationships.find(
  (relationship) => relationship.predicate.key === 'byArtist',
);
console.log({
  data: recordingData,
  fields: musicRecordingCreationProfile.fields.map((field) => field.key),
  artistTargets: artistRelationship?.expectedObjects,
});
// #endregion

// #region anchor-and-context
import { buildIidAnchor } from '@0xintuition/primitives/anchor';

// Standalone ISRC conformance input; no association with the music catalog fixture.
const values = { isrc: 'US-RC1-76-07839' };
const bare = buildIidAnchor('music-recording', values);
const withContext = buildIidAnchor('music-recording', values, {
  contextUris: ['https://example.com/recording-evidence'],
});
if (!bare.success) throw new Error(bare.errors.join('; '));
if (!withContext.success) throw new Error(withContext.errors.join('; '));

console.log({
  iid: bare.value.iid,
  profile: bare.value.profile,
  data: bare.value.data,
  dataHex: bare.value.dataHex,
  id: bare.value.id,
  sameIdWithContext: bare.value.id === withContext.value.id,
  contextUris: withContext.value.contextUris,
});
// #endregion

// #region profile-floor
const person = buildIidAnchor('person', {
  givenName: 'Example',
  familyName: 'Person',
});
if (!person.success) throw new Error(person.errors.join('; '));
const forcedBare = buildIidAnchor(
  'person',
  { givenName: 'Example', familyName: 'Person' },
  { profile: 'p0' },
);
console.log({
  derivedProfile: person.value.profile,
  class: person.value.class,
  forcedBareAccepted: forcedBare.success,
});
// #endregion

assert.equal(titleProperty?.originType, 'Thing');
assert.equal(schemaOrgBook.name, 'Book');
assert.deepEqual(issues, []);
assert.equal(JSON.parse(recordingData).byArtist, 'Example artist');
assert.equal(bare.value.iid, 'int:isrc:USRC17607839');
assert.equal(
  bare.value.dataHex,
  '0x696e743a697372633a555352433137363037383339',
);
assert.equal(
  bare.value.id,
  '0xd3368a8190d3afd5fb05abd01db8141c09a77c3f290bb7a0ef2ffb2b5acab8d8',
);
assert.equal(withContext.value.id, bare.value.id);
assert.equal(withContext.value.data, bare.value.data);
assert.equal(person.value.profile, 'p1');
assert.equal(forcedBare.success, false);
