---
id: atoms
title: Atoms
sidebar_label: Atoms
sidebar_position: 1
description: Understanding Atoms in Intuition
---

# Atoms

A system facilitating the arrival at social consensus around globally persistent canonical identifiers for all things demands that these identifiers possess a few key attributes.

- **Firstly,** these identifiers should be decentralized identifiers, providing unique, secure, and verifiable identification without any reliance on a central authority.
- **Secondly,** these identifiers should have a sufficient amount of associated data to ensure precise referencing of specific entities, concepts, or pieces of information. Without this contextual data, it would be unclear what each identifier is meant to represent.
- **Thirdly**, these identifiers must have some agent-centric state that is capable of tracking the usage of the identifier across contexts. This enables the community to discern which identifiers are being most frequently used to represent different concepts in different settings.

To solve for these requirements, the concepts of Atoms emerge as the foundation of the Intuition framework, representing the most fundamental units of data. These units can range from a single word to a complex concept, serving as discrete, manageable, and referenceable pieces of information that facilitate seamless data integration and manipulation across the web. By taking arbitrary data of any size and prescribing it a decentralized identifier, we can:

- Start to reference data universally across the web.
- Grant users equity in data as they signal its relevancy through usage.
- Reward users for signaling the relevancy of data, thereby encouraging active participation and accurate data representation.

Each Atom is made universally referenceable through a decentralized identifier. This approach ensures that every Atom is uniquely identifiable and can be consistently referenced across the web, maintaining data integrity and meaning regardless of the system or context.

## Example DID

```json
// An example DID

did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736

// An example DID Document

{
    "id": "did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736",
    "verificationMethod": [
        {
            "id": "did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736#controller",
            "type": "EcdsaSecp256k1RecoveryMethod2020",
            "controller": "did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736",
            "blockchainAccountId": "eip155:1:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
        }
    ],
    "authentication": [
        "did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736#controller"
    ],
    "assertionMethod": [
        "did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736#controller"
    ],
    "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/secp256k1recovery-2020/v2",
        "https://w3id.org/security/v3-unstable"
    ]
}
```

To ensure reliable referencing of entities, concepts, or data within an Atom, each Atom must include at least minimal corresponding data. This data can be of any type, stored anywhere, and presented in any format. However, using a Verifiable Data Registry and adhering to supported data structures and schemas is recommended. Doing so strengthens the data's usability through guarantees around immutability, availability, liveness, and persistence. The uniqueness of each Atom is enforced by hashing its underlying data, preventing duplicate Atoms for the same piece of data. For mutable data, it is essential to include a timestamp, ensuring that any future references understand exactly what the data represented at the moment of attestation.

This approach allows Atoms to segment data into discrete, manageable units that can be easily combined and reused across diverse contexts and applications. By structuring data in this way, Atoms support adaptable and flexible digital systems, ensuring seamless interoperability across platforms. The composability of Atoms enhances the system's functionality and versatility, allowing data to be efficiently leveraged in various settings and use cases.

## Atom Ownership and Token Curated Registries

Given the permissionless nature of the system, multiple Atoms may be representative of the same concept. To foster consensus on high-quality Atoms and establish canonical identifiers for all things, Intuition employs the concept of a Token Curated Registry (TCR). In this model, users gain fractional ownership over the Atoms they interact with and receive a portion of the interaction fees each respective Atom generates, incentivizing engagement with popular Atoms.

As users increasingly interact with these Atoms, a TCR emerges, ranking Atoms based on their relevance using metrics such as an Atom's Total Value Locked (TVL). This mechanism facilitates ecosystem convergence on and easy discoverability of the most valuable and widely accepted Atoms/identifiers representing each concept. 