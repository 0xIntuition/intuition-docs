---
title: "Atom classification"
sidebar_label: "Atom classification"
description: "Follow a plugin match through resolution and the canonical classification envelope. Decide which fields belong in a publishable representation."
kind: concept
reader: ["app", "plugin"]
packages: ["@0xintuition/atom-classification"]
depends_on: ["atom-parsing", "classifications"]
---

<AppliesTo />

Atom classification interprets an input using plugins. A classifier recognizes a pattern, such as a tagged term or a service URL. An eligible resolver can then describe the entity and the evidence for its type. A type match may tell you how to display an input while leaving the identity of a particular recording or artist unresolved.

**Builds on:** [Atom parsing](/docs/concepts/atom-parsing), [Classifications and Creation Profiles](/docs/concepts/classifications).

**Implemented by:** [@0xintuition/atom-classification](/docs/reference/packages/atom-classification).

## How it works

A classifier matches the input. The engine selects an eligible resolver for the match and execution mode. For a local resolver to run in `client-only` mode, declare its `executionMode` as `deterministic` and implement it with local data. Register any type the resolver emits. [Classification README](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-classification/README.md), [plugin authoring](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-classification/docs/plugin-authoring.md), [resolver eligibility](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-classification/src/engine.ts).

When resolution succeeds, `resolved.classifications` contains canonical envelopes. Each has a `type`, its `data`, and `meta` identifying the plugin, provider, and fetch time. `resolved.publishable` projects the fields eligible for publication. Identity fields are eligible by default, richer public fields depend on their source policy, and volatile fields stay out. The application still chooses the representation and whether to publish it. [Canonical output contract](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-classification/docs/canonical-output-contract.md).

## Example

The local plugin in [Write a classification plugin](/docs/core/classification-plugin) recognizes the prefix in `idea: semantic grounding`. Its classifier recognizes an idea with a nonempty name. Its deterministic resolver trims the text after the prefix and emits a registered `DefinedTerm` whose `data.name` is `semantic grounding`. An app can now show the term using the canonical result and inspect the publishable projection before preparing atom bytes.

Compare the title `One More Time` in the [catalog example](/docs/build/classify-enrich). The plain-text plugin can interpret it as a `Thing`. The title alone gives the app no basis for selecting a particular recording IID.

## Common mistakes

- Reading `resolved.atoms` as the canonical contract. That array is a compatibility projection. Read the canonical envelopes and their metadata when evaluating evidence.
- Assuming a matching classifier guarantees a usable resolver result. Check for a resolved envelope and a usable type before handing data to enrichment.
- Marking a resolver deterministic while it calls a provider. Keep network-dependent resolution in a suitable server mode.

## Next

[Enrichment](/docs/concepts/enrichment) uses classification and identifier hints to gather provider evidence. [Atom runtime and pipelines](/docs/concepts/atom-runtime) shows how to reuse engines and bound their work.
