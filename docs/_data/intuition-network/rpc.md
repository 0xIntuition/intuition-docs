---
sidebar_position: 2
---

# Remote Procedure Call (RPC)

The Intuition RPC (Remote Procedure Call) service provides programmatic access to the Intuition network.

RPC endpoints allow developers and applications to:

- Query blockchain data
- Submit transactions
- Monitor network state
- Access historical data
- Interact with smart contracts

## Available Endpoints

### Core RPC Methods

- **eth_getBalance**: Get account balance
- **eth_getBlockByNumber**: Retrieve block information
- **eth_getTransactionByHash**: Get transaction details
- **eth_sendRawTransaction**: Submit signed transactions
- **eth_call**: Execute contract calls
- **eth_getLogs**: Retrieve event logs

## Usage Examples

Using the `viem` library:

```javascript
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
 
const client = createPublicClient({
  chain: mainnet,
  transport: http('https://1.rpc.thirdweb.com/...'), 
})
```

Using the `ethers` library:

```javascript
import ethers from 'ethers';
// Connect to Intuition RPC
const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc.intuition.network'
);

// Query account balance
const balance = await provider.getBalance(address);

// Get latest block
const block = await provider.getBlock('latest');
```

## Authentication

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
