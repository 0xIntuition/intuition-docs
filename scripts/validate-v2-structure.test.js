'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { versions } = require('../docs-versions.config');
const { docMetadata } = require('./lib/docs-tree');
const {
  loadLaunchRoutes,
  validateLaunchMigration,
  validateDocs,
  validateSidebar,
  validateMismatches,
  checkRoutePermanence,
  SDK_API_WARNING,
  GRAPHQL_NOTE,
  validateCoreSource,
  readCoreOpenApi,
} = require('./validate-v2-structure');
const rows = loadLaunchRoutes(
  fs.readFileSync(`${__dirname}/v2-launch-routes.txt`, 'utf8'),
);
function doc(
  file = 'index.md',
  changes = {},
  body = 'Version-neutral documentation.',
) {
  const fields = {
    title: 'Docs',
    sidebar_label: 'Docs',
    description: 'A useful description.',
    kind: 'concept',
    reader: '["app"]',
    packages: '[]',
    ...changes,
  };
  return docMetadata(
    file,
    `---\n${Object.entries(fields)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}\n---\n${body}\n`,
    versions.current,
  );
}
const phaseOne = [
  doc(),
  doc('agents/skills.md', { kind: 'how-to', reader: '["agent"]' }),
  doc('community/index.md', { kind: 'reference' }),
];
test('normative launch tree contains 134 ordered routes and cumulative phase totals', () => {
  assert.deepEqual(
    [1, 2, 3, 4, 5].map(
      (phase) => rows.filter((row) => row.phase <= phase).length,
    ),
    [3, 61, 95, 114, 134],
  );
  assert.deepEqual(
    rows.filter((row) => row.phase === 1).map((row) => row.route),
    phaseOne.map((page) => page.route),
  );
  assert.deepEqual(validateDocs(phaseOne, { launchRows: rows, phase: 1 }), []);
  assert.throws(() => loadLaunchRoutes('invalid 1'), /TAB/);
});

test('source-mode Core identity and M-7 follow the immutable vendored contract', () => {
  const manifest = require('../static/intuition-release.json');
  assert.deepEqual(validateCoreSource(manifest), []);
  for (const change of [
    (core) => {
      core.version = 'v0.1.0';
    },
    (core) => {
      core.releaseNotes = {};
    },
    (core) => {
      core.distribution = 'npm';
    },
    (core) => {
      core.commit = 'main';
    },
  ]) {
    const copy = structuredClone(manifest);
    change(copy.core);
    assert.ok(validateCoreSource(copy).length);
  }
  const openApi = readCoreOpenApi(
    require('node:path').resolve(__dirname, '..'),
    manifest,
  );
  const records = require('./source-mismatches.json');
  assert.deepEqual(
    validateMismatches(records, rows, { manifest, openApi }),
    [],
  );
  const copy = structuredClone(records);
  copy.find((record) => record.id === 'M-7').status = 'resolved';
  assert.match(
    validateMismatches(copy, rows, { manifest, openApi }).join('\n'),
    /M-7 status must be open/,
  );
  assert.match(
    validateMismatches(records, rows, { manifest }).join('\n'),
    /requires the vendored/,
  );
  assert.throws(
    () => readCoreOpenApi('/missing', manifest),
    /Missing vendored OpenAPI/,
  );
  const page = doc(
    'build/query-core.md',
    { kind: 'how-to' },
    'GET /api/iids/example/atoms',
  );
  assert.match(
    validateDocs([page], { launchRows: rows, manifest, openApi }).join('\n'),
    /M-7/,
  );
  assert.deepEqual(
    validateDocs([page], {
      launchRows: rows,
      manifest,
      openApi: { paths: { '/api/iids/{iid}/atoms': { get: {} } } },
    }),
    [],
  );
});

