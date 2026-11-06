/**
 * The texture of a triple's bonds: fine dots of ink flowing along a faint
 * hairline, from the subject to the object, as in a particle vortex. Each
 * dot is a little different, in speed, size, darkness and how far off the
 * line it sits, so the line reads as grain rather than a dash pattern.
 *
 * Pure: where each dot is depends only on the film's time. A paused film
 * holds the dots still, and scrubbing moves them with the film.
 */

/**
 * The texture: a faint hairline carries fine dots of ink, each a little
 * different in size, darkness and how far off the line it sits.
 */
const DOT_TEXTURE = {
  /** CSS pixels of line for each dot: the texture's density. */
  pixelsPerDot: 5,
  /** A dot's radius in CSS pixels: the smallest, plus up to `range` more. */
  radius: { min: 0.45, range: 0.6 },
  /** How far a dot may sit off the line, either side, in CSS pixels. */
  maxOffset: 0.8,
  /**
   * How dark a dot is, as a share of the ink: `min` plus up to `range`,
   * along a curve that keeps most faint and makes a few dark.
   */
  alpha: { min: 0.2, range: 0.75, curve: 2.2 },
} as const;

/** One dot, at a moment. */
export interface Dot {
  /** How far along the line, from the subject: 0 to 1. */
  along: number;
  /** How far off the line, across it, in CSS pixels. */
  offset: number;
  /** In CSS pixels. */
  radius: number;
  /** How dark, as a share of the ink. */
  alpha: number;
}

interface Particle {
  start: number;
  /** Scene units a second. */
  speed: number;
  offset: number;
  radius: number;
  alpha: number;
}

export const PIXELS_PER_DOT = DOT_TEXTURE.pixelsPerDot;
/** Dots kept for each line: enough for the longest line on a wide screen. */
const POOL_SIZE = 800;
/** Scene units a second: the slowest dot, and how much faster the fastest is. */
const SPEED = { min: 18, range: 26 } as const;
/**
 * How far, in scene units, a dot travels before it comes round to the
 * subject again: farther than any line is long. A dot is where it is along
 * its line by how far it has travelled from the subject, not by a share of
 * the line, so a line that grows or shrinks as the scene moves keeps its
 * dots where they are: more or fewer at the far end, none sent backward.
 */
const CYCLE_UNITS = 2400;

/** mulberry32: a small seeded generator, so a line's dots are the same each time. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a: a line's id as a seed. */
function hash(text: string): number {
  let value = 0x811c9dc5;
  for (const character of text) {
    value ^= character.codePointAt(0) ?? 0;
    value = Math.imul(value, 0x01000193);
  }

  return value >>> 0;
}

const pools = new Map<string, readonly Particle[]>();

/** A line's dots, made once and kept. */
function poolFor(id: string): readonly Particle[] {
  const cached = pools.get(id);
  if (cached !== undefined) {
    return cached;
  }
  const random = createRandom(hash(id));
  const pool = Array.from({ length: POOL_SIZE }, () => {
    const { radius, maxOffset, alpha } = DOT_TEXTURE;
    const darkness = random();

    return {
      start: random(),
      speed: SPEED.min + random() * SPEED.range,
      // Most sit on the line, a few just off it: grain, not a second line.
      offset: (random() - 0.5) * 2 * maxOffset * random(),
      radius: radius.min + random() * radius.range,
      // Mostly faint, now and then a dark one, as the vortex's are.
      alpha: alpha.min + alpha.range * darkness ** alpha.curve,
    };
  });
  pools.set(id, pool);

  return pool;
}

/**
 * The dots of the line `id` at `time`, in milliseconds of the film. The
 * line is `length` scene units long and has about `count` dots; only the
 * part drawn so far, up to `progress`, has dots. Each dot flows from the
 * subject to the object at its own speed, and comes round again from the
 * subject.
 */
export function dotsAlong(
  id: string,
  length: number,
  count: number,
  time: number,
  progress: number,
): Dot[] {
  if (length <= 0 || progress <= 0) {
    return [];
  }
  // Spread round the whole cycle, as many as put `count` on the line.
  const used = Math.min(
    Math.max(Math.round((count * CYCLE_UNITS) / length), 0),
    POOL_SIZE,
  );
  const drawn = length * Math.min(progress, 1);
  const dots: Dot[] = [];
  for (const particle of poolFor(id).slice(0, used)) {
    const travelled =
      (particle.start * CYCLE_UNITS + (particle.speed * time) / 1000) %
      CYCLE_UNITS;
    if (travelled < drawn) {
      dots.push({
        along: travelled / length,
        offset: particle.offset,
        radius: particle.radius,
        alpha: particle.alpha,
      });
    }
  }

  return dots;
}
