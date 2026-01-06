# Documentation File Paths Reference

> **TEMPORARY FILE**: This file documents the actual file path structure for link verification purposes.

## Base Path Structure

All documentation files are located under `docs/_data/`.

**Internal Link Format**: Links should use `/docs/` prefix followed by the path, e.g., `/docs/getting-started/overview`

**INCORRECT**: `/docs/docs/protocol/overview` (double docs prefix)
**CORRECT**: `/docs/protocol/getting-started/overview`

**INCORRECT**: `/docs/intuition-concepts/atoms` (missing primitives folder)
**CORRECT**: `/docs/intuition-concepts/primitives/Atoms/fundamentals`

**INCORRECT**: `/docs/intuition-sdk/overview` (wrong file name)
**CORRECT**: `/docs/intuition-sdk/quick-start`

---

## Complete File Path Mapping

### Root Level
| File Path | Link Path |
|-----------|-----------|
| `docs/_data/index.md` | `/` |
| `docs/_data/contribution-guidelines.md` | `/contribution-guidelines` |
| `docs/_data/portal.md` | `/portal` |

### Getting Started (`/getting-started/`)
| File Path | Link Path |
|-----------|-----------|
| `getting-started/overview.md` | `/getting-started/overview` |
| `getting-started/why-intuition.md` | `/getting-started/why-intuition` |
| `getting-started/architecture.mdx` | `/getting-started/architecture` |
| `getting-started/choose-your-path.md` | `/getting-started/choose-your-path` |
| `getting-started/developer-stack.md` | `/getting-started/developer-stack` |
| `getting-started/integrations.md` | `/getting-started/integrations` |
| `getting-started/intuition-kits.md` | `/getting-started/intuition-kits` |
| `getting-started/use-cases.md` | `/getting-started/use-cases` |

### Quick Start (`/quick-start/`)
| File Path | Link Path |
|-----------|-----------|
| `quick-start/deployments.md` | `/quick-start/deployments` |
| `quick-start/network-details.md` | `/quick-start/network-details` |
| `quick-start/testnet-faucet.md` | `/quick-start/testnet-faucet` |
| `quick-start/using-the-sdk.md` | `/quick-start/using-the-sdk` |

### Intuition Concepts (`/intuition-concepts/`)
| File Path | Link Path |
|-----------|-----------|
| `intuition-concepts/architecture.md` | `/intuition-concepts/architecture` |
| `intuition-concepts/trust-mechanisms.md` | `/intuition-concepts/trust-mechanisms` |

#### Primitives (`/intuition-concepts/primitives/`)
| File Path | Link Path |
|-----------|-----------|
| `intuition-concepts/primitives/index.md` | `/intuition-concepts/primitives` |
| `intuition-concepts/primitives/Atoms/fundamentals.md` | `/intuition-concepts/primitives/Atoms/fundamentals` |
| `intuition-concepts/primitives/Atoms/structuring.md` | `/intuition-concepts/primitives/Atoms/structuring` |
| `intuition-concepts/primitives/Atoms/best-practices.md` | `/intuition-concepts/primitives/Atoms/best-practices` |
| `intuition-concepts/primitives/Triples/fundamentals.md` | `/intuition-concepts/primitives/Triples/fundamentals` |
| `intuition-concepts/primitives/Triples/structuring.md` | `/intuition-concepts/primitives/Triples/structuring` |
| `intuition-concepts/primitives/Triples/nested-triples.md` | `/intuition-concepts/primitives/Triples/nested-triples` |
| `intuition-concepts/primitives/Signals/fundamentals.md` | `/intuition-concepts/primitives/Signals/fundamentals` |
| `intuition-concepts/primitives/Signals/capturing.md` | `/intuition-concepts/primitives/Signals/capturing` |
| `intuition-concepts/primitives/Signals/rewards.md` | `/intuition-concepts/primitives/Signals/rewards` |

#### Economics (`/intuition-concepts/economics/`)
| File Path | Link Path |
|-----------|-----------|
| `intuition-concepts/economics/index.md` | `/intuition-concepts/economics` |
| `intuition-concepts/economics/bonding-curves.md` | `/intuition-concepts/economics/bonding-curves` |
| `intuition-concepts/economics/fees-and-rewards.md` | `/intuition-concepts/economics/fees-and-rewards` |
| `intuition-concepts/economics/incentive-design.md` | `/intuition-concepts/economics/incentive-design` |
| `intuition-concepts/economics/tokenomics.md` | `/intuition-concepts/economics/tokenomics` |