test('SDK API source warning is adjacent and read-client recipes remain forbidden', () => {
  const manifest = require('../static/intuition-release.json');
  const fields = { kind: 'reference', packages: '["@0xintuition/sdk"]' };
  const validate = (page) =>
    validateDocs([page], { launchRows: rows, manifest });
  const api = doc(
    'reference/sdk/api.md',
    fields,
    `<AppliesTo />\n\n${SDK_API_WARNING}\n\nAPI declarations.`,
  );
  assert.deepEqual(validate(api), []);
  assert.match(
    validate(
      doc(
        'reference/sdk/api.md',
        fields,
        `<AppliesTo />\n\nExtra paragraph.\n\n${SDK_API_WARNING}`,
      ),
    ).join('\n'),
    /immediately follow/,
  );
  const body = `<AppliesTo />\n\nUse [Core](${versions.current.routeBase}/build/query-core) for V2 reads.\n\n${GRAPHQL_NOTE}\n\nThe client is not a V2 read path. The endpoints are https://mainnet.intuition.sh/v1/graphql and https://testnet.intuition.sh/v1/graphql.`;
  assert.deepEqual(validate(doc('build/read-with-sdk.md', fields, body)), []);
  assert.match(
    validate(
      doc(
        'build/read-with-sdk.md',
        fields,
        body.replace('build/query-core', 'build/other'),
      ),
    ).join('\n'),
    /first paragraph/,
  );
  assert.match(
    validate(
      doc(
        'build/read-with-sdk.md',
        fields,
        `${body}\n\n~~~ts\ncreateIntuitionApiClient({});\n~~~`,
      ),
    ).join('\n'),
    /must not call/,
  );
  const sdkBody =
    '<AppliesTo />\n\n## Entry points\n\n| Subpath | Purpose |\n| --- | --- |\n| `./api` | Legacy read client |\n\nThe `@0xintuition/sdk/api` entry point calls the V1 GraphQL API; see [The SDK read client](/docs/build/read-with-sdk).\n\n## Example\n\n```ts\nconst action = 1;\n```';
  assert.deepEqual(
    validate(doc('reference/packages/sdk.md', fields, sdkBody)),
    [],
  );
  assert.match(
    validate(
      doc(
        'reference/packages/sdk.md',
        fields,
        sdkBody.replace('const action = 1;', 'getIntuitionApiUrl("mainnet");'),
      ),
    ).join('\n'),
    /recipes are forbidden/,
  );
});

test('SDK landing navigation does not permit visible hosted read-client guidance', () => {
  const manifest = require('../static/intuition-release.json');
  const fields = { kind: 'reference', packages: '["@0xintuition/sdk"]' };
  const target = `${versions.current.routeBase}/reference/sdk/api`;
  const navigation = `| Reference |\n| --- |\n| [API client](${target}) |`;
  const validate = (body) =>
    validateDocs(
      [doc('reference/sdk/index.md', fields, `<AppliesTo />\n\n${body}`)],
      { launchRows: rows, manifest },
    );
  assert.deepEqual(validate(navigation), []);
  for (const body of [
    `[@0xintuition/sdk/api](${target})`,
    `${navigation}\n\nUse \`@0xintuition/sdk/api\` to read the graph.`,
    `${navigation}\n\n~~~ts\ncreateIntuitionApiClient({});\n~~~`,
    `${navigation}\n\ngetIntuitionApiUrl('mainnet')`,
    `${navigation}\n\n[Hosted reads](https://mainnet.intuition.sh/v1/graphql)`,
    `[Other](${target}/other)`,
    `[Other](https://example.com${target})`,
    `\`[API client](${target})\``,
    `\`\`[API client](${target}) with a \` delimiter\`\``,
    `~~~text title="sdk/api"\nExample\n~~~`,
    `~~~ts\nconst visibleExample = '[API client](${target})';\n~~~`,
  ])
    assert.match(validate(body).join('\n'), /hosted read-client/);
});

