// #region recording-fields
import {
  validateClassificationValues,
  type ClassificationValidationIssue,
  type ClassificationValueMap,
} from '@0xintuition/classifications';
import { musicRecordingCreationProfile } from '@0xintuition/classifications/creation/music-recording';
import { calculateAtomId } from '@0xintuition/ids';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';

export const { fields, classification } = musicRecordingCreationProfile;
type FieldKey = (typeof fields)[number]['key'];
export type RecordingDraft = Partial<Record<FieldKey, string>>;
export const maxFieldLength = 512;
// #endregion

// #region preview
export function previewRecording(draft: RecordingDraft) {
  const values: ClassificationValueMap = {};
  const limits: ClassificationValidationIssue[] = [];
  for (const field of fields) {
    const raw = draft[field.key] ?? '';
    if (raw.length > maxFieldLength) {
      limits.push({
        field: field.key,
        message: 'Use 512 characters or fewer.',
      });
      continue;
    }
    if (!raw.trim()) continue;
    if (field.fieldType === 'string[]') {
      const lines = raw
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      if (lines.length > 4 || !lines.every(isWebUrl)) {
        limits.push({
          field: field.key,
          message: 'Enter up to four web URLs, one per line.',
        });
      }
      values[field.key] = lines;
    } else {
      values[field.key] = raw.trim();
    }
  }
  const issues = [
    ...limits,
    ...validateClassificationValues(classification.slug, values),
  ];
  if (issues.length) return { ok: false as const, issues };

  const result = buildIidAnchor(classification.slug, values);
  if (!result.success) return failure(result.errors.join(' '));
  const anchor = result.value;
  if (values.isrc && !anchor.iid?.startsWith('int:isrc:')) {
    return failure('Check the recording code or leave it empty.', 'isrc');
  }
  if (calculateAtomId(anchor.dataHex) !== anchor.id) {
    return failure('The anchor ID does not match its bytes.');
  }
  return { ok: true as const, anchor };
}
// #endregion

function failure(message: string, field?: string) {
  const issues: ClassificationValidationIssue[] = [{ message, field }];
  return { ok: false as const, issues };
}

function isWebUrl(value: string) {
  if (!URL.canParse(value)) return false;
  const { protocol } = new URL(value);
  return protocol === 'https:' || protocol === 'http:';
}
