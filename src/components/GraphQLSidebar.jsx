import React, { useState } from 'react';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="collapsible-section">
      <div 
        className={`collapsible-header ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3>{title}</h3>
        <span className="collapse-icon">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default function GraphQLSidebar() {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <h3>Overview</h3>
      <ul>
        <li><Link to="/graphql">Introduction</Link></li>
      </ul>

      <h3>Read</h3>
      <ul>
        <CollapsibleSection title="Atoms">
          <ul>
            <li><Link to="/graphql/read/atoms#list-atoms">List Atoms</Link></li>
            <li><Link to="/graphql/read/atoms#get-single-atom">Get Single Atom</Link></li>
          </ul>
        </CollapsibleSection>
        
        <CollapsibleSection title="Accounts">
          <ul>
            <li><Link to="/graphql/read/accounts#list-accounts">List Accounts</Link></li>
            <li><Link to="/graphql/read/accounts#get-single-account">Get Single Account</Link></li>
          </ul>
        </CollapsibleSection>
        
        <CollapsibleSection title="Triples">
          <ul>
            <li><Link to="/graphql/read/triples#list-triples">List Triples</Link></li>
            <li><Link to="/graphql/read/triples#get-single-triple">Get Single Triple</Link></li>
          </ul>
        </CollapsibleSection>
        
        <CollapsibleSection title="Positions">
          <ul>
            <li><Link to="/graphql/read/positions#list-positions">List Positions</Link></li>
            <li><Link to="/graphql/read/positions#get-single-position">Get Single Position</Link></li>
          </ul>
        </CollapsibleSection>
        
        <CollapsibleSection title="Vaults">
          <ul>
            <li><Link to="/graphql/read/vaults#list-vaults">List Vaults</Link></li>
            <li><Link to="/graphql/read/vaults#get-single-vault">Get Single Vault</Link></li>
          </ul>
        </CollapsibleSection>
        
        <CollapsibleSection title="Utilities">
          <ul>
            <li><Link to="/graphql/read/utilities#get-stats">Get Stats</Link></li>
            <li><Link to="/graphql/read/utilities#get-health">Get Health</Link></li>
          </ul>
        </CollapsibleSection>
      </ul>

      <h3>Write</h3>
      <ul>
        <CollapsibleSection title="GraphQL Mutations">
          <ul>
            <li><Link to="/graphql/write/mutations#current-schema-support">Current Schema Support</Link></li>
            <li><Link to="/graphql/write/mutations#example-usage">Example Usage</Link></li>
            <li><Link to="/graphql/write/mutations#upcoming-schema-support">Upcoming Schema Support</Link></li>
            <li><Link to="/graphql/write/mutations#best-practices">Best Practices</Link></li>
            <li><Link to="/graphql/write/mutations#example-workflows">Example Workflows</Link></li>
            <li><Link to="/graphql/write/mutations#typescript-integration">TypeScript Integration</Link></li>
            <li><Link to="/graphql/write/mutations#future-schema-support">Future Schema Support</Link></li>
          </ul>
        </CollapsibleSection>
      </ul>
    </div>
  );
} 