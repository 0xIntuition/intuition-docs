---
title: Portal (Explorer) Guide
sidebar_label: 🧠 Portal (Explorer) Guide
sidebar_position: 11
description: Documentation for the Intuition Portal application - create identities, make claims, stake, and explore the knowledge graph
keywords: [portal, explorer, identities, claims, atoms, triples, staking, vault, tags, lists]
---


# The Intuition Portal

The Portal is Intuition's first Explorer (akin to a block explorer), which provides users with easy access to the social and knowledge graph. Positioned at the application layer, the Portal offers an intuitive interface for users to create, manage, and interact with Identities (Atoms) and Claims (Triples). It serves as the gateway for creating decentralized identities, making claims, and managing your stake, transforming the exploration of the knowledge graph into an accessible and user-friendly experience.

While most explorers are only meant for exploring, The Portal also provides a user interface for easily interacting with the Intuition Graph in its entirety.

<div style={{ 
  backgroundColor: 'var(--ifm-color-emphasis-100)', 
  border: '1px solid var(--ifm-color-emphasis-300)', 
  borderRadius: '8px', 
  padding: '1.5rem', 
  margin: '2rem 0',
  borderLeft: '4px solid var(--ifm-color-primary)'
}}>

### 📋 **Covered in this guide:**

This guide provides step-by-step instructions for The Portal's core features:

- **Creating Identities** - Build your digital presence
- **Creating Claims** - Make assertions and statements
- **Staking on Identities and Claims** - Participate in the Token Curated Registry
- **Using Tags** - Organize and discover content
- **Organizing Lists** - Create curated collections
- **Following Users** - Build your social network

</div>

## 1. Creating and Managing Identities (Atoms)

<div style={{ 
  backgroundColor: 'var(--ifm-background-color)', 
  border: '1px solid var(--ifm-color-emphasis-300)', 
  borderRadius: '8px', 
  padding: '1.5rem', 
  margin: '1.5rem 0'
}}>

Identities, also known as **Atoms**, are the fundamental building blocks in the Intuition system. Each Atom represents a concept, such as a person, organization, or product, and comes with a unique decentralized identifier, structured data, and an associated Vault for signaling its relevancy.

### **How to Create an Identity**

<div style={{ 
  backgroundColor: 'var(--ifm-color-emphasis-50)', 
  border: '1px solid var(--ifm-color-emphasis-200)', 
  borderRadius: '6px', 
  padding: '1rem', 
  margin: '1rem 0'
}}>

1. **Click the "Create" action button** in the bottom left section of the menu panel
2. **Select "Create Identity"** from the dropdown menu
3. **Input data** to describe the Identity you are creating
4. **Optionally deposit ETH** to stake on your newly created Identity

</div>

### **What Happens After Creation?**

When you create an Identity, the data is uploaded to IPFS, generating an IPFS CID that is used to create an Atom in the Intuition contracts. This Atom can now be referenced universally across the web.

</div>

## 2. Making Claims (Triples)

<div style={{ 
  backgroundColor: 'var(--ifm-background-color)', 
  border: '1px solid var(--ifm-color-emphasis-300)', 
  borderRadius: '8px', 
  padding: '1.5rem', 
  margin: '1.5rem 0'
}}>

**What are Claims?** Claims, or **Triples**, allow you to assert statements about anything using a **[Subject][Predicate][Object]** structure. For example, **[Alice][is][trustworthy]**. Creating a Claim does not automatically express agreement with the claim; you must stake on the Claim to do so.

### **How to Create a Claim:**

<div style={{ 
  backgroundColor: 'var(--ifm-color-emphasis-50)', 
  border: '1px solid var(--ifm-color-emphasis-200)', 
  borderRadius: '6px', 
  padding: '1rem', 
  margin: '1rem 0'
}}>

1. **Click the "Create" action button** in the bottom left section of the menu panel
2. **Select "Create Claim"** from the dropdown menu
3. **Choose three Atoms/Identities** to form your Claim

