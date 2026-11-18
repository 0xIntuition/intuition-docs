'use strict';

const { parseDiagram, readPage, links, routeLinks } = require('./markdown');
const { sameMembers } = require('./packages');
const conceptPath = (slug) => '/docs/concepts/' + slug;
const graphId = (slug) => slug.replaceAll('-', '_');

function validateLadder(docs, ladder, manifest, fail) {
  const rows = ladder.concepts;
  const identifier = manifest.specs.find(
    (spec) => spec.name === 'intuition-identifier',
  );
  if (
    ladder.source.commit !== manifest.source.commit ||
    ladder.source.repository !== manifest.source.repository ||
    !identifier ||
    ['repository', 'commit', 'version'].some(
      (key) => identifier[key] !== ladder.identifier[key],
    )
  )
    fail('concept ladder source differs from the pinned manifest');
  const bySlug = new Map(
    docs
      .filter((doc) => doc.id.startsWith('concepts/'))
      .map((doc) => [doc.id.slice(9), doc]),
  );
  if (
    rows.length !== 23 ||
    !sameMembers(
      [...bySlug.keys()],
      rows.map((row) => row.slug),
    )
  )
    fail('expected the 23 normative concept pages including the map');
  const earlier = new Map();
  for (const row of rows) {
    const doc = bySlug.get(row.slug);
    if (doc) {
      const fm = doc.frontMatter;
      if (
        fm.kind !== 'concept' ||
        fm.title !== row.title ||
        ['reader', 'packages', 'depends_on'].some(
          (field) => !sameMembers(fm[field], row[field]),
        )
      )
        fail(`${doc.id}: metadata differs from normative concept ladder`);
      for (const dep of Array.isArray(fm.depends_on) ? fm.depends_on : []) {
        if (!earlier.has(dep) || earlier.get(dep) > row.tier)
          fail(`${doc.id}: cyclic, forward or higher-tier prerequisite ${dep}`);
      }
    }
    earlier.set(row.slug, row.tier);
  }
}

function validateConcept(doc, page, rows, shipped, fail) {
  const row = rows.find((candidate) => doc.id === 'concepts/' + candidate.slug);
  if (!row || row.slug === 'index') return;
  const intro = page.prose
    .slice(0, page.headings[0]?.start)
    .trim()
    .replace(/^(?:import[^\n]*\n\s*)*/, '')
    .replace(/^<AppliesTo\s*\/>\s*/, '');
  const fields = intro.match(
    /^([\s\S]+?)\n+\*\*Builds on:\*\*[ \t]*(.*?)\n+\*\*Implemented by:\*\*[ \t]*(.*)$/,
  );
  if (!fields) {
    fail('expected definition followed by Builds on and Implemented by lines');
    return;
  }
  const definition = fields[1].trim().replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  if (
    !definition ||
    /\n\s*\n/.test(definition) ||
    definition.split(/\s+/).length > 80
  )
    fail('definition must be a paragraph of 1–80 words');
  const dependencies = row.depends_on
    .map(conceptPath)
    .filter((route) => shipped.has(route));
  if (
    links(fields[2]).length !== dependencies.length ||
    !sameMembers(routeLinks(fields[2]), dependencies) ||
    (row.slug === 'atoms' &&
      fields[2] !== 'Nothing; this is the base of the ladder.')
  )
    fail('Builds on must identify the shipped prerequisites');
  const implementations = row.packages.map(
    (name) => '/docs/reference/packages/' + name.split('/')[1],
  );
  if (row.slug === 'indexing-and-querying') {
    if (
      !sameMembers(routeLinks(fields[3]), ['/docs/build/query-core']) ||
      !/^\[Intuition Core\]\(\/docs\/build\/query-core\/?\)\.?$/.test(fields[3])
    )
      fail(
        'Implemented by must name Intuition Core and link to the Core query guide',
      );
  } else if (
    links(fields[3]).length !== implementations.length ||
    !sameMembers(routeLinks(fields[3]), implementations)
  )
    fail('Implemented by must link exactly the implementing package pages');
  const next = new Set(routeLinks(page.section('Next')));
  for (const other of rows.filter((other) =>
    other.depends_on.includes(row.slug),
  )) {
    if (
      shipped.has(conceptPath(other.slug)) &&
      !next.has(conceptPath(other.slug))
    )
      fail(`Next must link to ${other.slug}`);
  }
}

