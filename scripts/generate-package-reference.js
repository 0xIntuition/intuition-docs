#!/usr/bin/env node
// Generate candidate API reference from an explicitly selected packages checkout.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');
const prettier = require('prettier');

const summaries = {
  dynamicFeeCurvePrepareDepositTx:
    'Prepare encoded deposit arguments and minimum shares from a dynamic-fee quote, without submitting a transaction.',

  multivaultGetUserPositionSnapshot:
    'Read an account balance and vault state for one term/curve pair and return its current position snapshot.',
  multivaultPrepareRedeemTx:
    'Combine a redemption quote with arguments and encoded calldata for later wallet submission.',

  getIntuitionApiUrl:
    'Select the built-in local, testnet, or mainnet hosted GraphQL endpoint. This is a pure URL lookup, not a Core REST connection.',
  createIntuitionApiClient:
    'Construct a read client for the hosted GraphQL schema. Its four methods return normalized atom/triple models or null for absent rows, and throw for transport or GraphQL failures.',
  multivaultQuoteDepositPlan:
    'Read current vault and fee state and return a deposit quote, including expected output and the minimum shares to accept. No transaction is sent.',
  multivaultPrepareDepositTx:
    'Combine the deposit quote with encoded arguments and calldata for later wallet submission.',
  multivaultQuoteRedeemPlan:
    'Read the position and current redemption fees to calculate expected assets and the minimum output for redemption.',
  multivaultCreateAndSeedTerm:
    'Prepare ordered atom creation, triple creation, and seed-deposit steps with their quotes and total value. Requires WriteConfig in this candidate, but does not submit the plan.',
  multivaultGetUtilizationAnalyticsBundle:
    'Read protocol and personal utilization over the requested epochs and return an analytics bundle.',
  dynamicFeeCurveGetClaimableAcrossTerms:
    'Read accrued curve claims across the supplied terms and return per-term results and the aggregate claimable amount.',
  portfolioGetIntuitionPositionsSnapshot:
    'Read balances and vault state for the explicitly supplied account and term/curve positions. This does not discover every position held by an account.',
  portfolioGetActionableState:
    'Combine position snapshots with TrustBonding claim state so an application can decide which actions to offer.',
  trustBondingGetRewardsDashboard:
    'Read epoch, utilization, balance, and reward information for the selected account and return a dashboard snapshot.',
  trustBondingGetClaimActionState:
    'Determine whether the selected account can claim rewards and return the reason and claim state for the UI.',
  trustBondingPrepareLockAction:
    'Determine the applicable lock operation and prepare its calldata and value. The result describes the action; it does not request a signature.',
  trustBondingClaimAndRestakePlan:
    'Prepare ordered claim and restake steps using the current account and lock state. Review the plan before executing it.',
  trustBondingGetLockStateSummary:
    'Read the account lock balance, expiry, and related state into a normalized summary.',
  trustBondingGetEpochRewardsTimeline:
    'Read reward information across the requested epoch window and return timeline points for presentation.',
};

