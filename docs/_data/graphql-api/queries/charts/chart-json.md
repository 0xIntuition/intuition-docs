---
title: Chart JSON
sidebar_label: Chart JSON
sidebar_position: 1
description: Get chart data as JSON
keywords: [graphql, chart, json, visualization, data]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Chart JSON Query

Retrieve chart data in JSON format for custom visualization rendering.

## Query Structure

```graphql
query GetChartJson(
  $termId: String!
  $chartType: String!
  $startDate: String
  $endDate: String
  $interval: String
) {
  getChartJson(
    term_id: $termId
    chart_type: $chartType
    start_date: $startDate
    end_date: $endDate
    interval: $interval
  ) {
    term_id
    chart_type
    data {
      labels
      datasets {
        label
        data
        backgroundColor
        borderColor
      }
    }
    options {
      title
      xAxisLabel
      yAxisLabel
    }
  }
}
```

## Variables

```json
{
  "termId": "0x1234567890abcdef1234567890abcdef12345678",
  "chartType": "price",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "interval": "day"
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `term_id` | String | Yes | The term (atom/triple) identifier |
| `chart_type` | String | Yes | Type of chart: `price`, `volume`, `positions`, `signals` |
| `start_date` | String | No | Start of date range (ISO 8601) |
| `end_date` | String | No | End of date range (ISO 8601) |
| `interval` | String | No | Data point interval: `hour`, `day`, `week`, `month` |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `term_id` | String | The term identifier |
| `chart_type` | String | Type of chart generated |
| `data.labels` | Array | X-axis labels (timestamps) |
| `data.datasets` | Array | Chart datasets |
| `data.datasets[].label` | String | Dataset label |
| `data.datasets[].data` | Array | Data points |
| `options` | Object | Chart configuration options |

## Interactive Example

export const chartJsonQueries = [
  {
    id: 'chart-json',
    title: 'Get Chart JSON',
    query: `query GetChartJson(
  $termId: String!
  $chartType: String!
  $interval: String
) {
  getChartJson(
    term_id: $termId
    chart_type: $chartType
    interval: $interval
  ) {
    term_id
    chart_type
    data {
      labels
      datasets {
        label
        data
      }
    }
  }
}`,
    variables: {
      termId: '0x1234567890abcdef1234567890abcdef12345678',
      chartType: 'price',
      interval: 'day'
    }
  }
];

<GraphQLPlaygroundCustom queries={chartJsonQueries} />

## Use Cases

### Render with Chart.js

```typescript
import { useQuery, gql } from '@apollo/client';
import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';

const GET_CHART_JSON = gql`
  query GetChartJson($termId: String!, $chartType: String!) {
    getChartJson(term_id: $termId, chart_type: $chartType) {
      data {
        labels
        datasets {
          label
          data
          backgroundColor
          borderColor
        }
      }
      options {
        title
      }
    }
  }
`;

function PriceChart({ termId }) {
  const canvasRef = useRef(null);
  const { data, loading } = useQuery(GET_CHART_JSON, {
    variables: { termId, chartType: 'price' }
  });

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const chart = new Chart(canvasRef.current, {
      type: 'line',
      data: data.getChartJson.data,
      options: {
        plugins: {
          title: {
            display: true,
            text: data.getChartJson.options.title
          }
        }
      }
    });

    return () => chart.destroy();
  }, [data]);

  if (loading) return <div>Loading...</div>;

  return <canvas ref={canvasRef} />;
}
```

## Best Practices

1. **Choose appropriate chart types** - Match chart type to data being visualized
2. **Limit date ranges** - Request only needed data to reduce payload
3. **Cache chart data** - Historical data doesn't change frequently
4. **Handle empty data** - Some terms may have limited data points

## Related

- [Chart Raw JSON](./chart-raw-json) - Raw JSON without formatting
- [Chart SVG](./chart-svg) - Get pre-rendered SVG chart
- [Chart Raw SVG](./chart-raw-svg) - Raw SVG data
