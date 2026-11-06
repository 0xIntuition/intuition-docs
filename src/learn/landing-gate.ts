import {
  LANDING_KEY,
  landingGateScript,
} from '@/components/onboarding/landing';

/*
 * Learn's script that runs before the film paints: it sends a returning
 * visitor who chose the docs on to them, and marks the film's entrance to
 * play. The built site has it in the root page as served
 * (`src/pages/index.tsx`); the dev server serves no page ahead, so here it
 * runs once, as the app starts, before the film renders.
 */
if (process.env.NODE_ENV === 'development' && typeof document !== 'undefined') {
  const script = document.createElement('script');
  script.textContent = landingGateScript();
  document.head.append(script);
}

// "Learn", in the top bar, starts over: the stored choice is forgotten, and
// the root, loaded afresh, opens on the universe. The logo goes where the
// stored choice says: the docs, or the root, which plays the universe or the
// film by it. On the way down, before the logo's own link moves the page to
// the root, which would show the film for a moment.
if (typeof document !== 'undefined') {
  document.addEventListener(
    'click',
    (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }
      if (event.target.closest('.navbar-learn')) {
        try {
          window.localStorage.removeItem(LANDING_KEY);
        } catch {
          // Storage can be off: then nothing was stored to forget.
        }
        return;
      }
      if (event.target.closest('.navbar__brand')) {
        let stored = null;
        try {
          stored = window.localStorage.getItem(LANDING_KEY);
        } catch {
          // Storage can be off: then the root, as for a first visit.
        }
        event.preventDefault();
        window.location.assign(stored === 'docs' ? '/docs' : '/');
      }
    },
    true,
  );
}