async function main() {
  const input = process.argv[2];
  if (!input)
    throw new Error(
      'Usage: node scripts/generate-package-reference.js /path/to/packages',
    );
  const root = path.resolve(input);
  const git = (...args) =>
    execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
  if (
    !/github\.com[:/]0xIntuition\/packages(?:\.git)?$/i.test(
      git('remote', 'get-url', 'origin'),
    )
  )
    throw new Error('Expected 0xIntuition/packages');
  if (git('status', '--porcelain'))
    throw new Error('Reference generation requires a clean source checkout');
  const commit = git('rev-parse', 'HEAD');
  const output = path.resolve(__dirname, '../docs/_data/build/sdk-reference');
  fs.mkdirSync(output, { recursive: true });
  const manifest = {
    schemaVersion: 1,
    status: 'candidate-source',
    registryPublicationVerified: false,
    source: { repository: 'https://github.com/0xIntuition/packages', commit },
    packages: [],
  };
  for (const dir of fs.readdirSync(path.join(root, 'packages')).sort()) {
    const file = path.join(root, 'packages', dir, 'package.json');
    if (!fs.existsSync(file)) continue;
    const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (pkg.private) continue;
    manifest.packages.push({
      name: pkg.name,
      version: pkg.version,
      entrypoints: Object.keys(pkg.exports || {}),
      peers: pkg.peerDependencies || {},
      source: `https://github.com/0xIntuition/packages/tree/${commit}/packages/${dir}`,
    });
  }
  fs.writeFileSync(
    path.resolve(__dirname, '../static/intuition-release.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );
  const sections = [
    ['api/index.ts', 'API client', 'api'],
    ['actions/multivault.ts', 'MultiVault actions', 'actions'],
    ['actions/dynamic-fee-curve.ts', 'Dynamic-fee curve actions', 'actions'],
    ['actions/fee-proxy.ts', 'FeeProxy URI creation', 'actions'],
    [
      'actions/fee-proxy-builders.ts',
      'FeeProxy plans and execution',
      'actions',
    ],
    [
      'actions/fee-proxy-affiliate-profile.ts',
      'FeeProxy affiliate profile',
      'actions',
    ],
    [
      'actions/fee-proxy-claim-refund-if-any.ts',
      'FeeProxy refund preparation',
      'actions',
    ],
    ['actions/trust-bonding.ts', 'TrustBonding actions', 'actions'],
    ['actions/portfolio.ts', 'Portfolio reads', 'actions'],
  ];
  const actionIndex = fs.readFileSync(
    path.join(root, 'packages/sdk/src/actions/index.ts'),
    'utf8',
  );
  const indexedActions = [
    ...actionIndex.matchAll(/export \* from ['"]\.\/([^'"]+)['"]/g),
  ].map((match) => `actions/${match[1]}.ts`);
  const documentedActions = sections
    .map(([file]) => file)
    .filter((file) => file.startsWith('actions/'));
  if (
    indexedActions.some((file) => !documentedActions.includes(file)) ||
    documentedActions.some((file) => !indexedActions.includes(file))
  ) {
    throw new Error(
      'SDK action modules changed; review the reference section map before regenerating',
    );
  }
  const sdkVersion = manifest.packages.find(
    (pkg) => pkg.name === '@0xintuition/sdk',
  ).version;
  let functions = 0;
  for (const [relative, title, subpath] of sections) {
    const sourcePath = `packages/sdk/src/${relative}`;
    const source = fs.readFileSync(path.join(root, sourcePath), 'utf8');
    const ast = ts.createSourceFile(
      relative,
      source,
      ts.ScriptTarget.Latest,
      true,
    );
    const slug =
      relative === 'api/index.ts' ? 'api' : path.basename(relative, '.ts');
    const link = `https://github.com/0xIntuition/packages/blob/${commit}/${sourcePath}`;
    let md = `---\ntitle: ${JSON.stringify(title)}\nslug: /build/sdk-reference/${slug}\n---\n\n`;
    md += `Generated from the upcoming SDK **${sdkVersion}** source. See [release compatibility](../compatibility.md) before installing or connecting to a deployment. Regenerate with \`node scripts/generate-package-reference.js /path/to/packages\`.\n\nImport from \`@0xintuition/sdk/${subpath}\`. [Implementation and internal helpers](${link}).\n\n`;
    md +=
      'Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.\n\n';
    const types = [];
    for (const node of ast.statements) {
      if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
        types.push(node.getText(ast));
        continue;
      }
      if (!node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword))
        continue;
      if (ts.isFunctionDeclaration(node)) {
        functions++;
        const name = node.name.text;
        const line =
          ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1;
        const description = (node.jsDoc || [])
          .map((d) => (typeof d.comment === 'string' ? d.comment : ''))
          .filter(Boolean)
          .join('\n\n');
        md += `## ${name}\n\n${
          description ||
          summaries[name] ||
          (() => {
            throw new Error(`Missing function description: ${name}`);
          })()
        }\n\n`;
        const signatureNode = ts.factory.updateFunctionDeclaration(
          node,
          undefined,
          node.asteriskToken,
          node.name,
          node.typeParameters,
          node.parameters.map((p) =>
            ts.factory.updateParameterDeclaration(
              p,
              p.modifiers,
              p.dotDotDotToken,
              p.name,
              p.initializer
                ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
                : p.questionToken,
              p.type,
              undefined,
            ),
          ),
          node.type,
          undefined,
        );
        const signature = ts
          .createPrinter({ removeComments: true })
          .printNode(ts.EmitHint.Unspecified, signatureNode, ast);
        md += `[Source](${link}#L${line})\n\n\`\`\`ts\n${signature}\n\`\`\`\n\n`;
        for (const doc of node.jsDoc || [])
          for (const tag of doc.tags || []) {
            const comment = typeof tag.comment === 'string' ? tag.comment : '';
            if (tag.tagName.text === 'param')
              md += `- **\`${tag.name?.getText(ast)}\`**: ${comment}\n`;
            else if (['returns', 'throws'].includes(tag.tagName.text))
              md += `- **${tag.tagName.text}**: ${comment}\n`;
          }
        const defaults = node.parameters
          .filter((p) => p.initializer)
          .map(
            (p) => `\`${p.name.getText(ast)} = ${p.initializer.getText(ast)}\``,
          );
        if (defaults.length)
          md += `\nDefaults: ${defaults.join(', ')}. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.\n`;
        md += '\n';
      } else if (
        ts.isTypeAliasDeclaration(node) ||
        ts.isInterfaceDeclaration(node)
      ) {
        types.push(node.getText(ast));
      }
    }
    if (types.length)
      md += `## Input and result types\n\n\`\`\`ts\n${types.join('\n\n')}\n\`\`\`\n`;
    fs.writeFileSync(
      path.join(output, slug + '.md'),
      await prettier.format(md, { parser: 'mdx', singleQuote: true }),
    );
  }
  fs.writeFileSync(
    path.join(output, '_category_.json'),
    JSON.stringify({ label: 'SDK function reference', position: 5 }, null, 2) +
      '\n',
  );
  console.log(
    `Generated ${sections.length} API pages, ${functions} functions, ${manifest.packages.length} package records at ${commit}`,
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
