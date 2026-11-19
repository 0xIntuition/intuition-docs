/**
 * The site's icons, as SVG path data on a square box, so one icon can be
 * drawn as an `<svg>` or on a canvas (`new Path2D(d)`). Saulo supplies
 * them: replace one here and every place that draws it follows.
 */

/** One shape of an icon: its path, filled in the icon's color at this opacity. */
export interface IconPath {
  d: string;
  opacity: number;
  /** What the shape stands for, for a drawer that colors it by that. */
  part?: 'subject' | 'predicate' | 'object';
}

export interface Icon {
  /** Units across and down. */
  size: number;
  /** Drawn in order, the first underneath. */
  paths: readonly IconPath[];
}

/** A person: shoulders, and the head over them, lighter. */
export const USER_ICON: Icon = {
  size: 24,
  paths: [
    {
      d: 'M 12 13 C 14.396 13 16.575 13.694 18.178 14.671 C 18.978 15.161 19.662 15.736 20.156 16.361 C 20.642 16.977 21 17.713 21 18.5 C 21 19.345 20.589 20.011 19.997 20.486 C 19.437 20.936 18.698 21.234 17.913 21.442 C 16.335 21.859 14.229 22 12 22 C 9.771 22 7.665 21.86 6.087 21.442 C 5.302 21.234 4.563 20.936 4.003 20.486 C 3.41 20.01 3 19.345 3 18.5 C 3 17.713 3.358 16.977 3.844 16.361 C 4.338 15.736 5.021 15.161 5.822 14.671 C 7.425 13.694 9.605 13 12 13 Z',
      opacity: 1,
    },
    {
      d: 'M 12 2 C 15.849 2 18.255 6.167 16.33 9.5 C 15.437 11.047 13.786 12 12 12 C 8.151 12 5.745 7.833 7.67 4.5 C 8.563 2.953 10.214 2 12 2 Z',
      opacity: 0.3,
    },
  ],
};

/** Where a person's shoulders end, down `USER_ICON`, in its units: the bottom of what shows. */
export const USER_ICON_FOOT = 22;

/**
 * A triple: its subject, a circle; its object, a square; its predicate, a
 * triangle over them. In one color, the subject lightest.
 */
export const TRIPLE_ICON: Icon = {
  size: 24,
  paths: [
    {
      d: 'M13 10C13 7.23849 15.2385 5 18 5C20.7615 5 23 7.23849 23 10C23 12.7615 20.7615 15 18 15C15.2385 15 13 12.7615 13 10Z',
      opacity: 0.2,
      part: 'subject',
    },
    {
      d: 'M4 15.25C4 14.0077 5.00773 13 6.25 13H10.75C11.9923 13 13 14.0077 13 15.25V19.75C13 20.9923 11.9923 22 10.75 22H6.25C5.00773 22 4 20.9923 4 19.75V15.25Z',
      opacity: 0.4,
      part: 'object',
    },
    {
      d: 'M4.60871 2.79674C5.23026 1.7344 6.77001 1.73442 7.3915 2.79681L10.7788 8.58591C11.4032 9.65419 10.632 11 9.38742 11H2.61276C1.36815 11 0.596755 9.65454 1.22118 8.58627L4.60871 2.79674Z',
      opacity: 1,
      part: 'predicate',
    },
  ],
};

/** A vault's three faces: its lid, the subject, and its stakes against and for it. */
export type VaultFace = 'subject' | 'against' | 'for';

/** A point in an icon's units. */
interface IconPoint {
  x: number;
  y: number;
}

/**
 * A vault's icon: its three faces are what it holds, and lines run
 * through it, each meeting it at the outer corner of its face.
 */
export interface VaultIcon extends Icon {
  paths: readonly (IconPath & { face: VaultFace })[];
  /** Where its shape stands, in the icon's units: its top left, and its size. */
  box: { x: number; y: number; width: number; height: number };
  /**
   * Where a line meets each face, in the icon's units: on to the term,
   * from the lid's top corner; in from the stakes against it, at the left
   * face's bottom corner, and for it, at the right face's.
   */
  ports: Readonly<Record<VaultFace, IconPoint>>;
  /**
   * Its bottom corner, where its two sides meet: where deposits in an
   * atom come in, which has no sides to take.
   */
  base: IconPoint;
}

/**
 * Which of a vault's faces it uses, by what it holds deposits in: its lid
 * is the subject, its left face the stake against and its right face the
 * stake for. An atom, a subject, uses its lid alone; a triple, its two
 * sides alone, for it is no subject: its lid is disabled, as an atom's
 * sides are.
 */
export const VAULT_FACES = {
  atom: ['subject'],
  triple: ['against', 'for'],
} as const satisfies Record<string, readonly VaultFace[]>;

/** What a vault holds deposits in: an atom, or a whole triple. */
export type VaultOf = keyof typeof VAULT_FACES;

/** A color in 0 to 255 channels. */
type Rgb = readonly [number, number, number];

