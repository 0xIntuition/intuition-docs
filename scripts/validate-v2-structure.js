#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { versions } = require('../docs-versions.config');
const { readDocs, docMetadata } = require('./lib/docs-tree');
const {
  parseMarkdownCode,
  readFrontMatter,
  INTUITION_IMPORT_PATTERN,
} = require('./lib/markdown-fences');
const ROOT = path.resolve(__dirname, '..');
const TOP_LEVEL = new Set([
  'get-started',
  'agents',
  'concepts',
  'build',
  'examples',
  'reference',
  'core',
  'community',
]);
const KINDS = new Set(['tutorial', 'how-to', 'concept', 'reference']);
const READERS = new Set(['app', 'agent', 'operator', 'plugin']);
const GRAPHQL_PAGES = new Set([
  'build/read-with-sdk',
  'concepts/indexing-and-querying',
  'reference/packages/sdk',
  'reference/sdk/api',
  'get-started/migrate-from-v1',
]);
const READ_CLIENT_PAGES = new Set([
  'build/read-with-sdk',
  'reference/packages/sdk',
  'reference/sdk/api',
  'get-started/migrate-from-v1',
]);
const PHASE_COUNTS = [3, 61, 95, 114, 134];
const SDK_API_WARNING = `This client calls the hosted V1 GraphQL API and is not a V2 read path; see [The SDK read client](${versions.current.routeBase}/build/read-with-sdk).`;
const GRAPHQL_NOTE = `There is no V2 GraphQL endpoint yet; one is planned for Intuition Core. The V1 GraphQL API is documented in the [V1 docs](${versions.v1.routeBase}/graphql-api/overview).`;
const IID_OPERATION = '/api/iids/{iid}/atoms';

function validateCoreSource(manifest) {
  if (!manifest) return [];
  const core = manifest.core;
  if (
    !core ||
    core.repository !== 'https://github.com/0xIntuition/intuition-core' ||
    core.distribution !== 'source' ||
    !/^[a-f0-9]{40}$/.test(core.commit || '') ||
    Object.keys(core).sort().join(',') !== 'commit,distribution,repository'
  )
    return [
      'Core must identify its source repository, distribution and immutable commit only',
    ];
  return [];
}

function readCoreOpenApi(root, manifest) {
  const errors = validateCoreSource(manifest);
  if (errors.length) throw new Error(errors.join('\n'));
  if (!manifest) return null;
  const file = path.join(
    root,
    `scripts/core-openapi-${manifest.core.commit}.json`,
  );
  if (!fs.existsSync(file))
    throw new Error(
      `Missing vendored OpenAPI for Core source revision: ${manifest.core.commit}`,
    );
  const api = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!api.paths || typeof api.paths !== 'object' || Array.isArray(api.paths))
    throw new Error('Core OpenAPI must define its paths');
  return api;
}

function loadLaunchRoutes(text) {
  const rows = text
    .trim()
    .split(/\r?\n/)
    .map((line, index) => {
      const match = line.match(/^(\S+)\t([1-5])$/);
      if (!match)
        throw new Error(
          `Invalid launch route at line ${index + 1}: expected route<TAB>phase`,
        );
      return { route: match[1], phase: Number(match[2]) };
    });
  if (new Set(rows.map((row) => row.route)).size !== rows.length)
    throw new Error('Duplicate launch routes');
  for (const [index, count] of PHASE_COUNTS.entries()) {
    if (rows.filter((row) => row.phase <= index + 1).length !== count)
      throw new Error(
        `Launch route count for phase ${index + 1} must be ${count}`,
      );
  }
  for (const { route } of rows) {
    if (
      route !== versions.current.routeBase &&
      !new RegExp(
        `^${versions.current.routeBase}/(?:${[...TOP_LEVEL].join('|')})(?:/[a-z0-9]+(?:-[a-z0-9]+)*)*$`,
      ).test(route)
    )
      throw new Error(`Invalid planned V2 route: ${route}`);
  }
  return rows;
}

