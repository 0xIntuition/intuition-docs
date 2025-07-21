---
sidebar_position: 2
---

# Protocol SDK

The Protocol SDK provides a low-level interface for interacting with the Intuition network. It handles:

- Network communication
- Message signing and verification
- State synchronization
- Data attestation

## Installation

```bash
npm install @intuition/protocol
```

## Quick Start

```typescript
import { IntuitionProtocol } from '@intuition/protocol';

const protocol = new IntuitionProtocol({
  endpoint: 'https://protocol.intuition.systems',
  privateKey: 'your-private-key'
});

// Connect to the network
await protocol.connect();

// Publish an attestation
await protocol.publish({
  type: 'attestation',
  content: {
    claim: 'User completed task X',
    subject: '0x123...',
    confidence: 0.95
  }
});
```

## Key Concepts

- **Attestations**: Signed claims about entities or relationships
- **Trust Scores**: Reputation metrics derived from attestations
- **State Channels**: Efficient off-chain communication
- **Proofs**: Cryptographic verification of claims

For more details on these concepts, see our [Primitives guide](/guides/primitives/atoms). 