/**
 * Each face's color where it is used: the lid pure black; the stake
 * against orange and the stake for blue, as Intuition draws positions, for
 * neither side is right or wrong. The lines to a triple's vault take its
 * sides' colors too. The orange and the blue are each as light and as
 * strong as the film's role colors (about 0.7 to 0.76 lightness and 0.15
 * to 0.17 chroma in OKLCH), at hues none of them takes: the orange 37
 * degrees from the object's red, the blue 35 from the subject's.
 */
export const VAULT_COLORS = {
  subject: [0, 0, 0],
  against: [255, 145, 46],
  for: [40, 170, 245],
} as const satisfies Record<VaultFace, Rgb>;

/** A face a vault does not use: as if disabled, pure black at 40%. */
const VAULT_UNUSED = { color: [0, 0, 0], opacity: 0.4 } as const;

/**
 * The rule every vault is drawn by, always: a face it uses in its own
 * color, solid (`VAULT_COLORS`); a face it does not, pure black at 40%.
 * So an atom's vault is a black lid over grey sides, and a triple's a
 * grey lid over an orange side against and a blue side for.
 */
export function vaultFace(
  of: VaultOf,
  face: VaultFace,
): { color: Rgb; opacity: number } {
  const uses: readonly VaultFace[] = VAULT_FACES[of];

  return uses.includes(face)
    ? { color: VAULT_COLORS[face], opacity: 1 }
    : VAULT_UNUSED;
}

/**
 * A person who deposits, always in the color of the face of the vault
 * they stake on: on an atom, its lid's pure black; against a triple,
 * orange; for it, blue. Their head stays lighter, at the icon's own 30%
 * (`USER_ICON`).
 */
export function depositorColor(face: VaultFace): Rgb {
  return VAULT_COLORS[face];
}

/**
 * Every vault's size, in CSS pixels where it stands full size (on the
 * plane, at zoom 1): smaller than an atom, under a name or on a line.
 */
export const VAULT_SIZE = 24;

/**
 * A vault: a cube seen from above a corner. Every atom has one, and every
 * triple one: what is deposited in a term goes into its vault. Its own
 * opacities are an atom's (see `vaultFace`), drawn in black.
 */
export const VAULT_ICON: VaultIcon = {
  size: 24,
  paths: [
    {
      d: 'M 20.765 7.982 L 20.787 8.172 L 20.794 8.366 L 20.794 15.634 C 20.794 16.464 20.382 17.239 19.695 17.704 L 19.545 17.799 L 13.25 21.433 L 13.126 21.5 L 13 21.56 L 13 12.57 L 20.765 7.982 Z',
      opacity: VAULT_UNUSED.opacity,
      face: 'for',
    },
    {
      d: 'M 13.25 2.567 L 19.544 6.201 C 19.594 6.231 19.644 6.261 19.692 6.293 L 12 10.838000000000001 L 4.308 6.293 C 4.356 6.261 4.406 6.23 4.456 6.201 L 10.75 2.567 C 11.524000000000001 2.12 12.476 2.12 13.25 2.567 Z',
      opacity: 1,
      face: 'subject',
    },
    {
      d: 'M 3.235 7.982 L 11 12.571 L 11 21.559 C 10.914 21.522 10.831 21.48 10.75 21.433 L 4.456 17.799 C 3.683 17.352 3.206 16.527 3.206 15.634 L 3.206 8.366 C 3.206 8.236 3.216 8.108 3.236 7.982 L 3.235 7.982 Z',
      opacity: VAULT_UNUSED.opacity,
      face: 'against',
    },
  ],
  // The sides' outer edges, the lid's rounded top corner, and the sides'
  // bottom corners.
  box: { x: 3.206, y: 2.232, width: 17.588, height: 19.328 },
  // The middles of the lid's top curve and of the sides' rounded outer
  // bottom corners.
  ports: {
    subject: { x: 12, y: 2.232 },
    against: { x: 3.541, y: 16.884 },
    for: { x: 20.502, y: 16.806 },
  },
  base: { x: 12, y: 21.56 },
};

/**
 * A fee's icon: a line meets it at the edge of its pie, never across it, as
 * a line meets a vault at its corners.
 */
export interface FeeIcon extends Icon {
  /**
   * Where a line meets it, in the icon's units: from below, at the bottom
   * of the pie; on up, at its top, left of the slice; and off to either
   * side, at its edge, level with the icon's middle.
   */
  ports: Readonly<Record<'below' | 'above' | 'right' | 'left', IconPoint>>;
  /** The pie's middle and radius, in the icon's units: a line keeps out of it. */
  pie: IconPoint & { radius: number };
}

/**
 * A fee: a pie with a slice taken out of it, the slice pulled away from the
 * rest, a gap between them. The pie is light, at 30%, and the slice solid,
 * both in `FEE_COLOR`. A sixth of the pie, from straight up to 30 degrees
 * past it, moved out along its middle.
 */