function withoutFences({ source: body, fences }) {
  for (const fence of [...fences].reverse()) {
    body = body.slice(0, fence.start) + body.slice(fence.end);
  }
  readFrontMatter(body);
  return body.replace(
    /^\uFEFF?---[^\r\n]*\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/,
    '',
  );
}

function hostedReadClientContent(parsed) {
  // The SDK landing must link its generated API page. Exclude only that exact
  // Markdown destination, retaining the visible label and all code examples.
  const destination = `](${versions.current.routeBase}/reference/sdk/api)`;
  const prose = withoutFences(parsed);
  const inlineCode = prose.match(/(?<!`)(`+)(?!`)[\s\S]*?(?<!`)\1(?!`)/g) || [];
  return [
    prose.replaceAll(destination, ']()'),
    ...inlineCode,
    ...parsed.fences.map((fence) =>
      parsed.source.slice(fence.start, fence.end),
    ),
  ].join('\n');
}

function validateDocs(
  docs,
  { launchRows, manifest = null, openApi = null, phase } = {},
) {
  const errors = [];
  const planned = new Set(launchRows.map((row) => row.route));
  const packages = new Set(
    Array.isArray(manifest?.packages)
      ? manifest.packages.map((item) => item.name)
      : Object.keys(manifest?.packages || {}),
  );
  const seen = new Set();
  for (const doc of docs) {
    const {
      relativePath,
      frontMatter: fm,
      frontMatterRaw = '',
      body,
      route,
      id,
    } = doc;
    const fail = (message) => errors.push(`${relativePath}: ${message}`);
    const sourceId = relativePath.replace(/\.mdx?$/, '');
    const expectedSuffix =
      sourceId === 'index' ? '' : sourceId.replace(/\/index$/, '');
    if (
      !/^(?:index|(?:get-started|agents|concepts|build|examples|reference|core|community)\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*)\.mdx?$/.test(
        relativePath,
      )
    )
      fail('file path must use the V2 sections and lowercase kebab-case');
    if (
      relativePath.startsWith('concepts/') &&
      relativePath.split('/').length !== 2
    )
      fail('concepts must be flat, not tier directories');
    if (
      route !==
      `${versions.current.routeBase}${expectedSuffix ? `/${expectedSuffix}` : ''}`
    )
      fail('file path must equal its route (use index.md for landings)');
    if (!planned.has(route)) fail(`route is not in the launch plan: ${route}`);
    if (seen.has(route)) fail(`duplicate route: ${route}`);
    seen.add(route);
    if (Object.hasOwn(fm, 'id') || Object.hasOwn(fm, 'slug'))
      fail('id and slug front matter are forbidden');
    const keys = [...frontMatterRaw.matchAll(/^([\w-]+):/gm)].map((m) => m[1]);
    if (new Set(keys).size !== keys.length) fail('duplicate front-matter keys');
    for (const key of ['title', 'sidebar_label', 'description', 'kind']) {
      if (typeof fm[key] !== 'string' || !fm[key].trim())
        fail(`missing or invalid ${key}`);
    }
    if (typeof fm.description === 'string' && [...fm.description].length > 160)
      fail('description exceeds 160 characters');
    if (!KINDS.has(fm.kind)) fail(`invalid kind: ${fm.kind}`);
    for (const key of [
      'reader',
      'packages',
      ...(relativePath.startsWith('concepts/') ? ['depends_on'] : []),
    ]) {
      const raw = frontMatterRaw.match(
        new RegExp(`^${key}:\\s*(.*)$`, 'm'),
      )?.[1];
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        /* Report below. */
      }
      if (
        !Array.isArray(parsed) ||
        parsed.some((entry) => typeof entry !== 'string') ||
        new Set(parsed).size !== parsed.length
      )
        fail(`${key} must be a single-line JSON array of unique strings`);
    }
    if (
      !Array.isArray(fm.reader) ||
      !fm.reader.length ||
      fm.reader.some((reader) => !READERS.has(reader))
    )
      fail('reader must be a non-empty subset of app, agent, operator, plugin');
    if (Array.isArray(fm.packages)) {
      if (!manifest && fm.packages.length)
        fail('packages must be [] until the release manifest exists');
      if (manifest)
        for (const name of fm.packages)
          if (!packages.has(name)) fail(`unknown manifest package: ${name}`);
      if (
        fm.packages.length &&
        !/^\s*(?:import[^\n]*\n\s*)*<AppliesTo\s*\/>/.test(body)
      )
        fail('AppliesTo must be the first body element for package pages');
    }
    if (Array.isArray(fm.depends_on))
      for (const slug of fm.depends_on) {
        if (
          !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
          !planned.has(`${versions.current.routeBase}/concepts/${slug}`)
        )
          fail(`depends_on must name a planned concept slug: ${slug}`);
      }
    let parsed;
    try {
      parsed = parseMarkdownCode(doc.content, { filePath: relativePath });
    } catch (error) {
      fail(error.message);
      continue;
    }
    if (/^\s{0,3}#(?:\s|$)/m.test(withoutFences(parsed)) || /<h1\b/i.test(body))
      fail('body H1 headings are forbidden');
    if (/graphql/i.test(route)) fail('GraphQL routes are forbidden');
    if (
      /^\s*(?:`{3,}|~{3,})\s*graphql\b/im.test(body) ||
      /\b(?:query|mutation|subscription|fragment)\s+[A-Za-z_]\w*(?:\s*\([^)]*\))?\s*(?:on\s+\w+\s*)?\{/m.test(
        body,
      )
    )
      fail('GraphQL operation documents are forbidden');
    if (/graphql/i.test(doc.content) && !GRAPHQL_PAGES.has(id))
      fail('GraphQL is not allowed in this page body');
    if (
      /sdk\/api|createIntuitionApiClient|getIntuitionApiUrl|intuition\.sh/i.test(
        hostedReadClientContent(parsed),
      ) &&
      !READ_CLIENT_PAGES.has(id)
    )
      fail('SDK hosted read-client references are not allowed here');
    const graphLinks =
      body.match(
        new RegExp(`${versions.v1.routeBase}/graphql-api/[^\\s"'<>)]*`, 'g'),
      ) || [];
    if (
      graphLinks.some(
        (target) =>
          !GRAPHQL_PAGES.has(id) ||
          target !== `${versions.v1.routeBase}/graphql-api/overview`,
      )
    )
      fail(
        'only the allowed GraphQL overview note may link V1 GraphQL from a page body',
      );
    if (/mcp/i.test(route) || /mcp/i.test(String(fm.title)))
      fail('MCP routes and titles are forbidden');
    const mcpLines = doc.content
      .split(/\r?\n/)
      .filter((line) => /\bMCP\b/i.test(line));
    if (
      mcpLines.length &&
      !(
        id === 'agents/index' &&
        (phase === undefined || phase >= 3) &&
        mcpLines.length === 1 &&
        mcpLines[0] === 'An Intuition MCP server is not available yet.'
      )
    )
      fail('MCP notice is reserved for agents/index from Phase 3');
    if (body.includes('experimental-applications/mcp-server'))
      fail('MCP body links are forbidden');
    if (
      fm.kind === 'tutorial' &&
      parsed.markers.some((marker) => marker.kind === 'skip')
    )
      fail('tutorial pages may not skip typechecking');
    for (const marker of parsed.markers) {
      if (!marker.associated)
        fail(
          `typecheck markers must immediately precede a code fence in the same container (line ${marker.line})`,
        );
    }
    for (const fence of parsed.fences) {
      if (/^(?:typescript|tsx|ts)\b/i.test(fence.info) && !fence.closed)
        fail(`Unclosed TypeScript fence at line ${fence.fenceLine}`);
      if (
        fence.annotation === '<!-- docs-typecheck: skip -->' &&
        INTUITION_IMPORT_PATTERN.test(fence.code)
      )
        fail('an Intuition import fence may not skip typechecking');
    }
    if (
      parsed.markers.some((marker) => marker.kind === 'v1') &&
      id !== 'get-started/migrate-from-v1'
    )
      fail('V1 typecheck markers are allowed only on the migration guide');
    if (/SDK [34]\.x|protocol [23]\.x/i.test(doc.content))
      fail('documentation generation labels must not be package semver ranges');
    if (body.includes('/api/iids/') && !openApi?.paths?.[IID_OPERATION]?.get)
      fail(
        'IID lookup may not be documented without its pinned OpenAPI GET operation (M-7)',
      );
    if (
      id === 'reference/sdk/api' &&
      !body.trimStart().startsWith(`<AppliesTo />\n\n${SDK_API_WARNING}`)
    )
      fail('generated SDK API warning must immediately follow AppliesTo');
    if (
      ['build/read-with-sdk', 'concepts/indexing-and-querying'].includes(id) &&
      !body.includes(GRAPHQL_NOTE)
    )
      fail('the required V1 GraphQL overview note is missing');
    if (id === 'build/read-with-sdk') {
      const firstParagraph = body
        .replace(/^\s*<AppliesTo\s*\/>\s*/, '')
        .split(/\n\s*\n/)[0];
      if (
        !firstParagraph.includes(
          `${versions.current.routeBase}/build/query-core`,
        )
      )
        fail('the first paragraph must direct V2 reads to the Core Query API');
      if (
        !body.includes('https://mainnet.intuition.sh/v1/graphql') ||
        !body.includes('https://testnet.intuition.sh/v1/graphql') ||
        !/not a V2 read path/i.test(body)
      )
        fail(
          'the SDK read-client page must identify both V1 endpoints and disclaim a V2 read path',
        );
    }
    for (const fence of parsed.fences) {
      if (
        id !== 'reference/sdk/api' &&
        /\bcreateIntuitionApiClient\s*(?:<[^;\n]*>)?\s*\(/.test(fence.code)
      )
        fail('V2 code must not call the hosted SDK read client');
      if (
        ['build/read-with-sdk', 'reference/packages/sdk'].includes(id) &&
        /sdk\/api|createIntuitionApiClient|getIntuitionApiUrl|intuition\.sh|\bapi\.atoms\b/.test(
          fence.code,
        )
      )
        fail('SDK read-client recipes are forbidden on this page');
    }
    if (id === 'reference/packages/sdk') {
      const apiLines = withoutFences(parsed)
        .split(/\r?\n/)
        .filter((line) =>
          /(?:sdk\/api|`\.\/api`|createIntuitionApiClient|getIntuitionApiUrl|intuition\.sh)/.test(
            line,
          ),
        );
      const rows = apiLines.filter((line) =>
        /^\s*\|\s*`\.\/api`\s*\|/.test(line),
      );
      const notes = apiLines.filter((line) => !/^\s*\|/.test(line));
      if (
        rows.length !== 1 ||
        notes.length !== 1 ||
        !/V1 GraphQL API/.test(notes[0] || '') ||
        !notes[0]?.includes(`${versions.current.routeBase}/build/read-with-sdk`)
      )
        fail(
          'SDK ./api belongs only in its entry-point row and one linked V1 GraphQL sentence',
        );
    }
  }
  if (phase !== undefined) {
    const expected = launchRows
      .filter((row) => row.phase <= phase)
      .map((row) => row.route);
    for (const route of expected)
      if (!seen.has(route))
        errors.push(`Phase ${phase} missing route: ${route}`);
    for (const route of seen)
      if (!expected.includes(route))
        errors.push(`Phase ${phase} extra route: ${route}`);
  }
  return errors;
}

