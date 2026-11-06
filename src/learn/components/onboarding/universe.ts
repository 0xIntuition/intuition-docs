/**
 * The universe behind the front page. Stars come in from the sky and form
 * the Intuition logo, flow round it, turn when it is dragged, part round the
 * moving pointer, and on `part` move to the sides of the film and drift.
 *
 * Copied from wave-universe (`~/Dev/wave/wave-universe`) at commit 04beb00,
 * then cut down to this one page: a white sky, stars in the film's role
 * shapes and colours, the logo where the spiral was, and the parting played
 * by "Play" instead of the scroll. A fix made there is carried over by
 * hand.
 *
 * In order: the logo and the stars, each frame's choreography on the CPU,
 * the pointer's wake, the GPU (one vertex shader places every star, both to
 * draw it and to push it, so the push always agrees with the stars drawn),
 * and the universe that runs them.
 */

import type { Role } from '@/components/playground/story-model';
import {
  ROLE_COLOURS,
  ROLES,
  traceShape,
} from '@/components/playground/story-shapes';
import { LOGO } from '@/lib/logo';

/** What the GPU knows about each star, packed as floats in this order. */
const STAR_ATTRIBUTES = [
  /**
   * Where it sits in its band of the logo: how far along, 0 to 1, how far
   * across, -1 to 1, its depth in world units, and its layer.
   */
  { name: 'aPlace', size: 4 },
  /**
   * Seeds in [0, 1) for where it is in the sky and once parted: x, y and
   * depth, then whether it roams free, behind the film too.
   */
  { name: 'aScatter', size: 4 },
  /**
   * Its size, its role, its band of the logo, or -1 for a star of the sky,
   * which never joins the logo, and its size once the stars have parted.
   */
  { name: 'aLook', size: 4 },
] as const;

/** Floats per star. */
export const STAR_STRIDE = STAR_ATTRIBUTES.reduce(
  (sum, attribute) => sum + attribute.size,
  0,
);
/** Where in a star its size once parted is: `aLook`'s last float. */
export const PARTED_LOOK = STAR_STRIDE - 1;
/** Seconds after the last push at which pushed stars count as home. */
export const SETTLE_SECONDS = 6;
/** Pixels across each role's shape in the texture the stars are drawn from. */
const SHAPE_PIXELS = 64;
/** The wake state's attribute, after the star's own. */
const WAKE_LOCATION = STAR_ATTRIBUTES.length;

/** One frame of the universe, as the timeline works it out for the GPU. */
interface Frame {
  /** Seconds it has run, for the drift; 0 held still. */
  time: number;
  /** 0 as the stars start to come in, 1 once they have formed the mark. */
  intro: number;
  /** How far the stars have parted, 0 to 1, and moved to their places there. */
  scatter: number;
  scatterMove: number;
  /** How big parted stars are, against the logo's. */
  shrink: number;
  /** The mark's turn: pitch, then yaw, in radians. */
  turn: readonly [number, number];
  /** How far each layer of stars has flowed round the mark, 0 to 1. */
  travel: Float32Array;
  /** The view's width and height in world units, centred on the screen. */
  view: readonly [number, number];
  /** The film's left and right edges, in world units. */
  column: readonly [number, number];
  /** The mark's centre and side, in world units. */
  markCenter: readonly [number, number];
  markSize: number;
  /** The pointer's reach, in clip units (2 is the canvas's height). */
  wakeRadius: number;
}

/** The pointer's wake through the stars, as `updateWake` keeps it. */
export interface Wake {
  /** Where the pointer is and was a frame ago, in clip space. */
  pointer: [number, number];
  previous: [number, number];
  /** How far it moved this frame, in clip units. */
  impulse: [number, number];
  /** Bumped whenever pushed stars should drop their state and start from rest. */
  epoch: number;
  /** Seconds left before pushed stars count as home. */
  remaining: number;
  /** Seconds since the last frame. */
  delta: number;
  isTracking: boolean;
}

interface Renderer {
  /** Draws `frame`, first pushing the stars the pointer passed. */
  render(frame: Frame, wake: Wake, pixelRatio: number): void;
  /** Frees what it holds on the GPU. */
  dispose(): void;
}

/** Stars that form the mark, and stars of the sky round it, which never join it. */
const MARK_STARS = 2400;
const SKY_STARS = 380;
/** Each role's share of the stars, in `ROLES` order. */
const ROLE_SHARES = [36, 24, 28, 12] as const;
/** How far a star strays in depth from its band of the logo, in world units. */
const DEPTH_SPREAD = 0.2;
/**
 * The chance a star is one of the big ones: in the sky, and rarely on the
 * logo, where big stars would blur the gap between its bands.
 */
const BIG_CHANCE = { sky: 0.075, logo: 0.02 } as const;
/** The same seed draws the same stars on every visit. */
const SEED = 0x243f6a88;
/**
 * How many times as many big stars there are once the stars have parted:
 * small ones, picked at random, grow to a big one's size as they part.
 */
const PARTED_BIG_TIMES = 2;
/**
 * The seed of the small stars that grow: a draw of its own, so the stars
 * themselves stay the same.
 */
const PARTED_SEED = 0x85a308d3;

