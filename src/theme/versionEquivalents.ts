type Doc = { id: string; path: string };
type Version = {
  name: string;
  path: string;
  mainDocId: string;
  docs: readonly Doc[];
};
type Pair = { v1: string; v2: string };

type ResolveOptions = {
  versions: readonly Version[];
  pairs: readonly Pair[];
  sourceVersion: string;
  targetVersion: string;
  docId?: string;
  search?: string;
  hash?: string;
};

/** Resolve native doc paths, with the same rules for the banner and switcher. */
export function resolveVersionEquivalent({
  versions,
  pairs,
  sourceVersion,
  targetVersion,
  docId,
  search = '',
  hash = '',
}: ResolveOptions): string {
  const target = versions.find((version) => version.name === targetVersion);
  if (!target) throw new Error(`Unknown target docs version: ${targetVersion}`);

  let pairedId: string | undefined;
  if (sourceVersion === 'v1' && targetVersion === 'current') {
    pairedId = pairs.find((pair) => pair.v1 === docId)?.v2;
  } else if (sourceVersion === 'current' && targetVersion === 'v1') {
    pairedId = pairs.find((pair) => pair.v2 === docId)?.v1;
  }

  const targetDoc =
    (pairedId ? target.docs.find((doc) => doc.id === pairedId) : undefined) ??
    target.docs.find((doc) => doc.id === docId) ??
    target.docs.find((doc) => doc.id === target.mainDocId);

  // A heading in another document is not an equivalent anchor, even for a pair.
  const retainedHash = docId && targetDoc?.id === docId ? hash : '';
  return `${targetDoc?.path ?? target.path}${search}${retainedHash}`;
}
