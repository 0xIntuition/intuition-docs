import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useLocation, useHistory } from '@docusaurus/router';
import ExplorerEmbed from '../components/ExplorerEmbed';
import { Highlight, themes } from 'prism-react-renderer';

const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="code-block-container">
      <button
        className={`copy-button ${copied ? 'copied' : ''}`}
        onClick={copyToClipboard}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <Highlight theme={themes.nightOwl} code={code.trim()} language="graphql">
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

const ContentSections = {
  overview: {
    title: "Welcome to Intuition's GraphQL API",
    content: () => (
      <>
        <p>
          Our GraphQL API provides a flexible and powerful way to interact with Intuition's data and services. 
          This interface allows you to request exactly the data you need and receive predictable results.
        </p>

        <h3>Getting Started</h3>
        <p>
          GraphQL API requests are authenticated using standard web3 methods. Connect your wallet to access the API.
        </p>

        <h3>Base URL</h3>
        <p>
          All GraphQL requests should be sent as POST requests to:<br />
          <code>https://api.intuition.systems/graphql</code>
        </p>

        <h3>Interactive Explorer</h3>
        <p>
          Use the Apollo Explorer above to test queries and explore the API schema in real-time. 
          The explorer provides auto-completion, documentation, and validation as you write queries.
        </p>
      </>
    )
  },
  'list-atoms': {
    title: 'List Atoms',
    content: () => (
      <>
        <p>Retrieves a collection of atoms based on specified filters and parameters.</p>

        <h3>Parameters</h3>
        <ul>
          <li><code>limit</code> (Int): Maximum number of items to return</li>
          <li><code>offset</code> (Int): Number of items to skip</li>
          <li><code>orderBy</code> ([atoms_order_by!]): Sorting criteria for the results</li>
          <li><code>where</code> (atoms_bool_exp): Filter conditions for the query</li>
        </ul>

        <h3>Response Fields</h3>
        <h4>AtomMetadata</h4>
        <ul>
          <li><code>data</code>: Raw atom data</li>
          <li><code>id</code>: Unique identifier</li>
          <li><code>image</code>: Associated image URL</li>
          <li><code>label</code>: Display label</li>
          <li><code>emoji</code>: Associated emoji</li>
          <li><code>type</code>: Atom type</li>
          <li><code>creator</code>: Information about the atom's creator</li>
          <li><code>value</code>: Structured data for specific entity types (person, thing, organization)</li>
        </ul>

        <h4>AtomTxn</h4>
        <ul>
          <li><code>block_number</code>: Block number where the atom was created</li>
          <li><code>block_timestamp</code>: Timestamp of the block</li>
          <li><code>transaction_hash</code>: Hash of the creation transaction</li>
          <li><code>creator_id</code>: ID of the creator</li>
        </ul>

        <h4>AtomVaultDetails</h4>
        <ul>
          <li><code>vault_id</code>: Associated vault identifier</li>
          <li><code>wallet_id</code>: Associated wallet identifier</li>
          <li><code>vault</code>: Detailed vault information including positions and shares</li>
        </ul>

        <h4>AtomTriple</h4>
        <ul>
          <li><code>as_subject_triples</code>: Triples where this atom is the subject</li>
          <li><code>as_predicate_triples</code>: Triples where this atom is the predicate</li>
          <li><code>as_object_triples</code>: Triples where this atom is the object</li>
        </ul>

        <h3>Query</h3>
        <CodeBlock code={`query GetAtoms(
  $limit: Int
  $offset: Int
  $orderBy: [atoms_order_by!]
  $where: atoms_bool_exp
) {
  atoms_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  atoms(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
    # AtomMetadata fields
    data
    id
    image
    label
    emoji
    type
    creator {
      id
      label
      image
    }
    value {
      person {
        name
        image
        description
        url
      }
      thing {
        name
        image
        description
        url
      }
      organization {
        name
        image
        description
        url
      }
    }

    # AtomTxn fields
    block_number
    block_timestamp
    transaction_hash
    creator_id

    # AtomVaultDetails fields
    vault_id
    wallet_id
    vault {
      position_count
      total_shares
      current_share_price
      positions_aggregate {
        aggregate {
          count
          sum {
            shares
          }
        }
      }
      positions {
        id
        account {
          label
          id
        }
        shares
      }
    }

    # AtomTriple fields
    as_subject_triples {
      id
      object {
        data
        id
        image
        label
        emoji
        type
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
      predicate {
        data
        id
        image
        label
        emoji
        type
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
    }
    as_predicate_triples {
      id
      subject {
        data
        id
        image
        label
        emoji
        type
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
      object {
        data
        id
        image
        label
        emoji
        type
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
    }
    as_object_triples {
      id
      subject {
        data
        id
        image
        label
        emoji
        type
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
      predicate {
        data
        id
        image
        label
        emoji
        type
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
    }
  }
}`} />
      </>
    )
  },
  'get-single-atom': {
    title: 'Get Single Atom',
    content: () => (
      <>
        <p>Fetches a single atom by its unique identifier (id).</p>

        <h3>Parameters</h3>
        <ul>
          <li><code>id</code> (String!): Required. The unique identifier of the atom to retrieve</li>
        </ul>

        <h3>Response Fields</h3>
        <h4>AtomMetadata</h4>
        <ul>
          <li><code>data</code>: Raw atom data</li>
          <li><code>id</code>: Unique identifier</li>
          <li><code>image</code>: Associated image URL</li>
          <li><code>label</code>: Display label</li>
          <li><code>emoji</code>: Associated emoji</li>
          <li><code>type</code>: Atom type</li>
          <li><code>creator</code>: Information about the atom's creator</li>
          <li><code>value</code>: Structured data for specific entity types (person, thing, organization)</li>
        </ul>

        <h4>AtomTxn</h4>
        <ul>
          <li><code>block_number</code>: Block number where the atom was created</li>
          <li><code>block_timestamp</code>: Timestamp of the block</li>
          <li><code>transaction_hash</code>: Hash of the creation transaction</li>
          <li><code>creator_id</code>: ID of the creator</li>
        </ul>

        <h4>AtomVaultDetails</h4>
        <ul>
          <li><code>vault_id</code>: Associated vault identifier</li>
          <li><code>wallet_id</code>: Associated wallet identifier</li>
          <li><code>vault</code>: Detailed vault information including positions and shares</li>
        </ul>

        <h4>AtomTriple</h4>
        <ul>
          <li><code>as_subject_triples</code>: Triples where this atom is the subject</li>
          <li><code>as_predicate_triples</code>: Triples where this atom is the predicate</li>
          <li><code>as_object_triples</code>: Triples where this atom is the object</li>
          <li><code>triplesPredicateTotal</code>: Total count of triples where this atom is the predicate</li>
          <li><code>triplesObjectTotal</code>: Total count of triples where this atom is the object</li>
        </ul>

        <h3>Query</h3>
        <CodeBlock code={`query GetAtom($id: numeric!) {
  atom(id: $id) {
     # AtomMetadata fields
    data
    id
    image
    label
    emoji
    type
    creator {
      id
      label
      image
    }
    value {
      person {
        name
        image
        description
        url
      }
      thing {
        name
        image
        description
        url
      }
      organization {
        name
        image
        description
        url
      }
    }

    # AtomTxn fields
    block_number
    block_timestamp
    transaction_hash
    creator_id

    # AtomVaultDetails fields
    vault_id
    wallet_id
    vault {
      position_count
      total_shares
      current_share_price
      positions_aggregate {
        aggregate {
          count
          sum {
            shares
          }
        }
      }
      positions {
        id
        account {
          label
          id
        }
        shares
      }
    }

    # AtomTriple fields
    as_subject_triples {
      id
      object {
        data
        id
        image
        label
        emoji
        type
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
      predicate {
        data
        id
        image
        label
        emoji
        type
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
    }
    as_predicate_triples {
      id
      subject {
        data
        id
        image
        label
        emoji
        type
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
      object {
        data
        id
        image
        label
        emoji
        type
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
    }
    as_object_triples {
      id
      subject {
        data
        id
        image
        label
        emoji
        type
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
      predicate {
        data
        id
        image
        label
        emoji
        type
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
    }

    triplesPredicateTotal: as_predicate_triples_aggregate {
      aggregate {
        count
      }
    }

    triplesObjectTotal: as_object_triples_aggregate {
      aggregate {
        count
      }
    }
  }
}`} />

        <h3>Example Variables</h3>
        <CodeBlock code={`{
  "id": "13"
}`} />
      </>
    )
  },
  'list-accounts': {
    title: 'List Accounts',
    content: () => (
      <>
        <p>Retrieves a collection of accounts based on specified filters and parameters.</p>

        <h3>Parameters</h3>
        <ul>
          <li><code>limit</code> (Int): Maximum number of items to return</li>
          <li><code>offset</code> (Int): Number of items to skip</li>
          <li><code>orderBy</code> ([accounts_order_by!]): Sorting criteria for the results</li>
          <li><code>where</code> (accounts_bool_exp): Filter conditions for the query</li>
        </ul>

        <h3>Response Fields</h3>
        <h4>AccountMetadata</h4>
        <ul>
          <li><code>label</code>: Display label for the account</li>
          <li><code>image</code>: Associated image URL</li>
          <li><code>id</code>: Unique identifier (address)</li>
          <li><code>atom_id</code>: Associated atom ID</li>
          <li><code>type</code>: Account type</li>
        </ul>

        <h4>AccountClaims</h4>
        <ul>
          <li><code>claims</code>: List of claims, ordered by shares in descending order</li>
          <li><code>triple</code>: Associated triple information</li>
          <li><code>shares</code>: Number of shares in the claim</li>
          <li><code>counter_shares</code>: Number of counter shares</li>
        </ul>

        <h4>AccountPositions</h4>
        <ul>
          <li><code>positions</code>: List of positions, ordered by shares in descending order</li>
          <li><code>vault</code>: Associated vault information including total shares and share price</li>
          <li><code>atom</code>: Associated atom information including vault and wallet details</li>
        </ul>

        <h3>Query</h3>
        <CodeBlock code={`query GetAccounts {
  accounts {
    # AccountMetadata fields
    label
    image
    id
    atom_id
    type

    # AccountClaims fields
    claims(order_by: { shares: desc }) {
      triple {
        id
      }
      shares
      counter_shares
    }

    # AccountPositions fields
    positions(order_by: { shares: desc }) {
      id
      shares
      vault {
        id
        total_shares
        current_share_price
        atom {
          id
          label
        }
        triple {
          id
        }
      }
    }
    atom {
      vault_id
      wallet_id
      vault {
        position_count
        total_shares
        positions_aggregate {
          aggregate {
            count
            sum {
              shares
            }
          }
        }
        positions {
          id
          account {
            label
            id
          }
          shares
        }
      }
    }
  }
}`} />
      </>
    )
  },
  'get-single-account': {
    title: 'Get Single Account',
    content: () => (
      <>
        <p>Fetches a single account by its unique identifier (address).</p>

        <h3>Parameters</h3>
        <ul>
          <li><code>id</code> (String!): Required. The unique identifier of the account to retrieve</li>
        </ul>

        <h3>Response Fields</h3>
        <h4>AccountMetadata</h4>
        <ul>
          <li><code>label</code>: Display label for the account</li>
          <li><code>image</code>: Associated image URL</li>
          <li><code>id</code>: Unique identifier (address)</li>
          <li><code>atom_id</code>: Associated atom ID</li>
          <li><code>type</code>: Account type</li>
        </ul>

        <h4>Associated Atom</h4>
        <ul>
          <li><code>atom</code>: Detailed information about the associated atom</li>
          <li><code>creator</code>: Information about the atom's creator</li>
          <li><code>wallet_id</code>: Associated wallet identifier</li>
        </ul>

        <h4>Claims</h4>
        <ul>
          <li><code>claims</code>: List of claims, ordered by shares in descending order</li>
          <li><code>triple</code>: Associated triple information</li>
          <li><code>shares</code>: Number of shares in the claim</li>
          <li><code>counter_shares</code>: Number of counter shares</li>
        </ul>

        <h3>Query</h3>
        <CodeBlock code={`query GetAccount($address: String!) {
  account(id: $address) {
    label
    image
    id
    atom_id
    type
    atom {
      id
      data
      image
      label
      emoji
      type
      wallet_id
      creator {
        id
        label
        image
      }
    }

    claims(order_by: { shares: desc }) {
      triple {
        id
      }
      shares
      counter_shares
    }
  }
}`} />

        <h3>Example Variables</h3>
        <CodeBlock code={`{
  "address": "0x88d0af73508452c1a453356b3fac26525aec23a2"
}`} />
      </>
    )
  },
  'list-triples': {
    title: 'List Triples',
    content: () => (
      <>
        <p>Retrieves a collection of triples based on specified filters and parameters.</p>

        <h3>Parameters</h3>
        <ul>
          <li><code>limit</code> (Int): Maximum number of items to return</li>
          <li><code>offset</code> (Int): Number of items to skip</li>
          <li><code>orderBy</code> ([triples_order_by!]): Sorting criteria for the results</li>
          <li><code>where</code> (triples_bool_exp): Filter conditions for the query</li>
        </ul>

        <h3>Response Fields</h3>
        <h4>TripleMetadata</h4>
        <ul>
          <li><code>id</code>: Unique identifier for the triple</li>
          <li><code>subject</code>: The subject atom with its metadata and creator information</li>
          <li><code>predicate</code>: The predicate atom with its metadata and creator information</li>
          <li><code>object</code>: The object atom with its metadata and creator information</li>
        </ul>

        <h4>TripleTxn</h4>
        <ul>
          <li><code>block_number</code>: Block number where the triple was created</li>
          <li><code>block_timestamp</code>: Timestamp of the block</li>
          <li><code>transaction_hash</code>: Hash of the creation transaction</li>
          <li><code>creator_id</code>: ID of the creator</li>
        </ul>

        <h4>TripleVaultDetails</h4>
        <ul>
          <li><code>vault_id</code>: Primary vault identifier</li>
          <li><code>counter_vault_id</code>: Counter vault identifier</li>
          <li><code>vault</code>: Primary vault information including shares and associated atom</li>
          <li><code>counter_vault</code>: Counter vault information including shares and associated atom</li>
        </ul>

        <h4>Creator</h4>
        <ul>
          <li><code>label</code>: Display label for the creator</li>
          <li><code>image</code>: Creator's image URL</li>
          <li><code>id</code>: Creator's unique identifier</li>
          <li><code>atom_id</code>: Associated atom ID</li>
          <li><code>type</code>: Creator type</li>
        </ul>

        <h3>Query</h3>
        <CodeBlock code={`query GetTriples(
  $limit: Int
  $offset: Int
  $orderBy: [triples_order_by!]
  $where: triples_bool_exp
) {
  triples(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
    # TripleMetadata fields
    id
    subject {
      data
      id
      image
      label
      emoji
      type
      creator {
        label
        image
        id
        atom_id
        type
      }
    }
    predicate {
      data
      id
      image
      label
      emoji
      type
      creator {
        label
        image
        id
        atom_id
        type
      }
    }
    object {
      data
      id
      image
      label
      emoji
      type
      creator {
        label
        image
        id
        atom_id
        type
      }
    }
    
    # TripleTxn fields
    block_number
    block_timestamp
    transaction_hash
    creator_id
    
    # TripleVaultDetails fields
    vault_id
    counter_vault_id
    vault {
      id
      total_shares
      current_share_price
      position_count
      atom {
        id
        label
      }
    }
    counter_vault {
      id
      total_shares
      current_share_price
      position_count
      atom {
        id
        label
      }
    }
    
    # Creator fields
    creator {
      label
      image
      id
      atom_id
      type
    }
  }
}`} />
      </>
    )
  },
  'get-single-triple': {
    title: 'Get Single Triple',
    content: () => (
      <>
        <p>Fetches a single triple by its unique identifier (id).</p>

        <h3>Parameters</h3>
        <ul>
          <li><code>id</code> (String!): Required. The unique identifier of the triple to retrieve</li>
        </ul>

        <h3>Response Fields</h3>
        <h4>TripleMetadata</h4>
        <ul>
          <li><code>id</code>: Unique identifier for the triple</li>
          <li><code>subject</code>: The subject atom with its metadata and creator information</li>
          <li><code>predicate</code>: The predicate atom with its metadata and creator information</li>
          <li><code>object</code>: The object atom with its metadata and creator information</li>
        </ul>

        <h4>TripleTxn</h4>
        <ul>
          <li><code>block_number</code>: Block number where the triple was created</li>
          <li><code>block_timestamp</code>: Timestamp of the block</li>
          <li><code>transaction_hash</code>: Hash of the creation transaction</li>
          <li><code>creator_id</code>: ID of the creator</li>
        </ul>

        <h4>TripleVaultDetails</h4>
        <ul>
          <li><code>vault_id</code>: Primary vault identifier</li>
          <li><code>counter_vault_id</code>: Counter vault identifier</li>
          <li><code>vault</code>: Primary vault information including shares and associated atom</li>
          <li><code>counter_vault</code>: Counter vault information including shares and associated atom</li>
        </ul>

        <h4>Creator</h4>
        <ul>
          <li><code>label</code>: Display label for the creator</li>
          <li><code>image</code>: Creator's image URL</li>
          <li><code>id</code>: Creator's unique identifier</li>
          <li><code>atom_id</code>: Associated atom ID</li>
          <li><code>type</code>: Creator type</li>
        </ul>

        <h3>Query</h3>
        <CodeBlock code={`query GetTriple($tripleId: numeric!) {
  triple(id: $tripleId) {
    # TripleMetadata fields
    id
    subject {
      data
      id
      image
      label
      emoji
      type
      creator {
        label
        image
        id
        atom_id
        type
      }
    }
    predicate {
      data
      id
      image
      label
      emoji
      type
      creator {
        label
        image
        id
        atom_id
        type
      }
    }
    object {
      data
      id
      image
      label
      emoji
      type
      creator {
        label
        image
        id
        atom_id
        type
      }
    }
    
    # TripleTxn fields
    block_number
    block_timestamp
    transaction_hash
    creator_id
    
    # TripleVaultDetails fields
    vault_id
    counter_vault_id
    vault {
      id
      total_shares
      current_share_price
      position_count
      atom {
        id
        label
      }
    }
    counter_vault {
      id
      total_shares
      current_share_price
      position_count
      atom {
        id
        label
      }
    }
    
    # Creator fields
    creator {
      label
      image
      id
      atom_id
      type
    }
  }
}`} />

        <h3>Example Variables</h3>
        <CodeBlock code={`{
  "tripleId": "15"
}`} />
      </>
    )
  },
  'list-positions': {
    title: 'List Positions',
    content: () => (
      <>
        <p>Retrieves a collection of positions based on specified filters and parameters.</p>

        <h3>Parameters</h3>
        <ul>
          <li><code>where</code> (positions_bool_exp): Filter conditions for the query</li>
        </ul>

        <h3>Response Fields</h3>
        <h4>Aggregate Data</h4>
        <ul>
          <li><code>total</code>: Aggregate information including total count and sum of shares</li>
        </ul>

        <h4>Position Details</h4>
        <ul>
          <li><code>id</code>: Unique identifier for the position</li>
          <li><code>shares</code>: Number of shares in the position</li>
          <li><code>vault_id</code>: Associated vault identifier</li>
        </ul>

        <h4>Account Information</h4>
        <ul>
          <li><code>account</code>: Associated account details including ID, label, and image</li>
        </ul>

        <h4>Vault and Triple Details</h4>
        <ul>
          <li><code>vault</code>: Vault information including associated atom and triple</li>
          <li><code>triple</code>: Detailed triple information including:
            <ul>
              <li>Vault and counter vault statistics</li>
              <li>Subject, predicate, and object atoms with full metadata</li>
              <li>Value information for person, thing, and organization types</li>
            </ul>
          </li>
        </ul>

        <h3>Query</h3>
        <CodeBlock code={`query GetPositions(
  $where: positions_bool_exp
) {
  total: positions_aggregate(where: $where) {
    aggregate {
      count
      sum {
        shares
      }
    }
  }
  positions(where: $where) {
    id
    account {
      id
      label
      image
    }
    vault {
      id
      atom {
        id
        label
        image
      }
      triple {
        id
        vault {
          id
          position_count
          positions_aggregate {
            aggregate {
              sum {
                shares
              }
            }
          }
        }
        counter_vault {
          id
          position_count
          positions_aggregate {
            aggregate {
              sum {
                shares
              }
            }
          }
        }
        subject {
          data
          id
          label
          image
          emoji
          type
          value {
            person {
              name
              image
              description
              url
            }
            thing {
              name
              image
              description
              url
            }
            organization {
              name
              image
              description
              url
            }
          }
          creator {
            label
            image
            id
            atom_id
            type
          }
        }
        predicate {
          data
          id
          label
          image
          emoji
          type
          value {
            person {
              name
              image
              description
              url
            }
            thing {
              name
              image
              description
              url
            }
            organization {
              name
              image
              description
              url
            }
          }
          creator {
            label
            image
            id
            atom_id
            type
          }
        }
        object {
          data
          id
          label
          image
          emoji
          type
          value {
            person {
              name
              image
              description
              url
            }
            thing {
              name
              image
              description
              url
            }
            organization {
              name
              image
              description
              url
            }
          }
          creator {
            label
            image
            id
            atom_id
            type
          }
        }
      }
    }
    shares
    vault_id
  }
}`} />
      </>
    )
  },
  'get-single-position': {
    title: 'Get Single Position',
    content: () => (
      <>
        <p>Fetches a single position by its unique identifier (id).</p>

        <h3>Parameters</h3>
        <ul>
          <li><code>positionId</code> (String!): Required. The unique identifier of the position to retrieve</li>
        </ul>

        <h3>Response Fields</h3>
        <h4>Position Details</h4>
        <ul>
          <li><code>id</code>: Unique identifier for the position</li>
          <li><code>shares</code>: Number of shares in the position</li>
          <li><code>vault_id</code>: Associated vault identifier</li>
        </ul>

        <h4>Account Information</h4>
        <ul>
          <li><code>account</code>: Associated account details including ID, label, and image</li>
        </ul>

        <h4>Vault and Triple Details</h4>
        <ul>
          <li><code>vault</code>: Vault information including associated atom and triple</li>
          <li><code>triple</code>: Detailed triple information including:
            <ul>
              <li>Vault and counter vault statistics</li>
              <li>Subject, predicate, and object atoms with full metadata</li>
              <li>Value information for person, thing, and organization types</li>
            </ul>
          </li>
        </ul>

        <h3>Query</h3>
        <CodeBlock code={`query GetPosition($positionId: String!) {
  position(id: $positionId) {
    id
    account {
      id
      label
      image
    }
    vault {
      id
      atom {
        id
        label
        image
      }
      triple {
        id
        vault {
          id
          position_count
          positions_aggregate {
            aggregate {
              sum {
                shares
              }
            }
          }
        }
        counter_vault {
          id
          position_count
          positions_aggregate {
            aggregate {
              sum {
                shares
              }
            }
          }
        }
        subject {
          data
          id
          label
          image
          emoji
          type
          value {
            person {
              name
              image
              description
              url
            }
            thing {
              name
              image
              description
              url
            }
            organization {
              name
              image
              description
              url
            }
          }
          creator {
            label
            image
            id
            atom_id
            type
          }
        }
        predicate {
          data
          id
          label
          image
          emoji
          type
          value {
            person {
              name
              image
              description
              url
            }
            thing {
              name
              image
              description
              url
            }
            organization {
              name
              image
              description
              url
            }
          }
          creator {
            label
            image
            id
            atom_id
            type
          }
        }
        object {
          data
          id
          label
          image
          emoji
          type
          value {
            person {
              name
              image
              description
              url
            }
            thing {
              name
              image
              description
              url
            }
            organization {
              name
              image
              description
              url
            }
          }
          creator {
            label
            image
            id
            atom_id
            type
          }
        }
      }
    }
    shares
    vault_id
  }
}`} />

        <h3>Example Variables</h3>
        <CodeBlock code={`{
  "positionId": "13-0x000ddc0e1bbfd22d2f0909d4638fec62aafea106"
}`} />
      </>
    )
  },
  'list-vaults': {
    title: 'List Vaults',
    content: () => (
      <>
        <p>Retrieves a collection of vaults based on specified filters and parameters.</p>

        <h3>Parameters</h3>
        <ul>
          <li><code>limit</code> (Int): Maximum number of items to return</li>
          <li><code>offset</code> (Int): Number of items to skip</li>
          <li><code>orderBy</code> ([vaults_order_by!]): Sorting criteria for the results</li>
          <li><code>where</code> (vaults_bool_exp): Filter conditions for the query</li>
        </ul>

        <h3>Response Fields</h3>
        <h4>Aggregate Data</h4>
        <ul>
          <li><code>vaults_aggregate</code>: Total count of vaults matching the filter criteria</li>
        </ul>

        <h4>Vault Details</h4>
        <ul>
          <li><code>id</code>: Unique identifier for the vault</li>
          <li><code>position_count</code>: Number of positions in the vault</li>
          <li><code>current_share_price</code>: Current price per share</li>
          <li><code>total_shares</code>: Total number of shares in the vault</li>
        </ul>

        <h4>Associated Atom</h4>
        <ul>
          <li><code>atom</code>: Basic atom information including ID and label</li>
        </ul>

        <h4>Associated Triple</h4>
        <ul>
          <li><code>triple</code>: Associated triple information including:
            <ul>
              <li>Subject atom (ID and label)</li>
              <li>Predicate atom (ID and label)</li>
              <li>Object atom (ID and label)</li>
            </ul>
          </li>
        </ul>

        <h4>Position Information</h4>
        <ul>
          <li><code>positions</code>: List of positions in the vault, including:
            <ul>
              <li>Account details (ID and label)</li>
              <li>Number of shares held</li>
            </ul>
          </li>
        </ul>

        <h3>Query</h3>
        <CodeBlock code={`query GetVaults(
  $where: vaults_bool_exp
) {
  vaults_aggregate(
    where: $where
  ) {
    aggregate {
      count
    }
  }
    vaults {
      id
      atom {
        id
        label
      }
      triple {
        id
        subject {
          id
          label
        }
        predicate {
          id
          label
        }
        object {
          id
          label
        }
      }
      position_count
      positions {
          account {
            id
            label
          }
          shares
        }
      current_share_price
      total_shares
    }
  }`} />
      </>
    )
  },
  'get-single-vault': {
    title: 'Get Single Vault',
    content: () => (
      <>
        <p>Fetches a single vault by its unique identifier (id).</p>

        <h3>Parameters</h3>
        <ul>
          <li><code>id</code> (String!): Required. The unique identifier of the vault to retrieve</li>
        </ul>

        <h3>Response Fields</h3>
        <h4>Vault Details</h4>
        <ul>
          <li><code>id</code>: Unique identifier for the vault</li>
          <li><code>current_share_price</code>: Current price per share</li>
          <li><code>total_shares</code>: Total number of shares in the vault</li>
        </ul>

        <h4>Associated Atom</h4>
        <ul>
          <li><code>atom</code>: Basic atom information including ID and label</li>
        </ul>

        <h4>Associated Triple</h4>
        <ul>
          <li><code>triple</code>: Associated triple information including:
            <ul>
              <li>Subject atom (ID and label)</li>
              <li>Predicate atom (ID and label)</li>
              <li>Object atom (ID and label)</li>
            </ul>
          </li>
        </ul>

        <h3>Query</h3>
        <CodeBlock code={`query GetVault($vaultId: numeric!) {
  vault(id: $vaultId) {
    id
    atom {
      id
      label
    }
    triple {
      id
      subject {
        id
        label
      }
      predicate {
        id
        label
      }
      object {
        id
        label
      }
    }
    current_share_price
    total_shares
  }
}`} />

        <h3>Example Variables</h3>
        <CodeBlock code={`{
  "vaultId": "1"
}`} />
      </>
    )
  },
  'get-events': {
    title: 'Get Events',
    content: () => (
      <>
        <p>Retrieves system events with associated data.</p>

        <h3>Parameters</h3>
        <ul>
          <li><code>limit</code> (Int): Maximum number of events to return</li>
          <li><code>offset</code> (Int): Number of events to skip</li>
          <li><code>orderBy</code> ([events_order_by!]): Sorting criteria for the results</li>
          <li><code>where</code> (events_bool_exp): Filter conditions for the query</li>
        </ul>

        <h3>Response Fields</h3>
        <h4>Event Details</h4>
        <ul>
          <li><code>id</code>: Unique identifier for the event</li>
          <li><code>block_number</code>: Block number where the event occurred</li>
          <li><code>block_timestamp</code>: Timestamp of the block</li>
          <li><code>type</code>: Type of event</li>
          <li><code>transaction_hash</code>: Hash of the transaction</li>
          <li><code>atom_id</code>: Associated atom ID</li>
          <li><code>triple_id</code>: Associated triple ID</li>
          <li><code>deposit_id</code>: Associated deposit ID</li>
          <li><code>redemption_id</code>: Associated redemption ID</li>
        </ul>

        <h4>Associated Data</h4>
        <ul>
          <li><code>atom</code>: Associated atom with full metadata and vault information</li>
          <li><code>triple</code>: Associated triple with subject, predicate, object details</li>
          <li><code>deposit</code>: Deposit transaction details if applicable</li>
          <li><code>redemption</code>: Redemption transaction details if applicable</li>
        </ul>

        <h3>Query</h3>
        <CodeBlock code={`query GetEvents($where: events_bool_exp, $addresses: [String!]) {
  total: events_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  events(where: $where) {
    id
    block_number
    block_timestamp
    type
    transaction_hash
    atom_id
    triple_id
    deposit_id
    redemption_id
    atom {
      id
      data
      image
      label
      emoji
      type
      wallet_id
      creator {
        id
        label
        image
      }
      value {
        person {
          name
          image
          description
          url
        }
        thing {
          name
          image
          description
          url
        }
        organization {
          name
          image
          description
          url
        }
      }
      vault {
        total_shares
        position_count
        positions(where: { account: { id: { _in: $addresses } } }) {
          account_id
          shares
          account {
            id
            label
            image
          }
        }
      }
    }
    triple {
      id
      creator {
        label
        image
        id
        atom_id
        type
      }
      subject {
        data
        id
        image
        label
        emoji
        type
        value {
          person {
            name
            image
            description
            url
          }
          thing {
            name
            image
            description
            url
          }
          organization {
            name
            image
            description
            url
          }
        }
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
      predicate {
        data
        id
        image
        label
        emoji
        type
        value {
          person {
            name
            image
            description
            url
          }
          thing {
            name
            image
            description
            url
          }
          organization {
            name
            image
            description
            url
          }
        }
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
      object {
        data
        id
        image
        label
        emoji
        type
        value {
          person {
            name
            image
            description
            url
          }
          thing {
            name
            image
            description
            url
          }
          organization {
            name
            image
            description
            url
          }
        }
        creator {
          label
          image
          id
          atom_id
          type
        }
      }
      vault {
        total_shares
        position_count
        positions(where: { account: { id: { _in: $addresses } } }) {
          account_id
          shares
          account {
            id
            label
            image
          }
        }
      }
      counter_vault {
        total_shares
        position_count
        positions(where: { account: { id: { _in: $addresses } } }) {
          account_id
          shares
          account {
            id
            label
            image
          }
        }
      }
    }
    deposit {
      sender_id
      sender {
        id
      }
      shares_for_receiver
      sender_assets_after_total_fees
      vault {
        total_shares
        position_count
        positions(where: { account: { id: { _in: $addresses } } }) {
          account_id
          shares
          account {
            id
            label
            image
          }
        }
      }
    }
    redemption {
      sender_id
      sender {
        id
      }
    }
  }
}`} />

        <h3>Example Variables</h3>
        <CodeBlock code={`{
  "addresses": ["0x88d0af73508452c1a453356b3fac26525aec23a2"]
}`} />

        <p className="mt-4"><em>Note: The addresses parameter can accept an array of multiple addresses.</em></p>
      </>
    )
  },
  'atoms': {
    title: 'Atoms',
    content: () => (
      <>
        <p>Atoms are the fundamental building blocks of our data model. They represent entities, concepts, or relationships in the system.</p>
        
        <h3>Available Queries</h3>
        <ul>
          <li><a href="#list-atoms">List Atoms</a> - Retrieve a collection of atoms based on specified filters and parameters</li>
          <li><a href="#get-single-atom">Get Single Atom</a> - Fetch a single atom by its unique identifier</li>
        </ul>

        <h3>Common Fields</h3>
        <ul>
          <li><code>id</code>: Unique identifier</li>
          <li><code>data</code>: Raw atom data</li>
          <li><code>image</code>: Associated image URL</li>
          <li><code>label</code>: Display label</li>
          <li><code>emoji</code>: Associated emoji</li>
          <li><code>type</code>: Atom type</li>
          <li><code>creator</code>: Information about the atom's creator</li>
          <li><code>value</code>: Structured data for specific entity types</li>
        </ul>
      </>
    )
  },
  'accounts': {
    title: 'Accounts',
    content: () => (
      <>
        <p>Accounts represent users or entities that can interact with the system. They can hold positions, make claims, and participate in various operations.</p>
        
        <h3>Available Queries</h3>
        <ul>
          <li><a href="#list-accounts">List Accounts</a> - Retrieve a collection of accounts</li>
          <li><a href="#get-single-account">Get Single Account</a> - Fetch a single account by its address</li>
        </ul>

        <h3>Common Fields</h3>
        <ul>
          <li><code>id</code>: Account address (unique identifier)</li>
          <li><code>label</code>: Display label</li>
          <li><code>image</code>: Associated image URL</li>
          <li><code>atom_id</code>: Associated atom ID</li>
          <li><code>type</code>: Account type</li>
          <li><code>claims</code>: List of claims made by the account</li>
          <li><code>positions</code>: List of positions held by the account</li>
        </ul>
      </>
    )
  },
  'triples': {
    title: 'Triples',
    content: () => (
      <>
        <p>Triples represent relationships between atoms, following a subject-predicate-object pattern. They are used to model complex relationships and assertions in the system.</p>
        
        <h3>Available Queries</h3>
        <ul>
          <li><a href="#list-triples">List Triples</a> - Retrieve a collection of triples</li>
          <li><a href="#get-single-triple">Get Single Triple</a> - Fetch a single triple by its ID</li>
        </ul>

        <h3>Common Fields</h3>
        <ul>
          <li><code>id</code>: Unique identifier</li>
          <li><code>subject</code>: The subject atom of the relationship</li>
          <li><code>predicate</code>: The predicate atom defining the relationship type</li>
          <li><code>object</code>: The object atom of the relationship</li>
          <li><code>creator</code>: Information about the triple's creator</li>
          <li><code>vault</code>: Associated vault information</li>
          <li><code>counter_vault</code>: Associated counter vault information</li>
        </ul>
      </>
    )
  },
  'positions': {
    title: 'Positions',
    content: () => (
      <>
        <p>Positions represent holdings or stakes in vaults. They track the number of shares an account holds in a particular vault.</p>
        
        <h3>Available Queries</h3>
        <ul>
          <li><a href="#list-positions">List Positions</a> - Retrieve a collection of positions</li>
          <li><a href="#get-single-position">Get Single Position</a> - Fetch a single position by its ID</li>
        </ul>

        <h3>Common Fields</h3>
        <ul>
          <li><code>id</code>: Unique identifier</li>
          <li><code>shares</code>: Number of shares held</li>
          <li><code>account</code>: Associated account information</li>
          <li><code>vault</code>: Associated vault information</li>
          <li><code>vault_id</code>: ID of the associated vault</li>
        </ul>
      </>
    )
  },
  'vaults': {
    title: 'Vaults',
    content: () => (
      <>
        <p>Vaults are containers that hold positions and manage shares. They are associated with atoms or triples and track the total shares and current share price.</p>
        
        <h3>Available Queries</h3>
        <ul>
          <li><a href="#list-vaults">List Vaults</a> - Retrieve a collection of vaults</li>
          <li><a href="#get-single-vault">Get Single Vault</a> - Fetch a single vault by its ID</li>
        </ul>

        <h3>Common Fields</h3>
        <ul>
          <li><code>id</code>: Unique identifier</li>
          <li><code>total_shares</code>: Total number of shares in the vault</li>
          <li><code>current_share_price</code>: Current price per share</li>
          <li><code>position_count</code>: Number of positions in the vault</li>
          <li><code>atom</code>: Associated atom information</li>
          <li><code>triple</code>: Associated triple information</li>
          <li><code>positions</code>: List of positions in the vault</li>
        </ul>
      </>
    )
  },
  'utilities': {
    title: 'Utilities',
    content: () => (
      <>
        <p>Our "utility" queries don't necessarily fall into the other categories but are examples of how you can query for specific purpose data.</p>
        
        <h3>Available Queries</h3>
        <ul>
          <li><a href="#get-events">Get Events</a> - Retrieve system events with associated data</li>
        </ul>

        <h3>Common Fields</h3>
        <ul>
          <li><code>id</code>: Event identifier</li>
          <li><code>type</code>: Type of event</li>
          <li><code>block_number</code>: Block number where the event occurred</li>
          <li><code>block_timestamp</code>: Timestamp of the event</li>
          <li><code>transaction_hash</code>: Hash of the associated transaction</li>
          <li><code>atom</code>: Associated atom information</li>
          <li><code>triple</code>: Associated triple information</li>
          <li><code>deposit</code>: Deposit information if applicable</li>
          <li><code>redemption</code>: Redemption information if applicable</li>
        </ul>
      </>
    )
  },
  'create-atom': {
    title: 'Create Atom',
    content: () => (
      <>
        <p>Our GraphQL API provides convenient mutations to help structure and publish Atom metadata following common schemas and best practices. While the protocol supports any URI scheme, these mutations offer an opinionated approach to creating well-structured, interoperable data.</p>

        <h3>Current Schema Support</h3>
        <p>Currently, our default schema is the Thing schema. This provides essential properties for describing any entity:</p>

        <CodeBlock code={`mutation UploadThing(
  $name: String!
  $description: String!
  $image: String!
  $url: String!
) {
  uploadThing(
    arg1: { name: $name, description: $description, image: $image, url: $url }
  ) {
    cid
  }
}`} />

        <h3>Example Usage</h3>
        <CodeBlock code={`{
  "name": "My First Thing",
  "description": "This is an example description",
  "image": "ipfs://Qm...", // IPFS URI for image
  "url": "https://example.com" // Reference URL
}`} />

        <p>The mutation returns an IPFS CID that can be used when creating an Atom:</p>

        <CodeBlock code={`const { cid } = await uploadThing(thingData)
const atomId = await createAtom(cid)`} />

        <h3>Upcoming Schema Support</h3>
        <p>We are actively expanding our mutation support to include schemas from schema.org. Additionally, we'll be adding support for CAIP-10 addresses to enable cross-chain identity resolution.</p>

        <h3>Best Practices</h3>
        <ul>
          <li><strong>Complete Metadata:</strong> Provide as much relevant metadata as possible to improve the Atom's utility across different contexts.</li>
          <li><strong>Persistent Storage:</strong> All metadata is stored on IPFS, ensuring data availability and immutability.</li>
          <li><strong>URI Standards:</strong> Use standard URI formats:
            <ul>
              <li>IPFS: <code>ipfs://Qm...</code></li>
              <li>HTTP(S): <code>https://...</code></li>
              <li>CAIP-10 (coming soon): <code>eip155:1:0x...</code></li>
            </ul>
          </li>
        </ul>

        <h3>Example Workflows</h3>
        <h4>Basic Thing Creation</h4>
        <CodeBlock code={`// 1. Upload metadata
const thingData = {
  name: 'Example Thing',
  description: 'Description...',
  image: 'ipfs://Qm...',
  url: 'https://...',
}

const { cid } = await uploadThing(thingData)

// 2. Create Atom with returned CID
const atomId = await createAtom(cid)`} />

        <h3>TypeScript Integration</h3>
        <p>We maintain a package, <code>graphql</code> within our intuition-ts monorepo that auto-generates TypeScript types and React hooks to make integrations easier. This includes type-safe mutations, queries, and React hooks for all supported schemas. We are actively finalizing patterns to properly externalize this package, which will be released shortly. This guide will be updated to provide example implementations once the package is released.</p>

        <h3>Future Schema Support</h3>
        <p>We are also actively expanding our mutation support to include schemas from schema.org as well as CAIP-10 addresses to enable cross-chain identity resolution.</p>
      </>
    )
  },
  // Add other sections here...
};

