import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Head from '@docusaurus/Head';
import type { ReactNode } from 'react';

import { landingGateScript } from '@/components/onboarding/landing';
import { FilmPage } from '@/film-page';

/**
 * The root: the onboarding film, from Learn. Before it paints, Learn's
 * script sends a returning visitor who chose the docs on to them, and marks
 * the film's entrance to play; only in the page as served, so it never runs
 * again on a link within the site.
 */
export default function Home(): ReactNode {
  return (
    <>
      <Head>
        <title>Intuition</title>
        <meta name="description" content="Your data, made multiplayer." />
        {ExecutionEnvironment.canUseDOM ? null : (
          <script>{landingGateScript()}</script>
        )}
      </Head>
      <FilmPage />
    </>
  );
}
