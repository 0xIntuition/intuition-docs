// #region bounded-work
import { forEachBounded } from '@0xintuition/pipeline-runtime/concurrency';

const controller = new AbortController();
export const outcomes = await forEachBounded(
  ['recording', 'artist', 'release'],
  async (label, signal) => {
    signal.throwIfAborted();
    return label.toUpperCase();
  },
  { concurrency: 2, signal: controller.signal },
);

for (const outcome of outcomes) {
  if (outcome.kind === 'success') console.log(outcome.value);
  else console.log(outcome.kind);
}
// #endregion
