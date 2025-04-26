import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ExplorerEmbed from '../../components/ExplorerEmbed';

function GraphQLDocs() {
  return (
    <Layout
      title="GraphQL API Documentation"
      description="Explore Intuition's GraphQL API documentation with interactive examples and comprehensive guides."
      noFooter
      wrapperClassName="graphql-reference"
    >
      <Head>
        <title>GraphQL API Documentation | Intuition Docs</title>
        <meta
          name="description"
          content="Explore Intuition's GraphQL API documentation with interactive examples and comprehensive guides."
        />
      </Head>

      <div className="header">
        <h1 className="mb-0 flex items-center gap-2 text-sm font-semibold lg:text-lg">
          GraphQL API
        </h1>
      </div>

      <div className="elements-container">
        <div className="explorer-section">
          <ExplorerEmbed />
        </div>
        
        <div className="content-section">
          <h2>Welcome to Intuition's GraphQL API</h2>
          <p>
            Our GraphQL API provides a flexible and powerful way to interact with Intuition's data and services. 
            This interface allows you to request exactly the data you need and receive predictable results.
          </p>

          <h3>Getting Started</h3>
          <p>
            All GraphQL API requests must be authenticated using a valid API key. Include your API key in the 
            request headers as: <code>Authorization: Bearer YOUR_API_KEY</code>
          </p>

          <h3>Base URL</h3>
          <p>
            All GraphQL requests should be sent as POST requests to:<br />
            <code>https://api.intuition.systems/graphql</code>
          </p>

          <h3>Documentation Structure</h3>
          <p>Our documentation is organized into the following sections:</p>
          <ul>
            <li><strong>Read Operations</strong>
              <ul>
                <li>Atoms - Query and manage atomic data units</li>
                <li>Accounts - Access account information</li>
                <li>Triples - Work with semantic relationships</li>
                <li>Positions - Handle position data</li>
                <li>Vaults - Manage vault information</li>
                <li>Utilities - Access system information</li>
              </ul>
            </li>
            <li><strong>Write Operations</strong>
              <ul>
                <li>Mutations - Create and modify data</li>
                <li>Schema Support - Understanding data structures</li>
                <li>Best Practices - Guidelines for optimal usage</li>
              </ul>
            </li>
          </ul>

          <h3>Interactive Explorer</h3>
          <p>
            Use the Apollo Explorer above to test queries and explore the API schema in real-time. 
            The explorer provides auto-completion, documentation, and validation as you write queries.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default GraphQLDocs; 