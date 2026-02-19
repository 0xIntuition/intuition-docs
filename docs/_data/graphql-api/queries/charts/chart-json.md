---
title: Get Chart JSON
sidebar_label: Chart JSON
sidebar_position: 2
description: Get chart data as structured JSON
keywords: [graphql, chart, json, data, visualization]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Get Chart JSON

Retrieve chart data in structured JSON format, suitable for use with charting libraries like Chart.js, Recharts, or D3.

## Query Structure

```graphql
query GetChartJson($input: ChartInput!) {
  getChartJson(input: $input) {
    type
    title
    labels
    datasets {
      label
      data
      borderColor
      backgroundColor
    }
    options {
      responsive
      scales
    }
  }
}
```

## Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `input.type` | `ChartType` | Yes | Type of chart: `PRICE_HISTORY`, `VOLUME`, `TVL`, `POSITIONS` |
| `input.term_id` | `String` | Yes | Term ID to generate chart for |
| `input.interval` | `ChartInterval` | No | Time interval: `HOUR`, `DAY`, `WEEK`, `MONTH` |
| `input.start_date` | `DateTime` | No | Start of date range |
| `input.end_date` | `DateTime` | No | End of date range |

```json
{
  "input": {
    "type": "PRICE_HISTORY",
    "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
    "interval": "DAY",
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-01-31T23:59:59Z"
  }
}
```

## Expected Response

```json
{
  "data": {
    "getChartJson": {
      "type": "PRICE_HISTORY",
      "title": "Ethereum Price History",
      "labels": ["Jan 1", "Jan 2", "Jan 3", "Jan 4", "Jan 5"],
      "datasets": [
        {
          "label": "Price (ETH)",
          "data": [1.0, 1.05, 1.12, 1.08, 1.15],
          "borderColor": "#8884d8",
          "backgroundColor": "rgba(136, 132, 216, 0.2)"
        }
      ],
      "options": {
        "responsive": true,
        "scales": {
          "y": {
            "beginAtZero": false
          }
        }
      }
    }
  }
}
```

## Use Cases

### Chart.js Integration

```typescript
import { Chart } from 'chart.js'

async function renderPriceChart(termId: string, canvasId: string) {
  const query = `
    query GetChartJson($input: ChartInput!) {
      getChartJson(input: $input) {
        labels
        datasets {
          label
          data
          borderColor
          backgroundColor
        }
        options
      }
    }
  `

  const response = await client.request(query, {
    input: {
      type: 'PRICE_HISTORY',
      term_id: termId,
      interval: 'DAY'
    }
  })

  const chartData = response.getChartJson

  new Chart(document.getElementById(canvasId), {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: chartData.datasets
    },
    options: chartData.options
  })
}
```

### Recharts Integration

```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

function PriceHistoryChart({ termId }: { termId: string }) {
  const { data, loading } = useQuery(GET_CHART_JSON, {
    variables: {
      input: {
        type: 'PRICE_HISTORY',
        term_id: termId,
        interval: 'DAY'
      }
    }
  })

  if (loading) return <Spinner />

  const chartJson = data.getChartJson

  // Transform to Recharts format
  const chartData = chartJson.labels.map((label, i) => ({
    name: label,
    value: chartJson.datasets[0].data[i]
  }))

  return (
    <LineChart width={600} height={300} data={chartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="value"
        stroke={chartJson.datasets[0].borderColor}
        name={chartJson.datasets[0].label}
      />
    </LineChart>
  )
}
```

## Best Practices

1. **Cache results** - Chart data can be cached based on interval
2. **Use appropriate intervals** - Match interval to display width
3. **Handle empty data** - Show appropriate message when no data
4. **Transform as needed** - Adapt JSON structure to your chart library

## Related

- [Chart Raw JSON](./chart-raw-json) - Raw JSON format
- [Chart SVG](./chart-svg) - Pre-rendered SVG charts
- [Time Series](/docs/graphql-api/queries/advanced/time-series) - Raw data for custom charts
