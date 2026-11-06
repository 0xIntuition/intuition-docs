import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);

  return () => {
    media.removeEventListener('change', onChange);
  };
}

/**
 * Whether the reader asked for reduced motion, kept up to date if they
 * change it. The static HTML is built assuming motion, and the page settles
 * on the reader's choice as it hydrates.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
