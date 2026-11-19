import type { ReactNode } from 'react';

import type { Role } from '@/components/playground/story-model';
import { ROLES } from '@/components/playground/story-shapes';

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
 * The logo mark is drawn by its own rules, not the film's: the same four
 * shapes, in the film's proportions, but sized by eye for a logo, their
 * corners rounded by eye too (`RADII`).
 *
 * Built on a grid of four cells, each a square's size: the lines of cells
 * x apart (`LINE_GAP`), the columns 3x apart (`COLUMN_GAP`), cell to cell,
 * x a tenth of a cell. In its cell, the square is the cell; the circle and the
 * hexagon are centred, the circle a little over it on every side, the
 * hexagon over it left and right; the triangle is centred across, its base
 * on the cell's bottom and its point above it. So all four look equally
 * tall, and the overshoots show the optical correction against the grid.
 * The columns stand well apart, so the mark reads as two i's side by side,
 * a human and an agent, even as small as a favicon.
 */
/**
 * The logo mark's color: Graphite 900 (`--color-graphite-900`), the
 * brand's primary, on light; white on dark. A test holds it to Graphite.
 */
export const LOGO_MARK_COLOR = '#16161e';

/** A cell, and a line of shapes: a square's side. */
const LINE = 100;
/**
 * Each shape's corner radius. One radius would look softer on the
 * triangle's sharp corners and harder on the hexagon's wide ones, so each is
 * set for its angle, for every corner to look equally soft.
 */
const RADII = { predicate: 5, object: 6, bridge: 8 } as const;
const CIRCLE_DIAMETER = 103;
const TRIANGLE_HEIGHT = 104;
/** The triangle's width for its height, sharp corner to sharp corner, as the film's. */
const TRIANGLE_RATIO = 0.8 / 0.72;
/** Between the columns' cells: 3x. */
const COLUMN_GAP = 30;
/** Between the lines' cells: x, a tenth of a cell. */
const LINE_GAP = 10;
/**
 * How far every edge of the mark moves in where it is reversed, white on
 * dark. A light shape on a dark ground looks larger than the same shape
 * dark on light, the irradiation illusion, so the reversed mark is drawn
 * that much lighter: each shape about its own centre, its corners rounded
 * by their radius less it, every gap twice it wider. Then the two read as
 * the same weight.
 */
export const REVERSED_INSET = 1;

export interface PlacedShape {
  role: Role;
  /** The shape's outline, and where it sits in the mark. */
  d: string;
  x: number;
  y: number;
}

/**
 * The mark's measures, for drawing its rules: its square, whose height is
 * the clear space round the mark.
 */
export interface LogoMarkGuides {
  /** The square: its outline, where its top left sits, and its side. */
  square: { d: string; x: number; y: number; size: number };
  /** The four cells the shapes are built on, by their top-left corners, each a square's size. */
  cells: readonly { x: number; y: number }[];
  /**
   * Each rounded shape's corner radius, the centres of its corners' arcs,
   * and a point well inside the shape to label it at.
   */
  radii: readonly {
    role: Role;
    radius: number;
    corners: readonly Point[];
    x: number;
    y: number;
  }[];
}

interface Layout {
  /** The mark's frame: as tall as its lines of shapes. */
  width: number;
  height: number;
  shapes: PlacedShape[];
  guides: LogoMarkGuides;
}

export type Point = readonly [x: number, y: number];

/** A number for a path: three decimals at most. */
const n = (value: number): number => Number(value.toFixed(3));

/**
 * A convex polygon, its corners clockwise on screen, grown by `radius` all
 * round: each side moved out by `radius`, each corner an arc of it.
 */
function roundedPolygon(corners: readonly Point[], radius: number): string {
  const normals = corners.map(([ax, ay], index) => {
    const [bx, by] = corners[(index + 1) % corners.length] ?? [ax, ay];
    const length = Math.hypot(bx - ax, by - ay);
    return [(by - ay) / length, -(bx - ax) / length] as const;
  });
  const ends = corners.map(([x, y], index) => {
    const [inX, inY] = normals.at(index - 1) ?? [0, 0];
    const [outX, outY] = normals[index] ?? [0, 0];
    return {
      in: [x + radius * inX, y + radius * inY],
      out: [x + radius * outX, y + radius * outY],
    };
  });
  const arcs = [...ends.slice(1), ends[0]].map((end) =>
    end === undefined
      ? ''
      : `L${n(end.in[0] ?? 0)} ${n(end.in[1] ?? 0)}A${radius} ${radius} 0 0 1 ${n(end.out[0] ?? 0)} ${n(end.out[1] ?? 0)}`,
  );
  const [start] = ends;
  return `M${n(start?.out[0] ?? 0)} ${n(start?.out[1] ?? 0)}${arcs.join('')}Z`;
}

/** A circle round `cx`, `cy`, as two arcs. */
function circle(cx: number, cy: number, radius: number): string {
  return `M${n(cx - radius)} ${n(cy)}A${n(radius)} ${n(radius)} 0 1 1 ${n(cx + radius)} ${n(cy)}A${n(radius)} ${n(radius)} 0 1 1 ${n(cx - radius)} ${n(cy)}Z`;
}

/**
 * The grid: the circle and the triangle on the first line, the square and
 * the hexagon on the second, each in its cell. The mark's frame is its ink:
 * the triangle's point, its base's corners and the circle's overshoot
 * included. Every edge moves `inset` in, the frame staying put, for the
 * reversed mark.
 */
