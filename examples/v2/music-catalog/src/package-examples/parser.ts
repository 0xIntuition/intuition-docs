// #region local-parser
import { parseAtom, ParseError } from '@0xintuition/atom-parser';

export const parsed = await parseAtom('https://example.com/catalog', {
  remoteFetch: false,
  maxInputBytes: 1024,
});
if (parsed.kind === 'url') {
  console.log(parsed.canonicalUrl, parsed.remote === undefined);
}

try {
  await parseAtom('', { remoteFetch: false });
} catch (error) {
  if (!(error instanceof ParseError)) throw error;
  console.log(error.code);
}
// #endregion
