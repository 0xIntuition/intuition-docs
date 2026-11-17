---
title: Contribute to the docs
sidebar_label: Contribute to the docs
description: Choose a documentation page, follow its template, verify the change locally and submit it for review.
kind: how-to
reader: ["app","agent","operator","plugin"]
packages: []
---

Propose a documentation change that a reviewer can reproduce and verify against the same source you used.

## Before you start

Check existing issues and pull requests for the problem. Fork the documentation repository and create a feature branch from its current `main`. From your checkout’s root, install the site and example dependencies with Node.js 22.21.0 and npm. [Documentation repository](https://github.com/0xIntuition/intuition-docs)

```bash
npm ci
npm ci --ignore-scripts --prefix examples/v2
```

## Steps

### 1. Identify the page and the evidence

Record the page URL, what you tried and what you expected to happen. For example, if a snippet differs from its linked TypeScript example, name the page, source file and command that reports the difference. For a package or Core behavior change, cite the file at the full commit that the docs cover. [Versions and release status](/docs/get-started/versions)

New behavior belongs in V2. Its source is under `docs/_data/` and its public routes start at `/docs`. For example, `docs/_data/community/ecosystem.md` supplies `/docs/community/ecosystem`. The archive at `_data_versioned_docs/version-v1/` supplies `/docs/v1` and is frozen. If you find an archive error, report it with the V1 URL so maintainers can determine whether an approved exception applies.

### 2. Use the page template

Choose a kind that fits the reader’s task. For a how-to, state the goal in one sentence, then use the headings **Before you start**, **Steps**, **Check the result** and **Related**, in that order. An optional **Troubleshooting** section follows **Check the result**. Give each step an action and describe something the reader can observe when it succeeds.

For a tutorial, show the estimated time and step count, then explain what the reader will build and how to run it. For a concept, follow a neighboring concept page’s structure and link its prerequisites. For a reference, organize the facts around what a reader needs to look up. Use a page of the same kind and section as your starting point.

Set `title`, `sidebar_label`, a description of up to 160 characters, `kind`, `reader` and `packages` in front matter. Write lists as single-line JSON arrays. For example, `reader: ["app"]` addresses application developers. Use `packages: []` when no specific package applies. Otherwise list the relevant manifest package names and place `<AppliesTo />` immediately after the front matter. Pages under `concepts/` also declare `depends_on`. The file path determines the route, and the title supplies the page heading.

### 3. Update the source and its navigation

Edit the Markdown source. When adding a page, add its document ID to the appropriate category in `sidebars.js` and link the page from its section landing. The ID for the ecosystem example is `community/ecosystem`. A correction on an existing route can keep its current navigation.

For a runnable TypeScript snippet, edit its named region in the strict project under `examples/v2/`. For example, the Create atoms guide uses the `create` region in `examples/v2/first-write/src/create-atoms-guide.ts`. After changing that region, copy its contents into the guide’s marked fence and check the match with these commands. [Create atoms](/docs/build/create-atoms)

```bash
node scripts/sync-example-snippets.js --write --file docs/_data/build/create-atoms.md
node scripts/sync-example-snippets.js --check --file docs/_data/build/create-atoms.md
```

### 4. Verify the change and submit it for review

Run the template, link and release checks from the repository root. If your change includes a runnable example, also run `npm run validate-sdk-examples -- --version v2`. Build the site from the edited source and run the type check.

```bash
npm run validate-v2-structure -- --templates
npm run validate-links
npm run check-release-pins
npm run build
npm run typecheck
```

Review your diff, commit the change with a descriptive `docs:` message, and push the branch to your fork. Open a pull request against `main`. Include the affected route, the original symptom, the expected result, your source evidence, and the commands you ran. That gives reviewers a way to repeat the check and discuss corrections.

## Check the result

The validators should exit successfully and the build should emit the edited page under `build/docs/`. For a snippet correction, the scoped sync check should report the verified region and the V2 example check should pass. A drift error gives the page and region to compare. Correct the source region, sync it again and rerun the failed check.

## Related

- [Ecosystem](/docs/community/ecosystem) illustrates a reference page with a file-derived route.
- [Core releases](/docs/core/releases) shows how to identify the Core source behind a change.
