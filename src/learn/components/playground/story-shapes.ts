/**
 * The role shapes as outlines sampled round their centre: the subject's
 * circle, the predicate's triangle, the object's square, and the hexagon of
 * an atom that is both a subject and an object. Sampled the same way, an
 * outline morphs into another by moving each sample, so an atom can change
 * shape as it takes a role. Pure, in units of the atom's size.
 *
 * The one source of the shapes wherever they are drawn on the page's
 * canvases and in its captions: each is its outline grown by a rounding all
 * round, which rounds its corners, and filled once. A fill and a stroke over
 * its edge would paint that edge twice, and a shape fading in would show it
 * as a darker ring.
 */

import type { Role } from './story-model';

/** The roles, in the order the subject, the predicate, the object, then the bridge: an object that is a subject too. */
export const ROLES = [
  'identity',
  'predicate',
  'object',
  'bridge',
] as const satisfies readonly Role[];

/** One colour per role, as sRGB channels from 0 to 255. */
export const ROLE_COLOURS = {
  identity: [122, 134, 255],
  predicate: [47, 224, 139],
  object: [255, 79, 94],
  /** The palette's pink: the identity's blue and the object's red, blended. */
  bridge: [255, 95, 210],
} as const;

/**
 * How far a shape's rounding reaches out from its outline, as a share of
 * its size: it rounds the corners.
 */
const ROUNDING = 0.05;

/** Points round each outline. A multiple of 4, so the square's corners are sampled. */
const SAMPLES = 120;

type Vertex = readonly [x: number, y: number];

/**
 * The triangle, the square and the hexagon, as their corners. Each is
 * centred on the middle of its height, as the circle is, so shapes side by
 * side on a line stand level: a triangle centred on its centroid would
 * stand higher than the rest. The hexagon has its points to the left and
 * the right, where a line comes in and another goes out, and covers the
 * same area as the circle.
 */
const TRIANGLE: readonly Vertex[] = [
  [0, -0.36],
  [0.4, 0.36],
  [-0.4, 0.36],
];
const SQUARE: readonly Vertex[] = [
  [-0.34, -0.34],
  [0.34, -0.34],
  [0.34, 0.34],
  [-0.34, 0.34],
];
const HEXAGON_RADIUS = 0.44;
const HEXAGON: readonly Vertex[] = Array.from({ length: 6 }, (_, index) => {
  const angle = (index * Math.PI) / 3;

  return [Math.cos(angle) * HEXAGON_RADIUS, Math.sin(angle) * HEXAGON_RADIUS];
});
const CIRCLE_RADIUS = 0.4;

/**
 * How wide and how tall a role's shape is, its rounding included, in units
 * of its size. Each is centred on its box.
 */
export function shapeSize(role: Role): { width: number; height: number } {
  const corners = {
    predicate: TRIANGLE,
    object: SQUARE,
    bridge: HEXAGON,
  } as const;
  const reach = (axis: 0 | 1) =>
    role === 'identity'
      ? CIRCLE_RADIUS
      : Math.max(...corners[role].map((vertex) => Math.abs(vertex[axis])));

  return {
    width: 2 * (reach(0) + ROUNDING),
    height: 2 * (reach(1) + ROUNDING),
  };
}

/** The angle of each sample, from the top, clockwise on screen. */
const ANGLES = Array.from(
  { length: SAMPLES },
  (_, index) => -Math.PI / 2 + (index / SAMPLES) * 2 * Math.PI,
);

/** How far from the centre a ray at `angle` meets a convex polygon's edge. */
function polygonRadius(vertices: readonly Vertex[], angle: number): number {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  let nearest = Infinity;
  vertices.forEach(([ax, ay], index) => {
    const [bx, by] = vertices[(index + 1) % vertices.length] ?? [ax, ay];
    const ex = bx - ax;
    const ey = by - ay;
    // Solve centre + s·d = a + u·e for s, along the ray, and u, along the edge.
    const denominator = dx * ey - dy * ex;
    if (Math.abs(denominator) < 1e-9) {
      return;
    }
    const s = (ax * ey - ay * ex) / denominator;
    const u = (ax * dy - ay * dx) / denominator;
    if (s > 0 && u >= -1e-9 && u <= 1 + 1e-9) {
      nearest = Math.min(nearest, s);
    }
  });

  return nearest;
}

