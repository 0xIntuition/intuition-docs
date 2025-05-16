---
sidebar_position: 2
---

# Atoms

A system facilitating the arrival at social consensus around globally persistent canonical identifiers for all things demands that these identifiers possess a few key attributes.

Firstly, these identifiers should be decentralized identifiers, providing unique, secure, and verifiable identification without any reliance on a central authority.
Secondly, these identifiers should have a sufficient amount of associated data to ensure precise referencing of specific entities, concepts, or pieces of information. Without this contextual data, it would be unclear what each identifier is meant to represent.
Thirdly, these identifiers must have some agent-centric state that is capable of tracking the usage of the identifier across contexts. This enables the community to discern which identifiers are being most frequently used to represent different concepts in different settings.
To solve for these requirements, the concepts of Atoms emerge as the foundation of the Intuition framework, representing the most fundamental units of data. These units can range from a single word to a complex concept, serving as discrete, manageable, and referenceable pieces of information that facilitate seamless data integration and manipulation across the web. By taking arbitrary data of any size and prescribing it a decentralized identifier, we can:

Start to reference data universally across the web.
Grant users equity in data as they signal its relevancy through usage.
Reward users for signaling the relevancy of data, thereby encouraging active participation and accurate data representation.
Each Atom is made universally referenceable through a decentralized identifier. This approach ensures that every Atom is uniquely identifiable and can be consistently referenced across the web, maintaining data integrity and meaning regardless of the system or context.

// An example DID

did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736

// An example DID Document

To ensure reliable referencing of entities, concepts, or data within an Atom, each Atom must include at least minimal corresponding data. This data can be of any type, stored anywhere, and presented in any format. However, using a Verifiable Data Registry and adhering to supported data structures and schemas is recommended. Doing so strengthens the data's usability through guarantees around immutability, availability, liveness, and persistence. The uniqueness of each Atom is enforced by hashing its underlying data, preventing duplicate Atoms for the same piece of data. For mutable data, it is essential to include a timestamp, ensuring that any future references understand exactly what the data represented at the moment of attestation.

This approach allows Atoms to segment data into discrete, manageable units that can be easily combined and reused across diverse contexts and applications. By structuring data in this way, Atoms support adaptable and flexible digital systems, ensuring seamless interoperability across platforms. The composability of Atoms enhances the system’s functionality and versatility, allowing data to be efficiently leveraged in various settings and use cases.



Atom Ownership and Token Curated Registries
Given the permissionless nature of the system, multiple Atoms may be representative of the same concept. To foster consensus on high-quality Atoms and establish canonical identifiers for all things, Intuition employs the concept of a Token Curated Registry (TCR). In this model, users gain fractional ownership over the Atoms they interact with and receive a portion of the interaction fees each respective Atom generates, incentivizing engagement with popular Atoms.



As users increasingly interact with these Atoms, a TCR emerges, ranking Atoms based on their relevance using metrics such as an Atom’s Total Value Locked (TVL). This mechanism facilitates ecosystem convergence on and easy discoverability of the most valuable and widely accepted Atoms/identifiers representing each concept.

Previous
Primitives

The structuring of Atoms within the Intuition framework is guided by the principle of economic optimization. Given the economic bandwidth required for the creation of an Atom, it is economically advantageous to generate high-quality Atoms rather than suboptimal ones. Users are incentivized to ensure that the Atoms they create are maximally relevant and reusable to optimize their economic rewards.

Consider the concept of ‘trustworthy’. If a user intends to express a statement involving this concept and finds no existing Atom that adequately captures it, the user is motivated to create a new Atom. In doing so, the user might adhere to established schemas such as the https://schema.org/DefinedTerm, incorporating as much pertinent data as possible. Additionally, the user might reference the concept ‘trustworthy’ within a lexical corpus like WordNet to enhance the Atom’s utility across different languages.

While it is possible for the user to create an Atom that merely represents the raw string ‘trustworthy’, this approach would likely result in an Atom that is less useful to other users. Consequently, other participants may prefer to utilize more comprehensive Atoms. Therefore, it is in the best interest of system participants to create and converge on Atoms that effectively and optimally describe the intended concepts.

A Token Curated Registry of Atoms
With these mechanics in place, Intuition creates a global, permissionless, decentralized TCR of decentralized identities for all things—forming something akin to a universal, crowdsourced dictionary. This ‘dictionary’, which can grow to encompass all entities, concepts, and data, serves as the foundation for expressing complex concepts.

As users create and interact with Atoms, they are economically motivated to produce and utilize Atoms that are highly relevant, reusable, and well-structured. Through the allocation of economic bandwidth and user engagement, Atoms that best represent concepts and meet the needs of the community will naturally rise to the top of the registry.

This TCR mechanism creates a dynamic and self-regulating system where the value of Atoms is continually assessed and validated by the collective actions of the users. The economic incentives ensure that participants are driven to contribute high-quality data, fostering an environment of continuous improvement and refinement. In this way, the Intuition system evolves into a comprehensive registry of all concepts, represented by Atoms, where the most effective and widely accepted representations are prominently featured.