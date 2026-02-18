---
title: Get Chart Raw JSON
sidebar_label: Chart Raw JSON
sidebar_position: 3
description: Get raw chart data as JSON
keywords: [graphql, chart, json, raw, data]
---

# Get Chart Raw JSON

Retrieve raw chart data in JSON format without formatting or styling, ideal for custom data processing.

## Query Structure

```graphql
query GetChartRawJson($input: ChartInput!) {
  getChartRawJson(input: $input)
}
```

## Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `input.type` | `ChartType` | Yes | Type of chart data |
| `input.term_id` | `String` | Yes | Term ID to query |
| `input.interval` | `ChartInterval` | No | Time interval |
| `input.start_date` | `DateTime` | No | Start of date range |
| `input.end_date` | `DateTime` | No | End of date range |

```json
{
  "input": {
    "type": "PRICE_HISTORY",
    "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
    "interval": "DAY"
  }
}
```

## Expected Response

Returns a raw JSON string with unprocessed data:

```json
{
  "data": {
    "getChartRawJson": "{\"timestamps\":[1704067200,1704153600,1704240000],\"values\":[1.0,1.05,1.12],\"metadata\":{\"term_id\":\"0x57d...\",\"type\":\"PRICE_HISTORY\"}}"
  }
}
```

## Use Cases

### Custom Data Processing

```typescript
async function processChartData(termId: string) {
  const query = `
    query GetChartRawJson($input: ChartInput!) {
      getChartRawJson(input: $input)
    }
  `

  const response = await client.request(query, {
    input: {
      type: 'PRICE_HISTORY',
      term_id: termId,
      interval: 'HOUR'
    }
  })

  const rawData = JSON.parse(response.getChartRawJson)

  // Custom processing
  const movingAverage = calculateMA(rawData.values, 24)
  const volatility = calculateVolatility(rawData.values)

  return {
    raw: rawData,
    analysis: { movingAverage, volatility }
  }
}
```

### Data Export

```typescript
async function exportChartData(termId: string, format: 'csv' | 'json') {
  const query = `
    query GetChartRawJson($input: ChartInput!) {
      getChartRawJson(input: $input)
    }
  `

  const response = await client.request(query, {
    input: {
      type: 'PRICE_HISTORY',
      term_id: termId,
      interval: 'DAY'
    }
  })

  const data = JSON.parse(response.getChartRawJson)

  if (format === 'csv') {
    return convertToCSV(data)
  }

  return data
}
```

## Differences from getChartJson

| Aspect | `getChartRawJson` | `getChartJson` |
|--------|-------------------|----------------|
| Format | Raw timestamps and values | Chart.js compatible |
| Styling | None | Includes colors, options |
| Size | Smaller | Larger with metadata |
| Use case | Data processing | Direct rendering |

## Related

- [Chart JSON](./chart-json) - Formatted chart data
- [Chart SVG](./chart-svg) - Pre-rendered charts
