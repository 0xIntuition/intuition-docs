---
title: "Audits"
sidebar_label: "Audits"
description: "Find the audit reports, scope and reviewed revisions for the Intuition contracts."
kind: reference
reader: ["app", "agent", "operator", "plugin"]
packages: []
---

Use the report that covers the component and revision you are evaluating. Each report below is linked from the same pinned contract source tree as this reference. The revisions examined by the auditors are listed separately.

| Review | Scope and reviewed revision |
| --- | --- |
| [Diligence — TRUST Token, Bonding and Emissions (PDF)](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/audits/Diligence-Audit-Report-1.pdf) | September 2025. The TRUST token, TrustBonding and the Base, Core and Satellite emissions controllers in the core contracts repository at `8b1a8f5a3dc6ad8365c73f4cec46fcd08c38bcca`. Section 2 lists files reviewed and files consulted for context. |
| [Diligence — MultiVault v2 (PDF)](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/audits/Diligence-Audit-Report-2.pdf) | September 2025. MultiVault, bonding curves and migration contracts in the core contracts repository at `2bb93d259c33d6d32843655ff936efc6bec421a9`. Appendix 1 lists the files and their hashes. |
| [Code4rena — Intuition Smart Contract Security Assessment (PDF)](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/audits/CodeArena-audit-report-April-2026.pdf) | March 4–9, 2026. The scope section identifies five Solidity contracts from two repositories, core contracts at `ef69071aaacb7ee6fec91267c9b2904aff0352e6` and periphery at `b026521fe26db8249cd0795b62ec480fd8c848e8`. The PDF includes the subsequent mitigation review. |

For a [deployment](/docs/reference/contracts/deployments), identify the implementation and compare its revision and files with the report's scope. An upgrade after the review can change the code reached through the same address.
