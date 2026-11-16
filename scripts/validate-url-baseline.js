#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');

// The 2026-11-10 route set was reconstructed from the Phase 0 build at
// a27f3fc807438584c5a425517132e4326481d914 (route-identical to 0b3d39e),
// then compared path-for-path with the live sitemap on 2026-11-16. All 244
// paths agree. No archived 2026-11-10 sitemap was recovered; this is a
// corroborated reconstruction, not a claim that the current fetch is an archive.
function readBaseline(file) {
  const routes = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean);
  if (new Set(routes).size !== routes.length) throw new Error('URL baseline contains duplicate routes.');
  for (const route of routes) {
    if (!route.startsWith('/') || route.startsWith('//') || /[?#\\]/.test(route) || route.split('/').includes('..')) throw new Error(`Invalid baseline route: ${route}`);
  }
  return routes;
}

function validateRoutes(routes, buildDir) {
  return routes.filter((route) => {
    const relative = route.slice(1);
    const candidates = route === '/' ? ['index.html'] : [`${relative}.html`, path.join(relative, 'index.html')];
    return !candidates.some((candidate) => {
      try { return fs.statSync(path.join(buildDir, candidate)).isFile(); } catch { return false; }
    });
  });
}

if (require.main === module) {
  try {
    const routes = readBaseline(path.join(ROOT, 'scripts/url-baseline-2026-11-10.txt'));
    if (routes.length !== 244) throw new Error(`Expected 244 baseline routes, got ${routes.length}.`);
    const missing = validateRoutes(routes, path.join(ROOT, 'build'));
    if (missing.length) throw new Error(`Missing ${missing.length}/${routes.length} baseline routes:\n${missing.join('\n')}`);
    console.log(`URL baseline: ${routes.length}/${routes.length} routes resolve in build.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { readBaseline, validateRoutes };
