import { readGraph } from './query-client.ts';

// #region run-query
export async function runQuery() {
  const { atoms, triples, predicates } = await readGraph();
  console.log(`Atoms on this page: ${atoms.pagination.count}`);
  console.log(`Triples on this page: ${triples.pagination.count}`);
  console.log(`Predicates returned: ${predicates.length}`);
  console.log(
    JSON.stringify(
      {
        firstAtom: atoms.data[0] ?? null,
        firstTriple: triples.data[0] ?? null,
        firstPredicate: predicates[0] ?? null,
      },
      null,
      2,
    ),
  );
}
// #endregion

if (import.meta.main) {
  try {
    await runQuery();
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : 'Core query failed.',
    );
    process.exitCode = 1;
  }
}
