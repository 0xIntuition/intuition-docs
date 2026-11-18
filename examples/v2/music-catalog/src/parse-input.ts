import assert from 'node:assert/strict';

// #region parse-candidate
import { parseAtom, ParseError } from '@0xintuition/atom-parser';

export async function parseCandidate(input: string) {
  try {
    const result = await parseAtom(input, {
      remoteFetch: false,
      maxInputBytes: 64,
    });
    const { kind, warnings } = result;
    if (result.kind === 'iid') {
      return {
        kind,
        warnings,
        valid: result.valid,
        iid: result.canonicalIid,
        anchorEligible: result.anchorEligible,
        reason: result.reason,
      };
    }
    return {
      kind,
      warnings,
      value:
        result.kind === 'url' ? result.canonicalUrl : result.normalizedInput,
    };
  } catch (error) {
    if (!(error instanceof ParseError)) throw error;
    return { error: error.code };
  }
}
// #endregion

if (import.meta.main) {
  const inputs = [
    ' https://example.org/catalog ',
    'INT:ISRC:US-RC1-76-07839',
    'int:unknown:example',
    'A catalog label',
    '   ',
    'x'.repeat(65),
  ];
  const results = await Promise.all(inputs.map(parseCandidate));
  assert.deepEqual(
    results.map((r) => r.kind ?? r.error),
    ['url', 'iid', 'iid', 'plain_string', 'EMPTY_INPUT', 'INPUT_TOO_LARGE'],
  );
  assert.equal(results[1].iid, 'int:isrc:USRC17607839');
  assert.equal(results[2].valid, false);
  console.log(results);
}
