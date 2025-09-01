---
title: Atoms
sidebar_position: 2
---

# Atoms

Atoms are the fundamental building blocks of the Intuition knowledge graph - universal identifiers that can represent any entity, concept, or piece of information.

## What are Atoms?

An Atom is a unique, immutable identifier that represents a single entity or concept within the Intuition ecosystem. Think of Atoms as the "nouns" of our semantic system - they can represent:

- **People**: Individual identities, profiles, or accounts
- **Organizations**: Companies, DAOs, institutions
- **Concepts**: Ideas, topics, categories
- **Objects**: Products, assets, documents
- **Properties**: Attributes, characteristics, qualities
- **Actions**: Verbs, events, processes

## Key Characteristics

### Universal Identity
Every Atom has a unique identifier that remains consistent across the entire network. This universality enables:
- Cross-application data portability
- Consistent referencing across platforms
- Decentralized identity management

### Immutability
Once created, an Atom's core identity cannot be changed. This ensures:
- Permanent, reliable references
- Historical consistency
- Trust in data integrity

### Composability
Atoms can be combined to form more complex structures:
- Used as subjects, predicates, or objects in Triples
- Referenced across multiple relationships
- Building blocks for semantic networks

## Creating Atoms

### Basic Creation
```javascript
// Creating a simple Atom
const atom = await createAtom({
  data: "Ethereum",
  type: "concept"
});
```

### Structured Data
Atoms can contain structured metadata:
```javascript
const personAtom = await createAtom({
  data: {
    name: "Alice",
    type: "person",
    attributes: {
      role: "developer",
      expertise: ["smart contracts", "DeFi"]
    }
  }
});
```

## Atom Economics

### Creation Cost
Creating an Atom requires:
- **Staking**: Lock a minimum amount of tokens
- **Fees**: Network transaction fees
- **Storage**: Cost for permanent data storage

### Value Accrual
Atoms gain value through:
- **Usage**: Frequency of references in Triples
- **Signals**: Attestations from users
- **Network Effects**: Increased utility as more applications use them

## Atom Types

### Identity Atoms
Represent individual entities:
- User profiles
- Wallet addresses
- Digital identities

### Concept Atoms
Abstract ideas and categories:
- Topics
- Tags
- Classifications

### Property Atoms
Attributes and characteristics:
- Colors
- Sizes
- Qualities

### Action Atoms
Verbs and processes:
- "owns"
- "created"
- "verified"

## Best Practices

### Naming Conventions
- Use clear, descriptive identifiers
- Follow consistent formatting
- Consider internationalization

### Reusability
- Check for existing Atoms before creating duplicates
- Use canonical forms for common concepts
- Leverage community-created Atoms

### Metadata Standards
- Include relevant context
- Use standardized schemas
- Provide clear descriptions

## Atom Discovery

### Searching
Find existing Atoms through:
- GraphQL queries
- Semantic search
- Registry browsing

### Registry
The Atom Registry maintains:
- Global Atom directory
- Metadata indexes
- Usage statistics

## Integration

### Smart Contracts
Atoms are managed on-chain through:
- Registry contracts
- Factory patterns
- Access controls

### APIs
Access Atoms via:
- GraphQL endpoints
- REST APIs
- SDK methods

### SDKs
Work with Atoms using:
- JavaScript/TypeScript SDK
- Python SDK
- Direct contract interaction

## Advanced Concepts

### Atom Hierarchies
Create structured relationships:
- Parent-child relationships
- Categorical organizations
- Taxonomies

### Atom Versioning
While Atoms are immutable, you can:
- Create new versions as separate Atoms
- Link versions through Triples
- Maintain version history

### Atom Governance
Community mechanisms for:
- Dispute resolution
- Quality standards
- Naming conflicts

## Use Cases

### Identity Management
- Decentralized profiles
- Reputation systems
- Access control

### Knowledge Organization
- Tagging systems
- Content categorization
- Semantic search

### Asset Representation
- NFT metadata
- Token identities
- Digital certificates

## Example Implementations

### Creating a User Profile
```javascript
// Create user Atom
const userAtom = await createAtom({
  data: "user:alice",
  metadata: {
    displayName: "Alice",
    avatar: "ipfs://..."
  }
});

// Create skill Atoms
const skillAtom = await createAtom({
  data: "skill:solidity"
});

// Link with Triples
const hasSkill = await createTriple({
  subject: userAtom.id,
  predicate: "has-skill",
  object: skillAtom.id
});
```

### Building a Taxonomy
```javascript
// Create category Atoms
const techAtom = await createAtom({ data: "category:technology" });
const blockchainAtom = await createAtom({ data: "category:blockchain" });

// Create hierarchy
const isSubcategory = await createTriple({
  subject: blockchainAtom.id,
  predicate: "subcategory-of",
  object: techAtom.id
});
```

## Next Steps

- Learn about [Triples](./triples) to create relationships between Atoms
- Explore [Signals](./signals) to add attestations to Atoms
- Review the [SDK Documentation](/docs/developer-tools/sdks/overview) for implementation details
- Check [Smart Contracts](/docs/developer-tools/contracts/contract-architecture) for on-chain interactions