### Protocol (`/protocol/`)
| File Path | Link Path |
|-----------|-----------|
| `protocol/working-with-primitives.md` | `/protocol/working-with-primitives` |

#### Getting Started (`/protocol/getting-started/`)
| File Path | Link Path |
|-----------|-----------|
| `protocol/getting-started/overview.md` | `/protocol/getting-started/overview` |
| `protocol/getting-started/configuration.md` | `/protocol/getting-started/configuration` |

#### Core Concepts (`/protocol/core-concepts/`)
| File Path | Link Path |
|-----------|-----------|
| `protocol/core-concepts/vaults.md` | `/protocol/core-concepts/vaults` |
| `protocol/core-concepts/epochs.md` | `/protocol/core-concepts/epochs` |

#### API Reference (`/protocol/api-reference/`)
| File Path | Link Path |
|-----------|-----------|
| `protocol/api-reference/multivault/atoms.md` | `/protocol/api-reference/multivault/atoms` |
| `protocol/api-reference/multivault/triples.md` | `/protocol/api-reference/multivault/triples` |
| `protocol/api-reference/multivault/vaults.md` | `/protocol/api-reference/multivault/vaults` |
| `protocol/api-reference/multivault/fees.md` | `/protocol/api-reference/multivault/fees` |
| `protocol/api-reference/multivault/configuration.md` | `/protocol/api-reference/multivault/configuration` |
| `protocol/api-reference/multivault/conversions.md` | `/protocol/api-reference/multivault/conversions` |
| `protocol/api-reference/multivault/vault-queries.md` | `/protocol/api-reference/multivault/vault-queries` |
| `protocol/api-reference/multivault/epochs-utilization.md` | `/protocol/api-reference/multivault/epochs-utilization` |
| `protocol/api-reference/trust-bonding/staking-operations.md` | `/protocol/api-reference/trust-bonding/staking-operations` |
| `protocol/api-reference/trust-bonding/rewards.md` | `/protocol/api-reference/trust-bonding/rewards` |
| `protocol/api-reference/trust-bonding/epochs.md` | `/protocol/api-reference/trust-bonding/epochs` |
| `protocol/api-reference/trust-bonding/balances.md` | `/protocol/api-reference/trust-bonding/balances` |
| `protocol/api-reference/trust-bonding/lock-queries.md` | `/protocol/api-reference/trust-bonding/lock-queries` |
| `protocol/api-reference/wrapped-trust/overview.md` | `/protocol/api-reference/wrapped-trust/overview` |

#### Events (`/protocol/events/`)
| File Path | Link Path |
|-----------|-----------|
| `protocol/events/atom-events.md` | `/protocol/events/atom-events` |
| `protocol/events/triple-events.md` | `/protocol/events/triple-events` |
| `protocol/events/vault-events.md` | `/protocol/events/vault-events` |
| `protocol/events/trust-bonding-events.md` | `/protocol/events/trust-bonding-events` |

#### Examples (`/protocol/examples/`)
| File Path | Link Path |
|-----------|-----------|
| `protocol/examples/creating-atoms-triples.md` | `/protocol/examples/creating-atoms-triples` |
| `protocol/examples/deposit-redeem.md` | `/protocol/examples/deposit-redeem` |
| `protocol/examples/batch-operations.md` | `/protocol/examples/batch-operations` |
| `protocol/examples/fee-calculations.md` | `/protocol/examples/fee-calculations` |
| `protocol/examples/event-parsing.md` | `/protocol/examples/event-parsing` |
| `protocol/examples/trust-bonding.md` | `/protocol/examples/trust-bonding` |

### Intuition SDK (`/intuition-sdk/`)
| File Path | Link Path |
|-----------|-----------|
| `intuition-sdk/installation-and-setup.md` | `/intuition-sdk/installation-and-setup` |
| `intuition-sdk/quick-start.md` | `/intuition-sdk/quick-start` |
| `intuition-sdk/atoms-guide.md` | `/intuition-sdk/atoms-guide` |
| `intuition-sdk/triples-guide.md` | `/intuition-sdk/triples-guide` |
| `intuition-sdk/vaults-guide.md` | `/intuition-sdk/vaults-guide` |
| `intuition-sdk/search-guide.md` | `/intuition-sdk/search-guide` |
| `intuition-sdk/migration-guide.mdx` | `/intuition-sdk/migration-guide` |

