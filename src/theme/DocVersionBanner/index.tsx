// Upgrade risk: DocVersionBanner is unsafe to swizzle in theme-classic 3.9.2.
// Created with --wrap --danger; review the original component on upgrades.
import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { ThemeClassNames } from '@docusaurus/theme-common';
import {
  useActiveDocContext,
  useDocsPreferredVersion,
  useDocsVersion,
  useVersions,
} from '@docusaurus/plugin-content-docs/client';
import DocVersionBanner from '@theme-original/DocVersionBanner';
import type DocVersionBannerType from '@theme/DocVersionBanner';
import type { WrapperProps } from '@docusaurus/types';
import equivalents from '@site/src/data/version-equivalents.json';
import { resolveVersionEquivalent } from '../versionEquivalents';
import './styles.css';

type Props = WrapperProps<typeof DocVersionBannerType>;

export default function DocVersionBannerWrapper(props: Props): ReactNode {
  const version = useDocsVersion();
  const versions = useVersions(version.pluginId);
  const { activeDoc } = useActiveDocContext(version.pluginId);
  const { savePreferredVersionName } = useDocsPreferredVersion(
    version.pluginId,
  );
  const { search, hash } = useLocation();

  if (version.version !== 'v1') return <DocVersionBanner {...props} />;

  const target = resolveVersionEquivalent({
    versions,
    pairs: equivalents.pairs,
    sourceVersion: version.version,
    targetVersion: 'current',
    docId: activeDoc?.id,
    search,
    hash,
  });

  return (
    <div
      className={clsx(
        props.className,
        ThemeClassNames.docs.docVersionBanner,
        'alert alert--warning margin-bottom--md',
      )}
    >
      You&apos;re reading the V1 docs. They cover the first generation of
      Intuition: the{' '}
      <a href="https://github.com/0xIntuition/intuition-ts">intuition-ts</a>{' '}
      packages and the{' '}
      <a href="https://github.com/0xIntuition/intuition-rs">intuition-rs</a>{' '}
      services. New development happens in V2.{' '}
      <Link to={target} onClick={() => savePreferredVersionName('current')}>
        Open the V2 docs
      </Link>
    </div>
  );
}