export const FEE_ICON: FeeIcon = {
  size: 24,
  pie: { x: 12, y: 13, radius: 9 },
  ports: {
    below: { x: 12, y: 22 },
    above: { x: 12, y: 4 },
    right: { x: 12 + Math.sqrt(9 ** 2 - 1), y: 12 },
    left: { x: 12 - Math.sqrt(9 ** 2 - 1), y: 12 },
  },
  paths: [
    {
      d: 'M 12 13 L 12 4 A 9 9 0 1 0 19.794 8.5 Z',
      opacity: 0.3,
    },
    {
      d: 'M 13.2 10.922 L 13.2 1.922 A 9 9 0 0 1 20.994 6.422 Z',
      opacity: 1,
    },
  ],
};

/** A fee's color: pure black, as a vault's lid. */
export const FEE_COLOR: Rgb = [0, 0, 0];

/** An app's icon: a line meets it from above, at the top of its bar. */
export interface AppIcon extends Icon {
  /** Where a line meets it from above, in the icon's units: the middle of its bar's top. */
  ports: Readonly<Record<'above', IconPoint>>;
}

/**
 * A builder's app, where a builder's fee goes, whoever built it: a window,
 * its body light, at 30%, under its bar, solid, both in `APP_COLOR`.
 */
export const APP_ICON: AppIcon = {
  size: 24,
  ports: { above: { x: 12, y: 4 } },
  paths: [
    {
      d: 'M22 8V17C22 18.657 20.657 20 19 20H5C3.343 20 2 18.657 2 17V8H22Z',
      opacity: 0.3,
    },
    {
      d: 'M19 4C20.657 4 22 5.343 22 7V8H2V7C2 5.343 3.343 4 5 4H19Z',
      opacity: 1,
    },
  ],
};

/** An app's color: pure black, as a fee. */
export const APP_COLOR: Rgb = [0, 0, 0];

/**
 * A swipe: a hand, pointing up and to the left, and an arrow over its
 * closed fingers, pointing right, the gesture of a drag across, as a hint
 * shows it. The hand light, at 30%, the arrow solid, both in `SWIPE_COLOR`. The
 * hand and the arrow are Saulo's, the hand traced and tilted 20 degrees.
 */
export const SWIPE_ICON: Icon = {
  size: 24,
  paths: [
    {
      d: 'M 5.913 7.523 A 1.742 1.742 0 0 1 9.186 6.332 L 10.821 10.823 A 1.337 1.337 0 0 1 13.125 10.76 A 1.337 1.337 0 0 1 15.637 10.794 A 1.337 1.337 0 0 1 18.191 10.468 L 19.714 14.654 C 20.545 16.938 18.387 19.533 15.419 20.614 C 13.44 21.334 11.803 20.982 10.436 20.186 L 4.905 16.596 A 1.823 1.823 0 0 1 6.199 13.281 L 8.78 15.401 Z',
      opacity: 0.3,
    },
    {
      d: 'M 16 6.413 L 13.6 6.413 C 13.16 6.413 12.8 6.053 12.8 5.613 C 12.8 5.173 13.16 4.813 13.6 4.813 L 16 4.813 L 16 3.381 C 16 3.021 16.432 2.845 16.68 3.101 L 18.912 5.341 C 19.072 5.501 19.064 5.749 18.912 5.909 L 16.68 8.141 C 16.432 8.381 16 8.205 16 7.853 L 16 6.413 Z',
      opacity: 1,
    },
  ],
};

/** A swipe's color: pure black, as a fee. */
export const SWIPE_COLOR: Rgb = [0, 0, 0];

/** An icon with an open ring in it, where whoever draws it sets something. */
export interface RingedIcon extends Icon {
  /** Where its shape stands, in the icon's units: its top left, and its size. */
  box: { x: number; y: number; size: number };
  /** The ring's middle and radius, in the icon's units. */
  ring: { x: number; y: number; radius: number };
}

/** A medal: a rosette round an open ring, the place it stands for set in the ring. */
export const MEDAL_ICON: RingedIcon = {
  size: 31.701,
  paths: [
    {
      d: 'M23.957,19.572l0.32-4.617l3.039-3.489l-3.039-3.49l-0.32-4.617l-4.615-0.32L15.852,0l-3.491,3.039l-4.616,0.32l-0.32,4.618l-3.038,3.49l3.038,3.489l0.32,4.616l4.617,0.319l3.491,3.037l3.49-3.037L23.957,19.572z M15.791,17.826c-3.546,0-6.422-2.875-6.422-6.42s2.875-6.422,6.422-6.422c3.547,0,6.422,2.876,6.422,6.422C22.213,14.952,19.337,17.826,15.791,17.826z',
      opacity: 1,
    },
  ],
  box: { x: 4.387, y: 0, size: 22.929 },
  ring: { x: 15.791, y: 11.406, radius: 6.422 },
};
