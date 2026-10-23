const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const isType = (node) =>
  ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node);
const isExported = (node) =>
  node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
const slugFor = (file) =>
  file === 'api/index.ts' ? 'api' : path.basename(file, '.ts');

// Resolve public package imports to the selected source, never the site's v3 SDK.
function createTypeReference(root, commit, sections) {
  const paths = {};
  for (const dir of fs.readdirSync(path.join(root, 'packages'))) {
    const file = path.join(root, 'packages', dir, 'package.json');
    if (!fs.existsSync(file)) continue;
    const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const [entry, target] of Object.entries(pkg.exports || {})) {
      const types = typeof target === 'object' && target.types;
      if (typeof types !== 'string' || !types.startsWith('./dist/')) continue;
      paths[pkg.name + (entry === '.' ? '' : entry.slice(1))] = [
        path.join(
          root,
          'packages',
          dir,
          types.replace('./dist/', 'src/').replace(/\.d\.ts$/, '.ts'),
        ),
      ];
    }
  }
  const files = sections.map(([file]) =>
    path.join(root, 'packages/sdk/src', file),
  );
  const program = ts.createProgram(files, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    paths,
    noEmit: true,
    skipLibCheck: true,
  });
  const checker = program.getTypeChecker();
  const sourceLink = (node) => {
    const source = node.getSourceFile();
    const relative = path
      .relative(root, source.fileName)
      .split(path.sep)
      .join('/');
    const line =
      source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
    return `https://github.com/0xIntuition/packages/blob/${commit}/${relative}#L${line}`;
  };
  const resolve = (identifier) => {
    let symbol = checker.getSymbolAtLocation(identifier);
    if (symbol?.flags & ts.SymbolFlags.Alias)
      symbol = checker.getAliasedSymbol(symbol);
    return symbol?.declarations?.[0];
  };
  const references = (nodes) => {
    const found = new Set();
    const visit = (node) => {
      if (ts.isIdentifier(node)) found.add(node.text);
      ts.forEachChild(node, visit);
    };
    nodes.forEach(visit);
    return found;
  };

  function render(relative) {
    const source = program.getSourceFile(
      path.join(root, 'packages/sdk/src', relative),
    );
    const declarations = source.statements.filter(isType);
    const signatures = source.statements
      .filter((node) => ts.isFunctionDeclaration(node) && isExported(node))
      .flatMap((node) => [
        ...(node.typeParameters || []),
        ...node.parameters,
        ...(node.type ? [node.type] : []),
      ]);
    const used = references([...declarations, ...signatures]);
    const rows = [];
    const external = new Map();
    for (const node of source.statements) {
      if (!ts.isImportDeclaration(node)) continue;
      const imports = node.importClause?.namedBindings;
      if (!imports || !ts.isNamedImports(imports)) continue;
      const origin = node.moduleSpecifier.text;
      for (const entry of imports.elements) {
        if (!used.has(entry.name.text)) continue;
        const name = entry.name.text;
        const imported = entry.propertyName?.text || name;
        const declaration = resolve(entry.name);
        let definition = 'Owned by the external package.';
        if (
          declaration &&
          declaration
            .getSourceFile()
            .fileName.startsWith(path.join(root, 'packages') + path.sep)
        ) {
          const sdkFile = path
            .relative(
              path.join(root, 'packages/sdk/src'),
              declaration.getSourceFile().fileName,
            )
            .split(path.sep)
            .join('/');
          if (
            sections.some(([file]) => file === sdkFile) &&
            isType(declaration) &&
            isExported(declaration)
          ) {
            definition = `[${imported}](./${slugFor(sdkFile)}.md#${declaration.name.text.toLowerCase()})`;
          } else {
            definition = `[Source definition](${sourceLink(declaration)})`;
          }
          if (
            isType(declaration) &&
            /\/(?:curves|periphery)\//.test(
              declaration.getSourceFile().fileName,
            )
          ) {
            external.set(declaration.name.text, declaration);
          }
        } else if (origin.startsWith('@0xintuition/')) {
          throw new Error(
            `Cannot resolve type provenance for ${name} in ${relative}`,
          );
        }
        const publicOrigin = origin.startsWith('.')
          ? '@0xintuition/sdk/actions'
          : origin;
        const binding = imported === name ? imported : `${imported} as ${name}`;
        rows.push(
          `| \`${name}\` | \`import type { ${binding} } from '${publicOrigin}'\` | ${definition} |`,
        );
        // typeof dependencies refer to value exports, not type-only bindings.
        if (!(node.importClause.isTypeOnly || entry.isTypeOnly)) {
          rows[rows.length - 1] = rows[rows.length - 1].replace(
            'import type {',
            'import {',
          );
        }
      }
    }
    // Include nested structures needed to read periphery/curves input contracts.
    for (const declaration of external.values()) {
      const visit = (node) => {
        if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
          const nested = resolve(node.typeName);
          if (
            nested &&
            isType(nested) &&
            /\/(?:curves|periphery)\//.test(nested.getSourceFile().fileName)
          ) {
            external.set(nested.name.text, nested);
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(declaration);
    }
    let md = '';
    if (rows.length) {
      md +=
        '## Imported type provenance\n\nPublic import locations and the definitions used by these signatures and helper types. Value imports appear where a dependency hook uses `typeof`.\n\n';
      md +=
        '| Name in this module | Public import | Definition |\n| --- | --- | --- |\n' +
        rows.join('\n') +
        '\n\n';
    }
    if (external.size) {
      md +=
        '## External input and result structures\n\nThese declarations belong to the named packages, not to the SDK. Nested supporting types retain their owning source links.\n\n';
      for (const [name, declaration] of external) {
        md += `### ${name}\n\n[Source definition](${sourceLink(declaration)})\n\n\`\`\`ts\n${declaration.getText()}\n\`\`\`\n\n`;
      }
    }
    return md;
  }
  return { render };
}

module.exports = { createTypeReference, isExported };
