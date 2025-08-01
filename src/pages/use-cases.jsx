import React from 'react';
import Layout from '@theme/Layout';

export default function UseCases() {
  return (
    <Layout title="Use Cases" description="Explore real-world applications and use cases for the Intuition protocol">
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--12">
            <div className="text--center margin-bottom--xl">
              <img 
                src="/img/use-cases.png" 
                alt="Use Cases" 
                style={{ 
                  width: '100%', 
                  maxWidth: '800px', 
                  margin: '0 auto 2rem auto', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }} 
              />
            </div>
            
            <h1>Use Cases</h1>
            
            <div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', margin: 0, color: 'var(--ifm-color-emphasis-700)' }}>
                Welcome to the Use Cases section — your comprehensive guide to the real-world applications and possibilities enabled by Intuition's decentralized knowledge graph. Whether you're a developer looking to build the next breakthrough application or a user curious about how Intuition can transform digital interactions, this guide will show you the vast potential of programmable trust.
              </p>
            </div>

            <h2>The Power of Programmable Trust</h2>
            
            <p>Intuition's unique architecture enables a new paradigm of digital interactions where trust is not just assumed, but programmatically verified and incentivized. Our decentralized knowledge graph provides the foundation for applications that can:</p>

            <h3>Core Capabilities</h3>
            
            <ul>
              <li><strong>Verify and validate any claim or assertion</strong> with cryptographic proof</li>
              <li><strong>Build reputation systems</strong> that work across platforms and applications</li>
              <li><strong>Create economic incentives</strong> for quality contributions and honest behavior</li>
              <li><strong>Enable cross-platform identity</strong> that users truly own and control</li>
              <li><strong>Foster collaborative knowledge</strong> through community-driven curation</li>
            </ul>

            <p>By leveraging Intuition's primitives (Atoms, Triples, and Signal), developers can create applications that fundamentally change how we think about trust, reputation, and collaboration online.</p>

            <h2>Detailed Implementation Examples</h2>

            <h3>Decentralized Social Media Platform</h3>
            
            <p>Learn how to build a decentralized social media platform using Intuition's primitives. This example demonstrates how to create a feature-rich social network with decentralized content ownership and monetization.</p>

            <h4>Architecture Overview</h4>

            <div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
{`interface Profile extends Atom {
  username: string;
  bio: string;
  avatar: string;
  followers: number;
}

interface Post extends Atom {
  content: string;
  media?: string[];
  tags: string[];
  monetization?: {
    enabled: boolean;
    curveId: string;
  };
}

interface Follow extends Triple {
  timestamp: number;
  notification: boolean;
}`}
              </pre>
            </div>

            <h4>Implementation Guide</h4>

            <h5>1. User Profiles</h5>

            <div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
{`// Create a new profile
const profile = await intuition.createAtom({
  type: 'profile',
  content: {
    username: 'alice',
    bio: 'Blockchain developer',
    avatar: 'ipfs://...'
  }
});

// Set up profile monetization
const creatorCurve = await intuition.createBondingCurve({
  type: 'exponential',
  parameters: {
    initialPrice: 1.0,
    growthRate: 0.1
  }
});`}
              </pre>
            </div>

            <h5>2. Content Creation</h5>

            <div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
{`// Create a new post
const post = await intuition.createAtom({
  type: 'post',
  content: {
    content: 'Exploring Intuition primitives...',
    tags: ['blockchain', 'web3'],
    monetization: {
      enabled: true,
      curveId: creatorCurve.id
    }
  }
});

// Link post to profile
await intuition.createTriple({
  subject: profile.id,
  predicate: 'AUTHORED',
  object: post.id
});`}
              </pre>
            </div>

            <h5>3. Social Connections</h5>

            <div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
{`// Follow a profile
await intuition.createTriple({
  subject: follower.id,
  predicate: 'FOLLOWS',
  object: profile.id,
  metadata: {
    timestamp: Date.now(),
    notification: true
  }
});

// Query followers
const followers = await intuition.queryTriples({
  subject: profile.id,
  predicate: 'FOLLOWED_BY'
});`}
              </pre>
            </div>

            <h5>4. Content Monetization</h5>

            <div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
{`// Enable post monetization
const postCurve = await intuition.createBondingCurve({
  type: 'linear',
  parameters: {
    initialPrice: 0.1,
    slope: 0.05
  }
});

// Users can purchase access to premium content
await intuition.purchaseFromCurve(postCurve.id, {
  amount: 1.0,
  buyer: user.id
});`}
              </pre>
            </div>

            <h3>Decentralized Q&A Platform</h3>
            
            <p>Learn how to build a decentralized Stack Overflow-like platform using Intuition's primitives. This example demonstrates how to create a fully functional Q&A application with decentralized ownership and incentives.</p>

            <h4>Architecture Overview</h4>

            <div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
{`interface Question extends Atom {
  title: string;
  content: string;
  tags: string[];
  bounty?: number;
}

interface Answer extends Atom {
  content: string;
  accepted: boolean;
}

interface Vote extends Triple {
  direction: 'up' | 'down';
  weight: number;
}`}
              </pre>
            </div>

            <h4>Implementation Guide</h4>

            <h5>1. Setting Up Questions</h5>

            <div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
{`// Create a new question
const question = await intuition.createAtom({
  type: 'question',
  content: {
    title: 'How to implement bonding curves?',
    content: questionContent,
    tags: ['defi', 'bonding-curves']
  }
});

// Add bounty using bonding curve
const bounty = await intuition.createBounty(question.id, {
  curveType: 'linear',
  initialAmount: 100
});`}
              </pre>
            </div>

            <h5>2. Managing Answers</h5>

            <div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
{`// Submit an answer
const answer = await intuition.createAtom({
  type: 'answer',
  content: {
    content: answerContent,
    accepted: false
  }
});

// Link answer to question using triple
await intuition.createTriple({
  subject: question.id,
  predicate: 'HAS_ANSWER',
  object: answer.id
});`}
              </pre>
            </div>

            <h5>3. Implementing Voting</h5>

            <div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
{`// Create a vote
await intuition.createTriple({
  subject: user.id,
  predicate: 'VOTES',
  object: answer.id,
  metadata: {
    direction: 'up',
    weight: userReputation
  }
});

// Update answer reputation
await updateReputation(answer.id);`}
              </pre>
            </div>

            <h5>4. Reputation System</h5>

            <div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
{`// Define reputation curve
const reputationCurve = await intuition.createBondingCurve({
  type: 'polynomial',
  parameters: {
    baseReward: 10,
    votePower: 1.5
  }
});

// Award reputation for good answers
await intuition.awardReputation(answer.id, {
  amount: calculatedReward,
  curveId: reputationCurve.id
});`}
              </pre>
            </div>

            <h2>Major Use Case Categories</h2>

            <h3>Knowledge Curation & Discovery</h3>
            
            <p>Intuition excels at creating systems where collective wisdom can be captured, verified, and surfaced. This category includes applications that help users find the best information, products, and services through community-driven insights.</p>

            <h4>List Curation & Ranking Systems</h4>
            
            <p>Transform how we discover and rank everything from products to content:</p>
            
            <ul>
              <li><strong>Web3 Ecosystem</strong>: Curate trusted DeFi protocols, NFT communities, and web3 games based on user claims and attestations</li>
              <li><strong>Entertainment</strong>: Rank top artists, movies, and podcasts through collective insights</li>
              <li><strong>Consumer Products</strong>: Find top-rated products based on collective validation</li>
              <li><strong>Education & Learning</strong>: Discover renowned platforms and institutions backed by community insights</li>
              <li><strong>Travel</strong>: Uncover popular destinations through collective recommendations</li>
            </ul>

            <h4>Content Discovery & Verification</h4>
            
            <p>Build platforms that surface the most reliable and relevant information:</p>
            
            <ul>
              <li><strong>News & Research</strong>: Discover validated articles through user endorsements</li>
              <li><strong>Digital Applications</strong>: Find top-notch apps as endorsed by users</li>
              <li><strong>Sports Insights</strong>: Gain insights on athletes and predictions curated by the community</li>
              <li><strong>Memecoin Navigation</strong>: Navigate the memecoin space with user-backed recommendations</li>
            </ul>

            <h3>Social Platforms & Community</h3>
            
            <p>Create the next generation of social platforms where reputation and trust are built into the foundation.</p>

            <h4>Community-Owned Social Platforms</h4>
            
            <p>Build social networks that prioritize quality and authenticity:</p>
            
            <ul>
              <li><strong>Advanced Signaling</strong>: Transform traditional upvotes/downvotes into rich attestations</li>
              <li><strong>Collective Verification</strong>: Mobilize communities to attest to content accuracy</li>
              <li><strong>Member Credibility</strong>: Rank members based on track record and expertise</li>
              <li><strong>Content Display</strong>: Showcase content organized by author credibility and topic relevance</li>
              <li><strong>Information Integrity</strong>: Ensure discussions are accurate and authentic</li>
            </ul>

            <h4>Q&A Platform Moderation</h4>
            
            <p>Create question-and-answer platforms with built-in quality control:</p>
            
            <ul>
              <li><strong>Claiming Expertise</strong>: Users self-identify areas of knowledge</li>
              <li><strong>Community Attestations</strong>: Peer validation of answers in real-time</li>
              <li><strong>Verification</strong>: Answer validation reinforced by collective wisdom</li>
              <li><strong>Reputation Building</strong>: Continuous positive attestations build trustworthy scores</li>
            </ul>

            <h3>Trust & Reputation Systems</h3>
            
            <p>Leverage Intuition's ability to create verifiable reputation across any domain.</p>

            <h4>Reputation Scores & Credit</h4>
            
            <p>Build comprehensive reputation systems:</p>
            
            <ul>
              <li><strong>Trustworthiness Index</strong>: Evaluate entities based on track record and conduct</li>
              <li><strong>Platform Credibility</strong>: Prioritize platforms known for specific capabilities</li>
              <li><strong>Credit Scoring</strong>: Harness blockchain transparency for decentralized credit scores</li>
              <li><strong>Lending Confidence</strong>: Enable undercollateralized loans with transparent metrics</li>
            </ul>

            <h4>Referral Systems</h4>
            
            <p>Create incentivized referral networks:</p>
            
            <ul>
              <li><strong>Bounty Set-Up</strong>: Organizations define rewards for specific referrals</li>
              <li><strong>Referral Submission</strong>: Individuals recommend based on criteria</li>
              <li><strong>Verification</strong>: Recommendations undergo community checks</li>
              <li><strong>Reward Payout</strong>: Successful referrals receive designated rewards</li>
              <li><strong>Reputation Metrics</strong>: Successful referrals enhance user reputation</li>
              <li><strong>Tiered Incentives</strong>: Increased rewards for consistent, high-quality referrals</li>
            </ul>

            <h3>Verification & Quality Assurance</h3>
            
            <p>Use collective intelligence to verify and validate any type of information or claim.</p>

            <h4>Data Verification</h4>
            
            <p>Create systems for verifying any type of data:</p>
            
            <ul>
              <li><strong>Decentralized Information Validation</strong>: Engage distributed communities to verify data accuracy</li>
              <li><strong>Curator & Auditor Recognition</strong>: Rank individuals based on proficiency and accuracy</li>
              <li><strong>Structured Display</strong>: Present verified data methodically by validator</li>
              <li><strong>Authenticity Assurance</strong>: Guarantee accuracy and integrity of any information</li>
            </ul>

            <h4>Fraud Protection</h4>
            
            <p>Build comprehensive fraud detection systems:</p>
            
            <ul>
              <li><strong>Global Contributor Network</strong>: Worldwide team monitoring fraudulent activities</li>
              <li><strong>Interactive Monitoring</strong>: Gaming mechanisms to incentivize monitoring</li>
              <li><strong>Crowdsourced Vigilance</strong>: Global team tracking and highlighting threats</li>
              <li><strong>Trustworthiness Framework</strong>: Rigorous systems evaluating legitimacy</li>
              <li><strong>Verification Systems</strong>: Stringent procedures to authenticate transactions</li>
            </ul>

            <h4>Quality Assurance</h4>
            
            <p>Leverage collective wisdom for product and service quality:</p>
            
            <ul>
              <li><strong>Community Evaluation</strong>: Harness collective wisdom to assess quality</li>
              <li><strong>Feedback Systems</strong>: Transparent, real-time feedback mechanisms</li>
              <li><strong>Ranking Platforms</strong>: Evaluate QA platforms based on effectiveness</li>
              <li><strong>Product Excellence</strong>: Ensure releases meet community-driven benchmarks</li>
            </ul>

            <h3>Prediction & Forecasting</h3>
            
            <p>Create systems for making and verifying predictions across any domain.</p>

            <h4>Verifiable Predictions & Claims</h4>
            
            <p>Build prediction markets with built-in verification:</p>
            
            <ul>
              <li><strong>Predictive Expertise</strong>: Measure individuals proficient in accurate predictions</li>
              <li><strong>Accuracy Assessment</strong>: Assess predictive accuracy based on historical outcomes</li>
              <li><strong>Trusted Voices</strong>: Elevate voices whose foresight consistently aligns with events</li>
            </ul>

            <h4>Oracle-Based Community Insight</h4>
            
            <p>Leverage collective intelligence for insights:</p>
            
            <ul>
              <li><strong>Question Propagation</strong>: Pose questions to tap collective intelligence</li>
              <li><strong>Attestation-Driven Responses</strong>: Members provide answers with attestations</li>
              <li><strong>Criteria-Based Aggregation</strong>: Aggregate attestations considering multiple criteria</li>
              <li><strong>Consensus Result Extraction</strong>: Derive final insights based on weighted attestations</li>
            </ul>

            <h3>Business & Professional Platforms</h3>
            
            <p>Create platforms that verify professional credentials and facilitate trusted business relationships.</p>

            <h4>Business, Employment & Consulting</h4>
            
            <p>Build professional platforms with built-in verification:</p>
            
            <ul>
              <li><strong>Professional Credibility</strong>: Evaluate authenticity of individuals and organizations</li>
              <li><strong>Expertise Showcase</strong>: Verify skills, experiences, and specializations</li>
              <li><strong>Credential-Based Products</strong>: Platforms enhanced with reputation systems</li>
              <li><strong>Collaborative Experiences</strong>: Attest to quality and outcomes of projects</li>
              <li><strong>Consultation Metrics</strong>: Measure impact and effectiveness of services</li>
              <li><strong>Transparent Feedback Loop</strong>: Allow feedback on consulting services</li>
            </ul>

            <h4>Trading Knowledge</h4>
            
            <p>Create trusted trading and investment platforms:</p>
            
            <ul>
              <li><strong>Trader Credibility</strong>: Evaluate traders based on historical decisions and ethics</li>
              <li><strong>Platform Assessment</strong>: Rank trading platforms using community-driven reviews</li>
              <li><strong>Asset Trustworthiness</strong>: Determine trustworthiness through community ratings</li>
            </ul>

            <h3>Governance & Voting</h3>
            
            <p>Create transparent and verifiable governance systems.</p>

            <h4>Verified Voting</h4>
            
            <p>Build voting systems with built-in verification:</p>
            
            <ul>
              <li><strong>Identity Assurance</strong>: Ensure each vote is tied to a verified identity</li>
              <li><strong>Hackathon Judging</strong>: Capture community votes for fair competition</li>
              <li><strong>DAO Proposal Voting</strong>: Permissionless executions grounded in consensus</li>
              <li><strong>Vote Attestation</strong>: Allow members to vouch for or challenge results</li>
              <li><strong>Reputation-Based Voting Power</strong>: Adjust vote weight based on credibility</li>
            </ul>

            <h4>Crowdsourced Moderation & Safety</h4>
            
            <p>Create community-driven safety systems:</p>
            
            <ul>
              <li><strong>User-Driven Safeguarding</strong>: Enable members to report unsafe activities</li>
              <li><strong>Moderation Ratings</strong>: Assign ratings to moderators based on performance</li>
              <li><strong>Cross-Platform History</strong>: View reputation across different platforms</li>
              <li><strong>Transparent Review Systems</strong>: Allow review of moderation actions</li>
              <li><strong>Collaborative Moderation</strong>: Encourage community collaboration</li>
            </ul>

            <h3>Developer Tools & Infrastructure</h3>
            
            <p>Build the tools and infrastructure that power the Intuition ecosystem.</p>

            <h4>Programmatic Attestations</h4>
            
            <p>Create tools for automated attestation generation:</p>
            
            <ul>
              <li><strong>GitHub Integration</strong>: Transform GitHub contributions into attestations</li>
              <li><strong>ZK-Proof Attestations</strong>: Incorporate Zero-Knowledge proofs for privacy</li>
              <li><strong>Merkle Structures</strong>: Utilize Merkle-based attestations for efficiency</li>
              <li><strong>Attestation-based Dynamic NFTs</strong>: Generate NFTs based on attestation data</li>
            </ul>

            <h2>Building Your Use Case</h2>

            <h3>Getting Started</h3>
            
            <ol>
              <li><strong>Choose Your Category</strong>: Identify which use case category best fits your idea</li>
              <li><strong>Define Your Atoms</strong>: Determine what entities your application will track</li>
              <li><strong>Design Your Triples</strong>: Plan how relationships will be structured</li>
              <li><strong>Implement Signal</strong>: Decide how users will express trust and belief</li>
              <li><strong>Build Your Interface</strong>: Create the user experience that brings it all together</li>
            </ol>

            <h3>Development Resources</h3>
            
            <ul>
              <li><strong><a href="/guides/quickstart">Quick Start Guide</a></strong>: Get up and running with Intuition</li>
              <li><strong><a href="/guides/developer-tools">Developer Tools</a></strong>: Access the tools you need to build</li>
              <li><strong><a href="/guides/introduction/the-primitives">Primitives Documentation</a></strong>: Master the building blocks</li>
              <li><strong><a href="/guides/developer-tools/graphql-api">API Reference</a></strong>: Integrate with Intuition's APIs</li>
            </ul>

            <h3>Community Support</h3>
            
            <ul>
              <li>Join our <a href="https://discord.com/invite/0xintuition" target="_blank" rel="noopener noreferrer">Discord</a> for developer discussions</li>
              <li>Follow us on <a href="https://x.com/0xintuition" target="_blank" rel="noopener noreferrer">X (Twitter)</a> for updates and announcements</li>
              <li>Check out our <a href="https://github.com/0xintuition" target="_blank" rel="noopener noreferrer">GitHub</a> for open-source tools</li>
              <li>Read our <a href="https://medium.com/0xintuition" target="_blank" rel="noopener noreferrer">Medium</a> for technical deep-dives</li>
            </ul>

            <h2>Explore Use Cases</h2>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', marginTop: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>

              <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)', flex: '1', minWidth: '300px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Knowledge Curation</h3>
                <p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
                  Build applications that help users discover the best information, products, and services through community-driven insights and verification.
                </p>
                <a href="#knowledge-curation--discovery" style={{ color: 'var(--ifm-color-primary)', textDecoration: 'none', fontWeight: '500' }}>
                  Explore Curation →
                </a>
              </div>

              <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)', flex: '1', minWidth: '300px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Social Platforms</h3>
                <p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
                  Create the next generation of social platforms where reputation and trust are built into the foundation from day one.
                </p>
                <a href="#social-platforms--community" style={{ color: 'var(--ifm-color-primary)', textDecoration: 'none', fontWeight: '500' }}>
                  Explore Social →
                </a>
              </div>

              <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)', flex: '1', minWidth: '300px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Trust & Reputation</h3>
                <p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
                  Leverage Intuition's ability to create verifiable reputation systems that work across platforms and applications.
                </p>
                <a href="#trust--reputation-systems" style={{ color: 'var(--ifm-color-primary)', textDecoration: 'none', fontWeight: '500' }}>
                  Explore Trust →
                </a>
              </div>

              <div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)', flex: '1', minWidth: '300px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Verification & QA</h3>
                <p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
                  Use collective intelligence to verify and validate any type of information, claim, or quality standard.
                </p>
                <a href="#verification--quality-assurance" style={{ color: 'var(--ifm-color-primary)', textDecoration: 'none', fontWeight: '500' }}>
                  Explore Verification →
                </a>
              </div>

            </div>

            <h2>Ready to Build?</h2>
            
            <p>The possibilities with Intuition are endless. Whether you're building a simple reputation system or a complex prediction market, Intuition's primitives provide the foundation you need to create applications that fundamentally change how we think about trust online.</p>
            
            <p>Start with our <a href="/guides/quickstart">Quick Start Guide</a> or explore the <a href="/guides/developer-tools">Developer Tools</a> to begin creating your own use case!</p>
          </div>
        </div>
      </main>
    </Layout>
  );
} 