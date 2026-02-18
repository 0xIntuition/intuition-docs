---
title: Chart Raw SVG
sidebar_label: Chart Raw SVG
sidebar_position: 4
description: Get raw chart SVG without styling
keywords: [graphql, chart, svg, raw, visualization]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Chart Raw SVG Query

Get a raw SVG chart without default styling, allowing for custom CSS styling.

## Query Structure

```graphql
query GetChartRawSvg(
  $termId: String!
  $chartType: String!
  $width: Int
  $height: Int
  $startDate: String
  $endDate: String
  $interval: String
) {
  getChartRawSvg(
    term_id: $termId
    chart_type: $chartType
    width: $width
    height: $height
    start_date: $startDate
    end_date: $endDate
    interval: $interval
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
  "interval": "day"
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

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `svg` | String | Raw SVG markup without styling |
| `contentType` | String | MIME type (`image/svg+xml`) |

## Interactive Example

export const chartRawSvgQueries = [
  {
    id: 'chart-raw-svg',
    title: 'Get Chart Raw SVG',
    query: `query GetChartRawSvg(
  $termId: String!
  $chartType: String!
  $width: Int
  $height: Int
) {
  getChartRawSvg(
    term_id: $termId
    chart_type: $chartType
    width: $width
    height: $height
  ) {
    svg
    contentType
  }
}`,
    variables: {
      termId: '0x1234567890abcdef1234567890abcdef12345678',
      chartType: 'price',
      width: 600,
      height: 300
    }
  }
];

<GraphQLPlaygroundCustom queries={chartRawSvgQueries} />

## Use Cases

### Apply Custom Styling

```typescript
import { useQuery, gql } from '@apollo/client';

const GET_CHART_RAW_SVG = gql`
  query GetChartRawSvg($termId: String!, $chartType: String!) {
    getChartRawSvg(term_id: $termId, chart_type: $chartType) {
      svg
    }
  }
`;

function CustomStyledChart({ termId }) {
  const { data } = useQuery(GET_CHART_RAW_SVG, {
    variables: { termId, chartType: 'price' }
  });

  return (
    <>
      <style>{`
        .chart-container svg {
          font-family: 'Inter', sans-serif;
        }
        .chart-container .line {
          stroke: #8b5cf6;
          stroke-width: 2;
        }
        .chart-container .grid {
          stroke: rgba(255, 255, 255, 0.1);
        }
        .chart-container text {
          fill: #a1a1aa;
          font-size: 12px;
        }
      `}</style>
      <div
        className="chart-container"
        dangerouslySetInnerHTML={{ __html: data?.getChartRawSvg?.svg }}
      />
    </>
  );
}
```

### Convert to PNG

```typescript
async function svgToPng(svgString: string, width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  const img = new Image();

  return new Promise((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    img.src = URL.createObjectURL(blob);
  });
}
```

### Animate Chart Elements

```typescript
function AnimatedChart({ termId }) {
  const { data } = useQuery(GET_CHART_RAW_SVG, {
    variables: { termId, chartType: 'price' }
  });

  return (
    <>
      <style>{`
        @keyframes drawLine {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        .animated-chart .line {
          stroke-dasharray: 1000;
          animation: drawLine 2s ease-in-out forwards;
        }
      `}</style>
      <div
        className="animated-chart"
        dangerouslySetInnerHTML={{ __html: data?.getChartRawSvg?.svg }}
      />
    </>
  );
}
```

## Best Practices

1. **Apply consistent styling** - Create reusable CSS for charts
2. **Handle responsive layouts** - SVGs scale well with CSS
3. **Add interactivity** - Raw SVGs can have JavaScript event handlers
4. **Consider print styles** - Raw SVGs are great for print media

## Related

- [Chart SVG](./chart-svg) - Pre-styled SVG charts
- [Chart JSON](./chart-json) - JSON for custom chart rendering
- [Chart Raw JSON](./chart-raw-json) - Raw data points
