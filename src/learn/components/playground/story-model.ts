/**
 * The playground's story: a short film in chapters, told one beat at a
 * time, each with a caption. Pure, so it is tested without a canvas.
 *
 * The whole film is a function of one number, the time. The atoms stand on
 * a sphere, the cloud, which turns to show each beat. Each beat leaves the
 * scene in a state of its own: where each atom stands, the role it plays,
 * which triples are drawn and which way the cloud faces. The scene at any
 * moment is the previous beat's state moving toward the current one's. So
 * playing, pausing, scrubbing back and stepping forward are one operation,
 * and the picture cannot drift away from the caption.
 */

import type { ROLE_COLOURS } from './story-shapes';
import {
  arcPoint,
  axisAngle,
  FRONT,
  multiply,
  type Quat,
  type Vec3,
} from '@/lib/sphere';

import {
  HANGING_RISE,
  type PlaneBranch,
  type PlaneClaim,
  type PlaneDeposit,
  type PlaneList,
  type PlaneTerm,
  type PlaneVaults,
  amountOf,
  planeSentence,
  tripleIn,
} from './story-plane';

/**
 * The shape an atom is drawn as, and its colour: the role it plays in its
 * triples. Circle, triangle, square, as in the field behind the page: the
 * subject, the predicate, the object. An atom on its own is drawn as a
 * circle. One that is the object of a triple and the subject of another is
 * drawn as both at once: a hexagon, between the circle and the square, in a
 * colour between theirs. The same four as the field behind the page.
 */
export type Role = keyof typeof ROLE_COLOURS;

/**
 * The camera: the direction of the cloud that faces the viewer, and how
 * close it is. At zoom 1 a triple spans a wide screen, and more is closer.
 * `focus` is where it turns when the screen is too narrow to show all it is
 * asked to: the part of the scene the beat is about.
 */
export interface Camera {
  readonly facing: Vec3;
  readonly zoom: number;
  readonly focus?: Vec3;
  /**
   * How far, 0 to 1, the camera has pulled back to show the whole cloud,
   * on any screen, whether its names can stay apart or not.
   */
  readonly whole?: number;
  /** How far up the picture is moved, as a share of the cloud's radius. */
  readonly raise?: number;
  /**
   * How far right the picture is moved, as a share of the cloud's radius:
   * left, where it is less than 0.
   */
  readonly shift?: number;
}

/** The atoms the story uses. */
export const ATOMS = {
  elonMusk: { label: 'Elon Musk' },
  spacex: { label: 'SpaceX' },
  founderOf: { label: 'founder of' },
  owns: { label: 'owns' },
  xai: { label: 'xAI' },
  best: { label: 'best' },
  aiCompany: { label: 'AI company' },
  believes: { label: 'believes' },
  willBeWorth: { label: 'will be worth' },
  ordersOfMagnitude: { label: 'orders of magnitude' },
  moreThan: { label: 'more than' },
  currentEarthEconomy: { label: 'current Earth economy' },
  estimatedAt: { label: 'estimated at' },
  hundredTrillion: { label: '$100+ trillion' },
  sourcedBy: { label: 'sourced by' },
  tweet: { label: 'Tweet' },
  openai: { label: 'OpenAI' },
  anthropic: { label: 'Anthropic' },
  ai: { label: 'AI' },
  is: { label: 'is' },
  dangerous: { label: 'dangerous' },
  outOfControl: { label: 'out of control' },
  willRemove: { label: 'will remove' },
  jobs: { label: 'jobs' },
  threatens: { label: 'threatens' },
  peace: { label: 'peace' },
  // The way on: the film's last triple, a call to the viewer.
  civilization: { label: 'civilization shall' },
  startBuilding: { label: 'start building' },
  futureOfInformation: { label: 'the future of information' },
  // The two perspectives' further claims, only on the two globes.
  democrats: { label: 'Democrats' },
  callFor: { label: 'call for' },
  pauseOnAdvancedAi: { label: 'a pause on advanced AI' },
  banOnSuperintelligence: { label: 'a ban on superintelligence' },
  reposted: { label: 'reposted' },
  democracy: { label: 'democracy' },
  spreads: { label: 'spreads' },
  misinformation: { label: 'misinformation' },
  deepfakes: { label: 'Deepfakes' },
  undermine: { label: 'undermine' },
  elections: { label: 'elections' },
  dataCenters: { label: 'Data centers' },
  strain: { label: 'strain' },
  powerGrid: { label: 'the power grid' },
  superintelligence: { label: 'Superintelligence' },
  poses: { label: 'poses' },
  existentialRisk: { label: 'an existential risk' },
  lessThanTheHype: { label: 'less than the hype' },
  willCure: { label: 'will cure' },
  diseases: { label: 'diseases' },
  creates: { label: 'creates' },
  newJobs: { label: 'new jobs' },
  speedsUp: { label: 'speeds up' },
  science: { label: 'science' },
  alphafold: { label: 'AlphaFold' },
  solved: { label: 'solved' },
  proteinFolding: { label: 'protein folding' },
  aiTutors: { label: 'AI tutors' },
  teach: { label: 'teach' },
  everyChild: { label: 'every child' },
  selfDrivingCars: { label: 'Self-driving cars' },
  save: { label: 'save' },
  lives: { label: 'lives' },
  researches: { label: 'researches' },
  aiSafety: { label: 'AI safety' },
  unlocks: { label: 'unlocks' },
  newMedicines: { label: 'new medicines' },
  outnumber: { label: 'outnumber' },
  jobsLost: { label: 'jobs lost' },
} as const satisfies Record<string, { label: string }>;

export type AtomId = keyof typeof ATOMS;

/**
 * A triple's atoms. Where a whole triple is the subject or the object, the
 * line meets it at its predicate, and the triple is named.
 */
interface TripleAtoms {
  subject: AtomId;
  predicate: AtomId;
  object: AtomId;
  subjectTriple?: string;
  objectTriple?: string;
}

/** The triples the story draws. */
export const TRIPLES = {
  elonFoundedSpacex: {
    subject: 'elonMusk',
    predicate: 'founderOf',
    object: 'spacex',
  },
  spacexOwnsXai: {
    subject: 'spacex',
    predicate: 'owns',
    object: 'xai',
  },
  xaiBestAiCompany: {
    subject: 'xai',
    predicate: 'best',
    object: 'aiCompany',
  },
  openaiBestAiCompany: {
    subject: 'openai',
    predicate: 'best',
    object: 'aiCompany',
  },
  anthropicBestAiCompany: {
    subject: 'anthropic',
    predicate: 'best',
    object: 'aiCompany',
  },
  // The nested triples, as the cloud holds them in the end.
  moreThanEconomy: {
    subject: 'ordersOfMagnitude',
    predicate: 'moreThan',
    object: 'currentEarthEconomy',
  },
  spacexWorth: {
    subject: 'spacex',
    predicate: 'willBeWorth',
    object: 'moreThan',
    objectTriple: 'orders of magnitude more than current Earth economy',
  },
  elonBelieves: {
    subject: 'elonMusk',
    predicate: 'believes',
    object: 'willBeWorth',
    objectTriple:
      'SpaceX will be worth orders of magnitude more than current Earth economy',
  },
  economyEstimated: {
    subject: 'currentEarthEconomy',
    predicate: 'estimatedAt',
    object: 'hundredTrillion',
  },
  beliefSourced: {
    subject: 'believes',
    predicate: 'sourcedBy',
    object: 'tweet',
    subjectTriple: 'what Elon Musk believes',
  },
  aiIsDangerous: {
    subject: 'ai',
    predicate: 'is',
    object: 'dangerous',
  },
  aiIsOutOfControl: {
    subject: 'ai',
    predicate: 'is',
    object: 'outOfControl',
  },
  aiRemovesJobs: {
    subject: 'ai',
    predicate: 'willRemove',
    object: 'jobs',
  },
  aiThreatensPeace: {
    subject: 'ai',
    predicate: 'threatens',
    object: 'peace',
  },
  // The way on, the film's last triple.
  civilizationStartBuilding: {
    subject: 'civilization',
    predicate: 'startBuilding',
    object: 'futureOfInformation',
  },
  // The pessimists' further claims, on their globe.
  democratsCallForPause: {
    subject: 'democrats',
    predicate: 'callFor',
    object: 'pauseOnAdvancedAi',
  },
  democratsCallForBan: {
    subject: 'democrats',
    predicate: 'callFor',
    object: 'banOnSuperintelligence',
  },
  elonRepostedPause: {
    subject: 'elonMusk',
    predicate: 'reposted',
    object: 'callFor',
    objectTriple: 'Democrats call for a pause on advanced AI',
  },
  aiThreatensDemocracy: {
    subject: 'ai',
    predicate: 'threatens',
    object: 'democracy',
  },
  aiSpreadsMisinformation: {
    subject: 'ai',
    predicate: 'spreads',
    object: 'misinformation',
  },
  deepfakesUndermineElections: {
    subject: 'deepfakes',
    predicate: 'undermine',
    object: 'elections',
  },
  dataCentersStrainGrid: {
    subject: 'dataCenters',
    predicate: 'strain',
    object: 'powerGrid',
  },
  superintelligencePosesRisk: {
    subject: 'superintelligence',
    predicate: 'poses',
    object: 'existentialRisk',
  },
  aiWorthLessThanHype: {
    subject: 'ai',
    predicate: 'willBeWorth',
    object: 'lessThanTheHype',
  },
  // The optimists' further claims, on theirs.
  aiWillCureDiseases: {
    subject: 'ai',
    predicate: 'willCure',
    object: 'diseases',
  },
  aiCreatesNewJobs: {
    subject: 'ai',
    predicate: 'creates',
    object: 'newJobs',
  },
  aiSpeedsUpScience: {
    subject: 'ai',
    predicate: 'speedsUp',
    object: 'science',
  },
  alphafoldSolvedFolding: {
    subject: 'alphafold',
    predicate: 'solved',
    object: 'proteinFolding',
  },
  tutorsTeachEveryChild: {
    subject: 'aiTutors',
    predicate: 'teach',
    object: 'everyChild',
  },
  carsSaveLives: {
    subject: 'selfDrivingCars',
    predicate: 'save',
    object: 'lives',
  },
  anthropicResearchesSafety: {
    subject: 'anthropic',
    predicate: 'researches',
    object: 'aiSafety',
  },
  proteinFoldingUnlocksMedicines: {
    subject: 'proteinFolding',
    predicate: 'unlocks',
    object: 'newMedicines',
  },
  newJobsOutnumberJobsLost: {
    subject: 'newJobs',
    predicate: 'outnumber',
    object: 'jobsLost',
  },
} as const satisfies Record<string, TripleAtoms>;

export type TripleId = keyof typeof TRIPLES;

export const CHAPTERS = [
  { id: 'atoms', title: 'Atoms' },
  { id: 'triples', title: 'Triples' },
  { id: 'nested', title: 'Nested triples' },
  { id: 'vaults', title: 'Vaults' },
  { id: 'fees', title: 'Fees' },
  { id: 'lists', title: 'Lists' },
  { id: 'perspectives', title: 'Perspectives' },
  { id: 'enrichment', title: 'Enrichment' },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]['id'];

/**
 * Part of a caption: plain words, where `\n` starts a new line, a role
 * named beside its shape, or a link.
 */
export type CaptionPart =
  | string
  | { role: Role; text: string }
  /** Words that open a page elsewhere, in a new tab. */
  | { href: string; text: string };

/**
 * When, within a beat's motion, a change happens: the share of the motion it
 * starts at and the share it is done by, each from 0 to 1. Staggering them
 * is what makes a beat read as one thing after another.
 */
type During = readonly [start: number, end: number];

interface AtomState {
  /** A direction from the cloud's centre. */
  at: Vec3;
  role: Role;
  /** When it moves, or arrives. */
  during?: During;
  /**
   * When it takes its role, when that is not when it moves. An atom that
   * arrives with this arrives as a plain atom, and takes its role later in
   * the same beat: as a line reaches it, say.
   */
  roleDuring?: During;
}

/** The scene as a beat leaves it. */
/** A claim opened on the plane, and the part of it to keep in view. */
export interface PlaneState extends PlaneClaim {
  /**
   * The chip or frame a narrow screen follows: the part the beat is about,
   * as a narrow screen follows the newest triple in the cloud. Or two, to
   * follow the middle between them.
   */
  focus: string | readonly [string, string];
  /** Whether every screen, not only a narrow one, centres the focus. */
  isFocusCentred?: boolean;
  /**
   * Whether the claim stands a little lower than the middle: one line,
   * with the cloud risen above it, and the room under it otherwise empty.
   */
  isLowered?: boolean;
  /** Whether the claim stands at the very top, the room under it free. */
  isRaised?: boolean;
}

