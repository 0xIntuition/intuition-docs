'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { walkFiles } = require('../docs-tree');
const { readPage } = require('./markdown');
const { validateTemplate } = require('./templates');
const {
  validateLadder,
  validateConcept,
  validateConceptMap,
  validateHowItFits,
  validateIdentifier,
} = require('./concepts');
const {
  PREFIX,
  sameMembers,
  validateSnapshot,
  validatePackage,
  validateChooser,
} = require('./packages');

function validateFirstWrite(root, fail) {
  const ts = require('typescript');
  const src = path.join(root, 'examples/v2/first-write/src');
  const main = path.join(src, 'first-write.ts');
  let uuidCalls = 0;
  for (const file of walkFiles(src).filter((file) => /\.[jt]sx?$/.test(file))) {
    const source = fs.readFileSync(file, 'utf8');
    if (/0x[0-9a-fA-F]{64}/.test(source))
      fail(
        `${path.relative(root, file)}: first-write must derive the atom ID at runtime`,
      );
    if (file !== main) continue;
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    const visit = (node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.expression.getText(ast) === 'crypto' &&
        node.expression.name.text === 'randomUUID' &&
        !node.arguments.length
      )
        uuidCalls++;
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }
  if (uuidCalls !== 1)
    fail('first-write.ts must call crypto.randomUUID() once');
}

const AGENTS = [
  'agents/index',
  'agents/docs-for-agents',
  'agents/skills',
  'agents/cli',
];
function validateAgent(doc, page, fail) {
  if (
    doc.id === AGENTS[0] &&
    !page.prose
      .split(/\r?\n/)
      .includes('An Intuition MCP server is not available yet.')
  )
    fail('agents/index must contain the single MCP notice');
  if (doc.id === AGENTS[1]) {
    // A link's label may show a valid filename even when its target is wrong.
    // Keep bare URL examples as well as actual Markdown link destinations.
    const targets = page.prose.replace(/\[[^\]\n]*\]\(/g, '(');
    const bundles = targets.matchAll(
      /(?:^|[\s(`<"'])(?:https:\/\/docs\.intuition\.systems)?((?:\/docs\/v1)?\/llms(?:-medium|-full)?\.txt)(?=$|[\s)>`"']|[.,;:!?](?:\s|$))/g,
    );
    const urls = new Set(Array.from(bundles, (match) => match[1]));
    if (urls.size !== 6 || !/\.md\b/.test(page.prose))
      fail('document all six literal llms URLs and the per-page .md rule');
  }
  if (
    doc.id === AGENTS[2] &&
    ![page.prose, ...page.fences.map((fence) => fence.code)].some((part) =>
      /(?:^|[\s`])npx skills add 0xintuition\/agent-skills(?=[\s`]|$)/m.test(
        part,
      ),
    )
  )
    fail('missing agent-skills install command');
}

function validatePhase3({
  root,
  docs,
  manifest,
  mismatches,
  templates,
  phase3,
}) {
  const errors = [];
  const issue = (message) => errors.push(message);
  if (!manifest) return ['Phase 3 checks require a release manifest'];
  const json = (name) =>
    JSON.parse(fs.readFileSync(path.join(root, 'scripts', name), 'utf8'));
  const ladder = json('concept-ladder.json');
  const shipped = new Set(docs.map((doc) => doc.route));
  const pkgs = new Map(
    manifest.packages.map((pkg) => [PREFIX + pkg.name.split('/')[1], pkg]),
  );
  let runtime;
  if (templates) {
    const snapshot = json('package-runtime-dependencies.json');
    validateSnapshot(snapshot, manifest, issue);
    runtime = new Map(snapshot.packages.map((pkg) => [pkg.name, pkg]));
    if (
      !sameMembers(
        docs
          .filter((doc) => doc.route.startsWith(PREFIX))
          .map((doc) => doc.route),
        [...pkgs.keys()],
      )
    )
      issue('expected exactly one reference page per manifest package');
  }
  if (phase3) {
    validateLadder(docs, ladder, manifest, issue);
    if (
      !sameMembers(
        docs.filter((doc) => doc.id.startsWith('agents/')).map((doc) => doc.id),
        AGENTS,
      )
    )
      issue('expected the four agent pages');
    if (!shipped.has('/docs/get-started/choose-packages'))
      issue('missing package chooser');
    validateFirstWrite(root, issue);
  }
  const mismatch = mismatches.find((record) => record.id === 'M-1');
  for (const doc of docs) {
    const fail = (message) => issue(`${doc.relativePath}: ${message}`);
    let page;
    try {
      page = readPage(doc);
    } catch (error) {
      fail(error.message);
      continue;
    }
    if (templates) {
      validateTemplate(doc, page, docs, fail);
      if (doc.id.startsWith('concepts/'))
        validateConcept(doc, page, ladder.concepts, shipped, fail);
      const pkg = pkgs.get(doc.route);
      if (pkg)
        validatePackage(
          doc,
          page,
          pkg,
          runtime.get(pkg.name),
          ladder.concepts,
          fail,
        );
    }
    if (doc.id === 'concepts/index')
      validateConceptMap(doc, page, ladder.concepts, fail);
    if (doc.id === 'get-started/how-it-fits') validateHowItFits(page, fail);
    if (phase3) {
      if (doc.id === 'get-started/choose-packages')
        validateChooser(page, manifest, fail);
      validateAgent(doc, page, fail);
      validateIdentifier(doc, page, ladder.identifier, mismatch, fail);
      if (
        doc.id === 'get-started/first-write' &&
        (doc.frontMatter.kind !== 'tutorial' ||
          !page.fences.some(
            (fence) =>
              /^(?:sh|shell|bash|console)\b/.test(fence.info) &&
              /\bnpm (?:i|install)\b[\s\S]*@0xintuition\/primitives@/.test(
                fence.code,
              ),
          ))
      )
        fail('first write must be a tutorial installing primitives');
      if (
        doc.id === 'get-started/quickstart' &&
        doc.frontMatter.kind !== 'tutorial'
      )
        fail('quickstart must be a tutorial');
    }
  }
  return errors;
}

module.exports = { validatePhase3, validateFirstWrite, validateAgent };
