---
id: intuition-in-practice
title: Intuition in Practice
sidebar_label: Intuition in Practice
sidebar_position: 6
description: Understanding how Intuition primitives work together in real-world scenarios
---

# Intuition in Practice

The introduction of Intuition's core primitives lays a robust foundation for constructing a system that fosters a trustful interaction layer for the decentralized web. These seemingly basic primitives enable a wide range of powerful functionalities, transforming how we manage identities, data, and trust online.

To illustrate this, consider the experience of buying a product on Amazon. With Intuition's primitives, this process can be reimagined in a decentralized, trustless manner:

## Atoms and Triples

Every user, product, review, and transaction can be represented as discrete objects (Atoms) and linked through relationships (Triples). For instance, a Triple could link a product (Atom) to a review (Atom) through a relationship like "hasReview."

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Example: Product Review System</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Product Atom</h4>
<p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem' }}>
did:ethr:mainnet:0x...product123
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Review Atom</h4>
<p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem' }}>
did:ethr:mainnet:0x...review456
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Triple Relationship</h4>
<p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem' }}>
[Product] [hasReview] [Review]
</p>
</div>
</div>
</div>
</div>

## Signal

Each review can be evaluated for credibility using the Signal primitive. Reviews and Signals from verified purchasers or highly reputable users can carry more weight, helping users discern trustworthy feedback from potentially fraudulent reviews.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Credibility Evaluation</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Verified Purchaser</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Higher signal weight due to confirmed purchase
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Reputable User</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Enhanced credibility based on historical accuracy
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Fraud Detection</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Automatic flagging of suspicious review patterns
</p>
</div>
</div>
</div>
</div>

## Fees, Economics, and Incentives

Users are encouraged to express themselves, and reviewers are incentivized to provide honest and detailed feedback. Users earn money for their valuable data contributions, and their reputation becomes cross-contextual, increasing its significance beyond a single platform.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Cross-Contextual Reputation</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>
For example, a user's status as a trusted reviewer on Amazon could serve as a valuable reputation data point in other contexts, such as securing better loan-to-value ratios in decentralized finance (DeFi) or enhancing the ability to obtain a loan.
</p>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>DeFi Integration</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Better loan-to-value ratios based on reputation
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Portable Trust</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Reputation follows users across platforms
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Economic Rewards</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Earn tokens for valuable contributions
</p>
</div>
</div>
</div>
</div>

### Portable Social and Trust Graphs

Additionally, users might be more inclined to attest to useful information about products on Amazon because their claims can be easily seen by the people they care about, thanks to portable social and trust graphs. Unlike the current Amazon platform, which lacks a friends list, Intuition allows users to take their singular social graph or a set of trust graphs with them anywhere they go.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Trust Graph Benefits</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Portable Connections</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Take your social graph anywhere you go
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Weighted Reviews</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Trusted individual reviews > anonymous reviews
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Prioritized Insights</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Valuable insights from trusted sources prioritized
</p>
</div>
</div>
</div>
</div>

## Interpretations

The listing of a product on a marketplace such as Amazon can be represented as a literal interpretation. For instance, adding a product to a marketplace can be as straightforward as creating a Triple like [Product][listedOn] [Amazon].

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Stakeholder Interpretations</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>
Expanding on this concept, various stakeholders can publish their interpretations of product reviews:
</p>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Company Aggregation</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Aggregate all reviews and provide summary scores
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Consumer Protection</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Highlight reviews mentioning safety concerns
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Independent Analysis</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Third-party verification and validation
</p>
</div>
</div>
</div>
</div>

## Algorithms

Users can choose from various algorithms to filter and sort reviews based on their preferences. For instance, an algorithm can prioritize reviews from users with similar purchase histories or highlight reviews that mention specific product features.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Customizable Filtering</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Similar Purchase History</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Prioritize reviews from users with similar tastes
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Feature-Specific</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Highlight reviews mentioning specific features
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Trust-Based</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Weight reviews based on user trust networks
</p>
</div>
</div>
</div>
</div>

## Reality Tunnel

Users can compose together interpretations and algorithms to create curated 'views' of data, allowing them to find the voices they trust among thousands of anonymous voices.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Curated Perspectives</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Composable Views</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Combine interpretations and algorithms
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Trusted Voices</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Find reliable sources among anonymous reviews
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Personalized Experience</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Tailored data presentation based on preferences
</p>
</div>
</div>
</div>
</div>

## Portable Identity and Data

Identities and data become universal, and can be referenced and integrated anywhere across the web. Users can see a product's aggregated reviews across Amazon, Facebook Marketplace, Craigslist, or eBay, provided the same canonical identifier for the products is used in each context.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Universal Data Access</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Cross-Platform Aggregation</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
See reviews from Amazon, Facebook, Craigslist, eBay
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Data Continuity</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Data persists even if platforms shut down
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>User Control</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Maintain control over your digital interactions
</p>
</div>
</div>
</div>
</div>

## The Decentralized Trust Layer

By integrating these primitives into contexts and interactions that cannot yet be fully 'trustless,' Intuition establishes a decentralized trust layer. This layer allows users to interact with confidence, knowing that the information they rely on is transparent, verifiable, and free from centralized manipulation.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Key Benefits</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Transparent Information</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
All data is open and verifiable
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Decentralized Control</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
No single entity controls the data
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>User-Centric</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Users maintain control over their data
</p>
</div>
</div>
</div>

For instance, when buying a product, users can access a wealth of credible reviews, filtered and presented according to their preferences, all while maintaining control over their data and identities. By leveraging these tools, we can build a more trustworthy and user-centric digital ecosystem, addressing many of the inherent flaws in the current Web2 trust stack and paving the way for a more decentralized and equitable internet.

## Next Steps

Now that you understand how Intuition primitives work together in practice, explore the [Structuring](/guides/introduction/the-primitives/structuring) section to learn advanced techniques for working with Atoms and Triples in real-world applications. 