interface StageState {
  /**
   * The camera, when it moves, and whether it pans to get there: round the
   * vertical, as a camera on a tripod does, rather than the shortest way.
   * For a half turn, which the shortest way would take over the top of the
   * cloud, flipping the picture as it passes.
   */
  camera: Camera & { during?: During; isPanning?: boolean };
  atoms: Partial<Record<AtomId, AtomState>>;
  triples: Partial<Record<TripleId, { during?: During }>>;
  /** The plane opened in front of the cloud, or none. */
  plane?: PlaneState & { during?: During };
  /** How far the cloud behind the plane is out of focus, 0 to 1. */
  depth?: number;
  /**
   * Whether the cloud's dots hold still: behind a plane with a claim of its
   * own, the cloud's lines are a reminder.
   */
  isCloudStill?: boolean;
  /**
   * How much of the cloud shows, 0 to 1, and when that changes: all of it,
   * unless a beat takes it away.
   */
  cloud?: { shown: number; during?: During };
  /**
   * An atom's vault, under its name, and people depositing into it: when
   * the vault and the people arrive, when their lines grow up to it, and
   * when its own line grows on to the atom. Every atom has one. It all
   * goes as the next beat starts.
   */
  vault?: {
    atom: AtomId;
    during: During;
    deposits: During;
    onward: During;
  };
  /** Atoms the cloud shows set back: there, but in none of its triples. */
  setBack?: readonly AtomId[];
  /** When the atoms it sets back step back, when not over the whole beat. */
  setBackDuring?: During;
  /**
   * The wider graph round the story's: more atoms, set back, in none of
   * its triples, and when they come (see `CROWD`).
   */
  crowd?: During;
  /**
   * Atoms shown quieter than the rest, so the one the beat is about stands
   * out, and when they quieten.
   */
  quiet?: { atoms: readonly AtomId[]; during?: During };
  /** Another perspective of the cloud: a copy of it beside it, its triples its own. */
  other?: OtherState;
  /** When the atoms and triples it leaves out go, when not as they came. */
  leave?: During;
  /**
   * The parts of the last chapter on stage as the beat leaves it, and when
   * each comes in the beat that brings it: see `ENRICHMENT_PARTS`.
   */
  enrichment?: Partial<Record<EnrichmentPart, During>>;
}

/**
 * The last chapter's parts, in the order they come: Elon Musk comes out of
 * the graph to stand above it as it moves aside; his name, then the data of
 * his triples, flow to the other side, into a card that comes in as his
 * name nears it; the graph shrinks to a sketch of itself; a page about him
 * comes in under it; and the page's data flows into the card too. Then
 * everything goes as it came, reversed, and the graph comes home to the
 * middle, Elon Musk into it. Last, in the beat without a caption, it grows
 * into the caption's room.
 */
export const ENRICHMENT_PARTS = [
  'out',
  'graph',
  'small',
  'page',
  'data',
  'close',
  'home',
  'room',
] as const;

export type EnrichmentPart = (typeof ENRICHMENT_PARTS)[number];

/** Another perspective, as a beat leaves it. */
interface OtherState {
  /** The cloud's triples it trusts: the rest draw back on it alone. */
  trusted: readonly TripleId[];
  /** Triples of its own, between the cloud's atoms, which it shares. */
  triples: readonly TripleId[];
  /** Whose perspectives the two are: the cloud's, then the copy's. */
  viewers: readonly [string, string];
}

interface BeatSpec {
  id: string;
  chapter: ChapterId;
  caption: readonly CaptionPart[];
  /** What the scene shows, in words, where the beat says it better than its parts. */
  alt?: string;
  /** How long the beat's motion takes. It then holds, for the caption. */
  motionMs: number;
  stage: StageState;
}

/** Radians round the cloud between neighbouring atoms of a triple. */
const SPACING = 0.4;

/**
 * The direction `steps` spacings round the cloud's equator from the front,
 * to the right when positive: where a story told left to right stands.
 */
function onEquator(steps: number): Vec3 {
  const angle = steps * SPACING;

  return [Math.sin(angle), 0, Math.cos(angle)];
}

/**
 * The direction `steps` spacings round the cloud from the front, and
 * `latitude` radians up from the equator, or down when negative.
 */
function onSphere(steps: number, latitude: number): Vec3 {
  const angle = steps * SPACING;

  return [
    Math.sin(angle) * Math.cos(latitude),
    Math.sin(latitude),
    Math.cos(angle) * Math.cos(latitude),
  ];
}

/**
 * A camera `steps` spacings round the equator, raised `tilt` radians above
 * it, looking down on the cloud: from there the equator curves away round
 * the sphere, where head on it is a straight line.
 */
function lookingDown(steps: number, tilt: number): Vec3 {
  const angle = steps * SPACING;

  return [
    Math.sin(angle) * Math.cos(tilt),
    Math.sin(tilt),
    Math.cos(angle) * Math.cos(tilt),
  ];
}

/** How far above the equator the camera rises once the chain shows the cloud's shape. */
const TILT = 0.26;

/** The cloud as the chapter of triples leaves it: every atom and triple in place. */
const WHOLE_GRAPH: Pick<StageState, 'atoms' | 'triples'> = {
  atoms: {
    elonMusk: { at: onEquator(-1), role: 'identity' },
    founderOf: { at: FRONT, role: 'predicate' },
    spacex: { at: onEquator(1), role: 'bridge' },
    owns: { at: onEquator(2), role: 'predicate' },
    xai: { at: onEquator(3), role: 'bridge' },
    best: { at: onEquator(4), role: 'predicate' },
    aiCompany: { at: onEquator(5), role: 'object' },
  },
  triples: { elonFoundedSpacex: {}, spacexOwnsXai: {}, xaiBestAiCompany: {} },
};

/**
 * The cloud as the chapter of lists leaves it: the whole graph, and two
 * more AI companies below xAI, each the best, as it is.
 */
const LISTED_GRAPH: Pick<StageState, 'atoms' | 'triples'> = {
  atoms: {
    ...WHOLE_GRAPH.atoms,
    anthropic: { at: onSphere(3.3, -0.3), role: 'identity' },
    openai: { at: onSphere(4.7, -0.3), role: 'identity' },
  },
  triples: {
    ...WHOLE_GRAPH.triples,
    anthropicBestAiCompany: {},
    openaiBestAiCompany: {},
  },
};

/**
 * Every atom and triple of the story on the cloud: the graph so far, and
 * the nested triples from the plane, each atom where its neighbours are.
 */
const STORY_GRAPH: Pick<StageState, 'atoms' | 'triples'> = {
  atoms: {
    ...LISTED_GRAPH.atoms,
    believes: { at: onSphere(-0.17, 0.5), role: 'predicate' },
    willBeWorth: { at: onSphere(1.5, 0.48), role: 'predicate' },
    ordersOfMagnitude: { at: onSphere(0.55, 1), role: 'identity' },
    moreThan: { at: onSphere(2.1, 1.02), role: 'predicate' },
    currentEarthEconomy: { at: onSphere(3.64, 0.9), role: 'bridge' },
    estimatedAt: { at: onSphere(4.6, 0.55), role: 'predicate' },
    hundredTrillion: { at: onSphere(5.3, 0.3), role: 'object' },
    sourcedBy: { at: onSphere(-1.6, 0.6), role: 'predicate' },
    tweet: { at: onSphere(-1.83, 0.22), role: 'object' },
  },
  triples: {
    ...LISTED_GRAPH.triples,
    moreThanEconomy: {},
    spacexWorth: {},
    elonBelieves: {},
    economyEstimated: {},
    beliefSourced: {},
  },
};

/** The atoms the plane held, which arrive on the cloud as the story becomes one graph. */
const FROM_THE_PLANE: readonly AtomId[] = [
  'believes',
  'willBeWorth',
  'ordersOfMagnitude',
  'moreThan',
  'currentEarthEconomy',
  'estimatedAt',
  'hundredTrillion',
  'sourcedBy',
  'tweet',
];

/** The whole cloud in view, as the story ends: facing its middle, from a little above. */
const WHOLE_VIEW: Camera = {
  facing: lookingDown(1.55, 0.3),
  zoom: 0.35,
  whole: 1,
};

/**
 * The whole cloud in view beside another perspective: turned toward Elon
 * Musk and from a little below, so his chain runs across both, and on the
 * copy, AI stands at the top of its triples, which fall away under it.
 */
const PERSPECTIVES_VIEW: Camera = {
  ...WHOLE_VIEW,
  facing: lookingDown(0.62, -0.12),
};

/**
 * The atoms the non-believers' triples use, which the story's have not:
 * spread through the space round the story's own, which stay where they
 * are. They are on the graph, set back, from the moment it is one graph.
 */
const NON_BELIEVERS_ATOMS: Partial<Record<AtomId, AtomState>> = {
  ai: { at: onSphere(0.85, 0.2), role: 'identity' },
  is: { at: onSphere(1.58, -0.171), role: 'predicate' },
  dangerous: { at: onSphere(2.4, -0.35), role: 'object' },
  outOfControl: { at: onSphere(1.65, -0.55), role: 'object' },
  willRemove: { at: onSphere(0.019, 0.253), role: 'predicate' },
  jobs: { at: onSphere(-0.829, 0.37), role: 'object' },
  threatens: { at: onSphere(0.65, -0.053), role: 'predicate' },
  peace: { at: onSphere(0.261, -0.381), role: 'object' },
};
const NON_BELIEVERS_IDS = Object.keys(NON_BELIEVERS_ATOMS) as AtomId[];

/**
 * Another perspective of the same atoms, the non-believers': it trusts none
 * of the believers' triples, and says AI is dangerous, is out of control,
 * will remove jobs, and threatens peace.
 */
const ANOTHER_PERSPECTIVE: OtherState = {
  trusted: [],
  triples: [
    'aiIsDangerous',
    'aiIsOutOfControl',
    'aiRemovesJobs',
    'aiThreatensPeace',
    'democratsCallForPause',
    'democratsCallForBan',
    'elonRepostedPause',
    'aiThreatensDemocracy',
    'aiSpreadsMisinformation',
    'deepfakesUndermineElections',
    'dataCentersStrainGrid',
    'superintelligencePosesRisk',
    'aiWorthLessThanHype',
  ],
  viewers: ['AI Optimists', 'AI Pessimists'],
};

/**
 * The optimists' further claims, on the cloud beside the copy: what AI will
 * do for people, and what it has done.
 */
const OPTIMISTS_TRIPLES: readonly TripleId[] = [
  'aiWillCureDiseases',
  'aiCreatesNewJobs',
  'aiSpeedsUpScience',
  'alphafoldSolvedFolding',
  'tutorsTeachEveryChild',
  'carsSaveLives',
  'anthropicResearchesSafety',
  'proteinFoldingUnlocksMedicines',
  'newJobsOutnumberJobsLost',
];

/**
 * Where the two perspectives' further claims stand, only while the two
 * globes do: in the room the story's atoms leave, on the front's lower half
 * and round its sides, and on the back, which shows as a globe is turned.
 * Placed by simulating the scene's names, so that every one of them shows
 * where it faces the reader, and every name already there still does. Each
 * in the role its claim gives it; the pessimists' objects stay objects, red.
 */
