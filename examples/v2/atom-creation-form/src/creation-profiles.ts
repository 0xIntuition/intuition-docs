// #region creation-profile
import {
  validateClassificationValues,
  type ClassificationValueMap,
} from '@0xintuition/classifications';
import { musicRecordingCreationProfile } from '@0xintuition/classifications/creation/music-recording';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';

export const formModel = {
  fields: musicRecordingCreationProfile.fields,
  relationships: musicRecordingCreationProfile.relationships,
};

export function previewRecording(values: ClassificationValueMap) {
  // The host must limit request bytes before decoding external JSON.
  const entries = Object.entries(values);
  if (entries.length > 32) throw new Error('Too many fields');
  for (const [, value] of entries) {
    if (Array.isArray(value) && value.length > 16)
      throw new Error('Too many values');
    const items = Array.isArray(value) ? value : [value];
    if (items.some((item) => typeof item === 'string' && item.length > 2_048)) {
      throw new Error('Field value is too long');
    }
  }
  const issues = validateClassificationValues('music-recording', values);
  if (issues.length) return { ok: false as const, issues };
  const anchor = buildIidAnchor('music-recording', values);
  if (!anchor.success) throw new Error(anchor.errors.join('; '));
  return { ok: true as const, anchor: anchor.value };
}

const preview = previewRecording({
  name: 'One More Time',
  byArtist: 'Daft Punk',
});
console.log({
  fields: formModel.fields,
  relationships: formModel.relationships,
  preview,
});
// #endregion