function validateConceptMap(doc, page, rows, fail) {
  const fences = page.fences.filter((fence) => fence.info === 'mermaid');
  if (fences.length !== 1) {
    fail('expected one concept-map Mermaid block');
    return;
  }
  const graph = parseDiagram(fences[0].code);
  const topics = rows.filter((row) => row.slug !== 'index');
  const edges = topics.flatMap((row) =>
    row.depends_on.map((dep) => graphId(dep) + '-->' + graphId(row.slug)),
  );
  if (
    graph.direction !== 'graph BT' ||
    graph.errors.length ||
    !sameMembers(
      [...graph.nodes.keys()],
      topics.map((row) => graphId(row.slug)),
    ) ||
    !sameMembers(
      graph.edges.map(({ from, kind, to }) => from + kind + to),
      edges,
    )
  )
    fail(
      'concept map must be graph BT with the exact concept nodes and prerequisite edges',
    );
  const needed = new Set(['enrichment']);
  for (const row of [...topics].reverse())
    if (needed.has(row.slug)) row.depends_on.forEach((dep) => needed.add(dep));
  const closure = topics
    .filter((row) => needed.has(row.slug))
    .map((row) => row.slug);
  const after = readPage({
    ...doc,
    content: doc.content.split(/\r?\n/).slice(fences[0].endLine).join('\n'),
  }).prose;
  // Accept a linked reading path or a textual arrow chain, below the diagram.
  const paragraphs = after.trim().split(/\n\s*\n/);
  const correct = paragraphs.some((paragraph) => {
    const linked = routeLinks(paragraph)
      .filter((route) => route.startsWith('/docs/concepts/'))
      .map((route) => route.slice(15));
    if (linked.length)
      return JSON.stringify(linked) === JSON.stringify(closure);
    const chain = paragraph.replace(/[`*_]/g, '').toLowerCase();
    return new RegExp(
      '(?:^|[^a-z-])' + closure.join('\\s*(?:→|->)\\s*') + '(?:[.!]|$)',
    ).test(chain);
  });
  if (!correct || closure.length !== 11)
    fail(
      'state the 11-page enrichment prerequisite closure below the map in sidebar order',
    );
}

const TIERS = [
  'Protocol primitives',
  'Intuition Identifier',
  'Classification and enrichment',
  'Protocol writes',
  'Indexing and querying',
];
const ATTACHMENTS = [
  ['Semantic / data modeling', 0],
  ['Builder helpers', 0],
  ['Identity packages', 1],
  ['Pipeline runtime', 2],
  ['Atom processing', 2],
  ['Application integration', 3],
  ['Protocol plumbing', 3],
  ['Intuition Core', 4],
];
function validateHowItFits(page, fail) {
  const diagrams = page.fences
    .filter((fence) => fence.info === 'mermaid')
    .map((fence) => parseDiagram(fence.code));
  const correct = diagrams.some((graph) => {
    const connects = (from, to, kind) =>
      graph.edges.some(
        (edge) =>
          (!kind || edge.kind === kind) &&
          graph.nodes.get(edge.from) === from &&
          graph.nodes.get(edge.to) === to,
      );
    return (
      !graph.errors.length &&
      TIERS.slice(1).every((tier, i) => connects(TIERS[i], tier, '-->')) &&
      ATTACHMENTS.every(([label, i]) => connects(label, TIERS[i]))
    );
  });
  if (!correct)
    fail(
      'diagram must connect the five tiers and show the seven package layers and Core',
    );
  const mapping =
    /Protocol primitives[^.!?]*?Tier 1[^.!?]*?Intuition Identifier[^.!?]*?Tier 2[^.!?]*?Identity[^.!?]*?Classification and enrichment[^.!?]*?Tiers? 3 and 4[^.!?]*?Meaning[^.!?]*?Processing[^.!?]*?Protocol writes[^.!?]*?Indexing and querying[^.!?]*?Tier 5[^.!?]*?Data flow/i;
  if (!mapping.test(page.prose))
    fail('explain the five-tier mapping to the concept ladder in a sentence');
}

const IID_PAGES = new Set([
  'concepts/iid',
  'concepts/iid-schemes',
  'concepts/identity-ladder',
  'concepts/representation-profiles',
  'concepts/iid-registry',
  'concepts/same-as',
  'reference/iid-schemes',
]);
function validateIdentifier(doc, page, identifier, mismatch, fail) {
  if (IID_PAGES.has(doc.id)) {
    const prefix = `${identifier.repository}/blob/${identifier.commit}/spec/`;
    const refs = links(page.prose).filter(({ label }) =>
      /IID spec §\d+(?:\.\d+)+/.test(label),
    );
    if (
      !refs.length ||
      refs.some(
        ({ target }) =>
          !target.startsWith(prefix) ||
          !/^[\w-]+\.md(?:#[\w.-]+)?$/.test(target.slice(prefix.length)),
      )
    )
      fail('cite the pinned canonical IID spec section');
  }
  if (mismatch?.status !== 'open' || !mismatch.docsPages.includes(doc.route))
    return;
  const info = [
    ...page.prose.matchAll(/^:::info\b([^\n]*\n[\s\S]*?)^:::[ \t]*$/gm),
  ]
    .map((m) => m[1])
    .join('\n');
  const schemeDifferences = [
    'wd',
    'acct',
    'apple-podcasts',
    'letterboxd',
    'podcast-index',
  ];
  const required =
    doc.id === 'concepts/representation-profiles' ? ['7.8'] : schemeDifferences;
  if (doc.id === 'reference/packages/iid-spec')
    required.push('7.8', '00', '01', '04', '05', '09');
  if (required.some((token) => !info.includes(token)))
    fail('describe the applicable M-1 divergences in an info block');
}

module.exports = {
  validateLadder,
  validateConcept,
  validateConceptMap,
  validateHowItFits,
  validateIdentifier,
};