const PERSPECTIVES_ATOMS: Partial<Record<AtomId, AtomState>> = {
  democrats: { at: onSphere(-6.973, 0.376), role: 'identity' },
  callFor: { at: onSphere(-6.073, 0.512), role: 'predicate' },
  pauseOnAdvancedAi: { at: onSphere(-4.551, 0.36), role: 'object' },
  banOnSuperintelligence: { at: onSphere(7.628, 0.876), role: 'object' },
  reposted: { at: onSphere(-3.38, 0.925), role: 'predicate' },
  democracy: { at: onSphere(-0.98, -0.38), role: 'object' },
  spreads: { at: onSphere(0.94, -0.28), role: 'predicate' },
  misinformation: { at: onSphere(0.43, -0.95), role: 'object' },
  deepfakes: { at: onSphere(-5.179, -0.413), role: 'identity' },
  undermine: { at: onSphere(-6.281, -0.614), role: 'predicate' },
  elections: { at: onSphere(-4.806, -0.718), role: 'object' },
  dataCenters: { at: onSphere(-7.467, -0.183), role: 'identity' },
  strain: { at: onSphere(-6.361, -0.096), role: 'predicate' },
  powerGrid: { at: onSphere(-7.781, -0.047), role: 'object' },
  superintelligence: { at: onSphere(-4.779, -0.049), role: 'identity' },
  poses: { at: onSphere(-5.556, 0.168), role: 'predicate' },
  existentialRisk: { at: onSphere(-3.837, 0.143), role: 'object' },
  lessThanTheHype: { at: onSphere(2.98, 0.39), role: 'object' },
  willCure: { at: onSphere(-0.3, 1.0), role: 'predicate' },
  diseases: { at: onSphere(6.98, 1.44), role: 'object' },
  creates: { at: onSphere(5.073, 0.832), role: 'predicate' },
  newJobs: { at: onSphere(6.569, 0.745), role: 'bridge' },
  speedsUp: { at: onSphere(-1.7, 0.89), role: 'predicate' },
  science: { at: onSphere(-5.12, 1.18), role: 'object' },
  alphafold: { at: onSphere(6.001, -0.64), role: 'identity' },
  solved: { at: onSphere(6.969, -0.934), role: 'predicate' },
  proteinFolding: { at: onSphere(6.08, -1.43), role: 'bridge' },
  aiTutors: { at: onSphere(-4.557, -0.312), role: 'identity' },
  teach: { at: onSphere(-5.694, -0.196), role: 'predicate' },
  everyChild: { at: onSphere(-4.42, -0.506), role: 'object' },
  selfDrivingCars: { at: onSphere(-6.575, -0.378), role: 'identity' },
  save: { at: onSphere(7.516, -0.699), role: 'predicate' },
  lives: { at: onSphere(-6.645, -0.961), role: 'object' },
  researches: { at: onSphere(4.24, -0.69), role: 'predicate' },
  aiSafety: { at: onSphere(4.6, -1.09), role: 'object' },
  unlocks: { at: onSphere(2.48, -1.02), role: 'predicate' },
  newMedicines: { at: onSphere(3.3, -0.8), role: 'object' },
  outnumber: { at: onSphere(7.14, 0.32), role: 'predicate' },
  jobsLost: { at: onSphere(6.2, 0.01), role: 'object' },
};

/** The pessimists' further atoms: set back on the cloud, which is the optimists'. */
const PESSIMISTS_ATOM_IDS: readonly AtomId[] = [
  'democrats',
  'callFor',
  'pauseOnAdvancedAi',
  'banOnSuperintelligence',
  'reposted',
  'democracy',
  'spreads',
  'misinformation',
  'deepfakes',
  'undermine',
  'elections',
  'dataCenters',
  'strain',
  'powerGrid',
  'superintelligence',
  'poses',
  'existentialRisk',
  'lessThanTheHype',
];

/**
 * The one graph, all of it in view: every atom and triple of the story, and
 * the atoms only the non-believers' triples use, set back.
 */
const ONE_GRAPH: StageState = {
  ...STORY_GRAPH,
  atoms: { ...STORY_GRAPH.atoms, ...NON_BELIEVERS_ATOMS },
  setBack: NON_BELIEVERS_IDS,
  camera: WHOLE_VIEW,
};

/**
 * The last chapter's parts as each of its beats leaves them, and when each
 * comes. First the two perspectives become one again, the graph keeping the
 * size it had beside the other: none of the parts yet.
 */
const ONE_ATOM = {} as const;

/**
 * Then Elon Musk comes out of it, to stand above it as it moves aside; and
 * as he goes, his name flows from him to the other side, the card coming in
 * as it nears, as each row of it does, then the data of his triples from
 * the graph, one after another.
 */
const FROM_THE_GRAPH = {
  ...ONE_ATOM,
  out: [0, 0.45],
  graph: [0.15, 0.95],
} as const;

/**
 * Then the graph shrinks to a sketch above where the page comes in, and the
 * page's data flows into the card, which grows a row for each.
 */
const FROM_A_PAGE = {
  ...FROM_THE_GRAPH,
  small: [0, 0.3],
  page: [0.2, 0.4],
  data: [0.38, 0.97],
} as const;

/**
 * Last, everything goes as it came, reversed and where it stands: the lines
 * one by one, the page and the card (see `CLOSING`). Then the graph comes
 * home, to the middle, the size it was, and Elon Musk into it.
 */
const BACK_HOME = {
  ...FROM_A_PAGE,
  close: [0, 0.45],
  home: [0.4, 0.8],
} as const;

/**
 * How far round the cloud from the front, in spacings, its other side is:
 * the side facing away from the story, where none of its atoms stand, nor
 * the optimists' further ones: two and a half spacings past straight behind,
 * where the last triple has room.
 */
const OTHER_SIDE = 4.05 + Math.PI / SPACING;

/** The whole cloud in view from its other side, head on. */
const OTHER_SIDE_VIEW: Camera = {
  facing: onEquator(OTHER_SIDE),
  zoom: WHOLE_VIEW.zoom,
  whole: 1,
};

/**
 * The film's way on: the predicate of its last triple, civilization
 * shall, start building, the future of information. The page shows its
 * name as a link, where the cloud would draw it.
 */
export const THE_WAY_ON: AtomId = 'startBuilding';

/** When the wider graph's atoms come, as the film ends: see `CROWD`. */
const WIDER_GRAPH: During = [0.55, 0.9];

/** Every atom of the story, all set back as the film ends. */
/**
 * The optimists' further atoms, and the one graph as their globe was, with
 * their further claims: from the globes becoming one again to the atom
 * again. A test.
 */
const OPTIMISTS_ATOMS = Object.fromEntries(
  Object.entries(PERSPECTIVES_ATOMS).filter(
    ([id]) => !PESSIMISTS_ATOM_IDS.includes(id as AtomId),
  ),
) as Partial<Record<AtomId, AtomState>>;
const OPTIMISTS_GRAPH: StageState = {
  ...ONE_GRAPH,
  atoms: { ...ONE_GRAPH.atoms, ...OPTIMISTS_ATOMS },
  triples: {
    ...ONE_GRAPH.triples,
    ...Object.fromEntries(OPTIMISTS_TRIPLES.map((id) => [id, {}])),
  },
};

const STORY_ATOM_IDS = Object.keys(ONE_GRAPH.atoms) as AtomId[];

/**
 * The way on, the film's last triple, in the middle of the cloud's other
 * side: civilization shall, start building, the future of information.
 * Its atoms stand a little further apart than a triple's on the cloud, in
 * spacings, for the names to read beside the way on's, a button, larger
 * than a name.
 */
const LAST_SPACING = 1.15;

/** How far the way on stands from each of its neighbours, round the cloud, in radians. */
export const WAY_APART = LAST_SPACING * SPACING;
const LAST_TRIPLE = {
  civilization: onEquator(OTHER_SIDE - LAST_SPACING),
  startBuilding: onEquator(OTHER_SIDE),
  futureOfInformation: onEquator(OTHER_SIDE + LAST_SPACING),
} as const satisfies Partial<Record<AtomId, Vec3>>;

/**
 * The last beat's moments, in milliseconds: each atom of its claim as it
 * arrives, the line between them as it grows, and the fade, as its subject
 * and object quieten and the way on grows. Whole from its object's arrival,
 * the claim holds 5.28 seconds before the fade starts.
 */
const LAST_BEAT = {
  subject: [0, 1800],
  predicate: [1800, 2880],
  object: [2340, 3360],
  line: [2880, 4680],
  fade: [8640, 9960],
} as const satisfies Record<string, During>;
/** The last beat's motion, in milliseconds: until the fade ends. */
const LAST_BEAT_MS = LAST_BEAT.fade[1];
/** One of the last beat's moments, as a share of its motion. */
const ofLastBeat = ([start, end]: During): During => [
  start / LAST_BEAT_MS,
  end / LAST_BEAT_MS,
];

/**
 * The wider graph round the story's, as the film ends: atoms no triple
 * joins, set back, each a shape and a blank name, spread over the cloud
 * clear of the story's atoms and the way on. A fixed draw, so the film's
 * last frame is the same every time.
 */
export interface CrowdAtom {
  at: Vec3;
  role: Role;
  /** How wide its blank name is, in CSS pixels. */
  name: number;
}

/** How many atoms the wider graph shows. */
const CROWD_COUNT = 22;

/** How near, in radians round the cloud, another atom may stand to one. */
const CROWD_APART = 0.3;

/** A repeatable stream of numbers from 0 to 1: mulberry32. */
function randomFrom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function crowdOf(count: number, seed: number): CrowdAtom[] {
  const random = randomFrom(seed);
  // Clear of the story's atoms, and of the way on's whole line.
  const taken: Vec3[] = [
    ...Object.values(ONE_GRAPH.atoms).map((atom) => atom.at),
    ...Object.values(OPTIMISTS_ATOMS).flatMap((atom) =>
      atom === undefined ? [] : [atom.at],
    ),
    ...Array.from({ length: 21 }, (_, index) =>
      onEquator(OTHER_SIDE - LAST_SPACING + (2 * LAST_SPACING * index) / 20),
    ),
  ];
  const roles: readonly Role[] = [
    'identity',
    'identity',
    'predicate',
    'object',
    'bridge',
  ];
  const crowd: CrowdAtom[] = [];
  for (let tries = 0; crowd.length < count && tries < count * 200; tries++) {
    // Evenly over the sphere, but away from its poles, where names crowd.
    const longitude = random() * 2 * Math.PI;
    const latitude = Math.asin(random() * 2 - 1) * 0.8;
    const at: Vec3 = [
      Math.sin(longitude) * Math.cos(latitude),
      Math.sin(latitude),
      Math.cos(longitude) * Math.cos(latitude),
    ];
    const isClear = [...taken, ...crowd.map((atom) => atom.at)].every(
      ([x, y, z]) =>
        Math.acos(
          Math.min(Math.max(x * at[0] + y * at[1] + z * at[2], -1), 1),
        ) >= CROWD_APART,
    );
    if (isClear) {
      crowd.push({
        at,
        role: roles[Math.floor(random() * roles.length)] ?? 'identity',
        name: 32 + Math.round(random() * 60),
      });
    }
  }

  return crowd;
}

export const CROWD: readonly CrowdAtom[] = crowdOf(CROWD_COUNT, 2026);

/**
 * The cloud behind the plane: the whole graph, unchanged, pushed back and
 * out of focus. The camera faces founder of, so it stands behind the plane
 * between Elon Musk and SpaceX, and looks down on the cloud, so the chain
 * on from SpaceX curves away round it.
 */
const UP_CLOSE: StageState = {
  ...WHOLE_GRAPH,
  camera: { facing: lookingDown(0, TILT), zoom: 0.45, during: [0, 0.7] },
  depth: 1,
  isCloudStill: true,
};

/**
 * Elon Musk believes (SpaceX will be worth (orders of magnitude more than
 * current Earth economy)): his post of 8 October 2026, as a claim.
 */
const BELIEF: PlaneTerm = {
  triple: {
    id: 'belief',
    subject: { atom: 'elonMusk' },
    predicate: 'believes',
    object: {
      triple: {
        id: 'worth',
        subject: { atom: 'spacex' },
        predicate: 'willBeWorth',
        object: {
          triple: {
            id: 'more',
            subject: { atom: 'ordersOfMagnitude' },
            predicate: 'moreThan',
            object: { atom: 'currentEarthEconomy' },
          },
        },
      },
    },
  },
};

/** A claim of its own about the current Earth economy: what it is worth. */
const ESTIMATE: PlaneBranch = {
  id: 'estimate',
  subject: { atom: 'currentEarthEconomy' },
  predicate: 'estimatedAt',
  object: 'hundredTrillion',
};

/** A claim about the whole belief: where it comes from, his post. */
const SOURCE: PlaneBranch = {
  id: 'source',
  subject: { frame: 'belief' },
  predicate: 'sourcedBy',
  object: 'tweet',
};

/**
 * The vault of what Elon Musk believes, and six people with a position in
 * it: three against it, on the left, and three for it, on the right.
 */
const POSITIONS: PlaneVaults = {
  frame: 'worth',
  against: [400, 200, 20],
  for: [200, 100, 80],
};

/** Who believes it, set back while the vault of what he believes shows. */
const SET_BACK: readonly AtomId[] = ['elonMusk', 'believes'];

/**
 * The person who deposited 100 for the triple, left alone with it: all else
 * gone, the triple raised to the very top in the middle, and they where they
 * stood.
 */
