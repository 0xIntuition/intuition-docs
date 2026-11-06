/**
 * Where the site opens for someone who has been before. The universe, the
 * film's entrance at the root, is for a first visit; after that the site
 * remembers how the visitor went on:
 *
 * - "Play", in the universe: the film, straight away, next time.
 * - "Skip to docs", from the film's page, or "Start building", at the
 *   film's end: the docs, next time.
 *
 * "Try the onboarding", in the docs, forgets it (`OnboardingLink`), so the
 * universe plays again, as on a first visit.
 *
 * It is kept in this browser's localStorage, and read by a small script that
 * runs before the film's page paints (`landingGateScript`), so a returning
 * visitor never sees the universe or the film flash by on the way.
 */

import { ROUTES } from '@/lib/site';

export const LANDING_KEY = 'intuition:landing';

/** The address's parameter that names the film's beat to open on. */
export const BEAT_PARAM = 'step';

/** Where a returning visitor lands past the film, by what is stored. */
const LANDING_ROUTES = { docs: ROUTES.docs } as const;

/** How a visitor went on: past the universe to the film, or to the docs. */
export type Landing = 'film' | keyof typeof LANDING_ROUTES;

/** Every landing, for the gate to tell one stored from anything else. */
const LANDINGS = ['film', ...Object.keys(LANDING_ROUTES)];

/** Remembers where the site should open next time. */
export function rememberLanding(landing: Landing): void {
  try {
    window.localStorage.setItem(LANDING_KEY, landing);
  } catch {
    // Storage can be off: a private window, or site data blocked. Then the
    // site forgets, and opens on the film as for a first visit,
    // which is all there is to recover.
  }
}

/** Forgets where the site opened, so the front page plays the universe again. */
export function forgetLanding(): void {
  try {
    window.localStorage.removeItem(LANDING_KEY);
  } catch {
    // Storage can be off, and then there was nothing remembered to forget.
  }
}

/**
 * The script that runs before the film's page paints. Served as
 * `/landing.js` and loaded, blocking, in the head of every page; it acts
 * only on the film's page.
 *
 * First it sends a returning visitor who chose the docs on to them, never
 * to the film itself, and only when the site is opened: a link, a
 * bookmark, a typed address. Not on a reload, back or forward, and not on a
 * link from within the site. Anything that fails, storage among it, leaves
 * the film.
 *
 * Staying, on a first visit it marks <html> `data-entrance="welcome"` for
 * the universe to play (`entrance.tsx`), unless the address opens on a beat
 * of the film, the reader asked for reduced motion, or the browser has no
 * WebGL 2 to draw the stars with. One who has been before, past the
 * universe or on to the docs, sees the film straight away.
 */
export function landingGateScript(): string {
  return `(function () {
  if (location.pathname !== ${JSON.stringify(ROUTES.play)}) return;
  var stored = null;
  try {
    stored = localStorage.getItem(${JSON.stringify(LANDING_KEY)});
  } catch (error) {}
  try {
    var entry = performance.getEntriesByType('navigation')[0];
    var isOpened = (entry === undefined || entry.type === 'navigate')
      && (document.referrer === '' || new URL(document.referrer).origin !== location.origin);
    var route = isOpened ? ${JSON.stringify(LANDING_ROUTES)}[stored] : undefined;
    if (typeof route === 'string' && route !== location.pathname) {
      location.replace(route);
      return;
    }
  } catch (error) {}
  try {
    if (${JSON.stringify(LANDINGS)}.indexOf(stored) !== -1) return;
    if (new URLSearchParams(location.search).has(${JSON.stringify(BEAT_PARAM)})) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof WebGL2RenderingContext === 'undefined') return;
    document.documentElement.dataset.entrance = 'welcome';
  } catch (error) {}
})();
`;
}
