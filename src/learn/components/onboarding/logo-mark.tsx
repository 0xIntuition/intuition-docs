import type { ReactNode } from 'react';

import type { Role } from '@/components/playground/story-model';
import {
  outlinePath,
  ROLES,
  shapeSize,
} from '@/components/playground/story-shapes';

/**
 * The mark's forms: the four shapes in a row, or two by two, as in the top
 * bar and the site's icon.
 */
export type LogoMarkForm = 'row' | 'grid';

/*
 * Read left to right, circle, triangle, square is subject, predicate, object:
 * a triple, the core idea the whole film teaches. The hexagon at the end is
 * the atom that is both a subject and an object, the way triples link into a
 * graph.
 *
 * Two by two, the same order in two lines: the circle over the square reads
 * as an i, for Intuition.
 */

/**
 * Every size in percent of a shape's height, so the mark keeps its
 * proportions at any size: each shape as tall as the rest but the circle, a
 * little taller, and the gaps between them, edge to edge. In the row the
 * triangle tucks into the circle's side. The circle stays on its line's
 * middle, so it reaches a little above and below the mark's box.
 */
const HEIGHTS: Record<Role, number> = {
  identity: 105,
  predicate: 100,
  object: 100,
  bridge: 100,
};
const ROW_GAPS = [-5, 10, 10] as const;
const GRID_GAP = 10;

interface PlacedShape {
  role: Role;
  /** The shape's outline, and where its box sits in the mark. */
  d: string;
  x: number;
  y: number;
}

interface Layout {
  /** The mark's box: as tall as its lines of shapes. */
  width: number;
  height: number;
  shapes: PlacedShape[];
}

/** The box a role's shape is drawn in, for the shape to be as tall as `HEIGHTS` says. */
const boxOf = (role: Role) => HEIGHTS[role] / shapeSize(role).height;

/** How wide a role's shape is, at its height. */
const widthOf = (role: Role) => shapeSize(role).width * boxOf(role);

/** A role's shape, centred on `cx`, `cy`. */
function place(role: Role, cx: number, cy: number): PlacedShape {
  const box = boxOf(role);
  return {
    role,
    d: outlinePath(role, box, box / 2),
    x: cx - box / 2,
    y: cy - box / 2,
  };
}

/** The row: the four shapes on one line, each its gap from the last. */
function rowLayout(): Layout {
  let left = 0;
  const shapes = ROLES.map((role, index) => {
    const shape = place(role, left + widthOf(role) / 2, 50);
    left += widthOf(role) + (ROW_GAPS[index] ?? 0);
    return shape;
  });
  return { width: left, height: 100, shapes };
}

/**
 * The grid: the circle and the triangle above, the square and the hexagon
 * below, each centred in its column and line.
 */
function gridLayout(): Layout {
  const [circle, triangle, square, hexagon] = ROLES;
  const left = Math.max(widthOf(circle), widthOf(square));
  const right = Math.max(widthOf(triangle), widthOf(hexagon));
  const second = left + GRID_GAP + right / 2;
  const below = 100 + GRID_GAP + 50;
  return {
    width: left + GRID_GAP + right,
    height: 200 + GRID_GAP,
    shapes: [
      place(circle, left / 2, 50),
      place(triangle, second, 50),
      place(square, left / 2, below),
      place(hexagon, second, below),
    ],
  };
}

const LAYOUTS: Record<LogoMarkForm, Layout> = {
  row: rowLayout(),
  grid: gridLayout(),
};

export interface LogoMarkProps {
  form: LogoMarkForm;
  /** Its size and colour: give it a height, and it fills with the text colour. */
  className?: string;
}

/** The mark, in `form`, as tall as its `className` makes it. */
export function LogoMark({ form, className = '' }: LogoMarkProps): ReactNode {
  const { width: markWidth, height, shapes } = LAYOUTS[form];
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${markWidth} ${height}`}
      className={`w-auto shrink-0 overflow-visible fill-current ${className}`}
    >
      {shapes.map(({ role, d, x, y }) => (
        <path key={role} d={d} transform={`translate(${x} ${y})`} />
      ))}
    </svg>
  );
}

/**
 * The mark in `form` as an SVG file, centred on a square, in black, or in
 * white on a browser in dark mode, where black would disappear: the site's
 * icon.
 */
export function logoMarkFile(form: LogoMarkForm): string {
  const { width: markWidth, height, shapes } = LAYOUTS[form];
  // Room for the circle, which reaches a little past its line.
  const overflow = (HEIGHTS.identity - 100) / 2;
  const side = Math.max(markWidth, height + 2 * overflow);
  const left = (markWidth - side) / 2;
  const top = (height - side) / 2;
  const paths = shapes
    .map(
      ({ d, x, y }) =>
        `<path d="${d}" transform="translate(${x.toFixed(3)} ${y.toFixed(3)})"/>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${left.toFixed(3)} ${top.toFixed(3)} ${side.toFixed(3)} ${side.toFixed(3)}"><style>path{fill:#000}@media (prefers-color-scheme:dark){path{fill:#fff}}</style>${paths}</svg>\n`;
}