const ALONE: PlaneState = {
  term: BELIEF,
  focus: 'worth',
  frame: 'identity',
  isFrameHidden: true,
  vaults: { ...POSITIONS, isWeighed: true, isTotalled: true },
  faded: SET_BACK,
  alone: { side: 'for', index: 1 },
  isFocusCentred: true,
  isRaised: true,
};

/** Basis points in a whole: 1 is 0.01%. */
const WHOLE = 10_000;

/**
 * What an app's builder takes from a deposit sent through it, before
 * `MultiVault`: a share of all the user sends, in basis points, and a flat
 * fee in TRUST. Optional, and the builder's to set.
 */
const BUILDER_FEE = { rate: 40, flat: 0.1 } as const;

/**
 * `MultiVault`'s fees on a deposit in a triple, in basis points of it, read
 * from mainnet: the protocol fee, the entry fee and the atom deposit
 * fraction, all taken at once. Governance can change them.
 */
const VAULT_FEES = { protocol: 125, entry: 50, atomFraction: 90 } as const;

/**
 * The 100 the person left alone deposited, sent through an app: the
 * builder's fee first, then `MultiVault`'s, and the position the rest buys.
 */
const SPLIT = (() => {
  const sent = 100;
  const builderFee = (sent * BUILDER_FEE.rate) / WHOLE + BUILDER_FEE.flat;
  const deposit = sent - builderFee;
  const share = (rate: number): number => (deposit * rate) / WHOLE;
  const protocol = share(VAULT_FEES.protocol);
  const entry = share(VAULT_FEES.entry);
  const atomFraction = share(VAULT_FEES.atomFraction);
  const fees = protocol + entry + atomFraction;

  return {
    sent,
    builderFee,
    deposit,
    fees,
    position: deposit - fees,
    protocol,
    entry,
    // The atom deposit fraction, shared by the triple's three terms.
    perTerm: atomFraction / 3,
  };
})();

/** Their deposit, each amount and what it is. */
const DEPOSIT: PlaneDeposit = {
  sent: { value: SPLIT.sent, label: 'sent' },
  builderFee: { value: SPLIT.builderFee, label: 'builder fee' },
  deposit: { value: SPLIT.deposit },
  fees: { value: SPLIT.fees, label: 'fees' },
  position: { value: SPLIT.position, label: 'position' },
};

/** Their deposit, followed up their line. */
const DEPOSITING: PlaneState = { ...ALONE, deposit: DEPOSIT };

/**
 * Its fees shared out: to the protocol, into the triple's vault, and into
 * the vault of each of its three terms.
 */
const SHARING: PlaneState = {
  ...ALONE,
  deposit: {
    ...DEPOSIT,
    shared: {
      protocol: { value: SPLIT.protocol, label: 'protocol' },
      entry: SPLIT.entry,
      perTerm: SPLIT.perTerm,
    },
  },
};

/**
 * The best AI company, by everyone who says so: a list of three triples,
 * each with its own weight.
 */
const BEST_AI_COMPANY: PlaneList = {
  id: 'bestAiCompany',
  members: [
    { atom: 'xai', weight: 910 },
    { atom: 'anthropic', weight: 780 },
    { atom: 'openai', weight: 640 },
  ],
  predicate: 'best',
  object: 'aiCompany',
  isWeighed: true,
};

/**
 * Whose perspective the list is seen through: the weights of the triples in
 * it as the people each trusts have made them.
 */
const PERSPECTIVES = ['Elon Musk', 'Sam Altman', 'My developer friends'];

/** The list ranked, as Elon Musk sees it: xAI first. */
const RANKED: PlaneList = { ...BEST_AI_COMPANY, isRanked: true };

/** As Sam Altman sees it: OpenAI weighs more, and comes first. */
const AS_SAM_ALTMAN_SEES_IT: PlaneList = {
  ...RANKED,
  members: RANKED.members.map((member) =>
    member.atom === 'openai' ? { ...member, weight: 960 } : member,
  ),
};

/** As my developer friends see it: Anthropic weighs more still, and comes first. */
const AS_MY_FRIENDS_SEE_IT: PlaneList = {
  ...AS_SAM_ALTMAN_SEES_IT,
  members: AS_SAM_ALTMAN_SEES_IT.members.map((member) =>
    member.atom === 'anthropic' ? { ...member, weight: 990 } : member,
  ),
};

/**
 * The cloud behind the list: as the chapter leaves it, pushed back and out
 * of focus, the camera facing best, behind the list, and a little below
 * the equator; then moved left and down, so the chain on to SpaceX stands
 * out from behind the list, to its left and under it.
 */
const LISTED_CLOSE: StageState = {
  ...LISTED_GRAPH,
  camera: {
    facing: lookingDown(5, -0.35),
    zoom: 0.45,
    shift: -0.732,
    raise: -0.386,
    during: [0, 0.7],
  },
  depth: 1,
};

/** The claim in the place of the object, atom by atom, as it reads. */
const BELIEVED_CLAIM: readonly AtomId[] = [
  'spacex',
  'willBeWorth',
  'ordersOfMagnitude',
  'moreThan',
  'currentEarthEconomy',
];