/** Seconds the stars take to come in from the sky and form the mark. */
const INTRO_SECONDS = 5.5;
/** How far into the intro the logo has formed, near enough: most stars are home. */
const FORMED_AT = 0.85;
/** Seconds the parting takes to play, before it eases out. */
const PART_SECONDS = 1.6;
/** The share of the parting before the stars start to leave the logo. */
const SCATTER_FROM = 0.2;
/** Parted stars' size, against the logo's. */
const PARTED_SIZE = 0.45;
/** How fast the mark follows a drag, per second. */
const DRAG_FOLLOW = 13;
/** How far the mark swings into view as it forms, in radians. */
const SWING = 0.4;
/** Each layer's flow round the mark, in outlines a second; the GPU keeps their depths. */
const LAYER_SPEEDS = [0.019, 0.017, 0.018] as const;
/** The pointer's push radius, in CSS pixels. */
const WAKE_RADIUS = 180;
/** The view's height in world units. */
const VIEW_HEIGHT = 11;
/** Drag turn per CSS pixel. */
const DRAG_RADIANS_PER_PIXEL = 0.005;
/** The canvas never holds more pixels than this, nor more than two per CSS pixel. */
const MAX_PIXELS = 4e6;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
/** Hermite ease of `value` from `from` to `to`, as GLSL's smoothstep. */
const smoothstep = (from: number, to: number, value: number) => {
  const t = clamp01((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};
/** Perlin's smootherstep: flat at both ends to the second derivative. */
const smootherstep = (from: number, to: number, value: number) => {
  const t = clamp01((value - from) / (to - from));
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** `value` plus `step`, kept within [0, 1). */
const wrap = (value: number, step: number) => (((value + step) % 1) + 1) % 1;
/** Exponential approach at `rate` per second, snapping once within 1e-4 so a settled value rests. */
function damp(current: number, target: number, rate: number, seconds: number) {
  const next = lerp(current, target, 1 - Math.exp(-rate * seconds));
  return Math.abs(target - next) <= 1e-4 ? target : next;
}

/**
 * Mulberry32 from `seed`: uniform numbers in [0, 1), the same for the same
 * seed on every device.
 */
function createRandom(seed: number): () => number {
  let state = Math.trunc(seed) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/** The mean of three uniforms stretched to (-1, 1): bell-shaped round 0. */
const bell = (random: () => number) =>
  (random() + random() + random()) / 1.5 - 1;

/** An index of `weights` for a random `seed`: each as often as its weight. */
function pick(weights: readonly number[], seed: number): number {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let bound = 0;
  for (const [index, weight] of weights.entries()) {
    bound += weight / total;
    if (seed < bound) {
      return index;
    }
  }
  return weights.length - 1;
}

/** Each band of the logo by its area, so they are all as densely starred. */
const BAND_AREAS = LOGO.bands.map(
  (band) => band.radius * band.halfWidth * band.span,
);

/**
 * Every star, `STAR_STRIDE` floats each: the logo's first, spread evenly
 * over its bands, then the sky's. Most are small; a few are big, and once
 * the stars have parted, `PARTED_BIG_TIMES` as many.
 */
export function createStars(): Float32Array {
  const random = createRandom(SEED);
  const count = MARK_STARS + SKY_STARS;
  const data = new Float32Array(count * STAR_STRIDE);
  const bigSizes: number[] = [];
  const small: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const size = random();
    const isBig =
      random() < (i < MARK_STARS ? BIG_CHANCE.logo : BIG_CHANCE.sky);
    const scale = isBig ? 0.9 + 1.2 * size : 0.13 + 0.75 * size ** 3;
    if (isBig) {
      bigSizes.push(2 * scale);
    } else {
      small.push(i);
    }
    data.set(
      [
        random(),
        2 * random() - 1,
        bell(random) * DEPTH_SPREAD,
        Math.floor(random() * LAYER_SPEEDS.length),
        random(),
        random(),
        random(),
        random(),
        2 * scale,
        pick(ROLE_SHARES, random()),
        i < MARK_STARS ? pick(BAND_AREAS, random()) : -1,
        2 * scale,
      ],
      i * STAR_STRIDE,
    );
  }
  // Small stars that grow as they part, each to the size of a big star,
  // so none is bigger than a big one already is.
  const grow = createRandom(PARTED_SEED);
  const growing = Math.min(
    bigSizes.length * (PARTED_BIG_TIMES - 1),
    small.length,
  );
  for (let picked = 0; picked < growing; picked += 1) {
    const swap = picked + Math.floor(grow() * (small.length - picked));
    const star = small[swap] ?? 0;
    small[swap] = small[picked] ?? 0;
    small[picked] = star;
    data[star * STAR_STRIDE + PARTED_LOOK] =
      bigSizes[Math.floor(grow() * bigSizes.length)] ?? 0;
  }
  return data;
}

/** A turn: x pitches, y yaws, in radians. */
interface Turn {
  x: number;
  y: number;
}

/** What a frame is worked out from, measured on the page. */
export interface TimelineInput {
  /** The reader asked for reduced motion: everything holds still. */
  still: boolean;
  /** The mark's turn from dragging. */
  rotation: Readonly<Turn>;
  /** The canvas's size, in CSS pixels. */
  width: number;
  height: number;
  /** The mark's box: its centre from the canvas's top left, and its side, in CSS pixels. */
  mark: { x: number; y: number; size: number };
  /** The film's left and right edges, in CSS pixels from the canvas's left. */
  column: { left: number; right: number };
}

export interface Timeline {
  /** Starts the parting. */
  part(): void;
  /** Moves on `seconds` and works out the frame. */
  update(seconds: number, input: TimelineInput): Frame;
}

/**
 * The universe's choreography: the intro, the parting, the mark's turn and
 * its flow. Started `isParted`, it opens parted, with no intro.
 */
export function createTimeline(isParted: boolean): Timeline {
  let clock = 0;
  let introClock = isParted ? INTRO_SECONDS : 0;
  let isParting = isParted;
  let partClock = isParted ? 1 : 0;
  // Eased values, each chasing its target; parted from the start, they start
  // there.
  let parting = partClock;
  let scatterLinear = partClock;
  let scatterMove = partClock;
  const turn: Turn = { x: 0, y: 0 };
  const travel = new Float32Array(LAYER_SPEEDS.length);

  return {
    part() {
      isParting = true;
    },
    update(seconds, input) {
      const dt = Math.min(0.05, Math.max(0, seconds));
      const { still } = input;
      if (!still) {
        clock += dt;
        introClock = Math.min(INTRO_SECONDS, introClock + dt);
      }
      if (isParting) {
        partClock = still ? 1 : Math.min(1, partClock + dt / PART_SECONDS);
      }
      const intro = still ? 1 : introClock / INTRO_SECONDS;

      // With reduced motion, values jump to their targets; otherwise they
      // ease there.
      const ease = (current: number, target: number, rate: number) =>
        still ? target : damp(current, target, rate, dt);

      parting = ease(parting, partClock, 6);
      const scatterTarget = clamp01(
        (partClock - SCATTER_FROM) / (1 - SCATTER_FROM),
      );
      scatterLinear = ease(scatterLinear, scatterTarget, 6);
      const scatter = smootherstep(0, 1, scatterLinear);
      scatterMove = ease(
        scatterMove,
        smoothstep(0, 1, smootherstep(0, 1, scatterTarget)),
        4,
      );
      // How much of the mark's own motion shows: none once parted.
      const presence = (1 - scatter) * smoothstep(0.55, 1, intro);

      // The mark follows a drag, and swings round into view as it forms.
      turn.x = still ? 0 : damp(turn.x, input.rotation.x, DRAG_FOLLOW, dt);
      turn.y = still ? 0 : damp(turn.y, input.rotation.y, DRAG_FOLLOW, dt);
      const appear = smoothstep(0, 0.1, intro);
      const settle = smoothstep(0.3, 1, intro);
      if (!still) {
        LAYER_SPEEDS.forEach((speed, index) => {
          travel[index] = wrap(travel[index] ?? 0, dt * speed * presence);
        });
      }

      const width = Math.max(1, input.width);
      const height = Math.max(1, input.height);
      const viewHeight = VIEW_HEIGHT;
      const viewWidth = (viewHeight * width) / height;
      const worldX = (pixels: number) => (pixels / width - 0.5) * viewWidth;

      return {
        time: still ? 0 : clock,
        intro,
        scatter,
        scatterMove,
        shrink: lerp(1, PARTED_SIZE, smootherstep(0, 0.5, parting)),
        turn: [
          turn.x - SWING * 1.4 * settle * (1 - settle) * appear,
          turn.y - SWING * (1 - settle) ** 2 * appear,
        ],
        travel,
        view: [viewWidth, viewHeight],
        column: [worldX(input.column.left), worldX(input.column.right)],
        markCenter: [
          worldX(input.mark.x),
          (0.5 - input.mark.y / height) * viewHeight,
        ],
        markSize: (input.mark.size / height) * viewHeight,
        wakeRadius: (2 * WAKE_RADIUS) / height,
      };
    },
  };
}

/** The pointer, for the wake: in clip space, x and y in [-1, 1], y up. */
export interface Pointer {
  isOver: boolean;
  /** A drag turns the mark instead of pushing stars. */
  isDragging: boolean;
  x: number;
  y: number;
}

export function createWake(): Wake {
  return {
    pointer: [0, 0],
    previous: [0, 0],
    impulse: [0, 0],
    epoch: 0,
    remaining: 0,
    delta: 0,
    isTracking: false,
  };
}

/**
 * Moves `wake` on `seconds`. The pointer pushes while it hovers, not while
 * it drags; turned off mid-push, pushed stars drop back home at once.
 */
export function updateWake(
  wake: Wake,
  pointer: Readonly<Pointer>,
  isEnabled: boolean,
  seconds: number,
): void {
  wake.delta = seconds;
  if (!isEnabled && (wake.isTracking || wake.remaining > 0)) {
    wake.epoch += 1;
    wake.remaining = 0;
  }
  const follows = isEnabled && pointer.isOver && !pointer.isDragging;
  // Only a pointer followed last frame too has a path to push along; one
  // arriving starts where it is.
  const [lastX, lastY] = wake.pointer;
  const hasPath = follows && wake.isTracking;
  if (follows) {
    wake.pointer[0] = pointer.x;
    wake.pointer[1] = pointer.y;
  }
  wake.previous[0] = hasPath ? lastX : wake.pointer[0];
  wake.previous[1] = hasPath ? lastY : wake.pointer[1];
  wake.impulse[0] = wake.pointer[0] - wake.previous[0];
  wake.impulse[1] = wake.pointer[1] - wake.previous[1];
  if (wake.impulse[0] ** 2 + wake.impulse[1] ** 2 > 1e-8) {
    wake.remaining = SETTLE_SECONDS;
  }
  wake.isTracking = follows;
  wake.remaining = Math.max(0, wake.remaining - seconds);
}

const UNIFORMS = [
  'uMarkCenter',
  'uMarkSize',
  'uTurn',
  'uTravel',
  'uView',
  'uColumn',
  'uTime',
  'uIntro',
  'uScatter',
  'uScatterMove',
  'uShrink',
  'uPixelRatio',
  'uWakeAge',
  'uWakePointer',
  'uWakePrevious',
  'uWakeImpulse',
  'uWakeRadius',
] as const;

type Uniforms = Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;

/** `value` as a GLSL float literal: GLSL ES rejects `1` where it wants `1.0`. */
const glslFloat = (value: number): string =>
  /[.e]/.test(String(value)) ? String(value) : `${value}.0`;

/** A role colour as a GLSL vec3, 0 to 1. */
const glslColour = (role: Role): string =>
  `vec3(${ROLE_COLOURS[role].map((channel) => glslFloat(channel / 255)).join(', ')})`;

/**
 * The star vertex shader: for drawing, or with `isPush`, for advancing the
 * pointer's push on each star, written out through transform feedback.
 *
 * A star flows round its band of the logo; a star of the sky stays out in
 * it. The intro brings each in from
 * the opening sky. Parted, most stars take a side of the film, and drift.
 */
function vertexSource(isPush: boolean): string {
  return /* glsl */ `#version 300 es
${isPush ? '#define PUSH' : ''}
precision highp float;

${STAR_ATTRIBUTES.map(
  (attribute, index) =>
    `layout(location = ${index}) in vec${attribute.size} ${attribute.name};`,
).join('\n')}
layout(location = ${WAKE_LOCATION}) in vec4 aWake;

const float TAU = 6.28318530718;
const float SETTLE = ${glslFloat(SETTLE_SECONDS)};
const float PARTED_SIZE = ${glslFloat(PARTED_SIZE)};
// How far each layer bows in depth round the mark, either side, and where
// along the outline its bow peaks.
const float DEPTHS[3] = float[3](0.9, -0.9, 0.18);
const float PHASES[3] = float[3](0.0, 1.9, 0.6);
const vec3 COLOURS[4] = vec3[4](${ROLES.map(glslColour).join(', ')});
// The logo's bands, as shares of its size and in radians: radius, half
// width, start, span; and its centre's offset from the middle, y up.
const vec4 BANDS[${LOGO.bands.length}] = vec4[${LOGO.bands.length}](${LOGO.bands
    .map(
      (band) =>
        `vec4(${[
          band.radius / LOGO.size,
          band.halfWidth / LOGO.size,
          (band.start * Math.PI) / 180,
          (band.span * Math.PI) / 180,
        ]
          .map(glslFloat)
          .join(', ')})`,
    )
    .join(', ')});
const vec2 CENTRE = vec2(${glslFloat(LOGO.center[0] / LOGO.size - 0.5)}, ${glslFloat(0.5 - LOGO.center[1] / LOGO.size)});

uniform vec2 uMarkCenter;
uniform float uMarkSize;
uniform vec2 uTurn;
uniform float uTravel[3];
uniform vec2 uView;
uniform vec2 uColumn;
uniform float uTime;
uniform float uIntro;
uniform float uScatter;
uniform float uScatterMove;
uniform float uShrink;
uniform float uPixelRatio;
uniform float uWakeAge;
uniform vec2 uWakePointer;
uniform vec2 uWakePrevious;
uniform vec2 uWakeImpulse;
uniform float uWakeRadius;

#ifdef PUSH
out vec4 vWake;
#else
out vec3 vColour;
out float vOpacity;
flat out int vRole;
#endif

mat2 turn2(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, s, -s, c);
}

mat3 turnX(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}

mat3 turnY(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

// Parted stars each circle slowly round a small loop through their place,
// nearer ones wider and faster. Held still, the time stands at 0 and so do
// the loops.
vec2 wander(vec3 seed) {
  float near = seed.z;
  float direction = fract(seed.y * 7.0) < 0.5 ? 1.0 : -1.0;
  float angle = uTime * (0.35 + 0.4 * near) * direction;
  vec2 arm = (0.04 + 0.09 * near) * vec2(cos(TAU * seed.y), sin(TAU * seed.y));
  return (turn2(angle) * arm - arm) * uScatter;
}

// The intro: each star leaves the opening sky at its own moment and comes in
// along a curve, turning part of the way round the centre as it travels.
vec3 arrive(vec3 home, vec3 sky, float intro, float seed, float pace) {
  if (intro >= 1.0) return home;
  float t = clamp((intro - 0.12 - 0.2 * seed) / (0.55 + 0.12 * pace), 0.0, 1.0);
  float eased = 1.0 - pow(1.0 - t * t * (3.0 - 2.0 * t), 1.5);
  float swirl = 4.0 * eased * (1.0 - eased) * (0.42 + 0.24 * seed);
  return mix(vec3(turn2(swirl) * sky.xy, sky.z), home, eased);
}

// How far the intro has shown a star: it fades in early, then grows.
float shownBy(float intro, float seed) {
  float fade = clamp((intro - 0.02 * seed) / 0.15, 0.0, 1.0);
  float grow = clamp((intro - 0.15) / 0.8, 0.0, 1.0);
  return fade * (2.0 - fade) * (0.25 + 0.75 * grow * grow * (3.0 - 2.0 * grow));
}

// A pushed star's offset (xy) and velocity (zw) \`age\` seconds on: a
// critically damped spring pulling it home, stiffer for lighter stars.
vec4 settle(vec4 state, float mass, float age) {
  float stiffness = 1.6 / sqrt(mass);
  vec2 lead = state.zw + stiffness * state.xy;
  float decay = exp(-stiffness * age);
  return vec4(
    (state.xy + lead * age) * decay,
    (state.zw - stiffness * age * lead) * decay
  );
}

// How much the corners fade a star, on a circle where the farthest corner
// is 1: nothing within 0.47, 18% by 0.72, 78% at the corner.
float cornerFade(vec2 clip) {
  vec2 aspect = vec2(uView.x / uView.y, 1.0);
  float r = length(clip * aspect) / length(aspect);
  return r < 0.72
    ? mix(0.0, 0.18, clamp((r - 0.47) / 0.25, 0.0, 1.0))
    : mix(0.18, 0.78, clamp((r - 0.72) / 0.28, 0.0, 1.0));
}

void main() {
  vec4 seed = aScatter;
  float sky = step(aLook.z, -0.5);
  int layer = int(aPlace.w + 0.5);
  vec2 field = 1.1 * uView;
  vec3 skyPlace = vec3((seed.xy - 0.5) * field, (seed.z - 0.5) * 0.5);

  // On the logo, the star flows round its band, as fast as on any other,
  // and an arc's stars fade out at one end as they come back in at the
  // other; the logo turns, and its near side shows larger.
  vec4 band = BANDS[int(max(aLook.z, 0.0) + 0.5)];
  float lap = fract(aPlace.x + uTravel[layer] * TAU / band.w);
  float angle = band.z + band.w * lap;
  float ends = band.w < TAU - 0.01 ? smoothstep(0.0, 0.08, min(lap, 1.0 - lap)) : 1.0;
  vec3 offset = vec3(
    (CENTRE + vec2(cos(angle), sin(angle)) * (band.x + band.y * aPlace.y)) * uMarkSize,
    DEPTHS[layer] * sin(TAU * lap + PHASES[layer]) + aPlace.z
  );
  offset = turnY(uTurn.y) * turnX(uTurn.x) * offset;
  float onMark = (1.0 - sky) * (1.0 - uScatter);
  float front = clamp(0.5 + 0.42 * offset.z, 0.0, 1.0);

  // Parted, most stars take a side of the film, thinning toward it from the
  // screen's edge; about a quarter roam free, behind it too.
  float side = seed.x < 0.5 ? -1.0 : 1.0;
  float toEdge = 1.0 - pow(1.0 - fract(seed.x * 2.0), 2.0);
  float railX = mix(side < 0.0 ? uColumn.x : uColumn.y, side * 0.5 * field.x, toEdge);
  vec3 parted = vec3(seed.w > 0.75 ? skyPlace.x : railX, skyPlace.yz);
  vec2 loop = wander(seed.xyz);
  parted.x += loop.x;
  // Drifting stars leave at the top and come back in at the bottom.
  parted.y = (fract((parted.y + loop.y) / field.y + 0.5) - 0.5) * field.y;
  // On their way out, stars dip a little, nearer ones further.
  parted.y -= 4.0 * uScatterMove * (1.0 - uScatterMove) * (0.12 + 0.28 * seed.z);

  vec3 place = mix(vec3(uMarkCenter, 0.0) + offset, skyPlace, sky);
  place = mix(place, parted, uScatterMove);
  place = arrive(place, skyPlace, mix(uIntro, 1.0, sky), seed.z, seed.y);
  vec4 clip = vec4(place.xy / (0.5 * uView), 0.0, 1.0);

  // As the stars part and shrink, some small ones grow to a big one's size.
  float opened = clamp((1.0 - uShrink) / (1.0 - PARTED_SIZE), 0.0, 1.0);
  float size = 0.4 + 3.9 * mix(aLook.x, aLook.w, opened);
  // Bigger stars are heavier: pushed less, and slower home.
  float mass = mix(0.6, 2.4, clamp((size - 1.0) / 13.0, 0.0, 1.0));
  vec4 push = uWakeAge < SETTLE ? settle(aWake, mass, uWakeAge) : vec4(0.0);

#ifdef PUSH
  // The pointer's path since the last frame, as a segment: stars near it are
  // kicked along it, each keeping its own momentum, never pulled to it.
  vec2 aspect = vec2(uView.x / uView.y, 1.0);
  vec2 star = (clip.xy + push.xy) * aspect;
  vec2 from = uWakePrevious * aspect;
  vec2 path = (uWakePointer - uWakePrevious) * aspect;
  float reach = max(0.5 * uWakeRadius, 0.025);
  float along = clamp(dot(star - from, path) / max(dot(path, path), 1e-6), 0.0, 1.0);
  float q = length(star - from - path * along) / reach;
  float weight = q < 1.0 ? exp(-4.5 * q * q) : 0.0;
  vec2 kick = uWakeImpulse * aspect;
  kick *= min(1.0, 0.2 / max(length(kick), 1e-5));
  push.zw += kick / aspect * weight * 5.0 / mass;
  push.zw *= min(1.0, 0.55 / max(length(push.zw * aspect), 1e-5));
  vWake = push;
  gl_Position = vec4(0.0);
  gl_PointSize = 1.0;
#else
  float shown = shownBy(uIntro, seed.z);
  // Stars of the sky stay small until the film opens.
  float skyHold = sky * (1.0 - uScatter);
  float grown = mix(sqrt(shown), min(sqrt(shown), 0.45), skyHold);
  float near = mix(1.0, 0.8 + 0.4 * front, onMark);
  // Never smaller than its shape can be told at.
  gl_PointSize = uPixelRatio * max(3.0, size * mix(uShrink, 1.0, skyHold) * near * grown);
  clip.xy += push.xy;
  gl_Position = clip;
  vRole = int(aLook.y + 0.5);
  vColour = COLOURS[vRole];
  // On the logo only, a star twinkles at its own pace, its pace and phase
  // drawn from its seeds, and fades as low as 70% on the logo's far side.
  float twinkle = 0.87 + 0.13 * sin(TAU * fract(seed.x * 13.7 + seed.y * 7.3)
    + uTime * 0.6 * (0.6 + 0.75 * fract(seed.z * 11.1)));
  float fadeBack = 0.7 + 0.3 * front;
  // Otherwise full colour, but for a star coming in, an arc's star at its
  // ends, and the corners.
  vOpacity = mix(1.0, fadeBack * twinkle * ends, onMark) * smoothstep(0.0, 0.2, shown)
    * (1.0 - cornerFade(clip.xy));
#endif
}
`;
}

/** A star: its role's shape, sampled from the shapes texture, in its colour. */
const FRAGMENT_SOURCE = /* glsl */ `#version 300 es
precision highp float;
precision mediump sampler2DArray;
uniform sampler2DArray uShapes;
in vec3 vColour;
in float vOpacity;
flat in int vRole;
out vec4 outColour;
void main() {
  float alpha = texture(uShapes, vec3(gl_PointCoord, float(vRole))).a * vOpacity;
  outColour = vec4(vColour * alpha, alpha);
}
`;

/** Transform feedback needs a fragment stage, though nothing is drawn. */
const DISCARD_SOURCE = /* glsl */ `#version 300 es
precision lowp float;
out vec4 outColour;
void main() { outColour = vec4(0.0); }
`;

function compileShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('WebGL could not create a shader');
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Universe shader failed to compile:\n${log}`);
  }
  return shader;
}

/** A linked program, capturing `feedback` varyings through transform feedback if given. */
function linkProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
  feedback: readonly string[] = [],
): WebGLProgram {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  if (feedback.length > 0) {
    gl.transformFeedbackVaryings(program, feedback, gl.SEPARATE_ATTRIBS);
  }
  gl.linkProgram(program);
  // A linked program keeps its own copy; the shaders can go.
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Universe shader failed to link:\n${log}`);
  }
  return program;
}

