import React, { useState } from 'react';
import './GraphQLPlayground.css';

const GRAPHQL_ENDPOINT = 'https://testnet.intuition.sh/v1/graphql';

interface QueryExample {
  id: string;
  title: string;
  query: string;
  variables?: Record<string, any>;
}

const QUERY_EXAMPLES: QueryExample[] = [
  {
    id: 'atoms',
    title: 'Query Atoms',
    query: `query GetAtoms {
  atoms(limit: 10, order_by: { created_at: desc }) {
    term_id
    label
    emoji
    type
    image
    created_at
    block_number
    creator {
      id
      label
    }
  }
}`,
  },
  {
    id: 'triples',
    title: 'Query Triples',
    query: `query GetTriples {
  triples(limit: 10, order_by: { created_at: desc }) {
    term_id
    created_at
    subject {
      term_id
      label
      image
    }
    predicate {
      term_id
      label
    }
    object {
      term_id
      label
      image
    }
    term {
      vaults(where: { curve_id: { _eq: "2" } }) {
        total_shares
        current_share_price
        market_cap
      }
    }
    counter_term {
      vaults(where: { curve_id: { _eq: "2" } }) {
        total_shares
        current_share_price
        market_cap
      }
    }
  }
}`,
  },
  {
    id: 'user-positions',
    title: 'Query User Positions',
    query: `query GetUserPositions($accountId: String!) {
  positions(
    limit: 20
    where: { account_id: { _eq: $accountId } }
    order_by: { shares: desc }
  ) {
    id
    shares
    created_at
    account {
      id
      label
      image
    }
    vault {
      term {
        atom {
          term_id
          label
          emoji
          image
        }
        triple {
          term_id
          subject {
            label
          }
          predicate {
            label
          }
          object {
            label
          }
        }
      }
    }
  }
}`,
    variables: {
      accountId: '0xbd2DE08aF9470c87C4475117Fb912B8f1d588D9c',
    },
  },
  {
    id: 'search-atoms',
    title: 'Search Atoms by Label',
    query: `query SearchAtoms($searchTerm: String!) {
  atoms(
    limit: 20
    where: { label: { _ilike: $searchTerm } }
    order_by: { created_at: desc }
  ) {
    term_id
    label
    emoji
    type
    image
    created_at
    creator {
      label
    }
  }
}`,
    variables: {
      searchTerm: '%ethereum%',
    },
  },
  {
    id: 'vault-stats',
    title: 'Get Vault Statistics',
    query: `query GetVaultStats {
  vaults(
    limit: 10
    order_by: { total_shares: desc }
  ) {
    term_id
    total_shares
    current_share_price
    market_cap
    position_count
    term {
      atom {
        term_id
        label
        emoji
        image
      }
      triple {
        term_id
        subject {
          label
        }
        predicate {
          label
        }
        object {
          label
        }
      }
    }
  }
}`,
  },
  {
    id: 'accounts',
    title: 'Query Accounts',
    query: `query GetAccounts {
  accounts(limit: 10) {
    id
    label
    image
    positions(limit: 5, order_by: { shares: desc }) {
      id
      shares
      vault {
        term {
          atom {
            term_id
            label
            image
          }
        }
      }
    }
  }
}`,
  },
  {
    id: 'atom-by-id',
    title: 'Query Atom by ID',
    query: `query GetAtomById($termId: String!) {
  atoms(where: { term_id: { _eq: $termId } }) {
    term_id
    label
    emoji
    type
    image
    data
    created_at
    block_number
    creator {
      id
      label
    }
    term {
      vaults(where: { curve_id: { _eq: "1" } }) {
        term_id
        total_shares
        current_share_price
        market_cap
        position_count
        positions(limit: 5, order_by: { shares: desc }) {
          id
          account {
            label
          }
          shares
        }
      }
    }
  }
}`,
    variables: {
      termId: '0xf12dba36ffebb8e05ae49d3f9220b1994295662ccdc573f44aff7b51f8ad8fd6',
    },
  },
  {
    id: 'triple-by-id',
    title: 'Query Triple by ID',
    query: `query GetTripleById($termId: String!) {
  triples(where: { term_id: { _eq: $termId } }) {
    term_id
    counter_term_id
    created_at
    subject {
      term_id
      label
      image
    }
    predicate {
      term_id
      label
    }
    object {
      term_id
      label
      image
    }
    term {
      vaults(where: { curve_id: { _eq: "2" } }) {
        term_id
        total_shares
        current_share_price
        market_cap
        position_count
      }
    }
    counter_term {
      vaults(where: { curve_id: { _eq: "2" } }) {
        term_id
        total_shares
        current_share_price
        market_cap
        position_count
      }
    }
  }
}`,
    variables: {
      termId: '0xffb30efde2b49a7deadd920a7df684595ed4a291a582033c16b0795796965600',
    },
  },
 
  {
    id: 'user-activity',
    title: 'Query User Activity',
    query: `query GetUserActivity($accountId: String!) {
  positions(
    where: { account_id: { _eq: $accountId } }
    limit: 20
    order_by: { created_at: desc }
  ) {
    id
    created_at
    shares
    account {
      id
      label
    }
    vault {
      term {
        atom {
          term_id
          label
          image
        }
        triple {
          term_id
          subject {
            label
          }
          predicate {
            label
          }
          object {
            label
          }
        }
      }
    }
  }
}`,
    variables: {
      accountId: '0xbd2DE08aF9470c87C4475117Fb912B8f1d588D9c',
    },
  },
];

