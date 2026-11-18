'use strict';

const { versions } = require('./docs-versions.config');
const current = versions.current.routeBase;
const v1 = versions.v1.routeBase;

// These sources predate versioning and must remain stable.
const legacyRedirects = [
  { from: `${current}/introduction/overview`, to: v1 },
  { from: `${current}/introduction/why-intuition`, to: `${v1}/getting-started/why-intuition` },
  { from: `${current}/quickstart/intuition-kits`, to: `${v1}/getting-started/developer-resources` },
  { from: `${current}/getting-started/intuition-kits`, to: `${v1}/getting-started/developer-resources` },
  { from: `${current}/network/node/overview`, to: `${v1}/intuition-node/overview` },
  { from: `${current}/network/node/rust-backend`, to: `${v1}/intuition-node/rust-backend` },
  { from: `${current}/network/node/local-setup`, to: `${v1}/intuition-node/local-setup` },
  { from: `${current}/network/node/kubernetes`, to: `${v1}/intuition-node/kubernetes` },
  { from: `${current}/intuition-ai/index`, to: `${v1}/experimental-applications/mcp-server` },
  { from: `${current}/intuition-ai/mcp-server`, to: `${v1}/experimental-applications/mcp-server` },
  { from: `${current}/integrations/ai/overview`, to: `${v1}/experimental-applications/mcp-server` },
  { from: `${current}/integrations/ai/mcp-server`, to: `${v1}/experimental-applications/mcp-server` },
];

// ===== V2 RENAMES =====
// Add permanent redirects here when an already shipped V2 route moves.
const v2Renames = [];
const redirects = [...legacyRedirects, ...v2Renames];

function createRedirects(route) {
  return route.startsWith(`${v1}/`)
    ? [`${current}/${route.slice(v1.length + 1)}`]
    : undefined;
}

module.exports = { legacyRedirects, v2Renames, redirects, createRedirects };
