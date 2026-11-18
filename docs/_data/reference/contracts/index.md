---
title: "Contracts"
sidebar_label: "Contracts"
description: "Choose the contract for term creation, vault positions, affiliate fees, bonding, or wrapping native TRUST."
kind: reference
reader: ["app"]
packages: ["@0xintuition/protocol", "@0xintuition/periphery"]
---

<AppliesTo />

MultiVault records terms and manages vault positions. Applications can call it directly or route supported operations through FeeProxy. Bonding TRUST for epoch rewards uses a separate contract.

| Contract | When to use it |
| --- | --- |
| [MultiVault](/docs/reference/contracts/multivault) | Create atoms from bytes and triples from existing term IDs. Deposit native assets or redeem shares in the vault identified by a term and a curve. |
| [FeeProxy](/docs/reference/contracts/fee-proxy) | Attribute a deposit or creation to a registered affiliate, pay the affiliate's fee, and forward the remaining assets to MultiVault. |
| [TrustBonding](/docs/reference/contracts/trust-bonding) | Lock the configured token for voting power and claim eligible rewards for the previous epoch. |
| WrappedTrust | Convert native TRUST into a transferable token with allowances. A payable `deposit()` credits the caller one WTRUST base unit for each native base unit received. `withdraw(amount)` debits the wrapped balance and returns that amount of native currency to the caller. Both use 18 decimals. |

The V2 libraries expose the MultiVault v1.1.0 interface. The core artifact includes FeeProxy and WrappedTrust. The separate periphery artifact supplies the swap-and-bridge router. Before selecting a method, match the chain and contract address to an implementation that supports it. [Contract artifact provenance](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/docs/contract-artifacts.md) · [WrappedTrust source](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/WrappedTrust.sol)

## Integration references

- [Configuration and URI limits](/docs/reference/contracts/configuration) lists the getters for creation costs, deposit parameters, and context lengths.
- [Deployments](/docs/reference/contracts/deployments) lists contract addresses by chain and asset.
- [Events and errors](/docs/reference/contracts/events-and-errors) explains how to interpret logs and revert data.
- [Audits](/docs/reference/contracts/audits) identifies the contract revisions covered by published assessments.
