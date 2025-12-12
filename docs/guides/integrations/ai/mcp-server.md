---
title: Intuition MCP Server
sidebar_position: 2
---

# Intuition MCP Server

The Intuition MCP Server is an HTTP stream server designed to interact with the Intuition knowledge graph, enabling AI models and applications to query and manage data through powerful tools built on the Model Context Protocol.

## Overview

The Intuition MCP Server acts as a bridge between AI applications and the Intuition protocol, providing:

- **Structured data extraction** from natural language using triple extraction
- **Comprehensive search** for entities (atoms), accounts, and concepts
- **Social graph exploration** with followers and following relationships
- **Account information** retrieval with detailed connection data
- **List management** for curated entity collections

This server supports both modern Streamable HTTP and legacy Server-Sent Events (SSE) transports for maximum compatibility.

## GitHub Repository

<div style={{
  padding: '2rem',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
  textAlign: 'center',
  margin: '2rem 0'
}}>
  <h3 style={{ color: 'white', marginBottom: '1rem' }}>
    Intuition MCP Server
  </h3>
  <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem' }}>
    Open-source Model Context Protocol server for knowledge graph interactions
  </p>
  <a
    href="https://github.com/0xIntuition/intuition-mcp-server"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: 'inline-block',
      padding: '12px 32px',
      backgroundColor: 'white',
      color: '#6B73FF',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      transition: 'transform 0.2s',
    }}
    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    View on GitHub →
  </a>
</div>

## Getting Started

### Prerequisites
- Node.js 14+
- pnpm (install globally with `npm install -g pnpm`)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/0xIntuition/intuition-mcp-server
cd intuition-mcp-server
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Start the server**:
```bash
pnpm run start:http
```

The server will be available at the configured host and port (e.g., http://localhost:3001).

## Available Tools

The MCP Server provides several powerful tools for interacting with the Intuition knowledge graph. All tools return responses sorted by relevance and include comprehensive information.

### search_atoms
Searches for entities (accounts, concepts, people) by name, description, URL, or ENS domain.

**Input Schema**:
```json
{
  "queries": ["ethereum", "vitalik.eth", "defi protocols"]
}
```

**Usage**: Find atoms related to your search terms with detailed information and connections.

### get_account_info
Retrieves detailed information about an account using its address or identifier.

**Input Schema**:
```json
{
  "identifier": "0x1234567890123456789012345678901234567890"
}
```

**Usage**: Get comprehensive account details including connections and activity.

### search_lists
Searches for curated lists of entities by name or description.

**Input Schema**:
```json
{
  "query": "top defi protocols"
}
```

**Usage**: Find organized collections of related entities with ranking and metadata.

### get_following
Retrieves atoms that an account follows, optionally filtered by predicate.

**Input Schema**:
```json
{
  "account_id": "0x3e2178cf851a0e5cbf84c0ff53f820ad7ead703b",
  "predicate": "recommend"
}
```

**Usage**: Explore what entities an account follows or recommends.

### get_followers
Retrieves followers of an account, optionally filtered by predicate.

**Input Schema**:
```json
{
  "account_id": "0x3e2178cf851a0e5cbf84c0ff53f820ad7ead703b",
  "predicate": "follow"
}
```

**Usage**: See who follows or recommends a specific account.

### search_account_ids
Resolves identifiers (like ENS domains) to account addresses.

**Input Schema**:
```json
{
  "identifier": "vitalik.eth"
}
```

**Usage**: Convert ENS names or other identifiers to blockchain addresses.

## Client Integration

### Using the MCP SDK

The server uses the Model Context Protocol SDK for client interactions. Here's a basic client setup:

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

async function connectToMcpServer(url: string) {
  const client = new Client({
    name: 'intuition-client',
    version: '1.0.0',
  });

  const transport = new StreamableHTTPClientTransport(new URL(url));
  await client.connect(transport);

  return client;
}

// Usage
const client = await connectToMcpServer('http://localhost:3001');
const response = await client.callTool('search_atoms', {
  queries: ['ethereum']
});
```

### API Endpoints

The server provides these endpoints:
- `/mcp` - Streamable HTTP transport (recommended)
- `/sse` - Server-Sent Events transport (legacy support)

## Architecture

The MCP Server operates as an HTTP stream server, leveraging the Model Context Protocol to handle streaming requests and responses. This makes it ideal for real-time applications and large-scale data queries.

### Request Flow

1. **Client Request**: Application sends request to MCP endpoint
2. **Tool Processing**: Server processes the request using appropriate tool
3. **Knowledge Graph Query**: Server queries Intuition protocol
4. **Response Streaming**: Results are streamed back to client
5. **Client Processing**: Application handles streaming response data

## Deployment

The repository includes deployment configuration:

- **Dockerfile**: Ready for deployment to services like Render or any Docker-compatible host
- **render.yaml**: Configuration for Render deployment
- **Environment setup**: Configurable for different deployment environments

### Environment Variables

Configure these environment variables for your deployment:
- `PORT`: Server port (default: 3001)
- `HOST`: Server host (default: localhost)
- API credentials and other service-specific configurations

## Contributing

We welcome contributions to the Intuition MCP Server! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

Please ensure your code follows the project's coding standards and includes tests.

## Support and Resources

- **[GitHub Repository](https://github.com/0xIntuition/intuition-mcp-server)**: Source code, issues, and contributions
- **[Model Context Protocol](https://modelcontextprotocol.io)**: Learn more about the MCP specification
- **[Intuition Protocol](https://docs.intuition.systems)**: Comprehensive protocol documentation

## License

The Intuition MCP Server is open-source software licensed under the MIT License. See the [LICENSE](https://github.com/0xIntuition/intuition-mcp-server/blob/main/LICENSE) file for details.