function gridLayout(inset = 0): Layout {
  const [identity, predicate, object, bridge] = ROLES;
  const squareCore = LINE - 2 * RADII.object;
  const triangleCore = TRIANGLE_HEIGHT - 2 * RADII.predicate;
  const triangleWidth = triangleCore * TRIANGLE_RATIO;
  const hexagonRadius = (LINE - 2 * RADII.bridge) / Math.sqrt(3);
  // How far each column's widest shape reaches past its cell, either side.
  const leftOver = (Math.max(CIRCLE_DIAMETER, LINE) - LINE) / 2;
  const right = Math.max(
    triangleWidth + 2 * RADII.predicate,
    2 * (hexagonRadius + RADII.bridge),
  );
  const rightOver = (Math.max(right, LINE) - LINE) / 2;
  const above = Math.max(TRIANGLE_HEIGHT - LINE, (CIRCLE_DIAMETER - LINE) / 2);
  const first = above;
  const second = above + LINE + LINE_GAP;
  // The cells' centres: the left cell starts where the circle's overshoot ends.
  const leftX = leftOver + LINE / 2;
  const rightX = leftX + LINE + COLUMN_GAP;
  const base = first + LINE - RADII.predicate;
  const middle = second + LINE / 2;
  const half = squareCore / 2;
  const shape = (role: Role, d: string): PlacedShape => ({
    role,
    d,
    x: 0,
    y: 0,
  });
  // Each rounded shape's corners: the centres of the arcs that round them.
  const triangleCorners: Point[] = [
    [rightX, base - triangleCore],
    [rightX + triangleWidth / 2, base],
    [rightX - triangleWidth / 2, base],
  ];
  const squareCorners: Point[] = [
    [leftX - half, middle - half],
    [leftX + half, middle - half],
    [leftX + half, middle + half],
    [leftX - half, middle + half],
  ];
  const hexagonCorners = Array.from({ length: 6 }, (_, index): Point => {
    const angle = (index * Math.PI) / 3;
    return [
      rightX + hexagonRadius * Math.cos(angle),
      middle + hexagonRadius * Math.sin(angle),
    ];
  });
  const square = roundedPolygon(squareCorners, RADII.object);
  return {
    width: rightX + LINE / 2 + rightOver,
    // Nothing on the second line reaches below it: the circle's overshoot
    // below its own line falls in the gap between the lines.
    height: second + LINE,
    guides: {
      square: { d: square, x: leftX - LINE / 2, y: second, size: LINE },
      cells: [first, second].flatMap((y) =>
        [leftX, rightX].map((x) => ({ x: x - LINE / 2, y })),
      ),
      radii: [
        // The triangle's centroid, a third of its height up from its base.
        {
          role: predicate,
          radius: RADII.predicate,
          corners: triangleCorners,
          x: rightX,
          y: first + LINE - TRIANGLE_HEIGHT / 3,
        },
        {
          role: object,
          radius: RADII.object,
          corners: squareCorners,
          x: leftX,
          y: middle,
        },
        {
          role: bridge,
          radius: RADII.bridge,
          corners: hexagonCorners,
          x: rightX,
          y: middle,
        },
      ],
    },
    shapes: [
      shape(
        identity,
        circle(leftX, first + LINE / 2, CIRCLE_DIAMETER / 2 - inset),
      ),
      shape(
        predicate,
        roundedPolygon(triangleCorners, RADII.predicate - inset),
      ),
      shape(object, roundedPolygon(squareCorners, RADII.object - inset)),
      shape(bridge, roundedPolygon(hexagonCorners, RADII.bridge - inset)),
    ],
  };
}

/** The mark: two by two, as in the top bar and the site's icon. */
const LAYOUT = gridLayout();

/**
 * The reversed mark, white on dark, optically corrected for the
 * irradiation illusion: in the same frame, every edge `REVERSED_INSET` in.
 */
const REVERSED_SHAPES: readonly PlacedShape[] =
  gridLayout(REVERSED_INSET).shapes;

/** The mark, laid out, for drawing it somewhere other than the page. */
export type LogoMarkLayout = Readonly<Layout>;

/** The mark, laid out: its frame and its shapes. */
export function logoMarkLayout(): LogoMarkLayout {
  return LAYOUT;
}

/** The reversed mark's shapes, for white on dark, in `logoMarkLayout()`'s frame. */
export function reversedMarkShapes(): readonly PlacedShape[] {
  return REVERSED_SHAPES;
}

export interface LogoMarkProps {
  /** Its size and color: give it a height, and it fills with the text color. */
  className?: string;
}

/** The mark, as tall as its `className` makes it. */
export function LogoMark({ className = '' }: LogoMarkProps): ReactNode {
  const { width: markWidth, height, shapes } = LAYOUT;
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
 * The mark as an SVG file, centred on a square: the site's icon. In
 * Graphite 900; on a browser in dark mode, where Graphite 900 would
 * disappear, the reversed mark, optically corrected for the irradiation
 * illusion.
 */
export function logoMarkFile(): string {
  const { width: markWidth, height, shapes } = logoMarkLayout();
  const side = Math.max(markWidth, height);
  const left = (markWidth - side) / 2;
  const top = (height - side) / 2;
  const paths = (outlines: readonly PlacedShape[]) =>
    outlines
      .map(
        ({ d, x, y }) =>
          `<path d="${d}" transform="translate(${x.toFixed(3)} ${y.toFixed(3)})"/>`,
      )
      .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${left.toFixed(3)} ${top.toFixed(3)} ${side.toFixed(3)} ${side.toFixed(3)}"><style>.reversed{display:none}@media (prefers-color-scheme:dark){.mark{display:none}.reversed{display:inline}}</style><g class="mark" fill="${LOGO_MARK_COLOR}">${paths(shapes)}</g><g class="reversed" fill="#fff">${paths(REVERSED_SHAPES)}</g></svg>\n`;
}