test('structure validation rejects executable front matter without evaluating it', () => {
  const source =
    '---js\n{ title: (globalThis.__structureFrontMatterExecuted = true) }\n---\n# Hidden title';
  delete globalThis.__structureFrontMatterExecuted;
  assert.ok(
    validateDocs([docMetadata('index.md', source, versions.current)], {
      launchRows: rows,
    }).length,
  );
  assert.equal(globalThis.__structureFrontMatterExecuted, undefined);
});
test('AC-6 rejects a Phase 2 extra page and wrong sidebar ordering', () => {
  assert.match(
    validateDocs([...phaseOne, doc('get-started/how-it-fits.md')], {
      launchRows: rows,
      phase: 1,
    }).join('\n'),
    /extra route/,
  );
  assert.deepEqual(
    validateSidebar(
      {
        docs: [
          'index',
          'agents/skills',
          {
            type: 'category',
            link: { type: 'doc', id: 'community/index' },
            items: [],
          },
        ],
      },
      phaseOne,
      rows,
      1,
    ),
    [],
  );
  assert.match(
    validateSidebar(
      { docs: ['agents/skills', 'index', 'community/index'] },
      phaseOne,
      rows,
      1,
    ).join('\n'),
    /order/,
  );
  assert.match(
    validateSidebar(
      { docs: [{ type: 'autogenerated', dirName: '.' }] },
      phaseOne,
      rows,
      1,
    ).join('\n'),
    /authored/,
  );
});
for (const [name, page, pattern] of [
  ['invalid kind', doc('index.md', { kind: 'guide' }), /invalid kind/],
  ['id override', doc('index.md', { id: 'home' }), /id and slug/],
  ['slug override', doc('index.md', { slug: '/elsewhere' }), /id and slug/],
  [
    'multi-line list',
    doc('index.md', { packages: '\n  - "@0xintuition/iid"' }),
    /single-line JSON/,
  ],
  [
    'single-quoted list',
    doc('index.md', { reader: "['app']" }),
    /single-line JSON/,
  ],
  ['empty readers', doc('index.md', { reader: '[]' }), /non-empty subset/],
  [
    'unknown reader',
    doc('index.md', { reader: '["visitor"]' }),
    /non-empty subset/,
  ],
  [
    'long description',
    doc('index.md', { description: 'x'.repeat(161) }),
    /160/,
  ],
  [
    'package before manifest',
    doc('index.md', { packages: '["@0xintuition/iid"]' }),
    /until the release manifest/,
  ],
  ['body H1', doc('index.md', {}, '# Duplicate title'), /H1/],
  [
    'concept id in depends_on',
    doc('concepts/representation-profiles.md', {
      depends_on: '["concepts/atoms"]',
    }),
    /concept slug/,
  ],
  [
    'unknown concept',
    doc('concepts/representation-profiles.md', { depends_on: '["not-real"]' }),
    /concept slug/,
  ],
  [
    'GraphQL metadata',
    doc('index.md', { description: 'GraphQL data' }),
    /GraphQL/,
  ],
  ['MCP metadata', doc('index.md', { description: 'MCP data' }), /Phase 3/],
  ['GraphQL prose', doc('index.md', {}, 'Use GraphQL.'), /GraphQL/],
  [
    'GraphQL fence',
    doc('index.md', {}, '```graphql\nquery Items { items { id } }\n```'),
    /operation documents/,
  ],
  [
    'operation in ts fence',
    doc('index.md', {}, '```ts\nquery Items { items { id } }\n```'),
    /operation documents/,
  ],
  [
    'hosted read client',
    doc('index.md', {}, 'createIntuitionApiClient'),
    /hosted read-client/,
  ],
  [
    'MCP title',
    doc('index.md', { title: 'MCP help' }),
    /MCP routes and titles/,
  ],
  [
    'early MCP notice',
    doc('agents/index.md', {}, 'An Intuition MCP server is not available yet.'),
    /Phase 3/,
  ],
  [
    'MCP link',
    doc(
      'index.md',
      {},
      `[Old page](${versions.v1.routeBase}/experimental-applications/mcp-server)`,
    ),
    /MCP body links/,
  ],
  [
    'tutorial skip',
    doc(
      'get-started/quickstart.md',
      { kind: 'tutorial' },
      '<!-- docs-typecheck: skip -->\n```ts\nconst x = 1;\n```',
    ),
    /tutorial pages may not skip/,
  ],
  [
    'import skip',
    doc(
      'index.md',
      {},
      '<!-- docs-typecheck: skip -->\n```ts\nimport { x } from "@0xintuition/sdk";\n```',
    ),
    /Intuition import fence/,
  ],
  [
    'misplaced V1 marker',
    doc(
      'index.md',
      {},
      '<!-- docs-typecheck: v1 -->\n```ts\nconst x = 1;\n```',
    ),
    /migration guide/,
  ],
])
  test(`AC-23/26/27/51 rejects ${name}`, () =>
    assert.match(
      validateDocs([page], { launchRows: rows, phase: 1 }).join('\n'),
      pattern,
    ));
test('planned dependency may precede the referenced page; unknown manifest packages fail', () => {
  const page = doc('concepts/representation-profiles.md', {
    depends_on: '["iid", "atoms"]',
  });
  assert.deepEqual(validateDocs([page], { launchRows: rows }), []);
  const invalid = doc(
    'index.md',
    { packages: '["@0xintuition/missing"]' },
    '<AppliesTo />',
  );
  assert.match(
    validateDocs([invalid], {
      launchRows: rows,
      manifest: { packages: { '@0xintuition/iid': {} } },
    }).join('\n'),
    /unknown manifest/,
  );
});
test('FR-67 covers tilde and long fences without treating a shorter delimiter as a close', () => {
  const errors = (body) =>
    validateDocs([doc('index.md', {}, body)], { launchRows: rows });
  for (const marker of ['~~~', '~~~~', '````']) {
    assert.match(
      errors(
        `<!-- docs-typecheck: skip -->\n${marker}ts\nimport { x } from "@0xintuition/sdk";\n${marker}${marker[0]}`,
      ).join('\n'),
      /Intuition import fence/,
    );
    assert.deepEqual(
      errors(
        `<!-- docs-typecheck: skip -->\n${marker}ts\nconst value = 1;\n${marker}${marker[0]}`,
      ),
      [],
    );
  }
  assert.match(
    errors(
      '<!-- docs-typecheck: skip -->\n~~~~ts\n~~~\nimport { x } from "@0xintuition/sdk";\n~~~~',
    ).join('\n'),
    /Intuition import fence/,
  );
  assert.match(
    errors('~~~ts\nconst value = 1;\n```').join('\n'),
    /Unclosed TypeScript fence/,
  );
});
test('source mismatches use normalized planned routes, complete records and exact initial statuses', () => {
  const records = JSON.parse(
    fs.readFileSync(`${__dirname}/source-mismatches.json`, 'utf8'),
  );
  assert.deepEqual(validateMismatches(records, rows), []);
  for (const change of [
    (copy) => delete copy[0].finding,
    (copy) => copy[0].docsPages.push('concepts/iid'),
    (copy) => (copy[1].status = 'open'),
    (copy) => copy.push({ ...copy[0], id: 'M-9' }),
    (copy) => copy.pop(),
  ]) {
    const copy = structuredClone(records);
    change(copy);
    assert.ok(validateMismatches(copy, rows).length);
  }
});
test('AC-13 permits initial V1 replacement but rejects a later removed V2 route without its rename', () => {
  const old = `${versions.current.routeBase}/get-started/quickstart`;
  assert.deepEqual(
    checkRoutePermanence([old], [], [], { initialized: false }),
    [],
  );
  assert.match(
    checkRoutePermanence([old], [], []).join('\n'),
    /removed without/,
  );
  assert.deepEqual(
    checkRoutePermanence(
      [old],
      [],
      [{ from: old, to: versions.current.routeBase }],
    ),
    [],
  );
});