#### Examples (`/intuition-sdk/examples/`)
| File Path | Link Path |
|-----------|-----------|
| `intuition-sdk/examples/create-atom-from-string.md` | `/intuition-sdk/examples/create-atom-from-string` |
| `intuition-sdk/examples/create-triple-statement.md` | `/intuition-sdk/examples/create-triple-statement` |
| `intuition-sdk/examples/deposit-into-vault.md` | `/intuition-sdk/examples/deposit-into-vault` |
| `intuition-sdk/examples/batch-ethereum-accounts.md` | `/intuition-sdk/examples/batch-ethereum-accounts` |
| `intuition-sdk/examples/bulk-sync-cost-estimation.md` | `/intuition-sdk/examples/bulk-sync-cost-estimation` |
| `intuition-sdk/examples/find-existing-entities.md` | `/intuition-sdk/examples/find-existing-entities` |
| `intuition-sdk/examples/global-search.md` | `/intuition-sdk/examples/global-search` |
| `intuition-sdk/examples/thing-ipfs-pinning.md` | `/intuition-sdk/examples/thing-ipfs-pinning` |

#### Integrations (`/intuition-sdk/integrations/`)
| File Path | Link Path |
|-----------|-----------|
| `intuition-sdk/integrations/react.md` | `/intuition-sdk/integrations/react` |
| `intuition-sdk/integrations/tanstack-query.md` | `/intuition-sdk/integrations/tanstack-query` |
| `intuition-sdk/integrations/pinata-ipfs.md` | `/intuition-sdk/integrations/pinata-ipfs` |

### GraphQL API (`/graphql-api/`)
| File Path | Link Path |
|-----------|-----------|
| `graphql-api/overview.mdx` | `/graphql-api/overview` |
| `graphql-api/reads.mdx` | `/graphql-api/reads` |
| `graphql-api/writes.mdx` | `/graphql-api/writes` |
| `graphql-api/npm-package.mdx` | `/graphql-api/npm-package` |
| `graphql-api/custom-queries.mdx` | `/graphql-api/custom-queries` |
| `graphql-api/graphql-generator.mdx` | `/graphql-api/graphql-generator` |
| `graphql-api/migration-guide.mdx` | `/graphql-api/migration-guide` |

#### Getting Started (`/graphql-api/getting-started/`)
| File Path | Link Path |
|-----------|-----------|
| `graphql-api/getting-started/introduction.md` | `/graphql-api/getting-started/introduction` |
| `graphql-api/getting-started/client-setup.md` | `/graphql-api/getting-started/client-setup` |
| `graphql-api/getting-started/schema-reference.md` | `/graphql-api/getting-started/schema-reference` |

#### Queries (`/graphql-api/queries/`)
| File Path | Link Path |
|-----------|-----------|
| `graphql-api/queries/atoms/single-atom.md` | `/graphql-api/queries/atoms/single-atom` |
| `graphql-api/queries/atoms/list-filter.md` | `/graphql-api/queries/atoms/list-filter` |
| `graphql-api/queries/atoms/search.md` | `/graphql-api/queries/atoms/search` |
| `graphql-api/queries/atoms/with-vault.md` | `/graphql-api/queries/atoms/with-vault` |
| `graphql-api/queries/atoms/with-triples.md` | `/graphql-api/queries/atoms/with-triples` |
| `graphql-api/queries/triples/single-triple.md` | `/graphql-api/queries/triples/single-triple` |
| `graphql-api/queries/triples/filter-by-subject.md` | `/graphql-api/queries/triples/filter-by-subject` |
| `graphql-api/queries/triples/filter-by-predicate-object.md` | `/graphql-api/queries/triples/filter-by-predicate-object` |
| `graphql-api/queries/triples/counter-triples.md` | `/graphql-api/queries/triples/counter-triples` |
| `graphql-api/queries/triples/nested-queries.md` | `/graphql-api/queries/triples/nested-queries` |
| `graphql-api/queries/vaults/vault-details.md` | `/graphql-api/queries/vaults/vault-details` |
| `graphql-api/queries/vaults/user-positions.md` | `/graphql-api/queries/vaults/user-positions` |
| `graphql-api/queries/vaults/top-vaults.md` | `/graphql-api/queries/vaults/top-vaults` |
| `graphql-api/queries/vaults/deposits-redemptions.md` | `/graphql-api/queries/vaults/deposits-redemptions` |
| `graphql-api/queries/vaults/share-price-changes.md` | `/graphql-api/queries/vaults/share-price-changes` |
| `graphql-api/queries/advanced/pagination.md` | `/graphql-api/queries/advanced/pagination` |
| `graphql-api/queries/advanced/aggregations.md` | `/graphql-api/queries/advanced/aggregations` |
| `graphql-api/queries/advanced/time-series.md` | `/graphql-api/queries/advanced/time-series` |
| `graphql-api/queries/advanced/predicate-objects.md` | `/graphql-api/queries/advanced/predicate-objects` |
| `graphql-api/queries/advanced/database-functions.md` | `/graphql-api/queries/advanced/database-functions` |

