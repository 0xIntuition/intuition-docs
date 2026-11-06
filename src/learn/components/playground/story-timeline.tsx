import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useRef,
} from 'react';

import type { ChapterSpan, StepUnit } from './story-model';

export interface StoryTimelineProps {
  /** Where the film is, in milliseconds. */
  time: number;
  duration: number;
  chapters: readonly ChapterSpan[];
  /** When each beat starts: a dot on the track, like the dots of a line. */
  marks: readonly number[];
  /** What a screen reader says the position is. */
  valueText: string;
  /** Moves the film to a moment: a click or drag on the track. */
  onSeek: (time: number) => void;
  /** A drag started, `true`, or ended, `false`: the film holds meanwhile. */
  onScrub: (isScrubbing: boolean) => void;
  /**
   * A step back, -1, or forward, 1: by beat with the arrow keys, by chapter
   * with Page Down and Page Up, and to either end with Home and End.
   */
  onStep: (direction: 1 | -1, unit: StepUnit) => void;
  /** Space, as on any player: plays or pauses. */
  onToggle: () => void;
}

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

const seconds = (ms: number): number => Math.round(ms / 1000);

/**
 * The film's timeline: a track in one segment per chapter, filled up to
 * where the film is, with a handle on it, a dot where each beat starts, and
 * each chapter's name under its
 * segment, grey until the chapter has played through, then the track's
 * colour. Drag or click to move through the film. The arrow keys step from
 * beat to beat, Page Up and Page Down from chapter to chapter, and Home and
 * End go to either end.
 */
const STEP_KEYS: Record<string, readonly [1 | -1, StepUnit]> = {
  ArrowLeft: [-1, 'beat'],
  ArrowDown: [-1, 'beat'],
  ArrowRight: [1, 'beat'],
  ArrowUp: [1, 'beat'],
  PageDown: [-1, 'chapter'],
  PageUp: [1, 'chapter'],
  Home: [-1, 'film'],
  End: [1, 'film'],
};

export function StoryTimeline({
  time,
  duration,
  chapters,
  marks,
  valueText,
  onSeek,
  onScrub,
  onStep,
  onToggle,
}: StoryTimelineProps): ReactNode {
  const segments = useRef(new Map<string, HTMLDivElement>());
  const isScrubbing = useRef(false);
  // The segment the handle sits in: the one playing, the last at the end.
  const current =
    chapters.findLast((chapter) => chapter.start <= time) ?? chapters[0];

  /** The moment under a point on the track, from the segments on screen. */
  function timeAt(clientX: number): number {
    for (const chapter of chapters) {
      const box = segments.current.get(chapter.id)?.getBoundingClientRect();
      // A gap between segments is the start of the next.
      if (box !== undefined && clientX <= box.right) {
        return (
          chapter.start +
          clamp01((clientX - box.left) / box.width) *
            (chapter.end - chapter.start)
        );
      }
    }

    return duration;
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>): void {
    event.currentTarget.setPointerCapture(event.pointerId);
    isScrubbing.current = true;
    onScrub(true);
    onSeek(timeAt(event.clientX));
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>): void {
    if (isScrubbing.current) {
      onSeek(timeAt(event.clientX));
    }
  }

  function handlePointerUp(): void {
    if (isScrubbing.current) {
      isScrubbing.current = false;
      onScrub(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const step = STEP_KEYS[event.key];
    if (step !== undefined) {
      onStep(...step);
    } else if (event.key === ' ') {
      onToggle();
    } else {
      return;
    }
    event.preventDefault();
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Timeline"
      aria-valuemin={0}
      aria-valuemax={seconds(duration)}
      aria-valuenow={seconds(time)}
      aria-valuetext={valueText}
      className="flex min-w-0 flex-1 cursor-pointer touch-none gap-1 outline-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
    >
      {chapters.map((chapter) => {
        const fill = clamp01(
          (time - chapter.start) / (chapter.end - chapter.start),
        );

        return (
          // Each segment as long as its chapter, its name under it.
          <div
            key={chapter.id}
            style={{ flexGrow: chapter.end - chapter.start }}
            className="flex min-w-0 basis-0 flex-col gap-2"
          >
            <div
              ref={(node) => {
                if (node === null) {
                  segments.current.delete(chapter.id);
                } else {
                  segments.current.set(chapter.id, node);
                }
              }}
              className="relative h-1.5 rounded-full bg-border"
            >
              <div
                style={{ width: `${fill * 100}%` }}
                className="absolute inset-y-0 left-0 rounded-full bg-accent"
              />
              {/* A dot where each beat inside the chapter starts: light once
                  passed, darker ahead. */}
              {marks
                .filter((mark) => mark > chapter.start && mark < chapter.end)
                .map((mark) => (
                  <div
                    key={mark}
                    style={{
                      left: `${((mark - chapter.start) / (chapter.end - chapter.start)) * 100}%`,
                    }}
                    className={`absolute top-1/2 size-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full ${time >= mark ? 'bg-bg/95' : 'bg-border-strong'}`}
                  />
                ))}
              {chapter === current && (
                <div
                  style={{ left: `${fill * 100}%` }}
                  className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-sm"
                />
              )}
            </div>
            <span
              className={`truncate text-xs transition-colors ${time >= chapter.end ? 'text-accent' : 'text-fg-muted'}`}
            >
              {chapter.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