const BEAT_SPECS: readonly BeatSpec[] = [
  {
    id: 'atom',
    chapter: 'atoms',
    caption: [
      'Everything in Intuition starts with an atom, the smallest unit of knowledge.\nAn atom can be anything: this one is a person.',
    ],
    motionMs: 1400,
    stage: {
      camera: { facing: FRONT, zoom: 1.5 },
      atoms: { elonMusk: { at: FRONT, role: 'identity', during: [0.2, 1] } },
      triples: {},
    },
  },
  {
    id: 'atom-vault',
    chapter: 'atoms',
    caption: [
      'Every atom has a vault, which holds its value.\nAnyone can deposit into it, to signal that the atom matters.',
    ],
    alt: 'An atom, Elon Musk, with its vault under its name, and people depositing into it.',
    // Elon Musk stays as he is. His vault arrives under his name, and a few
    // people under it; their lines grow up into the vault, and the vault's
    // on up to him.
    motionMs: 1800,
    stage: {
      camera: { facing: FRONT, zoom: 1.5 },
      atoms: { elonMusk: { at: FRONT, role: 'identity' } },
      triples: {},
      vault: {
        atom: 'elonMusk',
        during: [0.1, 0.4],
        deposits: [0.4, 0.75],
        onward: [0.75, 1],
      },
    },
  },
  {
    id: 'second-atom',
    chapter: 'atoms',
    caption: ['SpaceX is an atom too.\nThis one is an organization.'],
    motionMs: 1600,
    stage: {
      camera: { facing: FRONT, zoom: 1.2 },
      atoms: {
        elonMusk: {
          at: onEquator(-0.5),
          role: 'identity',
          during: [0, 0.65],
        },
        spacex: {
          at: onEquator(0.5),
          role: 'identity',
          during: [0.4, 1],
        },
      },
      triples: {},
    },
  },
  {
    id: 'third-atom',
    chapter: 'atoms',
    caption: [
      'Even “founder of” is an atom.\nOne that relates two others is called a predicate.',
    ],
    motionMs: 1800,
    stage: {
      camera: { facing: FRONT, zoom: 1 },
      atoms: {
        elonMusk: {
          at: onEquator(-1),
          role: 'identity',
          during: [0, 0.6],
        },
        spacex: {
          at: onEquator(1),
          role: 'identity',
          during: [0, 0.6],
        },
        founderOf: { at: FRONT, role: 'identity', during: [0.45, 1] },
      },
      triples: {},
    },
  },
  {
    id: 'triple',
    chapter: 'triples',
    caption: [
      'Connected, three atoms form a triple: a ',
      { role: 'identity', text: 'subject' },
      ', a ',
      { role: 'predicate', text: 'predicate' },
      ' and an ',
      { role: 'object', text: 'object' },
      '.\nTogether they read: Elon Musk is the founder of SpaceX.',
    ],
    // The line is drawn from the subject to the object, and each atom takes
    // its role's shape as the line reaches it.
    motionMs: 2600,
    stage: {
      camera: { facing: FRONT, zoom: 1 },
      atoms: {
        elonMusk: { at: onEquator(-1), role: 'identity' },
        founderOf: { at: FRONT, role: 'predicate', during: [0.3, 0.6] },
        spacex: {
          at: onEquator(1),
          role: 'object',
          during: [0.62, 0.95],
        },
      },
      triples: { elonFoundedSpacex: { during: [0, 0.7] } },
    },
  },
  {
    id: 'object-as-subject',
    chapter: 'triples',
    caption: [
      'An object can also be a subject.\nSpaceX is the ',
      { role: 'object', text: 'object' },
      ' of one triple and the ',
      { role: 'identity', text: 'subject' },
      ' of the next, so it is drawn as both: a ',
      { role: 'bridge', text: 'bridge object' },
      '.',
    ],
    // The cloud turns and pulls back as owns and xAI arrive. Then the line
    // leaves SpaceX, which becomes a hexagon as it does, and each new atom
    // takes its role as the line reaches it. On a narrow screen the cloud
    // turns to the new triple, and the first one curves away round it.
    motionMs: 3800,
    stage: {
      camera: {
        facing: onEquator(1),
        zoom: 0.68,
        focus: onEquator(2),
        during: [0, 0.4],
      },
      atoms: {
        elonMusk: { at: onEquator(-1), role: 'identity' },
        founderOf: { at: FRONT, role: 'predicate' },
        spacex: {
          at: onEquator(1),
          role: 'bridge',
          during: [0.45, 0.62],
        },
        owns: {
          at: onEquator(2),
          role: 'predicate',
          during: [0.15, 0.4],
          roleDuring: [0.64, 0.8],
        },
        xai: {
          at: onEquator(3),
          role: 'object',
          during: [0.25, 0.5],
          roleDuring: [0.86, 1],
        },
      },
      triples: {
        elonFoundedSpacex: {},
        spacexOwnsXai: { during: [0.45, 0.95] },
      },
    },
  },
  {
    id: 'graph',
    chapter: 'triples',
    caption: [
      'xAI now plays both roles too, so it becomes a ',
      { role: 'bridge', text: 'bridge object' },
      '.\nLinked like this, triples form a graph: one web of knowledge that grows with every triple.',
    ],
    // As best and AI company arrive, the camera pulls back and rises a
    // little, and the chain is seen curving away round the cloud: the
    // shape everything after this is told on. Then the line leaves xAI,
    // which becomes a hexagon as it does.
    motionMs: 4200,
    stage: {
      camera: {
        facing: lookingDown(3, TILT),
        zoom: 0.6,
        focus: lookingDown(4, TILT),
        during: [0, 0.5],
      },
      atoms: {
        elonMusk: { at: onEquator(-1), role: 'identity' },
        founderOf: { at: FRONT, role: 'predicate' },
        spacex: { at: onEquator(1), role: 'bridge' },
        owns: { at: onEquator(2), role: 'predicate' },
        xai: {
          at: onEquator(3),
          role: 'bridge',
          during: [0.48, 0.64],
        },
        best: {
          at: onEquator(4),
          role: 'predicate',
          during: [0.18, 0.42],
          roleDuring: [0.66, 0.8],
        },
        aiCompany: {
          at: onEquator(5),
          role: 'object',
          during: [0.28, 0.52],
          roleDuring: [0.86, 1],
        },
      },
      triples: {
        elonFoundedSpacex: {},
        spacexOwnsXai: {},
        xaiBestAiCompany: { during: [0.48, 0.95] },
      },
    },
  },
  {
    id: 'look-closer',
    chapter: 'nested',
    caption: [
      'Triples can also be about other triples.\nLook closer at what Elon Musk believes: not one thing, but a whole triple, in the place of the ',
      { role: 'object', text: 'object' },
      '.',
    ],
    // The cloud falls back and out of focus, and Elon Musk comes out of it,
    // toward the viewer, onto a plane in front of it, sharp. Once he
    // settles, believes stands beside him, and what he believes, still
    // words, in a frame: the object. Then the lines join them.
    motionMs: 4000,
    stage: {
      ...UP_CLOSE,
      plane: {
        term: BELIEF,
        focus: 'believes',
        spelled: BELIEVED_CLAIM,
        folded: ['worth'],
        isLowered: true,
        during: [0.1, 1],
      },
    },
  },
  {
    id: 'divide',
    chapter: 'nested',
    caption: [
      'That triple breaks into its parts, and holds one of its own: a triple can stand in the place of any ',
      { role: 'object', text: 'object' },
      '.',
    ],
    // The words in the frame break apart, then a frame inside it shows the
    // claim it holds: orders of magnitude and the rest.
    motionMs: 3600,
    stage: {
      ...UP_CLOSE,
      plane: {
        term: BELIEF,
        focus: 'more',
        spelled: BELIEVED_CLAIM,
        isLowered: true,
      },
    },
  },
  {
    id: 'nested',
    chapter: 'nested',
    caption: [
      'Each part becomes an atom. Triples nest without limit, so a whole thought becomes one triple:\nElon Musk believes SpaceX will be worth orders of magnitude more than the current Earth economy.',
    ],
    // The words move down to where the names go, the atoms arrive in their
    // shapes, SpaceX out of the cloud, and then the lines grow.
    motionMs: 4400,
    stage: {
      ...UP_CLOSE,
      plane: { term: BELIEF, focus: 'worth', isLowered: true },
    },
  },
  {
    id: 'estimated',
    chapter: 'nested',
    caption: [
      'Any atom can start a triple of its own: the current Earth economy is estimated at $100+ trillion.\nNow the ',
      { role: 'object', text: 'object' },
      ' of one triple and the ',
      { role: 'identity', text: 'subject' },
      ' of another, it becomes a ',
      { role: 'bridge', text: 'bridge object' },
      '.',
    ],
    // The whole claim moves down to make room, and across, to centre the
    // current Earth economy; then estimated at and $100+ trillion arrive in
    // a column above it; the lines grow up to them; and it takes both
    // roles.
    motionMs: 4200,
    stage: {
      ...UP_CLOSE,
      plane: {
        term: BELIEF,
        focus: 'currentEarthEconomy',
        isFocusCentred: true,
        branches: [ESTIMATE],
      },
    },
  },
  {
    id: 'sourced',
    chapter: 'nested',
    caption: [
      'A whole triple can be the subject of another, too.\nWhat Elon Musk believes is sourced by a ',
      {
        href: 'https://x.com/elonmusk/status/2108315261044445330',
        text: 'Tweet',
      },
      ', posted on 8 October 2026.',
    ],
    // The whole claim comes back to the middle, a frame forms round all of
    // it, tinted the subject it now is, and from the middle of its top
    // sourced by and Tweet rise, as the last claim did.
    motionMs: 4400,
    stage: {
      ...UP_CLOSE,
      plane: {
        term: BELIEF,
        focus: 'belief',
        frame: 'identity',
        branches: [ESTIMATE, SOURCE],
      },
    },
  },
  {
    id: 'vaults',
    chapter: 'vaults',
    caption: [
      'Like an atom, every triple has a vault. An atom’s has no sides: anyone simply deposits into it.\nA triple’s has two: a side against it and a side for it.',
    ],
    // At once, what rose from the whole triple draws back and goes, its
    // frame goes but keeps its room, Elon Musk and believes are set back,
    // the current Earth economy, an object and nothing else again, is a
    // square again, the cloud behind goes, and the triple rises to the top.
    // Then its vault and six people arrive below it, and lines grow down
    // from the frame of what he believes to the vault, grey, split in two
    // there, one side against it, orange, and one for it, blue, and split
    // again to reach them.
    motionMs: 4400,
    stage: {
      ...UP_CLOSE,
      cloud: { shown: 0, during: HANGING_RISE },
      plane: {
        term: BELIEF,
        focus: 'worth',
        frame: 'identity',
        isFrameHidden: true,
        vaults: POSITIONS,
        faded: SET_BACK,
      },
    },
  },
  {
    id: 'positions',
    chapter: 'vaults',
    caption: [
      'Anyone can take a position by depositing on either side, and the positions give the triple its weight.\nA triple is a claim, not a fact: its weight shows how many stand behind it, and how much.',
    ],
    // Each person's position shows on their line; then, where each side's
    // lines run together, all the positions on it.
    motionMs: 3200,
    stage: {
      ...UP_CLOSE,
      cloud: { shown: 0 },
      plane: {
        term: BELIEF,
        focus: 'worth',
        frame: 'identity',
        isFrameHidden: true,
        vaults: { ...POSITIONS, isWeighed: true, isTotalled: true },
        faded: SET_BACK,
      },
    },
  },
  {
    id: 'depositor',
    chapter: 'fees',
    caption: [
      'Every deposit pays fees on its way into a vault.\nFollow one: the 100 this person deposited for the triple.',
    ],
    alt: 'A triple: SpaceX will be worth (orders of magnitude more than current Earth economy). And one person, who deposited 100 into its vault, on the side for it.',
    // All else goes, the lines drawing back: Elon Musk and believes, and
    // the other people with a position, their totals with them. The person
    // in the middle of the side for it stays, with the 100 they deposited,
    // and their line up to the vault, the vault and the triple; and as the
    // rest goes, what stays moves to the middle, the triple to the very top,
    // and the 100 down their line, near them, where it stays as the deposit
    // is followed.
    motionMs: 2400,
    stage: { ...UP_CLOSE, cloud: { shown: 0 }, plane: ALONE },
  },
  {
    id: 'deposit',
    chapter: 'fees',
    caption: [
      'A deposit is not all position. A builder’s app can take a small fee first, then the protocol takes its own.\nThe rest buys the depositor’s shares, all of it in the vault of the triple.',
    ],
    alt: `One person deposits on the side for the triple, SpaceX will be worth orders of magnitude more than the current Earth economy. Of ${amountOf(SPLIT.sent)} TRUST sent, ${amountOf(SPLIT.builderFee)} goes to the builder and ${amountOf(SPLIT.deposit)} enters MultiVault. ${amountOf(SPLIT.fees)} of that goes to fees, and the ${amountOf(SPLIT.position)} left is the position, all of it in the triple’s vault.`,
    // At once, up the line, the builder's fee comes in where it is taken,
    // its line out to its amount; then the line on down to the builder's
    // app, and the app; then what goes on; then the fees, where the line
    // turns for the vault, the same way, their line out along the row to
    // where they will be shared out from; and last the position, on the
    // way into the vault. Each turn as long as the last.
    motionMs: 5600,
    stage: { ...UP_CLOSE, cloud: { shown: 0 }, plane: DEPOSITING },
  },
  {
    id: 'fees',
    chapter: 'fees',
    caption: [
      'The fees go to the protocol, to the triple’s vault, and to its three terms.\nThey lift those vaults’ shares and stop there: the atoms nested inside a term get nothing.',
    ],
    alt: `The fees of ${amountOf(SPLIT.fees)} TRUST: ${amountOf(SPLIT.protocol)} to the protocol, ${amountOf(SPLIT.entry)} stays in the triple’s vault, and ${amountOf(SPLIT.perTerm)} each goes to SpaceX, will be worth and the inner triple. The inner triple’s atoms get nothing.`,
    // All of the deposit is held back but its fees' amount, where it
    // stands on the row, between will be worth's vault and the triple's
    // own. Then the vaults of SpaceX, will be worth and the inner triple
    // hang under them, beside the triple's own; the lines grow from the fee
    // to each vault, and from its amount down to the protocol's; and each
    // share shows.
    motionMs: 4800,
    stage: { ...UP_CLOSE, cloud: { shown: 0 }, plane: SHARING },
  },
  {
    id: 'list-back',
    chapter: 'lists',
    caption: ['Back in the graph, one triple says xAI is the best AI company.'],
    // The plane closes: the person left on it goes, and Elon Musk and
    // SpaceX go back to their places in the cloud, as the cloud comes back.
    // Then it comes into focus as the camera turns to xAI best AI company,
    // where the chapter of triples left it.
    motionMs: 4400,
    stage: {
      ...WHOLE_GRAPH,
      camera: {
        facing: lookingDown(3, TILT),
        zoom: 0.6,
        focus: lookingDown(4, TILT),
        during: [0.4, 1],
      },
      cloud: { shown: 1, during: [0, 0.45] },
    },
  },
  {
    id: 'list-grows',
    chapter: 'lists',
    caption: [
      'Anyone can say the same of another.\nTriples that share a predicate and an object form a list.',
    ],
    // The camera turns down a little as Anthropic and OpenAI arrive below
    // xAI; then each one's line grows through the same best to the same AI
    // company, one after the other: no atom is drawn twice.
    motionMs: 4400,
    stage: {
      ...LISTED_GRAPH,
      // Facing best, so the two below it, either side of it, stand evenly
      // under it, their lines to it the same length; and raised, so the
      // list stands in the middle.
      camera: {
        facing: lookingDown(4, 0.02),
        zoom: 0.6,
        raise: 0.14,
        focus: onSphere(4, -0.15),
        during: [0, 0.4],
      },
      atoms: {
        ...LISTED_GRAPH.atoms,
        anthropic: {
          at: onSphere(3.3, -0.3),
          role: 'identity',
          during: [0.15, 0.4],
        },
        openai: {
          at: onSphere(4.7, -0.3),
          role: 'identity',
          during: [0.25, 0.5],
        },
      },
      triples: {
        ...LISTED_GRAPH.triples,
        anthropicBestAiCompany: { during: [0.5, 0.72] },
        openaiBestAiCompany: { during: [0.72, 0.95] },
      },
    },
  },
  {
    id: 'list',
    chapter: 'lists',
    caption: [
      'Each triple in a list has a vault of its own, and so a weight of its own.',
    ],
    // The cloud falls back and out of focus, and the list's five atoms come
    // out of it onto the plane, their lines with them: its members in a
    // column, best and AI company across from them. Then each weight shows.
    motionMs: 4800,
    stage: {
      ...LISTED_CLOSE,
      plane: {
        term: { list: BEST_AI_COMPANY },
        // A narrow screen follows the members and best together.
        focus: ['xai', 'best'],
        during: [0.1, 1],
      },
    },
  },
  {
    id: 'ranked',
    chapter: 'lists',
    caption: [
      'The positions in each triple’s vault rank the list: the more weight, the higher it stands.',
    ],
    // They stand in order already, the heaviest on top: each takes its
    // medal.
    motionMs: 2800,
    stage: {
      ...LISTED_CLOSE,
      plane: {
        term: { list: RANKED },
        focus: ['xai', 'best'],
      },
    },
  },
  {
    id: 'perspective',
    chapter: 'perspectives',
    caption: [
      'What you see depends on whose triples you trust: that is your perspective.\nThrough Elon Musk’s, xAI is the best AI company.',
    ],
    // The list moves down, and above it a menu shows whose perspective it
    // is seen through: Elon Musk's.
    motionMs: 2400,
    stage: {
      ...LISTED_CLOSE,
      plane: {
        term: { list: RANKED },
        focus: ['xai', 'best'],
        perspective: { options: PERSPECTIVES, chosen: 0 },
      },
    },
  },
  {
    id: 'sam-altman',
    chapter: 'perspectives',
    caption: ['Through Sam Altman’s, the same list puts OpenAI first.'],
    // The menu opens, moves to Sam Altman, and closes on him. OpenAI's
    // weight grows, it moves to the top, and the medals change hands.
    motionMs: 5200,
    stage: {
      ...LISTED_CLOSE,
      plane: {
        term: { list: AS_SAM_ALTMAN_SEES_IT },
        focus: ['xai', 'best'],
        perspective: { options: PERSPECTIVES, chosen: 1 },
      },
    },
  },
  {
    id: 'developer-friends',
    chapter: 'perspectives',
    caption: ['Through my developer friends’, Anthropic.'],
    // The menu opens again, on my developer friends. Anthropic's weight
    // grows past OpenAI's, it moves to the top, and the medals change hands.
    motionMs: 5200,
    stage: {
      ...LISTED_CLOSE,
      plane: {
        term: { list: AS_MY_FRIENDS_SEE_IT },
        focus: ['xai', 'best'],
        perspective: { options: PERSPECTIVES, chosen: 2 },
      },
    },
  },
  {
    id: 'one-graph',
    chapter: 'perspectives',
    caption: [
      'Everything so far is one graph: every atom and triple, on one graph.',
    ],
    alt: 'Every atom and triple of the story, on one graph.',
    // The list, its menu and its frame go back into the cloud, which comes
    // into focus as the camera pulls back to show all of it. Then the atoms
    // the plane held arrive in their places on it, and with them, set back,
    // the atoms only the non-believers' triples use; and the plane's
    // triples' bonds grow.
    motionMs: 5200,
    stage: {
      ...STORY_GRAPH,
      camera: { ...WHOLE_VIEW, during: [0.1, 0.55] },
      atoms: {
        ...STORY_GRAPH.atoms,
        ...Object.fromEntries(
          [...FROM_THE_PLANE, ...NON_BELIEVERS_IDS].map((id) => [
            id,
            {
              ...(STORY_GRAPH.atoms[id] ?? NON_BELIEVERS_ATOMS[id]),
              during: [0.5, 0.68],
            },
          ]),
        ),
      },
      setBack: NON_BELIEVERS_IDS,
      triples: {
        ...STORY_GRAPH.triples,
        moreThanEconomy: { during: [0.68, 0.95] },
        spacexWorth: { during: [0.68, 0.95] },
        elonBelieves: { during: [0.68, 0.95] },
        economyEstimated: { during: [0.68, 0.95] },
        beliefSourced: { during: [0.68, 0.95] },
      },
    },
  },
  {
    id: 'another-perspective',
    chapter: 'perspectives',
    caption: [
      'The same atoms can be seen another way, and everyone who reads them has a perspective of their own:\nwho they follow, the atoms they stake on, and the triples they create.',
    ],
    alt: 'Two perspectives of the same atoms, side by side. AI Optimists’: the graph so far, and that AI will cure diseases, creates new jobs and speeds up science, new jobs outnumber jobs lost, AlphaFold solved protein folding, AI tutors teach every child, self-driving cars save lives, Anthropic researches AI safety, and protein folding unlocks new medicines. AI Pessimists’, which trusts none of their triples: AI is dangerous, is out of control, will remove jobs, threatens peace and democracy, spreads misinformation, and will be worth less than the hype; Democrats call for a pause on advanced AI and a ban on superintelligence, and Elon Musk reposted the call for a pause; deepfakes undermine elections, data centers strain the power grid, and superintelligence poses an existential risk.',
    // The cloud moves aside as a copy of it splits off to the other side.
    // On the copy alone, the triples it does not trust draw back, the atoms
    // they joined set back with them. Then the atoms of both perspectives'
    // further claims arrive, on both, in the room the story leaves, and each
    // globe's own triples grow, between the same atoms, which come forward
    // with them: AI on the cloud too, the optimists'. The camera turns as
    // the two part.
    motionMs: 7000,
    stage: {
      ...ONE_GRAPH,
      camera: { ...PERSPECTIVES_VIEW, during: [0, 0.3] },
      atoms: {
        ...ONE_GRAPH.atoms,
        ...Object.fromEntries(
          Object.entries(PERSPECTIVES_ATOMS).map(([id, atom]) => [
            id,
            { ...atom, during: [0.5, 0.62] },
          ]),
        ),
      },
      setBack: [
        ...NON_BELIEVERS_IDS.filter((id) => id !== 'ai'),
        ...PESSIMISTS_ATOM_IDS,
      ],
      setBackDuring: [0.62, 0.9],
      triples: {
        ...ONE_GRAPH.triples,
        ...Object.fromEntries(
          OPTIMISTS_TRIPLES.map((id) => [id, { during: [0.62, 0.9] }]),
        ),
      },
      other: ANOTHER_PERSPECTIVE,
    },
  },
  {
    id: 'one-atom',
    chapter: 'enrichment',
    caption: [
      'Optimists or pessimists, Elon Musk is one atom: atoms are unique by design, so all data about him reaches the same point.',
    ],
    alt: 'The two perspectives come back together, each atom onto the same atom, Elon Musk with them: one atom, on one graph, the size it was.',
    // The copy's own triples draw back, and it slides back onto the cloud,
    // each of its atoms onto the same atom, as the cloud moves to the
    // middle, the size it was beside the copy.
    motionMs: 3600,
    stage: { ...OPTIMISTS_GRAPH, enrichment: ONE_ATOM },
  },
  {
    id: 'from-the-graph',
    chapter: 'enrichment',
    caption: [
      'Every triple Elon Musk is in is data about him, and it all gathers in that one atom.',
    ],
    alt: 'Elon Musk comes out of the graph to stand above it as it moves to one side, his triples still reaching him. His name flows from him to the other side, into a card that comes in as it arrives, then what the graph says about him: he is the founder of SpaceX, and believes SpaceX will be worth more than the current Earth economy.',
    // He comes out of the graph to stand above it as it moves aside,
    // taking his end of his triples with him; his name flows from him to
    // the other side, the card coming in as it nears; then the data of his
    // triples from the graph, one row after another.
    motionMs: 6400,
    stage: { ...OPTIMISTS_GRAPH, enrichment: FROM_THE_GRAPH },
  },
  {
    id: 'enrichment',
    chapter: 'enrichment',
    caption: [
      'From a page like this or anywhere else, data about him enriches that one atom, and each builder chooses which of it to use.',
    ],
    alt: 'The graph shrinks to a sketch of itself under Elon Musk, and a page about him comes in under it. Its data flows into his card too, a row for each: what he does, when he was born, what he is known for, where he was born, his citizenships, where he studied, and the companies he started out with.',
    // The graph shrinks to a sketch, without its names, as it moves up;
    // the page comes in under it; and its data flows from its sections into
    // the card, which grows a row for each.
    motionMs: 9000,
    stage: { ...OPTIMISTS_GRAPH, enrichment: FROM_A_PAGE },
  },
  {
    id: 'atom-again',
    chapter: 'enrichment',
    caption: [
      'Everything starts with an atom, and here we are, at the atom again.\nAtoms are the primitives of our universe, shaped by the reality each of us lives in: together, we choose how to compose them.',
    ],
    alt: 'The lines that brought the data go back one by one, the card closing row by row, and the page fades. The graph comes back to the middle, Elon Musk into it, and turns to its other side as every atom of the story steps back and more atoms join them, in none of their triples: the wider graph. At its front, a new atom: civilization shall.',
    // The lines go back one by one, the last that came first, each row of
    // the card closing as its line leaves it; the page and the card fade
    // where they stand. Then the graph comes home to the middle, Elon Musk
    // into it, its triples drawing back, and turns to its other side as
    // the story's atoms step back and the wider graph's join them. Last,
    // civilization shall arrives at its front, the subject alone.
    motionMs: 8000,
    stage: {
      ...OPTIMISTS_GRAPH,
      atoms: {
        ...OPTIMISTS_GRAPH.atoms,
        civilization: {
          at: LAST_TRIPLE.startBuilding,
          role: 'identity',
          during: [0.75, 1],
        },
      },
      triples: {},
      setBack: [
        ...STORY_ATOM_IDS,
        ...(Object.keys(OPTIMISTS_ATOMS) as AtomId[]),
      ],
      // All of the story steps back together, Elon Musk with it, by the
      // time he is back in the graph.
      setBackDuring: [0.3, 0.75],
      camera: { ...OTHER_SIDE_VIEW, during: [0.4, 0.85], isPanning: true },
      leave: [0.4, 0.7],
      crowd: WIDER_GRAPH,
      enrichment: BACK_HOME,
    },
  },
  {
    id: 'your-turn',
    chapter: 'enrichment',
    // No caption: the picture asks the question.
    caption: [],
    alt: 'The film’s last triple, at the front of the graph, among atoms no triple joins yet: civilization shall, start building, the future of information. Its subject and object quieten, and start building, the predicate, is the way on: a link to start building.',
    // Civilization shall makes room as start building and the future of
    // information arrive, and the line between them grows, as the film's
    // first triple did. The claim holds, whole; then the subject and object
    // quieten, for the predicate, the way on, to stand out.
    motionMs: LAST_BEAT_MS,
    stage: {
      ...OPTIMISTS_GRAPH,
      atoms: {
        ...OPTIMISTS_GRAPH.atoms,
        // The subject makes room first, so the names never meet on the way.
        civilization: {
          at: LAST_TRIPLE.civilization,
          role: 'identity',
          during: ofLastBeat(LAST_BEAT.subject),
        },
        startBuilding: {
          at: LAST_TRIPLE.startBuilding,
          role: 'predicate',
          during: ofLastBeat(LAST_BEAT.predicate),
        },
        futureOfInformation: {
          at: LAST_TRIPLE.futureOfInformation,
          role: 'object',
          during: ofLastBeat(LAST_BEAT.object),
        },
      },
      triples: {
        civilizationStartBuilding: { during: ofLastBeat(LAST_BEAT.line) },
      },
      setBack: [
        ...STORY_ATOM_IDS,
        ...(Object.keys(OPTIMISTS_ATOMS) as AtomId[]),
      ],
      // Slowly, the claim held whole a while: the way on grows as they
      // quieten.
      quiet: {
        atoms: ['civilization', 'futureOfInformation'],
        during: ofLastBeat(LAST_BEAT.fade),
      },
      camera: OTHER_SIDE_VIEW,
      crowd: WIDER_GRAPH,
      // Without a caption, the graph grows into the caption's room, as the
      // subject makes room.
      enrichment: { ...BACK_HOME, room: ofLastBeat(LAST_BEAT.subject) },
    },
  },
];

