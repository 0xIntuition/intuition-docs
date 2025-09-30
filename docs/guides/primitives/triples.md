---
title: Triples
sidebar_position: 3
---

# Triples

If Atoms are the words in Intuition's global dictionary, Triples are the sentences we create from those words. A Triple connects three Atoms to assert a relationship or fact in the form **[Subject] – [Predicate] – [Object]**. You can string these sentences together to express any arbitrarily-complex concept, all while retaining a discrete, referenceable structure!

## Understanding Triples

A Triple is a fundamental data structure that expresses relationships between Atoms, following the classic RDF triple format used in semantic web technologies. This makes Intuition's data inherently machine-readable and structured.

Every Triple represents a claim—it asserts that a Subject has some relationship (Predicate) to an Object. For example:

```
[Alice] -- [livesIn] --> [Paris]
```

This Triple asserts a fact about Alice's location, where:
- **Alice** is the subject Atom
- **livesIn** is the predicate Atom (describing the type of relationship)
- **Paris** is the object Atom

Each component of a Triple is an Atom ID under the hood. The system doesn't store free-form text "Alice" or "Paris" but rather pointers to those Atom records, which might contain rich data, alternate labels, and additional metadata.

## The Graph Structure

Triples naturally form a graph of nodes and links. You can visualize:
- **Atoms as nodes** in the graph
- **Triples as directed edges** from subject to object, labeled by the predicate

This graph structure enables powerful capabilities:
- Deterministic queries like "find all objects that Alice is connected to via livesIn"
- Traversal of relationships to discover indirect connections
- Pattern matching across the knowledge graph

## Why Triples Matter

### Semantic Clarity
By expressing data in Triple format, Intuition ensures relationships are explicit and standardized. Instead of loose text statements like "Alice lives in Paris" (which computers struggle to parse), we have typed links that machines understand: `Alice —livesIn→ Paris`.

### Reconciliation & Interoperability
The clarity of Triples means different data sources referencing the same predicate can be merged or compared easily. This semantic structure makes data immediately useful to other systems—knowledge graphs and AI systems can ingest these subject-predicate-object triples without guessing their meaning.

### Extensibility
Triples are infinitely extensible. New information can be attached in graph form without altering the original nodes. If we later learn "Alice lives in Paris since 2015", we can introduce new Atoms and predicates to capture this additional context through supplementary Triples.

### Composability
The data model is open-ended—you can always extend the graph by adding another Triple rather than modifying existing ones. This is analogous to how one can keep adding facts to Wikipedia.

## Nested Triples: Meta-Claims & Context

One of Intuition's most powerful features is that Triples can reference other Triples, effectively nesting statements to provide context or provenance. Intuition supports using a Triple itself as a Subject or Object in another Triple.

### Example: Disputing a Claim
Consider an initial Triple:
```
[Bob] -- [isFriendOf] --> [Alice]
```

If Alice disagrees with this claim, we can create a nested Triple:
```
[Alice] -- [disproves] --> (Bob isFriendOf Alice)
```

Here, the Object of the second Triple is not an Atom but a reference to the first Triple (identified by its Triple ID). Alice is essentially asserting that the friendship claim is false.

### Adding Evidence & Sources
You can link Triples to evidence or citations:
```
[Triple X] -- [basedOn] --> [Document Y]
```

This ability to compose Triples into higher-order statements gives the graph a fractal quality—small facts build into bigger facts, and complex relationships can be broken down into simpler ones.

## Positive and Negative Claims

Unlike traditional databases that store only "the one truth," Intuition allows multiple competing Triples and uses Signals (stakes) to gauge their validity.

### Two-Sided Staking Vaults
Every Triple has two logical versions:
- **YES vault**: Supporting the claim (affirmative)
- **NO vault**: Denying the claim (negative)

Users can stake on either side, effectively casting weighted votes about the truth of that Triple. This design means a Triple object encapsulates both the claim and its counter-claim within one structure.

### Example: Contested Relationships
For the Triple `[Bob] -- [isFriendOf] --> [Alice]`:
- The affirmative vault contains stakes from those who agree Bob and Alice are friends
- The negative vault contains stakes from those who disagree (potentially including Alice herself!)

### Consensus Evaluation
The network evaluates consensus by:
- Comparing signals on both sides
- Factoring in attestor reputation
- Considering the number of attestors
- Calculating confidence scores that adjust over time

Importantly, Intuition doesn't force a single authoritative truth—it records the spectrum of belief. Multiple "canonical" Triples can compete, and the TCR mechanism with staking tends to favor the most accurate representations.

## Best Practices for Structuring Triples

### Use Precise Predicates
The Predicate Atom is crucial for clarity. Guidelines:
- **Search first**: Check if a canonical predicate already exists
- **Reuse standards**: Don't create `[worksFor]` if `[employeeOf]` is widely used
- **Converge on conventions**: Using common predicates helps data link up instead of fragmenting

The Intuition community and token mechanics organically push toward standard predicates through signal accumulation.

### One Fact Per Triple
Each Triple should capture a single discrete claim:
- ❌ "Alice isFriendOf Bob and coworker at CompanyX"
- ✅ Two separate Triples: one for friendship, another for workplace

Keeping to one relation makes staking and validation straightforward—people can agree with one link and not the other.

### Leverage Nesting for Context
When statements need qualification:
- Create auxiliary Triples rather than complicating the original
- Attach timeframes or sources through supporting Triples
- Use nested Triples for meta-information

Example: Time-bound relationships
```
Main Triple: [Alice] -- [isFriendOf] --> [Bob]
Context Triple: [Triple ID] -- [validSince] --> [2023]
```