#### Mutations (`/graphql-api/mutations/`)
| File Path | Link Path |
|-----------|-----------|
| `graphql-api/mutations/pin-thing.md` | `/graphql-api/mutations/pin-thing` |
| `graphql-api/mutations/pin-person.md` | `/graphql-api/mutations/pin-person` |
| `graphql-api/mutations/pin-organization.md` | `/graphql-api/mutations/pin-organization` |

#### Subscriptions (`/graphql-api/subscriptions/`)
| File Path | Link Path |
|-----------|-----------|
| `graphql-api/subscriptions/overview.md` | `/graphql-api/subscriptions/overview` |
| `graphql-api/subscriptions/price-updates.md` | `/graphql-api/subscriptions/price-updates` |
| `graphql-api/subscriptions/real-time-positions.md` | `/graphql-api/subscriptions/real-time-positions` |

#### Best Practices (`/graphql-api/best-practices/`)
| File Path | Link Path |
|-----------|-----------|
| `graphql-api/best-practices/pagination.md` | `/graphql-api/best-practices/pagination` |
| `graphql-api/best-practices/filtering.md` | `/graphql-api/best-practices/filtering` |
| `graphql-api/best-practices/performance.md` | `/graphql-api/best-practices/performance` |
| `graphql-api/best-practices/error-handling.md` | `/graphql-api/best-practices/error-handling` |
| `graphql-api/best-practices/fragments.md` | `/graphql-api/best-practices/fragments` |
| `graphql-api/best-practices/variables.md` | `/graphql-api/best-practices/variables` |
| `graphql-api/best-practices/subscriptions-vs-polling.md` | `/graphql-api/best-practices/subscriptions-vs-polling` |
| `graphql-api/best-practices/request-only-needed.md` | `/graphql-api/best-practices/request-only-needed` |
| `graphql-api/best-practices/pre-computed-stats.md` | `/graphql-api/best-practices/pre-computed-stats` |
| `graphql-api/best-practices/comparison-operators.md` | `/graphql-api/best-practices/comparison-operators` |
| `graphql-api/best-practices/database-functions.md` | `/graphql-api/best-practices/database-functions` |

#### Examples (`/graphql-api/examples/`)
| File Path | Link Path |
|-----------|-----------|
| `graphql-api/examples/atom-with-vault.md` | `/graphql-api/examples/atom-with-vault` |
| `graphql-api/examples/triples-pagination.md` | `/graphql-api/examples/triples-pagination` |
| `graphql-api/examples/user-positions.md` | `/graphql-api/examples/user-positions` |
| `graphql-api/examples/social-graph.md` | `/graphql-api/examples/social-graph` |
| `graphql-api/examples/trending-atoms.md` | `/graphql-api/examples/trending-atoms` |
| `graphql-api/examples/activity-feed.md` | `/graphql-api/examples/activity-feed` |
| `graphql-api/examples/price-history.md` | `/graphql-api/examples/price-history` |
| `graphql-api/examples/complex-filtering.md` | `/graphql-api/examples/complex-filtering` |
| `graphql-api/examples/subscriptions.md` | `/graphql-api/examples/subscriptions` |
| `graphql-api/examples/multi-language.md` | `/graphql-api/examples/multi-language` |

#### Use Cases (`/graphql-api/use-cases/`)
| File Path | Link Path |
|-----------|-----------|
| `graphql-api/use-cases/overview.mdx` | `/graphql-api/use-cases/overview` |

### Intuition Smart Contracts (`/intuition-smart-contracts/`)
| File Path | Link Path |
|-----------|-----------|
| `intuition-smart-contracts/index.md` | `/intuition-smart-contracts` |
| `intuition-smart-contracts/deployments.md` | `/intuition-smart-contracts/deployments` |
| `intuition-smart-contracts/multivault.md` | `/intuition-smart-contracts/multivault` |
| `intuition-smart-contracts/trust-bonding.md` | `/intuition-smart-contracts/trust-bonding` |
| `intuition-smart-contracts/configuration.md` | `/intuition-smart-contracts/configuration` |
| `intuition-smart-contracts/audit-reports.mdx` | `/intuition-smart-contracts/audit-reports` |