function uniformLocations(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
): Uniforms {
  return Object.fromEntries(
    UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)]),
  ) as Uniforms;
}

/**
 * The four role shapes, one layer each, white on transparent: the same
 * rounded outlines the film fills (`story-shapes.ts`), drawn once.
 */
function createShapeTexture(gl: WebGL2RenderingContext): WebGLTexture {
  const canvas = document.createElement('canvas');
  canvas.width = SHAPE_PIXELS;
  canvas.height = SHAPE_PIXELS;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('The universe could not draw its shapes');
  }
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
  gl.texStorage3D(
    gl.TEXTURE_2D_ARRAY,
    Math.log2(SHAPE_PIXELS) + 1,
    gl.RGBA8,
    SHAPE_PIXELS,
    SHAPE_PIXELS,
    ROLES.length,
  );
  context.fillStyle = '#fff';
  ROLES.forEach((role, layer) => {
    context.clearRect(0, 0, SHAPE_PIXELS, SHAPE_PIXELS);
    context.beginPath();
    const middle = SHAPE_PIXELS / 2;
    traceShape(context, middle, middle, SHAPE_PIXELS, role, role, 1);
    context.fill();
    gl.texSubImage3D(
      gl.TEXTURE_2D_ARRAY,
      0,
      0,
      0,
      layer,
      SHAPE_PIXELS,
      SHAPE_PIXELS,
      1,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      canvas,
    );
  });
  // Mipmapped, so a small star does not shimmer as it moves.
  gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
  gl.texParameteri(
    gl.TEXTURE_2D_ARRAY,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR,
  );
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture;
}