const path = require('node:path');
const os = require('node:os');
const { readPage } = require('./lib/phase3-structure/markdown');
const { validateTemplate } = require('./lib/phase3-structure/templates');
const {
  validateLadder,
  validateConcept,
  validateConceptMap,
  validateHowItFits,
  validateIdentifier,
} = require('./lib/phase3-structure/concepts');
const {
  validateSnapshot,
  validatePackage,
  validateChooser,
} = require('./lib/phase3-structure/packages');
const { validateFirstWrite, validateAgent } = require('./lib/phase3-structure');
const manifest = require('../static/intuition-release.json');
const ladder = require('./concept-ladder.json');
const runtime = require('./package-runtime-dependencies.json');

function diagnostics(check, ...args) {
  const errors = [];
  check(...args, (message) => errors.push(message));
  return errors.join('\n');
}

function checkedSource(id) {
  const name = id + '.md';
  return docMetadata(
    name,
    fs.readFileSync(path.join(__dirname, '../docs/_data', name), 'utf8'),
    versions.current,
  );
}

function template(file, kind, body) {
  const sample = doc(file + '.md', { kind }, body);
  return diagnostics(validateTemplate, sample, readPage(sample), [sample]);
}

test('template and phase switches compose in either order and keep basic/launch/root/base behavior', () => {
  const { parseArguments } = require('./validate-v2-structure');
  assert.deepEqual(parseArguments([]), {});
  assert.deepEqual(
    parseArguments(['--templates', '--phase', '3']),
    parseArguments(['--phase', '3', '--templates']),
  );
  assert.deepEqual(
    parseArguments([
      '--launch',
      '--templates',
      '--base',
      'HEAD',
      '--root',
      '.',
    ]),
    { phase: 5, templates: true, base: 'HEAD', root: process.cwd() },
  );
  assert.throws(() => parseArguments(['--phase', '2', '--launch']), /Usage/);
});

test('only real section headings count and Troubleshooting is optional at its specified position', () => {
  const howto =
    'Install the reader.\n\n## Before you start\n\n## Steps\n\n1. Read an item.\n\n## Check the result\n\n## Related';
  assert.equal(template('build/install', 'how-to', howto), '');
  assert.equal(
    template(
      'build/install',
      'how-to',
      howto.replace('## Related', '## Troubleshooting\n\n## Related'),
    ),
    '',
  );
  assert.match(
    template('build/install', 'how-to', howto + '\n\n## Troubleshooting'),
    /expected H2/,
  );
  assert.match(
    template(
      'build/install',
      'how-to',
      howto.replace(
        '## Before you start',
        '~~~~text\n## Before you start\n~~~~',
      ),
    ),
    /expected H2/,
  );
  assert.equal(
    template('core/architecture', 'concept', '## How it works\n\n## Related'),
    '',
  );
  assert.match(
    template('core/architecture', 'concept', '## Related\n\n## How it works'),
    /expected H2/,
  );
  assert.match(
    template(
      'concepts/atoms',
      'concept',
      '## How it works\n\n## Example\n\n## Next',
    ),
    /Common mistakes/,
  );
  const reference = checkedSource('reference/sdk/api');
  assert.equal(
    diagnostics(validateTemplate, reference, readPage(reference), [reference]),
    '',
  );
});

