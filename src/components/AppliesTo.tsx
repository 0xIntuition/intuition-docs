import React from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import manifest from '@site/static/intuition-release.json';
import styles from './AppliesTo.module.css';

type Release = {
  status: string;
  packages: ReadonlyArray<{ name: string; version: string }>;
};

export function AppliesToLine({
  packages,
  release,
}: {
  packages: readonly string[];
  release: Release;
}) {
  if (!packages.length) return null;
  const versions = new Map(
    release.packages.map((pkg) => [pkg.name, pkg.version]),
  );

  return (
    <p className={styles.appliesTo} data-applies-to="V2">
      Applies to V2
      {packages.map((name) => {
        const version = versions.get(name);
        if (!version) throw new Error(`Unknown AppliesTo package: ${name}`);
        return (
          <React.Fragment key={name}>
            {' · '}
            <span className={styles.package}>
              <code>{name}</code>{' '}
              <span className={styles.version}>{version}</span>
            </span>
          </React.Fragment>
        );
      })}
      {release.status.includes('alpha') ? ' · pre-release' : ''}
    </p>
  );
}

export default function AppliesTo() {
  const { frontMatter } = useDoc();
  const packageNames = (frontMatter as { packages?: string[] }).packages;
  const packages = Array.isArray(packageNames) ? packageNames : [];
  return <AppliesToLine packages={packages} release={manifest} />;
}
