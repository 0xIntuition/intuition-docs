---
id: trust-bonding
title: TrustBonding.sol
sidebar_label: TrustBonding.sol
sidebar_position: 3
description: Documentation for the TrustBonding smart contract
---

# TrustBonding.sol

The TrustBonding contract is the primary smart contract for bonding/staking of TRUST tokens within the Intuition protocol. Responsible for managing emissions of new TRUST tokens for various stakeholders, including atom creators, triple creators, and other participants in the ecosystem.

### Wrapped Trust (wTRUST)
The TrustBonding contract requires users to wrap their TRUST tokens into Wrapped TRUST (wTRUST) before locking them in the voting escrow. This wrapping process is handled by the `WrappedTrust` contract, which allows users to deposit TRUST tokens and receive an equivalent amount of wTRUST tokens.


### Voting Escrow (veTRUST)
The TrustBonding contract inherits from the popular Voting Escrow mechanism, allowing users to lock their TRUST tokens for a specified period in exchange for veTRUST tokens. These veTRUST tokens represent voting power and can be used to influence governance decisions within the Intuition protocol.

The voting escrow mechanism is implemented using the `VotingEscrow` contract, which provides functions for creating locks, increasing lock amounts, and extending lock durations.

Originated from Curve Finance's veCRV model, originally written in Vyper, the Voting Escrow contract has been adapted to Solidity for use in the Intuition protocol and forked from the Stargate DAO's [implementation](https://github.com/stargate-protocol/stargate-dao/blob/main/contracts/VotingEscrow.sol).

## Smart Contract Writes

### Creating Locks
Users can create a new lock by calling the `create_lock` function, specifying the amount of Wrapped TRUST tokens to lock and the duration of the lock.

```solidity
function create_lock(uint256 _value, uint256 _unlock_time) external nonReentrant onlyUserOrWhitelist notUnlocked {
    // Lock creation logic
}
```

### Increasing Lock Amount
Users can increase the amount of Wrapped TRUST tokens in an existing lock by calling the `increase_amount` function.

```solidity
function increase_amount(uint256 _value) external nonReentrant onlyUserOrWhitelist notUnlocked {
    // Lock amount increase logic
}
```

### Increasing Lock Duration
Users can extend the duration of an existing lock by calling the `increase_unlock_time` function.

```solidity
function increase_unlock_time(uint256 _unlock_time) external nonReentrant onlyUserOrWhitelist notUnlocked {
    // Lock duration extension logic
}
```

### Increase Amount and Duration
Users can simultaneously increase the amount of Wrapped TRUST tokens and extend the duration of an existing lock by calling the `increase_amount_and_duration` function.

```solidity
function increase_amount_and_duration(uint256 _value, uint256 _unlock_time) external nonRentrant onlyUserOrWhitelist notUnlocked {
    // Lock amount and duration increase logic
}
```

### Withdraw
Once the lock period has expired, users can withdraw their locked Wrapped TRUST tokens by calling the `withdraw` function.

```solidity
function withdraw() external nonReentrant onlyUserOrWhitelist {
    // Withdrawal logic
}
```

## Smart Contract Reads

### Balance Of
The `balanceOf` function returns the voting power of a specific address at a given timestamp.

```solidity
function balanceOf(address _addr) external view returns (uint256) {
    // Balance calculation logic
}
```

### Balance Of At Timestamp
The `balanceOfAtT` function returns the voting power of a specific address at a given timestamp.

```solidity
function balanceOfAt(address _addr, uint256 _t) external view returns (uint256) {
    // Balance calculation logic
}
```

### Total Supply
The `totalSupply` function returns the total voting power in the system at a given timestamp.

```solidity
function totalSupply() external view returns (uint256) {
    // Total supply calculation logic
}
```

### Total Supply At Timestamp
The `totalSupplyAtT` function returns the total voting power in the system at a given timestamp.

```solidity
function totalSupplyAtT(uint256 t) external view returns (uint256) {
    // Total supply calculation logic
}
```

## Events

### Rewards Claimed
The `RewardsClaimed` event is emitted when a user claims their rewards.

```solidity
event RewardsClaimed(address indexed user, address indexed recipient, uint256 amount);
``` 

## Additional Resources

For more detailed information on the MultiVault contract and its functions, please refer to the [Intuition Smart Contract V2 repository](https://github.com/0xIntuition/intuition-contracts-v2).