test('landing coverage uses shipped descendants and root top-level landings, excluding fenced/inline fake links', () => {
  const files = [
    'index',
    'reference/index',
    'reference/packages/index',
    'reference/packages/iid',
  ];
  const docs = files.map((id) => doc(id + '.md'));
  function landing(id, body) {
    const sample = doc(id + '.md', {}, body);
    return diagnostics(validateTemplate, sample, readPage(sample), docs);
  }
  assert.equal(
    landing(
      'index',
      '[Reference](/docs/reference) and [IID](/docs/reference/packages/iid).',
    ),
    '',
  );
  assert.match(
    landing(
      'reference/index',
      '[Packages](/docs/reference/packages)\n\n~~~text\n[IID](/docs/reference/packages/iid)\n~~~',
    ),
    /must link \/docs\/reference\/packages\/iid/,
  );
  assert.match(
    landing(
      'reference/index',
      '[Packages](/docs/reference/packages)\n\n`[IID](/docs/reference/packages/iid)`',
    ),
    /must link/,
  );
  assert.equal(
    landing(
      'reference/index',
      '[Packages](/docs/reference/packages) and [`IID`](/docs/reference/packages/iid).',
    ),
    '',
  );
});

test('tutorial check compares the declared count, position, limits and consecutive step numbers', () => {
  const tutorial =
    "**Time:** 10 minutes · **Steps:** 2\n\n## What you'll build\n\n## Before you start\n\n## Steps\n\n### 1. Prepare\n\n### 2. Run\n\n## Run it\n\n## Next steps";
  const check = (body) => template('get-started/first-write', 'tutorial', body);
  assert.equal(check(tutorial), '');
  for (const corrupted of [
    tutorial.replace('**Steps:** 2', '**Steps:** 3'),
    tutorial.replace('### 2.', '### 1.'),
    tutorial.replace('### 2. Run', '~~~text\n### 2. Run\n~~~'),
    tutorial + '\n\n### 3. More',
    tutorial.replace('10 minutes', '11 minutes'),
    tutorial.replace('**Time:**', 'Time:'),
  ])
    assert.match(check(corrupted), /tutorial/);
  assert.match(
    check(tutorial.replace('**Steps:** 2', '**Steps:** 9')),
    /8 steps/,
  );
});

test('migration topics require the right H2 parents as well as the literal topics', () => {
  const migration = checkedSource('get-started/migrate-from-v1');
  assert.equal(template(migration.id, 'how-to', migration.body), '');
  assert.match(
    template(
      migration.id,
      'how-to',
      migration.body.replace(
        '### Where did my page go',
        '## Where did my page go',
      ),
    ),
    /expected H2 headings/,
  );
  const swapped = migration.body
    .replace('### What changed', '')
    .replace('## Steps', '## Steps\n\n### What changed');
  assert.match(template(migration.id, 'how-to', swapped), /migration topics/);
});

test('launch rejects a missing, misplaced or relabeled generated migration row', () => {
  const { readDocs } = require('./lib/docs-tree');
  const root = require('node:path').resolve(__dirname, '..');
  const current = readDocs(root, versions.current);
  const legacy = readDocs(root, versions.v1);
  const { pairs } = require('../src/data/version-equivalents.json');
  const guide = current.find(
    (page) => page.id === 'get-started/migrate-from-v1',
  );
  const row = guide.body
    .split('\n')
    .find((line) => line.includes('](/docs/v1/resources/glossary)'));
  assert.ok(row);
  assert.deepEqual(validateLaunchMigration(current, legacy, pairs), []);
  for (const [before, after] of [
    [row, ''],
    [row, row.replace('Glossary', 'Old terms')],
    ['### Where did my page go', '### Missing'],
    ['{/* generated:start version-equivalents */}', ''],
  ]) {
    const pages = current.map((page) =>
      page === guide
        ? {
            ...guide,
            body: guide.body.replace(before, after),
            content: guide.content.replace(before, after),
          }
        : page,
    );
    assert.ok(validateLaunchMigration(pages, legacy, pairs).length);
  }
});

