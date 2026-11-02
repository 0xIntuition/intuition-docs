const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { createTypeReference } = require('./package-reference-types');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'reference-provenance-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, text) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), text);
  };
  for (const name of ['sdk', 'periphery', 'curves']) {
    write(
      `packages/${name}/package.json`,
      JSON.stringify({
        name: `@0xintuition/${name}`,
        exports: { '.': { types: './dist/index.d.ts' } },
      }),
    );
  }
  write(
    'packages/periphery/src/index.ts',
    "export type { FeeGuard } from './types';",
  );
  write(
    'packages/periphery/src/types.ts',
    'export type FeeGuard = { maxFeeBps: bigint; maxFixedFee: bigint };',
  );
  write(
    'packages/curves/src/index.ts',
    "export type { DynamicFeeConfig } from './types';",
  );
  write(
    'packages/curves/src/types.ts',
    'export type Tier = { width: bigint }; export interface DynamicFeeConfig { tier: Tier; }',
  );
  write(
    'packages/sdk/src/actions/multivault.ts',
    'export type Quote = { shares: bigint };',
  );
  write(
    'packages/sdk/src/actions/fee-proxy.ts',
    `
    import type { FeeGuard as Guard } from '@0xintuition/periphery';
    import type { DynamicFeeConfig } from '@0xintuition/curves';
    import type { Quote } from './multivault';
    import { unusedRuntime } from '@0xintuition/periphery';
    type InternalDeps = { guard: Guard };
    export function prepare(guard: Guard, config: DynamicFeeConfig): Quote { throw new Error(); }
  `,
  );
  const reference = createTypeReference(root, 'a'.repeat(40), [
    ['actions/fee-proxy.ts'],
    ['actions/multivault.ts'],
  ]);
  return reference.render('actions/fee-proxy.ts');
}

test('links barrel-owned public imports, aliases, and SDK cross-module types', (t) => {
  const md = fixture(t);
  assert.match(
    md,
    /import type \{ FeeGuard as Guard \} from '@0xintuition\/periphery'/,
  );
  assert.match(md, /packages\/periphery\/src\/types\.ts#L1/);
  assert.match(md, /maxFeeBps: bigint; maxFixedFee: bigint/);
  assert.match(md, /import type \{ Quote \} from '@0xintuition\/sdk\/actions'/);
  assert.match(md, /\.\/multivault\.md#quote/);
  assert.doesNotMatch(md, /unusedRuntime/);
});

test('renders external interface and nested supporting structure', (t) => {
  const md = fixture(t);
  assert.match(md, /export interface DynamicFeeConfig \{ tier: Tier; \}/);
  assert.match(md, /### Tier/);
  assert.match(md, /export type Tier = \{ width: bigint \}/);
});
