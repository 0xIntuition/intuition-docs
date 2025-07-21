---
sidebar_position: 4
---

# 1UI SDK

The 1UI SDK provides React components and hooks for building Intuition-powered applications. It includes:

- Pre-built UI components
- React hooks for data management
- Theme customization
- Accessibility features

## Installation

```bash
npm install @intuition/1ui
```

## Quick Start

```typescript
import { IntuitionProvider, useAttestation, TrustScore } from '@intuition/1ui';

function App() {
  return (
    <IntuitionProvider apiKey="your-api-key">
      <UserProfile userId="0x123..." />
    </IntuitionProvider>
  );
}

function UserProfile({ userId }) {
  const { data } = useAttestation(userId);
  
  return (
    <div>
      <TrustScore value={data.trustScore} />
      <AttestationList attestations={data.attestations} />
    </div>
  );
}
```

## Components

- **TrustScore**: Display trust scores with customizable visualizations
- **AttestationList**: Render lists of attestations with filtering
- **ClaimBuilder**: UI for creating and publishing claims
- **IdentityBadge**: Display user identities with verification status

## Hooks

- `useAttestation`: Query and subscribe to attestations
- `useTrustScore`: Get real-time trust scores
- `usePublish`: Publish new attestations
- `useVerify`: Verify claims and proofs

For more examples and component documentation, see our [UI Components guide](/guides/template-apps). 