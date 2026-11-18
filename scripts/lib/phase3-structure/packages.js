'use strict';

const { routeLinks, tables } = require('./markdown');
const PREFIX = '/docs/reference/packages/';

function sameMembers(actual, expected) {
  const sorted = [...expected].sort();
  return (
    Array.isArray(actual) &&
    actual.length === sorted.length &&
    [...actual].sort().every((value, i) => value === sorted[i])
  );
}

function validateSnapshot(snapshot, manifest, fail) {
  if (
    snapshot.source.commit !== manifest.source.commit ||
    snapshot.source.repository !== manifest.source.repository ||
    snapshot.source.path !== 'docs/architecture/dependency-graph.md'
  )
    fail('runtime dependency snapshot source differs from the pinned graph');
  const versions = new Map(
    manifest.packages.map((pkg) => [pkg.name, pkg.version]),
  );
  if (
    !sameMembers(
      snapshot.packages.map(({ name }) => name),
      [...versions.keys()],
    )
  )
    fail('runtime dependency snapshot must cover every manifest package once');
  for (const pkg of snapshot.packages) {
    if (pkg.version !== versions.get(pkg.name))
      fail(`stale runtime dependency snapshot version for ${pkg.name}`);
    for (const [name, version] of Object.entries(pkg.dependencies)) {
      if (version !== versions.get(name))
        fail(`stale dependency edge ${pkg.name} → ${name}@${version}`);
    }
  }
}

function validatePackage(doc, page, pkg, runtime, concepts, fail) {
  if (
    doc.frontMatter.kind !== 'reference' ||
    !sameMembers(doc.frontMatter.packages, [pkg.name])
  )
    fail('package metadata must declare reference kind and only its package');
  const entries = tables(page.section('Entry points')).flatMap(
    ([, ...rows]) => rows,
  );
  const subpaths = entries.map(([name, purpose]) =>
    purpose?.trim() ? name.replace(/^`|`$/g, '') : '',
  );
  if (
    !sameMembers(
      subpaths,
      pkg.entrypoints.filter((name) => name !== './package.json'),
    )
  )
    fail('Entry points must match all published subpaths and their purposes');
  const depSection = page.section('Depends on and works with');
  // These paragraphs can also discuss consumers or ordinary external dependencies.
  // Compare the declared graph and peer lists, not links in the surrounding advice.
  const runtimeLists = [
    ...depSection.matchAll(
      /(?:^|\n)Runtime (?:package )?(?:dependenc(?:y|ies)|graph edges):\s*([^\n]*?)(?:\.(?=\s|$)|$)/gim,
    ),
  ];
  const declared = runtimeLists.map((match) => match[1]).join(', ');
  const runtimeNames = declared
    .replace(
      /\[[^\]\n]+\]\(\/docs\/reference\/packages\/([a-z0-9-]+)\)/g,
      '@0xintuition/$1',
    )
    .replace(/[`*]/g, '')
    .split(/(?:\s*,\s*(?:and\s+)?|\s+and\s+)/)
    .map((s) => s.trim())
    .filter((s) => s && s !== 'none');
  if (
    runtimeLists.length !== 1 ||
    !runtime ||
    !sameMembers(runtimeNames, Object.keys(runtime.dependencies))
  )
    fail('runtime dependency list must match the pinned graph');
  const peerLists = [
    ...depSection.matchAll(
      /\b(?:Published peers|Peer dependenc(?:y|ies)):\s*([^\n]*?)(?:\.(?=\s|$)|$)/gim,
    ),
  ];
  const peerTables = tables(depSection).filter(
    ([headers]) => headers?.[0] === 'Peer',
  );
  const peers = peerTables.flatMap(([, ...rows]) =>
    rows.map((cells) => cells.join(' ').replace(/`/g, '')),
  );
  for (const [, declarations] of peerLists) {
    if (declarations.trim().toLowerCase() === 'none') continue;
    peers.push(
      ...declarations.replace(/`/g, '').split(/\s*,\s*(?:and\s+)?|\s+and\s+/),
    );
  }
  if (
    peerLists.length + peerTables.length !== 1 ||
    !sameMembers(
      peers,
      Object.entries(pkg.peers).map(([name, version]) => `${name} ${version}`),
    )
  )
    fail('peer list must match published names and ranges');
  const related = routeLinks(page.section('Related concepts')).filter(
    (target) => target.startsWith('/docs/concepts/'),
  );
  if (
    !sameMembers(
      [...new Set(related)],
      concepts
        .filter((c) => c.packages.includes(pkg.name))
        .map((c) => '/docs/concepts/' + c.slug),
    )
  )
    fail('Related concepts must match the inverse concept package graph');
}

function validateChooser(page, manifest, fail) {
  const chooser = tables(page.prose).filter(
    ([headers]) =>
      headers?.length === 3 &&
      /^I want to(?:…|\.\.\.)$/.test(headers[0]) &&
      headers[1] === 'Install' &&
      headers[2] === 'Then read',
  );
  const installed = new Set();
  for (const [, ...rows] of chooser) {
    for (const cells of rows) {
      if (cells.length !== 3) {
        fail('malformed package chooser row');
        continue;
      }
      const install = cells[1].replace(/\]\([^)]*\)/g, ']');
      for (const [name] of install.matchAll(/@0xintuition\/[a-z0-9-]+/g))
        installed.add(name);
    }
  }
  if (
    chooser.length !== 1 ||
    !sameMembers(
      [...installed],
      manifest.packages.map((pkg) => pkg.name),
    )
  )
    fail('Install column must cover every manifest package');
}

module.exports = {
  PREFIX,
  sameMembers,
  validateSnapshot,
  validatePackage,
  validateChooser,
};
