---
sidebar_position: 4
---

# Signals

Signal, in the context of Intuition, refers to any action or indication that expresses intent, belief, or support. Signals can be classified into three broad categories: explicit signal,  implicit signal, and transitive signal. These signals play a crucial role in interpreting user behavior, beliefs, and preferences within the system.

### Explicit Signal

An explicit signal is a clear, intentional action taken by a user to express support, belief, or intent. These actions are directly observable and often involve a formal mechanism within the system. Examples of explicit signals include voting mechanisms, where casting a vote represents a user’s preference. Verifiable claims and attestations are also forms of explicit signals; they are signed messages that convey specific information.

For instance, a proof of humanity attestation from a trust anchor like Worldcoin is an explicit signal from Worldcoin that Worldcoin believes the entity to be human (a valuable data point for sybil resistance efforts).

### Implicit Signal

Implicit signal involves indirect or inferred indications of support, belief, or intent. This signal is not always directly observable and are often deduced from user behavior or patterns. For example, the frequency and context of user interactions with certain data points can imply their support or belief. Implicit signal requires sophisticated analysis to interpret accurately, as it is embedded within the user’s activity data.

### Transitive Signal

Transitive signal refers to the trust or belief that is passed along through a network of relationships. This type of signal leverages the idea that trust can be extended through connections. For example, if User A attests to something about User B, and User C trusts User A, then User C is likely to extend some level of trust to User B, even without a direct interaction. This transitive nature of trust is vital in decentralized systems like Intuition, where direct trust relationships are not always possible. By harnessing transitive signals, the system can create a more interconnected and trust-rich environment, where the credibility of one entity can influence the perception and trustworthiness of others within the network.

# Signal in Intuition

---

Though all systems naturally generate implicit signal, explicit signal in Intuition is expressed in a novel format that enables and incentivizes the creation of many-to-one, non-deterministic attestations. In Intuition, these semantic statements do not have a single ‘issuer’ - instead, anyone/anything can signal support or rejection of any existing statement/attestation at any point in time. This decoupling of information from ‘who is presently expressing/supporting that information’ introduces the ability to accommodate many-to-one attestations, making the data significantly more usable - especially for more complex use cases that involve the concept of transitive signal, such as reputation.

![Group 1321321838.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/a0d93219-9222-4c83-b4ac-813b5a29b7cb/ddb261bf-1b5e-422e-80aa-e0cff496dc6c/Group_1321321838.png)

To accomplish this, the Intuition system enables users to maintain positions on Atoms and Triples, interpreting these positions as explicit signal from the user. This mechanism can be implemented using tokens or other accounting systems that have the ability to track user balances over time across an arbitrarily large number of entities.

## Atom Signal

Within the Intuition framework, users signal their belief in the relevance of an Atom by adjusting their balance on that Atom. This balance can be increased or decreased arbitrarily.

![Notion Image Frame atom deposits.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/a0d93219-9222-4c83-b4ac-813b5a29b7cb/68f25888-f8d1-4d41-a434-5e3ea6b69d65/Notion_Image_Frame_atom_deposits.png)

A balance of zero implies no signal, while any positive balance indicates a degree of belief in the Atom’s relevance. This mechanism is economically driven: users earn fees proportional to their ownership stake in an Atom as other users interact with it. Thus, if a user deems an Atom relevant, they are incentivized to signal its relevance to receive these rewards. 

Negative integers may be used if the Intuition system’s implementation aims to allow users to explicitly signal the irrelevance of an Atom. In systems without negative balances, the absence of a positive signal can serve as an indication of the Atom’s irrelevance.

## Triple Signal

In the Intuition framework, users signal their belief in both the relevance and truthfulness of a Triple by modifying their balance on that Triple. Triple balances can be any integer, allowing for a nuanced expression of belief.

A balance of zero indicates no signal. A negative balance signals a rejection of the Triple, explicitly indicating that the Triple is considered false, and that this falsehood is relevant. 

Conversely, a positive balance affirms the Triple, explicitly indicating that the Triple is considered true, and that this truthfulness is relevant.

For example, with a Triple asserting “[Vitalik] [is] [trustworthy],” users would express their belief in its truthfulness, and the relevancy of this truthfulness, by increasing their balance on the affirmative side of the Triple, or signal disbelief by decreasing their balance into the negative. This mechanism allows for nuanced expressions of trust and belief within the decentralized ecosystem.

