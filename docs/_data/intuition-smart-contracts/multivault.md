---
id: multivault
title: MultiVault.sol
sidebar_label: MultiVault.sol
sidebar_position: 1
description: Documentation for the MultiVault smart contract, including multicall, creating on behalf of another account, approvals and atom wallets
---

# MultiVault.sol

The MultiVault contract is the core economic engine of the Intuition protocol. It creates atoms and triples, and it manages the deposits into and redemptions from their vaults. Each term (atom or triple) has one vault per bonding curve, and every vault uses TRUST, the native token of the Intuition network, as its asset.

:::info New in v1.1.0

- `multicall` runs several MultiVault calls in one transaction, with an explicit TRUST amount for each call.
- `createAtomsFor` and `createTriplesFor` let an approved account create terms for another account, which stays the creator of record.
- A new `CREATION` approval type, and read functions for each approval type.
- `createAtomsWithUris` attaches context URIs to new atoms.
- MultiVault now records the creator and creation time of each new atom. AtomWarden uses these records for creator claims of atom wallets.
- Configuration changes now go through a timelock.

Function selectors, argument types and event signatures of the v1.0 functions are unchanged, except for the preview functions listed under [Reads](#reads).
:::

## SDK setup

The examples on this page use `@0xintuition/sdk` and `viem`. The SDK resolves the MultiVault address from the chain ID:

```typescript title="multiVault.ts"
import {
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk';
import type { Address, PublicClient, WalletClient } from 'viem';

// Use intuitionMainnet.id for Intuition Mainnet.
export const MULTIVAULT_ADDRESS: Address = getMultiVaultAddressFromChainId(
  intuitionTestnet.id,
);

export function readConfig(publicClient: PublicClient) {
  return { address: MULTIVAULT_ADDRESS, publicClient };
}

export function writeConfig(
  publicClient: PublicClient,
  walletClient: WalletClient,
) {
  return { address: MULTIVAULT_ADDRESS, publicClient, walletClient };
}
```

Each write helper in the SDK simulates the call first, so a call that would revert throws before anything is sent.

## Term IDs

Atom and triple IDs are deterministic. You can compute them off-chain before the term exists:

```solidity
bytes32 public constant ATOM_SALT = keccak256("ATOM_SALT");
bytes32 public constant TRIPLE_SALT = keccak256("TRIPLE_SALT");
bytes32 public constant COUNTER_SALT = keccak256("COUNTER_SALT");

atomId          = keccak256(abi.encodePacked(ATOM_SALT, keccak256(atomData)));
tripleId        = keccak256(abi.encodePacked(TRIPLE_SALT, subjectId, predicateId, objectId));
counterTripleId = keccak256(abi.encodePacked(COUNTER_SALT, tripleId));
```

The same values are available on-chain from `calculateAtomId(bytes)`, `calculateTripleId(bytes32,bytes32,bytes32)` and `getCounterIdFromTripleId(bytes32)`, and off-chain from the SDK:

```typescript
import { calculateAtomId, calculateTripleId } from '@0xintuition/sdk';
import { toHex } from 'viem';

const subjectId = calculateAtomId(toHex('alice.eth'));
const predicateId = calculateAtomId(toHex('follows'));
const objectId = calculateAtomId(toHex('bob.eth'));
const tripleId = calculateTripleId(subjectId, predicateId, objectId);
```

## Writes

All value is sent as TRUST in `msg.value`. Every call that takes an `assets` array requires `msg.value` to equal the sum of the array exactly. A call that sends a different amount reverts with `MultiVault_InsufficientBalance`. A batch can hold at most 150 entries (`MAX_BATCH_SIZE`). The create, deposit and redeem functions revert while MultiVault is paused (`EnforcedPause`); `approve` keeps working.

### Creating atoms

```solidity
function createAtoms(bytes[] calldata atomDatas, uint256[] calldata assets)
    external payable returns (bytes32[] memory termIds);
```

Each `assets[i]` must be at least `getAtomCost()`: the atom creation fee plus the small seed for the vault's minimum shares. Anything above the cost is the creator's first deposit into the atom's vault on the default curve. The creator receives the shares.

Atom data can be at most `atomDataMaxLength` bytes long (`MultiVault_AtomDataTooLong`). Creating an atom that already exists reverts with `MultiVault_AtomExists`.

To attach context to new atoms (for example the source URLs of a page you made an atom for), use `createAtomsWithUris`:

```solidity
function createAtomsWithUris(
    address creator,
    bytes[] calldata atomDatas,
    uint256[] calldata assets,
    bytes[][] calldata uris
) external payable returns (bytes32[] memory termIds);
```

- `uris[i]` belongs to `atomDatas[i]`, so both arrays must have the same length. An empty list is allowed.
- The URIs are emitted in an `AtomContextRegistered` event and are not stored on-chain. They do not change the atom ID.
- `getAtomUriConfig()` returns the limits: the highest number of URIs for one atom (default 5) and the highest byte length of one URI (default 700). Above a limit, the call reverts with `MultiVault_AtomUriCountExceeded` or `MultiVault_AtomUriLengthExceeded`.
- Pass your own address as `creator` to create for yourself. To create for another account, you need its `CREATION` approval, as for `createAtomsFor`.

### Creating triples

```solidity
function createTriples(
    bytes32[] calldata subjectIds,
    bytes32[] calldata predicateIds,
    bytes32[] calldata objectIds,
    uint256[] calldata assets
) external payable returns (bytes32[] memory termIds);
```

The subject, predicate and object must all exist (atoms or triples). The total payment must be at least `getTripleCost()` times the number of triples (`MultiVault_InsufficientBalance`), and each `assets[i]` must be at least `getTripleCost()` (`MultiVault_InsufficientAssets`). Anything above the cost is the creator's first deposit into the triple. Creating a triple also creates its counter triple, which holds positions against the claim. Creating a triple that already exists reverts with `MultiVault_TripleExists`.

### Creating on behalf of another account

```solidity
function createAtomsFor(address creator, bytes[] calldata atomDatas, uint256[] calldata assets)
    external payable returns (bytes32[] memory termIds);

function createTriplesFor(
    address creator,
    bytes32[] calldata subjectIds,
    bytes32[] calldata predicateIds,
    bytes32[] calldata objectIds,
    uint256[] calldata assets
) external payable returns (bytes32[] memory termIds);
```

These work like `createAtoms` and `createTriples`, but `creator` is the creator of record instead of `msg.sender`:

- `creator` receives the shares of the first deposit and is credited with the utilization (which counts towards TrustBonding rewards).
- `AtomCreated` or `TripleCreated` names `creator`, and MultiVault records `creator` as the atom's creator (`getAtomCreator`).
- `msg.sender` pays. The TRUST comes from the caller's `msg.value`, never from `creator`.
- `creator` must have approved `msg.sender` for `CREATION`. Otherwise the call reverts with `MultiVault_CreatorNotApproved`. When `creator == msg.sender`, no approval is needed.

This is how a front end, a relayer or [FeeProxy](/docs/intuition-smart-contracts/fee-proxy) can create terms in a user's name.

### Deposit

```solidity
function deposit(address receiver, bytes32 termId, uint256 curveId, uint256 minShares)
    external payable returns (uint256 shares);

function depositBatch(
    address receiver,
    bytes32[] calldata termIds,
    uint256[] calldata curveIds,
    uint256[] calldata assets,
    uint256[] calldata minShares
) external payable returns (uint256[] memory shares);
```

- `msg.value` is the deposit for `deposit`. For `depositBatch`, `msg.value` must equal the sum of `assets`.
- Each deposit must be at least the minimum deposit (`MultiVault_DepositBelowMinimumDeposit`).
- The shares go to `receiver`. If `receiver` is not `msg.sender`, `receiver` must have approved `msg.sender` for `DEPOSIT` (`MultiVault_SenderNotApproved`).
- `minShares` is the slippage limit. If the deposit would mint fewer shares, the call reverts with `MultiVault_SlippageExceeded`. Get the expected shares from `previewDeposit` and subtract your tolerance.
- The term must exist (`MultiVaultCore_TermDoesNotExist`). The vault on the default curve is opened by the create call. The first deposit into a term on any other curve opens that vault and pays a small seed for its minimum shares.

### Redeem

```solidity
function redeem(address receiver, bytes32 termId, uint256 curveId, uint256 shares, uint256 minAssets)
    external payable returns (uint256 assets);

function redeemBatch(
    address receiver,
    bytes32[] calldata termIds,
    uint256[] calldata curveIds,
    uint256[] calldata shares,
    uint256[] calldata minAssets
) external payable returns (uint256[] memory assets);
```

- `receiver` is the account whose shares are burned, and it receives the TRUST. If `receiver` is not `msg.sender`, `receiver` must have approved `msg.sender` for `REDEMPTION` (`MultiVault_RedeemerNotApproved`).
- `minAssets` is the slippage limit (`MultiVault_SlippageExceeded`).
- `redeem`, `redeemBatch` and `approve` are `payable` only so they can be part of a [multicall](#multicall) that also sends value. They take no value: a call with a non-zero `msg.value`, or a non-zero multicall value, reverts with `MultiVault_UnexpectedValue`.

### SDK: create, deposit and redeem

```typescript title="multiVault.ts"
import {
  multiVaultCreateAtoms,
  multiVaultDeposit,
  multiVaultGetAtomCost,
  multiVaultPreviewDeposit,
  multiVaultRedeem,
} from '@0xintuition/sdk';
import { type Hex, parseEther } from 'viem';

export async function createAtom(
  publicClient: PublicClient,
  walletClient: WalletClient,
  atomData: Hex,
) {
  const atomCost = await multiVaultGetAtomCost(readConfig(publicClient));
  const assets = atomCost + parseEther('1'); // the cost, plus a 1 TRUST first deposit
  return multiVaultCreateAtoms(writeConfig(publicClient, walletClient), {
    args: [[atomData], [assets]],
    value: assets,
  });
}

export async function depositWithSlippage(
  publicClient: PublicClient,
  walletClient: WalletClient,
  receiver: Address,
  termId: Hex,
  curveId: bigint,
  assets: bigint,
) {
  const [expectedShares] = await multiVaultPreviewDeposit(
    readConfig(publicClient),
    { args: [termId, curveId, assets] },
  );
  const minShares = (expectedShares * 99n) / 100n; // accept up to 1% slippage
  return multiVaultDeposit(writeConfig(publicClient, walletClient), {
    args: [receiver, termId, curveId, minShares],
    value: assets,
  });
}

export async function redeemAll(
  publicClient: PublicClient,
  walletClient: WalletClient,
  account: Address,
  termId: Hex,
  curveId: bigint,
  shares: bigint,
  minAssets: bigint,
) {
  return multiVaultRedeem(writeConfig(publicClient, walletClient), {
    args: [account, termId, curveId, shares, minAssets],
  });
}
```

## Approvals

An account (the **receiver** or **creator**) can let another address (the **sender**) act for it. The receiver calls:

```solidity
function approve(address sender, ApprovalTypes approvalType) external payable;
```

`ApprovalTypes` is a bit mask: `DEPOSIT` is bit 0, `REDEMPTION` is bit 1 and `CREATION` is bit 2.

| `approvalType`            | Value | Lets `sender`                                                 |
| ------------------------- | ----- | ------------------------------------------------------------- |
| `NONE`                    | `0`   | Nothing. Removes the approval.                                |
| `DEPOSIT`                 | `1`   | Deposit with the receiver as `receiver`                       |
| `REDEMPTION`              | `2`   | Redeem the receiver's shares (the TRUST goes to the receiver) |
| `BOTH`                    | `3`   | Deposit and redeem (`DEPOSIT` and `REDEMPTION`)               |
| `CREATION`                | `4`   | Create atoms and triples with the receiver as `creator`       |
| `DEPOSIT_AND_CREATION`    | `5`   | Deposit and create                                            |
| `REDEMPTION_AND_CREATION` | `6`   | Redeem and create                                             |
| `ALL`                     | `7`   | Deposit, redeem and create                                    |

:::warning `approve` replaces the approval, it does not add to it
Each call stores `approvalType` in place of the earlier value. If you approved a sender for `DEPOSIT` and then call `approve(sender, CREATION)`, the `DEPOSIT` approval is gone. To keep both, send the combined value, here `DEPOSIT_AND_CREATION` (`5`). Read the current state first with `isApprovedToDeposit`, `isApprovedToRedeem` and `isApprovedToCreate`.
:::

- You cannot approve yourself: `approve(msg.sender, ...)` reverts with `MultiVault_CannotApproveOrRevokeSelf`. You never need to, because every account can always act for itself.
- `approve` emits `ApprovalTypeUpdated(sender, receiver, approvalType)`.
- An approval stays until the receiver replaces it or sets `NONE`.
- An approved sender can change the receiver's positions. A `REDEMPTION` approval lets the sender exit the receiver's positions at a time the sender chooses. Approve only addresses you trust, and grant only the bits they need.

### SDK: create for a user

The user approves your app once for `CREATION`, keeping any approval they already gave. Your app then creates atoms with the user as creator and pays for them:

```typescript title="createFor.ts"
import {
  ApprovalTypes,
  multiVaultApprove,
  multiVaultCreateAtomsFor,
  multiVaultIsApprovedToCreate,
  multiVaultIsApprovedToDeposit,
  multiVaultIsApprovedToRedeem,
} from '@0xintuition/sdk';
import type { Address, Hex, PublicClient, WalletClient } from 'viem';

import { readConfig, writeConfig } from './multiVault';

// Signed by the user. Adds CREATION and keeps any DEPOSIT or REDEMPTION approval.
export async function approveAppForCreation(
  publicClient: PublicClient,
  userWallet: WalletClient,
  user: Address,
  app: Address,
) {
  const config = readConfig(publicClient);
  const [canDeposit, canRedeem, canCreate] = await Promise.all([
    multiVaultIsApprovedToDeposit(config, { args: [app, user] }),
    multiVaultIsApprovedToRedeem(config, { args: [app, user] }),
    multiVaultIsApprovedToCreate(config, { args: [app, user] }),
  ]);
  if (canCreate) return null;

  const approvalType = (ApprovalTypes.CREATION |
    (canDeposit ? ApprovalTypes.DEPOSIT : 0) |
    (canRedeem ? ApprovalTypes.REDEMPTION : 0)) as ApprovalTypes;

  return multiVaultApprove(writeConfig(publicClient, userWallet), {
    args: [app, approvalType],
  });
}

// Signed and paid by the app. The user is the creator and receives the shares.
export async function createAtomsForUser(
  publicClient: PublicClient,
  appWallet: WalletClient,
  user: Address,
  atomDatas: Hex[],
  assets: bigint[],
) {
  return multiVaultCreateAtomsFor(writeConfig(publicClient, appWallet), {
    args: [user, atomDatas, assets],
    value: assets.reduce((sum, amount) => sum + amount, 0n),
  });
}
```

`multivaultPrepareOnBehalfOfCreationPlan` in the SDK does the same planning and returns the approval and creation calldata as ordered steps, each marked with the account that must sign it.

## Multicall

```solidity
function multicall(bytes[] calldata data, uint256[] calldata values)
    external payable returns (bytes[] memory results);
```

`multicall` runs a list of MultiVault calls in one transaction. Each entry of `data` is ABI-encoded calldata for one MultiVault function, and `values[i]` is the TRUST that call receives.

- **Value accounting.** The sum of `values` must equal `msg.value` (`MultiVault_MulticallValueMismatch`), and `data` and `values` must have the same length (`MultiVault_ArraysNotSameLength`). Each call is charged only its own `values[i]` and treats it as its `msg.value`, so the per-call rules above apply unchanged: for example, a `createAtoms` call needs `values[i]` equal to the sum of its `assets`.
- **No value for calls that take none.** `approve`, `redeem` and `redeemBatch` need `values[i] = 0` (`MultiVault_UnexpectedValue`).
- **Same caller.** Every call runs with your address as `msg.sender`, and its own checks (approvals, pause, slippage) run as for a direct call.
- **Atomic.** If any call reverts, the whole transaction reverts with that call's error.
- **No nesting.** A `multicall` inside a `multicall` reverts with `MultiVault_NestedMulticall`.
- **View and non-payable functions.** When `msg.value` is zero, you can include any MultiVault function. When it is non-zero, include only payable functions. A non-payable function, including a view function, reverts if the transaction carries value.

Later calls can use terms that earlier calls created, because each call sees the state left by the one before it.

### Worked example: create an atom and deposit into it in one transaction

This creates an atom, with a first deposit on the default curve (curve 1), and opens a second position on curve 2 in the same transaction.

```typescript title="createAndDeposit.ts"
import {
  calculateAtomId,
  multiVaultCreateAtomsEncode,
  multiVaultDepositEncode,
  multiVaultGetAtomCost,
  multiVaultMulticall,
  multivaultPrepareMulticallTx,
} from '@0xintuition/sdk';
import { parseEther, type PublicClient, toHex, type WalletClient } from 'viem';

import { readConfig, writeConfig } from './multiVault';

export async function createAtomAndDeposit(
  publicClient: PublicClient,
  walletClient: WalletClient,
) {
  const receiver = walletClient.account?.address;
  if (!receiver) throw new Error('The wallet client needs an account');

  const atomData = toHex('ipfs://bafkreib...'); // your atom's data
  const atomId = calculateAtomId(atomData);

  const atomCost = await multiVaultGetAtomCost(readConfig(publicClient));
  const createAssets = atomCost + parseEther('1'); // 1 TRUST on curve 1
  const depositAssets = parseEther('5'); // 5 TRUST on curve 2

  const tx = multivaultPrepareMulticallTx([
    {
      calldata: multiVaultCreateAtomsEncode([atomData], [createAssets]),
      value: createAssets,
    },
    {
      // minShares = 0 is safe only here: the atom is new, so its curve 2 vault is empty
      // and nobody can deposit before this call. Use a real minimum for existing vaults.
      calldata: multiVaultDepositEncode(receiver, atomId, 2n, 0n),
      value: depositAssets,
    },
  ]);

  // tx.value is createAssets + depositAssets, the sum of the per-call values.
  return multiVaultMulticall(writeConfig(publicClient, walletClient), {
    args: tx.args,
    value: tx.value,
  });
}
```

If the atom already exists, the first call reverts with `MultiVault_AtomExists` and the deposit does not happen either.

The raw call has the same shape:

```solidity
bytes[] memory data = new bytes[](2);
uint256[] memory values = new uint256[](2);

bytes[] memory atomDatas = new bytes[](1);
atomDatas[0] = atomData;
uint256[] memory createAssets = new uint256[](1);
createAssets[0] = multiVault.getAtomCost() + 1 ether;

data[0] = abi.encodeCall(IMultiVault.createAtoms, (atomDatas, createAssets));
values[0] = createAssets[0];
data[1] = abi.encodeCall(IMultiVault.deposit, (receiver, multiVault.calculateAtomId(atomData), 2, 0));
values[1] = 5 ether;

multiVault.multicall{ value: values[0] + values[1] }(data, values);
```

## Atom wallets and AtomWarden

Every atom has an **atom wallet**: an ERC-4337 smart account at a deterministic address, `computeAtomWalletAddr(atomId)`. Anyone can deploy it with `AtomWalletFactory.deployAtomWallet(atomId)`.

Each deposit into an atom vault (including the first deposit at creation) pays an **atom wallet deposit fee** to the atom's wallet. The fee accumulates in MultiVault, and `accumulatedAtomWalletDepositFees(atomWallet)` returns the amount. The wallet's owner collects it by calling `claimAtomWalletDepositFees()` on the atom wallet, which pays the owner. MultiVault accepts this claim only from the atom's own wallet (`MultiVault_OnlyAssociatedAtomWallet`).

Until someone claims the wallet, its owner is **AtomWarden** (`getAtomWarden()`). AtomWarden hands ownership to the right account once, through one of these paths:

| Path                                    | Who calls    | Conditions                                                                                                                                                                                                                             |
| --------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claimOwnershipOverAddressAtom(atomId)` | The address  | The atom's data is the caller's own address as a hex string, lowercase or checksummed.                                                                                                                                                 |
| `claimWithAuthorization(auth, sig)`     | The claimant | An EIP-712 claim authorization for the caller, signed by at least the required number of AtomWarden signers, with the current nonce, inside its validity window and within the claim rate limit.                                       |
| `claimAsCreatorAfterExpiry(atomId)`     | The creator  | The caller is the creator recorded by MultiVault, the claim window has passed since creation, and the wallet's accumulated fees reach the minimum. Atoms created before v1.1.0 have no recorded creator (`AtomWarden_CreatorUnknown`). |
| `grantAtomWalletOwnership(atomId, to)`  | An operator  | Needs AtomWarden's `OPERATOR_ROLE`.                                                                                                                                                                                                    |

On every path, the atom must exist, its wallet must be deployed (`AtomWarden_AtomWalletNotDeployed`), and the wallet must not be claimed yet (`AtomWarden_AlreadyClaimed`). The three user paths revert while AtomWarden is paused.

`createAtomsFor` matters here: the `creator` you pass is the address that can later use the creator path. After a claim, the new owner controls the wallet, and AtomWarden can no longer change its owner.

```typescript title="atomWallet.ts"
import {
  MultiVaultAbi,
  multiVaultAccumulatedAtomWalletDepositFees,
  multiVaultComputeAtomWalletAddr,
} from '@0xintuition/sdk';
import type { Hex, PublicClient } from 'viem';

import { readConfig } from './multiVault';

export async function atomWalletInfo(publicClient: PublicClient, atomId: Hex) {
  const config = readConfig(publicClient);
  const wallet = await multiVaultComputeAtomWalletAddr(config, {
    args: [atomId],
  });
  const [pendingFees, creator] = await Promise.all([
    multiVaultAccumulatedAtomWalletDepositFees(config, { args: [wallet] }),
    publicClient.readContract({
      address: config.address,
      abi: MultiVaultAbi,
      functionName: 'getAtomCreator',
      args: [atomId],
    }),
  ]);
  return { wallet, pendingFees, creator };
}
```

## Reads

### Previews

```solidity
function previewAtomCreate(bytes32 termId, uint256 assets)
    external view returns (uint256 shares, uint256 feeBaseAssets, uint256 assetsAfterFees);

function previewTripleCreate(bytes32 subjectId, bytes32 predicateId, bytes32 objectId, uint256 assets)
    external view returns (uint256 shares, uint256 feeBaseAssets, uint256 assetsAfterFees);

function previewDeposit(bytes32 termId, uint256 curveId, uint256 assets)
    external view returns (uint256 shares, uint256 assetsAfterFees);

function previewRedeem(bytes32 termId, uint256 curveId, uint256 shares)
    external view returns (uint256 assetsAfterFees, uint256 sharesUsed);
```

- **Changed in v1.1.0:** `previewTripleCreate` takes the three atom IDs instead of the triple ID, so that it can quote a triple that does not exist yet.
- Creation previews use the default curve. `feeBaseAssets` is `assets` minus the fixed creation cost, the amount the percentage fees are charged on. `assetsAfterFees` is what goes into the vault.
- `previewDeposit` and `previewRedeem` revert with `MultiVault_TermDoesNotExist` for a term that does not exist.
- `previewRedeem` reverts with `MultiVault_RedeemYieldsNoAssets` when the fees would take the whole redemption, as the redemption itself would. When you preview many positions, handle a revert on one of them.

### Approvals, creators and wallets

| Function                                       | Returns                                                                                                               |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `isApprovedToDeposit(sender, receiver)`        | `true` if `sender == receiver` or `receiver` approved `sender` with the `DEPOSIT` bit.                                |
| `isApprovedToRedeem(sender, receiver)`         | `true` if `sender == receiver` or `receiver` approved `sender` with the `REDEMPTION` bit.                             |
| `isApprovedToCreate(sender, creator)`          | `true` if `sender == creator` or `creator` approved `sender` with the `CREATION` bit.                                 |
| `getAtomCreator(atomId)`                       | The recorded creator. `address(0)` for atoms created before v1.1.0.                                                   |
| `getAtomCreatedAt(atomId)`                     | The recorded creation timestamp. `0` for atoms created before v1.1.0.                                                 |
| `getAtomWarden()`                              | The AtomWarden address, the owner of every unclaimed atom wallet.                                                     |
| `computeAtomWalletAddr(atomId)`                | The atom wallet address, deployed or not.                                                                             |
| `accumulatedAtomWalletDepositFees(atomWallet)` | Atom wallet deposit fees waiting to be claimed.                                                                       |
| `getAtomUriConfig()`                           | `(maxUriCount, maxUriLength)` for `createAtomsWithUris`.                                                              |
| `timelock()`                                   | The timelock that owns the configuration setters. See [Configuration](/docs/intuition-smart-contracts/configuration). |

### Other reads

| Function                                                                                                                       | Returns                                        |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| `isTermCreated(termId)`                                                                                                        | `true` if the atom or triple exists.           |
| `getAtomCost()`, `getTripleCost()`                                                                                             | The fixed cost of creating one atom or triple. |
| `currentSharePrice(termId, curveId)`                                                                                           | The current share price of a vault.            |
| `getVault(termId, curveId)`                                                                                                    | `(totalAssets, totalShares)` of a vault.       |
| `getShares(account, termId, curveId)`                                                                                          | An account's shares in a vault.                |
| `maxRedeem(account, termId, curveId)`                                                                                          | The shares an account can redeem from a vault. |
| `convertToShares(termId, curveId, assets)`, `convertToAssets(...)`                                                             | Conversion at the vault's curve, without fees. |
| `getGeneralConfig()`, `getAtomConfig()`, `getTripleConfig()`, `getVaultFees()`, `getWalletConfig()`, `getBondingCurveConfig()` | The current configuration.                     |

## Events

The v1.0 events keep their signatures, so existing decoders and indexers work unchanged. Some fields have new names that say what they hold.

```solidity
event AtomCreated(address indexed creator, bytes32 indexed termId, bytes atomData, address atomWallet);

event TripleCreated(
    address indexed creator, bytes32 indexed termId, bytes32 subjectId, bytes32 predicateId, bytes32 objectId
);

event Deposited(
    address indexed sender,
    address indexed receiver,
    bytes32 indexed termId,
    uint256 curveId,
    uint256 assets,
    uint256 assetsAfterFees,
    uint256 shares,
    uint256 receiverSharesAfter, // the receiver's balance after the deposit, not the vault total
    VaultType vaultType
);

event Redeemed(
    address indexed sender,
    address indexed account,     // whose shares are burned; receives the TRUST
    bytes32 indexed termId,
    uint256 curveId,
    uint256 shares,
    uint256 accountSharesAfter,  // the account's balance after the redemption, not the vault total
    uint256 assetsAfterFees,     // the TRUST paid out
    uint256 totalFees,
    VaultType vaultType
);

event SharePriceChanged(
    bytes32 indexed termId,
    uint256 indexed curveId,
    uint256 sharePrice,
    uint256 totalAssets,
    uint256 totalShares,
    VaultType vaultType
);
```

- `creator` in `AtomCreated` and `TripleCreated` is the creator of record, which for `createAtomsFor` and `createTriplesFor` is the `creator` argument, not `msg.sender`. The `Deposited` event of a creation also names the creator as `sender` and `receiver`.
- `AtomCreated.atomWallet` is the atom wallet address, whether the wallet is deployed yet or not.

New in v1.1.0:

| Event                                             | Emitted when                                                     |
| ------------------------------------------------- | ---------------------------------------------------------------- |
| `AtomContextRegistered(termId, registrant, uris)` | `createAtomsWithUris` creates an atom with a non-empty URI list. |
| `TimelockSet(timelock)`                           | The configuration timelock is set or changed.                    |
| `AtomUriConfigUpdated(maxUriCount, maxUriLength)` | The URI limits change.                                           |

`ApprovalTypeUpdated(sender, receiver, approvalType)` now also carries the `CREATION` values (`4` to `7`).

## Errors

The errors you are most likely to meet when you integrate:

| Error                                                                         | Cause                                                                                                                                 |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `MultiVault_InsufficientBalance`                                              | `msg.value` (or the multicall value) is not the sum of `assets`, or the total is below `getTripleCost()` times the number of triples. |
| `MultiVault_InsufficientAssets`                                               | An atom's or triple's `assets` is below `getAtomCost()` or `getTripleCost()`.                                                         |
| `MultiVault_DepositBelowMinimumDeposit`                                       | A deposit is below the minimum deposit.                                                                                               |
| `MultiVault_SlippageExceeded`                                                 | Fewer shares or assets than `minShares` or `minAssets`.                                                                               |
| `MultiVault_SenderNotApproved`                                                | Deposit for a `receiver` that did not approve you for `DEPOSIT`.                                                                      |
| `MultiVault_RedeemerNotApproved`                                              | Redeem for a `receiver` that did not approve you for `REDEMPTION`.                                                                    |
| `MultiVault_CreatorNotApproved` _(new)_                                       | Create for a `creator` that did not approve you for `CREATION`.                                                                       |
| `MultiVault_CannotApproveOrRevokeSelf`                                        | `approve` with your own address as `sender`.                                                                                          |
| `MultiVault_MulticallValueMismatch` _(new)_                                   | The multicall `values` do not add up to `msg.value`.                                                                                  |
| `MultiVault_NestedMulticall` _(new)_                                          | A `multicall` inside a `multicall`.                                                                                                   |
| `MultiVault_UnexpectedValue` _(new)_                                          | Value sent to `approve`, `redeem` or `redeemBatch`.                                                                                   |
| `MultiVault_AtomUriCountExceeded`, `MultiVault_AtomUriLengthExceeded` _(new)_ | Too many URIs for one atom, or a URI that is too long.                                                                                |
| `MultiVault_RedeemYieldsNoAssets` _(new)_                                     | The fees would take the whole redemption.                                                                                             |
| `MultiVault_AtomExists`, `MultiVault_TripleExists`                            | The term already exists.                                                                                                              |
| `MultiVaultCore_TermDoesNotExist`, `MultiVault_TermDoesNotExist`              | Deposit into, or preview of, a term that does not exist.                                                                              |
| `EnforcedPause`                                                               | MultiVault is paused.                                                                                                                 |

## Additional Resources

For the full source, see the [Intuition Smart Contracts V2 repository](https://github.com/0xIntuition/intuition-contracts-v2).
