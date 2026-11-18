---
title: "Build guides"
sidebar_label: "Build guides"
description: "Choose a guide to model identities, process atom data, prepare on-chain writes, query your Core node, or connect a React application."
kind: reference
reader: ["app"]
packages: []
---

Choose a guide for the part of your application you are building. You can model identities and inspect candidate atoms offline before choosing a network.

## Set up

- [Install and pin the packages](/docs/build/install) your project needs.
- [Connect to a network](/docs/build/connect) and verify the chain ID and deployed contract address.

## Model data

- [Derive IDs and IIDs](/docs/build/derive-ids) from your input and its chosen representation.
- [Build creation forms](/docs/build/creation-profiles) from the fields in a Creation Profile.
- [Suggest relationships and pick predicates](/docs/build/suggest-relationships) for an ordered triple.
- [Link identities with sameAs](/docs/build/link-identities) after reviewing the evidence that two atoms represent the same entity.

## Process atoms

- [Parse user input](/docs/build/parse-input) into candidates and inspect any warnings.
- [Classify and enrich atoms](/docs/build/classify-enrich) and trace where a field value came from.
- [Compose an atom runtime](/docs/build/atom-runtime) with local plugins, caches, and concurrency limits.

## Write on-chain

- [Create atoms](/docs/build/create-atoms) from exact bytes and check the creation receipt.
- [Create triples](/docs/build/create-triples) from three existing term IDs.
- [Deposit and redeem](/docs/build/deposit-redeem) with a quote for the chosen vault and curve.
- [Batch writes](/docs/build/batch-writes) when later transactions depend on newly created terms.
- [Route writes through the FeeProxy](/docs/build/fee-proxy) and review the required approvals and payments.
- [Build action plans and envelopes](/docs/build/action-plans) for a human to inspect before execution.

## Read the graph

- [Check the scope of SDK reads](/docs/build/read-with-sdk) when migrating an existing integration.
- [Query a Core node](/docs/build/query-core) you run to read indexed V2 atoms and relationships.

## Apps

- [Use React hooks](/docs/build/react) to connect wallet state, contract reads, and transaction feedback.
- [Test locally](/docs/build/test-locally) using your own development chain or a funded testnet account.
