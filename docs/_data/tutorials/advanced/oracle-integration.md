---
title: Oracle Integration
sidebar_label: Oracle Integration
sidebar_position: 3
description: Use Intuition claims in smart contracts
---

# Oracle Integration

> Coming soon! This tutorial will show how to use Intuition as an oracle for your smart contracts.

Learn how to read Intuition's on-chain data from your smart contracts, enabling trust-weighted decision making and reputation-gated access.

## What You'll Learn

This tutorial will cover:
- Reading atom and triple data from contracts
- Querying vault metrics (market cap, positions)
- Implementing reputation-gated functions
- Using signals for weighted voting
- Building trust-based access control
- Real-time oracle updates

## Use Cases

- **Reputation-gated DAOs** - Only allow voting from trusted accounts
- **Trust-weighted governance** - Weight votes by reputation
- **Safety checks** - Query fraud detection data before interacting with contracts
- **Expert verification** - Require attestations from qualified users
- **Dynamic access control** - Grant permissions based on on-chain reputation

## In the Meantime

See these resources:

- [Protocol Smart Contracts](/docs/docs/protocol/getting-started)
- [Multivault Contract API](/docs/docs/protocol/api-reference)
- [Solidity Integration Guide](/docs/docs/protocol/solidity-integration)

## Quick Example

```solidity
// Conceptual example
interface IIntuitionMultivault {
  function getVaultAssets(bytes32 vaultId) external view returns (uint256);
  function getPosition(bytes32 vaultId, address account) external view returns (uint256);
}

contract ReputationGatedDAO {
  IIntuitionMultivault public intuition;
  bytes32 public reputationVaultId;
  uint256 public minimumReputation;

  function vote(uint256 proposalId, bool support) external {
    // Check caller's reputation
    uint256 reputation = intuition.getPosition(reputationVaultId, msg.sender);

    require(
      reputation >= minimumReputation,
      "Insufficient reputation to vote"
    );

    // Weight vote by reputation
    _castVote(proposalId, support, reputation);
  }
}
```

## Get Notified

Want to be notified when this tutorial is ready? Join our [Discord](https://discord.gg/RgBenkX4mx).
