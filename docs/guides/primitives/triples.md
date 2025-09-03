---
title: Triples
sidebar_position: 3
---

# Triples

Triples are the semantic relationships that connect Atoms, forming the structured knowledge graph that powers Intuition's decentralized intelligence layer.

## What are Triples?

A Triple is a three-part statement that expresses a relationship between Atoms, following the Subject-Predicate-Object (SPO) pattern. This fundamental structure, borrowed from semantic web standards like RDF, enables:

- **Semantic Relationships**: Express any type of connection between entities
- **Queryable Knowledge**: Create structured, searchable information
- **Composable Claims**: Build complex knowledge from simple statements

## Triple Structure

Every Triple consists of three components:

### Subject
The entity that the statement is about
- Must be an existing Atom
- Represents the "who" or "what"
- The focus of the statement

### Predicate  
The relationship or property being expressed
- Can be an Atom or a string
- Represents the "verb" or "property"
- Defines the type of connection

### Object
The target or value of the relationship
- Must be an existing Atom
- Represents the complement of the subject
- Completes the statement

### Example
```
[Alice] -- [knows] --> [Bob]
Subject    Predicate    Object
```

## Creating Triples

### Basic Triple Creation
```javascript
const triple = await createTriple({
  subjectId: aliceAtom.id,
  predicateId: knowsAtom.id,
  objectId: bobAtom.id
});
```

### With Metadata
```javascript
const triple = await createTriple({
  subjectId: companyAtom.id,
  predicateId: "employs",
  objectId: developerAtom.id,
  metadata: {
    startDate: "2024-01-01",
    role: "Senior Developer",
    department: "Engineering"
  }
});
```

## Types of Triples

### Identity Triples
Express identity relationships:
- `[User] -- [is] --> [Developer]`
- `[Wallet] -- [owns] --> [NFT]`
- `[Entity] -- [controls] --> [Account]`

### Property Triples
Define characteristics:
- `[Product] -- [has-color] --> [Blue]`
- `[Document] -- [has-status] --> [Verified]`
- `[Token] -- [has-supply] --> [1000000]`

### Action Triples
Represent activities:
- `[User] -- [created] --> [Content]`
- `[Contract] -- [deployed-by] --> [Developer]`
- `[Validator] -- [verified] --> [Transaction]`

### Relationship Triples
Connect entities:
- `[Company] -- [partner-of] --> [Organization]`
- `[Project] -- [funded-by] --> [Investor]`
- `[Document] -- [references] --> [Source]`

## Triple Economics

### Creation Costs
Creating a Triple requires:
- **Base Fee**: Network transaction cost
- **Storage Fee**: For permanent data storage
- **Stake Amount**: Optional stake for higher weight

### Value Mechanisms
Triples gain value through:
- **Signal Accumulation**: More attestations increase value
- **Network Usage**: Frequently queried Triples
- **Semantic Importance**: Critical relationships in the graph

## Querying Triples

### By Subject
Find all Triples about a specific entity:
```graphql
query {
  triples(where: { subjectId: "atom_123" }) {
    predicate
    object {
      data
    }
  }
}
```

### By Relationship
Find all instances of a relationship:
```graphql
query {
  triples(where: { predicate: "owns" }) {
    subject {
      data
    }
    object {
      data
    }
  }
}
```

### Complex Queries
Chain multiple Triple queries:
```graphql
query {
  triples(where: { 
    subjectId: "user_456",
    predicate: "member-of"
  }) {
    object {
      triples(where: { predicate: "located-in" }) {
        object {
          data
        }
      }
    }
  }
}
```

## Triple Validation

### Semantic Validation
Ensure Triples make semantic sense:
- Valid subject-predicate combinations
- Appropriate object types
- Logical consistency

### Community Validation
Triples gain credibility through:
- Signal attestations
- Peer review
- Usage patterns

### Programmatic Validation
Smart contracts can enforce:
- Type constraints
- Permission requirements
- Business logic rules

## Advanced Concepts

### Triple Chains
Create sequences of related Triples:
```
[Document] -- [created-by] --> [Author]
[Author] -- [affiliated-with] --> [Institution]
[Institution] -- [located-in] --> [Country]
```

### Bidirectional Relationships
Express inverse relationships:
```
[Alice] -- [follows] --> [Bob]
[Bob] -- [followed-by] --> [Alice]
```

### Temporal Triples
Include time-based context:
```javascript
const employment = await createTriple({
  subjectId: person.id,
  predicateId: "employed-by",
  objectId: company.id,
  metadata: {
    validFrom: "2023-01-01",
    validUntil: "2024-12-31"
  }
});
```

## Best Practices

### Predicate Standards
- Use consistent predicate naming
- Follow community conventions
- Document custom predicates

### Triple Reusability
- Avoid duplicate Triples
- Reference existing relationships
- Build on established patterns

### Semantic Clarity
- Make relationships explicit
- Avoid ambiguous predicates
- Provide context through metadata

## Use Cases

### Knowledge Graphs
Build comprehensive knowledge networks:
- Academic citations
- Research connections
- Information hierarchies

### Identity & Reputation
Create verifiable identity systems:
- Professional credentials
- Social connections
- Achievement records

### Supply Chain
Track product journeys:
- Origin verification
- Ownership transfers
- Quality attestations

### DeFi & Finance
Express financial relationships:
- Asset ownership
- Lending positions
- Liquidity provisions

## Example Implementations

### Building a Social Graph
```javascript
// Create user Atoms
const alice = await createAtom({ data: "user:alice" });
const bob = await createAtom({ data: "user:bob" });
const charlie = await createAtom({ data: "user:charlie" });

// Create relationship Triples
await createTriple({
  subjectId: alice.id,
  predicateId: "follows",
  objectId: bob.id
});

await createTriple({
  subjectId: bob.id,
  predicateId: "follows",
  objectId: charlie.id
});

await createTriple({
  subjectId: alice.id,
  predicateId: "friend-of",
  objectId: charlie.id
});
```

### Creating a Credential System
```javascript
// Create credential components
const university = await createAtom({ data: "MIT" });
const degree = await createAtom({ data: "Computer Science Degree" });
const student = await createAtom({ data: "student:john" });

// Create credential Triple
const credential = await createTriple({
  subjectId: student.id,
  predicateId: "earned-degree",
  objectId: degree.id,
  metadata: {
    institution: university.id,
    year: 2023,
    honors: "Summa Cum Laude"
  }
});

// Add verification
await createSignal({
  tripleId: credential.id,
  attestation: "verified",
  stake: 1000
});
```

## Integration with Other Primitives

### With Atoms
- Triples connect Atoms into meaningful relationships
- Atoms gain context through Triple connections
- Triple predicates can themselves be Atoms

### With Signals
- Signals add weight to Triple claims
- Community validates Triples through Signals
- Signal strength affects Triple credibility

## Next Steps

- Learn about [Signals](./signals) to add attestations to Triples
- Review [Atoms](./atoms) to understand Triple components
- Explore the [GraphQL API](/docs/developer-tools/graphql-api/overview) for querying
- Check [Smart Contracts](/docs/developer-tools/contracts/contract-architecture) for on-chain implementation