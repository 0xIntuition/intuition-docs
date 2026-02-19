---
title: Chart Operations
sidebar_label: Overview
sidebar_position: 1
description: Generate charts as JSON or SVG format
keywords: [graphql, chart, svg, json, visualization]
---

# Chart Operations

The Intuition GraphQL API provides chart generation operations to create visualizations of protocol data. These operations return chart data in either JSON or SVG format for flexible integration.

## Available Operations

| Operation | Description |
|-----------|-------------|
| [`getChartJson`](./chart-json) | Get chart data as structured JSON |
| [`getChartRawJson`](./chart-raw-json) | Get raw chart JSON data |
| [`getChartSvg`](./chart-svg) | Get chart rendered as SVG |
| [`getChartRawSvg`](./chart-raw-svg) | Get raw SVG chart data |

## Use Cases

### Dashboard Integration

Embed generated charts directly in dashboards:
- SVG format for direct rendering
- JSON format for custom chart libraries

### Data Export

Export chart data for external tools:
- JSON for data processing
- SVG for reports and documents

### Performance Analytics

Generate performance visualizations:
- Price history charts
- Volume trends
- Position performance

## Quick Start

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

// Get chart as SVG
const query = `
  query GetChartSvg($input: ChartInput!) {
    getChartSvg(input: $input)
  }
`

const svg = await client.request(query, {
  input: {
    type: 'PRICE_HISTORY',
    term_id: '0x...',
    interval: 'DAY',
    width: 800,
    height: 400
  }
})

// Render SVG directly
document.getElementById('chart').innerHTML = svg.getChartSvg
```

## Chart Types

| Type | Description |
|------|-------------|
| `PRICE_HISTORY` | Historical price chart for a term |
| `VOLUME` | Trading volume over time |
| `TVL` | Total Value Locked history |
| `POSITIONS` | Position distribution chart |

## Related Documentation

- [Chart JSON](./chart-json) - JSON chart data
- [Chart SVG](./chart-svg) - SVG chart rendering
- [Time Series Queries](/docs/graphql-api/queries/advanced/time-series) - Raw time-series data