/** A caption as plain text: for a screen reader, and to time the read. */
export function captionText(caption: readonly CaptionPart[]): string {
  return caption
    .map((part) => (typeof part === 'string' ? part : part.text))
    .join('');
}

/**
 * How long a beat holds after its motion, for its caption to be read: an
 * unhurried 17 characters a second, and never less than a moment.
 */
const MS_PER_CHARACTER = 60;
const MIN_HOLD_MS = 2500;

export interface Beat extends BeatSpec {
  index: number;
  /** When the beat starts and ends, in milliseconds from the start. */
  start: number;
  end: number;
}

export const BEATS: readonly Beat[] = BEAT_SPECS.reduce<Beat[]>(
  (beats, spec, index) => {
    const start = beats.at(-1)?.end ?? 0;
    const hold = Math.max(
      MIN_HOLD_MS,
      captionText(spec.caption).length * MS_PER_CHARACTER,
    );

    return [
      ...beats,
      { ...spec, index, start, end: start + spec.motionMs + hold },
    ];
  },
  [],
);

/** The whole film, in milliseconds. */
export const DURATION = BEATS.at(-1)?.end ?? 0;

/** How far dots have flowed at `time`: as far as the film has played, less the beats that hold them still. */
function flowAt(time: number, isHeld: (beat: Beat) => boolean): number {
  return BEATS.reduce(
    (flowed, beat) =>
      isHeld(beat)
        ? flowed
        : flowed +
          Math.min(Math.max(time - beat.start, 0), beat.end - beat.start),
    0,
  );
}

/**
 * How far the cloud's dots have flowed at `time`: held still behind a
 * plane, where its lines are a reminder. Behind a list they flow on: its
 * lines are the cloud's own, out on the plane.
 */
function cloudFlowAt(time: number): number {
  return flowAt(time, (beat) => beat.stage.isCloudStill === true);
}

/**
 * How far the dots on what a deposit holds back have flowed at `time`:
 * held still while its fees are followed on, as if frozen in time, the
 * fees' own lines flowing on.
 */
function heldFlowAt(time: number): number {
  return flowAt(
    time,
    (beat) => beat.stage.plane?.deposit?.shared !== undefined,
  );
}

/** The claim each chapter's plane builds to: its last beat's. */
const FINAL_PLANES = new Map(
  CHAPTERS.map((chapter) => [
    chapter.id,
    BEATS.findLast(
      (beat) => beat.chapter === chapter.id && beat.stage.plane !== undefined,
    )?.stage.plane ?? null,
  ]),
);

export interface ChapterSpan {
  id: ChapterId;
  title: string;
  start: number;
  end: number;
}

/** Each chapter, and when it starts and ends. */
export const CHAPTER_SPANS: readonly ChapterSpan[] = CHAPTERS.map((chapter) => {
  const beats = BEATS.filter((beat) => beat.chapter === chapter.id);

  return {
    ...chapter,
    start: beats[0]?.start ?? 0,
    end: beats.at(-1)?.end ?? 0,
  };
});

function firstBeat(): Beat {
  const beat = BEATS[0];
  if (beat === undefined) {
    throw new Error('The story has no beats.');
  }

  return beat;
}

/** The beat playing at `time`; past the end, the last. */
export function beatAt(time: number): Beat {
  return BEATS.findLast((beat) => beat.start <= time) ?? firstBeat();
}

/** The chapter playing at `time`. */
export function chapterAt(time: number): ChapterSpan {
  const { chapter } = beatAt(time);

  return (
    CHAPTER_SPANS.find((span) => span.id === chapter) ?? {
      ...CHAPTERS[0],
      start: 0,
      end: DURATION,
    }
  );
}

/**
 * Where a step lands in a beat. Playing, at its start, so its motion plays.
 * Paused, where its motion is done, so the picture matches the caption.
 */
export type StepLanding = 'start' | 'settled';

