---
id: multivault
title: MultiVault.sol
sidebar_label: MultiVault.sol
sidebar_position: 1
description: Documentation for the MultiVault smart contract
---

# MultiVault.sol

The MultiVault contract is the core economic engine of the Intuition protocol, managing deposits, redemptions, and creation of atoms and triples. It implements a sophisticated vault system that supports multiple bonding curves and provides the foundation for the protocol's economic incentives.

The MultiVault is the primary interface for users to interact with the economic aspects of atoms and triples:


### Atom IDs
Atom IDs are generated using a hash function that hashes the Atom's data.

```solidity
function calculateAtomId(bytes memory data) public pure returns (bytes32 id) {
    return keccak256(abi.encodePacked(data));
}
```

### Triple IDs
Triple IDs are generated using a hash function that hashes the subject, predicate, and object Atom IDs.

```solidity
function calculateTripleId(
    bytes32 subjectId,
    bytes32 predicateId,
    bytes32 objectId
) public pure returns (bytes32 id) {
    return keccak256(abi.encodePacked(subjectId, predicateId, objectId));
}
```

## Smart Contract Writes
The MultiVault contract allows users to create new terms, plus deposit and redeem assets.

### Creating Atoms
An Atom represents an entity within the Intuition ecosystem and is identified by a unique `bytes32` identifier. Atoms can represent objects, individuals, organizations, or any other entity type. Atom data is stored onchain and also emitted for caching/indexing using the `AtomCreated` event.

Any user can create an Atom by calling the `createAtoms` function on the MultiVault contract.

```solidity
function createAtoms(
        bytes[] calldata data,
        uint256[] calldata assets
    )
        external
        payable
        returns (bytes32[] memory)
    {
    // Atom creation logic
}
```
The function accepts an array of Atom data and an array of asset amounts, allowing for the creation of multiple Atoms in a single transaction.

Creating an Atom requires a fee payment, which is paid in the native blockchain currency (e.g., TRUST on the Intuition Network). In addition to the fee, users can also deposit TRUST tokens when creating an Atom. This deposit acts as a signal, ensuring that users have a vested interest in the integrity of the Atom they are creating.


### Creating Triples
A Triple represents a claim or statement. A triple is structured using a **subject-predicate-object** relationship. For example, in the triple "Alice is a friend of Bob", "Alice" is the subject, "is a friend of" is the predicate, and "Bob" is the object.

```solidity
function createTriples(
    bytes32[] calldata subjectIds,
    bytes32[] calldata predicateIds,
    bytes32[] calldata objectIds,
    uint256[] calldata assets
)
    external
    payable
    whenNotPaused
    nonReentrant
    returns (bytes32[] memory)
{
    // Triple creation logic
}
```

### Deposit
Deposits are made in the native blockchain currency (e.g., TRUST). Users can also batch multiple deposits or redemptions into a single transaction for efficiency.

The `deposit` function allows users to deposit assets into a specific term and bonding curve. The user specifies the receiver address, term ID, curve ID, and minimum shares they expect to receive.

The `msg.value` sent with the transaction represents the amount of assets being deposited.

```solidity
function deposit(
    address receiver,
    bytes32 termId,
    uint256 curveId,
    uint256 minShares
)
    external
    payable
    whenNotPaused
    nonReentrant
    returns (uint256)
{
    /// Deposit logic
}
```

### Batch Deposit
The `depositBatch` function allows users to make multiple deposits in a single transaction. The user provides arrays of receiver addresses, term IDs, curve IDs, and minimum shares for each deposit.

The `msg.value` sent with the transaction represents the total amount of assets being deposited across all specified deposits. The sum of `assets` must equal `msg.value`.

```solidity
function depositBatch(
    address receiver,
    bytes32[] calldata termIds,
    uint256[] calldata curveIds,
    uint256[] calldata assets,
    uint256[] calldata minShares
)
    external
    payable
    whenNotPaused
    nonReentrant
    returns (uint256[] memory shares)
{
    /// Batch deposit logic
}
```

### Redeem

The `redeem` function allows users to redeem their shares for the underlying assets. The user specifies the receiver address, term ID, curve ID, and the number of shares they want to redeem.

```solidity
function redeem(
    address receiver,
    bytes32 termId,
    uint256 curveId,
    uint256 shares,
    uint256 minAssets
)
    external
    whenNotPaused
    nonReentrant
    returns (uint256)
{
    /// Redemption logic
}
```

