'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Summaries of schemes/<name>.md#canonicalization at the canonical registry pin.
// Link each row to its full algorithm, including rejection and checksum rules.
const normalization = {
  acct: 'Lowercase the platform. Preserve strong user IDs byte-for-byte and apply NORM-1 to weak handles.',
  appid:
    'Lowercase the store and native app ID. Accept the ios and android stores.',
  caip10:
    'Lowercase a 40-hex-digit EVM address for eip155. Preserve address case in other namespaces.',
  caip19:
    'Lowercase a 40-hex-digit EVM asset address on eip155. Preserve other asset references.',
  doi: 'Remove the DOI resolver URL and any doi: prefix, then lowercase the DOI.',
  eidr: 'Remove the DOI resolver URL, uppercase the EIDR and validate its grouped shape.',
  gen1: 'Trim outer whitespace and validate the derived type, revision and lowercase 32-digit hex digest.',
  geo: 'Trim and lowercase the geohash. Check its alphabet and length of 1 to 12 characters.',
  gtin: 'Remove spaces, hyphens and dots. Pad an 8-, 12-, 13- or 14-digit GTIN to 14 digits and check its GS1 check digit.',
  hash: 'Lowercase the algorithm and 64-digit hex digest. Remove the optional 0x prefix and accept sha256 or keccak256.',
  imdb: 'Remove the title or name URL prefix and trailing path, lowercase the ID and validate its prefix and digits.',
  isbn: 'Remove spaces, hyphens and dots and validate the check digit. Convert ISBN-10 to ISBN-13 with prefix 978 and a new GS1 check digit.',
  isni: 'Remove spaces, hyphens and dots. Uppercase the check character and verify the ISO 7064 mod 11-2 checksum.',
  isrc: 'Remove spaces, hyphens and dots, uppercase the code and validate its 12-character shape.',
  iswc: 'Remove spaces, hyphens and dots, uppercase the code and verify its positional mod-10 check digit.',
  lei: 'Remove spaces, hyphens and dots, uppercase the code and verify the ISO 7064 mod 97-10 checksum.',
  mbid: 'Extract the supported entity type and UUID from a typed value or MusicBrainz URL. Lowercase both and join them with a colon.',
  olid: 'Remove the Open Library URL prefix and trailing path. Uppercase the ID and validate the A, M or W suffix.',
  orcid:
    'Remove spaces, hyphens and dots. Uppercase the check character and verify the ISO 7064 mod 11-2 checksum.',
  podcastguid: 'Trim and lowercase the GUID and validate its UUID shape.',
  purl: 'Remove the pkg: prefix and truncate at the first @, ? or #. Lowercase the ecosystem and package name.',
  rssitem:
    'Trim and lowercase. Validate the feed UUID and 32-digit hex item hash.',
  termset:
    'Trim and lowercase. Validate the 32-digit hex set hash and term slug.',
  tmdb: 'Extract the movie, tv or person segment and decimal ID. Drop the URL title slug and join the segment and ID with a colon.',
  url: 'Use HTTPS, lowercase the host and strip www., trailing slashes, the fragment, ports 80 and 443, and tracking parameters. Sort the remaining query pairs by key and value.',
  wd: 'Remove the Wikidata URL prefix and uppercase the QID. Require Q followed by a positive decimal ID without leading zeros.',
};

const providerTargets = {
  'apple-podcasts': 'a podcast feed in Apple Podcasts',
  'podcast-index': 'a podcast feed in Podcast Index',
  letterboxd: 'a film in Letterboxd',
};

const json = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const object = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const nonempty = (value) => typeof value === 'string' && value.trim() !== '';

function sameKeys(expected, actual, label) {
  const keys = new Set(actual);
  if (
    keys.size !== actual.length ||
    keys.size !== expected.length ||
    expected.some((key) => !keys.has(key))
  )
    throw new Error(`Inconsistent ${label} keys`);
}

function installedPackage(root, manifest, suffix) {
  const name = '@0xintuition/' + suffix;
  const directory = path.join(root, 'examples/v2/node_modules', name);
  const metadata = json(path.join(directory, 'package.json'));
  const pin = manifest.packages.find((pkg) => pkg.name === name);
  if (!pin || metadata.name !== name || metadata.version !== pin.version)
    throw new Error(
      `Installed examples/v2 ${suffix} package does not match the manifest`,
    );
  return { directory, metadata };
}

function packageFile(directory, relative) {
  if (
    typeof relative !== 'string' ||
    !relative.startsWith('./') ||
    !path.resolve(directory, relative).startsWith(directory + path.sep)
  )
    throw new Error('Missing package-local entry point or data file');
  const file = fs.realpathSync(path.resolve(directory, relative));
  if (
    !file.startsWith(fs.realpathSync(directory) + path.sep) ||
    !fs.statSync(file).isFile()
  )
    throw new Error('Expected a package-local file');
  return file;
}

