import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateAtomId } from '@0xintuition/ids';
import { MultiVaultAbi } from '@0xintuition/deployments';
import { decodeFunctionData, stringToHex } from 'viem';
import { afterReview, prepareCreation } from './src/first-write.ts';

const signer = '0x0000000000000000000000000000000000000001';
const limits = { maxUriCount: 1, maxUriLength: 100 };

test('each preparation binds a fresh atom ID to its reviewed creation bytes and URI', () => {
  const first = prepareCreation(signer, 17n, limits);
  const second = prepareCreation(signer, 17n, limits);
  assert.notEqual(first.uuid, second.uuid);
  assert.notEqual(first.id, second.id);
  assert.equal(
    JSON.parse(first.data).name,
    'Intuition docs first write ' + first.uuid,
  );
  assert.equal(first.dataHex, stringToHex(first.data));
  assert.equal(first.id, calculateAtomId(first.dataHex));
  const call = decodeFunctionData({ abi: MultiVaultAbi, data: first.calldata });
  assert.equal(call.functionName, 'createAtomsWithUris');
  assert.deepEqual(call.args, [
    signer,
    [first.dataHex],
    [17n],
    [[stringToHex(first.uri)]],
  ]);
  assert.deepEqual(call.args, first.inputs.args);
  assert.equal(first.inputs.value, 17n);
  assert.throws(
    () => prepareCreation(signer, 17n, { ...limits, maxUriCount: 0 }),
    /URI count/,
  );
});

test('only an exact operation-specific confirmation reaches execution', async () => {
  let calls = 0;
  const record = async () => ++calls;
  await assert.rejects(afterReview('CREATE', '', record), /Stopped/);
  await assert.rejects(afterReview('DEPOSIT', 'CREATE', record), /Stopped/);
  assert.equal(calls, 0);
  assert.equal(await afterReview('CREATE', 'CREATE', record), 1);
});
