'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { versions } = require('../docs-versions.config');
const { docMetadata } = require('./lib/docs-tree');
const {
  loadLaunchRoutes,
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
