---
title: Multi-Language Examples
sidebar_label: Multi-Language
sidebar_position: 8
description: GraphQL API usage in Python, Go, and Rust
keywords: [graphql, example, python, go, rust, multi-language]
---

# Multi-Language Examples

Use the Intuition GraphQL API across different programming languages.

## Python

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

## Go

```go
package main

import (
    "context"
    "fmt"
    "github.com/machinebox/graphql"
)

func main() {
    client := graphql.NewClient("https://mainnet.intuition.sh/v1/graphql")

    req := graphql.NewRequest(`
        query GetAtom($id: String!) {
            atom(term_id: $id) {
                term_id
                label
            }
        }
    `)
    req.Var("id", "0x...")

    var response struct {
        Atom struct {
            TermID string `json:"term_id"`
            Label  string `json:"label"`
        } `json:"atom"`
    }

    client.Run(context.Background(), req, &response)
    fmt.Printf("Atom: %+v\n", response.Atom)
}
```

## Rust

```rust
use graphql_client::{GraphQLQuery, Response};

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

    Ok(())
}
```
