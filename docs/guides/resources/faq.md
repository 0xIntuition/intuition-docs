---
id: faq
title: FAQ
sidebar_label: FAQ
sidebar_position: 1
description: Frequently Asked Questions about Intuition
---

# FAQ

This page is organized into expandable sections for easy navigation. Click on any section below to explore the questions within that category.

<details>
<summary><strong>Getting Started</strong> - Basic information about Intuition and how to begin</summary>

## Getting Started

### What is Intuition?

Intuition is a decentralized protocol that enables the creation of trustful interactions through atomic primitives. It provides a foundation for building decentralized applications that can establish and maintain trust between parties without centralized intermediaries.

The protocol uses atomic primitives (atoms, triples, signals, and bonding curves) to create trustful interactions. These primitives can be combined to build complex decentralized applications that maintain trust through cryptographic proofs and economic incentives.

### How do I get started with Intuition?

**Step 1: Read the Documentation**  
Start with the [Introduction](/guides/introduction) and [Overview](/guides/introduction/overview) guides to understand the core concepts.

**Step 2: Connect to Testnet**  
Visit the [Intuition Hub](/guides/hub) to access the testnet and get your development environment set up.

**Step 3: Set up Development Environment**  
Install the necessary SDKs and tools for your preferred programming language.

**Step 4: Build Your First App**  
Follow the tutorials to create a simple application using Intuition primitives.

**Step 5: Join the Community**  
Connect with other developers and get support through our community channels.

### What are the main components of Intuition?

**Atoms**: The basic units of trust and reputation - unique identifiers for any entity (people, concepts, products)

**Triples**: Relationships between atoms that encode trust - structured as Subject → Predicate → Object

**Signals**: Mechanisms for updating trust relationships - actions that express intent, belief, or support

**Bonding Curves**: Economic models for token pricing and liquidity - automated market making for application tokens

</details>

<details>
<summary><strong>Development & Integration</strong> - Programming languages, integration, and deployment</summary>

## Development & Integration

### What programming languages are supported?

Intuition supports multiple programming languages through various SDKs:

- **JavaScript/TypeScript**: Official SDK with full feature support
- **Python**: Python SDK for backend development
- **Rust**: Low-level SDK for performance-critical applications
- **Go**: Go SDK for server-side applications

### How do I connect to the Intuition testnet?