function sidebarIds(items, errors = []) {
  const ids = [];
  for (const item of items || []) {
    if (typeof item === 'string') ids.push(item);
    else if (item?.type === 'doc') ids.push(item.id);
    else if (item?.type === 'category') {
      if (item.link?.type === 'doc') ids.push(item.link.id);
      else if (item.link)
        errors.push('V2 categories may link only to authored docs');
      ids.push(...sidebarIds(item.items, errors));
    } else
      errors.push('V2 sidebar may contain only authored docs and categories');
  }
  return ids;
}

function validateSidebar(sidebar, docs, launchRows, phase) {
  const errors = [];
  if (
    !sidebar ||
    Object.keys(sidebar).join(',') !== 'docs' ||
    !Array.isArray(sidebar.docs)
  )
    return ['There must be exactly one authored docs sidebar'];
  const ids = sidebarIds(sidebar.docs, errors);
  const byId = new Map(docs.map((doc) => [doc.id, doc.route]));
  for (const id of ids)
    if (!byId.has(id)) errors.push(`Sidebar doc does not exist: ${id}`);
  if (new Set(ids).size !== ids.length) errors.push('Sidebar repeats a doc');
  const expected = launchRows
    .filter((row) =>
      phase === undefined
        ? docs.some((doc) => doc.route === row.route)
        : row.phase <= phase,
    )
    .map((row) => row.route);
  if (
    JSON.stringify(ids.map((id) => byId.get(id))) !== JSON.stringify(expected)
  )
    errors.push('Sidebar routes differ from the launch-plan order');
  return errors;
}

