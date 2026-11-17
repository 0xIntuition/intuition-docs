---
title: Docs for agents
sidebar_label: Docs for agents
description: Find the right versioned text bundle, fetch individual Markdown pages, and resolve their package pins and prerequisites.
kind: reference
reader: ["agent"]
packages: []
---

Start with the index for the documentation generation your project uses. V2 covers the current packages and Intuition Core. V1 covers the earlier TypeScript packages and Rust services.

## Choose a bundle

| What you need | V2 | V1 |
| --- | --- | --- |
| A directory of pages with Markdown links | [`/llms.txt`](https://docs.intuition.systems/llms.txt) | [`/docs/v1/llms.txt`](https://docs.intuition.systems/docs/v1/llms.txt) |
| Short page descriptions without code examples | [`/llms-medium.txt`](https://docs.intuition.systems/llms-medium.txt) | [`/docs/v1/llms-medium.txt`](https://docs.intuition.systems/docs/v1/llms-medium.txt) |
| Complete page text with code examples | [`/llms-full.txt`](https://docs.intuition.systems/llms-full.txt) | [`/docs/v1/llms-full.txt`](https://docs.intuition.systems/docs/v1/llms-full.txt) |

## Fetch one page

Remove any trailing slash and append `.md` to the canonical content route. For example, `/docs/get-started/quickstart` becomes `/docs/get-started/quickstart.md`. The version homes export to `/docs.md` and `/docs/v1.md`. Generated category indexes have no page export.

From an HTML document, read the absolute `href` on `<link rel="alternate" type="text/markdown">`. A legacy URL can return a client redirect page with HTTP 200. Follow its `rel="canonical"` link to the destination first, then use that page's Markdown alternate. Appending `.md` to the legacy redirect path can give a missing file.

## Read the YAML front matter

| Field | Meaning |
| --- | --- |
| `title`, `description` | Page title and summary. |
| `url`, `markdown_url` | Absolute canonical HTML and Markdown URLs for the same page. |
| `version` | Documentation generation, `V1` or `V2`. |
| `llms_index` | Absolute URL of this generation's index. |
| `kind`, `reader` | V2 page kind and intended audiences. |
| `packages` | V2 list of scoped package names with exact versions. An empty list means the page declares no packages. |
| `depends_on` | On pages in the V2 concepts section, absolute Markdown URLs for prerequisite concepts. An empty list starts a reading path. |

Use the version field to keep retrieved pages in the intended generation. For a V2 implementation, check the manifest for each package's public exports and source revision. [Release manifest](/intuition-release.json) · [Agent reading order](/docs/agents)
