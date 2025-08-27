---
sidebar_position: 4
---

# RPC

The Intuition RPC (Remote Procedure Call) service provides programmatic access to the Intuition network.

<div style={{
  backgroundColor: 'var(--ifm-color-emphasis-50)',
  border: '1px solid var(--ifm-color-emphasis-200)',
  borderRadius: '12px',
  padding: '1.5rem',
  marginBottom: '2rem'
}}>

## Overview

RPC endpoints allow developers and applications to:

- Query blockchain data
- Submit transactions
- Monitor network state
- Access historical data
- Interact with smart contracts

</div>

## Available Endpoints

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem',
  marginBottom: '2rem'
}}>

<div style={{
  backgroundColor: 'var(--ifm-color-emphasis-50)',
  border: '1px solid var(--ifm-color-emphasis-200)',
  borderRadius: '12px',
  padding: '1.5rem'
}}>

### Core RPC Methods

- **eth_getBalance**: Get account balance
- **eth_getBlockByNumber**: Retrieve block information
- **eth_getTransactionByHash**: Get transaction details
- **eth_sendRawTransaction**: Submit signed transactions
- **eth_call**: Execute contract calls
- **eth_getLogs**: Retrieve event logs

</div>

<div style={{
  backgroundColor: 'var(--ifm-color-emphasis-50)',
  border: '1px solid var(--ifm-color-emphasis-200)',
  borderRadius: '12px',
  padding: '1.5rem'
}}>

### Intuition-Specific Methods

- **intuition_getAtoms**: Query atom data
- **intuition_getTriples**: Retrieve triple information
- **intuition_getSignals**: Access signal data
- **intuition_getBondingCurves**: Get bonding curve data

</div>

</div>

## Authentication

<div style={{
  backgroundColor: 'var(--ifm-color-emphasis-50)',
  border: '1px solid var(--ifm-color-emphasis-200)',
  borderRadius: '12px',
  padding: '1.5rem',
  marginBottom: '2rem'
}}>

RPC access requires authentication for production use:

<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: '1rem'
}}>

<div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem'
}}>
<div style={{
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: 'var(--ifm-color-success)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
}}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white">
<path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C14.8,14.1 12.4,16.5 9.8,16.5C7.2,16.5 4.8,14.1 4.8,11.5V10C4.8,8.6 6.2,7 7.6,7H12M12,8.2C11.2,8.2 10.5,8.9 10.5,9.7V11.5C10.5,12.9 11.6,14 13,14C14.4,14 15.5,12.9 15.5,11.5V9.7C15.5,8.9 14.8,8.2 14,8.2H12Z"/>
</svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}><strong>Wallet Authentication</strong>: Secure access with wallet-based authentication</span>
</div>

<div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem'
}}>
<div style={{
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: 'var(--ifm-color-success)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
}}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white">
<path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C14.8,14.1 12.4,16.5 9.8,16.5C7.2,16.5 4.8,14.1 4.8,11.5V10C4.8,8.6 6.2,7 7.6,7H12M12,8.2C11.2,8.2 10.5,8.9 10.5,9.7V11.5C10.5,12.9 11.6,14 13,14C14.4,14 15.5,12.9 15.5,11.5V9.7C15.5,8.9 14.8,8.2 14,8.2H12Z"/>
</svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}><strong>Rate Limiting</strong>: Fair usage policies</span>
</div>

<div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem'
}}>
<div style={{
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: 'var(--ifm-color-success)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
}}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white">
<path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C14.8,14.1 12.4,16.5 9.8,16.5C7.2,16.5 4.8,14.1 4.8,11.5V10C4.8,8.6 6.2,7 7.6,7H12M12,8.2C11.2,8.2 10.5,8.9 10.5,9.7V11.5C10.5,12.9 11.6,14 13,14C14.4,14 15.5,12.9 15.5,11.5V9.7C15.5,8.9 14.8,8.2 14,8.2H12Z"/>
</svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}><strong>WebSocket Support</strong>: Real-time data streaming</span>
</div>

<div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem'
}}>
<div style={{
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: 'var(--ifm-color-success)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
}}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white">
<path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C14.8,14.1 12.4,16.5 9.8,16.5C7.2,16.5 4.8,14.1 4.8,11.5V10C4.8,8.6 6.2,7 7.6,7H12M12,8.2C11.2,8.2 10.5,8.9 10.5,9.7V11.5C10.5,12.9 11.6,14 13,14C14.4,14 15.5,12.9 15.5,11.5V9.7C15.5,8.9 14.8,8.2 14,8.2H12Z"/>
</svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}><strong>HTTPS Only</strong>: Secure connections required</span>
</div>

</div>

</div>

## Usage Examples

<div style={{
  backgroundColor: 'var(--ifm-color-emphasis-50)',
  border: '1px solid var(--ifm-color-emphasis-200)',
  borderRadius: '12px',
  padding: '1.5rem',
  marginBottom: '2rem'
}}>

```javascript
// Connect to Intuition RPC
const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc.intuition.network'
);

// Query account balance
const balance = await provider.getBalance(address);

// Get latest block
const block = await provider.getBlock('latest');
```

</div>

<div style={{
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  border: '1px solid #404040',
  borderRadius: '16px',
  padding: '2rem',
  textAlign: 'center',
  color: 'white',
  marginTop: '2rem'
}}>
<h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'white' }}>
Ready to Connect?
</h3>
<p style={{ margin: '0 0 1.5rem 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
Start building with the Intuition RPC service and integrate blockchain functionality into your applications.
</p>
<div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
<a href="/guides/quickstart" style={{
  backgroundColor: 'var(--ifm-color-primary)',
  color: 'white',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '500',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease'
}}>
Get Started
</a>
<a href="/guides/developer-tools/graphql-api" style={{
  backgroundColor: 'transparent',
  color: 'white',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '500',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease'
}}>
GraphQL API
</a>
</div>
</div>

*[Placeholder content - to be expanded with actual RPC documentation and examples]* 