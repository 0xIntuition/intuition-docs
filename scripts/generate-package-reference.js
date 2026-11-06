#!/usr/bin/env node
// Generate release API reference from an explicitly selected packages checkout.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');
const prettier = require('prettier');
const {
  createTypeReference,
  isExported,
} = require('./package-reference-types');

const summaries = {
  baseTrustBridgeToIntuitionEnvelope:
    'Encode approval and Base-to-Intuition TRUST bridge steps using supplied allowance and fee context, without RPC or signing.',
  intuitionTrustBridgeToBaseEnvelope:
    'Encode Intuition-to-Base TRUST bridge steps using supplied fee context, without RPC or signing.',
  baseERC20BridgeToIntuitionEnvelope:
    'Encode ERC-20 approval and bridge steps from Base using supplied allowance and fee context.',
  intuitionERC20BridgeToBaseEnvelope:
    'Encode ERC-20 approval and bridge steps from Intuition using supplied allowance and fee context.',
  multiVaultDepositEnvelope:
    'Build a JSON-serializable deposit envelope using caller-supplied vault, fee, and preview context. Missing required context throws.',
  multiVaultRedeemEnvelope:
    'Build a JSON-serializable redemption envelope using caller-supplied balance, fee, and preview context.',
  multiVaultCreateAndSeedEnvelope:
    'Build ordered atom, triple, and seed-deposit steps from explicit creation costs and read context.',
  trustBondingClaimEnvelope:
    'Build reward-claim steps from supplied epoch and claim state, without fetching or submitting.',
  trustBondingLockEnvelope:
    'Build the applicable lock action from supplied lock state and time, without fetching or submitting.',
  trustBondingClaimAndRestakeEnvelope:
    'Build ordered claim and restake steps from supplied reward and target-vault context.',
  bigintToDecimalString:
    'Convert a bigint to its decimal string representation for a JSON action envelope.',
  validateAgentActionStep:
    'Validate a step target, calldata, and decimal value. Throws for invalid input; does not simulate the transaction.',
  createAgentActionStep:
    'Resolve a supported target intent and construct a validated action step.',
  validateAgentActionEnvelope:
    'Validate envelope schema, metadata, unique step IDs, and individual steps. Does not authorize or execute them.',
  createAgentActionEnvelope:
    'Construct and validate a JSON-serializable envelope of ordered transaction steps.',
  resolveAgentActionTarget:
    'Resolve a chain and contract intent through the deployment catalog. Unsupported or withheld targets throw.',
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
    'Prepare ordered atom creation, triple creation, and seed-deposit steps with their quotes and total value. Requires WriteConfig, but does not submit the plan.',
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
  const check = process.argv.includes('--check');
  function write(file, content) {
    if (check) {
      if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content)
        throw new Error(
          `Generated reference drift: ${path.relative(path.resolve(__dirname, '..'), file)}`,
        );
    } else fs.writeFileSync(file, content);
  }
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
  const selected = require('../static/intuition-release.json');
  if (commit !== selected.source.commit)
    throw new Error(
      'Source does not match manifest; update the release pin before regeneration',
    );
  const output = path.resolve(__dirname, '../docs/_data/build/sdk-reference');
  fs.mkdirSync(output, { recursive: true });
  const manifest = {
    schemaVersion: selected.schemaVersion,
    status: selected.status,
    registryPublicationVerified: selected.registryPublicationVerified,
    registryVerifiedAt: selected.registryVerifiedAt,
    source: { repository: 'https://github.com/0xIntuition/packages', commit },
    packages: [],
  };
  for (const dir of fs.readdirSync(path.join(root, 'packages')).sort()) {
    const file = path.join(root, 'packages', dir, 'package.json');
    if (!fs.existsSync(file)) continue;
    const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (pkg.private) continue;
    const recorded = selected.packages.find((entry) => entry.name === pkg.name);
    if (
      selected.registryPublicationVerified &&
      (recorded?.version !== pkg.version ||
        recorded?.registry?.gitHead !== commit)
    ) {
      throw new Error(
        `Refresh publication evidence before documenting ${pkg.name}`,
      );
    }
    manifest.packages.push({
      name: pkg.name,
      version: pkg.version,
      entrypoints: Object.keys(pkg.exports || {}),
      peers: pkg.peerDependencies || {},
      engines: pkg.engines || {},
      source: `https://github.com/0xIntuition/packages/tree/${commit}/packages/${dir}`,
      ...(recorded?.registry ? { registry: recorded.registry } : {}),
    });
  }
  write(
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
    ['actions/plans/base.ts', 'Bridge action envelopes', 'actions'],
    ['actions/plans/multivault.ts', 'MultiVault action envelopes', 'actions'],
    [
      'actions/plans/dynamic-fee-curve.ts',
      'Dynamic-fee action envelopes',
      'actions',
    ],
    ['actions/plans/fee-proxy.ts', 'FeeProxy action envelopes', 'actions'],
    [
      'actions/plans/trust-bonding.ts',
      'TrustBonding action envelopes',
      'actions',
    ],
    [
      'actions/schema/create-agent-action-envelope.ts',
      'Create and validate action envelopes',
      'actions',
    ],
    [
      'actions/schema/resolve-agent-action-target.ts',
      'Resolve action targets',
      'actions',
    ],
    ['actions/schema/types.ts', 'Action envelope types', 'actions'],
  ];
  function publicModules(relative) {
    const source = fs.readFileSync(
      path.join(root, 'packages/sdk/src', relative),
      'utf8',
    );
    return [...source.matchAll(/export \* from ['"]\.\/([^'"]+)['"]/g)].flatMap(
      (match) => {
        const base = path.posix.join(path.posix.dirname(relative), match[1]);
        return fs.existsSync(path.join(root, 'packages/sdk/src', base + '.ts'))
          ? [base + '.ts']
          : publicModules(base + '/index.ts');
      },
    );
  }
  const indexedActions = publicModules('actions/index.ts');
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
  const typeReference = createTypeReference(root, commit, sections);
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
      relative === 'api/index.ts'
        ? 'api'
        : relative
            .replace(/^actions\//, '')
            .replace(/\.ts$/, '')
            .replaceAll('/', '-');
    const link = `https://github.com/0xIntuition/packages/blob/${commit}/${sourcePath}`;
    let md = `---\ntitle: ${JSON.stringify(title)}\nslug: /build/sdk-reference/${slug}\n---\n\n`;
    md += `Generated from the published SDK **${sdkVersion}** source. See [release compatibility](../compatibility.md) before installing or connecting to a deployment. Regenerate with \`node scripts/generate-package-reference.js /path/to/packages\`.\n\nImport from \`@0xintuition/sdk/${subpath}\`. [Implementation and internal helpers](${link}).\n\n`;
    md +=
      'Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. Envelope builders on the action-envelope pages use caller-supplied read context and perform no RPC reads or signing. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.\n\n';
    const types = [];
    for (const node of ast.statements) {
      if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
        types.push(node);
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
          node.type || typeReference.returnType(relative, name),
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
        types.push(node);
      }
    }
    const constants = ast.statements.filter(
      (node) => ts.isVariableStatement(node) && isExported(node),
    );
    if (constants.length) {
      md +=
        '## Constants\n\n```ts\n' +
        constants.map((node) => node.getText(ast)).join('\n') +
        '\n```\n\n';
    }
    md += typeReference.render(relative);
    if (types.length) {
      md +=
        '## Input and result types\n\nExported declarations are public imports from the SDK subpath above. Module-local helper aliases describe accepted shapes but are not public exports.\n\n';
      for (const node of types) {
        md += `### ${node.name.text}\n\n${isExported(node) ? 'Public export.' : 'Module-local helper; not a public export.'}\n\n\`\`\`ts\n${node.getText(ast)}\n\`\`\`\n\n`;
      }
    }
    write(
      path.join(output, slug + '.md'),
      await prettier.format(md, { parser: 'mdx', singleQuote: true }),
    );
  }
  write(
    path.join(output, '_category_.json'),
    JSON.stringify({ label: 'SDK function reference', position: 5 }, null, 2) +
      '\n',
  );
  console.log(
    `${check ? 'Verified' : 'Generated'} ${sections.length} API pages, ${functions} functions, ${manifest.packages.length} package records at ${commit}`,
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
