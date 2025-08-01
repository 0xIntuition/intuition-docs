import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  children: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="faq-item">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="faq-button"
      >
        <span>{question}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`faq-chevron ${isExpanded ? 'expanded' : ''}`}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      <div
        className={`faq-content ${isExpanded ? 'expanded' : ''}`}
      >
        {children}
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  return (
    <div>
      <FAQItem question="What is Intuition?">
        <p>
          Intuition is a decentralized protocol that enables the creation of trustful interactions through atomic primitives. It provides a foundation for building decentralized applications that can establish and maintain trust between parties without centralized intermediaries.
        </p>
        <p>
          The protocol uses atomic primitives (atoms, triples, signals, and bonding curves) to create trustful interactions. These primitives can be combined to build complex decentralized applications that maintain trust through cryptographic proofs and economic incentives.
        </p>
      </FAQItem>

      <FAQItem question="How do I get started with Intuition?">
        <div>
          <h4>Step 1</h4>
          <p>Read the Documentation: Start with the <a href="/guides/introduction">Introduction</a> and <a href="/guides/introduction/overview">Overview</a> guides to understand the core concepts.</p>
          
          <h4>Step 2</h4>
          <p>Set up Development Environment: Install the necessary SDKs and tools for your preferred programming language.</p>
          
          <h4>Step 3</h4>
          <p>Build Your First App: Follow the tutorials to create a simple application using Intuition primitives.</p>
          
          <h4>Step 4</h4>
          <p>Join the Community: Connect with other developers and get support through our community channels.</p>
        </div>
      </FAQItem>

      <FAQItem question="What are the main components of Intuition?">
        <div>
          <p><strong>Atoms</strong>: The basic units of trust and reputation - unique identifiers for any entity (people, concepts, products)</p>
          <p><strong>Triples</strong>: Relationships between atoms that encode trust - structured as Subject → Predicate → Object</p>
          <p><strong>Signals</strong>: Mechanisms for updating trust relationships - actions that express intent, belief, or support</p>
          <p><strong>Bonding Curves</strong>: Economic models for token pricing and liquidity - automated market making for application tokens</p>
        </div>
      </FAQItem>

      <FAQItem question="What programming languages are supported?">
        <p>Intuition supports multiple programming languages through various SDKs:</p>
        <ul>
          <li><strong>JavaScript/TypeScript</strong>: Official SDK with full feature support</li>
          <li><strong>Python</strong>: Python SDK for backend development</li>
          <li><strong>Rust</strong>: Low-level SDK for performance-critical applications</li>
          <li><strong>Go</strong>: Go SDK for server-side applications</li>
        </ul>
      </FAQItem>

      <FAQItem question="How do I integrate Intuition into my existing app?">
        <div>
          <h4>Step 1</h4>
          <p>Install SDK: Add the appropriate Intuition SDK to your project using your package manager.</p>
          
          <h4>Step 2</h4>
          <p>Configure Connection: Set up connection to the Intuition network with proper authentication.</p>
          
          <h4>Step 3</h4>
          <p>Implement Primitives: Use atoms, triples, signals, and bonding curves in your application logic.</p>
          
          <h4>Step 4</h4>
          <p>Test Integration: Thoroughly test your integration on testnet before production deployment.</p>
        </div>
      </FAQItem>

      <FAQItem question="How do I deploy an application?">
        <div>
          <h4>Step 1</h4>
          <p>Develop Your App: Build your application using Intuition primitives and follow best practices.</p>
          
          <h4>Step 2</h4>
          <p>Test Thoroughly: Test on testnet before mainnet deployment to ensure everything works correctly.</p>
          
          <h4>Step 3</h4>
          <p>Deploy Contracts: Deploy your smart contracts to the network using the appropriate deployment tools.</p>
          
          <h4>Step 4</h4>
          <p>Launch Application: Make your application available to users and monitor its performance.</p>
        </div>
      </FAQItem>

      <FAQItem question="What are the best practices for building with Intuition?">
        <div>
          <p><strong>Start Simple</strong>: Begin with basic primitives before building complex systems to understand the fundamentals.</p>
          <p><strong>Test Extensively</strong>: Use testnets for all development and testing to avoid costly mistakes.</p>
          <p><strong>Follow Security Guidelines</strong>: Implement proper security measures and follow established patterns.</p>
          <p><strong>Document Your Code</strong>: Maintain clear documentation for your applications to help other developers.</p>
          <p><strong>Monitor Applications</strong>: Set up monitoring and alerting for your applications to catch issues early.</p>
        </div>
      </FAQItem>

      <FAQItem question="How does the token economics work?">
        <p>Intuition uses a dual-token system:</p>
        <p><strong>INTUITION</strong>: The main network token used for staking, governance, and network security.</p>
        <p><strong>Application Tokens</strong>: Specific to individual applications for their economic models and bonding curves.</p>
        <p>The system provides automated market making and liquidity for application tokens, enabling dynamic pricing and efficient token distribution through bonding curves.</p>
      </FAQItem>

      <FAQItem question="How can I earn rewards?">
        <div>
          <p><strong>Staking</strong>: Stake INTUITION tokens to earn rewards and participate in network security.</p>
          <p><strong>Running Nodes</strong>: Operate network nodes to earn block rewards and contribute to decentralization.</p>
          <p><strong>Building Applications</strong>: Create successful applications that generate fees and provide value to users.</p>
          <p><strong>Contributing</strong>: Participate in governance and development to help shape the protocol's future.</p>
        </div>
      </FAQItem>

      <FAQItem question="What are bonding curves?">
        <p>Bonding curves are mathematical functions that determine token pricing based on supply and demand. They provide:</p>
        <ul>
          <li><strong>Automated Market Making</strong>: Continuous liquidity without traditional market makers</li>
          <li><strong>Dynamic Pricing</strong>: Token prices that automatically adjust based on supply and demand</li>
          <li><strong>Efficient Distribution</strong>: Fair token distribution through mathematical models</li>
          <li><strong>Liquidity Provision</strong>: Built-in liquidity for application tokens</li>
        </ul>
      </FAQItem>

      <FAQItem question="How do I handle errors and edge cases?">
        <div>
          <p><strong>Implement Error Handling</strong>: Add comprehensive error handling to your applications to gracefully handle failures.</p>
          <p><strong>Use Fallback Mechanisms</strong>: Implement fallbacks for critical operations to ensure reliability.</p>
          <p><strong>Monitor Applications</strong>: Set up monitoring and alerting for your applications to catch issues early.</p>
          <p><strong>Plan for Upgrades</strong>: Design your applications to be upgradeable as the protocol evolves.</p>
        </div>
      </FAQItem>

      <FAQItem question="What if my transaction fails?">
        <p>If your transaction fails, check your wallet to confirm whether your tokens have been returned. In most cases, failed transactions automatically result in the tokens being returned to your wallet.</p>
        <p>Common causes of transaction failures:</p>
        <ul>
          <li><strong>Insufficient Gas</strong>: Ensure you have enough gas for the transaction</li>
          <li><strong>Network Congestion</strong>: Try again during less busy periods</li>
          <li><strong>Incorrect Parameters</strong>: Double-check all transaction parameters before signing</li>
        </ul>
      </FAQItem>

      <FAQItem question="How do I get help and support?">
        <div>
          <p><strong>Community Support</strong>: Join our <a href="https://discord.com/invite/0xintuition" target="_blank" rel="noopener noreferrer">Discord</a> for real-time help from the community.</p>
          <p><strong>Documentation</strong>: Check our comprehensive <a href="/guides">documentation</a> for detailed guides and tutorials.</p>
          <p><strong>GitHub</strong>: Report issues and contribute to the project on <a href="https://github.com/0xintuition" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
          <p><strong>Email Support</strong>: Contact us directly at <a href="mailto:support@intuition.systems">support@intuition.systems</a> for technical assistance.</p>
        </div>
      </FAQItem>

      <FAQItem question="What are the main use cases for Intuition?">
        <div>
          <p><strong>Knowledge Curation</strong>: Build applications that help users discover and verify information through community consensus.</p>
          <p><strong>Social Platforms</strong>: Create decentralized social networks with built-in reputation and trust systems.</p>
          <p><strong>Trust & Reputation</strong>: Develop verifiable reputation systems that work across platforms and applications.</p>
          <p><strong>Verification & QA</strong>: Use collective intelligence to verify and validate any type of information or claim.</p>
          <p><strong>Prediction Markets</strong>: Build prediction markets with built-in verification and community consensus.</p>
          <p><strong>Business & Professional Platforms</strong>: Create platforms that verify professional credentials and facilitate trusted business relationships.</p>
        </div>
      </FAQItem>

      <FAQItem question="How do I contribute to the Intuition ecosystem?">
        <div>
          <p><strong>Develop Applications</strong>: Build applications that leverage Intuition's primitives and contribute to the ecosystem.</p>
          <p><strong>Improve Documentation</strong>: Help improve our documentation by suggesting edits or contributing new guides.</p>
          <p><strong>Participate in Governance</strong>: Stake tokens and participate in protocol governance decisions.</p>
          <p><strong>Report Issues</strong>: Help improve the protocol by reporting bugs and suggesting improvements.</p>
          <p><strong>Community Building</strong>: Help grow the community by answering questions and mentoring new developers.</p>
        </div>
      </FAQItem>
    </div>
  );
};

export default FAQ; 