const conceptDocs = ladder.concepts.map((row) =>
  doc('concepts/' + row.slug + '.md', {
    title: row.title,
    packages: JSON.stringify(row.packages),
    reader: JSON.stringify(row.reader),
    depends_on: JSON.stringify(row.depends_on),
  }),
);
const pathToEnrichment = [
  'atoms',
  'triples',
  'deterministic-ids',
  'iid',
  'iid-schemes',
  'identity-ladder',
  'classifications',
  'iid-registry',
  'atom-parsing',
  'atom-classification',
  'enrichment',
];
function conceptMapBody() {
  const node = (slug) => slug.replaceAll('-', '_');
  const diagram = ladder.concepts.flatMap((row) =>
    row.depends_on.map((dep) => node(dep) + ' --> ' + node(row.slug)),
  );
  return [
    '~~~mermaid',
    'graph BT',
    ...diagram,
    '~~~',
    '',
    pathToEnrichment
      .map((slug) => `[${slug}](/docs/concepts/${slug})`)
      .join(' → '),
  ].join('\n');
}
test('all 23 metadata declarations agree with the ladder, including cyclic/forward and unexpected package mutations', () => {
  assert.equal(diagnostics(validateLadder, conceptDocs, ladder, manifest), '');
  for (const [key, value] of [
    ['packages', []],
    ['depends_on', ['triples']],
    ['reader', ['operator']],
  ]) {
    const changed = structuredClone(conceptDocs);
    changed[1].frontMatter[key] = value;
    const messages = diagnostics(validateLadder, changed, ladder, manifest);
    assert.match(messages, /metadata/);
    if (key === 'depends_on') assert.match(messages, /cyclic, forward/);
  }
  assert.match(
    diagnostics(validateLadder, conceptDocs.slice(1), ladder, manifest),
    /23 normative/,
  );
});

test('the map has exactly 22 topic nodes and the declared edges and ordered enrichment closure below the diagram', () => {
  const check = (body) => {
    const sample = doc('concepts/index.md', {}, body);
    return diagnostics(
      validateConceptMap,
      sample,
      readPage(sample),
      ladder.concepts,
    );
  };
  const valid = conceptMapBody();
  assert.equal(check(valid), '');
  for (const body of [
    valid.replace('graph BT', 'graph TD'),
    valid.replace('graph BT', 'graph BT\nindex'),
    valid.replace('atoms --> triples', ''),
    valid.replace('atoms --> triples', 'atoms --> triples\ntriples --> atoms'),
    valid.replace('atoms --> triples', 'atoms --> triples\natoms --> triples'),
  ])
    assert.match(check(body), /prerequisite edges/);
  assert.match(
    check(valid.replace('[iid](/docs/concepts/iid) → ', '')),
    /enrichment prerequisite closure/,
  );
});

test('concept intro and Next links agree with their own lines and sections', () => {
  const all = new Set(conceptDocs.map((d) => d.route));
  const row = ladder.concepts.find((c) => c.slug === 'atoms');
  const body = [
    'An atom represents exact bytes.',
    '',
    '**Builds on:** Nothing; this is the base of the ladder.',
    '',
    '**Implemented by:** ' +
      row.packages
        .map(
          (name) => `[${name}](/docs/reference/packages/${name.split('/')[1]})`,
        )
        .join(', '),
    '',
    '## How it works',
    '',
    '## Example',
    '',
    '## Common mistakes',
    '',
    '## Next',
    '',
    ...ladder.concepts
      .filter((c) => c.depends_on.includes('atoms'))
      .map((c) => `[${c.slug}](/docs/concepts/${c.slug})`),
  ].join('\n');
  const check = (body, slug = 'atoms') => {
    const sample = doc('concepts/' + slug + '.md', {}, body);
    return diagnostics(
      validateConcept,
      sample,
      readPage(sample),
      ladder.concepts,
      all,
    );
  };
  assert.equal(check(body), '');
  assert.match(
    check(body.replace('An atom represents exact bytes.', 'word '.repeat(81))),
    /80 words/,
  );
  assert.match(check(body.replace('Nothing;', 'Nothing,')), /Builds on/);
  assert.match(
    check(
      body.replace(
        '/docs/reference/packages/ids',
        '/docs/reference/packages/sdk',
      ),
    ),
    /Implemented by/,
  );
  assert.match(
    check(body.replace('/docs/concepts/triples', '/docs/concepts/atoms')),
    /Next must link to triples/,
  );
  const indexing =
    'Reads indexed writes.\n\n**Builds on:** [Writes](/docs/concepts/protocol-writes) and [runtime](/docs/concepts/atom-runtime).\n\n**Implemented by:** [Intuition Core](/docs/build/query-core)\n\n## How it works';
  assert.equal(check(indexing, 'indexing-and-querying'), '');
  assert.match(
    check(indexing.replace('Intuition Core', 'SDK'), 'indexing-and-querying'),
    /Intuition Core/,
  );
});

test('the five-tier explanation requires diagram edges, package layers and Core attachment', () => {
  const base = doc(
    'get-started/how-it-fits.md',
    {},
    fs.readFileSync(
      path.join(__dirname, '__fixtures__/validate-v2-structure/five-tiers.md'),
      'utf8',
    ),
  );
  assert.equal(diagnostics(validateHowItFits, readPage(base)), '');
  for (const [from, to] of [
    [
      'protocol["Protocol plumbing"] -.-> writes',
      'protocol["Protocol plumbing"] -.-> querying',
    ],
    ['Protocol writes', 'Protocol deposits'],
    ['Tier 2 (Identity)', 'Tier 3 (Identity)'],
  ]) {
    const changed = doc(base.relativePath, {}, base.body.replace(from, to));
    assert.match(
      diagnostics(validateHowItFits, readPage(changed)),
      /five-tier|five tiers/,
    );
  }
});