function validateMismatches(
  records,
  launchRows,
  { manifest = null, openApi = null } = {},
) {
  const errors = [];
  if (!Array.isArray(records)) return ['source-mismatches must be an array'];
  const routes = new Set(launchRows.map((row) => row.route));
  const ids = new Set();
  for (const record of records) {
    if (!record || typeof record !== 'object') {
      errors.push('Invalid source-mismatch record');
      continue;
    }
    for (const key of ['id', 'repo', 'path', 'finding'])
      if (typeof record[key] !== 'string' || !record[key].trim())
        errors.push(`Mismatch ${record.id || '(unknown)'} needs ${key}`);
    if (ids.has(record.id)) errors.push(`Duplicate mismatch: ${record.id}`);
    ids.add(record.id);
    if (!['open', 'resolved'].includes(record.status))
      errors.push(`Invalid mismatch status: ${record.id}`);
    if (
      !Array.isArray(record.docsPages) ||
      !record.docsPages.length ||
      record.docsPages.some((route) => !routes.has(route))
    )
      errors.push(
        `Mismatch ${record.id} docsPages must be normalized planned routes`,
      );
  }
  for (let i = 1; i <= 8; i++)
    if (!ids.has(`M-${i}`)) errors.push(`Missing mismatch M-${i}`);
  if (!manifest) {
    const statuses = [
      'open',
      'resolved',
      'resolved',
      'resolved',
      'resolved',
      'open',
      'open',
      'open',
    ];
    for (const [i, status] of statuses.entries())
      if (
        records.find((record) => record?.id === `M-${i + 1}`)?.status !== status
      )
        errors.push(`Phase 1 M-${i + 1} status must be ${status}`);
    if (ids.has('M-9'))
      errors.push('M-9 is absent until a Core fallback actually applies');
  } else {
    if (!openApi) errors.push('M-7 requires the vendored Core source OpenAPI');
    else {
      const expected = openApi.paths?.[IID_OPERATION]?.get
        ? 'resolved'
        : 'open';
      if (records.find((record) => record?.id === 'M-7')?.status !== expected)
        errors.push(
          `M-7 status must be ${expected} for the pinned Core OpenAPI`,
        );
    }
  }
  return errors;
}

