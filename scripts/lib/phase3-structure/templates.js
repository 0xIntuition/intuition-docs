'use strict';

const { EXAMPLE_ROUTES } = require('../example-cards');
const { routeLinks } = require('./markdown');

const PACKAGE_HEADINGS = [
  "What it's for",
  'When to use it',
  'Install',
  'Entry points',
  'Depends on and works with',
  'Example',
  'Related concepts',
  'Source',
];
const MIGRATION = [
  ['Before you start', 'What changed'],
  ...[
    'Map your packages',
    'Update imports',
    'Replace atom creation',
    'Replace triple creation',
    'Move reads',
    'Preserve identity',
    'Move agent and CLI plans',
  ].map((text, i) => ['Steps', `${i + 1}. ${text}`]),
  ['Related', 'Where did my page go'],
];

function validateTemplate(doc, page, docs, fail) {
  const {
    id,
    route,
    frontMatter: { kind },
  } = doc;
  const { headings, prose, section } = page;
  const h2 = headings
    .filter((heading) => heading.depth === 2)
    .map((heading) => heading.text);
  if (id === 'index' || id.endsWith('/index')) {
    const linked = new Set(routeLinks(prose));
    if (id === 'examples/index') {
      if (page.exampleGrid) {
        for (const card of page.exampleGrid.cards) linked.add(card.to);
      } else if (
        EXAMPLE_ROUTES.every((route) =>
          docs.some((child) => child.route === route),
        )
      ) {
        fail('the worked examples landing must include its six-Card grid');
      }
    }
    for (const child of docs) {
      const required =
        id === 'index'
          ? /^[^/]+\/index$/.test(child.id)
          : child.route.startsWith(route + '/');
      if (required && !linked.has(child.route))
        fail(`landing must link ${child.route}`);
    }
    return;
  }
  let expected;
  if (id.startsWith('reference/packages/')) expected = PACKAGE_HEADINGS;
  else if (kind === 'concept')
    expected = id.startsWith('concepts/')
      ? ['How it works', 'Example', 'Common mistakes', 'Next']
      : ['How it works', 'Related'];
  else if (kind === 'how-to') {
    expected = [
      'Before you start',
      'Steps',
      'Check the result',
      ...(h2.includes('Troubleshooting') ? ['Troubleshooting'] : []),
      'Related',
    ];
    if (!/^ {0,3}(?:###\s+1\.|1[.)])\s+\S/m.test(section('Steps')))
      fail('Steps must include numbered instructions');
  } else if (kind === 'tutorial') {
    expected = [
      "What you'll build",
      'Before you start',
      'Steps',
      'Run it',
      ...(id.startsWith('examples/') ? ['Full source'] : []),
      'Next steps',
    ];
    const time = [
      ...prose.matchAll(
        /^\*\*Time:\*\* ([1-9]\d*) minutes · \*\*Steps:\*\* ([1-9]\d*)[ \t]*$/gm,
      ),
    ];
    const steps = headings.filter(
      (heading) => heading.depth === 3 && /^\d+\.\s+/.test(heading.text),
    );
    const inside = [
      ...section('Steps').matchAll(/^ {0,3}###\s+(\d+)\.\s+\S/gm),
    ];
    if (
      time.length !== 1 ||
      time[0].index > (headings[0]?.start ?? 0) ||
      steps.length !== Number(time[0][2]) ||
      inside.length !== steps.length ||
      inside.some((match, i) => Number(match[1]) !== i + 1)
    )
      fail(
        'tutorial needs **Time:** N minutes · **Steps:** M followed by exactly M consecutive numbered Steps subheadings',
      );
    const limit = { 'get-started/quickstart': 6, 'get-started/first-write': 8 }[
      id
    ];
    if (
      limit &&
      time.length &&
      (Number(time[0][1]) > 10 || Number(time[0][2]) > limit)
    )
      fail(`tutorial limit is 10 minutes and ${limit} steps`);
  }
  if (expected && JSON.stringify(h2) !== JSON.stringify(expected))
    fail(`expected H2 headings in order: ${expected.join(' / ')}`);
  if (id === 'get-started/migrate-from-v1') {
    let parent;
    const topics = [];
    for (const heading of headings) {
      if (heading.depth === 2) parent = heading.text;
      if (heading.depth === 3) topics.push([parent, heading.text]);
    }
    if (JSON.stringify(topics) !== JSON.stringify(MIGRATION))
      fail(
        'migration topics must appear under their specified parent H2 in outline order',
      );
  }
}

module.exports = { validateTemplate };