test('identifier evidence needs a visible canonical link and an info block on affected pages', () => {
  const mismatch = require('./source-mismatches.json').find(
    (r) => r.id === 'M-1',
  );
  const url =
    ladder.identifier.repository +
    '/blob/' +
    ladder.identifier.commit +
    '/spec/07-representation-profiles.md';
  const text =
    '[IID spec §7.8](' + url + ')\n\n:::info\nThe package lacks §7.8.\n:::';
  const check = (body) => {
    const sample = doc('concepts/representation-profiles.md', {}, body);
    return diagnostics(
      validateIdentifier,
      sample,
      readPage(sample),
      ladder.identifier,
      mismatch,
    );
  };
  assert.equal(check(text), '');
  assert.match(
    check(text.replace(ladder.identifier.commit, 'main')),
    /pinned canonical/,
  );
  assert.match(check(text.replace(':::info', ':::note')), /M-1/);
  assert.match(check(text.replace('lacks §7.8', 'differs')), /M-1/);
});

test('package assertions distinguish exports, runtime edges, peer ranges and inverse backlinks', () => {
  const pkg = {
    name: '@0xintuition/widget',
    entrypoints: ['.', './features/*', './package.json'],
    peers: { viem: '^2.0.0' },
  };
  const deps = { dependencies: { '@0xintuition/ids': '0.1.0' } };
  const concepts = [{ slug: 'atoms', packages: [pkg.name] }];
  const sample = [
    '## Entry points',
    '',
    '| Subpath | Purpose |',
    '| --- | --- |',
    '| `.` | Root |',
    '| `./features/*` | Feature modules |',
    '',
    '## Depends on and works with',
    '',
    'Runtime dependencies: [ids](/docs/reference/packages/ids). Published peers: `viem ^2.0.0`.',
    '',
    '## Example',
    '',
    'This links [ids](/docs/reference/packages/ids) and [atoms](/docs/concepts/atoms) outside their asserted sections.',
    '',
    '## Related concepts',
    '',
    '[Atoms](/docs/concepts/atoms)',
  ].join('\n');
  const check = (body) => {
    const sampleDoc = doc(
      'reference/packages/widget.md',
      { kind: 'reference', packages: JSON.stringify([pkg.name]) },
      body,
    );
    return diagnostics(
      validatePackage,
      sampleDoc,
      readPage(sampleDoc),
      pkg,
      deps,
      concepts,
    );
  };
  assert.equal(check(sample), '');
  for (const [before, after, message] of [
    ['| `./features/*` | Feature modules |', '', /Entry points/],
    [
      '| `./features/*` | Feature modules |',
      '| `./features/*` | Feature modules |\n| `./extra` | Extra |',
      /Entry points/,
    ],
    [
      'Runtime dependencies: [ids](/docs/reference/packages/ids)',
      'Runtime dependencies: none',
      /runtime dependency/,
    ],
    [
      'Runtime dependencies: [ids](/docs/reference/packages/ids)',
      'Runtime dependencies: [ids](/docs/reference/packages/ids), [react](/docs/reference/packages/react)',
      /runtime dependency/,
    ],
    ['`viem ^2.0.0`', 'none', /peer list/],
    ['`viem ^2.0.0`', '`viem ^2.0.0`, `wagmi ^2`', /peer list/],
    ['`viem ^2.0.0`', '`viem ^3.0.0`', /peer list/],
    ['[Atoms](/docs/concepts/atoms)', '', /inverse concept/],
    [
      '[Atoms](/docs/concepts/atoms)',
      '[Atoms](/docs/concepts/atoms) [Triples](/docs/concepts/triples)',
      /inverse concept/,
    ],
  ])
    assert.match(check(sample.replace(before, after)), message);
  assert.equal(diagnostics(validateSnapshot, runtime, manifest), '');
  const stale = structuredClone(runtime);
  stale.source.commit = 'main';
  stale.packages[0].version = '0.0.0';
  assert.match(
    diagnostics(validateSnapshot, stale, manifest),
    /source differs[\s\S]*stale runtime/,
  );
  assert.ok(
    runtime.packages.find((p) => p.name.endsWith('/atom-classification'))
      .dependencies['@0xintuition/atom-enrichment'],
  );
  assert.ok(
    !runtime.packages.find((p) => p.name.endsWith('/atom-enrichment'))
      .dependencies['@0xintuition/atom-classification'],
  );
});

