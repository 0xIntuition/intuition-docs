---
title: Client Setup
sidebar_label: Client Setup
sidebar_position: 2
description: Set up GraphQL clients in JavaScript, Python, Go, and Rust
keywords: [graphql, client, setup, javascript, python, go, rust, apollo, urql]
---

# Client Setup

The Intuition GraphQL API works with any GraphQL client in any language. This guide provides setup examples for popular clients across different languages.

## JavaScript / TypeScript

For JavaScript/TypeScript projects, import endpoints from the package instead of hardcoding them:

```typescript
import { API_URL_PROD, API_URL_DEV } from '@0xintuition/graphql'

// API_URL_PROD = 'https://mainnet.intuition.sh/v1/graphql'
// API_URL_DEV = 'https://testnet.intuition.sh/v1/graphql'
```

### graphql-request

Lightweight and simple GraphQL client:

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

const query = `
  query GetAtom($id: String!) {
    atom(term_id: $id) {
      term_id
      label
      image
    }
  }
`

const data = await client.request(query, { id: '0x...' })
console.log(data.atom)
```

**Installation**:
```bash
npm install graphql-request graphql
```

[graphql-request documentation](https://github.com/jasonkuhrt/graphql-request)

### Apollo Client

Full-featured GraphQL client with caching and React integration:

```typescript
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new ApolloClient({
  uri: API_URL_PROD,
  cache: new InMemoryCache()
})

const { data } = await client.query({
  query: gql`
    query GetAtom($id: String!) {
      atom(term_id: $id) {
        term_id
        label
        image
      }
    }
  `,
  variables: { id: '0x...' }
})

console.log(data.atom)
```

**Installation**:
```bash
npm install @apollo/client graphql
```

[@apollo/client documentation](https://www.apollographql.com/docs/react/)

### urql

Highly customizable and lightweight GraphQL client:

```typescript
import { createClient } from 'urql'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = createClient({
  url: API_URL_PROD
})

const query = `
  query GetAtom($id: String!) {
    atom(term_id: $id) {
      term_id
      label
    }
  }
`

const result = await client.query(query, { id: '0x...' }).toPromise()
console.log(result.data.atom)
```

**Installation**:
```bash
npm install urql graphql
```

[urql documentation](https://formidable.com/open-source/urql/docs/)

### Plain fetch

No dependencies required:

```typescript
import { API_URL_PROD } from '@0xintuition/graphql'

const response = await fetch(API_URL_PROD, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `
      query GetAtom($id: String!) {
        atom(term_id: $id) {
          term_id
          label
        }
      }
    `,
    variables: { id: '0x...' }
  })
})

const { data } = await response.json()
console.log(data.atom)
```

## Python

### gql

Type-safe Python GraphQL client:

```python
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

transport = RequestsHTTPTransport(url='https://mainnet.intuition.sh/v1/graphql')
client = Client(transport=transport)

query = gql('''
  query GetAtom($id: String!) {
    atom(term_id: $id) {
      term_id
      label
      image
    }
  }
''')

result = client.execute(query, variable_values={'id': '0x...'})
print(result['atom'])
```

**Installation**:
```bash
pip install gql[requests]
```

[gql documentation](https://gql.readthedocs.io/)

### python-graphql-client

Simple and lightweight GraphQL client:

```python
from python_graphql_client import GraphqlClient

client = GraphqlClient(endpoint='https://mainnet.intuition.sh/v1/graphql')

query = '''
  query GetAtom($id: String!) {
    atom(term_id: $id) {
      term_id
      label
      image
    }
  }
'''

data = client.execute(query=query, variables={'id': '0x...'})
print(data['data']['atom'])
```

**Installation**:
```bash
pip install python-graphql-client
```

[python-graphql-client documentation](https://github.com/prisma-labs/python-graphql-client)

## Go

### machinebox/graphql

Simple Go GraphQL client:

```go
package main

import (
    "context"
    "fmt"
    "log"
    "github.com/machinebox/graphql"
)

func main() {
    client := graphql.NewClient("https://mainnet.intuition.sh/v1/graphql")

    req := graphql.NewRequest(`
        query GetAtom($id: String!) {
            atom(term_id: $id) {
                term_id
                label
                image
            }
        }
    `)
    req.Var("id", "0x...")

    var response struct {
        Atom struct {
            TermID string `json:"term_id"`
            Label  string `json:"label"`
            Image  string `json:"image"`
        } `json:"atom"`
    }

    if err := client.Run(context.Background(), req, &response); err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Atom: %+v\n", response.Atom)
}
```

**Installation**:
```bash
go get github.com/machinebox/graphql
```

[machinebox/graphql documentation](https://github.com/machinebox/graphql)

## Rust

### graphql-client

Type-safe GraphQL client for Rust:

```rust
use graphql_client::{GraphQLQuery, Response};
use reqwest;

#[derive(GraphQLQuery)]
#[graphql(
    schema_path = "schema.graphql",
    query_path = "get_atom.graphql",
)]
struct GetAtom;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();

    let variables = get_atom::Variables {
        id: "0x...".to_string(),
    };

    let response = client
        .post("https://mainnet.intuition.sh/v1/graphql")
        .json(&GetAtom::build_query(variables))
        .send()
        .await?
        .json::<Response<get_atom::ResponseData>>()
        .await?;

    if let Some(data) = response.data {
        println!("Atom: {:?}", data.atom);
    }

    Ok(())
}
```

**Installation**:
```toml
[dependencies]
graphql_client = "0.13"
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1", features = ["full"] }
```

[graphql-client documentation](https://github.com/graphql-rust/graphql-client)

## Error Handling

All GraphQL responses follow the standard error format:

```json
{
  "data": null,
  "errors": [
    {
      "message": "Field 'nonexistent_field' not found in type 'atoms'",
      "extensions": {
        "path": "$.selectionSet.atoms.selectionSet.nonexistent_field",
        "code": "validation-failed"
      }
    }
  ]
}
```

**Common error types**:

- **validation-failed**: Query syntax or schema validation error
- **constraint-violation**: Database constraint violated
- **permission-denied**: Access to restricted field (not applicable for public API)
- **unexpected**: Internal server error

**Best practices for error handling**:

```typescript
// Example with graphql-request
import { GraphQLClient, ClientError } from 'graphql-request'

try {
  const data = await client.request(query, variables)
  console.log('Success:', data)
} catch (error) {
  if (error instanceof ClientError) {
    console.error('GraphQL errors:', error.response.errors)
    console.error('Status:', error.response.status)
  } else {
    console.error('Network error:', error)
  }
}
```

## Next Steps

- [Schema Reference](/docs/graphql-api/getting-started/schema-reference) - Learn about schema features
- [Query Patterns](/docs/graphql-api/queries/atoms/single-atom) - Explore common queries
- [Best Practices](/docs/graphql-api/best-practices/request-only-needed) - Optimize your queries
