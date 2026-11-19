/**
 * The plane: a close-up of one claim, opened in front of the cloud, where a
 * triple can hold another triple. It is a branch off the graph: its atoms
 * are drawn as the cloud draws them, a shape with its name under it, and
 * each triple is a line from its subject through its predicate to its
 * object, as on the cloud, only straight. Each triple inside the claim
 * stands in a rounded frame, tinted the role it fills, and a line that
 * reaches it ends at the frame: the whole triple is the object, not the
 * first atom in it. A triple inside a triple is a frame inside a frame.
 *
 * Part of a claim can still be plain words: a triple's words in one line in
 * its frame, then broken into their parts, with frames showing how they
 * divide, then made atoms. A claim always grows in the same order: what is
 * there moves, atoms arrive, and only then do the lines grow between them.
 *
 * Pure, so it is tested without a canvas: the canvas passes in how wide a
 * piece of text is.
 */

import { VAULT_ICON, VAULT_SIZE, type VaultOf } from '@/lib/icons';

import type { AtomId, Role } from './story-model';

/**
 * What fills a place in a claim: an atom, or a whole triple. A plane can
 * also hold a list, on its own.
 */
export type PlaneTerm =
  | { atom: AtomId }
  | { triple: PlaneTriple }
  | { list: PlaneList };

/**
 * Triples that share a predicate and an object: a list. Its members, the
 * triples' subjects, stand in a column, the one predicate across from them
 * and the one object beyond it. Its lines are the triples' own, which come
 * out of the cloud with their atoms: the plane adds only their weights.
 */
export interface PlaneList {
  id: string;
  /** Each member, and its triple's weight, in the order they joined. */
  members: readonly { atom: AtomId; weight: number }[];
  predicate: AtomId;
  object: AtomId;
  /** Whether each member's line shows its triple's weight. */
  isWeighed?: boolean;
  /** Whether the members stand in order of weight, the heaviest on top. */
  isRanked?: boolean;
}

/** A triple on the plane. Its subject and object can be triples too. */
export interface PlaneTriple {
  /** Names its frame, so the frame can be followed as the claim grows. */
  id: string;
  subject: PlaneTerm;
  predicate: AtomId;
  object: PlaneTerm;
}

/**
 * A claim of its own about one of the claim's atoms, its subject: it rises
 * from that atom in a column, its predicate above it and its object on top.
 */
export interface PlaneBranch {
  id: string;
  /** An atom of the claim, or a whole triple of it, from the top of its frame. */
  subject: PlaneEnd;
  predicate: AtomId;
  object: AtomId;
}

/**
 * A triple's vault, and the people with a position in it. Lines hang from
 * the middle of the bottom of its frame: down to the vault, then apart, one
 * side against the triple and one for it, then to each person.
 */
export interface PlaneVaults {
  /** The triple whose vaults they are: its frame. */
  frame: string;
  /** Each person's position, left to right: against the triple on the left. */
  against: readonly number[];
  /** And for it, on the right. */
  for: readonly number[];
  /** Whether each person's line shows their position. */
  isWeighed?: boolean;
  /** Whether each side shows all the positions on it, where its lines run together. */
  isTotalled?: boolean;
}

/** An amount, and what it is, in words after it: "2.64 fees". */
export interface PlaneAmount {
  value: number;
  label?: string;
}

/**
 * The deposit of the person left alone with the triple, followed up their
 * line: what they sent, on it already; the builder's fee, taken first,
 * halfway up; what goes on to the vault; the fees, taken where the line
 * turns for the vault; and the position the rest buys there.
 */
export interface PlaneDeposit {
  sent: PlaneAmount;
  builderFee: PlaneAmount;
  deposit: PlaneAmount;
  fees: PlaneAmount;
  position: PlaneAmount;
  /** Then its fees, shared out: all else of it goes, and they go on from there. */
  shared?: PlaneShared;
}

/**
 * A deposit's fees, shared out: to the protocol; into the triple's own
 * vault; and into the vault of each of its three terms, and no further.
 */
export interface PlaneShared {
  protocol: PlaneAmount;
  entry: number;
  perTerm: number;
}

