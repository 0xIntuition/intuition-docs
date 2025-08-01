import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import { Linkedin, Youtube, Github } from '@styled-icons/boxicons-logos';
import { XIcon } from '@site/src/icons';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ThemedImage from '@theme/ThemedImage';

const overview = [
  { name: 'Overview', href: '/guides/overview' },
  { name: 'Why Intuition?', href: '/guides/overview/why-intuition' },
];

const products = [
  {
    name: 'Launchpad',
    href: 'https://launchpad.intuition.systems/',
  },
  {
    name: 'Portal',
    href: 'https://portal.intuition.systems/',
  },
  {
    name: 'Data Uploader',
    href: 'https://upload.intuition.systems/',
  },
  {
    name: 'Ecosystem Map',
    href: 'https://ecosystems.intuition.systems/',
  },
];

const developers = [
  {
    name: 'Guides',
    href: '/guides',
  },
  {
    name: 'Create Intuition App',
    href: '/guides/quickstart/create-intuition-app',
  },
  {
    name: 'GraphQL Queries',
    href: '/graphql',
  },
  {
    name: 'Smart Contracts',
    href: '/guides/smart-contracts/',
  },
  {
    name: 'AI Integration',
    href: '/guides/intuition-ai/intro',
  },
  {
    name: 'Primitives',
    href: '/guides/primitives/atoms',
  },
  {
    name: 'Architecture',
    href: '/guides/smart-contracts/architecture',
  },
];

const community = [
  { name: 'X / Twitter', href: 'https://x.com/0xintuition' },
  { name: 'Medium', href: 'https://medium.com/0xintuition' },
  { name: 'Discord', href: 'https://discord.gg/RgBenkX4mx' },
  { name: 'Telegram', href: 'https://t.me/intuitionsystems' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/0xintuition' },
  { name: 'Farcaster', href: 'https://warpcast.com/intuition' },
];

function Safety({ className }) {
  return (
    <div
      className={clsx(
        'flex max-w-[418px] flex-row overflow-clip rounded-2xl bg-white dark:bg-[#474747] sm:flex-col sm:pr-0 sm:pb-8 lg:flex-row lg:pr-16 lg:pb-0',
        className,
      )}
    >
      <div className="flex flex-1 place-items-center justify-center rounded-2xl bg-white px-4 py-6 font-jakarta font-bold text-gray-500 dark:bg-[#474747] dark:text-[#fff]">
        Your Security,
        <br />
        Our Priority.
      </div>
      <div className="flex flex-1 items-center justify-around px-6">
        <img src="/img/soc-compliant-1.png" alt="SOC Compliant" />
        <img src="/img/vector.png" alt="HIPAA Compliant" />
        <img
          style={{ width: '62px' }}
          src="/img/gdpr_docs.png"
          alt="GDPR compliant"
        />
      </div>
    </div>
  );
}

function Links({ name, links, isAccordion }) {
  //To control accordion in footer
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (href) => {
    setActiveAccordion((prevAccordion) =>
      prevAccordion === href ? null : href,
    );
  };

  return (
    <div>
      <h3 className="font-jakarta text-base font-semibold uppercase text-gray-400 dark:text-[#fff]">
        {name}
      </h3>
      <div className="flex flex-col gap-3">
        {links.map(({ name, href, isAccordion, content }) => (
          <Link
            href={href}
            className="text-base text-gray-700 hover:text-primary hover:no-underline dark:text-[#f9f9f9]"
            onClick={() => (isAccordion ? toggleAccordion(href) : null)}
          >
            {name}
            {isAccordion && activeAccordion === href && (
              <ul style={{ paddingLeft: '1rem', listStyle: 'unset' }}>
                {content.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-base text-gray-700 hover:text-primary hover:no-underline dark:text-[#f9f9f9]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#F4F7FF] dark:bg-[#191919]">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col px-6 py-12">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <ThemedImage
            alt="Intuition"
            className="h-9 w-fit lg:h-12"
            sources={{
              light: '/logo/intuition_dark_logo.svg',
              dark: '/logo/intuition.svg',
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 gap-y-12 md:justify-between lg:flex lg:flex-wrap">
          <Links name="Overview" links={overview} />
          <Links name="Products" links={products} />
          <Links name="Developers" links={developers} />
          <Links name="Community" links={community} />
        </div>

        <hr className="my-12 !bg-gray-300 dark:!bg-[#999]" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
            <span className="text-inherit dark:text-[#999]">
              &copy; {new Date().getFullYear()} Intuition Systems Inc.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/0xintuition"
              aria-label="Intuition's GitHub Organization"
            >
              <Github className="h-7 w-7 text-zinc-400 hover:text-primary" />
            </Link>
            <Link
              href="https://linkedin.com/company/0xintuition"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-7 w-7 text-zinc-400 hover:text-primary" />
            </Link>
            <Link href="https://twitter.com/0xintuition" aria-label="Twitter">
              <XIcon className="h-7 w-7 text-zinc-400 hover:text-primary" />
            </Link>
            <Link
              href="https://youtube.com/@0xIntuition"
              aria-label="Intuition YouTube Channel"
            >
              <Youtube className="h-7 w-7 text-zinc-400 hover:text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
