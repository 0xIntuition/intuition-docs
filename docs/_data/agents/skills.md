---
title: Install the agent skills
sidebar_label: Install the agent skills
description: Install Intuition's protocol and ERC-8004 agent skills, choose the right skill, and understand each planning boundary.
kind: how-to
reader: ["agent"]
packages: []
---

Install the Intuition agent skills to give your coding agent canonical context for protocol operations and ERC-8004 integration planning.

## Before you start

Use an agent runtime that supports skills, such as Claude Code or Codex, and a terminal that can run `npx`.

Both skills work at the contract level and apply to the V1 and V2 documentation generations. Choose the skill according to the work you need:

| Skill | Use it for | Planning boundary |
| --- | --- | --- |
| `intuition` | Protocol operations, including contract interfaces, encoding, addresses, and value calculations. | Can produce unsigned transaction parameters after its preparation, policy, and simulation gates. Your wallet or signing infrastructure handles signing and broadcasting. |
| `erc8004-agent-layer` | ERC-8004 agent identity, classification, trust providers, and mutable assessment sources. | Produces a canonical semantic plan and stops. It does not pin metadata or prepare transactions in that planning turn. |

## Steps

### 1. Install the skills

Run:

```bash
npx skills add 0xintuition/agent-skills
```

For production agent workflows, select a Git tag or commit and pin the installation to it. The repository's `main` branch changes over time; see the [release guidance](https://github.com/0xIntuition/agent-skills/blob/8d390bdc9dd59315122e7ad83013dc55d1472338/README.md#releases).

### 2. Invoke the skill for your task

For generic protocol operations, invoke:

```text
/intuition
```

For an ERC-8004 semantic plan, invoke:

```text
/erc8004-agent-layer
```

The ERC-8004 skill is self-contained for semantic planning. It does not require the `intuition` skill during that phase.

### 3. Review the result before continuing

For a protocol write with `intuition`, review the unsigned transaction parameters or approval request produced by the skill. Your application, wallet, or backend remains responsible for choosing the signer, presenting the transaction for review, broadcasting it, and checking the receipt.

For `erc8004-agent-layer`, review the canonical plan file and its summary. The skill stops after returning that plan. Protocol preparation requires a new user message requesting continuation of the returned plan, followed by fresh validation of that plan. This later preparation step does not authorize metadata pinning, signing, or broadcasting.

## Check the result

Both `intuition` and `erc8004-agent-layer` should be available in your agent session after installation. Confirm that the selected skill's response respects its boundary:

- For protocol writes, `intuition` provides unsigned parameters only after its required preparation and checks, or returns an approval request or a failure that must be resolved.
- When planning succeeds, `erc8004-agent-layer` returns the canonical plan's file path, status, and network, then stops before protocol preparation. If inputs or validation prevent planning, it reports the blocker.

## Related

- [Intuition Agent Skills repository](https://github.com/0xIntuition/agent-skills)
- [Protocol skill reference](https://github.com/0xIntuition/agent-skills/blob/8d390bdc9dd59315122e7ad83013dc55d1472338/skills/intuition/SKILL.md)
- [ERC-8004 skill reference](https://github.com/0xIntuition/agent-skills/blob/8d390bdc9dd59315122e7ad83013dc55d1472338/skills/erc8004-agent-layer/SKILL.md)
- [Prepare unsigned calldata and action envelopes](/docs/agents/cli)
- [Get help](/docs/community)
