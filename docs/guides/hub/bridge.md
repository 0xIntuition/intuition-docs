---
title: Bridge
description: Bridge assets between Ethereum testnets and Intuition testnet
sidebar_position: 3
---

<div style={{
  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  borderRadius: '16px',
  padding: '3rem 2rem',
  marginBottom: '3rem',
  color: 'white',
  textAlign: 'center'
}}>
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: '1rem'
  }}>
    <div style={{ 
      width: '80px', 
      height: '80px', 
      borderRadius: '20px', 
      backgroundColor: 'rgba(255, 255, 255, 0.2)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      marginRight: '1.5rem'
    }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
        <path d="M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6z"/>
      </svg>
    </div>
    <h1 style={{ 
      fontSize: '3rem', 
      fontWeight: '700', 
      margin: 0,
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    }}>
      Bridge
    </h1>
  </div>
  <p style={{ 
    fontSize: '1.25rem', 
    opacity: '0.9',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.6'
  }}>
    Secure cross-chain transfers between Ethereum testnets and the Intuition testnet. Built for testing and development, move assets safely between networks during the development process.
  </p>
</div>

## Quick Access

Access the Bridge directly at: [https://testnet.bridge.intuition.systems/](https://testnet.bridge.intuition.systems/)

## Overview

The Bridge provides a seamless way to transfer test assets between supported networks, enabling developers to:

- Test cross-chain functionality
- Move testnet tokens for development
- Validate bridge mechanics before mainnet deployment
- Experiment with multi-chain applications

## Supported Networks

### **Source Networks**
The bridge currently supports transfers from:
- Ethereum Sepolia Testnet
- Other Ethereum-compatible testnets (check bridge interface for current list)

### **Destination Network**
- Intuition Testnet (powered by Caldera)

## How to Use the Bridge

### **Step 1: Connect Your Wallet**
1. Visit [https://testnet.bridge.intuition.systems/](https://testnet.bridge.intuition.systems/)
2. Connect your Web3 wallet (MetaMask recommended)
3. Ensure you're connected to the source network

### **Step 2: Select Transfer Details**
1. Choose the source network (e.g., Ethereum Sepolia)
2. Select the destination network (Intuition Testnet)
3. Choose the asset you want to bridge
4. Enter the amount to transfer

### **Step 3: Initiate Transfer**
1. Review transfer details and fees
2. Confirm the transaction in your wallet
3. Wait for transaction confirmation on source network
4. Monitor bridge status for completion

### **Step 4: Claim on Destination**
1. Switch your wallet to Intuition Testnet
2. Complete the claiming process if required
3. Verify assets have arrived in your wallet

## Security Features

### **Testnet Safety**
- Isolated from mainnet assets
- Test-only token transfers
- Development-focused environment
- No real value at risk

### **Bridge Architecture**
- Decentralized bridge contracts
- Multi-signature security
- Transparent transaction tracking
- Automated validation processes

## Bridge Fees

The testnet bridge operates with minimal fees to facilitate testing:
- **Gas Fees**: Standard network gas costs on both chains
- **Bridge Fees**: Minimal fees for bridge operation (if any)
- **No Value**: All tokens are testnet tokens with no real value

## Monitoring Your Transfer

### **Transaction Tracking**
- View transaction status in real-time
- Get transaction hashes for both networks
- Monitor bridge queue and processing times
- Receive notifications on completion

### **Using the Explorer**
Use the [Explorer](/guides/hub/explorer) to:
- Verify transaction completion
- Check asset balances
- Review transaction history
- Debug any issues

## Common Use Cases

### **SDK Testing**
- Transfer test tokens to test SDK functionality
- Validate cross-chain operations
- Test atom and triple creation with bridged assets

### **Application Development**
- Test multi-chain dApp functionality
- Validate user flows across networks
- Debug cross-chain state management

### **Integration Testing**
- Test bridge integrations in your applications
- Validate cross-chain event handling
- Performance test under various loads

## Troubleshooting

### **Common Issues**
- **Transaction Stuck**: Check network congestion and gas fees
- **Assets Not Received**: Verify you completed claiming process
- **Wallet Issues**: Ensure correct network and sufficient gas

### **Getting Help**
- Check transaction status on bridge interface
- Use [Explorer](/guides/hub/explorer) to verify transactions
- Monitor [Network Status](/guides/hub/testnet-uptime) for service health
- Visit [Community & Support](/guides/resources/community-and-support) for assistance

## Developer Resources

### **Integration Guides**
- Bridge contract addresses and ABIs
- Example code for bridge interactions
- Testing best practices
- Error handling patterns

### **API Access**
- Bridge status API endpoints
- Transaction monitoring tools
- Automated testing utilities
- Performance monitoring

## Next Steps

- Explore bridged assets on [Explorer](/guides/hub/explorer)
- Monitor bridge health on [Network Status](/guides/hub/testnet-uptime)
- Start building with [Developer Tools](/guides/developer-tools)
- Test with the [Hub](/guides/hub/testnet-hub) 