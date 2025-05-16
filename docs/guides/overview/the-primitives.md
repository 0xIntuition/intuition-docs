---
sidebar_position: 3
---

# The Primitives

The Intuition System is built on a set of novel primitives, which form the foundation of the ecosystem and enable the creation of a structured, semantic web of trust. 

<aside>

Intuition introduces three new primitives: 

1. **Atoms**: Intuition’s atomic unit of knowledge, enabling unique, persistent, canonical identifiers for all things - not just people.
2. **Triples:** A composition of Atoms - defined as [Semantic Triples](https://en.wikipedia.org/wiki/Semantic_triple) which represent the relationships between Atoms
3. **Signal:** The weight of Atoms and Triples, derived from the total amount of ETH deposited in Atom and Triple Vaults
</aside>

# Atoms

---

Atoms are the most basic units of knowledge within Intuition, functioning as unique, globally persistent, decentralized identifiers for all things—people, concepts, products, and more. Each Atom serves as a building block for more complex data structure and facilitates the deterministic and semantic organization of information within the knowledge graph. 

### Understanding Atoms

The digital universe is vast, where everything from tangible objects to abstract concepts can be endowed with a digital identity. Atoms confer unique recognition and definition to persons, places, ideas, or even memes, ensuring each entity's distinct presence. Within Intuition, every Atom is secured by a unique DID ([Decentralized Identifier](https://www.w3.org/TR/did-core/)) and an Ethereum wallet address, establishing a verifiable foundation.

Atoms are categorized into three primary roles within semantic structures: **Subjects**, **Predicates**, and **Objects**. This structure facilitates the creation of **Triples** that articulate specific assertions or facts about the world.

Let's look at an example **Triple**, in the format of **Subject - Predicate - Object:**

**`Alice** [Subject] **- hasAccessTo** [Predicate] **- Intuition** [Object]`

- **Alice** is the **Subject**
- **hasAccessTo** is the **Predicate**
- **Intuition** is the **Object**

Further illustrating the flexibility of Atoms, **Intuition** can also act as a **Subject:**

**`Intuition** [Subject] - **is a** [Predicate] - **Ethereum-based attestation protocol** [Object]`

This claim demonstrates Intuition's role and essence in a semantic, structured format.

### Composition of Knowledge

Acknowledging the potential for any entity, concept, or piece of data to hold a digital identity opens the door to collaboratively crafting an expansive knowledge graph. By arranging Atoms into Triples, we co-create a graph mapping out entities' interrelations and factual, verifiable assertions about the world.

The journey within Intuition starts with an Atom. Engaging with this concept might begin by identifying entities within your realm of knowledge that fit neatly into the categories of Subjects, Predicates, or Objects. This process is a first step toward contributing to our collective mission: building a collaborative knowledge graph demonstrating the connections and relationships among all entities

![Frame.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/a0d93219-9222-4c83-b4ac-813b5a29b7cb/0bfbfb16-5d99-45e8-932b-b7100c02d92c/Frame.png)

### Components of an Atom

- **Atom Data:** Describes the concept or entity represented by an Atom, **typically stored off-chain** using decentralized storage solutions like IPFS or Arweave, with a URI pointing to this data stored on-chain.
- **Atom Wallet:** A smart contract wallet associated with each Atom, granting it agency over its identity. This wallet is controlled by a specialized smart contract known as the Atom Warden
- **Atom Vault:** A mechanism that allows users to deposit tokens into an Atom, signaling its relevance and support within the system. The Total Value Locked (TVL) in an Atom Vault indicates the Atom’s acceptance and importance.

# Triples

---

Triples are higher-order structures within Intuition, used to define relationships between Atoms. Each Triple consists of three components: a Subject, Predicate, and Object, all of which are Atoms. This structure enables precise, machine-readable representations of data, facilitating complex and interconnected attestations.

**Triple Structure:**

- **Subject:** The entity or concept being described.
- **Predicate:** The relationship or attribute of the subject.
- **Object:** The value or characteristic attributed to the subject.

![In this example, each component—Subject, Predicate, and Object—is an Atom, and the Triple expresses a specific relationship between these Atoms](https://prod-files-secure.s3.us-west-2.amazonaws.com/a0d93219-9222-4c83-b4ac-813b5a29b7cb/f36e7365-bf48-4008-be71-0415a68fe691/triples1.png)

In this example, each component—Subject, Predicate, and Object—is an Atom, and the Triple expresses a specific relationship between these Atoms

Triples form the relationships between Atoms, allowing for arbitrarily-linked data across the web.

<aside>
💡 Triples can be used as Atoms in other Triples, allowing for the expression of arbitrarily complex statements in a standardized format.

</aside>

# Signal

---

Signal in Intuition refers to any action that expresses intent, belief, or support within the system. Signals can be explicit, such as voting mechanisms or signed attestations, or implicit, inferred from user behavior.

![Group 1321321403.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/a0d93219-9222-4c83-b4ac-813b5a29b7cb/759e2182-a480-4be4-b995-33d05778bfb0/Group_1321321403.png)

### Signal Mechanisms

Users hold positions on Atoms and Triples, signaling their stance by increasing their balance on the relevant entities. Signals contribute to the nuanced expression of trust and belief, allowing for a dynamic and tiered system of preferences within the decentralized ecosystem.

It is important to note that creating an Atom or Triple is distinctly different from taking a position on them. While users have the option to both create and take a position on an Atom/Triple at the time of creation, this Initial Deposit is not required. A user who makes no Initial Deposit will only create an Atom or Triple, which does not constitute a Signal.