### Batch Redeem

The `redeemBatch` function allows users to redeem shares from multiple terms and curves in a single transaction. The user provides arrays of term IDs, curve IDs, shares to redeem, and minimum assets they expect to receive for each redemption.

```solidity
function redeemBatch(
    address receiver,
    bytes32[] calldata termIds,
    uint256[] calldata curveIds,
    uint256[] calldata shares,
    uint256[] calldata minAssets
)
    external
    whenNotPaused
    nonReentrant
    returns (uint256[] memory received)
{
    /// Batch redemption logic
}
```

## Smart Contract Reads

### Is Term Created

The `isTermCreated` function checks if a specific term has been created in the MultiVault.

```solidity
function isTermCreated(bytes32 termId) external view returns (bool) {
    // Term existence logic
}
```

### Current Share Price
The `currentSharePrice` function returns the current share price for a given term and bonding curve.

```solidity
function currentSharePrice(bytes32 termId, uint256 curveId) external view returns (uint256) {
    // Share price calculation logic
}
```

### Preview Atom Create
The `previewAtomCreate` function allows users to preview the cost of creating an Atom with a given set of data.

```solidity
function previewAtomCreate(
    bytes32 termId,
    uint256 curveId,
    uint256 assets
)
    external
    view
    returns (uint256 shares, uint256 assetsAfterFixedFees, uint256 assetsAfterFees)
{
    // Atom creation cost preview logic
}
```

### Preview Triple Create
The `previewTripleCreate` function allows users to preview the cost of creating a Triple with given subject, predicate, and object IDs.

```solidity
function previewTripleCreate(
    bytes32 termId,
    uint256 curveId,
    uint256 assets
)
    external
    view
    returns (uint256 shares, uint256 assetsAfterFixedFees, uint256 assetsAfterFees)
{
    // Triple creation cost preview logic
}
```

### Preview Deposit
The `previewDeposit` function allows users to preview the number of shares they would receive for a deposit of a given amount of assets into a specific term and bonding curve.

```solidity
function previewDeposit(
    bytes32 termId,
    uint256 curveId,
    uint256 assets
)
    public
    view
    returns (uint256 shares, uint256 assetsAfterFees)
{
    // Deposit preview logic
}
```

### Preview Redeem
The `previewRedeem` function allows users to preview the amount of assets they would receive for redeeming a given number of shares from a specific term and bonding curve.

```solidity
function previewRedeem(
    bytes32 termId,
    uint256 curveId,
    uint256 shares
)
    public
    view
    returns (uint256 assetsAfterFees, uint256 sharesUsed)
{
    // Redemption preview logic
}
```

## Events
The MultiVault contract emits a number of different events to track key actions:

- `AtomCreated`: Emitted when a new Atom is created.
- `TripleCreated`: Emitted when a new Triple is created.
- `Deposited`: Emitted when a deposit is made.
- `Redeemed`: Emitted when shares are redeemed for assets.
- `SharePriceChanged`: Emitted when the share price for a term and curve changes.

### AtomCreated
```solidity
event AtomCreated(
    address indexed creator,
    bytes32 indexed termId,
    bytes data
);
```

### TripleCreated
```solidity
event TripleCreated(
    address indexed creator,
    bytes32 indexed tripleId,
    bytes32 subjectId,
    bytes32 predicateId,
    bytes32 objectId
);
```

### Deposited
```solidity
event Deposited(
    address indexed sender,
    address indexed receiver,
    bytes32 indexed termId,
    uint256 curveId,
    uint256 assets,
    uint256 assetsAfterFees,
    uint256 shares,
    uint256 totalShares,
    VaultType vaultType
);
```

### Redeemed
```solidity
event Redeemed(
    address indexed sender,
    address indexed receiver,
    bytes32 indexed termId,
    uint256 curveId,
    uint256 shares,
    uint256 totalShares,
    uint256 assets,
    uint256 fees,
    VaultType vaultType
);
```

### SharePriceChanged
```solidity
event SharePriceChanged(
    bytes32 indexed termId,
    uint256 indexed curveId,
    uint256 sharePrice,
    uint256 totalAssets,
    uint256 totalShares,
    VaultType vaultType
);
```

## Additional Resources

For more detailed information on the MultiVault contract and its functions, please refer to the [Intuition Smart Contract V2 repository](https://github.com/0xIntuition/intuition-contracts-v2).