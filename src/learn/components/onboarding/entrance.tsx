'use client';

import { type ReactNode, useEffect, useRef, useSyncExternalStore } from 'react';

import { outlinePath } from '@/components/playground/story-shapes';

import { rememberLanding } from './landing';
import { createUniverse, type Universe } from './universe';

/**
 * How long the card takes to come in after "Play": the delay and the
 * duration of its transition, below, together.
 */
const CARD_IN_MS = 2000;

/*
 * The entrance's stage, kept on <html> as `data-entrance` while it plays:
 * "welcome" as the stars come in, then "formed" once they have formed the
 * logo. The script in the head (`landing.ts`) sets "welcome" before the
 * page paints when there is an entrance to play, and the styles here and in
 * the top bar follow it: the card hidden, the welcome shown, "Play" and the
 * top bar coming in once formed. Without it, the film is on screen from the
 * start.
 */
const listeners = new Set<() => void>();
let isShown: boolean | undefined;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readIsShown(): boolean {
  isShown ??= document.documentElement.dataset.entrance === undefined;
  return isShown;
}

/** Opens the entrance: the card comes in, the welcome goes. */
function open(): void {
  delete document.documentElement.dataset.entrance;
}

function showFilm(): void {
  open();
  isShown = true;
  for (const listener of listeners) {
    listener();
  }
}

/** Whether the film is on screen, for it to start playing. */
export function useIsFilmShown(): boolean {
  return useSyncExternalStore(subscribe, readIsShown, () => false);
}

export interface EntranceProps {
  /** Classes for the card's box. */
  className?: string;
  /** The film's card. */
  children: ReactNode;
}

/**
 * The front page's way in: stars come in from the sky and form the
 * Intuition logo, and "Play" fades in at its centre. Pressed, the stars
 * part to the sides and the film's card fades and zooms in. Without the
 * entrance, a link to a step of the film say, the stars start parted.
 */
export function Entrance({
  className = '',
  children,
}: EntranceProps): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const universeRef = useRef<Universe | null>(null);
  const timerRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const markBox = markRef.current;
    const column = cardRef.current;
    if (!canvas || !markBox || !column) {
      return;
    }
    const universe = createUniverse(canvas, {
      markBox,
      column,
      isParted: readIsShown(),
      onFormed: () => {
        const root = document.documentElement;
        if (root.dataset.entrance === 'welcome') {
          root.dataset.entrance = 'formed';
        }
      },
    });
    // Without WebGL 2 there are no stars to part: straight to the film.
    if (!universe) {
      showFilm();
    }
    universeRef.current = universe;
    return () => {
      window.clearTimeout(timerRef.current);
      universe?.dispose();
      universeRef.current = null;
    };
  }, []);

  function handlePlay(): void {
    // Played past, the universe is not shown again: next time, the film.
    rememberLanding('film');
    universeRef.current?.part();
    open();
    timerRef.current = window.setTimeout(() => {
      showFilm();
      cardRef.current?.focus({ preventScroll: true });
    }, CARD_IN_MS);
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 size-full"
      />
      <div className="pointer-events-none invisible fixed inset-0 z-10 flex items-center justify-center opacity-0 transition-[opacity,visibility] duration-300 in-data-entrance:visible in-data-entrance:opacity-100">
        <div
          ref={markRef}
          className="pointer-events-auto flex size-[min(80vmin,38rem)] cursor-grab touch-pan-y items-center justify-center select-none data-[dragging=true]:cursor-grabbing"
        >
          {/*
           * Inside the logo's ring, in a box of their own that does not grow
           * with it, so the words keep their size: the line on every screen,
           * the sentence under it only where there is room for it. The box
           * lets a drag through to the ring's; only "Play" takes the pointer.
           */}
          <div className="@container pointer-events-none flex size-[min(72vmin,34rem)] items-center justify-center">
            <div className="invisible flex max-w-[62%] flex-col items-center gap-6 text-center opacity-0 transition-[opacity,visibility] duration-700 in-data-[entrance=formed]:visible in-data-[entrance=formed]:opacity-100">
              <div className="flex flex-col gap-3">
                <p className="text-lg font-medium tracking-tight text-balance text-fg @sm:text-2xl @lg:text-3xl">
                  Your data, made multiplayer.
                </p>
                <p className="hidden text-sm/relaxed text-pretty text-fg-muted @lg:block">
                  Build a knowledge graph and others build on it with you. As
                  they do, your share of it gains value.
                </p>
              </div>
              <button
                type="button"
                className="learn-hero__action pointer-events-auto gap-2"
                data-variant="primary"
                onClick={handlePlay}
              >
                {/* The predicate's triangle, turned to point right. */}
                <svg
                  aria-hidden
                  viewBox="0 0 14 14"
                  className="size-3.5 fill-current"
                >
                  <path
                    d={outlinePath('predicate', 14, 7)}
                    transform="rotate(90 7 7)"
                  />
                </svg>
                Play
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={cardRef}
        // Focused once it has come in, so the keyboard carries on from it.
        tabIndex={-1}
        className={`outline-none in-data-entrance:invisible in-data-entrance:scale-90 in-data-entrance:opacity-0 motion-safe:transition-[opacity,scale,visibility] motion-safe:delay-1000 motion-safe:duration-1000 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      >
        {children}
      </div>
    </>
  );
}
