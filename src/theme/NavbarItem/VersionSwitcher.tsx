import React, {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import {
  useVersions,
  useActiveDocContext,
  useDocsPreferredVersion,
} from '@docusaurus/plugin-content-docs/client';
import equivalents from '@site/src/data/version-equivalents.json';
import { resolveVersionEquivalent } from '../versionEquivalents';
import styles from './VersionSwitcher.module.css';

type Props = {
  mobile?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export default function VersionSwitcher({
  mobile,
  className,
  onClick,
}: Props): ReactNode {
  const versions = useVersions('_data');
  const { activeVersion, activeDoc } = useActiveDocContext('_data');
  const { preferredVersion, savePreferredVersionName } =
    useDocsPreferredVersion('_data');
  const { pathname, search, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const items = ['current', 'v1'].flatMap((name) =>
    versions.filter((version) => version.name === name),
  );
  const displayed =
    items.find(
      (version) => activeDoc && version.name === activeVersion?.name,
    ) ??
    items.find((version) => version.name === preferredVersion?.name) ??
    items.find((version) => version.name === 'current') ??
    items[0];

  useEffect(() => setOpen(false), [pathname, search, hash]);
  useEffect(() => {
    if (mobile || !open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [mobile, open]);

  if (!displayed) return null;
  const currentState =
    activeDoc && activeVersion?.name === displayed.name ? 'page' : true;
  const links = items.map((version) => (
    <li key={version.name} className={mobile ? 'menu__list-item' : undefined}>
      <Link
        to={resolveVersionEquivalent({
          versions,
          pairs: equivalents.pairs,
          sourceVersion: activeVersion?.name ?? displayed.name,
          targetVersion: version.name,
          docId: activeDoc?.id,
          search,
          hash,
        })}
        className={clsx(styles.link, mobile ? 'menu__link' : 'dropdown__link')}
        aria-current={version.name === displayed.name ? currentState : undefined}
        onClick={(event) => {
          savePreferredVersionName(version.name);
          setOpen(false);
          onClick?.(event);
        }}
      >
        {version.label}
      </Link>
    </li>
  ));

  if (mobile)
    return (
      <li
        className={clsx('menu__list-item', styles.mobile, className)}
        data-docs-version-switcher="mobile"
      >
        <span className={styles.label}>Docs version</span>
        <ul className="menu__list" aria-label="Docs version">
          {links}
        </ul>
      </li>
    );

  return (
    <div
      ref={container}
      className={clsx('navbar__item dropdown', styles.switcher, className, {
        'dropdown--show': open,
      })}
      data-docs-version-switcher="desktop"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <button
        ref={toggle}
        type="button"
        className={clsx('navbar__link', styles.toggle)}
        aria-label={`Select docs version (current: ${displayed.label})`}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        {displayed.label}
      </button>
      <ul
        id={listId}
        className={clsx('dropdown__menu', styles.menu)}
        aria-label="Docs version"
        hidden={!open}
      >
        {links}
      </ul>
    </div>
  );
}
