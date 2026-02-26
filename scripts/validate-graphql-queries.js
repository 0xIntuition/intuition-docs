#!/usr/bin/env node
'use strict';

/**
 * GraphQL Query Validator for Intuition Docs
 *
 * Validates GraphQL queries in documentation files against live schema
 * introspection snapshots. Catches field-level bugs (wrong names, missing
 * selection sets) without executing queries.
 *
 * Usage:
 *   node scripts/validate-graphql-queries.js                    # validate all docs
 *   node scripts/validate-graphql-queries.js file1.md file2.md  # validate specific files
 *   node scripts/validate-graphql-queries.js --update-schema    # fetch fresh schemas
 *   node scripts/validate-graphql-queries.js --dry-run          # list extracted queries
 *   node scripts/validate-graphql-queries.js --endpoint mainnet # single endpoint
 *
 * Zero external dependencies — uses only Node.js built-ins.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs', '_data');
const SCRIPTS_DIR = __dirname;

// Directories to scan for GraphQL queries
const SCAN_DIRS = [
  path.join(DOCS_DIR, 'graphql-api'),
  path.join(DOCS_DIR, 'tutorials', 'queries'),
];

// Also scan the playground component for QUERY_EXAMPLES
const PLAYGROUND_FILE = path.join(
  ROOT,
  'src',
  'components',
  'GraphQLPlayground.tsx'
);

const ENDPOINTS = {
  mainnet: 'https://mainnet.intuition.sh/v1/graphql',
  testnet: 'https://testnet.intuition.sh/v1/graphql',
};

const SCHEMA_FILES = {
  mainnet: path.join(SCRIPTS_DIR, 'graphql-schema-mainnet.json'),
  testnet: path.join(SCRIPTS_DIR, 'graphql-schema-testnet.json'),
};

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = {
    updateSchema: false,
    dryRun: false,
    endpoint: null, // null = both
    files: [],
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--update-schema') {
      args.updateSchema = true;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--endpoint') {
      i++;
      if (!argv[i] || !ENDPOINTS[argv[i]]) {
        console.error(
          `Error: --endpoint requires "mainnet" or "testnet", got "${argv[i]}"`
        );
        process.exit(1);
      }
      args.endpoint = argv[i];
    } else if (arg === '--validate') {
      // --validate is implicit when not --update-schema-only; kept for compat
    } else if (!arg.startsWith('-')) {
      args.files.push(arg);
    } else {
      console.error(`Unknown flag: ${arg}`);
      process.exit(1);
    }
  }

  return args;
}

// ---------------------------------------------------------------------------
// Phase 1 — Schema introspection + type map
// ---------------------------------------------------------------------------

const INTROSPECTION_QUERY = `
  query IntrospectionQuery {
    __schema {
      queryType { name }
      mutationType { name }
      subscriptionType { name }
      types {
        kind
        name
        fields {
          name
          type {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * HTTP POST with JSON body, returns parsed JSON response.
 * Uses only Node.js built-ins (https/http).
 */
function httpPost(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const mod = url.startsWith('https') ? https : require('http');
    const parsed = new URL(url);

    const req = mod.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(
              new Error(
                `Failed to parse response from ${url}: ${e.message}\nBody: ${body.slice(0, 500)}`
              )
            );
          }
        });
      }
    );

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * Unwrap NON_NULL / LIST wrappers to get the concrete type name and kind.
 */
function unwrapType(typeRef) {
  if (!typeRef) return { name: null, kind: 'SCALAR' };
  if (typeRef.kind === 'NON_NULL' || typeRef.kind === 'LIST') {
    return unwrapType(typeRef.ofType);
  }
  return { name: typeRef.name, kind: typeRef.kind };
}

/**
 * Build a type map from introspection result:
 * { typeName: { fieldName: { type: string, kind: string } } }
 */
function buildTypeMap(introspectionResult) {
  const schema = introspectionResult.data.__schema;
  const typeMap = {};
  const rootTypes = {};

  if (schema.queryType) rootTypes.query = schema.queryType.name;
  if (schema.mutationType) rootTypes.mutation = schema.mutationType.name;
  if (schema.subscriptionType)
    rootTypes.subscription = schema.subscriptionType.name;

  for (const type of schema.types) {
    // Skip introspection types
    if (type.name.startsWith('__')) continue;
    // Only map types that have fields (OBJECT, INTERFACE)
    if (!type.fields) continue;

    const fields = {};
    for (const field of type.fields) {
      const { name: typeName, kind } = unwrapType(field.type);
      fields[field.name] = { type: typeName, kind };
    }
    typeMap[type.name] = fields;
  }

  return { typeMap, rootTypes };
}