test('chooser coverage reads the Install column of its table only', () => {
  const names = manifest.packages.map((pkg) => pkg.name);
  const table = [
    '| I want to… | Install | Then read |',
    '| --- | --- | --- |',
    ...names.map((name) => `| A task | \`${name}\` | ${name} | `),
  ].join('\n');
  const check = (body) =>
    diagnostics(
      validateChooser,
      readPage(doc('get-started/choose-packages.md', {}, body)),
      manifest,
    );
  assert.equal(check(table), '');
  const lost = table.replace('`' + names[0] + '`', 'missing');
  assert.match(
    check(
      lost +
        '\n\nInstall ' +
        names[0] +
        '\n\n| Task | Install | Guide |\n|---|---|---|\n| extra | ' +
        names[0] +
        ' | Page |',
    ),
    /Install column/,
  );
});

test('agent entry asserts single visible MCP notice, bundle URLs and concrete skill install command', () => {
  const check = (id, text) => {
    const sample = doc('agents/' + id + '.md', {}, text);
    return diagnostics(validateAgent, sample, readPage(sample));
  };
  assert.match(
    check(
      'index',
      '~~~text\nAn Intuition MCP server is not available yet.\n~~~',
    ),
    /MCP/,
  );
  const urls = ['', '/docs/v1']
    .flatMap((base) =>
      ['', '-medium', '-full'].map((size) => base + '/llms' + size + '.txt'),
    )
    .join(' ');
  assert.equal(
    check('docs-for-agents', urls + ' Append `.md` to a page URL.'),
    '',
  );
  assert.match(
    check('docs-for-agents', urls.replace('/llms.txt', '') + ' .md'),
    /llms/,
  );
  const markdown = (origin) =>
    urls
      .split(' ')
      .map((url) => `[${url}](${origin}${url})`)
      .join(' ') + ' .md';
  assert.equal(
    check('docs-for-agents', markdown('https://docs.intuition.systems')),
    '',
  );
  assert.match(
    check('docs-for-agents', markdown('https://example.org')),
    /llms/,
  );
  assert.match(
    check(
      'docs-for-agents',
      markdown('https://docs.intuition.systems').replace(
        'systems/docs/v1/llms.txt)',
        'systems/llms.txt)',
      ),
    ),
    /llms/,
  );
  assert.match(check('docs-for-agents', urls), /per-page/);
  assert.equal(
    check('skills', '~~~sh\nnpx skills add 0xintuition/agent-skills\n~~~'),
    '',
  );
  assert.match(
    check('skills', 'npx skills add 0xintuition/agent-skills-old'),
    /install/,
  );
});

test('first-write source needs a real UUID call and rejects a fixed ID across src without running the example', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'first-write-structure-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const src = path.join(root, 'examples/v2/first-write/src');
  fs.mkdirSync(src, { recursive: true });
  const main = path.join(src, 'first-write.ts');
  fs.writeFileSync(main, 'const uuid = crypto.randomUUID();');
  assert.equal(diagnostics(validateFirstWrite, root), '');
  fs.writeFileSync(
    path.join(src, 'helper.ts'),
    "export const id = '0x" + 'a'.repeat(64) + "';",
  );
  assert.match(diagnostics(validateFirstWrite, root), /derive the atom ID/);
  fs.writeFileSync(main, '// crypto.randomUUID()');
  assert.match(diagnostics(validateFirstWrite, root), /must call/);
});

test('worked example routes are backed by real literal Cards in the landing grid', () => {
  const grid = fs.readFileSync(
    `${__dirname}/__fixtures__/validate-v2-structure/example-cards.md`,
    'utf8',
  );
  const docs = rows
    .filter(({ route }) => route.startsWith('/docs/examples/'))
    .map(({ route }) => ({ route, id: route.slice('/docs/'.length) }));
  function landing(body) {
    const sample = doc('examples/index.md', {}, body);
    return diagnostics(validateTemplate, sample, readPage(sample), docs);
  }
  assert.equal(landing(grid), '');
  const first = grid.split('\n')[1];
  for (const bad of [
    grid.replace(first, ''),
    grid.replace('atom-creation-form', 'predicate-picker'),
    grid.replace('/docs/examples/react-app', 'https://example.org'),
    grid.replace('title="Link identities"', 'title=""'),
    grid.replace('title="Link identities"', 'title={dynamic}'),
    grid.replace('title="Link identities"', 'to="Link identities"'),
    grid.replace(first, `<Unknown data="Card" />`),
  ])
    assert.throws(() => landing(bad), /Card/);

  for (const fake of [
    '~~~jsx\n' + grid + '\n~~~',
    '<!--' + grid + '-->',
    '{/*\n' + grid + '\n*/}',
    '<Unknown>\n' + grid + '\n</Unknown>',
    '`' + first.trim() + '`',
    docs.map(({ route }) => `[Example](${route})`).join('\n\n'),
  ])
    assert.match(landing(fake), /six-Card grid/);
});