/** Within this much of a landing, stepping back goes to the beat before. */
const STEP_BACK_GRACE_MS = 1200;

function landing(beat: Beat, at: StepLanding): number {
  return at === 'start' ? beat.start : beat.start + beat.motionMs;
}

/**
 * What a step moves by: a beat (the arrow keys), a chapter (Page Up and
 * Page Down) or the whole film (Home and End).
 */
export type StepUnit = 'beat' | 'chapter' | 'film';

/** The beat each unit opens with, in order. */
function openingBeats(unit: StepUnit): readonly Beat[] {
  if (unit === 'beat') {
    return BEATS;
  }
  if (unit === 'film') {
    return [firstBeat()];
  }

  return CHAPTER_SPANS.flatMap(
    (span) => BEATS.find((beat) => beat.chapter === span.id) ?? [],
  );
}

/**
 * Where a step takes the film from `time`. Forward: the next unit, or the
 * end after the last. Back: the start of this one, or the one before when
 * this one has only just started, as a media player does; never before the
 * first, so a paused film never lands on an empty stage.
 */
export function stepFrom(
  time: number,
  direction: 1 | -1,
  at: StepLanding,
  unit: StepUnit = 'beat',
): number {
  const units = openingBeats(unit);
  const index = Math.max(
    units.findLastIndex((beat) => beat.start <= time),
    0,
  );
  if (direction === 1) {
    const next = units[index + 1];

    return next === undefined ? DURATION : landing(next, at);
  }
  const current = units[index] ?? firstBeat();
  const here = landing(current, at);
  const previous = units[index - 1];
  if (time - here > STEP_BACK_GRACE_MS || previous === undefined) {
    return here;
  }

  return landing(previous, at);
}

/** One atom as drawn at a moment. */
export interface DrawnAtom {
  id: AtomId;
  label: string;
  /** A direction from the cloud's centre. */
  at: Vec3;
  /** The shape it is drawn as: `progress` of the way from one to another. */
  role: { from: Role; to: Role; progress: number };
  /** 0 when absent, 1 when fully there. */
  presence: number;
}

/** One triple as drawn at a moment: a line through its three atoms. */
export interface DrawnTriple {
  id: TripleId;
  points: readonly [Vec3, Vec3, Vec3];
  /** How much of the line is drawn, from the subject on: 0 to 1. */
  progress: number;
}

/** Another perspective as drawn at a moment: the cloud's copy, beside it. */
export interface OtherScene {
  /** How far the cloud has moved aside, and the copy with it, to its own side, 0 to 1. */
  aside: number;
  /** Whose perspectives the two are, the cloud's and the copy's, shown above them. */
  viewers: readonly [string, string];
  /** The cloud's atoms, where they stand on it, each in the role the copy's triples give it. */
  atoms: readonly DrawnAtom[];
  triples: DrawnTriple[];
  /**
   * The copy's atoms set back, and how far: those in none of the triples it
   * trusts, as they draw back; and those the cloud sets back, until its own
   * triples join them.
   */
  setBack: ReadonlyMap<AtomId, number>;
}

export interface Scene {
  beat: Beat;
  camera: Camera;
  atoms: DrawnAtom[];
  triples: DrawnTriple[];
  /**
   * The plane in front of the cloud: the claim as the beat found it and as
   * it leaves it, `progress` of the way between. Both `null` when no plane
   * is open.
   */
  plane: {
    from: PlaneState | null;
    to: PlaneState | null;
    progress: number;
    /** How long the change takes, in milliseconds: what times a stagger in it. */
    durationMs: number;
    /**
     * The claim the chapter builds to, as its last beat leaves it: the
     * plane sizes itself by it, and stands each claim where it will stand,
     * from the start.
     */
    fit: PlaneState | null;
  };
  /** How far the cloud is out of focus behind the plane, 0 to 1. */
  depth: number;
  /** How much of the cloud shows, 0 to 1. */
  cloud: number;
  /** Atoms the cloud shows set back, and how far, 0 to 1. */
  setBack: ReadonlyMap<AtomId, number>;
  /** Another perspective beside the cloud, or `null`. */
  other: OtherScene | null;
  /**
   * How far the dots along the lines have flowed: the film's time, held at
   * 0 when motion is reduced.
   */
  flow: number;
  /**
   * The same for the cloud's lines, held once the cloud first goes out of
   * focus: behind a plane, its lines are a reminder, and stay still.
   */
  cloudFlow: number;
  /**
   * The same for what a deposit holds back as its fees are followed on:
   * held still while they are (see `heldFlowAt`).
   */
  heldFlow: number;
  /**
   * How far each of the last chapter's parts has come, 0 to 1: see
   * `ENRICHMENT_PARTS`. `null` before the last chapter.
   */
  enrichment: Record<EnrichmentPart, number> | null;
  /** How far the wider graph's atoms have come, 0 to 1: see `CROWD`. */
  crowd: number;
  /** Atoms shown quieter than the rest, and how far, 0 to 1. */
  quiet: ReadonlyMap<AtomId, number>;
  /**
   * An atom's vault, under its name, and people depositing into it, or
   * `null`: how far they show, how far the people's lines have grown up to
   * the vault, and how far its line has grown on to the atom, each 0 to 1.
   */
  vault: {
    atom: AtomId;
    shown: number;
    deposits: number;
    onward: number;
  } | null;
}

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** How far along its own part of the motion a change is. */
function within(progress: number, during: During = [0, 1]): number {
  const [start, end] = during;

  return clamp01((progress - start) / (end - start));
}

/** How far along its own part of the motion a change is, eased. */
function along(progress: number, during: During = [0, 1]): number {
  return easeInOutCubic(within(progress, during));
}

/**
 * When, as another perspective opens, the cloud moves aside as its copy
 * splits off from it; the triples the copy does not trust draw back on it,
 * the atoms they joined set back with them; and then its own triples grow,
 * the atoms they join coming forward with them.
 */
const OTHER_OPENING = {
  aside: [0, 0.3],
  distrust: [0.36, 0.56],
  triples: [0.62, 0.9],
} as const satisfies Record<string, During>;

/**
 * When, as it closes, the copy's own triples draw back, and it slides back
 * onto the cloud, its atoms onto the same atoms, fading as it goes.
 */
const OTHER_CLOSING = {
  triples: [0, 0.3],
  aside: [0.2, 0.8],
} as const satisfies Record<string, During>;

/** The atom ids, in the order they are listed. */
const ATOM_IDS = Object.keys(ATOMS) as AtomId[];
const TRIPLE_IDS = Object.keys(TRIPLES) as TripleId[];

/**
 * The scene at `time`. With `isStill`, for a reader who asked for reduced
 * motion, there is no motion: each beat shows as it is left.
 */
export function sceneAt(time: number, isStill = false): Scene {
  const beat = beatAt(time);
  const target = beat.stage;
  // Before the first beat, the stage is empty, with the camera already set.
  const previous: StageState = BEATS[beat.index - 1]?.stage ?? {
    camera: target.camera,
    atoms: {},
    triples: {},
  };
  const progress = isStill ? 1 : clamp01((time - beat.start) / beat.motionMs);

  const camera = along(progress, target.camera.during);
  const turnTo = target.camera.isPanning === true ? panPoint : arcPoint;
  const planeDuring = target.plane?.during ?? previous.plane?.during ?? [0, 1];
  // The chapter that sizes the plane: this beat's, or, as the plane closes,
  // the one before's, so it keeps its size as it goes.
  const planeChapter =
    target.plane !== undefined
      ? beat.chapter
      : previous.plane !== undefined
        ? BEATS[beat.index - 1]?.chapter
        : undefined;
  const atoms: DrawnAtom[] = [];
  for (const id of ATOM_IDS) {
    const from = previous.atoms[id];
    const to = target.atoms[id];
    const state = to ?? from;
    if (state === undefined) {
      continue;
    }
    // One the beat leaves out goes when the beat says, or as it came.
    const t = along(
      progress,
      to?.during ??
        (to === undefined ? (target.leave ?? from?.during) : from?.during),
    );
    // An atom that arrives to take its role later arrives plain.
    const fromRole =
      from?.role ?? (to?.roleDuring === undefined ? state.role : 'identity');
    atoms.push({
      id,
      label: ATOMS[id].label,
      at:
        from !== undefined && to !== undefined
          ? arcPoint(from.at, to.at, t)
          : state.at,
      role: {
        from: fromRole,
        to: state.role,
        progress: along(progress, to?.roleDuring ?? to?.during ?? from?.during),
      },
      presence: from === undefined ? t : to === undefined ? 1 - t : 1,
    });
  }

  // Set back as the beat says: one arriving, from the start; one that
  // already stands, as the beat goes, or when it says.
  const shown = along(progress, target.setBackDuring);
  const setBack = new Map(
    atoms.flatMap((atom): Array<[AtomId, number]> => {
      const was = previous.setBack?.includes(atom.id) ?? false;
      const is = target.setBack?.includes(atom.id) ?? false;
      const amount = is
        ? was || previous.atoms[atom.id] === undefined
          ? 1
          : shown
        : was
          ? 1 - shown
          : 0;

      return amount > 0 ? [[atom.id, amount]] : [];
    }),
  );

  const triples: DrawnTriple[] = [];
  for (const id of TRIPLE_IDS) {
    const isBefore = previous.triples[id] !== undefined;
    const after = target.triples[id];
    if (!isBefore && after === undefined) {
      continue;
    }
    const { subject, predicate, object } = TRIPLES[id];
    const point = (atom: AtomId): Vec3 =>
      atoms.find((drawn) => drawn.id === atom)?.at ?? FRONT;
    const t = along(
      progress,
      after?.during ?? (after === undefined ? target.leave : undefined),
    );
    triples.push({
      id,
      points: [point(subject), point(predicate), point(object)],
      progress: isBefore ? (after === undefined ? 1 - t : 1) : t,
    });
  }

  return {
    beat,
    camera: {
      facing: turnTo(previous.camera.facing, target.camera.facing, camera),
      focus: turnTo(
        previous.camera.focus ?? previous.camera.facing,
        target.camera.focus ?? target.camera.facing,
        camera,
      ),
      whole: lerp(previous.camera.whole ?? 0, target.camera.whole ?? 0, camera),
      raise: lerp(previous.camera.raise ?? 0, target.camera.raise ?? 0, camera),
      shift: lerp(previous.camera.shift ?? 0, target.camera.shift ?? 0, camera),
      // Zoom moves on a log scale, so a pull back feels even throughout.
      zoom: Math.exp(
        lerp(
          Math.log(previous.camera.zoom),
          Math.log(target.camera.zoom),
          camera,
        ),
      ),
    },
    atoms,
    triples,
    plane: {
      from: previous.plane ?? null,
      to: target.plane ?? null,
      // Evenly: the plane eases each of its own stages.
      progress: within(progress, planeDuring),
      durationMs: beat.motionMs * (planeDuring[1] - planeDuring[0]),
      fit:
        planeChapter === undefined
          ? null
          : (FINAL_PLANES.get(planeChapter) ?? null),
    },
    depth: lerp(previous.depth ?? 0, target.depth ?? 0, camera),
    cloud: lerp(
      previous.cloud?.shown ?? 1,
      target.cloud?.shown ?? 1,
      along(progress, target.cloud?.during ?? previous.cloud?.during),
    ),
    flow: isStill ? 0 : time,
    cloudFlow: isStill ? 0 : cloudFlowAt(time),
    heldFlow: isStill ? 0 : heldFlowAt(time),
    setBack,
    other: otherAt(previous, target, progress, atoms, triples, setBack),
    enrichment: enrichmentAt(previous, target, progress),
    crowd:
      target.crowd === undefined
        ? 0
        : previous.crowd === undefined
          ? along(progress, target.crowd)
          : 1,
    quiet: quietAt(previous, target, progress),
    vault: vaultAt(previous, target, progress),
  };
}

/**
 * When, in the beat after the one that shows an atom's vault, the vault
 * goes, and the people and lines with it.
 */
const VAULT_LEAVES: During = [0, 0.4];

/** The atom's vault shown, and how far, `progress` of the way into the beat. */
function vaultAt(
  previous: StageState,
  target: StageState,
  progress: number,
): Scene['vault'] {
  const was = previous.vault?.atom;
  const is = target.vault;
  if (is !== undefined) {
    const isThere = was === is.atom;

    return {
      atom: is.atom,
      shown: isThere ? 1 : along(progress, is.during),
      deposits: isThere ? 1 : along(progress, is.deposits),
      onward: isThere ? 1 : along(progress, is.onward),
    };
  }

  return was === undefined
    ? null
    : {
        atom: was,
        shown: 1 - along(progress, VAULT_LEAVES),
        deposits: 1,
        onward: 1,
      };
}