/**
 * Introspect an endpoint and return a type map.
 */
async function introspectEndpoint(name, url) {
  console.log(`  Introspecting ${name}: ${url}`);
  const result = await httpPost(url, { query: INTROSPECTION_QUERY });

  if (result.errors) {
    throw new Error(
      `Introspection failed for ${name}: ${JSON.stringify(result.errors)}`
    );
  }

  return buildTypeMap(result);
}

/**
 * Save a schema snapshot to disk.
 */
function saveSchema(name, schema) {
  const filePath = SCHEMA_FILES[name];
  fs.writeFileSync(filePath, JSON.stringify(schema, null, 2) + '\n');
  console.log(`  Saved ${name} schema → ${path.relative(ROOT, filePath)}`);
}

/**
 * Load a schema snapshot from disk.
 */
function loadSchema(name) {
  const filePath = SCHEMA_FILES[name];
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Compare two schemas and report divergences.
 */
function compareSchemas(mainnetSchema, testnetSchema) {
  const divergences = [];

  const mainnetTypes = new Set(Object.keys(mainnetSchema.typeMap));
  const testnetTypes = new Set(Object.keys(testnetSchema.typeMap));

  // Types only in one endpoint
  for (const t of mainnetTypes) {
    if (!testnetTypes.has(t)) {
      divergences.push(`Type "${t}" exists on mainnet but not testnet`);
    }
  }
  for (const t of testnetTypes) {
    if (!mainnetTypes.has(t)) {
      divergences.push(`Type "${t}" exists on testnet but not mainnet`);
    }
  }

  // Field-level divergences in shared types
  for (const t of mainnetTypes) {
    if (!testnetTypes.has(t)) continue;
    const mainFields = Object.keys(mainnetSchema.typeMap[t]);
    const testFields = new Set(Object.keys(testnetSchema.typeMap[t]));

    for (const f of mainFields) {
      if (!testFields.has(f)) {
        divergences.push(
          `Field "${t}.${f}" exists on mainnet but not testnet`
        );
      }
    }
    for (const f of testFields) {
      if (!mainFields.includes(f)) {
        divergences.push(
          `Field "${t}.${f}" exists on testnet but not mainnet`
        );
      }
    }
  }

  return divergences;
}

// ---------------------------------------------------------------------------
// Phase 2 — Query extraction
// ---------------------------------------------------------------------------

function walkDir(dir) {
  if (!fs.existsSync(dir)) return [];
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkDir(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

/**
 * Extract GraphQL queries from a playground export pattern:
 *   export const fooQueries = [{ query: `...` }]
 */
function extractPlaygroundQueries(content, filePath) {
  const queries = [];
  const exportMatch = content.match(
    /export\s+const\s+\w+(?:Queries?|queries?)\s*(?::\s*[^=]+)?\s*=\s*\[/
  );
  if (!exportMatch) return queries;

  // Find all query: `...` patterns within the export
  const queryRegex = /(?:title:\s*['"]([^'"]*)['"]\s*,\s*)?query:\s*`([\s\S]*?)`/g;
  let match;
  while ((match = queryRegex.exec(content)) !== null) {
    const title = match[1] || 'Untitled';
    const queryText = match[2].trim();
    if (queryText) {
      // Find the line number of this query
      const lineNum =
        content.slice(0, match.index).split('\n').length;
      queries.push({
        source: 'playground',
        title,
        query: queryText,
        file: filePath,
        line: lineNum,
      });
    }
  }

  return queries;
}

/**
 * Check if a code block contains a complete GraphQL operation (not a fragment).
 * Partial fragments like `atoms(order_by: ...)` without operation wrappers
 * should be skipped — they're illustrative, not executable.
 */
function isCompleteOperation(queryText) {
  // Strip leading comments
  const stripped = queryText.replace(/^\s*(#[^\n]*\n\s*)*/g, '').trim();
  // Must start with an operation keyword or shorthand { ... }
  return /^(query|mutation|subscription)\b/i.test(stripped) ||
    stripped.startsWith('{');
}

/**
 * Extract GraphQL queries from ```graphql code blocks.
 */
function extractCodeBlockQueries(content, filePath) {
  const queries = [];
  const blockRegex = /```graphql\s*\n([\s\S]*?)```/g;
  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    const queryText = match[1].trim();
    if (queryText && isCompleteOperation(queryText)) {
      const lineNum =
        content.slice(0, match.index).split('\n').length;
      queries.push({
        source: 'codeblock',
        title: `Code block at line ${lineNum}`,
        query: queryText,
        file: filePath,
        line: lineNum,
      });
    }
  }

  return queries;
}

/**
 * Extract QUERY_EXAMPLES from GraphQLPlayground.tsx.
 */
function extractPlaygroundComponentQueries(filePath) {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, 'utf8');
  const queries = [];

  // Same backtick query pattern
  const queryRegex = /title:\s*['"]([^'"]*)['"]\s*,\s*\n\s*query:\s*`([\s\S]*?)`/g;
  let match;
  while ((match = queryRegex.exec(content)) !== null) {
    const title = match[1];
    const queryText = match[2].trim();
    if (queryText) {
      const lineNum =
        content.slice(0, match.index).split('\n').length;
      queries.push({
        source: 'component',
        title,
        query: queryText,
        file: filePath,
        line: lineNum,
      });
    }
  }

  return queries;
}

/**
 * Collect all queries from the docs codebase.
 * If fileArgs is provided, only scan those files.
 */
function collectQueries(fileArgs) {
  let files;

  if (fileArgs && fileArgs.length > 0) {
    files = fileArgs.map((f) => path.resolve(f));
  } else {
    files = [];
    for (const dir of SCAN_DIRS) {
      files = files.concat(walkDir(dir));
    }
  }

  // Filter to .md/.mdx files
  files = files.filter((f) => /\.(md|mdx)$/.test(f));

  const allQueries = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relPath = path.relative(ROOT, file);

    // Try playground exports first
    const pgQueries = extractPlaygroundQueries(content, relPath);
    allQueries.push(...pgQueries);

    // Then inline code blocks
    const cbQueries = extractCodeBlockQueries(content, relPath);
    allQueries.push(...cbQueries);
  }

  // Always scan the playground component (unless running on specific files)
  if (!fileArgs || fileArgs.length === 0) {
    const componentQueries =
      extractPlaygroundComponentQueries(PLAYGROUND_FILE);
    allQueries.push(
      ...componentQueries.map((q) => ({
        ...q,
        file: path.relative(ROOT, q.file),
      }))
    );
  }

  return allQueries;
}

// ---------------------------------------------------------------------------
// Phase 3 — Minimal GraphQL parser + validation
// ---------------------------------------------------------------------------

/**
 * Tokenizer: produces tokens from a GraphQL query string.
 * Tokens: NAME, LBRACE, RBRACE, LPAREN, RPAREN, COLON, SPREAD, BANG,
 *         DOLLAR, AT, LBRACKET, RBRACKET, STRING, NUMBER, EOF
 */
function tokenize(query) {
  const tokens = [];
  let i = 0;

  while (i < query.length) {
    const ch = query[i];

    // Whitespace / commas — skip
    if (/[\s,]/.test(ch)) {
      i++;
      continue;
    }

    // Comments — skip to end of line
    if (ch === '#') {
      while (i < query.length && query[i] !== '\n') i++;
      continue;
    }

    // Single-char tokens
    if (ch === '{') {
      tokens.push({ type: 'LBRACE', value: '{' });
      i++;
      continue;
    }
    if (ch === '}') {
      tokens.push({ type: 'RBRACE', value: '}' });
      i++;
      continue;
    }
    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }
    if (ch === ':') {
      tokens.push({ type: 'COLON', value: ':' });
      i++;
      continue;
    }
    if (ch === '!') {
      tokens.push({ type: 'BANG', value: '!' });
      i++;
      continue;
    }
    if (ch === '$') {
      tokens.push({ type: 'DOLLAR', value: '$' });
      i++;
      continue;
    }
    if (ch === '@') {
      tokens.push({ type: 'AT', value: '@' });
      i++;
      continue;
    }
    if (ch === '[') {
      tokens.push({ type: 'LBRACKET', value: '[' });
      i++;
      continue;
    }
    if (ch === ']') {
      tokens.push({ type: 'RBRACKET', value: ']' });
      i++;
      continue;
    }
    if (ch === '=') {
      tokens.push({ type: 'EQUALS', value: '=' });
      i++;
      continue;
    }
    if (ch === '|') {
      tokens.push({ type: 'PIPE', value: '|' });
      i++;
      continue;
    }

    // Spread operator
    if (ch === '.' && query[i + 1] === '.' && query[i + 2] === '.') {
      tokens.push({ type: 'SPREAD', value: '...' });
      i += 3;
      continue;
    }

    // String literals (skip over them)
    if (ch === '"') {
      let j = i + 1;
      while (j < query.length && query[j] !== '"') {
        if (query[j] === '\\') j++; // skip escaped char
        j++;
      }
      tokens.push({
        type: 'STRING',
        value: query.slice(i + 1, j),
      });
      i = j + 1;
      continue;
    }

    // Numbers
    if (/[0-9-]/.test(ch)) {
      let j = i;
      if (ch === '-') j++;
      while (j < query.length && /[0-9.]/.test(query[j])) j++;
      tokens.push({
        type: 'NUMBER',
        value: query.slice(i, j),
      });
      i = j;
      continue;
    }

    // Names (identifiers, keywords)
    if (/[a-zA-Z_]/.test(ch)) {
      let j = i;
      while (j < query.length && /[a-zA-Z0-9_]/.test(query[j])) j++;
      tokens.push({
        type: 'NAME',
        value: query.slice(i, j),
      });
      i = j;
      continue;
    }

    // Unknown char — skip
    i++;
  }

  tokens.push({ type: 'EOF', value: '' });
  return tokens;
}

/**
 * Parser: walks tokens and validates fields against the type map.
 */
class QueryValidator {
  constructor(typeMap, rootTypes) {
    this.typeMap = typeMap;
    this.rootTypes = rootTypes;
    this.errors = [];
    this.tokens = [];
    this.pos = 0;
  }

  peek() {
    return this.tokens[this.pos] || { type: 'EOF', value: '' };
  }

  advance() {
    const tok = this.tokens[this.pos];
    this.pos++;
    return tok;
  }

  expect(type) {
    const tok = this.peek();
    if (tok.type !== type) {
      return null;
    }
    return this.advance();
  }

  /**
   * Validate a query string against the type map.
   * Returns an array of error objects.
   */
  validate(queryString, context) {
    this.errors = [];
    this.tokens = tokenize(queryString);
    this.pos = 0;

    // Parse one or more operation definitions
    while (this.peek().type !== 'EOF') {
      this.parseOperation(context);
    }

    return this.errors;
  }

  parseOperation(context) {
    const tok = this.peek();

    // Shorthand query: starts with { directly
    if (tok.type === 'LBRACE') {
      const rootType = this.rootTypes.query;
      if (!rootType || !this.typeMap[rootType]) {
        this.errors.push({
          ...context,
          field: null,
          parentType: null,
          message: 'No query root type found in schema',
        });
        this.skipBlock();
        return;
      }
      this.parseSelectionSet(rootType, context);
      return;
    }

    // Named operation: query/mutation/subscription Name(...) { ... }
    if (tok.type === 'NAME') {
      const opType = tok.value.toLowerCase();
      if (!['query', 'mutation', 'subscription'].includes(opType)) {
        // Could be a fragment definition — skip
        this.skipUntilBrace();
        if (this.peek().type === 'LBRACE') {
          this.skipBlock();
        }
        return;
      }

      this.advance(); // consume operation keyword

      // Optional operation name
      if (this.peek().type === 'NAME') {
        this.advance();
      }

      // Optional variable definitions
      if (this.peek().type === 'LPAREN') {
        this.skipParens();
      }

      // Optional directives
      while (this.peek().type === 'AT') {
        this.advance(); // @
        if (this.peek().type === 'NAME') this.advance(); // directive name
        if (this.peek().type === 'LPAREN') this.skipParens();
      }

      const rootType = this.rootTypes[opType];
      if (!rootType || !this.typeMap[rootType]) {
        this.errors.push({
          ...context,
          field: null,
          parentType: null,
          message: `No ${opType} root type found in schema`,
        });
        if (this.peek().type === 'LBRACE') this.skipBlock();
        return;
      }

      if (this.peek().type === 'LBRACE') {
        this.parseSelectionSet(rootType, context);
      }
      return;
    }

    // Skip anything else
    this.advance();
  }

  parseSelectionSet(parentTypeName, context) {
    if (!this.expect('LBRACE')) return;

    const parentFields = this.typeMap[parentTypeName];

    while (this.peek().type !== 'RBRACE' && this.peek().type !== 'EOF') {
      // Inline fragment: ... on TypeName { ... }
      if (this.peek().type === 'SPREAD') {
        this.advance(); // ...
        if (this.peek().type === 'NAME' && this.peek().value === 'on') {
          this.advance(); // on
          const typeName = this.advance(); // TypeName
          if (typeName && typeName.type === 'NAME') {
            if (!this.typeMap[typeName.value]) {
              this.errors.push({
                ...context,
                field: typeName.value,
                parentType: parentTypeName,
                message: `Inline fragment type "${typeName.value}" not found in schema`,
              });
              if (this.peek().type === 'LBRACE') this.skipBlock();
            } else if (this.peek().type === 'LBRACE') {
              this.parseSelectionSet(typeName.value, context);
            }
          }
        } else if (this.peek().type === 'NAME') {
          // Fragment spread: ...FragmentName — skip
          this.advance();
        }
        continue;
      }

      // Field: name or alias: name
      if (this.peek().type === 'NAME') {
        let fieldName = this.advance().value;

        // Check for alias: if next is COLON, then fieldName is alias
        if (this.peek().type === 'COLON') {
          this.advance(); // consume :
          if (this.peek().type === 'NAME') {
            fieldName = this.advance().value; // actual field name
          }
        }

        // Skip arguments
        if (this.peek().type === 'LPAREN') {
          this.skipParens();
        }

        // Skip directives
        while (this.peek().type === 'AT') {
          this.advance(); // @
          if (this.peek().type === 'NAME') this.advance();
          if (this.peek().type === 'LPAREN') this.skipParens();
        }

        // Special fields that are always valid
        // __typename is valid on any type, __schema/__type on query root
        if (fieldName === '__typename' || fieldName === '__schema' || fieldName === '__type') {
          if (this.peek().type === 'LBRACE') this.skipBlock();
          continue;
        }

        // Validate field exists on parent type
        if (!parentFields) {
          this.errors.push({
            ...context,
            field: fieldName,
            parentType: parentTypeName,
            message: `Cannot look up field "${fieldName}" — type "${parentTypeName}" not found in schema`,
          });
          if (this.peek().type === 'LBRACE') this.skipBlock();
          continue;
        }

        const fieldDef = parentFields[fieldName];
        if (!fieldDef) {
          this.errors.push({
            ...context,
            field: fieldName,
            parentType: parentTypeName,
            message: `Field "${fieldName}" does not exist on type "${parentTypeName}"`,
          });
          if (this.peek().type === 'LBRACE') this.skipBlock();
          continue;
        }

        // If field returns an OBJECT/INTERFACE, it needs a selection set
        const hasSelectionSet = this.peek().type === 'LBRACE';
        if (
          (fieldDef.kind === 'OBJECT' || fieldDef.kind === 'INTERFACE') &&
          !hasSelectionSet
        ) {
          this.errors.push({
            ...context,
            field: fieldName,
            parentType: parentTypeName,
            message: `Field "${fieldName}" returns type "${fieldDef.type}" (${fieldDef.kind}) but has no selection set { ... }`,
          });
          continue;
        }

        // Recurse into selection set
        if (hasSelectionSet && fieldDef.type && this.typeMap[fieldDef.type]) {
          this.parseSelectionSet(fieldDef.type, context);
        } else if (hasSelectionSet) {
          // Has a selection set but type not in map — skip it
          this.skipBlock();
        }

        continue;
      }

      // Skip unknown tokens
      this.advance();
    }

    this.expect('RBRACE');
  }

  skipParens() {
    if (!this.expect('LPAREN')) return;
    let depth = 1;
    while (depth > 0 && this.peek().type !== 'EOF') {
      const tok = this.advance();
      if (tok.type === 'LPAREN') depth++;
      if (tok.type === 'RPAREN') depth--;
    }
  }

  skipBlock() {
    if (!this.expect('LBRACE')) return;
    let depth = 1;
    while (depth > 0 && this.peek().type !== 'EOF') {
      const tok = this.advance();
      if (tok.type === 'LBRACE') depth++;
      if (tok.type === 'RBRACE') depth--;
    }
  }

  skipUntilBrace() {
    while (
      this.peek().type !== 'LBRACE' &&
      this.peek().type !== 'EOF'
    ) {
      this.advance();
    }
  }
}

// ---------------------------------------------------------------------------
// Phase 4 — Reporting + main
// ---------------------------------------------------------------------------

/**
 * Validate all queries against a schema, return errors.
 */
function validateQueries(queries, schema, endpointName) {
  const validator = new QueryValidator(schema.typeMap, schema.rootTypes);
  const allErrors = [];

  for (const q of queries) {
    const context = {
      file: q.file,
      line: q.line,
      queryTitle: q.title,
    };

    const errors = validator.validate(q.query, context);
    for (const err of errors) {
      allErrors.push({ ...err, endpoint: endpointName });
    }
  }

  return allErrors;
}

function formatError(err) {
  const location = `${err.file}:${err.line}`;
  const query = err.queryTitle ? ` [${err.queryTitle}]` : '';
  const endpoint = err.endpoint ? ` (${err.endpoint})` : '';
  return `  ${location}${query}${endpoint}\n    → ${err.message}`;
}

async function main() {
  const args = parseArgs(process.argv);
  const endpointsToCheck = args.endpoint
    ? [args.endpoint]
    : ['mainnet', 'testnet'];

  // --update-schema: introspect live endpoints and save snapshots
  if (args.updateSchema) {
    console.log('Fetching schema snapshots...');
    const schemas = {};

    for (const ep of endpointsToCheck) {
      try {
        schemas[ep] = await introspectEndpoint(ep, ENDPOINTS[ep]);
        saveSchema(ep, schemas[ep]);
      } catch (err) {
        console.error(`  Failed to introspect ${ep}: ${err.message}`);
        process.exit(1);
      }
    }

    // Compare schemas if we have both
    if (schemas.mainnet && schemas.testnet) {
      const divergences = compareSchemas(schemas.mainnet, schemas.testnet);
      if (divergences.length > 0) {
        console.log(`\nSchema divergences (${divergences.length}):`);
        for (const d of divergences) {
          console.log(`  ⚠ ${d}`);
        }
      } else {
        console.log('\nSchemas are in sync between mainnet and testnet.');
      }
    }

    console.log('\nSchema snapshots updated.');

    // If only --update-schema (no --validate, no file args), stop here
    if (args.files.length === 0 && !args.dryRun) {
      return;
    }
  }

  // Load schema snapshots
  const schemas = {};
  for (const ep of endpointsToCheck) {
    schemas[ep] = loadSchema(ep);
    if (!schemas[ep]) {
      console.error(
        `No schema snapshot found for ${ep}. Run with --update-schema first.`
      );
      process.exit(1);
    }
  }

  // Collect queries
  const queries = collectQueries(
    args.files.length > 0 ? args.files : null
  );

  if (queries.length === 0) {
    console.log('No GraphQL queries found in the scanned files.');
    return;
  }

  // --dry-run: just list extracted queries
  if (args.dryRun) {
    console.log(`Found ${queries.length} GraphQL queries:\n`);
    for (const q of queries) {
      console.log(`  ${q.file}:${q.line} [${q.source}] ${q.title}`);
      // Show first line of query
      const firstLine = q.query.split('\n')[0].trim();
      console.log(`    ${firstLine}`);
      console.log();
    }
    return;
  }

  // Validate
  console.log(
    `Validating ${queries.length} queries against ${endpointsToCheck.join(' + ')} schemas...\n`
  );

  let mainnetErrors = [];
  let testnetErrors = [];

  for (const ep of endpointsToCheck) {
    const errors = validateQueries(queries, schemas[ep], ep);
    if (ep === 'mainnet') mainnetErrors = errors;
    else testnetErrors = errors;
  }

  // Report
  const hasMainnetErrors = mainnetErrors.length > 0;
  const hasTestnetErrors = testnetErrors.length > 0;

  if (hasMainnetErrors) {
    console.log(
      `❌ ${mainnetErrors.length} mainnet error(s):\n`
    );
    for (const err of mainnetErrors) {
      console.log(formatError(err));
    }
    console.log();
  }

  if (hasTestnetErrors) {
    console.log(
      `⚠ ${testnetErrors.length} testnet-only warning(s):\n`
    );
    for (const err of testnetErrors) {
      console.log(formatError(err));
    }
    console.log();
  }

  if (!hasMainnetErrors && !hasTestnetErrors) {
    console.log(
      `✓ All ${queries.length} queries valid against ${endpointsToCheck.join(' + ')} schemas.`
    );
  }

  // Exit code: mainnet errors = failure, testnet-only = success with warnings
  if (hasMainnetErrors) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
