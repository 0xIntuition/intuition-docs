import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateAtomId } from '@0xintuition/ids';
import { MultiVaultAbi } from '@0xintuition/protocol';
import {
  encodeAbiParameters,
  getAbiItem,
  pad,
  toEventSelector,
  type Hex,
  type TransactionReceipt,
} from 'viem';
import { verifyCreationReceipt } from './receipt.ts';
import { prepareReview } from './review.ts';

type MinedLog = TransactionReceipt['logs'][number];

const sender = '0x0000000000000000000000000000000000000001';
const target = '0x0000000000000000000000000000000000000002';
const original = pad('0x11');
const replacement = pad('0x22');
const review = prepareReview(13579, sender, target, '0x6162', 17n);
const termId = calculateAtomId(review.data[0]);
const atomCreated = getAbiItem({ abi: MultiVaultAbi, name: 'AtomCreated' });

function creationLog(data = review.data[0], emittedId: Hex = termId): MinedLog {
  return {
    address: target,
    topics: [toEventSelector(atomCreated), pad(sender), emittedId],
    data: encodeAbiParameters(
      [{ type: 'bytes' }, { type: 'address' }],
      [data, sender],
    ),
    blockHash: pad('0x33'),
    blockNumber: 7n,
    transactionHash: original,
    transactionIndex: 0,
    logIndex: 0,
    removed: false,
  };
}

const log = creationLog();
const receipt = {
  transactionHash: original,
  status: 'success',
  to: target,
  from: sender,
  blockNumber: 7n,
  logs: [log],
} as const satisfies Parameters<typeof verifyCreationReceipt>[2];

test('verifies the reviewed bytes and term ID in the submitted transaction', () => {
  assert.equal(verifyCreationReceipt(review, original, receipt).termId, termId);
});

test('withholds readback for a missing hash or a mined replacement', () => {
  assert.equal(
    verifyCreationReceipt(review, undefined, receipt).termId,
    undefined,
  );
  const mined = {
    ...receipt,
    transactionHash: replacement,
    logs: [{ ...log, transactionHash: replacement }],
  };
  const result = verifyCreationReceipt(review, original, mined);
  assert.equal(result.termId, undefined);
  assert.match(result.message, /replacement/i);
});

test('requires success, the reviewed sender and the reviewed target', () => {
  for (const mismatch of [
    { status: 'reverted' as const },
    { to: sender },
    { to: null },
    { from: target },
  ] satisfies Partial<TransactionReceipt>[]) {
    assert.equal(
      verifyCreationReceipt(review, original, { ...receipt, ...mismatch })
        .termId,
      undefined,
    );
  }
});

test('requires one matching AtomCreated from the reviewed MultiVault and transaction', () => {
  for (const logs of [
    [],
    [log, log],
    [creationLog('0x6162')],
    [creationLog(review.data[0], pad('0x44'))],
    [
      {
        ...log,
        topics: [log.topics[0]!, pad(target), termId],
      },
    ],
    [{ ...log, address: sender }],
    [{ ...log, removed: true }],
    [{ ...log, transactionHash: replacement }],
  ] satisfies MinedLog[][]) {
    assert.equal(
      verifyCreationReceipt(review, original, { ...receipt, logs }).termId,
      undefined,
    );
  }
});
