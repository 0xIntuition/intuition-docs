---
title: AI Skills
sidebar_label: AI Skills
sidebar_position: 8
description: Install Intuition agent skills for Claude Code, Codex, and compatible AI coding agents
keywords: [ai skills, agent skills, Claude Code, Codex, protocol transactions, unsigned transactions]
---

# AI Skills

The Intuition Agent Skills repository gives AI coding agents canonical protocol context. Use it when you want an agent to produce correct Intuition reads, writes, calldata, or unsigned transaction parameters.

## What the Skills Solve

General LLMs can miss Intuition-specific details, including:

- L3 chain and deployment details that are not discoverable through Etherscan.
- V2 contract interfaces and ABIs.
- `bytes32` atom, triple, and term IDs.
- Batch-only creation flows.
- Bonding curve and value calculation requirements.

The skills provide verified references so the agent can reason from canonical protocol context instead of guessing.

## Install

Install all Intuition skills:

```bash
npx skills add 0xintuition/agent-skills
```

Install only the core Intuition protocol skill:

```bash
npx skills add 0xintuition/agent-skills --skill intuition
```

Once installed, call the skill from within your agent session:

```text
/intuition
```

Agents can also call the skill on their own, without needing to invoke it from within an agent session, allowing for integration into AI features.

## Current Skill

| Skill | Purpose | Repository |
| --- | --- | --- |
| `intuition` | Canonical reference for Intuition Protocol transactions, ABIs, encoding, addresses, and value calculations. | [agent-skills](https://github.com/0xIntuition/agent-skills/tree/main/skills/intuition) |

The repository is structured to support more skills over time, but `intuition` is the current public protocol skill.

## Important Boundary

The skills produce unsigned transaction parameters. Your application, wallet, or backend signing flow remains responsible for:

- Choosing the signer.
- Presenting the transaction to the user or signing infrastructure.
- Broadcasting the transaction.
- Confirming and handling receipt data.

Treat `main` as a moving branch. For production agent workflows, pin installs to a Git tag or commit SHA once a release is selected. You can find the latest version and release information in the [GitHub releases page](https://github.com/0xintuition/agent-skills/releases).

## When to Use AI Skills vs MCP

Use AI skills when an agent is writing or modifying code that interacts with the protocol.

Use the [MCP Server](/docs/experimental-applications/mcp-server) when an AI application needs tools for querying atoms, accounts, social graph data, or lists at runtime.

The two can be used together: skills help the coding agent implement correctly while MCP gives the finished AI application live graph tools.

## Pair With Templates

The official [templates](/docs/getting-started/templates) already include agent-readable READMEs and `.agents/INSTRUCTIONS.md` files. Install the Intuition skill before asking an agent to extend those templates with new protocol operations.