### Intuition Network (`/intuition-network/`)
| File Path | Link Path |
|-----------|-----------|
| `intuition-network/index.md` | `/intuition-network` |
| `intuition-network/mainnet.md` | `/intuition-network/mainnet` |
| `intuition-network/testnet.md` | `/intuition-network/testnet` |
| `intuition-network/rpc.md` | `/intuition-network/rpc` |
| `intuition-network/powered-by-caldera.md` | `/intuition-network/powered-by-caldera` |

### Intuition Node (`/intuition-node/`)
| File Path | Link Path |
|-----------|-----------|
| `intuition-node/overview.md` | `/intuition-node/overview` |
| `intuition-node/local-setup.md` | `/intuition-node/local-setup` |
| `intuition-node/kubernetes.md` | `/intuition-node/kubernetes` |
| `intuition-node/rust-backend.md` | `/intuition-node/rust-backend` |
| `intuition-node/run-an-intuition-node.md` | `/intuition-node/run-an-intuition-node` |

### Interaction Guide (`/interaction-guide/`)
| File Path | Link Path |
|-----------|-----------|
| `interaction-guide/overview.md` | `/interaction-guide/overview` |
| `interaction-guide/create-atom.md` | `/interaction-guide/create-atom` |
| `interaction-guide/create-triple.md` | `/interaction-guide/create-triple` |
| `interaction-guide/deposit-return.md` | `/interaction-guide/deposit-return` |
| `interaction-guide/retrieve-vault-details.md` | `/interaction-guide/retrieve-vault-details` |

### Tutorials (`/tutorials/`)
| File Path | Link Path |
|-----------|-----------|
| `tutorials/overview.md` | `/tutorials/overview` |
| `tutorials/curated-lists.md` | `/tutorials/curated-lists` |
| `tutorials/reputation-system.md` | `/tutorials/reputation-system` |
| `tutorials/social-attestations.md` | `/tutorials/social-attestations` |
| `tutorials/prediction-market.md` | `/tutorials/prediction-market` |
| `tutorials/fraud-detection.md` | `/tutorials/fraud-detection` |

#### Advanced (`/tutorials/advanced/`)
| File Path | Link Path |
|-----------|-----------|
| `tutorials/advanced/batch-operations.md` | `/tutorials/advanced/batch-operations` |
| `tutorials/advanced/nested-triples.md` | `/tutorials/advanced/nested-triples` |
| `tutorials/advanced/oracle-integration.md` | `/tutorials/advanced/oracle-integration` |

#### Queries (`/tutorials/queries/`)
| File Path | Link Path |
|-----------|-----------|
| `tutorials/queries/activity-feeds.mdx` | `/tutorials/queries/activity-feeds` |
| `tutorials/queries/related-claims.mdx` | `/tutorials/queries/related-claims` |
| `tutorials/queries/top-dapps.mdx` | `/tutorials/queries/top-dapps` |
| `tutorials/queries/trusted-accounts.mdx` | `/tutorials/queries/trusted-accounts` |

### Experimental Applications (`/experimental-applications/`)
| File Path | Link Path |
|-----------|-----------|
| `experimental-applications/data-populator.md` | `/experimental-applications/data-populator` |
| `experimental-applications/farcaster-frames.md` | `/experimental-applications/farcaster-frames` |
| `experimental-applications/mcp-server.md` | `/experimental-applications/mcp-server` |
| `experimental-applications/metamask-snap.md` | `/experimental-applications/metamask-snap` |

### Resources (`/resources/`)
| File Path | Link Path |
|-----------|-----------|
| `resources/index.mdx` | `/resources` |
| `resources/faq.md` | `/resources/faq` |
| `resources/glossary.md` | `/resources/glossary` |
| `resources/key-terms.mdx` | `/resources/key-terms` |
| `resources/community-and-support.md` | `/resources/community-and-support` |

---

## Common Link Issues to Check

1. **Double `/docs/` prefix**: Links should NOT include `/docs/` - just use the path from this reference
2. **Missing leading slash**: Internal links should start with `/`
3. **Case sensitivity**: Paths are case-sensitive (e.g., `Atoms` vs `atoms`)
4. **File extensions**: Do NOT include `.md` or `.mdx` in links
5. **Index files**: Link to the folder path, not `/index` (e.g., `/intuition-concepts/primitives` not `/intuition-concepts/primitives/index`)

---

*Generated for link verification purposes - delete after use*
