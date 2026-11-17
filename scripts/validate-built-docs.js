#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { versions } = require('../docs-versions.config');
const { redirects, createRedirects } = require('../redirects.config');
const { readDocs, normalizeRoute } = require('./lib/docs-tree');
const {
  readGlobalVersions,
  validateEquivalents,
} = require('./validate-version-equivalents');
const {
  GRAPHQL_PAGES,
  READ_CLIENT_PAGES,
  SDK_API_WARNING,
  loadLaunchRoutes,
  readCoreOpenApi,
} = require('./validate-v2-structure');
const ROOT = path.resolve(__dirname, '..');
const BANNER_TEXT =
  "You're reading the V1 docs. They cover the first generation of Intuition: the intuition-ts packages and the intuition-rs services. New development happens in V2. Open the V2 docs";
const VOID = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);
function decode(text) {
  return text.replace(
    /&(?:#(\d+)|#x([\da-f]+)|([a-z]+));/gi,
    (match, dec, hex, name) =>
      dec || hex
        ? String.fromCodePoint(parseInt(dec || hex, dec ? 10 : 16))
        : { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }[
            name
          ] || match,
  );
}
// Small HTML tokenizer for static assertions. It tracks nesting so body links
// cannot be confused with the same labels in shared chrome.
function parseHtml(html) {
  const root = { tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  for (const token of html.matchAll(
    /<!--[\s\S]*?-->|<![^>]*>|<\/?[a-zA-Z][^>]*>|[^<]+/g,
  )) {
    const value = token[0];
    if (value.startsWith('<!')) continue;
    if (value.startsWith('</')) {
      const tag = value
        .slice(2)
        .match(/^[\w:-]+/)?.[0]
        .toLowerCase();
      const index = stack.map((node) => node.tag).lastIndexOf(tag);
      if (index > 0) stack.length = index;
    } else if (value.startsWith('<')) {
      const tag = value
        .slice(1)
        .match(/^[\w:-]+/)[0]
        .toLowerCase();
      const attrs = {};
      for (const attr of value
        .slice(tag.length + 1, -1)
        .matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))
        attrs[attr[1].toLowerCase()] = decode(
          attr[2] ?? attr[3] ?? attr[4] ?? '',
        );
      const node = { tag, attrs, children: [], parent: stack.at(-1) };
      stack.at(-1).children.push(node);
      if (!VOID.has(tag) && !value.endsWith('/>')) stack.push(node);
    } else
      stack.at(-1).children.push({
        tag: '#text',
        value: decode(value),
        children: [],
        parent: stack.at(-1),
      });
  }
  return root;
}
function nodes(root, predicate) {
  return [
    root,
    ...root.children.flatMap((child) => nodes(child, () => true)),
  ].filter(predicate);
}
function hasClass(node, name) {
  return (node.attrs?.class || '').split(/\s+/).includes(name);
}
function textContent(node) {
  return node.tag === '#text'
    ? node.value
    : ['script', 'style'].includes(node.tag)
      ? ''
      : node.children.map(textContent).join('');
}
function visibleText(node) {
  return textContent(node).replace(/\s+/g, ' ').trim();
}
function within(node, ancestor) {
  for (let current = node; current; current = current.parent)
    if (current === ancestor) return true;
  return false;
}
function validateDeveloperFooter(tree, shippedRoutes) {
  const current = versions.current.routeBase;
  const old = versions.v1.routeBase;
  const routes = new Set(shippedRoutes.map(normalizeRoute));
  // Independent FR-15 expectations are derived from the shipped source tree,
  // not from the footer resolver whose rendered output this check validates.
  const positions = [
    [
      'Architecture',
      [`${current}/get-started/how-it-fits`],
      `${old}/intuition-concepts/architecture`,
    ],
    [
      'Primitives',
      [`${current}/concepts`],
      `${old}/intuition-concepts/primitives`,
    ],
    [
      'Smart Contracts',
      [
        `${current}/reference/contracts`,
        `${current}/reference/packages/protocol`,
      ],
      `${old}/intuition-smart-contracts`,
    ],
    ['GraphQL API', [], `${old}/graphql-api/overview`],
    [
      'SDK',
      [`${current}/reference/packages/sdk`],
      `${old}/intuition-sdk/installation-and-setup`,
    ],
    ['AI Integration', [`${current}/agents`, `${current}/agents/skills`]],
  ];
  const expected = positions.map(([name, targets, fallback]) => {
    const target = targets.find((route) => routes.has(route));
    return {
      name: target ? name : `${name} (V1)`,
      href: target || fallback,
    };
  });
  const headings = nodes(tree, (node) => node.tag === 'footer').flatMap(
    (footer) =>
      nodes(
        footer,
        (node) =>
          /^h[1-6]$/.test(node.tag) && visibleText(node) === 'Developers',
      ),
  );
  if (headings.length !== 1) return ['expected one Developers footer column'];
  const actual = nodes(headings[0].parent, (node) => node.tag === 'a').map(
    (node) => ({
      name: visibleText(node),
      href: normalizeRoute(node.attrs.href || ''),
    }),
  );
  return JSON.stringify(actual) === JSON.stringify(expected)
    ? []
    : [
        `Developers footer must use shipped FR-15 destinations: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
      ];
}
function routeFile(build, route) {
  route = normalizeRoute(route);
  const relative = route.replace(/^\//, '');
  const candidates =
    route === '/'
      ? [path.join(build, 'index.html')]
      : [
          path.join(build, `${relative}.html`),
          path.join(build, relative, 'index.html'),
          path.join(build, relative),
        ];
  return candidates.find(
    (file) => fs.existsSync(file) && fs.statSync(file).isFile(),
  );
}
function assertDocHtml(
  html,
  {
    version,
    doc,
    target = versions.current.routeBase,
    expectedEditUrl,
    manifest = null,
    openApi = null,
    phase,
    shippedRoutes,
  },
) {
  const errors = [];
  const tree = parseHtml(html);
  if (shippedRoutes)
    errors.push(...validateDeveloperFooter(tree, shippedRoutes));
  const badges = nodes(tree, (node) =>
    hasClass(node, 'theme-doc-version-badge'),
  );
  if (
    badges.length !== 1 ||
    visibleText(badges[0]) !== `Version: ${version.label}`
  )
    errors.push('expected one native version badge');
  const noindex = nodes(
    tree,
    (node) => node.tag === 'meta' && node.attrs.name === 'robots',
  ).some((node) => /noindex/.test(node.attrs.content || ''));
  if (noindex !== version.noIndex)
    errors.push('robots noindex does not match version');
  if (
    version.noIndex &&
    !nodes(
      tree,
      (node) => node.tag === 'meta' && node.attrs.name === 'robots',
    ).some(
      (node) =>
        (node.attrs.content || '').replace(/\s/g, '') === 'noindex,nofollow',
    )
  )
    errors.push('V1 robots must be noindex, nofollow');
  const banners = nodes(tree, (node) =>
    hasClass(node, 'theme-doc-version-banner'),
  );
  if (version.name === versions.v1.name) {
    if (
      nodes(tree, (node) => node.tag === 'a').some((node) =>
        /Edit this page/i.test(visibleText(node)),
      )
    )
      errors.push('V1 must not have an edit link');
    if (banners.length !== 1)
      errors.push('V1 must have exactly one version banner');
    else {
      const banner = banners[0];
      if (
        !hasClass(banner, 'alert') ||
        !hasClass(banner, 'alert--warning') ||
        visibleText(banner) !== BANNER_TEXT
      )
        errors.push('V1 warning banner copy/classes changed');
      const links = nodes(banner, (node) => node.tag === 'a').map((node) =>
        node.attrs.href?.startsWith('/')
          ? normalizeRoute(node.attrs.href)
          : node.attrs.href,
      );
      if (
        JSON.stringify(links) !==
        JSON.stringify([
          'https://github.com/0xIntuition/intuition-ts',
          'https://github.com/0xIntuition/intuition-rs',
          normalizeRoute(target),
        ])
      )
        errors.push('V1 banner repositories or mapped V2 target changed');
      if (/unsupported|not supported/i.test(visibleText(banner)))
        errors.push('V1 banner must not claim unsupported endpoints');
    }
  } else {
    if (banners.length) errors.push('V2 must not have a version banner');
    if (expectedEditUrl) {
      const editLinks = nodes(tree, (node) => node.tag === 'a').filter((node) =>
        /Edit this page/i.test(visibleText(node)),
      );
      if (editLinks.length !== 1 || editLinks[0].attrs.href !== expectedEditUrl)
        errors.push('V2 edit link must point to this page source');
    }
    const bodies = nodes(tree, (node) => hasClass(node, 'theme-doc-markdown'));
    if (bodies.length !== 1) errors.push('expected one V2 markdown body');
    else {
      const body = bodies[0];
      const bodyText = visibleText(body);
      const packages = doc.frontMatter?.packages || [];
      const applies = nodes(
        body,
        (node) => node.attrs?.['data-applies-to'] === 'V2',
      );
      const bodyElements = body.children.filter((node) => node.tag !== '#text');
      const headerIndex = bodyElements.findIndex(
        (node) => node.tag === 'header',
      );
      if (packages.length) {
        const pins = new Map(
          (manifest?.packages || []).map((pkg) => [pkg.name, pkg.version]),
        );
        const expected = `Applies to V2${packages.map((name) => ` · ${name} ${pins.get(name)}`).join('')}${manifest?.status?.includes('alpha') ? ' · pre-release' : ''}`;
        if (packages.some((name) => !pins.has(name)))
          errors.push('AppliesTo needs exact manifest package versions');
        if (
          applies.length !== 1 ||
          headerIndex !== 0 ||
          bodyElements[headerIndex + 1] !== applies[0]
        )
          errors.push(
            'AppliesTo must be the first body element after the title header',
          );
        else if (visibleText(applies[0]) !== expected)
          errors.push(
            'AppliesTo package versions or release status differ from the manifest',
          );
      } else if (applies.length)
        errors.push(
          'Pages without packages must not render AppliesTo metadata',
        );
      if (doc.id === 'reference/sdk/api') {
        const warning = bodyElements[headerIndex + 2];
        const expected = SDK_API_WARNING.replace(
          /\[([^\]]+)\]\([^)]+\)/g,
          '$1',
        );
        if (
          !warning ||
          visibleText(warning) !== expected ||
          !nodes(
            warning,
            (node) =>
              node.tag === 'a' &&
              node.attrs.href ===
                `${versions.current.routeBase}/build/read-with-sdk`,
          ).length
        )
          errors.push(
            'SDK API warning must immediately follow AppliesTo in the built body',
          );
      }
      if (/graphql/i.test(bodyText) && !GRAPHQL_PAGES.has(doc.id))
        errors.push('GraphQL in a forbidden V2 body');
      if (
        /sdk\/api|createIntuitionApiClient|getIntuitionApiUrl|intuition\.sh/i.test(
          bodyText,
        ) &&
        !READ_CLIENT_PAGES.has(doc.id)
      )
        errors.push('SDK hosted read-client references in a forbidden V2 body');
      const mcp = bodyText.match(/\bMCP\b/gi) || [];
      if (
        mcp.length &&
        !(
          doc.id === 'agents/index' &&
          phase >= 3 &&
          mcp.length === 1 &&
          bodyText.includes('An Intuition MCP server is not available yet.')
        )
      )
        errors.push(
          'MCP body notice is reserved for agents/index from Phase 3',
        );
      if (
        bodyText.includes('/api/iids/') &&
        !openApi?.paths?.['/api/iids/{iid}/atoms']?.get
      )
        errors.push('IID lookup is absent from the pinned Core OpenAPI (M-7)');
      for (const code of nodes(body, (node) => node.tag === 'pre')) {
        const content = textContent(code);
        if (
          /\b(?:query|mutation|subscription|fragment)\s+[A-Za-z_]\w*(?:\s*\([^)]*\))?\s*(?:on\s+\w+\s*)?\{/m.test(
            content,
          )
        )
          errors.push('GraphQL operation documents are forbidden in V2 code');
        if (
          doc.id !== 'reference/sdk/api' &&
          /\bcreateIntuitionApiClient\s*(?:<[^;\n]*>)?\s*\(/.test(content)
        )
          errors.push('V2 code must not call the hosted SDK read client');
      }
      for (const link of nodes(body, (node) => node.tag === 'a')) {
        const href = link.attrs.href || '';
        if (
          href.startsWith(`${versions.v1.routeBase}/graphql-api/`) &&
          !(
            GRAPHQL_PAGES.has(doc.id) &&
            href === `${versions.v1.routeBase}/graphql-api/overview`
          )
        )
          errors.push('forbidden V1 GraphQL body link');
        if (href.includes('experimental-applications/mcp-server'))
          errors.push('forbidden MCP body link');
      }
      for (const link of nodes(
        tree,
        (node) => node.tag === 'a' && !within(node, body),
      )) {
        const href = link.attrs.href || '';
        if (
          (href === versions.v1.routeBase ||
            href.startsWith(`${versions.v1.routeBase}/`)) &&
          !/(?:\(V1\)$|^V1$)/.test(visibleText(link))
        )
          errors.push(`unlabelled V1 chrome link: ${href}`);
      }
    }
  }
  return errors;
}
function validateSitemap(xml, routes) {
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    normalizeRoute(new URL(decode(match[1])).pathname),
  );
  const errors = [];
  if (
    paths.some(
      (route) =>
        route === versions.v1.routeBase ||
        route.startsWith(`${versions.v1.routeBase}/`),
    )
  )
    errors.push('V1 appears in sitemap');
  for (const route of routes)
    if (!paths.includes(normalizeRoute(route)))
      errors.push(`Missing sitemap route: ${route}`);
  return errors;
}
function validateNoscript(html, shippedLandings, exists) {
  const tree = parseHtml(html);
  const blocks = nodes(tree, (node) => node.tag === 'noscript');
  const links = blocks
    .flatMap((block) => nodes(block, (node) => node.tag === 'a'))
    .map((node) => normalizeRoute(node.attrs.href));
  const required = [
    versions.v1.routeBase,
    '/llms.txt',
    '/llms-full.txt',
    `${versions.v1.routeBase}/llms.txt`,
    ...shippedLandings,
  ];
  const errors = [];
  for (const route of required)
    if (!links.includes(normalizeRoute(route)))
      errors.push(`Missing noscript discovery link: ${route}`);
  for (const route of links)
    if (!exists(route))
      errors.push(`Unresolved noscript discovery link: ${route}`);
  return errors;
}
function validateCollisions(
  docs,
  staticRedirects = redirects,
  generated = createRedirects,
) {
  const canonicalDocs = docs.map((doc) => ({
    ...doc,
    path: normalizeRoute(doc.path),
  }));
  const live = new Set(canonicalDocs.map((doc) => doc.path));
  const seen = new Map();
  const errors = [];
  const all = [
    ...staticRedirects.flatMap(({ from, to }) =>
      (Array.isArray(from) ? from : [from]).map((source) => ({
        from: normalizeRoute(source),
        to: normalizeRoute(to),
      })),
    ),
    ...canonicalDocs.flatMap((doc) =>
      (generated(doc.path) || []).map((from) => ({
        from: normalizeRoute(from),
        to: doc.path,
      })),
    ),
  ];
  for (const { from, to } of all) {
    if (live.has(from))
      errors.push(`Redirect collides with live route: ${from}`);
    if (seen.has(from))
      errors.push(
        `Duplicate redirect source: ${from} (${seen.get(from)}, ${to})`,
      );
    seen.set(from, to);
  }
  return errors;
}
function run({ root = ROOT, phase, buildLog } = {}) {
  const build = path.join(root, 'build');
  const loaded = readGlobalVersions(
    JSON.parse(
      fs.readFileSync(path.join(root, '.docusaurus/globalData.json'), 'utf8'),
    ),
  ).map((version) => ({
    ...version,
    docs: version.docs.map((doc) => ({
      ...doc,
      path: normalizeRoute(doc.path),
    })),
  }));
  const map = JSON.parse(
    fs.readFileSync(
      path.join(root, 'src/data/version-equivalents.json'),
      'utf8',
    ),
  );
  const current = loaded.find(
    (entry) => entry.name === versions.current.name,
  ).docs;
  const currentDocs = current.filter((doc) => !doc.id.startsWith('/'));
  const source = readDocs(root, versions.current);
  const manifestFile = path.join(root, 'static/intuition-release.json');
  const manifest = fs.existsSync(manifestFile)
    ? JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
    : null;
  const openApi = readCoreOpenApi(root, manifest);
  const errors = validateEquivalents(map, loaded);
  if (current.length !== currentDocs.length)
    errors.push('V2 must not have generated-index entries');
  if (
    JSON.stringify(currentDocs.map((doc) => doc.path).sort()) !==
    JSON.stringify(source.map((doc) => doc.route).sort())
  )
    errors.push('Built V2 docs differ from current source routes');
  if (phase) {
    const plan = loadLaunchRoutes(
      fs.readFileSync(path.join(root, 'scripts/v2-launch-routes.txt'), 'utf8'),
    )
      .filter((row) => row.phase <= phase)
      .map((row) => row.route)
      .sort();
    if (
      JSON.stringify(currentDocs.map((doc) => doc.path).sort()) !==
      JSON.stringify(plan)
    )
      errors.push(`Built V2 routes do not equal Phase ${phase} plan`);
  }
  for (const version of Object.values(versions)) {
    const built = loaded.find((entry) => entry.name === version.name);
    for (const doc of built.docs) {
      const file = routeFile(build, doc.path);
      if (!file) {
        errors.push(`Missing built doc: ${doc.path}`);
        continue;
      }
      const pair = map.pairs.find((entry) => entry.v1 === doc.id);
      const target = pair
        ? currentDocs.find((entry) => entry.id === pair.v2)?.path
        : versions.current.routeBase;
      errors.push(
        ...assertDocHtml(fs.readFileSync(file, 'utf8'), {
          version,
          doc: {
            ...doc,
            frontMatter: source.find((page) => page.id === doc.id)?.frontMatter,
          },
          target,
          manifest,
          openApi,
          phase,
          shippedRoutes: source.map((page) => page.route),
          expectedEditUrl:
            version.name === versions.current.name
              ? `https://github.com/0xIntuition/intuition-docs/tree/main/${version.docsDir}/${source.find((page) => page.id === doc.id)?.relativePath}`
              : undefined,
        }).map((error) => `${doc.path}: ${error}`),
      );
    }
  }
  errors.push(...validateCollisions(loaded.flatMap((version) => version.docs)));
  errors.push(
    ...validateSitemap(
      fs.readFileSync(path.join(build, 'sitemap.xml'), 'utf8'),
      currentDocs.map((doc) => doc.path),
    ),
  );
  const landings = source
    .filter((doc) => /^[^/]+\/index\.mdx?$/.test(doc.relativePath))
    .map((doc) => doc.route);
  errors.push(
    ...validateNoscript(
      fs.readFileSync(path.join(build, 'index.html'), 'utf8'),
      landings,
      (route) => Boolean(routeFile(build, route)),
    ),
  );
  if (
    buildLog &&
    /(?:client-redirects[\s\S]{0,150}(?:collision|already exists|skipp|override existing paths|multiple redirects)|(?:collision|already exists)[^\n]*redirect)/i.test(
      fs.readFileSync(buildLog, 'utf8'),
    )
  )
    errors.push('Build log contains redirect collision warnings');
  return {
    errors,
    counts: loaded.map(
      (version) =>
        `${version.name}: ${version.docs.filter((doc) => !doc.id.startsWith('/')).length} content docs`,
    ),
  };
}
if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    let phase;
    let buildLog;
    while (args.length) {
      const arg = args.shift();
      if (arg === '--phase' && /^[1-5]$/.test(args[0]))
        phase = Number(args.shift());
      else if (arg === '--build-log' && args[0]) buildLog = args.shift();
      else
        throw new Error(
          'Usage: validate-built-docs.js [--phase 1..5] [--build-log file]',
        );
    }
    const result = run({ phase, buildLog });
    if (result.errors.length) throw new Error(result.errors.join('\n'));
    console.log(
      `Built docs PASS: ${result.counts.join('; ')}; version chrome, body restrictions, discovery, sitemap and redirect checks passed.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = {
  BANNER_TEXT,
  parseHtml,
  nodes,
  visibleText,
  validateDeveloperFooter,
  routeFile,
  assertDocHtml,
  validateSitemap,
  validateNoscript,
  validateCollisions,
  run,
};
