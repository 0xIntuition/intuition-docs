---
title: Chart SVG
sidebar_label: Chart SVG
sidebar_position: 3
description: Get a pre-rendered chart as SVG
keywords: [graphql, chart, svg, visualization, image]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Chart SVG Query

Get a pre-rendered chart as an SVG image. Ideal for embedding in pages without client-side chart rendering.

## Query Structure

```graphql
query GetChartSvg(
  $termId: String!
  $chartType: String!
  $width: Int
  $height: Int
  $startDate: String
  $endDate: String
  $interval: String
  $theme: String
) {
  getChartSvg(
    term_id: $termId
    chart_type: $chartType
    width: $width
    height: $height
    start_date: $startDate
    end_date: $endDate
    interval: $interval
    theme: $theme
  ) {
    svg
    contentType
  }
}
```

## Variables

```json
{
  "termId": "0x1234567890abcdef1234567890abcdef12345678",
  "chartType": "price",
  "width": 800,
  "height": 400,
  "interval": "day",
  "theme": "dark"
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `term_id` | String | Yes | The term (atom/triple) identifier |
| `chart_type` | String | Yes | Type of chart: `price`, `volume`, `positions`, `signals` |
| `width` | Int | No | Chart width in pixels (default: 600) |
| `height` | Int | No | Chart height in pixels (default: 400) |
| `start_date` | String | No | Start of date range (ISO 8601) |
| `end_date` | String | No | End of date range (ISO 8601) |
| `interval` | String | No | Data interval: `hour`, `day`, `week`, `month` |
| `theme` | String | No | Color theme: `light`, `dark` |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `svg` | String | SVG markup string |
| `contentType` | String | MIME type (`image/svg+xml`) |

## Interactive Example

export const chartSvgQueries = [
  {
    id: 'chart-svg',
    title: 'Get Chart SVG',
    query: `query GetChartSvg(
  $termId: String!
  $chartType: String!
  $width: Int
  $height: Int
  $theme: String
) {
  getChartSvg(
    term_id: $termId
    chart_type: $chartType
    width: $width
    height: $height
    theme: $theme
  ) {
    svg
    contentType
  }
}`,
    variables: {
      termId: '0x1234567890abcdef1234567890abcdef12345678',
      chartType: 'price',
      width: 600,
      height: 300,
      theme: 'dark'
    }
  }
];

<GraphQLPlaygroundCustom queries={chartSvgQueries} />

## Use Cases

### Embed Chart in React

```typescript
import { useQuery, gql } from '@apollo/client';

const GET_CHART_SVG = gql`
  query GetChartSvg(
    $termId: String!
    $chartType: String!
    $width: Int
    $height: Int
    $theme: String
  ) {
    getChartSvg(
      term_id: $termId
      chart_type: $chartType
      width: $width
      height: $height
      theme: $theme
    ) {
      svg
    }
  }
`;

function ChartEmbed({ termId, theme = 'dark' }) {
  const { data, loading } = useQuery(GET_CHART_SVG, {
    variables: {
      termId,
      chartType: 'price',
      width: 800,
      height: 400,
      theme
    }
  });

  if (loading) return <div>Loading chart...</div>;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: data?.getChartSvg?.svg }}
    />
  );
}
```

### Download as Image

```typescript
function downloadChart(svgString: string, filename: string) {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.svg`;
  a.click();

  URL.revokeObjectURL(url);
}
```

### Server-Side Rendering

```typescript
// Next.js API route
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('https://mainnet.intuition.sh/v1/graphql');

export default async function handler(req, res) {
  const { termId, chartType } = req.query;

  const data = await client.request(GET_CHART_SVG, {
    termId,
    chartType,
    width: 800,
    height: 400,
    theme: 'dark'
  });

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(data.getChartSvg.svg);
}
```

## Best Practices

1. **Cache SVG responses** - Charts don't change frequently
2. **Match theme to UI** - Use `dark` or `light` theme based on your app
3. **Optimize dimensions** - Request appropriate sizes for your layout
4. **Consider accessibility** - SVGs can include ARIA labels

## Related

- [Chart Raw SVG](./chart-raw-svg) - Raw SVG without styling
- [Chart JSON](./chart-json) - JSON data for custom rendering
- [Chart Raw JSON](./chart-raw-json) - Raw data points
