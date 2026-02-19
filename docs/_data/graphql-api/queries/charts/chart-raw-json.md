---
title: Get Chart Raw JSON
sidebar_label: Chart Raw JSON
sidebar_position: 3
description: Get raw chart data as JSON
keywords: [graphql, chart, json, raw, data]
---

# Get Chart Raw JSON

Retrieve raw chart data in JSON format. Uses the same input and output types as `getChartJson`.

## Query Structure

```graphql
query GetChartRawJson($input: GetChartJsonInput!) {
  getChartRawJson(input: $input) {
    term_id
    curve_id
    graph_type
    interval
    count
    data {
      timestamp
      value
    }
  }
}
```

## Variables

Same as [`getChartJson`](./chart-json) -- takes `GetChartJsonInput`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `term_id` | `String` | Yes | Term ID to query |
| `curve_id` | `String` | Yes | Curve ID (bonding curve) |
| `interval` | `String` | Yes | Time interval (e.g. `"1h"`, `"1d"`) |
| `start_time` | `String` | Yes | Start of time range (ISO 8601) |
| `end_time` | `String` | Yes | End of time range (ISO 8601) |
| `graph_type` | `String` | No | Type of graph data |

```json
{
  "input": {
    "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
    "curve_id": "1",
    "interval": "1d",
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-31T23:59:59Z"
  }
}
```

## Response Fields (`ChartDataOutput`)

| Field | Type | Description |
|-------|------|-------------|
| `term_id` | `String!` | Term ID for this chart |
| `curve_id` | `String` | Curve ID used |
| `graph_type` | `String!` | Type of graph |
| `interval` | `String!` | Interval used |
| `count` | `Int!` | Number of data points |
| `data` | `[ChartDataPoint!]!` | Array of data points (`timestamp: String!`, `value: String!`) |

## Related

- [Chart JSON](./chart-json) - Formatted chart data (same types)
- [Chart SVG](./chart-svg) - Pre-rendered charts
