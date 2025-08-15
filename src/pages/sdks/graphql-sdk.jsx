import React from 'react';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export default function GraphQLSDK() {
  return (
    <Layout
      title="GraphQL SDK"
      description="Documentation for the Intuition GraphQL SDK - A collection of pre-built queries for Intuition applications"
    >
      <div className="mx-auto max-w-6xl p-4">
        <h1 className="mb-8 text-4xl font-bold">GraphQL SDK</h1>
        
        <p className="mb-6 text-lg text-text-400">
          The Intuition GraphQL SDK provides a comprehensive collection of pre-built queries
          that you can use out of the box in your applications. This package simplifies
          data fetching and manipulation by offering optimized, production-ready GraphQL
          queries for common Intuition operations.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Installation</h2>
        <Tabs>
          <TabItem value="npm" label="npm">
            <CodeBlock language="bash">
              npm install @intuition/graphql-sdk
            </CodeBlock>
          </TabItem>
          <TabItem value="yarn" label="yarn">
            <CodeBlock language="bash">
              yarn add @intuition/graphql-sdk
            </CodeBlock>
          </TabItem>
        </Tabs>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Getting Started</h2>
        <p className="mb-4">
          Import and initialize the GraphQL client with your API credentials:
        </p>
        <CodeBlock language="javascript">
          {`import { IntuitionGraphQLClient } from '@intuition/graphql-sdk';

const client = new IntuitionGraphQLClient({
  apiKey: 'your-api-key',
  endpoint: 'https://api.intuition.com/graphql'
});`}
        </CodeBlock>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Available Queries</h2>
        
        <h3 className="mt-6 mb-3 text-xl font-semibold">User Operations</h3>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <code>getUserProfile</code> - Fetch user profile information
          </li>
          <li className="mb-2">
            <code>updateUserPreferences</code> - Update user preferences and settings
          </li>
          <li className="mb-2">
            <code>getUserActivity</code> - Retrieve user activity history
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-xl font-semibold">Data Operations</h3>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <code>fetchDataPoints</code> - Retrieve data points with filtering and pagination
          </li>
          <li className="mb-2">
            <code>createDataPoint</code> - Create new data points
          </li>
          <li className="mb-2">
            <code>updateDataPoint</code> - Update existing data points
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-xl font-semibold">Analytics Operations</h3>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <code>getAnalyticsSummary</code> - Get analytics summary and metrics
          </li>
          <li className="mb-2">
            <code>getTrendAnalysis</code> - Retrieve trend analysis data
          </li>
          <li className="mb-2">
            <code>getPerformanceMetrics</code> - Get detailed performance metrics
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Example Usage</h2>
        <p className="mb-4">
          Here's an example of how to use the pre-built queries:
        </p>
        <CodeBlock language="javascript">
          {`// Fetch user profile
const userProfile = await client.getUserProfile({
  userId: 'user123'
});

// Get analytics summary
const analytics = await client.getAnalyticsSummary({
  timeRange: 'last30days',
  metrics: ['revenue', 'users', 'engagement']
});

// Create a new data point
const newDataPoint = await client.createDataPoint({
  type: 'transaction',
  value: 150.00,
  metadata: {
    category: 'sales',
    product: 'premium'
  }
});`}
        </CodeBlock>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Error Handling</h2>
        <p className="mb-4">
          The SDK includes built-in error handling and retry mechanisms:
        </p>
        <CodeBlock language="javascript">
          {`try {
  const result = await client.getUserProfile({ userId: 'user123' });
} catch (error) {
  if (error.isRetryable) {
    // Handle retryable errors
    console.log('Operation can be retried');
  } else {
    // Handle non-retryable errors
    console.error('Operation failed:', error.message);
  }
}`}
        </CodeBlock>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Best Practices</h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Always use the pre-built queries instead of writing custom ones when possible</li>
          <li className="mb-2">Implement proper error handling for all GraphQL operations</li>
          <li className="mb-2">Use the built-in caching mechanisms for frequently accessed data</li>
          <li className="mb-2">Follow the rate limiting guidelines to ensure optimal performance</li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Need Help?</h2>
        <p className="mb-4">
          If you need assistance with the GraphQL SDK, you can:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Check our <a href="/docs/api-reference" className="text-primary-500 hover:underline">API Reference</a></li>
          <li className="mb-2">Visit our <a href="https://github.com/0xIntuition/intuition-ts/tree/main/packages/graphql" className="text-primary-500 hover:underline">GitHub repository</a></li>
          <li className="mb-2">Join our <a href="/community" className="text-primary-500 hover:underline">Discord community</a></li>
        </ul>
      </div>
    </Layout>
  );
}