/** An amount as the plane says it, to the hundredth: "96.86", "2,000". */
export function amountOf(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

/** Whose perspective a claim is seen through: the people to choose from, and the one chosen. */
export interface PlanePerspective {
  options: readonly string[];
  chosen: number;
}

/** A claim on the plane, as a beat leaves it. */
export interface PlaneClaim {
  term: PlaneTerm;
  /** Claims of their own, rising from its atoms or its frames. */
  branches?: readonly PlaneBranch[];
  /** The whole claim in a frame too, tinted this role. */
  frame?: Role;
  /**
   * That frame gone, but not the room it took: the claim keeps its size,
   * and nothing in it moves.
   */
  isFrameHidden?: boolean;
  /** The vaults of one of its triples, hanging below it. */
  vaults?: PlaneVaults;
  /**
   * One of the people with a position in its vaults, left alone with the
   * triple whose vault it is: the person, their line up to the vault, the
   * vault and its line on to the triple, and the triple; all else on the
   * plane gone. The person stays where they stood on the screen, however
   * the plane moves.
   */
  alone?: { side: VaultSide; index: number };
  /** The deposit of the person left alone, followed up their line (see `PlaneDeposit`). */
  deposit?: PlaneDeposit;
  /**
   * Atoms set back, and the lines from them: there, but not what the claim
   * is about now.
   */
  faded?: readonly AtomId[];
  /**
   * Whose perspective it is seen through: a menu above it, which shows the
   * one chosen, and opens to choose another.
   */
  perspective?: PlanePerspective;
  /**
   * Its atoms still shown as words: broken apart where the atoms will
   * stand, the claim's frames round them.
   */
  spelled?: readonly AtomId[];
  /**
   * Triples whose words are not yet broken apart: one line in their frame,
   * with no frame yet inside it.
   */
  folded?: readonly string[];
}

/** Sizes on the plane, in its own units: CSS pixels at zoom 1. */
export const PLANE = {
  /** An atom's shape, as the cloud sizes one near its front. */
  atomSize: 34,
  /** A name's badge, under its shape, as the cloud sets it. */
  badge: { height: 22, padding: 8, fontSize: 13, gap: 8 },
  /** Between neighbouring names: room for the line between their shapes. */
  gap: 34,
  /** Inside a frame, either side of what it holds. */
  framePadding: 16,
  /** Inside the innermost frame, above and below what it holds. */
  frameInset: 14,
  /** How much farther each frame reaches, above and below, than the one inside it. */
  frameStep: 12,
  /** A frame's corners: rounded, never a pill. */
  frameRadius: 14,
  /** Between one atom and the next up a branch: room for its name and the line. */
  branchStep: 96,
  /**
   * A triple's vault: how far below the claim it stands, where its line
   * splits in two, as large as every vault (`VAULT_SIZE`); how far either
   * side the two sides' lines go; how far apart the people on one side
   * stand; and how far along a person's line their position shows.
   */
  vaults: { split: 26, spread: 160, apart: 100, weightAt: 0.6, staggerMs: 150 },
  /**
   * A list: between its members, one under another; from them across to
   * the predicate; and how far along a member's line its weight shows.
   */
  list: { rowStep: 80, reach: 170, weightAt: 0.45 },
  /** A ranked member's medal, before its name and as tall: the room between them. */
  medal: { gap: 4 },
  /**
   * The menu of perspectives above a claim, on the frame round it: its
   * height, the room either side of its words and for its chevrons, and the
   * room inside the frame, round the claim; its open list's rows, the room
   * round them, and its corners; the frame's border, in CSS pixels; and
   * how far below the menu its open list drops, and the frame's top with
   * it, so the list sits on the frame.
   */
  picker: {
    height: 30,
    padding: 12,
    chevrons: 16,
    gap: 28,
    row: 28,
    inset: 4,
    radius: 8,
    border: 1,
    drop: 6,
  },
  /**
   * A deposit followed up its line: how far right of the line a fee's
   * amount starts, from the middle of the fee's icon; how far apart, edge
   * to edge, what stands on the line stands (see `STILL_LINE`), and the
   * protocol's logo under its share; and, its fees shared out, how much of
   * the rest of the deposit shows, held back as the fees are followed on.
   */
  deposit: { branch: 40, gap: 24, held: 0.3 },
  /** How much of an atom set back shows, and of the lines from it. */
  faded: 0.3,
} as const;

/** Which side of a triple's vault: the stake against it, or the stake for it. */
export type VaultSide = 'against' | 'for';

/** A point on the plane: along the line, and down from it. */
export interface PlanePoint {
  x: number;
  y: number;
}

/**
 * A line of a triple's vault, through `points`: the trunk, from the top
 * of the vault to the frame; or a person's, from them, through where their
 * side's lines meet, to the vault's face for their side. A side's lines
 * run together from where they meet to the vault, so the stretch they
 * share shows stronger, as a list's lines do.
 */
export interface VaultLine {
  id: string;
  points: readonly PlanePoint[];
  side: VaultSide | null;
  /**
   * A person's line, its turn to grow, from 0: the people's lines grow one
   * after another. The trunk has none: it grows once the first reaches the
   * vault.
   */
  turn?: number;
  /** The position of the person it reaches, and where on the line that shows. */
  weight?: PlanePoint & { value: number };
  /**
   * How far along the person's stretch, from the turn to them, their
   * position shows, when not `PLANE.vaults.weightAt`.
   */
  weightAt?: number;
  /**
   * Held back as a deposit's fees are followed on from its line: it and
   * its position light, and its dots still (`Scene.heldFlow`).
   */
  isHeld?: boolean;
  /** Its person stays where they stood on the screen (`PlanePerson.isStill`), and its end with them. */
  isStill?: boolean;
  /**
   * On a side's first line, all the positions on that side, where the
   * side's lines run together.
   */
  total?: PlanePoint & { value: number };
}

/** A triple's vault: the middle of its icon's shape. */
export interface PlaneVault extends PlanePoint {
  id: string;
}

/** A person with a position in a vault: the middle of their icon, an atom's size. */
export interface PlanePerson extends PlanePoint {
  id: string;
  side: VaultSide;
  /** Whether they stay where they stood on the screen, as the plane moves round them. */
  isStill?: boolean;
  /** Held back, light, as the deposit's fees are followed on from their line: see `PLANE.deposit.held`. */
  isHeld?: boolean;
}

/**
 * A place on one of a triple's vault lines, as it is drawn: which stretch
 * of it, from its start, and how far along that stretch. What stands on the
 * line of a person who stays still stands there wherever that is drawn.
 */
export interface OnLine {
  line: string;
  stretch: number;
  along: number;
}

/**
 * A fee taken from a deposit on its line: its icon there, and its amount
 * off to the right, at the end of a line from the icon. It comes in on the
 * deposit's `turn`.
 */
export interface DepositFee {
  id: string;
  at: OnLine;
  amount: PlaneAmount;
  turn: number;
  /**
   * Held back as the deposit's fees are followed on: light (see
   * `PLANE.deposit.held`), and its lines' dots still (`Scene.heldFlow`).
   */
  isHeld?: boolean;
  /** Its amount off to the left of the line, not the right: where a deposit's fees go. */
  isLeft?: boolean;
  /**
   * Where its amount stands, out along its row past the end of its line,
   * where it will be shared out from: its middle, an x on the plane.
   */
  rowAt?: number;
  /**
   * The builder's app it goes to, under its amount, a line down to it:
   * they come in on a turn of their own.
   */
  app?: { turn: number };
}

/**
 * The protocol's share of a deposit's fees: it hangs under their amount,
 * level with `level` on the person's line, the builder's fee, and the line
 * runs on down to the protocol, the Intuition logo.
 */
export interface ProtocolFee extends PlaneAmount {
  level: OnLine;
}

/** An amount on a deposit's line, between what is at its ends; it comes in on its `turn`. */
export interface DepositAmount {
  id: string;
  at: OnLine;
  amount: PlaneAmount;
  turn: number;
  /** Held back, light, as the deposit's fees are followed on: see `PLANE.deposit.held`. */
  isHeld?: boolean;
}

/**
 * Where a share of a deposit's fees goes: a vault, the triple's own or one
 * of its terms', and how much; a term's vault hangs under it, as the
 * triple's does, its own line up to the term (`reach`).
 */
export interface FeeShare extends PlanePoint {
  id: string;
  of: VaultOf;
  gain: number;
  reach?: PlanePoint;
}

/**
 * An atom, where it sits on the plane. Every atom's shape is on one line,
 * at `y` 0, and its name is under it. An atom still spelled out is its word,
 * centred on `x`, on that line.
 */
export interface PlaneAtom {
  id: AtomId;
  /** The role it plays in the triple that holds it. */
  role: Role;
  /** The middle of its shape, or of its word. */
  x: number;
  /** Up from the claim's line, for an atom up a branch: 0 on the line. */
  y: number;
  /**
   * Which side of its shape its name is on, when not under it: to the
   * right up a branch, so the line up through it stays clear; to the left
   * in a list, where its line leaves to the right.
   */
  nameSide?: 'left' | 'right';
  /** Its place in a ranked list, from 0 at the top. */
  rank?: number;
  /** Its name's badge, or its shape if wider; or its word. */
  width: number;
}

/** A triple inside the claim, in its frame. */
export interface PlaneFrame {
  id: string;
  /** The role the whole triple fills in the triple that holds it: its frame's tint. */
  role: Role;
  /** Its left edge. */
  x: number;
  width: number;
  /** Above and below the line the shapes are on. */
  top: number;
  bottom: number;
}

/** What a line joins: an atom, or a whole triple, at the edge of its frame. */
export type PlaneEnd =
  | { atom: AtomId }
  | {
      frame: string;
      /** From the middle of its top, for a claim rising from it. */
      isTop?: boolean;
    };

/**
 * A triple's bond: subject to predicate, or predicate to object. A
 * bond leaves a frame from its right edge and reaches one at its left.
 */
export interface PlaneBond {
  /** The triple's id, then 0 from the subject or 1 to the object. */
  id: string;
  from: PlaneEnd;
  to: PlaneEnd;
}

/** A triple's weight, shown on its line from one atom to another: a list member's. */
export interface PlaneWeight {
  id: string;
  from: AtomId;
  to: AtomId;
  value: number;
}

/** A box on the plane: its top left, and its size. */
export interface PlaneBox extends PlanePoint {
  width: number;
  height: number;
}

/** The menu of perspectives, closed: its box, on the top of the frame round the claim. */
export interface PlanePicker extends PlaneBox {
  frame: PlaneBox;
}

export interface PlaneLayout {
  atoms: PlaneAtom[];
  /** Outermost first, so inner ones are drawn over them. */
  frames: PlaneFrame[];
  bonds: PlaneBond[];
  weights: PlaneWeight[];
  /** The lines down to the people with a position in a triple's vaults, from the frame on. */
  vaultLines: VaultLine[];
  vaults: PlaneVault[];
  people: PlanePerson[];
  width: number;
  top: number;
  bottom: number;
  /** Where its branches' first atoms stand, up from its line, if it has any. */
  branchRow?: number;
  /** The menu of perspectives above it, if it is seen through one. */
  picker?: PlanePicker;
  /** A deposit followed up its line: the fees taken on it, and its amounts. */
  depositFees: DepositFee[];
  depositAmounts: DepositAmount[];
  /** Its fees shared out: the fee they leave from, where each share goes, and the protocol's. */
  sharedFrom?: string;
  feeShares: FeeShare[];
  protocolFee?: ProtocolFee;
}

/** How tall the film's amount pills are: a position, a total, a deposit's amounts. */
export const PILL_HEIGHT = 18;

/**
 * How far under the vaults' bottom the row a deposit's fees are shared out
 * along runs, at the least: room for each share's amount between, as far
 * from the vault and the row as what stands on a line stands apart.
 */
export const SPLIT_ROOM = PILL_HEIGHT + PLANE.deposit.gap * 2;

/**
 * The line of one who stays still, its deposit followed up it: where what
 * stands on it stands, as shares of the way up from them to where it turns
 * for the vault (their position, the builder's fee, what goes on; the fees
 * at the turn), each `PLANE.deposit.gap` from the next, edge to edge, and
 * from them; and how far up that is in all, the line's length there.
 */
export const STILL_LINE = (() => {
  const { gap } = PLANE.deposit;
  const sent = gap + PILL_HEIGHT / 2;
  const builder = sent + PILL_HEIGHT / 2 + gap + VAULT_SIZE / 2;
  const deposit = builder + VAULT_SIZE / 2 + gap + PILL_HEIGHT / 2;
  const rise = deposit + PILL_HEIGHT / 2 + gap + VAULT_SIZE / 2;

  return {
    sent: sent / rise,
    builder: builder / rise,
    deposit: deposit / rise,
    rise,
  };
})();

/** From the shapes' line, the top of a shape and the bottom of a name under it. */
export const ATOM_TOP = -PLANE.atomSize / 2;
export const ATOM_BOTTOM =
  PLANE.atomSize / 2 + PLANE.badge.gap + PLANE.badge.height;
/** The middle of a name, under its shape. */
const NAME_Y = PLANE.atomSize / 2 + PLANE.badge.gap + PLANE.badge.height / 2;
/** Above and below a line of words. */
const WORDS_TOP = -PLANE.badge.fontSize / 2 - 4;
const WORDS_BOTTOM = PLANE.badge.fontSize / 2 + 4;

/** How a claim is laid out: which atoms are words, and which triples' words are one line. */
interface LayoutOptions {
  spelled?: readonly AtomId[] | undefined;
  folded?: readonly string[] | undefined;
  branches?: readonly PlaneBranch[] | undefined;
  frame?: Role | undefined;
  vaults?: PlaneVaults | undefined;
  /**
   * Where the branches' first atoms stand, up from the claim's line, when
   * the claim the beats build to sets it: a column then stands, from the
   * start, where it will once the others rise beside it.
   */
  branchRow?: number | undefined;
  /** A space's width, between words not yet broken apart. */
  space?: number;
  /** How wide a menu of perspectives above the claim is, if it has one. */
  pickerWidth?: number | undefined;
}

/** A term's atoms, as the claim reads, each with the role it plays. */
function atomsIn(
  term: PlaneTerm,
  role: Role,
): Array<{ id: AtomId; role: Role }> {
  if ('atom' in term) {
    return [{ id: term.atom, role }];
  }
  if ('list' in term) {
    const { members, predicate, object } = term.list;

    return [
      ...members.map((member) => ({
        id: member.atom,
        role: 'identity' as const,
      })),
      { id: predicate, role: 'predicate' },
      { id: object, role: 'object' },
    ];
  }
  const { subject, predicate, object } = term.triple;

  return [
    ...atomsIn(subject, 'identity'),
    { id: predicate, role: 'predicate' },
    ...atomsIn(object, 'object'),
  ];
}

interface Laid {
  /** What a line to or from it joins. */
  end: PlaneEnd;
  width: number;
  /** How many frames deep it is, its own included. */
  levels: number;
  /** Whether all of it is still words: its frame is then a line high. */
  isSpelled: boolean;
  place: (x: number, into: PlaneLayout) => void;
}

function layTerm(
  term: PlaneTerm,
  role: Role,
  depth: number,
  measure: (atom: AtomId) => number,
  options: LayoutOptions,
): Laid {
  if ('list' in term) {
    return layList(term.list, measure);
  }
  if ('atom' in term) {
    // An atom still spelled out stands, as a word, where it will stand as an
    // atom: when it is made, its word only comes down to be its name.
    const slot = Math.max(
      measure(term.atom) + PLANE.badge.padding * 2,
      PLANE.atomSize,
    );

    return {
      end: { atom: term.atom },
      width: slot,
      levels: 0,
      isSpelled: options.spelled?.includes(term.atom) ?? false,
      place: (x, into) => {
        into.atoms.push({
          id: term.atom,
          role,
          x: x + slot / 2,
          y: 0,
          width: slot,
        });
      },
    };
  }

  // A triple not yet broken apart: its words in one line, in its frame.
  if (depth > 0 && (options.folded?.includes(term.triple.id) ?? false)) {
    const inside = atomsIn(term, role);
    const space = options.space ?? 0;
    const line =
      inside.reduce((sum, atom) => sum + measure(atom.id), 0) +
      space * (inside.length - 1);
    const width = line + PLANE.framePadding * 2;
    const id = term.triple.id;

    return {
      end: { frame: id },
      width,
      levels: 1,
      isSpelled: true,
      place: (x, into) => {
        into.frames.push({
          id,
          role,
          x,
          width,
          top: WORDS_TOP - PLANE.frameInset,
          bottom: WORDS_BOTTOM + PLANE.frameInset,
        });
        let cursor = x + PLANE.framePadding;
        for (const atom of inside) {
          const wordWidth = measure(atom.id);
          into.atoms.push({
            id: atom.id,
            role: atom.role,
            x: cursor + wordWidth / 2,
            y: 0,
            width: wordWidth,
          });
          cursor += wordWidth + space;
        }
      },
    };
  }

  const { subject, predicate, object } = term.triple;
  const parts = [
    layTerm(subject, 'identity', depth + 1, measure, options),
    layTerm({ atom: predicate }, 'predicate', depth + 1, measure, options),
    layTerm(object, 'object', depth + 1, measure, options),
  ];
  // The claim itself is framed only when asked: the triples inside it are.
  const isFramed = depth > 0 || options.frame !== undefined;
  const padding = isFramed ? PLANE.framePadding : 0;
  const width =
    parts.reduce((sum, part) => sum + part.width, 0) +
    PLANE.gap * (parts.length - 1) +
    padding * 2;
  const levels =
    Math.max(...parts.map((part) => part.levels)) + (isFramed ? 1 : 0);
  const reach = PLANE.frameInset + (levels - 1) * PLANE.frameStep;
  const isSpelled = parts.every((part) => part.isSpelled);

  return {
    end: { frame: term.triple.id },
    width,
    levels,
    isSpelled,
    place: (x, into) => {
      // Subject to predicate, predicate to object.
      parts.slice(1).forEach((part, index) => {
        const from = parts[index];
        if (from !== undefined) {
          into.bonds.push({
            id: `${term.triple.id}:${index}`,
            from: from.end,
            to: part.end,
          });
        }
      });
      if (isFramed) {
        // As wide as it will be, and as high as what it holds: a line of
        // words until they are atoms, with their names under them.
        into.frames.push({
          id: term.triple.id,
          role: depth === 0 ? (options.frame ?? role) : role,
          x,
          width,
          top: (isSpelled ? WORDS_TOP : ATOM_TOP) - reach,
          bottom: (isSpelled ? WORDS_BOTTOM : ATOM_BOTTOM) + reach,
        });
      }
      let cursor = x + padding;
      for (const part of parts) {
        part.place(cursor, into);
        cursor += part.width + PLANE.gap;
      }
    },
  };
}

/**
 * A list: its members in a column, in the order they joined, or ranked,
 * the heaviest on top, their names to their left; the predicate across
 * from their middle, and the object beyond it.
 */
function layList(list: PlaneList, measure: (atom: AtomId) => number): Laid {
  const { rowStep, reach } = PLANE.list;
  const slot = (atom: AtomId): number =>
    Math.max(measure(atom) + PLANE.badge.padding * 2, PLANE.atomSize);
  // Ranked, its members' medals stand before their names.
  const medals =
    list.isRanked === true ? PLANE.badge.height + PLANE.medal.gap : 0;
  const names =
    medals +
    Math.max(...list.members.map((member) => slot(member.atom))) +
    PLANE.badge.gap;
  const across =
    PLANE.atomSize / 2 +
    reach +
    (slot(list.predicate) + slot(list.object)) / 2 +
    PLANE.gap;
  const width = names + across + slot(list.object) / 2;
  const order = list.isRanked
    ? list.members.toSorted((a, b) => b.weight - a.weight)
    : list.members;
  const reachUp = ((order.length - 1) / 2) * rowStep;

  return {
    end: { atom: list.object },
    width,
    levels: 0,
    isSpelled: false,
    place: (x, into) => {
      const memberX = x + names + PLANE.atomSize / 2;
      const predicateX = memberX + reach;
      for (const [index, member] of order.entries()) {
        into.atoms.push({
          id: member.atom,
          role: 'identity',
          x: memberX,
          y: index * rowStep - reachUp,
          nameSide: 'left',
          ...(list.isRanked === true ? { rank: index } : {}),
          width: slot(member.atom),
        });
      }
      into.atoms.push(
        {
          id: list.predicate,
          role: 'predicate',
          x: predicateX,
          y: 0,
          width: slot(list.predicate),
        },
        {
          id: list.object,
          role: 'object',
          x: x + names + across,
          y: 0,
          width: slot(list.object),
        },
      );
      for (const member of list.members) {
        into.weights.push({
          id: `${list.id}:${member.atom}`,
          from: member.atom,
          to: list.predicate,
          value: member.weight,
        });
      }
      into.top = Math.min(into.top, ATOM_TOP - reachUp);
      into.bottom = Math.max(into.bottom, reachUp + PLANE.atomSize / 2);
    },
  };
}

/** A branch's column: what it rises from, where, and how low its atoms can stand. */
interface Column {
  branch: PlaneBranch;
  from: PlaneEnd;
  x: number;
  lowest: number;
}

/**
 * Lays a claim out on the plane, from 0 at its left. `measure` gives a
 * name's width, in plane units. Atoms `spelled` stand as words where they
 * will stand as atoms, and the words of a triple `folded` stand in one line
 * in its frame. Each
 * of `branches` rises in a column from its subject: an atom, which, the
 * object of the claim and the subject of the branch, takes both roles; or
 * a frame, from the middle of its top.
 */
export function layoutPlane(
  term: PlaneTerm,
  measure: (atom: AtomId) => number,
  options: LayoutOptions = {},
): PlaneLayout {
  const laid = layTerm(term, 'identity', 0, measure, options);
  const layout: PlaneLayout = {
    atoms: [],
    frames: [],
    bonds: [],
    weights: [],
    vaultLines: [],
    vaults: [],
    people: [],
    depositFees: [],
    depositAmounts: [],
    feeShares: [],
    width: laid.width,
    top: ATOM_TOP,
    bottom: ATOM_BOTTOM,
  };
  laid.place(0, layout);
  for (const frame of layout.frames) {
    layout.top = Math.min(layout.top, frame.top);
    layout.bottom = Math.max(layout.bottom, frame.bottom);
  }
  // Where each column rises from: an atom's shape, or a frame's top.
  const step = PLANE.branchStep;
  const columns = (options.branches ?? []).flatMap((branch): Column[] => {
    const { subject } = branch;
    if ('atom' in subject) {
      const atom = layout.atoms.find(
        (candidate) => candidate.id === subject.atom,
      );
      if (atom === undefined) {
        return [];
      }
      if (atom.role === 'object') {
        atom.role = 'bridge';
      }

      return [{ branch, from: subject, x: atom.x, lowest: atom.y - step }];
    }
    const frame = layout.frames.find(
      (candidate) => candidate.id === subject.frame,
    );

    return frame === undefined
      ? []
      : [
          {
            branch,
            from: { frame: subject.frame, isTop: true },
            x: frame.x + frame.width / 2,
            lowest: frame.top - step * 0.75,
          },
        ];
  });
  // Side by side, the columns' atoms stand on the same rows: as low as the
  // highest-starting column allows, of these or of those still to come.
  const row = Math.min(
    ...columns.map((column) => column.lowest),
    options.branchRow ?? Number.POSITIVE_INFINITY,
  );
  if (columns.length > 0) {
    layout.branchRow = row;
  }
  for (const { branch, from, x } of columns) {
    for (const [index, id] of [branch.predicate, branch.object].entries()) {
      layout.atoms.push({
        id,
        role: index === 0 ? 'predicate' : 'object',
        x,
        y: row - step * index,
        nameSide: 'right',
        width: Math.max(measure(id) + PLANE.badge.padding * 2, PLANE.atomSize),
      });
    }
    layout.bonds.push(
      { id: `${branch.id}:0`, from, to: { atom: branch.predicate } },
      {
        id: `${branch.id}:1`,
        from: { atom: branch.predicate },
        to: { atom: branch.object },
      },
    );
    layout.top = Math.min(layout.top, row - step + ATOM_TOP);
  }
  const hung = layout.frames.find(
    (candidate) => candidate.id === options.vaults?.frame,
  );
  if (options.vaults !== undefined && hung !== undefined) {
    hangVaults(options.vaults, hung, layout);
  }
  if (options.pickerWidth !== undefined) {
    // A frame round the claim, as far from it all round, and the menu just
    // above its top, in the middle.
    const { height, gap, drop } = PLANE.picker;
    const frame = {
      x: -gap,
      y: layout.top - gap,
      width: layout.width + gap * 2,
      height: layout.bottom - layout.top + gap * 2,
    };
    layout.picker = {
      x: (layout.width - options.pickerWidth) / 2,
      y: frame.y - drop - height,
      width: options.pickerWidth,
      height,
      frame,
    };
    layout.top = layout.picker.y;
    layout.bottom = frame.y + frame.height;
  }

  return layout;
}

/**
 * Hangs a triple's vault below its frame. The lines reach as far below the
 * claim as a claim rising from its top reaches above it, a row where each
 * side's lines meet and a row for the people, so the plane is as tall with
 * either; from a triple inside the claim, the line down to the vault is
 * longer.
 */
function hangVaults(
  vaults: PlaneVaults,
  frame: PlaneFrame,
  into: PlaneLayout,
): void {
  const { split, spread, apart, weightAt } = PLANE.vaults;
  const step = PLANE.branchStep;
  const root = { x: frame.x + frame.width / 2, y: frame.bottom };
  // The vault, the middle of its icon where the line splits, and where a
  // line meets each of its faces.
  const vault = { x: root.x, y: into.bottom + split };
  const { box, ports, size } = VAULT_ICON;
  const scale = VAULT_SIZE / size;
  const port = (face: keyof typeof ports): PlanePoint => ({
    x: vault.x + (ports[face].x - (box.x + box.width / 2)) * scale,
    y: vault.y + (ports[face].y - (box.y + box.height / 2)) * scale,
  });
  const sidesRow = into.bottom + step * 0.75;
  const peopleRow = sidesRow + step;
  into.vaults.push({ id: `${vaults.frame}:vault`, ...vault });
  // The people make the claim: every line runs from them up to it.
  into.vaultLines.push({
    id: `${vaults.frame}:vaults`,
    points: [port('subject'), root],
    side: null,
  });
  let turn = 0;
  for (const [side, positions, direction] of [
    ['against', vaults.against, -1],
    ['for', vaults.for, 1],
  ] as const) {
    const meet = { x: root.x + spread * direction, y: sidesRow };
    const face = port(side);
    // The people on a side centred on where its lines meet, left to right;
    // each one's line from the top of their icon, through there, to the
    // vault's face for their side.
    for (const [index, value] of positions.entries()) {
      const id = `${vaults.frame}:${side}:${index}`;
      const x = meet.x + (index - (positions.length - 1) / 2) * apart;
      const to = { x, y: peopleRow - PLANE.atomSize / 2 };
      into.vaultLines.push({
        id,
        points: [to, meet, face],
        side,
        turn,
        weight: {
          x: meet.x + (to.x - meet.x) * weightAt,
          y: meet.y + (to.y - meet.y) * weightAt,
          value,
        },
        ...(index === 0
          ? {
              total: {
                x: face.x + (meet.x - face.x) * weightAt,
                y: face.y + (meet.y - face.y) * weightAt,
                value: positions.reduce((sum, position) => sum + position, 0),
              },
            }
          : {}),
      });
      into.people.push({ id, side, x, y: peopleRow });
      turn += 1;
    }
  }
  into.bottom = Math.max(into.bottom, peopleRow + PLANE.atomSize / 2);
}

/** A claim in words, each inner triple in brackets. */
export function planeSentence(
  term: PlaneTerm,
  labelOf: (atom: AtomId) => string,
  isInner = false,
): string {
  if ('atom' in term) {
    return labelOf(term.atom);
  }
  if ('list' in term) {
    const { members, predicate, object } = term.list;

    return members
      .map(
        (member) =>
          `${labelOf(member.atom)} ${labelOf(predicate)} ${labelOf(object)}`,
      )
      .join('; ');
  }
  const { subject, predicate, object } = term.triple;
  const words = `${planeSentence(subject, labelOf, true)} ${labelOf(predicate)} ${planeSentence(object, labelOf, true)}`;

  return isInner ? `(${words})` : words;
}

/** An atom partway from one beat's claim to the next. */
export interface BlendedAtom extends PlaneAtom {
  /** 0 when absent, 1 when fully there. */
  presence: number;
  /** The role it is morphing from, toward `role`, `roleProgress` of the way. */
  fromRole: Role;
  roleProgress: number;
  /**
   * Whether it brings its own name: 0 when its word, already in place, is
   * its name, and grows a pill behind it.
   */
  named: number;
  /** How far its rank, in a ranked list, shows. */
  ranked: number;
  /** How far it is set back: fully, only `PLANE.faded` of it shows. */
  faded: number;
  /**
   * Going as one person is left alone: it keeps to its row on the screen,
   * moving along it with the claim but not up with it, and goes where it
   * is, not back into the cloud.
   */
  keepsRow?: boolean;
}

/** A frame partway from one beat's claim to the next. */
export interface BlendedFrame extends PlaneFrame {
  presence: number;
}

/** A triple's bond, drawn from its start as far as `presence`. */
export interface BlendedBond extends PlaneBond {
  presence: number;
  /** How far it is set back, with an atom it joins. */
  faded: number;
}

/** A triple's weight partway from one beat's claim to the next. */
export interface BlendedWeight extends PlaneWeight {
  /** How far it shows. */
  weighed: number;
}

/** A line of a triple's vaults partway from one beat's claim to the next. */
export interface BlendedVaultLine extends VaultLine {
  /** How far it is drawn, from its start. */
  presence: number;
  /** How far its side's total shows, where it has one. */
  totalled: number;
  /** How far the position on it shows. */
  weighed: number;
  /** How strong it is: less, held back as a deposit's fees are followed on from it. */
  strength: number;
  /** Going as one person is left alone: it draws back where it was on the screen, with its person. */
  isGoing?: boolean;
}

/** A triple's vault partway from one beat's claim to the next. */
export interface BlendedVault extends PlaneVault {
  presence: number;
}

/** A person partway from one beat's claim to the next. */
export interface BlendedPerson extends PlanePerson {
  presence: number;
  /** How strong they are: less, held back as their deposit's fees are followed on. */
  strength: number;
}

/** Plain words, centred on `x`, `y` down from the shapes' line. */
export interface BlendedWords {
  id: string;
  text: string;
  x: number;
  y: number;
  alpha: number;
  /** How far the pill of the name it is becoming has grown behind it. */
  pill: number;
}

/** The menu of perspectives partway from one beat's claim to the next. */
export interface BlendedPicker extends PlanePicker {
  options: readonly string[];
  /** The one it shows, closed. */
  chosen: number;
  /** How far it shows, 0 to 1. */
  presence: number;
  /** How far its list is open, 0 to 1. */
  open: number;
  /** Which option the open list highlights: between two, as it moves. */
  highlight: number;
}

/** The claim a run of beats builds to, laid out as it ends: what the plane sizes itself by. */
export interface PlaneFit {
  width: number;
  top: number;
  bottom: number;
  /** Where each of its atoms finally stands along the line. */
  xs: ReadonlyMap<AtomId, number>;
}

export interface BlendedPlane {
  /** The atoms made: not those still words. */
  atoms: BlendedAtom[];
  /** Outermost first. */
  frames: BlendedFrame[];
  bonds: BlendedBond[];
  weights: BlendedWeight[];
  vaultLines: BlendedVaultLine[];
  vaults: BlendedVault[];
  people: BlendedPerson[];
  /** A deposit followed up its line: the fees taken on it, and its amounts. */
  depositFees: BlendedDepositFee[];
  depositAmounts: BlendedDepositAmount[];
  /** Its fees shared out: the fee they leave from, where each share goes, and the protocol's. */
  sharedFrom: string | null;
  feeShares: BlendedFeeShare[];
  /** How far the protocol's logo shows, the line to it has grown, and its share shows. */
  protocolFee:
    | (ProtocolFee & { presence: number; grown: number; shown: number })
    | null;
  words: BlendedWords[];
  picker: BlendedPicker | null;
  /** Its extent along the line, and above and below it. */
  left: number;
  right: number;
  top: number;
  bottom: number;
  /** The claim it builds to, when known. */
  fit: PlaneFit | null;
  /** How far what was there has moved to its new place, 0 to 1. */
  settle: number;
}

/** A fee taken from a deposit, partway from one beat's claim to the next. */
export interface BlendedDepositFee extends DepositFee {
  /** How far its icon shows, the line from it to its amount has grown, and its amount shows. */
  icon: number;
  branch: number;
  shown: number;
  /** How strong all of it is: less, held back as the fees are followed on. */
  strength: number;
  /** How far the line from its amount down to its app has grown, and its app shows. */
  appLine: number;
  appIcon: number;
}

/** An amount on a deposit's line, partway from one beat's claim to the next. */
export interface BlendedDepositAmount extends DepositAmount {
  shown: number;
}

/** A share of a deposit's fees, partway from one beat's claim to the next. */
export interface BlendedFeeShare extends FeeShare {
  /** How far a term's vault, new, shows; the line to it has grown; and its share shows. */
  presence: number;
  grown: number;
  shown: number;
}

/** A part of a change: the share of it it starts at, and the share it is done by. */
type Window = readonly [start: number, end: number];

interface Stages {
  /** The atom a plane opens on arrives. */
  lead: Window;
  /** Words appear. */
  write: Window;
  /**
   * What is not in the next claim leaves: its lines draw back over the
   * first half, as it fades.
   */
  leave: Window;
  /** What is there moves to its new place: atoms, words and frames. */
  move: Window;
  /** New frames form. */
  frames: Window;
  /** Words about to be atoms move down, to where their names go. */
  down: Window;
  /** New atoms arrive. */
  atoms: Window;
  /** The words that are their names grow a pill behind them. */
  pills: Window;
  /** Then the lines grow between them. */
  lines: Window;
  /** An atom with a new role takes it. */
  roles: Window;
  /** The people's positions show on their lines. */
  weights: Window;
  /** Each side shows all the positions on it. */
  totals: Window;
  /** A list's members show their ranks, once they stand in order. */
  ranks: Window;
  /**
   * The menu of perspectives shows; or, choosing another, opens, moves to
   * it, and closes on it.
   */
  pick: Window;
  /** A list's weights change to the new perspective's. */
  reweigh: Window;
}

const NONE: Window = [0, 0];

/**
 * When, in the change that hangs a triple's vaults below it, the claim
 * moves up to make room, as what rose from it goes: what stands behind the
 * plane can go then too.
 */
export const HANGING_RISE: Window = [0, 0.35];

/**
 * The order a claim grows in. Opening, the atom it opens on arrives first;
 * once it settles, the rest of the claim shows, and then its lines grow.
 * Dividing words in a frame, they break into their parts, then the frames
 * inside show how the parts divide. Making them atoms, the words move down
 * to where the names go as the frames grow to hold them, the atoms arrive
 * in their shapes above them, the words grow their pills, and the lines
 * grow. Framing the whole claim, it
 * moves into place, then the frame forms round it, then what rises from it
 * arrives and the lines grow up to it. Hanging a triple's vault below it,
 * at once what rose from it draws back and goes, an atom left with one role
 * takes it, and the claim moves up; then the vault and the people arrive
 * below it, and their lines grow up to it, one after another, through the
 * vault. Weighing them, each position shows on its line, then all the
 * positions on each side, where its lines run together. Leaving one person
 * alone with the triple and its vault, all else on the plane goes, the
 * lines drawing back, and the positions and totals going with them, as
 * their own position moves down their line to make room. Following their
 * deposit up their line, turn by turn, the builder's fee comes in where it is taken,
 * its line out to its amount; then the line on down to the builder's app,
 * and the app; then what goes on, then the fees the same
 * way, their line out along the row to where they will be shared out
 * from, and last the position, where the line reaches the vault. Sharing
 * its fees out, all of the deposit goes but its fees' amount, where it
 * stands on the row its shares run on; then the vaults of the triple's
 * terms arrive over it, and the protocol's logo under it; the lines grow
 * from the fee to each vault, and from its amount down to the Intuition logo, at one
 * speed; and each share shows. Seen through a perspective, the
 * claim moves down to make room for the menu above it, which shows. Choosing
 * another, the menu opens, moves to it, and closes on it; the weights change
 * to the new perspective's; the members move into their new order; and
 * their ranks change. Otherwise, what is there moves
 * aside before anything new arrives, and lines grow only between atoms
 * already in place.
 */
const STAGES = {
  opening: {
    lead: [0, 0.6],
    write: [0.6, 0.8],
    leave: NONE,
    move: NONE,
    frames: [0.6, 0.8],
    down: NONE,
    atoms: [0.6, 0.8],
    pills: [0.6, 0.8],
    lines: [0.8, 1],
    roles: NONE,
    weights: NONE,
    totals: NONE,
    ranks: NONE,
    pick: NONE,
    reweigh: NONE,
  },
  dividing: {
    lead: [0.45, 0.85],
    write: NONE,
    leave: [0, 0.45],
    move: [0, 0.45],
    frames: [0.45, 0.85],
    down: [0.45, 0.85],
    atoms: [0.45, 0.85],
    pills: [0.45, 0.85],
    lines: [0.85, 1],
    roles: NONE,
    weights: NONE,
    totals: NONE,
    ranks: NONE,
    pick: NONE,
    reweigh: NONE,
  },
  making: {
    lead: [0.2, 0.5],
    write: NONE,
    leave: [0, 0.4],
    move: [0, 0.4],
    frames: [0, 0.4],
    down: [0, 0.4],
    atoms: [0.2, 0.5],
    pills: [0.45, 0.65],
    lines: [0.65, 0.92],
    roles: [0.92, 1],
    weights: NONE,
    totals: NONE,
    ranks: NONE,
    pick: NONE,
    reweigh: NONE,
  },
  framing: {
    lead: [0.5, 0.7],
    write: NONE,
    leave: [0, 0.3],
    move: [0, 0.3],
    frames: [0.3, 0.5],
    down: [0, 0.3],
    atoms: [0.5, 0.7],
    pills: [0.5, 0.7],
    lines: [0.7, 0.92],
    roles: [0.92, 1],
    weights: NONE,
    totals: NONE,
    ranks: NONE,
    pick: NONE,
    reweigh: NONE,
  },
  growing: {
    lead: [0.3, 0.6],
    write: [0.3, 0.6],
    leave: [0, 0.3],
    move: [0, 0.3],
    frames: [0, 0.3],
    down: [0, 0.3],
    atoms: [0.3, 0.6],
    pills: [0.3, 0.6],
    lines: [0.6, 0.85],
    roles: [0.85, 1],
    weights: NONE,
    totals: NONE,
    ranks: NONE,
    pick: NONE,
    reweigh: NONE,
  },
  hanging: {
    lead: NONE,
    write: NONE,
    leave: HANGING_RISE,
    move: HANGING_RISE,
    frames: NONE,
    down: NONE,
    atoms: [0.38, 0.55],
    pills: NONE,
    lines: [0.6, 0.95],
    roles: HANGING_RISE,
    weights: NONE,
    totals: NONE,
    ranks: NONE,
    pick: NONE,
    reweigh: NONE,
  },
  closing: {
    lead: NONE,
    write: NONE,
    leave: [0, 0.45],
    move: NONE,
    frames: NONE,
    down: NONE,
    atoms: NONE,
    pills: NONE,
    lines: NONE,
    roles: NONE,
    weights: NONE,
    totals: NONE,
    ranks: NONE,
    pick: NONE,
    reweigh: NONE,
  },
  listing: {
    lead: [0, 0.55],
    write: NONE,
    leave: NONE,
    move: NONE,
    frames: NONE,
    down: NONE,
    atoms: [0, 0.55],
    pills: NONE,
    lines: NONE,
    roles: NONE,
    weights: [0.65, 0.9],
    totals: NONE,
    ranks: NONE,
    pick: NONE,
    reweigh: NONE,
  },
  ranking: {
    lead: NONE,
    write: NONE,
    leave: NONE,
    move: [0.05, 0.7],
    frames: NONE,
    down: NONE,
    atoms: NONE,
    pills: NONE,
    lines: NONE,
    roles: NONE,
    weights: NONE,
    totals: NONE,
    ranks: [0.75, 0.95],
    pick: NONE,
    reweigh: NONE,
  },
  weighing: {
    lead: NONE,
    write: NONE,
    leave: NONE,
    move: NONE,
    frames: NONE,
    down: NONE,
    atoms: NONE,
    pills: NONE,
    lines: NONE,
    roles: NONE,
    weights: [0, 0.4],
    totals: [0.55, 1],
    ranks: NONE,
    pick: NONE,
    reweigh: NONE,
  },
  depositing: {
    lead: NONE,
    write: NONE,
    leave: NONE,
    move: NONE,
    frames: NONE,
    down: NONE,
    atoms: NONE,
    pills: NONE,
    lines: [0, 1],
    roles: NONE,
    weights: NONE,
    totals: NONE,
    ranks: NONE,
    pick: NONE,
    reweigh: NONE,
  },
  sharing: {
    lead: NONE,
    write: NONE,
    leave: [0, 0.3],
    move: NONE,
    frames: NONE,
    down: NONE,
    atoms: [0.3, 0.45],
    pills: NONE,
    lines: [0.45, 0.85],
    roles: NONE,
    weights: [0.85, 1],
    totals: NONE,
    ranks: NONE,
    pick: NONE,
    reweigh: NONE,
  },
  clearing: {
    lead: NONE,
    write: NONE,
    leave: [0, 0.8],
    move: [0, 0.8],
    frames: NONE,
    down: NONE,
    atoms: NONE,
    pills: NONE,
    lines: NONE,
    roles: NONE,
    weights: NONE,
    totals: NONE,
    ranks: NONE,
    pick: NONE,
    reweigh: NONE,
  },
  presenting: {
    lead: NONE,
    write: NONE,
    leave: NONE,
    move: [0, 0.45],
    frames: NONE,
    down: NONE,
    atoms: NONE,
    pills: NONE,
    lines: NONE,
    roles: NONE,
    weights: NONE,
    totals: NONE,
    ranks: NONE,
    pick: [0.25, 0.65],
    reweigh: NONE,
  },
  switching: {
    lead: NONE,
    write: NONE,
    leave: NONE,
    move: [0.52, 0.82],
    frames: NONE,
    down: NONE,
    atoms: NONE,
    pills: NONE,
    lines: NONE,
    roles: NONE,
    weights: NONE,
    totals: NONE,
    ranks: [0.84, 0.97],
    pick: [0, 0.36],
    reweigh: [0.38, 0.52],
  },
} as const satisfies Record<string, Stages>;

/**
 * A fee's turn, as a deposit is followed up its line: its icon comes in,
 * then the line from it to its amount grows, then its amount shows.
 */
const FEE_TURN = {
  icon: [0, 0.3],
  branch: [0.3, 0.7],
  amount: [0.7, 1],
} as const;

/**
 * The turn of the app a fee goes to: the line from the fee's amount down
 * to it grows, then the app comes in.
 */
const APP_TURN = {
  line: [0, 0.6],
  app: [0.6, 1],
} as const;

/**
 * Choosing another perspective, within the stage that picks it: the menu
 * opens, the highlight moves to the one chosen, and the menu closes on it.
 */
const PICKING = {
  open: [0, 0.3],
  highlight: [0.3, 0.65],
  close: [0.72, 1],
} as const;

/** The list a claim is, if it is one. */
function listOf(claim: PlaneClaim | null): PlaneList | undefined {
  return claim !== null && 'list' in claim.term ? claim.term.list : undefined;
}

/** The order the change from one claim to the next follows: see `STAGES`. */
function stagesOf(
  from: PlaneClaim | null,
  to: PlaneClaim | null,
  after: PlaneLayout | null,
): Stages {
  if (from === null) {
    if (to !== null && 'list' in to.term) {
      return STAGES.listing;
    }

    return (after?.atoms.length ?? 0) === 1
      ? { ...STAGES.opening, lead: [0, 1] }
      : STAGES.opening;
  }
  if (to === null) {
    return STAGES.closing;
  }
  if (to.alone !== undefined && from.alone === undefined) {
    return STAGES.clearing;
  }
  if (to.deposit !== undefined && from.deposit === undefined) {
    return STAGES.depositing;
  }
  if (to.deposit?.shared !== undefined && from.deposit?.shared === undefined) {
    return STAGES.sharing;
  }
  if (to.perspective !== undefined) {
    if (from.perspective === undefined) {
      return STAGES.presenting;
    }
    if (from.perspective.chosen !== to.perspective.chosen) {
      return STAGES.switching;
    }
  }
  if (listOf(to)?.isRanked === true && listOf(from)?.isRanked !== true) {
    return STAGES.ranking;
  }
  if ((from.folded?.length ?? 0) > 0 && (to?.spelled?.length ?? 0) > 0) {
    return STAGES.dividing;
  }
  if ((from.spelled?.length ?? 0) > 0) {
    return STAGES.making;
  }
  if (to?.frame !== undefined && from.frame === undefined) {
    return STAGES.framing;
  }
  if (to?.vaults !== undefined && from.vaults === undefined) {
    return STAGES.hanging;
  }
  if (to?.vaults?.isWeighed === true && from.vaults?.isWeighed !== true) {
    return STAGES.weighing;
  }

  return STAGES.growing;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function distance(from: PlanePoint, to: PlanePoint): number {
  return Math.hypot(to.x - from.x, to.y - from.y);
}

/** How long a line through `points` is. */
function lengthOf(points: readonly PlanePoint[]): number {
  return points
    .slice(1)
    .reduce(
      (sum, point, index) => sum + distance(points[index] ?? point, point),
      0,
    );
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

/** How far through `window` a change at `t` is, eased. */
function through([start, end]: Window, t: number): number {
  if (end <= start) {
    return t >= end ? 1 : 0;
  }

  return easeInOutCubic(Math.min(Math.max((t - start) / (end - start), 0), 1));
}

/**
 * How far each of a triple's vault lines has grown at `t`, in a stage that
 * grows them over `window` of a change `durationMs` long, evenly: the
 * people's lines one after another, `staggerMs` apart, at one speed; the
 * trunk from when the first of them reaches the vault, at that speed, as
 * that line going on up through it; and all of it done as the stage ends. Without a duration,
 * the people's lines start together.
 */
function vaultGrowth(
  lines: readonly VaultLine[],
  [start, end]: Window,
  durationMs: number,
): (line: VaultLine, t: number) => number {
  const span = end - start;
  const climbing = lines.filter((line) => line.turn !== undefined);
  const gaps = Math.max(climbing.length - 1, 0);
  // Never more than half the stage from the first to start to the last.
  const stagger =
    durationMs > 0
      ? Math.min(
          PLANE.vaults.staggerMs / durationMs,
          span / 2 / Math.max(gaps, 1),
        )
      : 0;
  const longest = Math.max(0, ...climbing.map((line) => lengthOf(line.points)));
  const trunk = Math.max(
    0,
    ...lines
      .filter((line) => line.turn === undefined)
      .map((line) => lengthOf(line.points)),
  );
  const speed = (longest + trunk) / (span - stagger * gaps);
  const startOf = (line: VaultLine): number =>
    start + (line.turn ?? 0) * stagger;
  const firstMet = Math.min(
    ...climbing.map((line) => startOf(line) + lengthOf(line.points) / speed),
  );

  return (line, t) => {
    const length = lengthOf(line.points);
    if (t >= end || span <= 0 || length <= 0) {
      return t >= end ? 1 : 0;
    }
    const from = line.turn === undefined ? firstMet : startOf(line);

    return Math.min(Math.max(((t - from) * speed) / length, 0), 1);
  };
}

/** A layout moved along the line, and where its left edge is then. */
type Placed = PlaneLayout & { left: number };

/**
 * Where a line's end is on a laid-out plane, as the scene draws it: at an
 * atom, at the middle of a frame's top, or at a frame's right edge leaving
 * it and its left edge reaching it, on the claim's line.
 */
function endOf(
  layout: PlaneLayout,
  end: PlaneEnd,
  side: 'from' | 'to',
): { x: number; y: number } {
  if ('atom' in end) {
    const atom = layout.atoms.find((candidate) => candidate.id === end.atom);

    return { x: atom?.x ?? 0, y: atom?.y ?? 0 };
  }
  const frame = layout.frames.find((candidate) => candidate.id === end.frame);
  if (frame === undefined) {
    return { x: 0, y: 0 };
  }
  if (end.isTop === true) {
    return { x: frame.x + frame.width / 2, y: frame.top };
  }

  return { x: side === 'from' ? frame.x + frame.width : frame.x, y: 0 };
}

/**
 * How far each of `bonds` has grown, `grow` of the way through their time:
 * one after another, in the order the layout lists them (each triple from
 * its subject to its predicate to its object, then the triples it holds,
 * then the claims rising from it), each in its share of the time by its
 * length, so the bridge is drawn as one stroke at one speed.
 */
function growInTurn(
  bonds: readonly PlaneBond[],
  layout: PlaneLayout,
  grow: number,
): number[] {
  const lengths = bonds.map((bond) => {
    const from = endOf(layout, bond.from, 'from');
    const to = endOf(layout, bond.to, 'to');

    return Math.hypot(to.x - from.x, to.y - from.y);
  });
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let drawn = 0;

  return lengths.map((length) => {
    const start = drawn;
    drawn += length;
    if (length === 0) {
      return grow * total >= start ? 1 : 0;
    }

    return Math.min(Math.max((grow * total - start) / length, 0), 1);
  });
}

function shifted(layout: PlaneLayout, shift: number): Placed {
  const moved = <T extends { x: number }>(point: T): T => ({
    ...point,
    x: point.x + shift,
  });

  return {
    ...layout,
    atoms: layout.atoms.map(moved),
    frames: layout.frames.map(moved),
    vaultLines: layout.vaultLines.map((line) => ({
      ...line,
      points: line.points.map(moved),
      ...(line.weight === undefined ? {} : { weight: moved(line.weight) }),
      ...(line.total === undefined ? {} : { total: moved(line.total) }),
    })),
    vaults: layout.vaults.map(moved),
    people: layout.people.map(moved),
    feeShares: layout.feeShares.map((share) => ({
      ...moved(share),
      ...(share.reach === undefined ? {} : { reach: moved(share.reach) }),
    })),
    ...(layout.picker === undefined
      ? {}
      : {
          picker: {
            ...moved(layout.picker),
            frame: moved(layout.picker.frame),
          },
        }),
    left: shift,
  };
}

/** The triple in `term` with this id, if there is one. */
export function tripleIn(term: PlaneTerm, id: string): PlaneTriple | undefined {
  if (!('triple' in term)) {
    return undefined;
  }
  const { triple } = term;

  return triple.id === id
    ? triple
    : (tripleIn(triple.subject, id) ?? tripleIn(triple.object, id));
}

/** A triple's id, and those of the triples inside it. */
function tripleIds(triple: PlaneTriple): string[] {
  return [
    triple.id,
    ...[triple.subject, triple.object].flatMap((term) =>
      'triple' in term ? tripleIds(term.triple) : [],
    ),
  ];
}

/**
 * A layout with all on it gone but the one person `claim` leaves alone,
 * their line up to the vault, the vault and its line on to the triple, and
 * the triple, its atoms, frames and lines, where they stood; it keeps its
 * room, so the plane holds still.
 */
function aloneIn(layout: Placed, claim: PlaneClaim): Placed {
  const { alone, vaults } = claim;
  if (alone === undefined || vaults === undefined) {
    return layout;
  }
  const person = `${vaults.frame}:${alone.side}:${alone.index}`;
  const triple = tripleIn(claim.term, vaults.frame);
  const triples = new Set(triple === undefined ? [] : tripleIds(triple));
  const atoms = new Set(
    triple === undefined
      ? []
      : atomsIn({ triple }, 'identity').map((atom) => atom.id),
  );
  const { picker: _picker, ...kept } = layout;
  // The triple, its atoms, frames and lines, and the vault's line on to it.
  const base: Placed = {
    ...kept,
    atoms: layout.atoms.filter((atom) => atoms.has(atom.id)),
    frames: layout.frames.filter((frame) => triples.has(frame.id)),
    bonds: layout.bonds.filter((bond) =>
      triples.has(bond.id.slice(0, bond.id.lastIndexOf(':'))),
    ),
    weights: [],
    vaultLines: layout.vaultLines.filter((line) => line.turn === undefined),
    people: [],
  };
  const line = layout.vaultLines.find(({ id }) => id === person);
  const stays = layout.people.find(({ id }) => id === person);
  if (line === undefined || stays === undefined) {
    return base;
  }
  const { deposit } = claim;
  // A deposit followed up the person's line: from them to where it turns
  // for the vault, then on to the vault.
  const on = (stretch: number, along: number): OnLine => ({
    line: person,
    stretch,
    along,
  });
  // Its fees shared out: the person, their line and the fees stay; the
  // rest of the deposit is held back, light; and the position goes, where
  // the line to the inner triple's vault runs.
  const shared = deposit?.shared;
  const isHeld = shared === undefined ? {} : { isHeld: true };
  // The fees' amount stands where they will be shared out from.
  const rowAt = rowAtOf(shareSpotsIn(base, triple));
  const followed: Placed = {
    ...base,
    vaultLines: [
      ...base.vaultLines,
      {
        ...line,
        isStill: true,
        // Low on the line, near the person, from the moment they are left
        // alone: where it stands as the deposit is followed, under the
        // builder's fee.
        weightAt: 1 - STILL_LINE.sent,
        ...(shared === undefined ? {} : { isHeld: true }),
      },
    ],
    people: [{ ...stays, isStill: true, ...isHeld }],
    ...(deposit === undefined
      ? {}
      : {
          depositFees: [
            {
              id: `${person}:builder`,
              at: on(0, STILL_LINE.builder),
              amount: deposit.builderFee,
              turn: 0,
              app: { turn: 1 },
              isLeft: true,
              ...isHeld,
            },
            {
              id: `${person}:fees`,
              at: on(0, 1),
              amount: deposit.fees,
              turn: 3,
              isLeft: true,
              ...(rowAt === undefined ? {} : { rowAt }),
            },
          ],
          depositAmounts: [
            {
              id: `${person}:deposit`,
              at: on(0, STILL_LINE.deposit),
              amount: deposit.deposit,
              turn: 2,
              ...isHeld,
            },
            ...(shared === undefined
              ? [
                  {
                    id: `${person}:position`,
                    // Midway along the line on into the vault.
                    at: on(1, 0.5),
                    amount: deposit.position,
                    turn: 4,
                  },
                ]
              : []),
          ],
        }),
  };

  return shared === undefined
    ? followed
    : sharedIn(
        followed,
        shared,
        triple,
        `${person}:fees`,
        on(0, STILL_LINE.builder),
      );
}

/**
 * Where the vaults a deposit's fees go into stand, on a layout left alone
 * with the triple: its own vault first, then each of its three terms',
 * beside it on the same row, each under its term, its own line up to it:
 * an atom's to the bottom of its shape, behind its name; a triple's to its
 * frame.
 */
function shareSpotsIn(
  layout: Placed,
  triple: PlaneTriple | undefined,
): Omit<FeeShare, 'gain'>[] {
  const [vault] = layout.vaults;
  if (vault === undefined || triple === undefined) {
    return [];
  }
  const terms: PlaneTerm[] = [
    triple.subject,
    { atom: triple.predicate },
    triple.object,
  ];
  const spots = terms.flatMap((term, index): Omit<FeeShare, 'gain'>[] => {
    const id = `${vault.id}:term:${index}`;
    if ('atom' in term) {
      const atom = layout.atoms.find((each) => each.id === term.atom);

      return atom === undefined
        ? []
        : [
            {
              id,
              of: 'atom',
              x: atom.x,
              y: vault.y,
              reach: { x: atom.x, y: atom.y + PLANE.atomSize / 2 },
            },
          ];
    }
    if ('triple' in term) {
      const frame = layout.frames.find((each) => each.id === term.triple.id);
      const x = frame === undefined ? 0 : frame.x + frame.width / 2;

      return frame === undefined
        ? []
        : [{ id, of: 'triple', x, y: vault.y, reach: { x, y: frame.bottom } }];
    }

    return [];
  });

  return [{ id: vault.id, of: 'triple', x: vault.x, y: vault.y }, ...spots];
}

/**
 * Where a deposit's fees' amount stands on the row they are shared out
 * along, from the moment they are taken: the middle of the widest gap
 * between the vaults they go into, where it has the most room, the
 * protocol's share to hang under it.
 */
function rowAtOf(spots: readonly PlanePoint[]): number | undefined {
  const xs = spots.map((spot) => spot.x).sort((a, b) => a - b);
  const widest = xs
    .slice(1)
    .reduce<{ from: number; to: number } | undefined>((best, to, index) => {
      const from = xs[index] ?? to;

      return best === undefined || to - from > best.to - best.from
        ? { from, to }
        : best;
    }, undefined);

  return widest === undefined ? undefined : (widest.from + widest.to) / 2;
}

/**
 * A deposit's fees shared out, from the fee `from`, on a layout left alone
 * with the triple: the vaults of its three terms hang beside its own (see
 * `shareSpotsIn`), as large as every vault. A share goes into each, and the
 * entry fee into the triple's own vault; the protocol's goes to the
 * protocol, under the fees' amount: its share level with `level`, where
 * the builder's fee stands, the Intuition logo under it.
 */
function sharedIn(
  layout: Placed,
  shared: PlaneShared,
  triple: PlaneTriple | undefined,
  from: string,
  level: OnLine,
): Placed {
  const spots = shareSpotsIn(layout, triple);
  const [own] = spots;
  if (own === undefined) {
    return layout;
  }

  return {
    ...layout,
    sharedFrom: from,
    feeShares: spots.map((spot) => ({
      ...spot,
      gain: spot.id === own.id ? shared.entry : shared.perTerm,
    })),
    protocolFee: { ...shared.protocol, level },
  };
}

/** A layout moved so its middle, along the line, is at 0. */
function centred(layout: PlaneLayout): Placed {
  return shifted(layout, -layout.width / 2);
}

function isSameEnd(a: PlaneEnd, b: PlaneEnd): boolean {
  return 'atom' in a
    ? 'atom' in b && a.atom === b.atom
    : 'frame' in b && a.frame === b.frame;
}

function isSameBond(a: PlaneBond, b: PlaneBond): boolean {
  return a.id === b.id && isSameEnd(a.from, b.from) && isSameEnd(a.to, b.to);
}

/** Where a piece of text stands: centred on `x`, `y` down from the line. */
interface Spot {
  text: string;
  x: number;
  y: number;
}

/**
 * The plane `t` of the way from one beat's claim to the next, `t` running
 * evenly from 0 to 1: each stage eases on its own. Either claim can be
 * `null`, for a plane opening or closing. `measureText` gives a piece of
 * text's width at a name's size, in plane units. With `fit`, the claim the
 * beats build to, each claim stands where that one will: its first atom
 * where it stands there, so the claim only grows along the line and never
 * shifts; and the plane sizes itself by it, once. `durationMs`, how long
 * the change takes, times what is staggered in it.
 */
export function planeAt(
  from: PlaneClaim | null,
  to: PlaneClaim | null,
  t: number,
  measureText: (text: string) => number,
  labelOf: (atom: AtomId) => string,
  fit: PlaneClaim | null = null,
  durationMs = 0,
): BlendedPlane {
  const measure = (atom: AtomId): number => measureText(labelOf(atom));
  const space = measureText(' ');
  const { padding, chevrons } = PLANE.picker;
  const pickerWidth = (claim: PlaneClaim | null): number | undefined =>
    claim?.perspective === undefined
      ? undefined
      : Math.max(...claim.perspective.options.map(measureText)) +
        padding * 3 +
        chevrons;
  const fitLayout =
    fit === null
      ? null
      : centred(
          layoutPlane(fit.term, measure, {
            branches: fit.branches,
            frame: fit.frame,
            vaults: fit.vaults,
            pickerWidth: pickerWidth(fit),
            space,
          }),
        );
  // The final claim without what rises from it or hangs below it: up and
  // down, every step stands as it will, and moves only to make room above
  // or below it.
  const fitClaim =
    fit === null
      ? null
      : layoutPlane(fit.term, measure, { frame: fit.frame, space });
  // The row the final claim's branches stand on, so each stands there
  // from the start.
  const branchRow = fitLayout?.branchRow;
  const lay = (claim: PlaneClaim | null): Placed | null => {
    if (claim === null) {
      return null;
    }
    const layout = layoutPlane(claim.term, measure, {
      spelled: claim.spelled,
      folded: claim.folded,
      branches: claim.branches,
      frame: claim.frame,
      vaults: claim.vaults,
      branchRow,
      pickerWidth: pickerWidth(claim),
      space,
    });
    const first = layout.atoms[0];
    const there = fitLayout?.atoms.find((atom) => atom.id === first?.id);

    return aloneIn(
      first === undefined || there === undefined
        ? centred(layout)
        : shifted(layout, there.x - first.x),
      claim,
    );
  };
  const before = lay(from);
  const after = lay(to);
  const isMade = (claim: PlaneClaim | null, id: AtomId): boolean =>
    !(claim?.spelled?.includes(id) ?? false);
  const madeIn = (claim: PlaneClaim | null, layout: PlaneLayout | null) =>
    (layout?.atoms ?? []).filter((atom) => isMade(claim, atom.id));

  const stages = stagesOf(from, to, after);
  // Leaving one person alone, what goes goes where it stands on the screen,
  // as the plane moves on round it.
  const isClearing = stages === STAGES.clearing;
  const lead = through(stages.lead, t);
  const write = through(stages.write, t);
  const leave = through(stages.leave, t);
  const move = through(stages.move, t);
  const form = through(stages.frames, t);
  const down = through(stages.down, t);
  const arrive = through(stages.atoms, t);
  const pill = through(stages.pills, t);
  const grow = through(stages.lines, t);
  const roles = through(stages.roles, t);
  const weigh = through(stages.weights, t);
  const rank = through(stages.ranks, t);
  const totalling = through(stages.totals, t);
  const reweigh = through(stages.reweigh, t);
  const [leaveStart, leaveEnd] = stages.leave;
  const retract = through([leaveStart, (leaveStart + leaveEnd) / 2], t);
  /**
   * How much of a part of a deposit shows, held back or not, as one claim
   * says and the next: held back, only `PLANE.deposit.held` of it, as what
   * leaves goes.
   */
  const heldBack = (was?: boolean, is?: boolean): number =>
    lerp(
      was === true ? PLANE.deposit.held : 1,
      is === true ? PLANE.deposit.held : 1,
      leave,
    );
  /** How far a thing shown or not, as one claim says and the next, shows. */
  const shift = (was: boolean, is: boolean, progress: number): number =>
    was === is ? (is ? 1 : 0) : is ? progress : 1 - progress;
  // An atom set back, and a line from one, fades as what leaves goes, but
  // only so far; and comes back as the plane closes.
  const isFaded = (claim: PlaneClaim | null, end: PlaneEnd): boolean =>
    'atom' in end && (claim?.faded?.includes(end.atom) ?? false);
  const fadedAtom = (id: AtomId): number =>
    shift(isFaded(from, { atom: id }), isFaded(to, { atom: id }), leave);
  const fadedBond = (bond: PlaneBond): number =>
    shift(
      isFaded(from, bond.from) || isFaded(from, bond.to),
      isFaded(to, bond.from) || isFaded(to, bond.to),
      leave,
    );
  // One that leaves a plane that stays goes as it was, set back or not; as
  // the plane closes, it comes back as it goes.
  const fadedLeaving = (faded: number, wasFaded: boolean): number =>
    to === null ? faded : wasFaded ? 1 : 0;

  // The words: in one line in their frame, then broken into their parts,
  // which then move down to where their atoms' names go.
  const spotsOf = (
    claim: PlaneClaim | null,
    layout: PlaneLayout | null,
  ): Map<string, Spot> =>
    new Map(
      (claim?.spelled ?? []).map((id) => [
        id,
        {
          text: labelOf(id),
          x: layout?.atoms.find((atom) => atom.id === id)?.x ?? 0,
          y: 0,
        },
      ]),
    );
  const oldSpots = spotsOf(from, before);
  const newSpots = spotsOf(to, after);
  // The atoms made: what was there moves, what is new arrives in its shape.
  const oldMade = madeIn(from, before);
  const newMade = madeIn(to, after);
  // Opening, the claim's first atom leads, and the rest follow.
  const leader = from === null ? after?.atoms[0]?.id : undefined;
  // A ranked list's members show their ranks once they stand in order.
  const ranked = shift(
    listOf(from)?.isRanked === true,
    listOf(to)?.isRanked === true,
    rank,
  );
  // A member that changes place in a ranked list changes its rank: the old
  // one goes, then the new one comes.
  const rankedAs = (
    was: number | undefined,
    is: number | undefined,
  ): { rank?: number; ranked: number } =>
    is === undefined
      ? { ranked: 0 }
      : was === undefined || was === is
        ? { rank: is, ranked }
        : rank < 0.5
          ? { rank: was, ranked: 1 - rank * 2 }
          : { rank: is, ranked: rank * 2 - 1 };
  const atoms: BlendedAtom[] = newMade.map((atom) => {
    const was = oldMade.find((old) => old.id === atom.id);

    return was === undefined
      ? {
          ...atom,
          presence: atom.id === leader ? lead : arrive,
          fromRole: atom.role,
          roleProgress: 1,
          // An atom made from a word takes the word, in place, as its name.
          named: oldSpots.has(atom.id) ? 0 : 1,
          ranked: atom.rank === undefined ? 0 : ranked,
          faded: fadedAtom(atom.id),
        }
      : {
          ...atom,
          x: lerp(was.x, atom.x, move),
          y: lerp(was.y, atom.y, move),
          width: lerp(was.width, atom.width, move),
          presence: 1,
          fromRole: was.role,
          roleProgress: roles,
          named: 1,
          ...rankedAs(was.rank, atom.rank),
          faded: fadedAtom(atom.id),
        };
  });
  for (const atom of oldMade) {
    if (!newMade.some((next) => next.id === atom.id)) {
      atoms.push({
        ...atom,
        presence: 1 - leave,
        fromRole: atom.role,
        roleProgress: 1,
        named: 1,
        // The first to go, as lines draw back.
        ranked: atom.rank === undefined ? 0 : 1 - retract,
        ...(isClearing ? { keepsRow: true } : {}),
        faded: fadedLeaving(
          fadedAtom(atom.id),
          isFaded(from, { atom: atom.id }),
        ),
      });
    }
  }

  // The whole claim's frame, where the claim hides it, goes as what leaves
  // goes; its room stays.
  const isShown = (claim: PlaneClaim | null, frame: PlaneFrame): boolean =>
    claim?.isFrameHidden !== true ||
    !('triple' in claim.term) ||
    claim.term.triple.id !== frame.id;
  const frames: BlendedFrame[] = (after?.frames ?? []).map((frame) => {
    const was = before?.frames.find((old) => old.id === frame.id);

    return was === undefined
      ? { ...frame, presence: isShown(to, frame) ? form : 0 }
      : {
          ...frame,
          x: lerp(was.x, frame.x, move),
          width: lerp(was.width, frame.width, move),
          top: lerp(was.top, frame.top, move),
          bottom: lerp(was.bottom, frame.bottom, move),
          presence: shift(isShown(from, was), isShown(to, frame), leave),
        };
  });
  for (const frame of before?.frames ?? []) {
    if (!(after?.frames ?? []).some((next) => next.id === frame.id)) {
      frames.push({
        ...frame,
        presence: isShown(from, frame) ? 1 - leave : 0,
      });
    }
  }
  // Outermost first: of two nested frames, the wider holds the other.
  frames.sort((a, b) => b.width - a.width);

  // A line is drawn between atoms made, or to a frame: never to a word.
  // One that joins the same as before stays; one that joins something else
  // draws back as what is there moves; new ones grow once everything is in
  // place, one after another from the subject on, as one stroke.
  const drawnIn = (claim: PlaneClaim | null, layout: PlaneLayout | null) =>
    (layout?.bonds ?? []).filter((bond) =>
      [bond.from, bond.to].every(
        (end) => !('atom' in end) || isMade(claim, end.atom),
      ),
    );
  const oldBonds = drawnIn(from, before);
  const newBonds = drawnIn(to, after);
  const growing = newBonds.filter(
    (bond) => !oldBonds.some((old) => isSameBond(old, bond)),
  );
  const grown = after === null ? [] : growInTurn(growing, after, grow);
  const bonds: BlendedBond[] = [
    ...oldBonds.map((bond) => {
      const isKept = newBonds.some((next) => isSameBond(next, bond));

      return {
        ...bond,
        presence: isKept ? 1 : 1 - retract,
        faded: isKept
          ? fadedBond(bond)
          : fadedLeaving(
              fadedBond(bond),
              isFaded(from, bond.from) || isFaded(from, bond.to),
            ),
      };
    }),
    ...growing.map((bond, index) => ({
      ...bond,
      presence: grown[index] ?? grow,
      faded: fadedBond(bond),
    })),
  ];
  // A list's weights, as the list says; the first to go as it closes, as
  // lines draw back.
  const listWeighed = shift(
    listOf(from)?.isWeighed === true,
    listOf(to)?.isWeighed === true,
    weigh,
  );
  const weights: BlendedWeight[] =
    after === null
      ? (before?.weights ?? []).map((weight) => ({
          ...weight,
          weighed: listOf(from)?.isWeighed === true ? 1 - retract : 0,
        }))
      : after.weights.map((weight) => {
          const was = before?.weights.find((old) => old.id === weight.id);

          return {
            ...weight,
            value: Math.round(
              lerp(was?.value ?? weight.value, weight.value, reweigh),
            ),
            weighed: listWeighed,
          };
        });

  // A triple's vaults: the people arrive, then their lines grow from them up
  // to the claim, one after another (see `vaultGrowth`). A position shows,
  // or a side takes its color, as the claim says.
  const oldVaults = from?.vaults;
  const newVaults = to?.vaults;
  const weighed = shift(
    oldVaults?.isWeighed === true,
    newVaults?.isWeighed === true,
    weigh,
  );
  const totalled = shift(
    oldVaults?.isTotalled === true,
    newVaults?.isTotalled === true,
    totalling,
  );
  const growth = vaultGrowth(after?.vaultLines ?? [], stages.lines, durationMs);
  const vaultLines: BlendedVaultLine[] = (after?.vaultLines ?? []).map(
    (line) => {
      const isThere = (before?.vaultLines ?? []).some(
        (old) => old.id === line.id,
      );

      const was = before?.vaultLines.find((old) => old.id === line.id);
      const { weightAt } = PLANE.vaults;
      return {
        ...line,
        presence: isThere ? 1 : growth(line, t),
        totalled,
        // Held back, light, as the deposit's fees are followed on: the line
        // and the position on it.
        weighed: weighed * heldBack(was?.isHeld, line.isHeld),
        strength: heldBack(was?.isHeld, line.isHeld),
        // Its position moves along it as what is there moves.
        weightAt: lerp(
          was?.weightAt ?? weightAt,
          line.weightAt ?? weightAt,
          move,
        ),
      };
    },
  );
  // A line that goes takes its position and total with it, as it draws back.
  // Going from beside the one left alone, only its stretch from its person
  // to where their side's lines meet draws back: the rest goes at once, so
  // it never doubles the line that stays, where they ran together. Its
  // total goes as every number does.
  const aloneSide = to?.alone?.side;
  for (const line of before?.vaultLines ?? []) {
    if (!vaultLines.some((next) => next.id === line.id)) {
      const isBeside = isClearing && line.side === aloneSide;
      vaultLines.push({
        ...line,
        ...(isBeside ? { points: line.points.slice(0, 2) } : {}),
        presence: 1 - retract,
        totalled: oldVaults?.isTotalled === true ? 1 - retract : 0,
        weighed:
          oldVaults?.isWeighed === true
            ? (1 - retract) * (line.isHeld === true ? PLANE.deposit.held : 1)
            : 0,
        strength: line.isHeld === true ? PLANE.deposit.held : 1,
        ...(isClearing ? { isGoing: true } : {}),
      });
    }
  }
  // A deposit followed up its line, turn by turn over the stage that grows
  // lines: on a fee's turn, its icon comes in, the line from it to its
  // amount grows, and its amount shows; on an amount's turn, it shows. What
  // was there stays; as the plane closes, it goes as what leaves goes.
  const turns =
    Math.max(
      -1,
      ...(after?.depositFees ?? []).flatMap((fee) => [
        fee.turn,
        fee.app?.turn ?? fee.turn,
      ]),
      ...(after?.depositAmounts ?? []).map((amount) => amount.turn),
    ) + 1;
  const [turnsStart, turnsEnd] = stages.lines;
  const turnOf = (turn: number): number =>
    turnsEnd > turnsStart
      ? Math.min(
          Math.max(
            ((t - turnsStart) / (turnsEnd - turnsStart)) * turns - turn,
            0,
          ),
          1,
        )
      : t >= turnsEnd
        ? 1
        : 0;
  const { icon: iconPart, branch: branchPart, amount: amountPart } = FEE_TURN;
  const depositFees: BlendedDepositFee[] = (after?.depositFees ?? []).map(
    (fee) => {
      const was = before?.depositFees.find((old) => old.id === fee.id);
      if (was !== undefined) {
        return {
          ...fee,
          icon: 1,
          branch: 1,
          shown: 1,
          strength: heldBack(was.isHeld, fee.isHeld),
          appLine: fee.app === undefined ? 0 : 1,
          appIcon: fee.app === undefined ? 0 : 1,
        };
      }
      const into = turnOf(fee.turn);
      const intoApp = fee.app === undefined ? 0 : turnOf(fee.app.turn);

      return {
        ...fee,
        icon: through(iconPart, into),
        branch: through(branchPart, into),
        shown: through(amountPart, into),
        strength: 1,
        appLine: through(APP_TURN.line, intoApp),
        appIcon: through(APP_TURN.app, intoApp),
      };
    },
  );
  for (const fee of before?.depositFees ?? []) {
    if (!depositFees.some((next) => next.id === fee.id)) {
      depositFees.push({
        ...fee,
        icon: 1 - leave,
        branch: 1 - retract,
        shown: 1 - leave,
        strength: fee.isHeld === true ? PLANE.deposit.held : 1,
        appLine: fee.app === undefined ? 0 : 1 - retract,
        appIcon: fee.app === undefined ? 0 : 1 - leave,
      });
    }
  }
  const depositAmounts: BlendedDepositAmount[] = (
    after?.depositAmounts ?? []
  ).map((amount) => {
    const was = before?.depositAmounts.find((old) => old.id === amount.id);

    return {
      ...amount,
      shown:
        was === undefined
          ? through([0, 1], turnOf(amount.turn))
          : heldBack(was.isHeld, amount.isHeld),
    };
  });
  for (const amount of before?.depositAmounts ?? []) {
    if (!depositAmounts.some((next) => next.id === amount.id)) {
      // Going as the plane closes, as light as it was held back.
      depositAmounts.push({
        ...amount,
        shown: (1 - leave) * (amount.isHeld === true ? PLANE.deposit.held : 1),
      });
    }
  }
  // A deposit's fees shared out: a term's vault arrives under it, the lines
  // grow from the fees' amount, and each share shows; as the plane closes,
  // they go as what leaves goes.
  const feeShares: BlendedFeeShare[] = (after?.feeShares ?? []).map((share) =>
    (before?.feeShares ?? []).some((old) => old.id === share.id)
      ? { ...share, presence: 1, grown: 1, shown: 1 }
      : { ...share, presence: arrive, grown: grow, shown: weigh },
  );
  for (const share of before?.feeShares ?? []) {
    if (!feeShares.some((next) => next.id === share.id)) {
      feeShares.push({
        ...share,
        presence: 1 - leave,
        grown: 1 - retract,
        shown: 1 - leave,
      });
    }
  }
  const protocolFee =
    after?.protocolFee !== undefined
      ? {
          ...after.protocolFee,
          ...(before?.protocolFee === undefined
            ? { presence: arrive, grown: grow, shown: weigh }
            : { presence: 1, grown: 1, shown: 1 }),
        }
      : before?.protocolFee !== undefined
        ? {
            ...before.protocolFee,
            presence: 1 - leave,
            grown: 1 - retract,
            shown: 1 - leave,
          }
        : null;
  // The vault arrives with the people.
  const vaults: BlendedVault[] = (after?.vaults ?? []).map((vault) => ({
    ...vault,
    presence: (before?.vaults ?? []).some((old) => old.id === vault.id)
      ? 1
      : arrive,
  }));
  for (const vault of before?.vaults ?? []) {
    if (!vaults.some((next) => next.id === vault.id)) {
      vaults.push({ ...vault, presence: 1 - leave });
    }
  }
  const people: BlendedPerson[] = (after?.people ?? []).map((person) => {
    const was = before?.people.find((old) => old.id === person.id);

    return {
      ...person,
      presence: was === undefined ? arrive : 1,
      // Held back, light, as the deposit's fees are followed on.
      strength: heldBack(was?.isHeld, person.isHeld),
    };
  });
  for (const person of before?.people ?? []) {
    if (!people.some((next) => next.id === person.id)) {
      people.push({
        ...person,
        presence: 1 - leave,
        strength: person.isHeld === true ? PLANE.deposit.held : 1,
        ...(isClearing ? { isStill: true } : {}),
      });
    }
  }

  // The menu of perspectives: it shows; or, choosing another, it opens,
  // moves to it, and closes on it, which shows from then on.
  const pickerAt = (): BlendedPicker | null => {
    const was = from?.perspective;
    const is = to?.perspective;
    const box = after?.picker;
    if (is === undefined || box === undefined) {
      const left = before?.picker;

      return was === undefined || left === undefined
        ? null
        : {
            ...left,
            options: was.options,
            chosen: was.chosen,
            presence: 1 - leave,
            open: 0,
            highlight: was.chosen,
          };
    }
    const old = before?.picker;
    const placed =
      old === undefined
        ? box
        : {
            ...box,
            x: lerp(old.x, box.x, move),
            y: lerp(old.y, box.y, move),
            frame: {
              x: lerp(old.frame.x, box.frame.x, move),
              y: lerp(old.frame.y, box.frame.y, move),
              width: lerp(old.frame.width, box.frame.width, move),
              height: lerp(old.frame.height, box.frame.height, move),
            },
          };
    if (was === undefined || was.chosen === is.chosen) {
      return {
        ...placed,
        options: is.options,
        chosen: is.chosen,
        presence: was === undefined ? through(stages.pick, t) : 1,
        open: 0,
        highlight: is.chosen,
      };
    }
    const [start, end] = stages.pick;
    const along =
      end > start ? Math.min(Math.max((t - start) / (end - start), 0), 1) : 1;
    const closing = through(PICKING.close, along);

    return {
      ...placed,
      options: is.options,
      chosen: closing > 0 ? is.chosen : was.chosen,
      presence: 1,
      open: through(PICKING.open, along) * (1 - closing),
      highlight: lerp(was.chosen, is.chosen, through(PICKING.highlight, along)),
    };
  };

  const words: BlendedWords[] = [];
  for (const [id, spot] of oldSpots) {
    const next = newSpots.get(id);
    const made = newMade.find((atom) => atom.id === id);
    if (next !== undefined) {
      words.push({
        id,
        text: spot.text,
        x: lerp(spot.x, next.x, move),
        y: lerp(spot.y, next.y, move),
        alpha: 1,
        pill: 0,
      });
    } else if (made !== undefined) {
      // Down to where its atom's name goes; then, its atom above it, it
      // grows a pill and is its name.
      words.push({
        id,
        text: spot.text,
        x: lerp(spot.x, made.x, down),
        y: lerp(spot.y, NAME_Y, down),
        alpha: 1,
        pill,
      });
    } else {
      words.push({ id, ...spot, alpha: 1 - leave, pill: 0 });
    }
  }
  for (const [id, spot] of newSpots) {
    if (!oldSpots.has(id)) {
      words.push({ id, ...spot, alpha: write, pill: 0 });
    }
  }

  const edge = (of: (layout: Placed) => number): number =>
    lerp(
      before === null ? (after === null ? 0 : of(after)) : of(before),
      after === null ? (before === null ? 0 : of(before)) : of(after),
      before === null ? 1 : move,
    );

  return {
    atoms,
    frames,
    bonds,
    weights,
    vaultLines,
    vaults,
    people,
    depositFees,
    depositAmounts,
    sharedFrom: after?.sharedFrom ?? before?.sharedFrom ?? null,
    feeShares,
    protocolFee,
    words,
    picker: pickerAt(),
    left: edge((layout) => layout.left),
    right: edge((layout) => layout.left + layout.width),
    top: edge((layout) =>
      fitClaim === null
        ? layout.top
        : Math.min(
            fitClaim.top,
            ...layout.atoms
              .filter((atom) => atom.y < 0)
              .map((atom) => atom.y + ATOM_TOP),
            layout.picker?.y ?? 0,
          ),
    ),
    // Down, as the claim will stand, or lower, for what hangs below it.
    bottom: edge((layout) =>
      fitClaim === null
        ? layout.bottom
        : Math.max(fitClaim.bottom, layout.bottom),
    ),
    fit:
      fitLayout === null
        ? null
        : {
            width: fitLayout.width,
            top: fitLayout.top,
            bottom: fitLayout.bottom,
            xs: new Map(fitLayout.atoms.map((atom) => [atom.id, atom.x])),
          },
    settle: move,
  };
}