</div>

### **Helpful Tips:**

<div style={{ 
  backgroundColor: 'var(--ifm-color-emphasis-50)', 
  border: '1px solid var(--ifm-color-emphasis-200)', 
  borderRadius: '6px', 
  padding: '1rem', 
  margin: '1rem 0'
}}>

- **Existing Claims**: If a claim already exists, simply stake on the existing claim to express your agreement with it
- **Prerequisites**: To create a claim, Atoms must already exist for the subject, predicate and object. If any one of the 3 required Atoms does not exist, you will first need to follow step 1 above to create the necessary identities before composing your claim

</div>

</div>

## 3. Staking (Signal Conviction)

<div style={{ 
  backgroundColor: 'var(--ifm-background-color)', 
  border: '1px solid var(--ifm-color-emphasis-300)', 
  borderRadius: '8px', 
  padding: '1.5rem', 
  margin: '1.5rem 0'
}}>

**What is Staking?** Staking in Intuition allows you to signal what is important or what you believe to be true by staking ETH on Identities (Atoms) or Claims (Triples). This process contributes to a **Token Curated Registry (TCR)**, where the most relevant information rises to the top.

### **Staking on an Identity:**

<div style={{ 
  backgroundColor: 'var(--ifm-color-emphasis-50)', 
  border: '1px solid var(--ifm-color-emphasis-200)', 
  borderRadius: '6px', 
  padding: '1rem', 
  margin: '1rem 0'
}}>

- **Signals the relevancy** of the Identity
- **Grants you shares** in the Identity, earning fees from future stakes

</div>

### **Staking on a Claim:**

<div style={{ 
  backgroundColor: 'var(--ifm-color-emphasis-50)', 
  border: '1px solid var(--ifm-color-emphasis-200)', 
  borderRadius: '6px', 
  padding: '1rem', 
  margin: '1rem 0'
}}>

- Claims have a **Positive Vault** (for supporting the Claim) and a **Negative Vault** (for opposing the Claim)
- Staking on a Claim also stakes on the Claim's underlying Identities

</div>

### **Unstaking:**

You can unstake your ETH at any time to retrieve your deposit (minus fees).

### **Staking Economics:**

Staking grants you shares that provide a proportionate amount of fee revenue accumulated by the Identity or Claim, incentivizing you to stake on high-traction items.

</div>

## 4. Using Tags

<div style={{ 
  backgroundColor: 'var(--ifm-background-color)', 
  border: '1px solid var(--ifm-color-emphasis-300)', 
  borderRadius: '8px', 
  padding: '1.5rem', 
  margin: '1.5rem 0'
}}>

**What are Tags?** Tags are shortcuts to organizing and finding relevant information. Tagging is achieved by creating a Claim using the **[has tag]** Atom as the Predicate. The ability to create tags is one of the first features to leverage "special predicates" and demonstrates how functionality can be built around specific types of claims. In this case, tags are the foundation on which users can create and manage Lists.

### **Creating and Using Tags:**

<div style={{ 
  backgroundColor: 'var(--ifm-color-emphasis-50)', 
  border: '1px solid var(--ifm-color-emphasis-200)', 
  borderRadius: '6px', 
  padding: '1rem', 
  margin: '1rem 0'
}}>

- **New Tag Creation**: To create a new Tag, you must create a new Identity for the tag you want to use if it doesn't already exist. Just like any other claim, Identities (Atoms) must exist for the Subject, Predicate, and Object of your **[has tag]** claim. When adding a new tag, we know the Subject and Predicate exist, so users only need to ensure an Object Atom exists (which represents the tag to be added)

- **Tagging Process**: Tag something by searching through "Existing Tags" or creating a new one
- **Benefits**: Tagging enhances discoverability and adds items to relevant Lists

</div>

</div>

## 5. Organizing with Lists

