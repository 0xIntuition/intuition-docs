import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';

function AtomsDoc() {
  return (
    <Layout
      title="Atoms API Reference"
      description="Query and retrieve information about atoms in the system"
      noFooter
      wrapperClassName="graphql-reference"
    >
      <Head>
        <title>Atoms API Reference | Intuition Docs</title>
        <meta
          name="description"
          content="Query and retrieve information about atoms in the system"
        />
      </Head>

      <div className="header">
        <h1 className="mb-0 flex items-center gap-2 text-sm font-semibold lg:text-lg">
          Atoms API Reference
        </h1>
      </div>

      <div className="content-section">
        <h2>List Atoms</h2>
        <p>Retrieve a collection of atoms with optional filtering and pagination.</p>
        <pre><code>{`query GetAtoms($first: Int, $after: String) {
  atoms(first: $first, after: $after) {
    edges {
      node {
        id
        metadata
        createdAt
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`}</code></pre>

        <h3>Parameters</h3>
        <ul>
          <li><code>first</code> (Int): Number of items to return</li>
          <li><code>after</code> (String): Cursor for pagination</li>
        </ul>

        <h2>Get Single Atom</h2>
        <p>Fetch detailed information about a specific atom by its ID.</p>
        <pre><code>{`query GetAtom($id: ID!) {
  atom(id: $id) {
    id
    metadata
    createdAt
    updatedAt
  }
}`}</code></pre>

        <h3>Parameters</h3>
        <ul>
          <li><code>id</code> (ID!): The unique identifier of the atom</li>
        </ul>

        <h2>Response Types</h2>
        <h3>Atom</h3>
        <pre><code>{`type Atom {
  id: ID!
  metadata: JSON!
  createdAt: DateTime!
  updatedAt: DateTime!
}`}</code></pre>

        <h3>AtomConnection</h3>
        <pre><code>{`type AtomConnection {
  edges: [AtomEdge!]!
  pageInfo: PageInfo!
}

type AtomEdge {
  node: Atom!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}`}</code></pre>
      </div>
    </Layout>
  );
}

export default AtomsDoc; 