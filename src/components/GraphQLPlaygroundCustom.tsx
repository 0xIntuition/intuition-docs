import React, { useState } from 'react';
import './GraphQLPlayground.css';

const GRAPHQL_ENDPOINT = 'https://testnet.intuition.sh/v1/graphql';

export interface QueryExample {
  id: string;
  title: string;
  query: string;
  variables?: Record<string, any>;
}

interface GraphQLPlaygroundCustomProps {
  queries: QueryExample[];
  defaultQuery?: number;
}

export default function GraphQLPlaygroundCustom({
  queries,
  defaultQuery = 0
}: GraphQLPlaygroundCustomProps) {
  const [activeTab, setActiveTab] = useState(defaultQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [variables, setVariables] = useState<string>('');

  const currentExample = queries[activeTab];

  // Update variables when tab changes
  React.useEffect(() => {
    if (currentExample?.variables) {
      setVariables(JSON.stringify(currentExample.variables, null, 2));
    } else {
      setVariables('');
    }
  }, [activeTab, currentExample]);

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

  if (!queries || queries.length === 0) {
    return <div>No queries provided</div>;
  }

  return (
    <div className="graphql-playground-wrapper">
      {queries.length > 1 && (
        <div className="playground-tabs">
          {queries.map((example, index) => (
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
      )}

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

          {(currentExample.variables || variables) && (
            <>
              <div className="section-header">
                <h4>Variables</h4>
              </div>
              <textarea
                className="variables-input"
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
                placeholder="Edit variables as JSON..."
                rows={5}
              />
            </>
          )}
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