const CollapsibleResource = ({ title, href, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <li>
      <div className="resource-header" onClick={() => setIsOpen(!isOpen)}>
        <a href={href}>{title}</a>
        <span className="collapse-icon">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && children}
    </li>
  );
};

function GraphQLDocs() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    // Get the section from the URL hash
    const section = location.hash.replace('#', '') || 'overview';
    setActiveSection(section);
  }, [location]);

  const currentSection = ContentSections[activeSection] || ContentSections.overview;

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
        
        <div className="docs-section">
          <div className="sidebar">
            <h3>Overview</h3>
            <ul>
              <li><a href="#overview">Introduction</a></li>
            </ul>

            <h3>Read</h3>
            <ul>
              <CollapsibleResource title="Atoms" href="#atoms">
                <ul>
                  <li><a href="#list-atoms">List Atoms</a></li>
                  <li><a href="#get-single-atom">Get Single Atom</a></li>
                </ul>
              </CollapsibleResource>
              
              <CollapsibleResource title="Accounts" href="#accounts">
                <ul>
                  <li><a href="#list-accounts">List Accounts</a></li>
                  <li><a href="#get-single-account">Get Single Account</a></li>
                </ul>
              </CollapsibleResource>
              
              <CollapsibleResource title="Triples" href="#triples">
                <ul>
                  <li><a href="#list-triples">List Triples</a></li>
                  <li><a href="#get-single-triple">Get Single Triple</a></li>
                </ul>
              </CollapsibleResource>
              
              <CollapsibleResource title="Positions" href="#positions">
                <ul>
                  <li><a href="#list-positions">List Positions</a></li>
                  <li><a href="#get-single-position">Get Single Position</a></li>
                </ul>
              </CollapsibleResource>
              
              <CollapsibleResource title="Vaults" href="#vaults">
                <ul>
                  <li><a href="#list-vaults">List Vaults</a></li>
                  <li><a href="#get-single-vault">Get Single Vault</a></li>
                </ul>
              </CollapsibleResource>
              
              <CollapsibleResource title="Utilities" href="#utilities">
                <ul>
                  <li><a href="#get-events">Get Events</a></li>
                </ul>
              </CollapsibleResource>
            </ul>

            <h3>Write</h3>
            <ul>
              <CollapsibleResource title="GraphQL Mutations" href="#mutations">
                <ul>
                  <li><a href="#create-atom">Create Atom</a></li>
                </ul>
              </CollapsibleResource>
            </ul>
          </div>
          
          <div className="content">
            <h2>{currentSection.title}</h2>
            {currentSection.content()}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default GraphQLDocs; 