function checkRoutePermanence(
  previousRoutes,
  currentRoutes,
  renames,
  { initialized = true } = {},
) {
  if (!initialized) return [];
  const current = new Set(currentRoutes);
  const redirects = new Map(
    renames.flatMap(({ from, to }) =>
      (Array.isArray(from) ? from : [from]).map((source) => [source, to]),
    ),
  );
  return previousRoutes
    .filter((route) => !current.has(route) && !redirects.has(route))
    .map((route) => `Shipped V2 route removed without v2Renames: ${route}`);
}

function previousV2Routes(root, base = 'origin/main') {
  const opts = { cwd: root, encoding: 'utf8' };
  const exists = spawnSync('git', ['rev-parse', '--verify', base], opts);
  if (exists.status !== 0)
    throw new Error(
      `Cannot check V2 route permanence: missing ${base}; fetch full history`,
    );
  const initialized =
    spawnSync('git', ['cat-file', '-e', `${base}:_data_versions.json`], opts)
      .status === 0;
  if (!initialized) return { initialized: false, routes: [] };
  const names = execFileSync(
    'git',
    [
      'ls-tree',
      '-r',
      '--name-only',
      '-z',
      base,
      '--',
      versions.current.docsDir,
    ],
    opts,
  )
    .split('\0')
    .filter((file) => /\.mdx?$/.test(file));
  const routes = names
    .filter(
      (file) =>
        !file
          .slice(versions.current.docsDir.length + 1)
          .split('/')
          .some((part) => /^[_.]/.test(part)),
    )
    .map(
      (file) =>
        docMetadata(
          file.slice(versions.current.docsDir.length + 1),
          execFileSync('git', ['show', `${base}:${file}`], opts),
          versions.current,
        ).route,
    );
  return { initialized, routes };
}

