---
title: Release notes
sidebar_label: Release notes
description: Locate package release records, Core source history, and project release notes.
kind: reference
reader: ["app","agent","operator","plugin"]
packages: []
---

## Find a library release

V2 names a documentation generation. Each of the 21 libraries it covers has its own npm version. To check which version a guide uses, look up the package by name in the version table. The pinned release plan lists these libraries in dependency order. [Versions and release status](/docs/get-started/versions) · [Package release plan](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/release-plan.json)

For the record behind a pin, find the package in the release manifest. Its `version` and `source` identify the documented code. Under `registry`, `npm` links to that specific published version, `gitHead` identifies its source commit and `publishedAt` dates the npm publication. The 21 package records are dated November 12, 2026. Documentation changes have their own publication timeline. [Release manifest](/intuition-release.json)

## Trace a change in Core

Core users fork the repository and build its services from source. Compare your checkout with the commit listed in the Core releases guide. The changelog at that commit separates unreleased changes from the earlier release candidate. A dated entry describes what shipped at that time. [Core releases](/docs/core/releases) · [Pinned Core changelog](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/CHANGELOG.md)

## Project release notes

The standalone project release-notes page currently contains an introduction. For a specific library version or Core change, use the package record or Core history above. [Project release notes](/release-notes)
