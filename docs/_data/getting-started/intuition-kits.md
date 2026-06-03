---
sidebar_position: 5
sidebar_label: Developer Resources
title: Developer Resources
description: Official learning materials, templates, and AI-agent resources for building with Intuition
keywords: [developer resources, learn intuition, templates, ai skills, agent skills, getting started]
---

# Developer Resources

Use these official resources when you want to learn the protocol, start from a working application, or hand Intuition-specific context to an AI coding agent.

## Start Here

| Resource | Use When | Link |
| --- | --- | --- |
| Learn Intuition | You want a guided course through atoms, triples, signals, reads, writes, and app building. | [Learn Intuition](/docs/getting-started/learn-intuition) |
| Templates | You want to fork a working Intuition app instead of starting from a blank repository. | [Templates](/docs/getting-started/templates) |
| AI Skills | You want Claude Code, Codex, or another agent to produce correct Intuition protocol operations. | [AI Skills](/docs/getting-started/ai-skills) |
| MCP Server | You want an AI app to query Intuition through Model Context Protocol tools. | [MCP Server](/docs/experimental-applications/mcp-server) |

## Official Repositories

| Repository | Purpose |
| --- | --- |
| [learn-intuition](https://github.com/0xIntuition/learn-intuition) | Interactive Claude Code course for learning Intuition from primitives to a capstone app. |
| [agent-skills](https://github.com/0xIntuition/agent-skills) | Agent-facing skills that provide canonical protocol context and unsigned transaction parameters. |
| [intuition-basic-template](https://github.com/0xIntuition/intuition-basic-template) | Vite + React template that exposes protocol functions through direct forms. |
| [intuition-advanced-template](https://github.com/0xIntuition/intuition-advanced-template) | Next.js template for curated lists with GraphQL reads, protocol writes, and SIWE auth. |
| [intuition-mcp-server](https://github.com/0xIntuition/intuition-mcp-server) | Model Context Protocol server for querying and exploring Intuition data from AI clients. |

## Suggested Path

1. Read [Choose Your Path](/docs/getting-started/choose-your-path) to pick the right building surface.
2. Run [Learn Intuition](/docs/getting-started/learn-intuition) if you want guided protocol context.
3. Fork the [basic or advanced template](/docs/getting-started/templates) that matches your application.
4. Install the [AI skills](/docs/getting-started/ai-skills) before asking an agent to write Intuition protocol code.
5. Use the [MCP Server](/docs/experimental-applications/mcp-server) when your AI application needs live graph tools.

## Agent-Ready Development

The course, templates, and skills are designed to work together:

- Learn Intuition teaches the protocol and ends with a template-based capstone.
- The templates include agent-facing instructions for Claude Code, Codex, Cursor, and compatible tools.
- The AI skills fill in Intuition-specific details that general LLMs usually miss, including ABIs, bytes32 IDs, batch-only creation flows, bonding curve mechanics, and unsigned transaction parameter generation.

For protocol concepts before implementation, start with [Primitives](/docs/intuition-concepts/primitives). For reads and queries, use the [GraphQL API](/docs/graphql-api/overview). For onchain writes, use the [SDK](/docs/intuition-sdk/quick-start) or [Protocol](/docs/protocol/getting-started/overview) docs.
