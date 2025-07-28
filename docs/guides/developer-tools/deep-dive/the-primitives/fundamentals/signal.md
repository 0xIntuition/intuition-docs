---
id: signal
title: Signal
sidebar_label: Signal
sidebar_position: 3
description: Understanding Signal in Intuition
---

# Signal

Signal, in the context of Intuition, refers to any action or indication that expresses intent, belief, or support. Signals can be classified into three broad categories: explicit signal, implicit signal, and transitive signal. These signals play a crucial role in interpreting user behavior, beliefs, and preferences within the system.

## Explicit Signal

An explicit signal is a clear, intentional action taken by a user to express support, belief, or intent. These actions are directly observable and often involve a formal mechanism within the system. Examples of explicit signals include voting mechanisms, where casting a vote represents a user's preference. Verifiable claims and attestations are also forms of explicit signals; they are signed messages that convey specific information.

For instance, a proof of humanity attestation from a trust anchor like Worldcoin is an explicit signal from Worldcoin that Worldcoin believes the entity to be human (a valuable data point for sybil resistance efforts).

## Implicit Signal

Implicit signal involves indirect or inferred indications of support, belief, or intent. This signal is not always directly observable and are often deduced from user behavior or patterns. For example, the frequency and context of user interactions with certain data points can imply their support or belief. Implicit signal requires sophisticated analysis to interpret accurately, as it is embedded within the user's activity data.

## Transitive Signal

Transitive signal refers to the trust or belief that is passed along through a network of relationships. This type of signal leverages the idea that trust can be extended through connections. For example, if User A attests to something about User B, and User C trusts User A, then User C is likely to extend some level of trust to User B, even without a direct interaction. This transitive nature of trust is vital in decentralized systems like Intuition, where direct trust relationships are not always possible. By harnessing transitive signals, the system can create a more interconnected and trust-rich environment, where the credibility of one entity can influence the perception and trustworthiness of others within the network.

# Signal in Intuition

Though all systems naturally generate implicit signal, explicit signal in Intuition is expressed in a novel format that enables and incentivizes the creation of many-to-one, non-deterministic attestations. In Intuition, these semantic statements do not have a single 'issuer' - instead, anyone/anything can signal support or rejection of any existing statement/attestation at any point in time. This decoupling of information from 'who is presently expressing/supporting that information' introduces the ability to accommodate many-to-one attestations, making the data significantly more usable - especially for more complex use cases that involve the concept of transitive signal, such as reputation.

To accomplish this, the Intuition system enables users to maintain positions on Atoms and Triples, interpreting these positions as explicit signal from the user. This mechanism can be implemented using tokens or other accounting systems that have the ability to track user balances over time across an arbitrarily large number of entities.

## Atom Signal

Within the Intuition framework, users signal their belief in the relevance of an Atom by adjusting their balance on that Atom. This balance can be increased or decreased arbitrarily.

A balance of zero implies no signal, while any positive balance indicates a degree of belief in the Atom's relevance. This mechanism is economically driven: users earn fees proportional to their ownership stake in an Atom as other users interact with it. Thus, if a user deems an Atom relevant, they are incentivized to signal its relevance to receive these rewards.

Negative integers may be used if the Intuition system's implementation aims to allow users to explicitly signal the irrelevance of an Atom. In systems without negative balances, the absence of a positive signal can serve as an indication of the Atom's irrelevance.

## Triple Signal

In the Intuition framework, users signal their belief in both the relevance and truthfulness of a Triple by modifying their balance on that Triple. Triple balances can be any integer, allowing for a nuanced expression of belief.

A balance of zero indicates no signal. A negative balance signals a rejection of the Triple, explicitly indicating that the Triple is considered false, and that this falsehood is relevant.

Conversely, a positive balance affirms the Triple, explicitly indicating that the Triple is considered true, and that this truthfulness is relevant.

For example, with a Triple asserting "\[Vitalik\]\[is\] \[trustworthy\]," users would express their belief in its truthfulness, and the relevancy of this truthfulness, by increasing their balance on the affirmative side of the Triple, or signal disbelief by decreasing their balance into the negative. This mechanism allows for nuanced expressions of trust and belief within the decentralized ecosystem.

This system enables each "statement" to exist in different states based on who is affirming or rejecting it. To illustrate the power of this approach, consider the example of building a decentralized list of followers. In a traditional one-to-one model, where each claim or attestation has a single issuer, if a user had 1,000 followers, there would be 1,000 separate "following" claims. Most of this data would be redundant, as the "following Y" part would remain constant across all claims. Additionally, this data would only be easily reconcilable assuming consistent standards and schemas across all claims.

In contrast, the Intuition model simplifies this by having a single Triple representing a statement such as "I am following Y." Users would then adjust their balances on this statement to express their stance. To see all followers of Y, one would simply examine the "I am following Y" Triple and identify who has positive balances on the affirmative side. This approach consolidates data, reducing redundancy and making it easier to verify and aggregate information.

Furthermore, the ability to adjust balances allows for a more nuanced expression of preferences. In the context of a 'follow' functionality, instead of a flat follow list where all followers are treated equally, users could explicitly signal varying levels of interest or endorsement. By increasing their balance on the followers they value more, users can effectively rank their follow list. This means that someone could show a stronger preference for certain individuals or entities by staking more tokens on their affirmations, creating a dynamic and tiered system of trust and preference. This not only enhances the granularity of data but also provides richer insights into user preferences and social dynamics within the network. 