---
title: Get Chart SVG
sidebar_label: Chart SVG
sidebar_position: 4
description: Get chart rendered as SVG
keywords: [graphql, chart, svg, visualization, render]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Get Chart SVG

Retrieve a pre-rendered chart as an SVG image, ready for embedding in HTML or documents.

## Query Structure

```graphql
query GetChartSvg($input: GetChartSvgInput!) {
  getChartSvg(input: $input) {
    svg
  }
}
```

## Variables

The query takes a single `input` object of type `GetChartSvgInput`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `term_id` | `String` | Yes | Term ID to generate chart for |
| `curve_id` | `String` | Yes | Curve ID (bonding curve) |
| `interval` | `String` | Yes | Time interval (e.g. `"1h"`, `"1d"`) |
| `start_time` | `String` | Yes | Start of time range (ISO 8601) |
| `end_time` | `String` | Yes | End of time range (ISO 8601) |
| `graph_type` | `String` | No | Type of graph data |
| `width` | `Int` | No | Chart width in pixels |
| `height` | `Int` | No | Chart height in pixels |
| `background_color` | `String` | No | Background color (e.g. `"#1a1a2e"`) |
| `line_color` | `String` | No | Line color (e.g. `"#00ff00"`) |

```json
{
  "input": {
    "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
    "curve_id": "1",
    "interval": "1d",
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-31T23:59:59Z",
    "width": 800,
    "height": 400
  }
}
```

## Response Fields (`ChartSvgOutput`)

| Field | Type | Description |
|-------|------|-------------|
| `svg` | `String!` | SVG markup string |

## Expected Response

```json
{
  "data": {
    "getChartSvg": {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"400\">...</svg>"
    }
  }
}
```

## Interactive Example

export const chartSvgQueries = [
  {
    id: 'chart-svg',
    title: 'Chart SVG',
    query: `query GetChartSvg($input: GetChartSvgInput!) {
  getChartSvg(input: $input) {
    svg
  }
}`,
    variables: {
      input: {
        term_id: '0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21',
        curve_id: '1',
        interval: '1d',
        start_time: '2024-01-01T00:00:00Z',
        end_time: '2024-01-31T23:59:59Z',
        width: 800,
        height: 400
      }
    }
  }
];

<GraphQLPlaygroundCustom queries={chartSvgQueries} />

## Use Cases

### Direct HTML Embedding

```typescript
async function displayChart(termId: string, curveId: string, containerId: string) {
  const query = `
    query GetChartSvg($input: GetChartSvgInput!) {
      getChartSvg(input: $input) {
        svg
      }
    }
  `

  const endTime = new Date()
  const startTime = new Date()
  startTime.setDate(startTime.getDate() - 30)

  const response = await client.request(query, {
    input: {
      term_id: termId,
      curve_id: curveId,
      interval: '1d',
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      width: 600,
      height: 300
    }
  })

  document.getElementById(containerId).innerHTML = response.getChartSvg.svg
}
```

## Related

- [Chart Raw SVG](./chart-raw-svg) - Minimal SVG output
- [Chart JSON](./chart-json) - JSON data for custom rendering