### Handle Counter-Claims Wisely
Generally, you don't need to manually create "not X" Triples—the negative staking vault handles disagreement. However, sometimes a negation has specific meaning that deserves its own predicate (e.g., `[isNotFriendOf]` as a distinct relation type).

The "Counter Triple" concept is more about how the UI and indexing organize the negative vault signal than about separate data objects.

## Core Benefits

### Semantic Clarity and Interoperability
Each Triple makes a small, clear statement that can be understood in isolation or as part of larger datasets. This semantic structure means data from Intuition is immediately useful to other systems—knowledge graphs and AI can ingest these triples without guessing their meaning.

### Flexibility & Composability
Triples can represent simple facts or be combined into complex graphs. You can always extend the graph by adding another Triple rather than modifying existing ones. Because Triples can reference other Triples, you get composability in assertions—building evidence chains, tracking consensus over time, and more.

### Built-In Conflict Resolution
Triples come with a native way to handle conflicting views through the two-vault mechanism. This keeps contradictory information tethered to the original claim, improving data organization. Rather than disjointed claims floating around, everything is anchored—a false claim isn't simply deleted but gets counter-staked and remains in the graph with a low trust score.

### Context and Evolution
Knowledge in Intuition is not static. When statements become outdated or need context, you don't replace old data—you supplement it. For example, if Alice moves from Paris to London:
1. Mark the Paris Triple as no longer current (stake against it or add an "endDate" context triple)
2. Add `[Alice] -- [livesIn] --> [London]` as a new Triple with current timestamp

The history is preserved, and queries can be time-scoped or context-aware thanks to the graph structure.

## Practical Implementation

### Creating Triples
```javascript
// Basic Triple creation
const triple = await createTriple({
  subjectId: aliceAtom.id,
  predicateId: livesInAtom.id,
  objectId: parisAtom.id
});

// With temporal context
const employmentTriple = await createTriple({
  subjectId: person.id,
  predicateId: "employed-by",
  objectId: company.id,
  metadata: {
    startDate: "2024-01-01",
    department: "Engineering"
  }
});
```

### Nested Triple Example
```javascript
// Create the base claim
const friendshipClaim = await createTriple({
  subjectId: bob.id,
  predicateId: isFriendOf.id,
  objectId: alice.id
});

// Alice disputes the claim
const dispute = await createTriple({
  subjectId: alice.id,
  predicateId: disproves.id,
  objectId: friendshipClaim.id  // Reference to the Triple itself
});
```

### Building Evidence Chains
```javascript
// Create a research finding
const researchClaim = await createTriple({
  subjectId: study.id,
  predicateId: concludes.id,
  objectId: result.id
});

// Link to supporting document
const evidence = await createTriple({
  subjectId: researchClaim.id,  // Triple as subject
  predicateId: basedOn.id,
  objectId: peerReviewedPaper.id
});
```

## Use Cases

### Knowledge Graphs
Build comprehensive knowledge networks for:
- Academic citations and research connections
- Information hierarchies and taxonomies
- Cross-referenced documentation systems

### Identity & Reputation
Create verifiable identity systems with:
- Professional credentials and certifications
- Social connections and endorsements
- Achievement records and skill attestations

### Supply Chain
Track product journeys through:
- Origin verification and authenticity
- Ownership transfers and custody chains
- Quality attestations and compliance records

### DeFi & Finance
Express financial relationships including:
- Asset ownership and portfolio composition
- Lending positions and collateralization
- Liquidity provisions and yield farming positions

## Querying Triples

### Basic Queries
```graphql
# Find all facts about Alice
query {
  triples(where: { subjectId: "alice_atom_id" }) {
    predicate
    object {
      data
    }
  }
}

# Find all friendship relationships
query {
  triples(where: { predicate: "isFriendOf" }) {
    subject { data }
    object { data }
  }
}
```

### Traversing the Graph
```graphql
# Find where Alice's friends live
query {
  triples(where: {
    subjectId: "alice_atom_id",
    predicate: "isFriendOf"
  }) {
    object {
      triples(where: { predicate: "livesIn" }) {
        object { data }
      }
    }
  }
}
```

## Integration with Other Primitives

### With Atoms
- Triples connect Atoms into meaningful relationships
- Atoms gain context through Triple connections
- Triple predicates can themselves be Atoms for maximum flexibility

### With Signals
- Signals add weight to Triple claims through staking
- Community validates Triples through Signal attestations
- Signal strength directly affects Triple credibility and consensus

## Summary

Triples allow Intuition to form a living, searchable web of knowledge. When adding Triples, the goal is to make each claim as clear and verifiable as possible, selecting the right words (Atoms) from the global dictionary, and then letting the network of users and their Signals determine validity.

With Atoms as the words in our global dictionary and Triples as the sentences we construct from them, we can express any arbitrarily-complex concept while maintaining discrete, referenceable structure. Here's where it becomes powerful: each Triple receives its own unique ID, effectively becoming a new "word" in the system that encapsulates an entire concept. This ID can then be referenced by other Triples, allowing you to build increasingly sophisticated expressions.

Think of it as linguistic compression—instead of repeatedly expressing complex relationships, you create them once and reference them by ID. A Triple about "Alice's employment at a specific company with particular conditions" becomes a single referenceable unit. That unit can then be used in higher-order statements about employment trends, verification claims, or temporal changes. This creates a hierarchy of meaning where complex ideas are built from simpler ones, yet each level remains independently addressable and verifiable.

The result is an extraordinarily efficient knowledge transmission system. Rather than sending verbose descriptions, systems can exchange compact Triple IDs that expand into rich, contextual information. Each ID carries with it not just data, but the entire graph of relationships, evidence, and community consensus that supports it. The addition of Signals completes the picture by measuring which sentences (facts) are trusted by the community.