import { planLink } from './link-identities.ts';

// #region archived-records
const recordingIid = 'int:isrc:USXY12600001';
export const archive = {
  level: 'recording' as const,
  atomData:
    '{"name":"Paper Moon Demo","sameAs":["https://example.org/recordings/17"]}',
  recordingIid,
};

export const candidates = {
  anchor: { level: 'recording', atomData: recordingIid, recordingIid },
  review: {
    level: 'article',
    atomData: 'Review of Paper Moon Demo',
    recordingIid,
  },
  namesake: { level: 'recording', atomData: '{"name":"Paper Moon Demo"}' },
} as const;
// #endregion

// #region apply-review
type Decision = {
  candidate: keyof typeof candidates;
  approved: boolean;
  evidence: string;
};

export function reviewLink({ candidate, approved, evidence }: Decision) {
  if (!evidence.trim())
    return { candidate, reason: 'Record the evidence for review.' };
  const result = planLink(archive, candidates[candidate], approved);
  return { candidate, evidence, ...result };
}
// #endregion
