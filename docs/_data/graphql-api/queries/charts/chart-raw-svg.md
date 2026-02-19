---
title: Get Chart Raw SVG
sidebar_label: Chart Raw SVG
sidebar_position: 5
description: Get minimal raw SVG chart output
keywords: [graphql, chart, svg, raw, minimal]
---

# Get Chart Raw SVG

Retrieve a minimal SVG chart without additional styling or branding, ideal for custom post-processing.

## Query Structure

```graphql
query GetChartRawSvg($input: ChartSvgInput!) {
  getChartRawSvg(input: $input)
}
```

## Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `input.type` | `ChartType` | Yes | Type of chart |
| `input.term_id` | `String` | Yes | Term ID to query |
| `input.interval` | `ChartInterval` | No | Time interval |
| `input.width` | `Int` | No | Chart width |
| `input.height` | `Int` | No | Chart height |

```json
{
  "input": {
    "type": "PRICE_HISTORY",
    "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
    "width": 800,
    "height": 400
  }
}
```

## Expected Response

Returns a minimal SVG string without styling:

```json
{
  "data": {
    "getChartRawSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 400\"><path d=\"M0,300 L100,280 L200,250...\"/></svg>"
  }
}
```

## Differences from getChartSvg

| Aspect | `getChartRawSvg` | `getChartSvg` |
|--------|------------------|---------------|
| Styling | Minimal | Fully styled |
| Labels | None | Included |
| Legend | None | Included |
| Size | Smaller | Larger |
| Use case | Post-processing | Direct display |

## Use Cases

### Custom Styling

```typescript
async function getCustomStyledChart(termId: string) {
  const response = await client.request(GET_CHART_RAW_SVG, {
    input: {
      type: 'PRICE_HISTORY',
      term_id: termId,
      width: 800,
      height: 400
    }
  })

  // Add custom styling
  const svg = response.getChartRawSvg
  const styledSvg = svg.replace(
    '<svg',
    '<svg style="fill: none; stroke: #00ff00; stroke-width: 2"'
  )

  return styledSvg
}
```

### Animation

```typescript
function AnimatedChart({ termId }: { termId: string }) {
  const { data } = useQuery(GET_CHART_RAW_SVG, {
    variables: {
      input: { type: 'PRICE_HISTORY', term_id: termId }
    }
  })

  // Add CSS animation to paths
  const animatedSvg = data?.getChartRawSvg.replace(
    /<path/g,
    '<path class="animate-draw"'
  )

  return (
    <>
      <style>{`
        .animate-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw 2s ease-in-out forwards;
        }
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: animatedSvg }} />
    </>
  )
}
```

## Related

- [Chart SVG](./chart-svg) - Fully styled SVG charts
- [Chart JSON](./chart-json) - JSON data for custom rendering
