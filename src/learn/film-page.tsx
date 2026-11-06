import type { ReactNode } from 'react';

import { Entrance } from '@/components/onboarding/entrance';
import { TopBar } from '@/components/onboarding/top-bar';
import { Playground } from '@/components/playground/playground';

import './learn.css';

/**
 * Learn's front page (`src/app/page.tsx`), in the body Learn's layout gives
 * it: the film that tells the story of Intuition in chapters, behind its
 * entrance. "Start building" goes on to the docs, at `/docs`.
 */
export function FilmPage(): ReactNode {
  return (
    <div className="learn-film isolate min-h-dvh bg-bg font-sans text-fg antialiased">
      <div className="flex min-h-dvh flex-col">
        <TopBar />
        <main className="flex flex-1 items-center justify-center px-6 pb-16">
          <h1 className="sr-only">Intuition, in a short film</h1>
          <Entrance className="w-full max-w-7xl">
            <Playground />
          </Entrance>
        </main>
      </div>
    </div>
  );
}