/** Each role's outline, as the distance from the centre at each sample. */
const RADII: Record<Role, readonly number[]> = {
  identity: ANGLES.map(() => CIRCLE_RADIUS),
  predicate: ANGLES.map((angle) => polygonRadius(TRIANGLE, angle)),
  object: ANGLES.map((angle) => polygonRadius(SQUARE, angle)),
  bridge: ANGLES.map((angle) => polygonRadius(HEXAGON, angle)),
};

/**
 * The outline `t` of the way from one role's shape to another's, as points
 * round the centre, in units of the atom's size.
 */
export function morphOutline(
  from: Role,
  to: Role,
  t: number,
): Array<readonly [number, number]> {
  const start = RADII[from];
  const end = RADII[to];

  return ANGLES.map((angle, index) => {
    const a = start[index] ?? 0;
    const radius = a + ((end[index] ?? a) - a) * t;

    return [Math.cos(angle) * radius, Math.sin(angle) * radius] as const;
  });
}

/**
 * A point of an outline and the arc the rounding draws round it, `ROUNDING`
 * out, from one angle to another, clockwise on screen.
 */
export interface RoundedCorner {
  x: number;
  y: number;
  from: number;
  to: number;
}

/** A turn smaller than this, either way, is a straight line. */
const STRAIGHT = 1e-9;

/** The angle of the way out of an outline along its edge from `a` to `b`. */
function outwardAngle(
  a: readonly [number, number],
  b: readonly [number, number],
): number {
  // The outline runs clockwise on screen, so out is to the edge's left.
  return Math.atan2(-(b[0] - a[0]), b[1] - a[1]);
}

/**
 * The outline `t` of the way from one role's shape to another's, rounded:
 * each point with the arc round it between its two edges' ways out. Joined
 * in order, the arcs and the straight runs between them are the outline
 * grown by `ROUNDING` all round, in units of the atom's size.
 */
export function roundedOutline(
  from: Role,
  to: Role,
  t: number,
): RoundedCorner[] {
  const points = morphOutline(from, to, t);
  const count = points.length;

  return points.flatMap((point, index) => {
    const before = points[(index - 1 + count) % count] ?? point;
    const after = points[(index + 1) % count] ?? point;
    const start = outwardAngle(before, point);
    const end = outwardAngle(point, after);
    // The turn at this point, the short way round. Points along a straight
    // side are in line, so their turn is nothing give or take rounding.
    const turn = Math.atan2(Math.sin(end - start), Math.cos(end - start));
    const [x, y] = point;
    if (Math.abs(turn) < STRAIGHT) {
      // Straight on: no arc at all, so the outline is the same wherever it
      // is worked out, the server or the browser, whose rounding differs.
      return [{ x, y, from: start, to: start }];
    }
    if (turn > 0) {
      return [{ x, y, from: start, to: start + turn }];
    }

    // Where the outline bends inward the grown edges cross: no arc, only
    // the two ends, and the fill covers the little crossing.
    return [
      { x, y, from: start, to: start },
      { x, y, from: end, to: end },
    ];
  });
}

/**
 * Traces a shape on a canvas path, `size` across, centred on `x` and `y`,
 * `t` of the way from one role's shape to another's: fill it once.
 */
export function traceShape(
  path: CanvasPath,
  x: number,
  y: number,
  size: number,
  from: Role,
  to: Role,
  t: number,
): void {
  const radius = ROUNDING * size;
  for (const corner of roundedOutline(from, to, t)) {
    path.arc(
      x + corner.x * size,
      y + corner.y * size,
      radius,
      corner.from,
      corner.to,
    );
  }
  path.closePath();
}

/**
 * A role's shape as an SVG path, `size` across, centred on `centre`: the
 * same rounded outline the canvases fill, to fill as they do.
 */
export function outlinePath(role: Role, size: number, centre: number): string {
  const radius = ROUNDING * size;
  const at = (corner: RoundedCorner, angle: number): string =>
    `${(centre + corner.x * size + radius * Math.cos(angle)).toFixed(3)} ${(centre + corner.y * size + radius * Math.sin(angle)).toFixed(3)}`;

  return `${roundedOutline(role, role, 1)
    .map(
      (corner, index) =>
        `${index === 0 ? 'M' : 'L'}${at(corner, corner.from)}${
          corner.to === corner.from
            ? ''
            : `A${radius.toFixed(3)} ${radius.toFixed(3)} 0 0 1 ${at(corner, corner.to)}`
        }`,
    )
    .join('')}Z`;
}
