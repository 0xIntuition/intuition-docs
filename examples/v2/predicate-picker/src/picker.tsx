import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import {
  catalog,
  objectHints,
  previewTriple,
  recording,
  relationships,
} from './picker-model.ts';

export function PredicatePicker() {
  // #region picker-state
  const [key, setKey] = useState('');
  const [target, setTarget] = useState('');
  const [review, setReview] = useState<ReturnType<typeof previewTriple>>();
  const hints = objectHints(key);
  const candidates = catalog.filter((entry) =>
    hints.includes(entry.classification),
  );
  // #endregion

  return (
    <form
      aria-label="Recording relationship"
      style={{ maxWidth: '65ch' }}
      onSubmit={(event) => {
        event.preventDefault();
        setReview(previewTriple(key, target));
      }}
    >
      <p>Recording: {recording.name}</p>
      <div style={{ display: 'grid', gap: '1rem', marginBlockEnd: '1rem' }}>
        {/* The recording's profile supplies the options and target hints. */}
        <label>
          Relationship{' '}
          <select
            value={key}
            onChange={(event) => {
              setKey(event.currentTarget.value);
              setTarget('');
              setReview(undefined);
            }}
          >
            <option value="">Choose a relationship</option>
            {relationships.map(({ predicate }) => (
              <option value={predicate.key} key={predicate.key}>
                {predicate.label}
              </option>
            ))}
          </select>
        </label>
        {key && <div>Suggested classifications: {hints.join(', ')}</div>}
        <label>
          Catalog entry{' '}
          <select
            disabled={!candidates.length}
            value={target}
            onChange={(event) => {
              setTarget(event.currentTarget.value);
              setReview(undefined);
            }}
          >
            <option value="">Choose an entry</option>
            {candidates.map((entry) => (
              <option value={entry.data} key={entry.data}>
                {entry.name}
              </option>
            ))}
          </select>
        </label>
        {key && !candidates.length && (
          <p>Choose another relationship to see catalog entries.</p>
        )}
      </div>
      <button type="submit">Preview triple</button>
      <div role="status" style={{ overflowWrap: 'anywhere' }}>
        {review?.ok === false && review.message}
        {review?.ok && (
          <dl>
            <dt>Predicate status in registry</dt>
            <dd>{review.status}</dd>
            <dt>Subject ID</dt>
            <dd>
              <code>{review.subjectId}</code>
            </dd>
            <dt>Predicate ID</dt>
            <dd>
              <code>{review.predicateId}</code>
            </dd>
            <dt>Object ID</dt>
            <dd>
              <code>{review.objectId}</code>
            </dd>
            <dt>Triple ID</dt>
            <dd>
              <code>{review.tripleId}</code>
            </dd>
          </dl>
        )}
      </div>
    </form>
  );
}

// #region mount
export function mountPredicatePicker(container: HTMLElement) {
  const root = createRoot(container);
  root.render(<PredicatePicker />);
  return () => root.unmount();
}
// #endregion