/**
 * Sets up `stars`, `STAR_STRIDE` floats each, on `gl`. Throws if a shader
 * fails to build.
 */
function createRenderer(
  gl: WebGL2RenderingContext,
  stars: Float32Array,
): Renderer {
  const count = stars.length / STAR_STRIDE;
  const draw = linkProgram(gl, vertexSource(false), FRAGMENT_SOURCE);
  const push = linkProgram(gl, vertexSource(true), DISCARD_SOURCE, ['vWake']);
  const drawUniforms = uniformLocations(gl, draw);
  const pushUniforms = uniformLocations(gl, push);

  // The shapes stay bound to texture unit 0: nothing else draws here.
  const shapeTexture = createShapeTexture(gl);

  const starBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, stars, gl.STATIC_DRAW);
  // Two wake buffers: one read as an attribute while the other is written.
  const zeros = new Float32Array(count * 4);
  const wakeBuffers = [gl.createBuffer(), gl.createBuffer()] as const;
  for (const buffer of wakeBuffers) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, zeros, gl.DYNAMIC_COPY);
  }
  // One vertex array per wake buffer; both programs share the layout.
  const vertexArrayFor = (wakeBuffer: WebGLBuffer) => {
    const vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer);
    let offset = 0;
    STAR_ATTRIBUTES.forEach((attribute, location) => {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(
        location,
        attribute.size,
        gl.FLOAT,
        false,
        STAR_STRIDE * 4,
        offset * 4,
      );
      offset += attribute.size;
    });
    gl.bindBuffer(gl.ARRAY_BUFFER, wakeBuffer);
    gl.enableVertexAttribArray(WAKE_LOCATION);
    gl.vertexAttribPointer(WAKE_LOCATION, 4, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    return vertexArray;
  };
  const vertexArrays = [
    vertexArrayFor(wakeBuffers[0]),
    vertexArrayFor(wakeBuffers[1]),
  ] as const;
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  const feedback = gl.createTransformFeedback();
  // Premultiplied colour over the transparent canvas.
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let read: 0 | 1 = 0;
  let wakeEpoch = -1;
  let wakeAge = SETTLE_SECONDS;
  let wakeReady = false;

  const setUniforms = (
    u: Uniforms,
    frame: Frame,
    wake: Wake,
    pixelRatio: number,
  ) => {
    gl.uniform2f(u.uMarkCenter, frame.markCenter[0], frame.markCenter[1]);
    gl.uniform1f(u.uMarkSize, frame.markSize);
    gl.uniform2f(u.uTurn, frame.turn[0], frame.turn[1]);
    gl.uniform1fv(u.uTravel, frame.travel);
    gl.uniform2f(u.uView, frame.view[0], frame.view[1]);
    gl.uniform2f(u.uColumn, frame.column[0], frame.column[1]);
    gl.uniform1f(u.uTime, frame.time);
    gl.uniform1f(u.uIntro, frame.intro);
    gl.uniform1f(u.uScatter, frame.scatter);
    gl.uniform1f(u.uScatterMove, frame.scatterMove);
    gl.uniform1f(u.uShrink, frame.shrink);
    gl.uniform1f(u.uPixelRatio, pixelRatio);
    gl.uniform1f(u.uWakeAge, wakeAge);
    gl.uniform2f(u.uWakePointer, wake.pointer[0], wake.pointer[1]);
    gl.uniform2f(u.uWakePrevious, wake.previous[0], wake.previous[1]);
    gl.uniform2f(u.uWakeImpulse, wake.impulse[0], wake.impulse[1]);
    gl.uniform1f(u.uWakeRadius, frame.wakeRadius);
  };

  // Pushed stars keep their state between pushes and coast on in closed
  // form, so the simulation only runs on frames where the pointer moved.
  const advanceWake = (frame: Frame, wake: Wake, pixelRatio: number) => {
    if (wake.epoch !== wakeEpoch || wake.remaining <= 0) {
      wakeReady = false;
      wakeAge = SETTLE_SECONDS;
    }
    wakeEpoch = wake.epoch;
    wakeAge = Math.min(SETTLE_SECONDS, wakeAge + Math.max(0, wake.delta));
    if (wake.impulse[0] ** 2 + wake.impulse[1] ** 2 <= 1e-8) {
      return;
    }
    if (!wakeReady) {
      gl.bindBuffer(gl.ARRAY_BUFFER, wakeBuffers[read]);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, zeros);
      wakeAge = 0;
      wakeReady = true;
    }
    const write = read === 0 ? 1 : 0;
    gl.useProgram(push);
    setUniforms(pushUniforms, frame, wake, pixelRatio);
    gl.bindVertexArray(vertexArrays[read]);
    // A buffer written by transform feedback may not stay bound elsewhere.
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, feedback);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, wakeBuffers[write]);
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, count);
    gl.endTransformFeedback();
    gl.disable(gl.RASTERIZER_DISCARD);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    read = write;
    wakeAge = 0;
  };

  return {
    render(frame, wake, pixelRatio) {
      advanceWake(frame, wake, pixelRatio);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(draw);
      setUniforms(drawUniforms, frame, wake, pixelRatio);
      gl.bindVertexArray(vertexArrays[read]);
      gl.drawArrays(gl.POINTS, 0, count);
      gl.bindVertexArray(null);
    },
    dispose() {
      gl.deleteBuffer(starBuffer);
      for (const buffer of wakeBuffers) {
        gl.deleteBuffer(buffer);
      }
      for (const vertexArray of vertexArrays) {
        gl.deleteVertexArray(vertexArray);
      }
      gl.deleteTransformFeedback(feedback);
      gl.deleteTexture(shapeTexture);
      gl.deleteProgram(draw);
      gl.deleteProgram(push);
    },
  };
}

