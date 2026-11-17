import assert from 'node:assert/strict';
import { previewRecording } from './form-model.ts';

// #region compare-drafts
if (import.meta.main) {
  const recording = { name: 'Paper Moon Demo', isrc: 'US-XY1-26-00001' };
  const original = previewRecording(recording);
  const edited = previewRecording({
    ...recording,
    name: 'Revised display title',
  });
  const titleOnly = previewRecording({ name: recording.name });
  const invalid = previewRecording({ isrc: recording.isrc });
  assert.ok(original.ok && edited.ok && titleOnly.ok && !invalid.ok);
  assert.equal(original.anchor.id, edited.anchor.id);
  assert.notEqual(original.anchor.id, titleOnly.anchor.id);
  console.log(original.anchor.profile, original.anchor.iid, original.anchor.id);
  console.log('Title edit keeps ID:', original.anchor.id === edited.anchor.id);
  console.log('Without ISRC:', titleOnly.anchor.profile, titleOnly.anchor.id);
  console.log(invalid.issues[0].message);
}
// #endregion