<div style={{ 
  backgroundColor: 'var(--ifm-background-color)', 
  border: '1px solid var(--ifm-color-emphasis-300)', 
  borderRadius: '8px', 
  padding: '1.5rem', 
  margin: '1.5rem 0'
}}>

**What are Lists?** Lists allow you to group related items or data in a way that makes sense to you, helping others discover, save, and provide feedback. Lists are constructed through deterministic queries, making it easy to organize and navigate complex data.

### **Creating a List:**

<div style={{ 
  backgroundColor: 'var(--ifm-color-emphasis-50)', 
  border: '1px solid var(--ifm-color-emphasis-200)', 
  borderRadius: '6px', 
  padding: '1rem', 
  margin: '1rem 0'
}}>

- Lists are formed by Claims with the **[has tag]** Predicate
- Tag an Identity to include it in a specific List

</div>

### **Adding to and Managing Lists:**

<div style={{ 
  backgroundColor: 'var(--ifm-color-emphasis-50)', 
  border: '1px solid var(--ifm-color-emphasis-200)', 
  borderRadius: '6px', 
  padding: '1rem', 
  margin: '1rem 0'
}}>

- Use the **"Add to list"** and **"Save list"** buttons to manage your Lists
- Lists are **Token Curated Registries (TCR)**, where you can stake ETH to order entries within a List

</div>

</div>

## 6. Following Users

<div style={{ 
  backgroundColor: 'var(--ifm-background-color)', 
  border: '1px solid var(--ifm-color-emphasis-300)', 
  borderRadius: '8px', 
  padding: '1.5rem', 
  margin: '1.5rem 0'
}}>

**What is Following?** Following in Intuition is a contextual statement made by staking on the Claim **[I][am following][User]**. This staking process reflects the strength of your connection and is part of the open data available for developers to use in building a social graph.

### **How to Follow/Unfollow:**

<div style={{ 
  backgroundColor: 'var(--ifm-color-emphasis-50)', 
  border: '1px solid var(--ifm-color-emphasis-200)', 
  borderRadius: '6px', 
  padding: '1rem', 
  margin: '1rem 0'
}}>

- **To follow**: Click on a user's profile and select "Follow," then optionally stake ETH
- **To unfollow**: Click "Following" on the user's profile and select "Unfollow." Unfollowing also redeems your staked ETH

</div>

</div>

## Getting Started

<div style={{ 
  backgroundColor: 'var(--ifm-color-primary-lightest)', 
  border: '1px solid var(--ifm-color-primary-light)', 
  borderRadius: '8px', 
  padding: '1.5rem', 
  margin: '2rem 0',
  textAlign: 'center'
}}>

### 🚀 **Ready to begin your journey?**

Visit **[portal.intuition.systems](https://portal.intuition.systems)** to start creating identities, making claims, and building your presence in the Intuition knowledge graph.

</div>

## Related Resources

<div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
  gap: '1rem', 
  marginTop: '2rem'
}}>

<div style={{ 
  border: '1px solid var(--ifm-color-emphasis-300)', 
  borderRadius: '6px', 
  padding: '1rem', 
  backgroundColor: 'var(--ifm-background-color)'
}}>

**[Explorer](/docs/intuition-network/testnet/explorer)** - Network exploration tools

</div>

<div style={{ 
  border: '1px solid var(--ifm-color-emphasis-300)', 
  borderRadius: '6px', 
  padding: '1rem', 
  backgroundColor: 'var(--ifm-background-color)'
}}>

**[Bridge](/docs/intuition-network/testnet/bridge)** - Cross-chain functionality

</div>

<div style={{ 
  border: '1px solid var(--ifm-color-emphasis-300)', 
  borderRadius: '6px', 
  padding: '1rem', 
  backgroundColor: 'var(--ifm-background-color)'
}}>

**[RPC](/docs/intuition-network/testnet/rpc)** - Network connectivity options

</div>

</div> 