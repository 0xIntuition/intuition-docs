/**
 * The film's last chapter, laid out. The graph comes closer, in the middle;
 * Elon Musk comes out of it to one side, his card under him, as it moves to
 * the other; then it shrinks to a sketch, with an encyclopedia page about
 * him under it. The data of his triples on the graph, then of the page's
 * sections, flows into the card. Pure: on the canvas, in CSS pixels, but for
 * the page, in its own units, a desktop page 1300 wide; the scene draws it
 * (`story-scene.tsx`).
 *
 * The page keeps a desktop encyclopedia's shape: a header with the menu and
 * the logo, search and account links, the contents down the left, the
 * article and its infobox. Its words are skeleton lines,
 * but for the name and the two facts that flow.
 */

import type { AtomId } from './story-model';

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A globe where it shows on the canvas: its middle, and its outline's radius. */
export interface Circle extends Point {
  reach: number;
}

/**
 * What the graph says about him, field by field, in the order it flows: each
 * from where its triple's data leaves the graph, its object, or, where that
 * is a whole triple, the predicate its line meets.
 */
export const GRAPH_FIELDS = [
  { id: 'founderOf', label: 'Founder of', value: 'SpaceX', atom: 'spacex' },
  {
    id: 'believes',
    label: 'Believes',
    value: 'SpaceX will be worth more',
    atom: 'willBeWorth',
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  value: string;
  atom: AtomId;
}>;

/**
 * Where on the page a field's data is: a line of one of the article's
 * paragraphs, or a row of its infobox.
 */
export type PageSection = { paragraph: number; line: number } | { row: number };

/**
 * What the page adds, field by field, in the order it flows: what he does,
 * from the article's first line; two facts from its infobox; then more from
 * the article, where he was born and grew up, studied, and started out. The
 * article keeps its skeleton lines: only the card spells the data out.
 */
export const PAGE_FIELDS = [
  {
    id: 'about',
    label: 'About',
    value: 'Entrepreneur',
    from: { paragraph: 0, line: 0 },
  },
  { id: 'born', label: 'Born', value: '28 June 1971', from: { row: 0 } },
  {
    id: 'knownFor',
    label: 'Known for',
    value: 'SpaceX, Tesla, xAI',
    from: { row: 1 },
  },
  {
    id: 'birthplace',
    label: 'Birthplace',
    value: 'Pretoria, South Africa',
    from: { paragraph: 1, line: 0 },
  },
  {
    id: 'citizenship',
    label: 'Citizenship',
    value: 'South Africa, Canada, US',
    from: { paragraph: 1, line: 3 },
  },
  {
    id: 'education',
    label: 'Education',
    value: 'University of Pennsylvania',
    from: { paragraph: 1, line: 6 },
  },
  {
    id: 'cofounded',
    label: 'Co-founded',
    value: 'Zip2, PayPal',
    from: { paragraph: 2, line: 1 },
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  value: string;
  from: PageSection;
}>;

export type PageFieldId = (typeof PAGE_FIELDS)[number]['id'];

/**
 * The page, in its own units: a desktop page 1300 wide, cropped under its
 * infobox, so its first three paragraphs show.
 */
export const WIKI = {
  width: 1300,
  height: 780,
  header: {
    y: 31,
    menu: { x: 55, width: 19 },
    globe: { x: 121, radius: 24 },
    wordmark: { x: 155, y: 25, size: 23 },
    tagline: { x: 156, y: 45, size: 12 },
  },
  search: { x: 333, y: 16, width: 478, height: 31 },
  /** The account link on the right of the top bar, by its right end and width. */
  account: { right: 1207, y: 31, width: 96 },
  more: { x: 1238, y: 31 },
  /** The contents, down the left: its heading's top, and each item's width. */
  contents: {
    x: 55,
    y: 160,
    gap: 26.5,
    widths: [62, 40, 162, 146, 76, 136, 150, 72, 150, 66, 44, 94, 104, 100],
  },
  title: { x: 334, y: 112, size: 30 },
  /** The rule under the title, the tabs under it, and the line under them. */
  rule: { y: 131, right: 1252 },
  tabs: { y: 153 },
  from: { y: 185, width: 210 },
  body: {
    x: 334,
    width: 636,
    line: 21.5,
    bar: 9,
    /** Each paragraph's top, and how many lines it runs to. */
    paragraphs: [
      { y: 243, lines: 8 },
      { y: 421, lines: 8 },
      { y: 599, lines: 5 },
    ],
  },
  infobox: {
    x: 988,
    y: 247,
    width: 264,
    titleHeight: 34,
    image: { height: 186 },
    row: 30,
    /** Skeleton rows under the facts. */
    more: 5,
    size: 16,
  },
} as const;

/** Where a field's data leaves the page, in the page's units. */
export interface Source extends Point {
  id: PageFieldId;
}

/** Each infobox row's middle, in the page's units: the facts first, then the rest. */
export function infoboxRowY(index: number): number {
  const { infobox } = WIKI;

  return (
    infobox.y +
    infobox.titleHeight +
    infobox.image.height +
    48 +
    infobox.row * index +
    infobox.row / 2
  );
}

/** The top of line `line` of paragraph `paragraph`, in the page's units. */
export function bodyLineY(paragraph: number, line: number): number {
  return (WIKI.body.paragraphs[paragraph]?.y ?? 0) + line * WIKI.body.line;
}

/**
 * Where each field's data leaves the page, in the page's units, in the
 * order the fields flow: a line's start, or a row's.
 */
export const SOURCES: readonly Source[] = PAGE_FIELDS.map(({ id, from }) =>
  'row' in from
    ? { id, x: WIKI.infobox.x + 8, y: infoboxRowY(from.row) }
    : {
        id,
        x: WIKI.body.x,
        y: bodyLineY(from.paragraph, from.line) + WIKI.body.bar / 2,
      },
);

/**
 * The card the data builds, in CSS pixels: its name, as tall as his name's
 * badge, then its rows, as tall as `row` where the canvas has room, and no
 * shorter than `minRow`.
 */
export const CARD = {
  width: 280,
  narrowWidth: 204,
  padding: 12,
  row: 22,
  minRow: 15,
  radius: 12,
  fontSize: 12,
} as const;

/** How many rows the card ends with: the graph's, then the page's. */
export const CARD_ROWS = GRAPH_FIELDS.length + PAGE_FIELDS.length;

/**
 * How far in from the card's edges, and from each rule, its text keeps: the
 * card's padding, the same all round.
 */
function textGap(height: number): number {
  return Math.max((height - CARD.fontSize) / 2, 0);
}

/**
 * The room to add between a rule, or the card's edge, and the nearest row,
 * for rows `row` tall: what the row leaves round its text, made up to the
 * card's padding.
 */
export function cardInset(row: number): number {
  return Math.max(CARD.padding - textGap(row), 0);
}

/** How tall the card's name is, `header` tall as a badge, padded as the card is. */
export function cardTitle(header: number): number {
  return header + 2 * Math.max(CARD.padding - textGap(header), 0);
}

/**
 * The room the rule between the graph's rows and the page's takes, for rows
 * `row` tall: the card's padding on each side of it.
 */
export function separatorRoom(row: number): number {
  return 2 * cardInset(row);
}

/**
 * How tall the card is under a name `header` tall, with `rows` rows open,
 * each `row` tall: its name, then the rows, padded as the card is under the
 * name's rule, round the page's rule, and at the bottom.
 */
export function cardHeight(header: number, rows: number, row: number): number {
  const isOpen = Math.min(rows, 1);
  const pageOpened = Math.min(Math.max(rows - GRAPH_FIELDS.length, 0), 1);

  return (
    cardTitle(header) +
    2 * cardInset(row) * isOpen +
    rows * row +
    separatorRoom(row) * pageOpened
  );
}

/** How large Elon Musk is once out of the graph, as on the plane. */
const ATOM_SIZE = { wide: 34, narrow: 26 } as const;

/** How far everything keeps from the canvas's edges, and from each other. */
const MARGIN = { wide: 16, narrow: 12 } as const;
const GAP = 14;

/** Side by side, between his name and the graph under him: twice the gap. */
const COLUMN_GAP = GAP * 2;

/**
 * How near the graph, before it is a sketch, comes to the canvas's top and
 * bottom, side by side: nearer than the rest, for it to keep its size under
 * him, as the film's card has room of its own around the canvas.
 */
const EDGE = 6;

/** The sketch of the graph: its radius, as a share of the canvas's height. */
const SMALL_SHARE = 0.1;

/**
 * The least of the page that shows when it is cropped further, on a narrow
 * canvas, in its own units, as a browser shows the top of a page: down past
 * the last section the data leaves.
 */
const MIN_SHOWN = Math.max(...SOURCES.map(({ y }) => y)) + 40;

/** On a narrow canvas, the share of its height the card may take, with what is above it. */
const STACKED_CARD_SHARE = 0.55;

export interface EnrichmentLayout {
  /**
   * Side by side on a wide canvas, the card on one side; on a narrow one,
   * the card between him and the graph above, and the page under it.
   */
  isStacked: boolean;
  /**
   * The room for the graph moved aside for Elon Musk, as he comes out of
   * it: as large as it may be there. It keeps the size it had where it
   * fits, its top where the room's is (see `globeAt`).
   */
  aside: Circle;
  /** The graph as a sketch, above the page. */
  small: Circle;
  /** Where Elon Musk stands once out of the graph, and how large. */
  atom: Point;
  atomSize: number;
  /** Where the card stands, its top's middle; how wide it is, and how tall its rows. */
  card: Point;
  cardWidth: number;
  row: number;
  /**
   * Where the page stands, and CSS pixels to one of its units. On a narrow
   * canvas only its top may show.
   */
  page: Box;
  scale: number;
  /** Where each of the page's fields leaves it, on the canvas. */
  sources: readonly Source[];
}

/**
 * The chapter laid out on a `width` × `height` canvas, his name's badge
 * `badge` tall and its gap under him. Wide, the card stands in the left
 * part, and in the right, one under another, Elon Musk, the graph and the
 * page. Narrow, he and the graph's sketch stand side by side at the top,
 * the card under them, and the page under it; the graph, while it is not
 * yet a sketch, stands under the card.
 */
export function enrichmentLayout(
  width: number,
  height: number,
  badge: { height: number; gap: number },
): EnrichmentLayout {
  const isStacked = width < height * 1.15;
  const size = isStacked ? 'narrow' : 'wide';
  const margin = MARGIN[size];
  const atomSize = ATOM_SIZE[size];
  const cardWidth = isStacked ? CARD.narrowWidth : CARD.width;
  const ratio = WIKI.height / WIKI.width;
  // He, with his name under him.
  const named = atomSize + badge.gap + badge.height;

  if (isStacked) {
    // At the top, he and the sketch side by side, the sketch as tall as he
    // is with his name.
    const smallReach = named / 2;
    const top = named;
    const atom = {
      x: width * 0.3,
      y: margin + (top - named) / 2 + atomSize / 2,
    };
    // Under them, the card, its rows as tall as its share of the canvas
    // allows.
    const card = { x: width / 2, y: margin + top + GAP };
    const row = rowFor(height * STACKED_CARD_SHARE - card.y, badge.height);
    // The graph, before it is a sketch, under the card with the graph's
    // rows, as large as fits.
    const asideTop =
      card.y + cardHeight(badge.height, GRAPH_FIELDS.length, row) + GAP;
    const asideReach = Math.min(
      width / 2 - margin,
      (height - margin - asideTop) / 2,
    );
    // The page under the full card, as wide as the canvas, cropped to fit.
    const pageTop = card.y + cardHeight(badge.height, CARD_ROWS, row) + GAP;
    const room = height - margin - pageTop;
    const pageWidth = Math.min(
      width - margin * 2,
      (room / MIN_SHOWN) * WIKI.width,
    );
    const page: Box = {
      x: (width - pageWidth) / 2,
      y: pageTop,
      width: pageWidth,
      height: Math.min(pageWidth * ratio, room),
    };

    return {
      isStacked,
      aside: { x: width / 2, y: asideTop + asideReach, reach: asideReach },
      small: { x: width * 0.7, y: margin + top / 2, reach: smallReach },
      atom,
      atomSize,
      card,
      cardWidth,
      row,
      page,
      scale: pageWidth / WIKI.width,
      sources: placeSources(page, pageWidth / WIKI.width),
    };
  }

  // The card in the left part, in the middle up and down, with all its rows.
  const row = rowFor(height - margin * 2, badge.height);
  const card = {
    x: Math.max(margin + cardWidth / 2, width * 0.2),
    y: (height - cardHeight(badge.height, CARD_ROWS, row)) / 2,
  };
  // In the right part, one under another: he, at the very top; the page,
  // as large as the room under him, the sketch and the gaps allows, and as
  // low as that room; and the sketch in the middle between the two, the
  // same gap above it and under it.
  const left = Math.max(width * 0.4, card.x + cardWidth / 2 + GAP * 2);
  const right = width - margin;
  const middle = (left + right) / 2;
  const smallReach = height * SMALL_SHARE;
  const above = named + GAP + smallReach * 2 + GAP;
  const pageWidth = Math.min(
    right - left,
    (height - margin * 2 - above) / ratio,
  );
  const pageHeight = pageWidth * ratio;
  const page: Box = {
    x: middle - pageWidth / 2,
    y: (height + above - pageHeight) / 2,
    width: pageWidth,
    height: pageHeight,
  };
  const small: Circle = {
    x: middle,
    y: (named + page.y) / 2,
    reach: smallReach,
  };
  // The graph, before it is a sketch, under him, twice the gap under him,
  // as large as the room between the edges allows.
  const asideTop = named + COLUMN_GAP;
  const asideReach = Math.min(
    (right - left) / 2,
    (height - EDGE * 2 - asideTop) / 2,
  );

  return {
    isStacked,
    aside: { x: middle, y: asideTop + asideReach, reach: asideReach },
    small,
    atom: { x: middle, y: atomSize / 2 },
    atomSize,
    card,
    cardWidth,
    row,
    page,
    scale: pageWidth / WIKI.width,
    sources: placeSources(page, pageWidth / WIKI.width),
  };
}

/**
 * How tall the card's rows are, for all of them and its name, `header`
 * tall, to fit in `room`: as tall as they can be, and no shorter than the
 * least.
 */
function rowFor(room: number, header: number): number {
  // The card grows by a row for each of its rows, less the padding round
  // its two rules and its ends, which shrinks as the rows grow: two rows'
  // worth fewer, from its height with rows of nothing.
  const rows = (room - cardHeight(header, CARD_ROWS, 0)) / (CARD_ROWS - 2);

  return Math.min(Math.max(rows, CARD.minRow), CARD.row);
}

/** Where each of the page's fields leaves it, on the canvas. */
function placeSources(page: Box, scale: number): Source[] {
  return SOURCES.map(({ id, x, y }) => ({
    id,
    x: page.x + x * scale,
    y: page.y + y * scale,
  }));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpCircle(a: Circle, b: Circle, t: number): Circle {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    reach: lerp(a.reach, b.reach, t),
  };
}

/**
 * Where the graph shows, as the chapter moves it: from `start`, where the
 * two perspectives became one, aside, the size it was where it fits; then
 * small. It stays there as the film ends, and fades.
 */
export function globeAt(
  layout: EnrichmentLayout,
  start: Circle,
  parts: { out: number; small: number },
): Circle {
  const room = layout.aside;
  const reach = Math.min(start.reach, room.reach);
  const aside = { x: room.x, y: room.y - room.reach + reach, reach };
  const moved = lerpCircle(start, aside, parts.out);

  return lerpCircle(moved, layout.small, parts.small);
}

/**
 * As the film ends, each a share of the chapter's closing, 0 to 1: the
 * lines go back one by one, the last that came first, each row closing as
 * its line leaves it, and the card last, as the line that brought his name
 * leaves it; and the page fades once its lines have gone. Everything stays
 * where it is.
 */
export const CLOSING = {
  lines: [0, 0.8],
  page: [0.57, 0.75],
} as const satisfies Record<string, readonly [number, number]>;

/** How far `amount` of the closing is into its `window`, 0 to 1. */
export function closingAt(
  amount: number,
  window: readonly [number, number],
): number {
  const [start, end] = window;

  return Math.min(Math.max((amount - start) / (end - start), 0), 1);
}

/**
 * How far line `index` of `count` has gone back, 0 to 1, when `amount` of
 * the closing's lines have: as they came, reversed, the last first.
 */
export function lineBack(amount: number, index: number, count: number): number {
  return fieldFlow(amount, count - 1 - index, count);
}

/**
 * A line from `from` to `to`, sampled as points: the way data travels to the
 * card. Side by side, a curve leaving and arriving level; stacked, it bows
 * out to the left of both, no nearer the canvas's edge than `edge`.
 */
export function flowPath(
  from: Point,
  to: Point,
  isStacked: boolean,
  edge = 6,
  samples = 32,
): Point[] {
  const left = Math.max(edge, Math.min(from.x, to.x) - 36);
  const c1 = isStacked
    ? { x: left, y: from.y }
    : { x: (from.x + to.x) / 2, y: from.y };
  const c2 = isStacked
    ? { x: left, y: to.y }
    : { x: (from.x + to.x) / 2, y: to.y };

  return Array.from({ length: samples + 1 }, (_, index) => {
    const t = index / samples;
    const u = 1 - t;

    return {
      x:
        u ** 3 * from.x +
        3 * u * u * t * c1.x +
        3 * u * t * t * c2.x +
        t ** 3 * to.x,
      y:
        u ** 3 * from.y +
        3 * u * u * t * c1.y +
        3 * u * t * t * c2.y +
        t ** 3 * to.y,
    };
  });
}

/**
 * How far field `index` of `count` has flowed, 0 to 1, when `amount` of
 * their data has: one after another, each overlapping the last a little.
 */
export function fieldFlow(
  amount: number,
  index: number,
  count: number,
): number {
  const span = 1 / (count * 0.7 + 0.3);
  const t = Math.min(Math.max((amount - index * span * 0.7) / span, 0), 1);

  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}
