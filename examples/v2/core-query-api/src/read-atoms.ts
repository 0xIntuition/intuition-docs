// #region read-atoms
type AtomSummary = {
  id: string;
  isOnchain: boolean;
  classificationType: string;
  parseStatus: string;
  classificationStatus: string;
  enrichmentStatus: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function readAtoms() {
  const response = await fetch(
    'http://localhost:3000/api/atoms?limit=10&offset=0',
    {
      method: 'GET',
      signal: AbortSignal.timeout(5_000),
    },
  );
  if (!response.ok)
    throw new Error(`Core request failed: HTTP ${response.status}`);
  const payload: unknown = await response.json();
  if (
    !isRecord(payload) ||
    !Array.isArray(payload.data) ||
    !isRecord(payload.pagination)
  ) {
    throw new Error('Unexpected Core list response');
  }
  const atoms: AtomSummary[] = payload.data.map((row: unknown) => {
    if (
      !isRecord(row) ||
      typeof row.isOnchain !== 'boolean' ||
      ![
        'id',
        'classificationType',
        'parseStatus',
        'classificationStatus',
        'enrichmentStatus',
      ].every((key) => typeof row[key] === 'string')
    ) {
      throw new Error('Unexpected Core atom summary');
    }
    return {
      id: row.id as string,
      isOnchain: row.isOnchain,
      classificationType: row.classificationType as string,
      parseStatus: row.parseStatus as string,
      classificationStatus: row.classificationStatus as string,
      enrichmentStatus: row.enrichmentStatus as string,
    };
  });
  return { atoms, pagination: payload.pagination };
}
// Call readAtoms() only after starting your own Core node.
// #endregion
