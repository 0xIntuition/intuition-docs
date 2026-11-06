'use client';

import Link from '@docusaurus/Link';
import {
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useIsFilmShown } from '@/components/onboarding/entrance';
import { BEAT_PARAM, rememberLanding } from '@/components/onboarding/landing';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { ROUTES } from '@/lib/site';

import {
  ATOMS,
  BEATS,
  type CaptionPart,
  CHAPTER_SPANS,
  chapterAt,
  describeScene,
  DURATION,
  type Role,
  sceneAt,
  type StepUnit,
  stepFrom,
  THE_WAY_ON,
} from './story-model';
import { StoryScene } from './story-scene';
import { outlinePath, ROLE_COLOURS } from './story-shapes';
import { StoryTimeline } from './story-timeline';

/** Once the film is on screen, how long it waits to start: a breath. */
const SETTLE_MS = 300;

/** "1:05" */
function clock(ms: number): string {
  const seconds = Math.floor(ms / 1000);

  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

/** When each beat starts: the timeline's dots. */
const BEAT_STARTS = BEATS.map((beat) => beat.start);

/** The glyph's box: its outlines are this size across, as the canvases' are at theirs. */
const GLYPH_BOX = 12;

/**
 * A role's shape, in its colour, beside the word for it in a caption: the
 * same rounded outline the cloud and the plane fill, filled as they do.
 */
function RoleGlyph({ role }: { role: Role }): ReactNode {
  const fill = `rgb(${ROLE_COLOURS[role].join(', ')})`;

  return (
    <svg
      viewBox={`0 0 ${GLYPH_BOX} ${GLYPH_BOX}`}
      aria-hidden
      className="mr-1 inline-block size-[0.7em] align-[0.02em]"
    >
      <path d={outlinePath(role, GLYPH_BOX, GLYPH_BOX / 2)} fill={fill} />
    </svg>
  );
}

function Caption({ parts }: { parts: readonly CaptionPart[] }): ReactNode {
  // A key from a part's words, counted where the same words come again, as
  // "object" can in one caption.
  const seen = new Map<string, number>();
  const keyOf = (text: string): string => {
    const count = seen.get(text) ?? 0;
    seen.set(text, count + 1);

    return count === 0 ? text : `${text} ${count}`;
  };

  return parts.map((part) => {
    if (typeof part === 'string') {
      // A new line where the caption starts one.
      return part.split('\n').map((sentence, at) => (
        <Fragment key={sentence}>
          {at > 0 && <br />}
          {sentence}
        </Fragment>
      ));
    }
    if ('href' in part) {
      return (
        <a
          key={keyOf(part.text)}
          href={part.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm whitespace-nowrap text-fg underline decoration-fg-muted underline-offset-[0.2em] outline-offset-2 outline-accent hover:decoration-fg focus-visible:outline-2"
        >
          {part.text}
          {/* Out of the page: an arrow pointing up and away. */}
          <svg
            viewBox="0 0 12 12"
            aria-hidden
            className="ml-0.5 inline-block size-[0.65em] align-[0.05em]"
          >
            <path
              d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }

    return (
      // A shape stays with its word across a line break.
      <span key={keyOf(part.text)} className="whitespace-nowrap">
        <RoleGlyph role={part.role} />
        {part.text}
      </span>
    );
  });
}

function TransportIcon({
  kind,
}: {
  kind: 'play' | 'pause' | 'replay';
}): ReactNode {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-4" fill="currentColor">
      {kind === 'play' && (
        <path d="M5 3.3v9.4a.7.7 0 0 0 1.06.6l7.5-4.7a.7.7 0 0 0 0-1.2l-7.5-4.7A.7.7 0 0 0 5 3.3Z" />
      )}
      {kind === 'pause' && (
        <>
          <rect x="3.5" y="3" width="3" height="10" rx="0.8" />
          <rect x="9.5" y="3" width="3" height="10" rx="0.8" />
        </>
      )}
      {kind === 'replay' && (
        <path
          d="M2.8 8a5.2 5.2 0 1 0 1.6-3.8M2.8 2.4v3h3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

/**
 * The playground, the whole card: the story of Intuition as a short film in
 * chapters (`story-model.ts`), told on a cloud the reader can turn, a
 * caption for each beat, and a player to play, pause, scrub and step
 * through it. Turning the cloud holds the film; playing on turns it back.
 *
 * It starts by itself once it is on screen, unless the reader asked for
 * reduced motion: then it waits for Play, and each beat shows as it is left,
 * with no motion. Played to its end, the story is done, and from then on the
 * site opens on the docs (see `landing.ts`).
 */
export function Playground(): ReactNode {
  const isStill = usePrefersReducedMotion();
  const isShown = useIsFilmShown();
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // The film's time for the clock and the handlers, between renders.
  const timeRef = useRef(0);
  // Whether the film has been started, by itself or by the reader: after
  // that, it is the reader's to play and pause.
  const hasStarted = useRef(false);
  const wasPlayingBeforeScrub = useRef(false);
  // The room under the scene it may draw into when its beat has no caption:
  // the caption's and the gaps either side of it, less the card's padding,
  // so the drawing stops as far above the timeline as the scene starts
  // under the card's top.
  const captionRef = useRef<HTMLDivElement>(null);
  const [captionRoom, setCaptionRoom] = useState(0);

  useEffect(() => {
    const caption = captionRef.current;
    if (caption === null) {
      return;
    }
    const measure = (): void => {
      const card = getComputedStyle(caption.parentElement ?? caption);
      const px = (value: string): number => {
        const parsed = Number.parseFloat(value);

        return Number.isNaN(parsed) ? 0 : parsed;
      };
      setCaptionRoom(
        Math.max(
          caption.offsetHeight + px(card.rowGap) * 2 - px(card.paddingTop),
          0,
        ),
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(caption);
    measure();

    return () => {
      observer.disconnect();
    };
  }, []);

  const seek = useCallback((next: number) => {
    const clamped = Math.min(Math.max(next, 0), DURATION);
    timeRef.current = clamped;
    setTime(clamped);
  }, []);

  // Starts the film once it is on screen.
  useEffect(() => {
    if (!isShown || isStill) {
      return;
    }
    const timer = window.setTimeout(() => {
      if (!hasStarted.current) {
        hasStarted.current = true;
        setIsPlaying(true);
      }
    }, SETTLE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isShown, isStill]);

  // The clock: the film moves on with each frame, and stops itself at the
  // end.
  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    let frame = 0;
    let last = performance.now();
    const tick = (now: number): void => {
      // A long gap, a hidden tab for one, does not jump the film ahead.
      const next = Math.min(
        timeRef.current + Math.min(now - last, 100),
        DURATION,
      );
      last = now;
      timeRef.current = next;
      setTime(next);
      if (next >= DURATION) {
        setIsPlaying(false);
        rememberLanding('docs');

        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isPlaying]);

  function toggle(): void {
    hasStarted.current = true;
    if (isPlaying) {
      setIsPlaying(false);

      return;
    }
    if (timeRef.current >= DURATION) {
      seek(0);
    }
    setIsPlaying(true);
  }

  function step(direction: 1 | -1, unit: StepUnit): void {
    hasStarted.current = true;
    // Playing, a step lands where a beat starts, so its motion plays.
    // Paused, where it settles, so the picture matches the caption.
    const at = isPlaying ? 'start' : 'settled';
    seek(stepFrom(timeRef.current, direction, at, unit));
  }

  function scrub(isScrubbing: boolean): void {
    hasStarted.current = true;
    if (isScrubbing) {
      wasPlayingBeforeScrub.current = isPlaying;
      setIsPlaying(false);
    } else if (wasPlayingBeforeScrub.current && timeRef.current < DURATION) {
      setIsPlaying(true);
    }
  }

  const scene = sceneAt(time, isStill);
  const beatId = scene.beat.id;

  // A link to a beat, `?step=<beat id>`, opens on it, settled and paused, as
  // the one who shared it saw it. An unknown one opens the film as usual.
  // Read once, as the page loads, and applied on the first frame: the page
  // first renders the film's start, as the static page was built.
  const [linked] = useState(() =>
    typeof window === 'undefined'
      ? undefined
      : BEATS.find(
          (beat) =>
            beat.id ===
            new URLSearchParams(window.location.search).get(BEAT_PARAM),
        ),
  );
  const isLinkPending = useRef(linked !== undefined);
  useEffect(() => {
    if (linked === undefined) {
      return;
    }
    hasStarted.current = true;
    const frame = window.requestAnimationFrame(() => {
      seek(linked.start + linked.motionMs);
      isLinkPending.current = false;
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [linked, seek]);

  // Once the film moves, the address follows it beat by beat, so it can be
  // copied and shared; replaced, not pushed, so Back still leaves the page.
  useEffect(() => {
    if (!hasStarted.current || isLinkPending.current) {
      return;
    }
    const url = new URL(window.location.href);
    if (url.searchParams.get(BEAT_PARAM) === beatId) {
      return;
    }
    url.searchParams.set(BEAT_PARAM, beatId);
    window.history.replaceState(window.history.state, '', url);
  }, [beatId]);
  const chapter = chapterAt(time);
  const isAtEnd = time >= DURATION;
  // As the film's last triple quietens round its way on, the controls
  // quieten with the graph, as far and as fast, frame for frame, and come
  // back in full, eased, when the reader reaches for them (`--reach`): the
  // pointer moving over them, or the keyboard on them. A pointer only resting there, from pressing Play,
  // say, or a button focused by a click, does not hold them back; and each
  // beat starts without the reach.
  const quiet = Math.max(0, ...scene.quiet.values());
  const controlsRef = useRef<HTMLDivElement>(null);
  // The beat the reader reached for the controls in, if they still are.
  const [reachedIn, setReachedIn] = useState<string | null>(null);
  const isReaching = reachedIn === beatId;
  useEffect(() => {
    controlsRef.current?.style.setProperty('--quiet', String(quiet));
  }, [quiet]);

  return (
    <div className="relative">
      {/*
       * From tablet width up, the card takes the first view: as tall as the
       * screen allows under the top bar, within bounds. Narrower, the scene
       * keeps its own shape and the card grows to fit.
       */}
      <div className="panel flex flex-col gap-4 p-6 md:h-[calc(100dvh-13rem)] md:max-h-[60rem] md:min-h-[32rem] md:p-12">
        <StoryScene
          scene={scene}
          label={describeScene(scene)}
          isPlaying={isPlaying}
          onPress={toggle}
          onLookAround={() => {
            hasStarted.current = true;
            setIsPlaying(false);
          }}
          roomBelow={captionRoom}
          way={
            // The film's last predicate, start building, is the way on: a
            // link in the shape of its name's badge, laid out full grown and
            // scaled as the scene grows it, pulsing once the triple round it
            // has quietened.
            <Link
              href={ROUTES.docs}
              className="flex h-(--way-height) origin-top scale-(--way-scale) items-center rounded-full bg-fg px-(--way-padding) text-(length:--way-font) leading-none font-medium whitespace-nowrap text-bg outline-offset-2 outline-accent transition-colors duration-200 ease-out hover:bg-fg/85 focus-visible:outline-2 motion-safe:in-data-[pulsing=true]:animate-way-pulse"
              onClick={() => {
                rememberLanding('docs');
              }}
            >
              {ATOMS[THE_WAY_ON].label}
            </Link>
          }
        />

        {/*
         * The current caption, read out as it changes, over every caption
         * kept hidden in the same cell: the cell is two lines tall, or as tall
         * as the longest caption if that is more, so the card never moves as
         * they change. A caption starts on the top line. Being the one shown,
         * it is the one read, links and all.
         */}
        <div ref={captionRef} className="grid min-h-[2lh] md:text-lg">
          {BEATS.map((beat) => (
            <p
              key={beat.id}
              aria-hidden
              className="invisible col-start-1 row-start-1 text-center text-pretty"
            >
              <Caption parts={beat.caption} />
            </p>
          ))}
          <p
            aria-live="polite"
            className="col-start-1 row-start-1 self-start text-center text-pretty"
          >
            <span
              key={scene.beat.id}
              className="motion-safe:animate-caption-arrive"
            >
              <Caption parts={scene.beat.caption} />
            </span>
          </p>
        </div>

        {/*
         * The play button beside the timeline, the track and its chapters'
         * names centred on it together. As the film ends, at 15%, and whole
         * again under the pointer or the keyboard.
         */}
        <div
          ref={controlsRef}
          data-reaching={isReaching}
          className="flex items-center gap-3 opacity-[calc(1-0.85*var(--quiet,0)*(1-var(--reach)))] transition-[--reach] duration-200 ease-out has-focus-visible:[--reach:1] data-[reaching=true]:[--reach:1]"
          onPointerMove={() => {
            if (!isReaching) {
              setReachedIn(beatId);
            }
          }}
          onPointerLeave={() => {
            setReachedIn(null);
          }}
        >
          <button
            type="button"
            aria-label={isPlaying ? 'Pause' : isAtEnd ? 'Play again' : 'Play'}
            className="btn btn-secondary w-9 shrink-0 px-0"
            onClick={toggle}
          >
            <TransportIcon
              kind={isPlaying ? 'pause' : isAtEnd ? 'replay' : 'play'}
            />
          </button>
          <StoryTimeline
            time={time}
            duration={DURATION}
            chapters={CHAPTER_SPANS}
            marks={BEAT_STARTS}
            valueText={`${chapter.title}, ${clock(time)} of ${clock(DURATION)}`}
            onSeek={(next) => {
              hasStarted.current = true;
              seek(next);
            }}
            onScrub={scrub}
            onStep={step}
            onToggle={toggle}
          />
        </div>
      </div>
    </div>
  );
}