function loadPackageEntry(root, manifest, suffix) {
  const { directory, metadata } = installedPackage(root, manifest, suffix);
  return require(packageFile(directory, metadata.exports?.['.']?.import));
}

// Markdown character references decode to the original visible characters.
// They cannot open a cell, an MDX expression, a tag or inline Markdown.
function cell(value) {
  return value
    .replace(/\r\n?|\n/g, ' ')
    .replace(/[&|<>`{}\\*_[\]~]/g, (char) => `&#${char.charCodeAt(0)};`);
}

function literal(value) {
  // Backtick-quoted program values retain URL bytes even in plain-text exports.
  // JSON quoting makes otherwise invisible outer spaces (e.g. gen1) apparent.
  const text =
    value.trim() !== value || /[\r\n]/.test(value)
      ? JSON.stringify(value)
      : value;
  const ticks = text.match(/`+/g) || [];
  const fence = '`'.repeat(1 + Math.max(0, ...ticks.map((run) => run.length)));
  const padding = text.startsWith('`') || text.endsWith('`') ? ' ' : '';
  return fence + padding + text.replace(/\|/g, '\\|') + padding + fence;
}

function schemeRow(name, cls, target, raw, value, rule, base) {
  return `| [${name}](${base}/schemes/${name}.md#canonicalization) | ${cls} | ${cell(target)} | ${literal(raw)} → ${literal('int:' + name + ':' + value)} | ${cell(rule)} |`;
}

function catalogHead(title) {
  return [
    `### ${title}`,
    '',
    '| Scheme | Class | Identifies | Input → canonical IID | Normalization |',
    '| --- | --- | --- | --- | --- |',
  ];
}

function canonicalRows(registry, vectors, version, base) {
  if (
    registry.name !== 'intuition-identifier-registry' ||
    registry.specVersion !== version ||
    vectors.specVersion !== version ||
    !object(registry.schemes) ||
    !Array.isArray(vectors.vectors) ||
    vectors.count !== vectors.vectors.length
  )
    throw new Error('Unsupported canonical IID registry or vector schema');
  const names = Object.keys(registry.schemes).sort();
  sameKeys(names, Object.keys(normalization), 'canonical normalization');
  const samples = new Map();
  for (const { scheme, input, canonical } of vectors.vectors) {
    if (
      !Object.hasOwn(registry.schemes, scheme) ||
      typeof input !== 'string' ||
      (canonical !== null && !nonempty(canonical))
    )
      throw new Error('Invalid canonical IID vector');
    if (canonical === null) continue;
    const previous = samples.get(scheme);
    if (
      !previous ||
      (previous.input === previous.canonical && input !== canonical)
    )
      samples.set(scheme, { input, canonical });
  }
  return names.map((name) => {
    const { class: cls, identifies } = registry.schemes[name];
    const sample = samples.get(name);
    if (!['A', 'B', 'C'].includes(cls) || !nonempty(identifies) || !sample)
      throw new Error(
        `Missing canonical IID class, target or positive example for ${name}`,
      );
    return schemeRow(
      name,
      cls,
      identifies,
      sample.input,
      sample.canonical,
      normalization[name],
      base,
    );
  });
}

function conformanceFile(directory, kind, version) {
  const data = json(packageFile(directory, `./conformance/${kind}.json`));
  if (
    data.specVersion !== version ||
    data.fixtureVersion !== 1 ||
    data.kind !== kind ||
    !(kind === 'schemes' ? object(data.schemes) : Array.isArray(data.vectors))
  )
    throw new Error(`Unsupported IID ${kind} conformance schema`);
  return kind === 'schemes' ? data.schemes : data.vectors;
}

function providerRows(
  registry,
  schemes,
  canonicalization,
  validation,
  runtime,
  base,
) {
  const names = Object.keys(schemes);
  sameKeys(names, runtime.SCHEME_NAMES, 'runtime IID scheme names');
  sameKeys(names, Object.keys(runtime.SCHEMES), 'runtime IID definitions');
  for (const [name, meta] of Object.entries(registry.schemes)) {
    if (
      schemes[name]?.class !== meta.class ||
      runtime.SCHEMES[name]?.class !== meta.class
    )
      throw new Error(
        `Missing or inconsistent canonical IID class for ${name}`,
      );
  }
  const extras = names
    .filter((name) => !Object.hasOwn(registry.schemes, name))
    .sort();
  sameKeys(extras, Object.keys(providerTargets), 'package-only IID scheme');
  return extras.map((name) => {
    const definition = runtime.SCHEMES[name];
    if (
      schemes[name].class !== 'D' ||
      definition.class !== 'D' ||
      definition.scheme !== name
    )
      throw new Error(`Expected a Class D definition for ${name}`);
    const cases = canonicalization.filter((vector) => vector.scheme === name);
    const sample = cases.find((vector) => nonempty(vector.canonical));
    if (!sample || !cases.some((vector) => vector.canonical === null))
      throw new Error(
        `Missing provider-local conformance examples for ${name}`,
      );
    for (const { raw, canonical } of cases) {
      if (
        typeof raw !== 'string' ||
        (canonical !== null && canonical !== raw) ||
        (definition.canonicalize(raw) ?? null) !== canonical
      )
        throw new Error(
          `Provider-local ${name} must reject invalid values without repair`,
        );
    }
    const iid = `int:${name}:${sample.canonical}`;
    const check = validation.find((vector) => vector.iid === iid);
    const inspected = runtime.inspectIntuitionId(iid);
    if (
      check?.valid !== true ||
      check.anchorEligible !== false ||
      inspected.valid !== true ||
      inspected.iid !== iid ||
      inspected.class !== 'D' ||
      inspected.anchorEligible !== false ||
      inspected.anchorIneligibilityReason !== 'provider-local'
    )
      throw new Error(
        `Expected a valid, anchor-ineligible provider-local IID: ${iid}`,
      );
    const grammar =
      name === 'letterboxd'
        ? 'Accept film: followed by lowercase letters or digits with single internal hyphens.'
        : 'Accept a positive decimal ID without leading zeros.';
    return schemeRow(
      name,
      'D',
      providerTargets[name],
      sample.raw,
      sample.canonical,
      grammar +
        ' Keep the bytes unchanged. Reject other inputs. Never use as a bare P0 anchor.',
      base,
    );
  });
}

function iidCatalog(root, manifest) {
  const spec = manifest.specs.find(
    (entry) => entry.name === 'intuition-identifier',
  );
  if (
    spec?.version !== '0.1.0' ||
    spec.commit !== '3e593247c0e7cb168b37368937167ed146d3868a'
  )
    throw new Error(
      'Canonical IID pin does not match the vendored registry and vectors',
    );
  const registry = json(path.join(root, 'scripts/iid-registry-0.1.0.json'));
  const vectors = json(
    path.join(root, 'scripts/iid-normalization-vectors-0.1.0.json'),
  );
  const canonicalBase = `${spec.repository}/blob/${spec.commit}`;
  const canonical = canonicalRows(
    registry,
    vectors,
    spec.version,
    canonicalBase,
  );
  const { directory, metadata } = installedPackage(root, manifest, 'iid-spec');
  const runtime = loadPackageEntry(root, manifest, 'iid');
  const read = (kind) => conformanceFile(directory, kind, metadata.version);
  const packageBase = `${manifest.source.repository}/blob/${manifest.source.commit}/packages/iid-spec`;
  const providers = providerRows(
    registry,
    read('schemes'),
    read('canonicalization'),
    read('validation'),
    runtime,
    packageBase,
  );
  return [
    ...catalogHead('Canonical schemes'),
    ...canonical,
    '',
    ...catalogHead('Package-only schemes'),
    ...providers,
  ].join('\n');
}

function predicateTable(exports) {
  const {
    PREDICATE_RECORDS: records,
    PREDICATE_IDS: ids,
    PREDICATE_ID_TO_KEY: byId,
    PREDICATE_STATUSES: statuses,
  } = exports;
  if (
    !Array.isArray(records) ||
    !records.length ||
    !object(ids) ||
    !object(byId) ||
    !object(statuses)
  )
    throw new Error('Unsupported predicate catalog schema');
  const keys = records.map((record) => record.key);
  sameKeys(Object.keys(ids), keys, 'predicate ID');
  sameKeys(keys, Object.keys(statuses), 'predicate status');
  sameKeys(Object.keys(byId), Object.values(ids), 'predicate reverse ID');
  const byteIds = new Set();
  const rows = records.map(({ key, name, status }) => {
    const id = ids[key];
    if (
      !nonempty(key) ||
      !nonempty(name) ||
      typeof id !== 'string' ||
      !/^0x[\da-f]{64}$/i.test(id) ||
      byId[id] !== key ||
      !['enshrined', 'proposed'].includes(status) ||
      statuses[key] !== status
    )
      throw new Error(`Invalid predicate ID, label or status for ${key}`);
    const bytes = id.toLowerCase();
    if (byteIds.has(bytes))
      throw new Error('Duplicate predicate atom ID: ' + id);
    byteIds.add(bytes);
    return [
      key,
      `| ${literal(key)} | ${cell(name)} | ${status} | ${literal(id)} |`,
    ];
  });
  rows.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return [
    '| Key | Label | Status | Atom ID |',
    '| --- | --- | --- | --- |',
    ...rows.map(([, row]) => row),
  ].join('\n');
}

module.exports = { loadPackageEntry, iidCatalog, predicateTable };