function run({ root = ROOT, phase, base = 'origin/main' } = {}) {
  const launchRows = loadLaunchRoutes(
    fs.readFileSync(path.join(root, 'scripts/v2-launch-routes.txt'), 'utf8'),
  );
  const docs = readDocs(root, versions.current);
  const manifestFile = path.join(root, 'static/intuition-release.json');
  const manifest = fs.existsSync(manifestFile)
    ? JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
    : null;
  const openApi = readCoreOpenApi(root, manifest);
  const sidebar = require(path.join(root, 'sidebars.js'));
  const { v2Renames } = require(path.join(root, 'redirects.config.js'));
  const previous = previousV2Routes(root, base);
  const errors = [
    ...validateDocs(docs, { launchRows, manifest, openApi, phase }),
    ...validateSidebar(sidebar, docs, launchRows, phase),
    ...validateMismatches(
      JSON.parse(
        fs.readFileSync(
          path.join(root, 'scripts/source-mismatches.json'),
          'utf8',
        ),
      ),
      launchRows,
      { manifest, openApi },
    ),
    ...checkRoutePermanence(
      previous.routes,
      docs.map((doc) => doc.route),
      v2Renames,
      previous,
    ),
  ];
  for (const { from, to } of v2Renames) {
    if (
      typeof to !== 'string' ||
      !(
        to === versions.current.routeBase ||
        to.startsWith(`${versions.current.routeBase}/`)
      ) ||
      to === versions.v1.routeBase ||
      to.startsWith(`${versions.v1.routeBase}/`)
    )
      errors.push(`Invalid V2 rename target: ${to}`);
    if (
      (Array.isArray(from) ? from : [from]).some((route) =>
        docs.some((doc) => doc.route === route),
      )
    )
      errors.push(`V2 rename collides with a live route: ${from}`);
  }
  return { errors, count: docs.length, initialized: previous.initialized };
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    let phase;
    if (args[0] === '--phase' && /^[1-5]$/.test(args[1]) && args.length === 2)
      phase = Number(args[1]);
    else if (args.length === 1 && args[0] === '--launch') phase = 5;
    else if (args.length)
      throw new Error(
        'Usage: validate-v2-structure.js [--phase 1..5 | --launch]',
      );
    const result = run({ phase });
    if (result.errors.length) throw new Error(result.errors.join('\n'));
    console.log(
      `V2 structure PASS: ${result.count} docs; 134 planned routes; ${result.initialized ? 'shipped route permanence checked' : 'pre-foundation main recognized'}.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = {
  SDK_API_WARNING,
  GRAPHQL_NOTE,
  validateCoreSource,
  readCoreOpenApi,
  GRAPHQL_PAGES,
  READ_CLIENT_PAGES,
  loadLaunchRoutes,
  validateDocs,
  validateSidebar,
  validateMismatches,
  checkRoutePermanence,
  previousV2Routes,
  run,
};
