// #region row-types
type Atom = { id: string; isOnchain: boolean; parseStatus: string };
type Triple = {
  id: string;
  subjectId: string;
  predicateId: string;
  objectId: string;
};
type Predicate = {
  id: string;
  slug: string;
  label: string;
  description: string | null;
};
type Page<T> = {
  data: T[];
  pagination: { limit: number; offset: number; count: number };
};
// #endregion

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function record(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) throw new Error('Expected a JSON object.');
  return value;
}

function text(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length > 16_384)
    throw new Error(`Invalid or oversized text in ${field}.`);
  return value;
}

function atom(value: unknown): Atom {
  const row = record(value);
  if (typeof row.isOnchain !== 'boolean')
    throw new Error('Invalid isOnchain field.');
  return {
    id: text(row.id, 'id'),
    isOnchain: row.isOnchain,
    parseStatus: text(row.parseStatus, 'parseStatus'),
  };
}

function triple(value: unknown): Triple {
  const row = record(value);
  return {
    id: text(row.id, 'id'),
    subjectId: text(row.subjectId, 'subjectId'),
    predicateId: text(row.predicateId, 'predicateId'),
    objectId: text(row.objectId, 'objectId'),
  };
}

function predicate(value: unknown): Predicate {
  const row = record(value);
  return {
    id: text(row.id, 'id'),
    slug: text(row.slug, 'slug'),
    label: text(row.label, 'label'),
    description:
      row.description === null ? null : text(row.description, 'description'),
  };
}

function rows<T>(
  value: unknown,
  maximum: number,
  decode: (item: unknown) => T,
): T[] {
  if (!Array.isArray(value) || value.length > maximum)
    throw new Error('Invalid or oversized data array.');
  return value.map(decode);
}

// The two paginated requests below both ask for ten rows at offset zero.
function page<T>(value: unknown, decode: (item: unknown) => T): Page<T> {
  const envelope = record(value);
  const { limit, offset, count } = record(envelope.pagination);
  const data = rows(envelope.data, 10, decode);
  if (limit !== 10 || offset !== 0 || count !== data.length)
    throw new Error(
      'Pagination disagrees with the requested page or returned data.',
    );
  return { data, pagination: { limit, offset, count } };
}

async function readJson(request: Promise<Response>): Promise<unknown> {
  const response = await request;
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`Core returned HTTP ${response.status}.`);
  }
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Core returned an empty body.');
  // Bound the decoded body even when Content-Length is missing or compressed.
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let body = '';
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1024 * 1024) throw new Error('Core response exceeds 1 MiB.');
      body += decoder.decode(value, { stream: true });
    }
    return JSON.parse(body + decoder.decode());
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally {
    reader.releaseLock();
  }
}

// #region list-queries
export async function readGraph() {
  const options: RequestInit = {
    method: 'GET',
    redirect: 'error',
    signal: AbortSignal.timeout(5000),
  };
  const atoms = page(
    await readJson(
      fetch('http://localhost:3000/api/atoms?limit=10&offset=0', options),
    ),
    atom,
  );
  const triples = page(
    await readJson(
      fetch('http://localhost:3000/api/triples?limit=10&offset=0', options),
    ),
    triple,
  );
  const catalog = record(
    await readJson(fetch('http://localhost:3000/api/predicates', options)),
  );
  const predicates = rows(catalog.data, 2048, predicate);
  return { atoms, triples, predicates };
}
// #endregion
