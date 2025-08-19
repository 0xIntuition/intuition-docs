import React from 'react';
import clsx from 'clsx';
import {
  NavbarSecondaryMenuFiller,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import DocSidebarItems from '@theme/DocSidebarItems';
import Link from '@docusaurus/Link';

import SidebarMenu from '../../../components/SidebarMenu';

// Navigation items for mobile
const navigationItems = [
  { label: 'Guides', to: '/guides' },
  { label: 'Intuition Hub', to: '/guides/hub' },
  { label: 'Developer Tools', to: '/guides/developer-tools' },
];

const DocSidebarMobileSecondaryMenu = ({ sidebar, path }) => {
  const mobileSidebar = useNavbarMobileSidebar();
  
  return (
    <div>
      {/* Main navigation items */}
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>
        {navigationItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="menu__link"
            onClick={() => mobileSidebar.toggle()}
            style={{
              display: 'block',
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--ifm-color-emphasis-800)',
              backgroundColor: 'transparent',
              border: '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
      
      {/* Document sidebar items if available */}
      {sidebar && (
        <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
          <SidebarMenu />
          <DocSidebarItems
            items={sidebar}
            activePath={path}
            onItemClick={(item) => {
              // Mobile sidebar should only be closed if the category has a link
              if (item.type === 'category' && item.href) {
                mobileSidebar.toggle();
              }
              if (item.type === 'link') {
                mobileSidebar.toggle();
              }
            }}
            level={1}
          />
        </ul>
      )}
    </div>
  );
};

function DocSidebarMobile(props) {
  return (
    <NavbarSecondaryMenuFiller
      component={DocSidebarMobileSecondaryMenu}
      props={props}
    />
  );
}
export default React.memo(DocSidebarMobile);
