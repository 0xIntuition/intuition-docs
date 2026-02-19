---
title: Get Chart SVG
sidebar_label: Chart SVG
sidebar_position: 4
description: Get chart rendered as SVG
keywords: [graphql, chart, svg, visualization, render]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Get Chart SVG

Retrieve a pre-rendered chart as an SVG image, ready for direct embedding in HTML or documents.

## Query Structure

```graphql
query GetChartSvg($input: ChartSvgInput!) {
  getChartSvg(input: $input)
}
```

## Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `input.type` | `ChartType` | Yes | Type of chart: `PRICE_HISTORY`, `VOLUME`, `TVL`, `POSITIONS` |
| `input.term_id` | `String` | Yes | Term ID to generate chart for |
| `input.interval` | `ChartInterval` | No | Time interval: `HOUR`, `DAY`, `WEEK`, `MONTH` |
| `input.width` | `Int` | No | Chart width in pixels (default: 800) |
| `input.height` | `Int` | No | Chart height in pixels (default: 400) |
| `input.theme` | `ChartTheme` | No | Color theme: `LIGHT`, `DARK` |
| `input.start_date` | `DateTime` | No | Start of date range |
| `input.end_date` | `DateTime` | No | End of date range |

```json
{
  "input": {
    "type": "PRICE_HISTORY",
    "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
    "interval": "DAY",
    "width": 800,
    "height": 400,
    "theme": "DARK"
  }
}
```

## Expected Response

Returns an SVG string:

```json
{
  "data": {
    "getChartSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"400\">...</svg>"
  }
}
```

## Use Cases

### Direct HTML Embedding

```typescript
async function displayChart(termId: string, containerId: string) {
  const query = `
    query GetChartSvg($input: ChartSvgInput!) {
      getChartSvg(input: $input)
    }
  `

  const response = await client.request(query, {
    input: {
      type: 'PRICE_HISTORY',
      term_id: termId,
      width: 600,
      height: 300,
      theme: 'DARK'
    }
  })

  document.getElementById(containerId).innerHTML = response.getChartSvg
}
```

### React Component

```tsx
function ChartSvg({ termId, type, theme = 'DARK' }: ChartProps) {
  const { data, loading } = useQuery(GET_CHART_SVG, {
    variables: {
      input: {
        type,
        term_id: termId,
        width: 800,
        height: 400,
        theme
      }
    }
  })

  if (loading) return <Spinner />

  return (
    <div
      className="chart-container"
      dangerouslySetInnerHTML={{ __html: data.getChartSvg }}
    />
  )
}
```

### PDF/Report Generation

```typescript
async function generateReportChart(termId: string): Promise<Buffer> {
  const query = `
    query GetChartSvg($input: ChartSvgInput!) {
      getChartSvg(input: $input)
    }
  `

  const response = await client.request(query, {
    input: {
      type: 'PRICE_HISTORY',
      term_id: termId,
      width: 1200,
      height: 600,
      theme: 'LIGHT'
    }
  })

  // Convert SVG to PNG for PDF embedding
  const sharp = require('sharp')
  return sharp(Buffer.from(response.getChartSvg))
    .png()
    .toBuffer()
}
```

### Social Media Cards

```typescript
async function generateOGImage(termId: string) {
  const svg = await client.request(GET_CHART_SVG, {
    input: {
      type: 'PRICE_HISTORY',
      term_id: termId,
      width: 1200,
      height: 630, // OG image dimensions
      theme: 'DARK'
    }
  })

  return svg.getChartSvg
}
```

## Chart Themes

| Theme | Description |
|-------|-------------|
| `LIGHT` | Light background, dark lines |
| `DARK` | Dark background, light lines |

## Chart Dimensions

Recommended dimensions for common use cases:

| Use Case | Width | Height |
|----------|-------|--------|
| Dashboard widget | 400 | 200 |
| Full-width chart | 800 | 400 |
| Report embed | 1200 | 600 |
| Social card (OG) | 1200 | 630 |

## Best Practices

1. **Match theme to UI** - Use `DARK` for dark mode UIs
2. **Responsive sizing** - Use CSS to scale SVGs responsively
3. **Cache rendered SVGs** - SVGs can be cached client-side
4. **Sanitize HTML** - If using `dangerouslySetInnerHTML`, ensure content is trusted

## Related

- [Chart Raw SVG](./chart-raw-svg) - Minimal SVG output
- [Chart JSON](./chart-json) - JSON data for custom rendering
