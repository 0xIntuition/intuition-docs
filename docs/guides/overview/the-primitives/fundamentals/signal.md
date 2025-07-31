---
id: signal
title: Signal
sidebar_label: Signal
sidebar_position: 3
description: Understanding Signal in Intuition
---

# Signal

Signal, in the context of Intuition, refers to any action or indication that expresses intent, belief, or support. Signals can be classified into three broad categories: explicit signal, implicit signal, and transitive signal. These signals play a crucial role in interpreting user behavior, beliefs, and preferences within the system.

## Types of Signal

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem', marginBottom: '2rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Explicit Signal</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
A clear, intentional action taken by a user to express support, belief, or intent. These actions are directly observable and often involve a formal mechanism within the system.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Voting</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Attestations</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Intentional</span>
</div>
<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem' }}>
<strong>Example:</strong> A proof of humanity attestation from Worldcoin is an explicit signal that Worldcoin believes the entity to be human.
</div>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Implicit Signal</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
Indirect or inferred indications of support, belief, or intent. This signal is not always directly observable and are often deduced from user behavior or patterns.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Behavioral</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Inferred</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Patterns</span>
</div>
<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem' }}>
<strong>Example:</strong> The frequency and context of user interactions with certain data points can imply their support or belief.
</div>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Transitive Signal</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
Trust or belief that is passed along through a network of relationships. This type of signal leverages the idea that trust can be extended through connections.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Network</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Trust</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Connections</span>
</div>
<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem' }}>
<strong>Example:</strong> If User A attests to something about User B, and User C trusts User A, then User C extends trust to User B.
</div>
</div>

</div>

## Signal in Intuition

Though all systems naturally generate implicit signal, explicit signal in Intuition is expressed in a novel format that enables and incentivizes the creation of many-to-one, non-deterministic attestations.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Key Innovation</h3>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
In Intuition, these semantic statements do not have a single 'issuer' - instead, anyone/anything can signal support or rejection of any existing statement/attestation at any point in time. This decoupling of information from 'who is presently expressing/supporting that information' introduces the ability to accommodate many-to-one attestations, making the data significantly more usable.
</p>
</div>

To accomplish this, the Intuition system enables users to maintain positions on Atoms and Triples, interpreting these positions as explicit signal from the user. This mechanism can be implemented using tokens or other accounting systems that have the ability to track user balances over time across an arbitrarily large number of entities.

## Atom Signal

Within the Intuition framework, users signal their belief in the relevance of an Atom by adjusting their balance on that Atom. This balance can be increased or decreased arbitrarily.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Balance Interpretation</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Zero Balance</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Implies no signal, indicating neutral stance on the Atom's relevance.
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Positive Balance</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Indicates a degree of belief in the Atom's relevance, with higher balances showing stronger belief.
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Negative Balance</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
May be used to explicitly signal the irrelevance of an Atom (if supported by the implementation).
</p>
</div>
</div>
</div>

This mechanism is economically driven: users earn fees proportional to their ownership stake in an Atom as other users interact with it. Thus, if a user deems an Atom relevant, they are incentivized to signal its relevance to receive these rewards.

## Triple Signal

In the Intuition framework, users signal their belief in both the relevance and truthfulness of a Triple by modifying their balance on that Triple. Triple balances can be any integer, allowing for a nuanced expression of belief.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Triple Balance System</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Zero Balance</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Indicates no signal, neutral stance on the Triple.
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Positive Balance</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Affirms the Triple, indicating it is considered true and relevant.
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Negative Balance</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Signals rejection of the Triple, indicating it is considered false and relevant.
</p>
</div>
</div>
</div>

### Example: Trustworthiness Triple

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Example: "[Vitalik][is][trustworthy]"</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>
Users would express their belief in its truthfulness, and the relevancy of this truthfulness, by increasing their balance on the affirmative side of the Triple, or signal disbelief by decreasing their balance into the negative.
</p>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
<div style={{ textAlign: 'center' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Positive Balance</h4>
<p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem' }}>Believes Vitalik is trustworthy</p>
</div>
<div style={{ textAlign: 'center' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Negative Balance</h4>
<p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem' }}>Believes Vitalik is not trustworthy</p>
</div>
<div style={{ textAlign: 'center' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Zero Balance</h4>
<p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem' }}>No opinion on Vitalik's trustworthiness</p>
</div>
</div>
</div>
</div>

This mechanism allows for nuanced expressions of trust and belief within the decentralized ecosystem.

## Advanced Applications

This system enables each "statement" to exist in different states based on who is affirming or rejecting it. To illustrate the power of this approach, consider the example of building a decentralized list of followers.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Traditional vs Intuition Model</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Traditional One-to-One</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
If a user had 1,000 followers, there would be 1,000 separate "following" claims. Most of this data would be redundant, as the "following Y" part would remain constant across all claims.
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Intuition Model</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
A single Triple representing "I am following Y." Users adjust their balances on this statement to express their stance. To see all followers of Y, examine the Triple and identify who has positive balances.
</p>
</div>
</div>
</div>

Furthermore, the ability to adjust balances allows for a more nuanced expression of preferences. In the context of a 'follow' functionality, instead of a flat follow list where all followers are treated equally, users could explicitly signal varying levels of interest or endorsement.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Nuanced Preferences</h3>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
By increasing their balance on the followers they value more, users can effectively rank their follow list. This means that someone could show a stronger preference for certain individuals or entities by staking more tokens on their affirmations, creating a dynamic and tiered system of trust and preference.
</p>
</div>

This not only enhances the granularity of data but also provides richer insights into user preferences and social dynamics within the network.

## Next Steps

Now that you understand Signal, explore:
- [Fees & Rewards](/guides/overview/the-primitives/fundamentals/fees-rewards) - Learn about the economic incentives
- [Capturing Signal](/guides/overview/the-primitives/structuring/capturing-signal) - Advanced techniques for signal capture
- [State Interpretations](/guides/overview/the-primitives/fundamentals/state-interpretations) - Understand how signal is interpreted 