**Step 1: Access the Hub**  
Visit the [Intuition Hub](/guides/hub) at [intuition-testnet.hub.caldera.xyz](https://intuition-testnet.hub.caldera.xyz/) for centralized access to all testnet services.

**Step 2: Configure Your Wallet**  
Add the Intuition testnet to your wallet using the network details provided in the hub dashboard. The hub will display the current Chain ID and RPC URL.

**Step 3: Get Test Tokens**  
Use the built-in faucet available in the hub to obtain test tokens for development and testing.

**Step 4: Explore Services**  
Access the [Bridge](/guides/hub/bridge) for cross-chain transfers, [Explorer](/guides/hub/explorer) for blockchain exploration, and monitor network status through the status page.

### How do I integrate Intuition into my existing app?

**Step 1: Install SDK**  
Add the appropriate Intuition SDK to your project using your package manager.

**Step 2: Configure Connection**  
Set up connection to the Intuition testnet first using the network details from the [Hub](/guides/hub).

**Step 3: Implement Primitives**  
Use atoms, triples, signals, and bonding curves in your application logic.

**Step 4: Test Integration**  
Thoroughly test your integration on testnet before production deployment.

### How do I deploy an application?

**Step 1: Develop Your App**  
Build your application using Intuition primitives and follow best practices.

**Step 2: Test on Testnet**  
Use the [Intuition testnet](/guides/hub) to thoroughly test your application before mainnet deployment. Access all testnet services through the hub.

**Step 3: Deploy Contracts**  
Deploy your smart contracts to the network using the appropriate deployment tools. Start with testnet deployment first.

**Step 4: Launch Application**  
Make your application available to users and monitor its performance using the network monitoring tools.

### What are the best practices for building with Intuition?

**Start Simple**: Begin with basic primitives before building complex systems to understand the fundamentals.

**Test Extensively**: Use the [Intuition testnet](/guides/hub) for all development and testing to avoid costly mistakes. Access the full testing infrastructure through the hub.

**Follow Security Guidelines**: Implement proper security measures and follow established patterns. Review our [security audits](/guides/resources/audits) for best practices.

**Document Your Code**: Maintain clear documentation for your applications to help other developers.

**Monitor Applications**: Use the network monitoring tools to track your application's performance and catch issues early.

</details>

<details>
<summary><strong>Economics & Rewards</strong> - Token economics, bonding curves, and earning rewards</summary>

## Economics & Rewards

### How does the token economics work?

Intuition uses a dual-token system:

**INTUITION**: The main network token used for staking, governance, and network security.

**Application Tokens**: Specific to individual applications for their economic models and bonding curves.

The system provides automated market making and liquidity for application tokens, enabling dynamic pricing and efficient token distribution through bonding curves.

### How can I earn rewards?

**Staking**: Stake INTUITION tokens to earn rewards and participate in network security.

**Running Nodes**: Operate network nodes to earn block rewards and contribute to decentralization.

**Building Applications**: Create successful applications that generate fees and provide value to users.

**Contributing**: Participate in governance and development to help shape the protocol's future.

### What are bonding curves?

Bonding curves are mathematical functions that determine token pricing based on supply and demand. They provide:

- **Automated Market Making**: Continuous liquidity without traditional market makers
- **Dynamic Pricing**: Token prices that automatically adjust based on supply and demand
- **Efficient Distribution**: Fair token distribution through mathematical models
- **Liquidity Provision**: Built-in liquidity for application tokens

</details>

<details>
<summary><strong>Troubleshooting & Support</strong> - Common issues and getting help</summary>

## Troubleshooting & Support

### How do I handle errors and edge cases?

**Implement Error Handling**: Add comprehensive error handling to your applications to gracefully handle failures.

**Use Fallback Mechanisms**: Implement fallbacks for critical operations to ensure reliability.

**Monitor Applications**: Set up monitoring and alerting for your applications to catch issues early.

**Plan for Upgrades**: Design your applications to be upgradeable as the protocol evolves.

### What if I can't connect to the testnet?

If you're having trouble connecting to the Intuition testnet, try these troubleshooting steps:

**Check Network Configuration**  
Verify that your wallet is configured with the correct network details from the [Hub dashboard](/guides/hub). The Chain ID and RPC URL should match exactly.

**Check Network Status**  
Visit the network status page to see if there are any ongoing issues with the testnet services.

**Clear Wallet Cache**  
Try clearing your wallet's cache or switching to a different RPC endpoint if multiple are available in the hub.

**Check Firewall/VPN**  
Ensure your firewall or VPN isn't blocking connections to the testnet endpoints.

### What if my transaction fails?

If your transaction fails, check your wallet to confirm whether your tokens have been returned. In most cases, failed transactions automatically result in the tokens being returned to your wallet.

Common causes of transaction failures:

- **Insufficient Gas**: Ensure you have enough gas for the transaction
- **Network Congestion**: Try again during less busy periods
- **Incorrect Parameters**: Double-check all transaction parameters before signing
- **Testnet Issues**: Check the network status for any ongoing testnet problems

### How do I get help and support?

**Community Support**: Join our [Discord](https://discord.com/invite/0xintuition) for real-time help from the community.

**Documentation**: Check our comprehensive [documentation](/guides) for detailed guides and tutorials.

**GitHub**: Report issues and contribute to the project on [GitHub](https://github.com/0xintuition).

**Email Support**: Contact us directly at [support@intuition.systems](mailto:support@intuition.systems) for technical assistance.

</details>

<details>
<summary><strong>Use Cases & Contributing</strong> - Applications and ecosystem participation</summary>

## Use Cases & Contributing

### What are the main use cases for Intuition?

**Knowledge Curation**: Build applications that help users discover and verify information through community consensus.

**Social Platforms**: Create decentralized social networks with built-in reputation and trust systems.

**Trust & Reputation**: Develop verifiable reputation systems that work across platforms and applications.

**Verification & QA**: Use collective intelligence to verify and validate any type of information or claim.

**Prediction Markets**: Build prediction markets with built-in verification and community consensus.

**Business & Professional Platforms**: Create platforms that verify professional credentials and facilitate trusted business relationships.

### How do I contribute to the Intuition ecosystem?

**Develop Applications**: Build applications that leverage Intuition's primitives and contribute to the ecosystem.

**Improve Documentation**: Help improve our documentation by suggesting edits or contributing new guides.

**Participate in Governance**: Stake tokens and participate in protocol governance decisions.

**Report Issues**: Help improve the protocol by reporting bugs and suggesting improvements.

**Community Building**: Help grow the community by answering questions and mentoring new developers.

</details>

## Need More Help?

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '2rem', borderRadius: '12px', marginTop: '2rem', textAlign: 'center' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Can't find what you're looking for?</h3>
<p style={{ margin: '0 0 1.5rem 0', color: 'var(--ifm-color-emphasis-700)' }}>
We're here to help! Reach out to our community or support team for assistance.
</p>
<div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
<a href="/guides/resources/community-and-support" style={{ 
  backgroundColor: 'transparent', 
  color: 'var(--ifm-color-primary)', 
  padding: '0.75rem 1.5rem', 
  borderRadius: '6px', 
  textDecoration: 'none', 
  fontWeight: '500',
  border: '1px solid var(--ifm-color-primary)',
  display: 'inline-flex',
  alignItems: 'center',
  transition: 'all 0.2s ease'
}}>
Join Community
</a>
<a href="mailto:support@intuition.systems" style={{ 
  backgroundColor: 'transparent', 
  color: 'var(--ifm-color-primary)', 
  padding: '0.75rem 1.5rem', 
  borderRadius: '6px', 
  textDecoration: 'none', 
  fontWeight: '500',
  border: '1px solid var(--ifm-color-primary)',
  display: 'inline-flex',
  alignItems: 'center',
  transition: 'all 0.2s ease'
}}>
Contact Support
</a>
</div>
</div> 