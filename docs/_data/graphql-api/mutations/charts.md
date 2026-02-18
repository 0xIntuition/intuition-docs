---
title: Chart Mutations
sidebar_label: Charts
sidebar_position: 4
description: Generate chart data and SVG visualizations
keywords: [graphql, mutation, chart, svg, visualization, price]
---

# Chart Mutations

Generate chart data and SVG visualizations for share prices and PnL. These mutations connect to the Chart API service to produce time-series visualizations.

## getChartJson

Get share price chart data in JSON format.

```graphql
mutation GetChartJson($input: GetChartJsonInput!) {
  getChartJson(input: $input) {
    data
  }
}
```

### Variables

```json
{
  "input": {
    "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
    "curve_id": "1",
    "interval": "1d",
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-31T23:59:59Z",
    "graph_type": "area"
  }
}
```

### Input Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `term_id` | String | Yes | The term ID to get chart for |
| `curve_id` | String | Yes | The curve ID (e.g., "1" for atoms, "2" for triples) |
| `interval` | String | Yes | Time interval: `1h`, `1d`, `1w`, `1M` |
| `start_time` | String | No | Start timestamp (ISO 8601) |
| `end_time` | String | No | End timestamp (ISO 8601) |
| `graph_type` | String | No | Chart type: `line`, `area`, `candle` |

## getChartSvg

Get share price chart as an SVG image.

```graphql
mutation GetChartSvg($input: GetChartSvgInput!) {
  getChartSvg(input: $input) {
    svg
  }
}
```

### Variables

```json
{
  "input": {
    "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
    "curve_id": "1",
    "interval": "1d",
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-31T23:59:59Z",
    "width": 800,
    "height": 400,
    "line_color": "#00FF00",
    "background_color": "#1a1a1a",
    "graph_type": "area"
  }
}
```

### Additional SVG Input Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `width` | Int | No | SVG width in pixels (default: 600) |
| `height` | Int | No | SVG height in pixels (default: 300) |
| `line_color` | String | No | Line/fill color (hex, e.g., "#00FF00") |
| `background_color` | String | No | Background color (hex) |

## getChartRawJson

Get raw share price data points in JSON format (without transformations).

```graphql
mutation GetChartRawJson($input: GetChartJsonInput!) {
  getChartRawJson(input: $input) {
    data
  }
}
```

## getChartRawSvg

Get raw share price chart as SVG (without transformations).

```graphql
mutation GetChartRawSvg($input: GetChartSvgInput!) {
  getChartRawSvg(input: $input) {
    svg
  }
}
```

## Use Cases

### Embed Chart in React

```typescript
import { useGetChartSvgMutation } from '@0xintuition/graphql'

function SharePriceChart({ termId, curveId }: Props) {
  const [getChart, { data, loading }] = useGetChartSvgMutation()

  useEffect(() => {
    getChart({
      variables: {
        input: {
          term_id: termId,
          curve_id: curveId,
          interval: '1d',
          width: 600,
          height: 300,
          line_color: '#10B981',
          background_color: 'transparent'
        }
      }
    })
  }, [termId, curveId])

  if (loading) return <div>Loading chart...</div>

  return (
    <div
      dangerouslySetInnerHTML={{ __html: data?.getChartSvg?.svg || '' }}
    />
  )
}
```

### Process Chart Data

```typescript
async function getChartData(termId: string) {
  const mutation = `
    mutation GetChartJson($input: GetChartJsonInput!) {
      getChartJson(input: $input) {
        data
      }
    }
  `

  const result = await client.request(mutation, {
    input: {
      term_id: termId,
      curve_id: '1',
      interval: '1d',
      start_time: new Date(Date.now() - 30 * 86400000).toISOString(),
      end_time: new Date().toISOString()
    }
  })

  // Parse and process the data
  const chartData = JSON.parse(result.getChartJson.data)
  return chartData
}
```

## Intervals

| Interval | Description |
|----------|-------------|
| `1h` | Hourly data points |
| `1d` | Daily data points |
| `1w` | Weekly data points |
| `1M` | Monthly data points |

## Best Practices

1. **Cache SVG responses** for frequently viewed charts
2. **Use appropriate intervals** based on date range
3. **Set transparent backgrounds** for dark mode compatibility
4. **Debounce chart requests** when parameters change frequently

## Related Mutations

- [Account PnL Charts](/docs/graphql-api/mutations/pnl) - Portfolio PnL visualization
- [Position PnL Charts](/docs/graphql-api/mutations/pnl) - Individual position PnL