![Notion Image Frame signal.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/a0d93219-9222-4c83-b4ac-813b5a29b7cb/781f75ca-a7db-417a-9676-a25dabebdc52/Notion_Image_Frame_signal.png)

This system enables each “statement” to exist in different states based on who is affirming or rejecting it. To illustrate the power of this approach, consider the example of building a decentralized list of followers. In a traditional one-to-one model, where each claim or attestation has a single issuer, if a user had 1,000 followers, there would be 1,000 separate “following” claims. Most of this data would be redundant, as the “following Y” part would remain constant across all claims. Additionally, this data would only be easily reconcilable assuming consistent standards and schemas across all claims.

In contrast, the Intuition model simplifies this by having a single Triple representing a statement such as “I am following Y.” Users would then adjust their balances on this statement to express their stance. To see all followers of Y, one would simply examine the “I am following Y” Triple and identify who has positive balances on the affirmative side. This approach consolidates data, reducing redundancy and making it easier to verify and aggregate information.

Furthermore, the ability to adjust balances allows for a more nuanced expression of preferences. In the context of a ‘follow’ functionality, instead of a flat follow list where all followers are treated equally, users could explicitly signal varying levels of interest or endorsement. By increasing their balance on the followers they value more, users can effectively rank their follow list. This means that someone could show a stronger preference for certain individuals or entities by staking more tokens on their affirmations, creating a dynamic and tiered system of trust and preference. This not only enhances the granularity of data but also provides richer insights into user preferences and social dynamics within the network.

# What Are Attestations?

**Attestations** are cryptographically signed statements about an entity or relationship. Paired with Atoms and Triples, Attestations serve as a powerful mechanism for users to express their perspectives on specific entities or claims within the Intuition ecosystem.

# Attestations in the Intuition Ecosystem

In Intuition, users can attest to both Atoms and Triples. While the process and implications differ slightly between the two, the core concept remains the same: users make statements about what they believe and back these statements with **ETH**, signaling their conviction.

## Attesting to Triples

When users attest to a Triple, they express either an endorsement or a refutation of the claim. The attestation reflects their state relative to the Triple:

- **Positive Attestation**: A positive integer indicates agreement or affirmation.
- **Negative Attestation**: A negative integer indicates disagreement or refutation.
- **Neutral State**: If no action is taken, the user’s state remains at `0`.

A user can hold only one active attestation position per Triple—either positive or negative, but not both.

### Example Triple

`Bob` - `is` - `Trustworthy`

This Triple asserts a specific trait about Bob: that he is trustworthy. Users can interact with this claim by attesting positively or negatively. Each interaction has a distinct meaning.

### Sample Scenarios

**Scenario 1: Positive Attestation**

Alice has worked with Bob and believes he is trustworthy. She stakes **1 ETH** to affirm the claim.

- Alice’s attestation indicates agreement with the claim and her **Conviction** (level of belief) is **1 ETH**.

**Scenario 2: Negative Attestation**

Sarah has had a negative experience with Bob and stakes **0.5 ETH** to refute the claim.

- Sarah’s attestation indicates disagreement with the claim and her **Conviction** is **0.5 ETH**.

# Many-to-One Attestations

In Intuition, statements (Claims) and user states (Attestations) are abstracted from each other. This enables **many-to-one attestations**, where multiple users can attest to a single Claim without duplicating it. By viewing the direction (positive or negative) and conviction (amount of ETH staked) of attestations, users can form their own conclusions about the validity of the Claim.

## Attesting to Atoms

Attestations for Atoms differ from those for Triples in that they are always **positive**. Users can endorse an Atom by staking ETH, signaling its importance or relevance.

## Example Lifecycle: Attesting to an Atom

1. **Identity Creation**
    
    Alice creates an Identity for "AliceCo," which now exists in the Intuition ecosystem with metadata such as name, description, and image.
    
2. **Community Interaction**
    
    Alice invites Sarah, her coworker, to explore the platform. Sarah notices the AliceCo Identity and agrees it is significant.
    
3. **Positive Attestation**
    
    Sarah stakes **1 ETH** on the AliceCo Atom, creating a positive attestation. Her **Conviction** is **1 ETH**, representing her level of agreement.
    

Through this process, users signal their agreement with an Atom and help establish its value within the ecosystem.

## Sharing Your Intuition

Users exploring the Intuition ecosystem can view the number and type of attestations associated with Identities and Claims. This transparency allows users to:

- Make informed decisions based on community feedback.
- Share their own perspectives by attesting to entities or relationships.

By participating in this process, users actively contribute to a decentralized, user-driven understanding of the world.