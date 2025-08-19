---
title: Bridge
description: Bridge assets between Ethereum testnets and Intuition testnet
sidebar_position: 3
---

# Bridge

<div className="bridge-intro">
Secure cross-chain transfers between Ethereum testnets and the Intuition testnet. Built for testing and development, move assets safely between networks during the development process.
</div>

<div className="bridge-access-card">
<div className="bridge-access-content">
<h3>Access Bridge</h3>
<p>Start bridging assets between networks</p>
<a href="https://testnet.bridge.intuition.systems/" target="_blank" rel="noopener noreferrer" className="bridge-access-button">
Open Bridge →
</a>
</div>
</div>

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

<div className="bridge-steps">

<div className="bridge-step">
<div className="bridge-step-number">1</div>
<div className="bridge-step-content">
<h3>Connect Your Wallet</h3>
<ul className="green-checklist">
<li>Visit the bridge interface</li>
<li>Connect your Web3 wallet (MetaMask recommended)</li>
<li>Ensure you're connected to the source network</li>
</ul>
</div>
</div>

<div className="bridge-step">
<div className="bridge-step-number">2</div>
<div className="bridge-step-content">
<h3>Select Transfer Details</h3>
<ul className="green-checklist">
<li>Choose the source network (e.g., Ethereum Sepolia)</li>
<li>Select the destination network (Intuition Testnet)</li>
<li>Choose the asset you want to bridge</li>
<li>Enter the amount to transfer</li>
</ul>
</div>
</div>

<div className="bridge-step">
<div className="bridge-step-number">3</div>
<div className="bridge-step-content">
<h3>Initiate Transfer</h3>
<ul className="green-checklist">
<li>Review transfer details and fees</li>
<li>Confirm the transaction in your wallet</li>
<li>Wait for transaction confirmation on source network</li>
<li>Monitor bridge status for completion</li>
</ul>
</div>
</div>

<div className="bridge-step">
<div className="bridge-step-number">4</div>
<div className="bridge-step-content">
<h3>Claim on Destination</h3>
<ul className="green-checklist">
<li>Switch your wallet to Intuition Testnet</li>
<li>Complete the claiming process if required</li>
<li>Verify assets have arrived in your wallet</li>
</ul>
</div>
</div>

</div>

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
- Monitor [Network Health](/guides/resources/network-health) for service health
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
- Monitor bridge health on [Network Health](/guides/resources/network-health)
- Start building with [Developer Tools](/guides/developer-tools)
- Test with the [Hub](/guides/hub) 