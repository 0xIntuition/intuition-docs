---
title: AI Skills
sidebar_label: AI Skills
sidebar_position: 8
description: Install Intuition agent skills for Claude Code, Codex, and compatible AI coding agents
keywords:
  [
    ai skills,
    agent skills,
    Claude Code,
    Codex,
    protocol transactions,
    unsigned transactions,
  ]
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

Install the ERC-8004 partner-planning skill at its released version:

```bash
npx skills add 0xIntuition/agent-skills#erc8004-agent-layer-v0.1.0 \
  --skill erc8004-agent-layer
```

Then invoke it with `/erc8004-agent-layer` or name it in your request. It returns a canonical no-write semantic plan and stops before protocol preparation.

Agents can also invoke the skill autonomously when their runtime supports skills, allowing Hermes-style agents and other AI features to use Intuition context without a manual slash command.

## Current Skills

| Skill                 | Purpose                                                                                                                      | Repository                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `intuition`           | Canonical reference for Intuition Protocol transactions, ABIs, encoding, addresses, and value calculations.                  | [agent-skills](https://github.com/0xIntuition/agent-skills/tree/main/skills/intuition)           |
| `erc8004-agent-layer` | Plans ERC-8004 partner integrations with canonical registry IDs, trust-pattern Triples, deduplication checks, and no writes. | [agent-skills](https://github.com/0xIntuition/agent-skills/tree/main/skills/erc8004-agent-layer) |

Use `erc8004-agent-layer` first to decide what the integration means. After you accept its terminal semantic plan, start a new request with `intuition` for protocol preview or execution mechanics. See the [ERC-8004 Agent Layer Partner Guide](/docs/erc-8004-agent-layer) for the complete guided and manual workflows.

## Important Boundary

The core `intuition` skill can produce unsigned transaction parameters. Your application, wallet, or backend signing flow remains responsible for:

- Choosing the signer.
- Presenting the transaction to the user or signing infrastructure.
- Broadcasting the transaction.
- Confirming and handling receipt data.

Treat `main` as a moving branch. For production agent workflows, pin installs to a Git tag or commit SHA once a release is selected. You can find the latest version and release information in the [GitHub releases page](https://github.com/0xintuition/agent-skills/releases).

The ERC-8004 skill has a stricter boundary: its first turn ends at a no-write semantic plan. Approval does not carry across phases. Metadata pinning, testnet execution, mainnet preview, and mainnet execution each require a later, explicit instruction; mainnet execution always requires explicit mainnet approval.

## When to Use AI Skills vs MCP

Use AI skills when an agent is writing or modifying code that interacts with the protocol.

Use the [MCP Server](/docs/experimental-applications/mcp-server) when an AI application needs tools for querying atoms, accounts, social graph data, or lists at runtime.

The two can be used together: skills help the coding agent implement correctly while MCP gives the finished AI application live graph tools.

## Pair With Templates

The official [templates](/docs/getting-started/templates) already include agent-readable READMEs and `.agents/INSTRUCTIONS.md` files. Install the Intuition skill before asking an agent to extend those templates with new protocol operations.