/** The atoms shown quieter, and how far, `progress` of the way into the beat. */
function quietAt(
  previous: StageState,
  target: StageState,
  progress: number,
): Map<AtomId, number> {
  const was = new Set(previous.quiet?.atoms);
  const is = new Set(target.quiet?.atoms);
  const t = along(progress, target.quiet?.during);

  return new Map(
    [...new Set([...was, ...is])].map((id): [AtomId, number] => [
      id,
      was.has(id) ? (is.has(id) ? 1 : 1 - t) : t,
    ]),
  );
}

/**
 * The direction `t` of the way from `from` to `to`, panning: round the
 * vertical the shorter way, and up or down evenly as it goes.
 */
function panPoint(from: Vec3, to: Vec3, t: number): Vec3 {
  const longitudeOf = ([x, , z]: Vec3): number => Math.atan2(x, z);
  const latitudeOf = ([, y]: Vec3): number =>
    Math.asin(Math.min(Math.max(y, -1), 1));
  const start = longitudeOf(from);
  // The turn round the vertical, the shorter way: within half a turn.
  const turn =
    ((((longitudeOf(to) - start + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) %
      (2 * Math.PI)) -
    Math.PI;
  const longitude = start + turn * t;
  const latitude = lerp(latitudeOf(from), latitudeOf(to), t);

  return [
    Math.sin(longitude) * Math.cos(latitude),
    Math.sin(latitude),
    Math.cos(longitude) * Math.cos(latitude),
  ];
}

/**
 * The last chapter's parts, `progress` of the way into the beat: those the
 * beat before left on stage, all there; those the beat brings, coming.
 */
function enrichmentAt(
  previous: StageState,
  target: StageState,
  progress: number,
): Scene['enrichment'] {
  const coming = target.enrichment;
  if (coming === undefined) {
    return null;
  }
  const amount = (part: EnrichmentPart): number => {
    const during = coming[part];
    if (during === undefined) {
      return 0;
    }
    if (previous.enrichment?.[part] !== undefined) {
      return 1;
    }
    // The data, and its going, evenly: each line eases its own part of it.
    return part === 'graph' || part === 'data' || part === 'close'
      ? within(progress, during)
      : along(progress, during);
  };

  return {
    out: amount('out'),
    graph: amount('graph'),
    small: amount('small'),
    page: amount('page'),
    data: amount('data'),
    close: amount('close'),
    home: amount('home'),
    room: amount('room'),
  };
}

/** Another perspective `progress` of the way from one beat's to the next: see `OTHER_OPENING`. */
function otherAt(
  previous: StageState,
  target: StageState,
  progress: number,
  atoms: readonly DrawnAtom[],
  triples: readonly DrawnTriple[],
  cloudSetBack: ReadonlyMap<AtomId, number>,
): OtherScene | null {
  const other = target.other ?? previous.other;
  if (other === undefined) {
    return null;
  }
  const isOpening = previous.other === undefined;
  const isClosing = target.other === undefined;
  const at = (window: During): number =>
    isOpening ? along(progress, window) : 1;
  const closing = (window: During): number =>
    isClosing ? 1 - along(progress, window) : 1;
  const point = (id: AtomId): Vec3 =>
    atoms.find((atom) => atom.id === id)?.at ?? FRONT;
  const atomsOf = (ids: readonly TripleId[]): Set<AtomId> =>
    new Set(
      ids.flatMap((id) => {
        const { subject, predicate, object } = TRIPLES[id];

        return [subject, predicate, object];
      }),
    );
  // The atoms of the triples it trusts stand out on it; the rest, set back.
  const connected = atomsOf([...other.trusted, ...other.triples]);
  const setBack = new Map(
    atoms.map((atom): [AtomId, number] => {
      const onCloud = cloudSetBack.get(atom.id) ?? 0;

      return [
        atom.id,
        connected.has(atom.id)
          ? onCloud * (1 - at(OTHER_OPENING.triples))
          : Math.max(onCloud, at(OTHER_OPENING.distrust)),
      ];
    }),
  );

  // Each atom of its triples in the role they give it there: an object
  // only, not the subject of another too, is a square on it. It takes that
  // role as its triples grow.
  const roleOn = (id: AtomId): Role | undefined => {
    const roles = [...other.trusted, ...other.triples].flatMap((triple) => {
      const { subject, predicate, object } = TRIPLES[triple];

      return [
        ...(subject === id ? ['subject'] : []),
        ...(predicate === id ? ['predicate'] : []),
        ...(object === id ? ['object'] : []),
      ];
    });
    if (roles.includes('predicate')) {
      return 'predicate';
    }
    if (roles.includes('subject')) {
      return roles.includes('object') ? 'bridge' : 'identity';
    }

    return roles.includes('object') ? 'object' : undefined;
  };
  const own = atoms.map((atom): DrawnAtom => {
    const role = roleOn(atom.id);

    return role === undefined || role === atom.role.to
      ? atom
      : {
          ...atom,
          role: {
            from: atom.role.to,
            to: role,
            progress: at(OTHER_OPENING.triples),
          },
        };
  });

  return {
    aside: at(OTHER_OPENING.aside) * closing(OTHER_CLOSING.aside),
    viewers: other.viewers,
    atoms: own,
    setBack,
    triples: [
      ...triples.map((triple) => ({
        ...triple,
        progress: other.trusted.includes(triple.id)
          ? triple.progress
          : triple.progress * (1 - at(OTHER_OPENING.distrust)),
      })),
      ...other.triples.map((id): DrawnTriple => {
        const { subject, predicate, object } = TRIPLES[id];

        return {
          id,
          points: [point(subject), point(predicate), point(object)],
          progress: at(OTHER_OPENING.triples) * closing(OTHER_CLOSING.triples),
        };
      }),
    ],
  };
}

/**
 * The turn that brings `facing` to the front with the equator level: round
 * the vertical first, then up or down, as a camera on a tripod turns. The
 * shortest turn would also roll the picture once the camera rises.
 */
export function turnToFace(facing: Vec3): Quat {
  const [x, y, z] = facing;
  const longitude = Math.atan2(x, z);
  const latitude = Math.asin(Math.min(Math.max(y, -1), 1));

  return multiply(
    axisAngle([1, 0, 0], latitude),
    axisAngle([0, 1, 0], -longitude),
  );
}

/** The whole cloud's radius, as a share of the canvas's shorter side. */
export const WHOLE_SHARE = 0.42;

/** The cloud's radius at zoom 1, as a share of the canvas's width. */
export const RADIUS_SHARE = 0.57;
/**
 * The smallest radius, in CSS pixels, at which the names under neighbouring
 * atoms stay apart.
 */
export const MIN_RADIUS_PX = 168;
/**
 * How much closer than asked the camera comes before it has turned all the
 * way to its focus: it turns as it comes closer, never with a jump.
 */
const FOCUS_BLEND = 0.3;

/** How the cloud is shown: the direction facing the viewer, and its radius. */
export interface View {
  facing: Vec3;
  radius: number;
}

/**
 * The camera's view on a canvas `width` CSS pixels wide. It shows what it
 * is asked to while the names stay apart. On a screen too narrow for that,
 * the cloud grows no smaller than the names allow and turns to the focus: a
 * phone follows the story where a wide screen shows all of it.
 */
export function viewOf(
  camera: Camera,
  width: number,
  height = Number.POSITIVE_INFINITY,
): View {
  const wanted = width * RADIUS_SHARE * camera.zoom;
  const radius = Math.max(wanted, MIN_RADIUS_PX);
  const turn = wanted > 0 ? clamp01((radius / wanted - 1) / FOCUS_BLEND) : 1;
  // Pulled back to all of it, it is as large as the shorter side allows,
  // and faces what the camera faces on any screen.
  const whole = camera.whole ?? 0;

  return {
    facing: arcPoint(
      camera.facing,
      camera.focus ?? camera.facing,
      turn * (1 - whole),
    ),
    radius: lerp(radius, Math.min(width, height) * WHOLE_SHARE, whole),
  };
}

/** "400, 200 and 20" */
function listed(values: readonly (number | string)[]): string {
  return values.length < 2
    ? values.join('')
    : `${values.slice(0, -1).join(', ')} and ${values.at(-1) ?? ''}`;
}

/**
 * A triple's vault, and the people with a position in it, in words: the
 * claim's own, or that of a triple inside it.
 */
function describeVaults(
  vaults: PlaneVaults,
  term: PlaneTerm,
  labelOf: (atom: AtomId) => string,
): string {
  const owner = tripleIn(term, vaults.frame);
  const whose =
    owner === undefined || ('triple' in term && term.triple === owner)
      ? 'its vault'
      : `the vault of ${planeSentence({ triple: owner }, labelOf)}`;
  const side = (positions: readonly number[], which: string): string =>
    `${positions.length} ${which} it${vaults.isWeighed === true ? `, with ${listed(positions)}` : ''}${vaults.isTotalled === true ? ` (${positions.reduce((sum, value) => sum + value, 0)} in all)` : ''}`;

  return ` ${vaults.against.length + vaults.for.length} people have a position in ${whose}: ${side(vaults.against, 'against')}, and ${side(vaults.for, 'for')}.`;
}

/** What the scene shows, in words: the canvas's label. */
export function describeScene(scene: Scene): string {
  if (scene.beat.alt !== undefined) {
    return scene.beat.alt;
  }
  // Up close on the plane, the claim on it is what shows.
  const { plane } = scene;
  const shown = plane.progress >= 0.5 ? plane.to : (plane.from ?? plane.to);
  if (shown !== null && (plane.from !== null || plane.progress >= 0.5)) {
    const labelOf = (atom: AtomId): string => ATOMS[atom].label;

    if ('atom' in shown.term) {
      return `An atom, up close: ${labelOf(shown.term.atom)}.`;
    }
    if ('list' in shown.term) {
      const { members, predicate, object, isRanked } = shown.term.list;
      const order = isRanked
        ? members.toSorted((a, b) => b.weight - a.weight)
        : members;
      const whose = shown.perspective?.options[shown.perspective.chosen];
      const through =
        whose === undefined
          ? ''
          : `, through ${whose.endsWith('s') ? `${whose}’` : `${whose}’s`} perspective`;

      return `A list of triples, each ${labelOf(predicate)} ${labelOf(object)}${through}: ${listed(order.map((member) => `${labelOf(member.atom)}, with ${member.weight}`))}${isRanked === true ? ', ranked by weight' : ''}.`;
    }

    const branches = (shown.branches ?? [])
      .map(
        ({ subject, predicate, object }) =>
          ` And a triple of its own: ${'atom' in subject ? labelOf(subject.atom) : 'the whole triple'} ${labelOf(predicate)} ${labelOf(object)}.`,
      )
      .join('');
    const vaults =
      shown.vaults === undefined
        ? ''
        : describeVaults(shown.vaults, shown.term, labelOf);

    return (shown.spelled?.length ?? 0) > 0
      ? `A triple, still in words: ${planeSentence(shown.term, labelOf)}.`
      : `A triple: ${planeSentence(shown.term, labelOf)}.${branches}${vaults}`;
  }

  const drawn = scene.triples.filter((triple) => triple.progress >= 0.5);
  if (drawn.length > 0) {
    return drawn
      .map(({ id }) => {
        const triple: TripleAtoms = TRIPLES[id];
        const named = (atom: AtomId, whole: string | undefined): string =>
          whole === undefined ? ATOMS[atom].label : `the triple ${whole}`;

        return `A triple: ${named(triple.subject, triple.subjectTriple)}, the subject; ${ATOMS[triple.predicate].label}, the predicate; ${named(triple.object, triple.objectTriple)}, the object.`;
      })
      .join(' ');
  }
  // Left to right, as the story runs round the cloud.
  const longitude = ([x, , z]: Vec3): number => Math.atan2(x, z);
  const present = scene.atoms
    .filter((atom) => atom.presence >= 0.5)
    .toSorted((a, b) => longitude(a.at) - longitude(b.at))
    .map((atom) => atom.label);
  if (present.length === 0) {
    return 'An empty scene.';
  }

  return present.length === 1
    ? `An atom: ${present[0] ?? ''}.`
    : `Atoms: ${present.slice(0, -1).join(', ')} and ${present.at(-1) ?? ''}.`;
}
