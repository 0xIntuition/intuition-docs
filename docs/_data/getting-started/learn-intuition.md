---
title: Learn Intuition
sidebar_label: Learn Intuition
sidebar_position: 6
description: Run the interactive Learn Intuition course inside Claude Code
keywords: [learn intuition, course, Claude Code, atoms, triples, signals, tutorial]
---

# Learn Intuition

Learn Intuition is an interactive course that teaches the Intuition protocol inside Claude Code. It is meant for builders who want guided context before writing production code or asking an AI agent to extend an Intuition app. We'll be extending to support Codex in the future, but this first iteration is focused on running the experience within Claude Code.

## What You Learn

| Part | Lessons | Focus |
| --- | --- | --- |
| Understanding the Knowledge Graph | 00-04 | Intuition, atoms, triples, signals, staking, conviction, and bonding curves. |
| Building with the Protocol | 05-08 | Protocol setup, testnet connection, creating atoms and triples, GraphQL reads, and vault state. |
| Building Real Applications | 09-11 | Ecosystem navigation, context engineering, and a capstone app built from Intuition templates. |

## Prerequisites

- Claude Code installed locally.
- Git and a JavaScript runtime available in your terminal.
- Basic familiarity with TypeScript and wallet-based web apps.

## Run the Course

```bash
git clone https://github.com/0xIntuition/learn-intuition.git
cd learn-intuition
claude
```

Then run the course command inside Claude Code:

```text
/learn
```

## Course Commands

| Command | What It Does |
| --- | --- |
| `/learn` | Show the course dashboard. |
| `/learn next` | Start the next lesson. |
| `/learn progress` | View your progress stats. |
| `/learn reset` | Reset course progress. |
| `/learn 00` through `/learn 11` | Jump directly to a lesson. |

## When to Use It

Use Learn Intuition when you want to:

- Understand the protocol primitives before building.
- Have a guided, AI-assisted interactive learning experience.
- Learn the read path and write path together.
- Practice with an AI coding agent in a controlled environment.
- Prepare to fork the [basic or advanced template](/docs/getting-started/templates).

## Next Steps

- [Templates](/docs/getting-started/templates) - fork a working app after the course.
- [AI Skills](/docs/getting-started/ai-skills) - install agent skills before asking an agent to write protocol operations.
- [SDK Quick Start](/docs/intuition-sdk/quick-start) - build directly with the TypeScript SDK.
- [GraphQL Overview](/docs/graphql-api/overview) - query the knowledge graph.