export interface UniverseOptions {
  /** The element whose box the mark fills. Dragging it turns the mark. */
  markBox: HTMLElement;
  /** The film's card: parted stars keep to its sides. */
  column: HTMLElement;
  /** Starts parted, with no intro: the film is already open. */
  isParted: boolean;
  /** Called once, as the stars finish forming the logo. */
  onFormed: () => void;
}

export interface Universe {
  /** Parts the stars to the sides of the film. */
  part(): void;
  /** Stops it and frees everything it holds. */
  dispose(): void;
}

/**
 * Starts the universe on `canvas`, which covers the viewport, so the
 * pointer's coordinates are the canvas's. It holds still for a reader who
 * asked for reduced motion. Null without WebGL 2.
 */
export function createUniverse(
  canvas: HTMLCanvasElement,
  { markBox, column, isParted, onFormed }: UniverseOptions,
): Universe | null {
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    depth: false,
    stencil: false,
  });
  if (!gl) {
    return null;
  }

  const stars = createStars();
  const timeline = createTimeline(isParted);
  const wake = createWake();
  const pointer: Pointer = { isOver: false, isDragging: false, x: 0, y: 0 };
  const rotation: Turn = { x: 0, y: 0 };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let renderer: Renderer | null = null;
  let isParting = isParted;
  let drag: { id: number; x: number; y: number } | null = null;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let frameRequest = 0;
  let lastFrame: number | null = null;

  // A shader bug must not take the page down: say why, and leave the sky
  // empty.
  const build = () => {
    renderer?.dispose();
    renderer = null;
    try {
      renderer = createRenderer(gl, stars);
    } catch (error) {
      console.error(error);
    }
    return renderer !== null;
  };
  // Nothing to draw with: no universe, as without WebGL 2.
  if (!build()) {
    return null;
  }
  let isFormed = false;

  const step = (seconds: number) => {
    if (!renderer) {
      return;
    }
    const still = reducedMotion.matches;
    const markRect = markBox.getBoundingClientRect();
    const columnRect = column.getBoundingClientRect();
    const frame = timeline.update(seconds, {
      still,
      rotation,
      width,
      height,
      mark: {
        x: markRect.left + markRect.width / 2,
        y: markRect.top + markRect.height / 2,
        size: Math.min(markRect.width, markRect.height),
      },
      column: { left: columnRect.left, right: columnRect.right },
    });
    updateWake(wake, pointer, !still, seconds);
    renderer.render(frame, wake, pixelRatio);
    if (!isFormed && frame.intro >= FORMED_AT) {
      isFormed = true;
      onFormed();
    }
  };

  // Every frame while there is motion; with reduced motion, one frame for
  // each change.
  const tick = (now: number) => {
    frameRequest = 0;
    step(lastFrame === null ? 0 : (now - lastFrame) / 1000);
    lastFrame = now;
    if (reducedMotion.matches) {
      lastFrame = null;
    } else {
      frameRequest = requestAnimationFrame(tick);
    }
  };
  const play = () => {
    frameRequest ||= requestAnimationFrame(tick);
  };

  const resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) {
      return;
    }
    ({ width, height } = entry.contentRect);
    pixelRatio = Math.min(
      2,
      window.devicePixelRatio || 1,
      Math.sqrt(MAX_PIXELS / Math.max(1, width * height)),
    );
    canvas.width = Math.max(1, Math.round(width * pixelRatio));
    canvas.height = Math.max(1, Math.round(height * pixelRatio));
    // Resizing clears the canvas: draw again before it paints.
    step(0);
    play();
  });

  // The pointer is followed on the window: the page over the canvas takes
  // its events, and the stars should still part beneath it.
  const handleHover = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || width <= 0 || height <= 0) {
      return;
    }
    pointer.isOver = true;
    pointer.x = (event.clientX / width) * 2 - 1;
    pointer.y = 1 - (event.clientY / height) * 2;
  };
  const handleLeave = () => {
    pointer.isOver = false;
  };

  const endDrag = () => {
    if (drag && markBox.hasPointerCapture(drag.id)) {
      markBox.releasePointerCapture(drag.id);
    }
    drag = null;
    pointer.isDragging = false;
    delete markBox.dataset.dragging;
  };
  // Dragging the mark's box itself, not what is on it, turns the mark; it
  // stays where it is left.
  const handleDragStart = (event: PointerEvent) => {
    if (
      isParting ||
      drag ||
      !event.isPrimary ||
      event.button !== 0 ||
      event.target !== markBox
    ) {
      return;
    }
    markBox.setPointerCapture(event.pointerId);
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    pointer.isDragging = true;
    markBox.dataset.dragging = 'true';
  };
  const handleDragMove = (event: PointerEvent) => {
    if (drag?.id !== event.pointerId) {
      return;
    }
    rotation.x += (event.clientY - drag.y) * DRAG_RADIANS_PER_PIXEL;
    rotation.y += (event.clientX - drag.x) * DRAG_RADIANS_PER_PIXEL;
    drag.x = event.clientX;
    drag.y = event.clientY;
    play();
  };
  const handleDragEnd = (event: PointerEvent) => {
    if (drag?.id === event.pointerId) {
      endDrag();
    }
  };
  const handleBlur = () => {
    endDrag();
    pointer.isOver = false;
  };

  // A lost context is asked back, which the browser does only if the loss
  // is cancelled, and rebuilt when it comes.
  const handleContextLost = (event: Event) => {
    event.preventDefault();
    renderer = null;
  };
  const handleContextRestored = () => {
    build();
    play();
  };

  resizeObserver.observe(canvas);
  window.addEventListener('pointermove', handleHover, { passive: true });
  window.addEventListener('blur', handleBlur);
  document.documentElement.addEventListener('pointerleave', handleLeave);
  markBox.addEventListener('pointerdown', handleDragStart);
  markBox.addEventListener('pointermove', handleDragMove);
  markBox.addEventListener('pointerup', handleDragEnd);
  markBox.addEventListener('pointercancel', handleDragEnd);
  markBox.addEventListener('lostpointercapture', handleDragEnd);
  reducedMotion.addEventListener('change', play);
  canvas.addEventListener('webglcontextlost', handleContextLost);
  canvas.addEventListener('webglcontextrestored', handleContextRestored);
  play();

  return {
    part() {
      isParting = true;
      endDrag();
      timeline.part();
      play();
    },
    dispose() {
      cancelAnimationFrame(frameRequest);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handleHover);
      window.removeEventListener('blur', handleBlur);
      document.documentElement.removeEventListener('pointerleave', handleLeave);
      markBox.removeEventListener('pointerdown', handleDragStart);
      markBox.removeEventListener('pointermove', handleDragMove);
      markBox.removeEventListener('pointerup', handleDragEnd);
      markBox.removeEventListener('pointercancel', handleDragEnd);
      markBox.removeEventListener('lostpointercapture', handleDragEnd);
      reducedMotion.removeEventListener('change', play);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      endDrag();
      renderer?.dispose();
    },
  };
}
