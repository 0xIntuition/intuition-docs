---
title: Positive and Negative Claims
sidebar_position: 3
---

# Positive and Negative Claims

Unlike traditional databases that store only "the one truth," Intuition allows multiple competing Triples and uses Signals (stakes) to gauge their validity.

## Two-Sided Staking Vaults

Every Triple has two logical versions:
- **YES vault**: Supporting the claim (affirmative)
- **NO vault**: Denying the claim (negative)

Users can stake on either side, effectively casting weighted votes about the truth of that Triple. This design means a Triple object encapsulates both the claim and its counter-claim within one structure.

## Example: Contested Relationships

For the Triple `[Bob] -- [isFriendOf] --> [Alice]`:
- The affirmative vault contains stakes from those who agree Bob and Alice are friends
- The negative vault contains stakes from those who disagree (potentially including Alice herself!)

## Consensus Evaluation

The network evaluates consensus by:
- Comparing signals on both sides
- Factoring in attestor reputation
- Considering the number of attestors
- Calculating confidence scores that adjust over time

:::warning
Importantly, Intuition doesn't force a single authoritative truth—it records the spectrum of belief. Multiple "canonical" Triples can compete, and the TCR mechanism with staking tends to favor the most accurate representations.
:::
