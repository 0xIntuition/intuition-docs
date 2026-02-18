---
title: Chart Raw JSON
sidebar_label: Chart Raw JSON
sidebar_position: 2
description: Get raw chart data as JSON
keywords: [graphql, chart, json, raw, data, visualization]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Chart Raw JSON Query

Retrieve raw chart data in JSON format without any formatting or chart library structure. Ideal for custom data processing.

## Query Structure

```graphql
query GetChartRawJson(
  $termId: String!
  $chartType: String!
  $startDate: String
  $endDate: String
  $interval: String
) {
  getChartRawJson(
    term_id: $termId
    chart_type: $chartType
    start_date: $startDate
    end_date: $endDate
    interval: $interval
  ) {
    term_id
    chart_type
    raw_data {
      timestamp
      value
      metadata
    }
  }
}
```

## Variables

```json
{
  "termId": "0x1234567890abcdef1234567890abcdef12345678",
  "chartType": "price",
  "interval": "day"
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `term_id` | String | Yes | The term (atom/triple) identifier |
| `chart_type` | String | Yes | Type of data: `price`, `volume`, `positions`, `signals` |
| `start_date` | String | No | Start of date range (ISO 8601) |
| `end_date` | String | No | End of date range (ISO 8601) |
| `interval` | String | No | Data interval: `hour`, `day`, `week`, `month` |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `term_id` | String | The term identifier |
| `chart_type` | String | Type of data requested |
| `raw_data` | Array | Array of raw data points |
| `raw_data[].timestamp` | String | ISO timestamp |
| `raw_data[].value` | String | Data value |
| `raw_data[].metadata` | Object | Additional metadata |

## Interactive Example

export const chartRawJsonQueries = [
  {
    id: 'chart-raw-json',
    title: 'Get Chart Raw JSON',
    query: `query GetChartRawJson(
  $termId: String!
  $chartType: String!
  $interval: String
) {
  getChartRawJson(
    term_id: $termId
    chart_type: $chartType
    interval: $interval
  ) {
    term_id
    chart_type
    raw_data {
      timestamp
      value
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

<GraphQLPlaygroundCustom queries={chartRawJsonQueries} />

## Use Cases

### Custom Data Processing

```typescript
import { useQuery, gql } from '@apollo/client';

const GET_CHART_RAW_JSON = gql`
  query GetChartRawJson($termId: String!, $chartType: String!) {
    getChartRawJson(term_id: $termId, chart_type: $chartType) {
      raw_data {
        timestamp
        value
      }
    }
  }
`;

function DataAnalysis({ termId }) {
  const { data } = useQuery(GET_CHART_RAW_JSON, {
    variables: { termId, chartType: 'price' }
  });

  const rawData = data?.getChartRawJson?.raw_data || [];

  // Calculate statistics
  const values = rawData.map(d => parseFloat(d.value));
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);

  return (
    <div>
      <p>Average: {avg.toFixed(4)}</p>
      <p>High: {max.toFixed(4)}</p>
      <p>Low: {min.toFixed(4)}</p>
    </div>
  );
}
```

### Export to CSV

```typescript
function exportToCsv(rawData) {
  const headers = 'timestamp,value\n';
  const rows = rawData
    .map(d => `${d.timestamp},${d.value}`)
    .join('\n');

  const blob = new Blob([headers + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'chart_data.csv';
  a.click();
}
```

## Best Practices

1. **Use for custom visualizations** - When you need full control over data
2. **Process data client-side** - Calculate moving averages, trends, etc.
3. **Export capabilities** - Raw data is ideal for CSV/Excel export
4. **Compare with formatted** - Use `getChartJson` when chart library format needed

## Related

- [Chart JSON](./chart-json) - Formatted chart data
- [Chart SVG](./chart-svg) - Pre-rendered SVG
- [Chart Raw SVG](./chart-raw-svg) - Raw SVG data
