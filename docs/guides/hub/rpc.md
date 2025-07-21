---
sidebar_position: 3
---

# RPC

The Intuition RPC (Remote Procedure Call) service provides programmatic access to the Intuition network.

## Overview

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

### Intuition-Specific Methods

- **intuition_getAtoms**: Query atom data
- **intuition_getTriples**: Retrieve triple information
- **intuition_getSignals**: Access signal data
- **intuition_getBondingCurves**: Get bonding curve data

## Authentication

RPC access requires authentication for production use:

- **API Keys**: Secure access with API key authentication
- **Rate Limiting**: Fair usage policies
- **WebSocket Support**: Real-time data streaming
- **HTTPS Only**: Secure connections required

## Usage Examples

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

*[Placeholder content - to be expanded with actual RPC documentation and examples]* 