export default function GraphQLPlayground() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [variables, setVariables] = useState<string>('');

  const currentExample = QUERY_EXAMPLES[activeTab];

  // Update variables when tab changes
  React.useEffect(() => {
    if (currentExample.variables) {
      setVariables(JSON.stringify(currentExample.variables, null, 2));
    } else {
      setVariables('');
    }
  }, [activeTab, currentExample.variables]);

  const executeQuery = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let parsedVariables = {};
      if (variables.trim()) {
        try {
          parsedVariables = JSON.parse(variables);
        } catch (e) {
          setError('Invalid JSON in variables');
          setLoading(false);
          return;
        }
      }

      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: currentExample.query,
          variables: parsedVariables,
        }),
      });

      const data = await response.json();

      if (data.errors) {
        setError(JSON.stringify(data.errors, null, 2));
      } else {
        setResult(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="graphql-playground-wrapper">
      <div className="playground-tabs">
        {QUERY_EXAMPLES.map((example, index) => (
          <button
            key={example.id}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(index);
              setResult(null);
              setError(null);
            }}
          >
            {example.title}
          </button>
        ))}
      </div>

      <div className="playground-content">
        <div className="query-section">
          <div className="section-header">
            <h4>Query</h4>
            <button
              className="run-button"
              onClick={executeQuery}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Running...
                </>
              ) : (
                <>▶ Run Query</>
              )}
            </button>
          </div>
          <pre className="query-code">{currentExample.query}</pre>
          <div className="section-header">
            <h4>Variables</h4>
          </div>
          <textarea
            className="variables-input"
            value={variables}
            onChange={(e) => setVariables(e.target.value)}
            placeholder={currentExample.variables ? "Edit variables as JSON..." : "No variables needed for this query"}
            rows={5}
            disabled={!currentExample.variables}
          />
        </div>

        {(result || error) && (
          <div className="result-section">
            <div className="section-header">
              <h4>{error ? 'Error' : 'Result'}</h4>
            </div>
            <pre className={`result-code ${error ? 'error' : ''}`}>
              {error || JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {!result && !error && !loading && (
          <div className="empty-state">
            <p>Click "Run Query" to execute the GraphQL query and see results</p>
          </div>
        )}
      </div>
    </div>
  );
}
