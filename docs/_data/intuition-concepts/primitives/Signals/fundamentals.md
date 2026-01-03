---
title: Signal Fundamentals
sidebar_label: Fundamentals
sidebar_position: 1
description: Understanding Signals - the trust and consensus layer of the knowledge graph
keywords: [signals, staking, trust, consensus, attestation, bonding curves, TVL]
---

# Signal Fundamentals

Signals represent the trust, confidence, or relevance that the community assigns to Atoms and Triples in the Intuition knowledge graph. Think of the knowledge graph as a weighted graph where Signal is the weight on each node (Atom) or edge (Triple), indicating how strongly people believe in or care about this information.

## Understanding Signals

Signal, in the context of Intuition, refers to any action or indication that expresses intent, belief, or support. Signals can be classified into three broad categories: explicit signal, implicit signal, and transitive signal.

Signals transform static data into a dynamic, trusted intelligence layer. When someone stakes tokens on an Atom or Triple, they emit a Signal expressing that they find that piece of information important or true.

## Types of Signal

### Explicit Signal
A clear, intentional action taken by a user to express support, belief, or intent. These actions are directly observable and often involve a formal mechanism within the system.

**Examples:**
- Voting mechanisms
- Signed attestations  
- Token staking
- Direct claims

### Implicit Signal
Indirect or inferred indications of support, belief, or intent. This signal is not always directly observable and is often deduced from user behavior or patterns.

**Examples:**
- Frequency of queries and references
- Inclusion in other Triples
- Application usage metrics
- Usage patterns

### Transitive Signal
Trust or belief that is passed along through a network of relationships. This type of signal leverages the idea that trust can be extended through connections.

**Example:** If User A attests to something about User B, and User C trusts User A, then User C extends trust to User B.

## Signal in Intuition

Though all systems naturally generate implicit signal, explicit signal in Intuition is expressed in a novel format that enables and incentivizes the creation of many-to-one, non-deterministic attestations.

In Intuition, these semantic statements do not have a single 'issuer' - instead, anyone/anything can signal support or rejection of any existing statement/attestation at any point in time.

## How Signals are Created

The core mechanism for creating signals is through **staking** (also called attesting). When you deposit tokens into an Atom's vault or a Triple's vaults, you're effectively buying "shares" in that piece of information.

### Staking Mechanics

- **Atoms**: Each Atom has a single staking vault
- **Triples**: Each Triple has two vaults (positive and negative)
- **Shares**: Your stake represents proportional ownership and conviction

For example:
- Staking 100 TRUST on the Atom `[Ethereum]` gives you a fraction of total Atom Shares for `[Ethereum]`
- Staking 50 TRUST on `[Alice] is Friend Of [Bob]` in the affirmative vault gives you Triple Shares supporting that friendship claim

### Bonding Curves

The bonding curve mechanics mean share prices depend on existing stake levels:
- Early stakers get better prices
- Later stakers pay more for the same signal increment
- This creates a perpetual prediction market for information

## Atom Signal

Within the Intuition framework, users signal their belief in the relevance of an Atom by adjusting their balance on that Atom.

**Balance Interpretation:**
- **Zero Balance**: No signal, neutral stance
- **Positive Balance**: Indicates belief in relevance (higher = stronger)
- Users earn fees proportional to their ownership stake

## Triple Signal

In the Intuition framework, users signal their belief in both the relevance and truthfulness of a Triple by modifying their balance on that Triple.

**Triple Balance System:**
- **Zero Balance**: No signal, neutral stance
- **Positive Balance**: Affirms the Triple (considered true and relevant)
- **Negative Balance**: Signals rejection (considered false but relevant)

### Example: Trustworthiness Triple

For a Triple asserting `[Vitalik][is][trustworthy]`:
- **Positive Balance**: Believes Vitalik is trustworthy
- **Negative Balance**: Believes Vitalik is not trustworthy  
- **Zero Balance**: No opinion on trustworthiness

## Total Value Locked and Consensus

Each Atom and Triple accrues **Total Value Locked (TVL)** in its vaults—a direct measure of tokenized trust. Higher TVL generally implies greater relevance or credibility.

The consensus score weighs multiple variables:
- Amount staked on each side
- Number of distinct attestors
- Past reliability (reputation) of attestors

:::warning Important Distinction
Creating an Atom or Triple is distinctly different from taking a position on them. While users have the option to both create and take a position at the time of creation, the Initial Deposit is not required. A user who makes no Initial Deposit will only create an Atom or Triple, which does not constitute a Signal.
:::

---

## Next Steps

- [Capturing Signal](./capturing) - Learn advanced techniques for signal capture
- [Signal Rewards](./rewards) - Understand the economic incentives and reward distribution
- [Atom Fundamentals](../atoms/fundamentals) - Review Atom basics
- [Triple Fundamentals](../triples/fundamentals) - Review Triple basics
