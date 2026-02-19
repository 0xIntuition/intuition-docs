---
title: Get Chart Raw SVG
sidebar_label: Chart Raw SVG
sidebar_position: 5
description: Get minimal raw SVG chart output
keywords: [graphql, chart, svg, raw, minimal]
---

# Get Chart Raw SVG

Retrieve a minimal SVG chart, suitable for custom post-processing or styling. Uses the same input type as `getChartSvg`.

## Query Structure

```graphql
query GetChartRawSvg($input: GetChartSvgInput!) {
  getChartRawSvg(input: $input) {
    svg
  }
}
```

## Variables

Same as [`getChartSvg`](./chart-svg) -- takes `GetChartSvgInput`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `term_id` | `String` | Yes | Term ID to query |
| `curve_id` | `String` | Yes | Curve ID (bonding curve) |
| `interval` | `String` | Yes | Time interval |
| `start_time` | `String` | Yes | Start of time range (ISO 8601) |
| `end_time` | `String` | Yes | End of time range (ISO 8601) |
| `graph_type` | `String` | No | Type of graph data |
| `width` | `Int` | No | Chart width in pixels |
| `height` | `Int` | No | Chart height in pixels |
| `background_color` | `String` | No | Background color |
| `line_color` | `String` | No | Line color |

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
| `svg` | `String!` | Minimal SVG markup string |

## Related

- [Chart SVG](./chart-svg) - Fully styled SVG charts
- [Chart JSON](./chart-json) - JSON data for custom rendering
