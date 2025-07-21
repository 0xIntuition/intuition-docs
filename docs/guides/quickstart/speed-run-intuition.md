---
sidebar_position: 2
---

# Speed Run Intuition

Get up and running with Intuition in under 5 minutes! This guide will walk you through creating your first Intuition application from scratch.

## Prerequisites

- Node.js 18+ installed
- A code editor
- 5 minutes of your time

## Step 1: Create Your Project

```bash
# Create a new directory
mkdir my-intuition-app
cd my-intuition-app

# Initialize a new Node.js project
npm init -y

# Install Intuition dependencies
npm install @intuition/graphql-client @intuition/protocol
```

## Step 2: Set Up Your First Query

Create a file called `index.js`:

```javascript
import { createClient } from '@intuition/graphql-client';

// Initialize the client
const client = createClient({
  endpoint: 'https://api.intuition.dev/graphql'
});

// Your first query
const query = `
  query GetAtoms {
    atoms(first: 10) {
      id
      name
      value
    }
  }
`;

async function main() {
  try {
    const result = await client.query(query);
    console.log('Atoms:', result.data.atoms);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

## Step 3: Run Your Application

```bash
# Add type: module to package.json or use .mjs extension
node index.js
```

## Step 4: Explore the Network

Your application is now connected to the Intuition network! You can:

- Query atoms and triples
- Create new data structures
- Interact with smart contracts
- Build real-time applications

## Next Steps

- Check out the [Official Intuition Kits](/guides/quickstart/official-intuition-kits) for pre-built templates
- Explore the [GraphQL API documentation](/graphql) for more query options
- Learn about [Smart Contracts](/guides/smart-contracts) for advanced features

## Troubleshooting

**Getting connection errors?**
- Make sure you have a stable internet connection
- Check that the API endpoint is correct
- Verify your Node.js version is 18+

**Query not working?**
- Check the GraphQL syntax
- Ensure you're using the correct field names
- Review the API schema for available fields

Congratulations! You've successfully created your first Intuition application. 🎉 