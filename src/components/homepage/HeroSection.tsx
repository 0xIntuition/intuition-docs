import React from 'react';
import Link from '@docusaurus/Link';
import {
  ArrowRightFilled,
  AppsAddInRegular,
  DocumentRegular,
  DatabaseRegular,
  CodeRegular,
  ShareRegular,
  ServerRegular,
  DocumentTextRegular,
  CubeRegular,
} from '@fluentui/react-icons';
import clsx from 'clsx';

const MAIN_CARDS = [
  {
    title: 'Quick Start',
    link: '/docs/quickstart',
    icon: ArrowRightFilled,
    text: 'Get up and running with Intuition in minutes. Build your first app with our starter kits.',
  },
  {
    title: 'GraphQL API',
    link: '/docs/developer-tools/graphql-api/overview',
    icon: DatabaseRegular,
    text: 'Query the knowledge graph with our powerful GraphQL API.',
  },
  {
    title: 'SDK',
    link: '/docs/developer-tools/sdks/overview',
    icon: CodeRegular,
    text: 'TypeScript/JavaScript SDKs for seamless integration.',
  },
  {
    title: 'Intuition Network',
    link: '/docs/network/overview',
    icon: ShareRegular,
    text: 'Learn about the decentralized trust and reputation network.',
  },
];

const TECH_CARDS = [
  {
    title: 'Rust Subnet',
    link: '/docs/run-node/run-an-intuition-node',
    icon: ServerRegular,
    text: 'Dive into the Rust-based subnet infrastructure powering Intuition.',
  },
  {
    title: 'TS Monorepo',
    link: 'https://deepwiki.com/0xIntuition/intuition-ts',
    icon: DocumentTextRegular,
    text: 'Explore our TypeScript monorepo architecture and packages.',
  },
  {
    title: 'Smart Contracts',
    link: 'https://deepwiki.com/0xIntuition/intuition-contracts-v2',
    icon: CubeRegular,
    text: 'Deep dive into the Intuition smart contract architecture.',
  },
];

function SimpleCard({
  link,
  title,
  icon: Icon,
  text,
}: {
  link: string;
  title: string;
  icon: any;
  text: string;
}) {
  const isExternal = link.startsWith('http');
  const CardWrapper = isExternal ? 'a' : Link;
  const cardProps = isExternal
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : { to: link };

  return (
    <CardWrapper
      {...cardProps}
      className={clsx(
        'group relative block h-full w-full cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-2xl hover:no-underline',
        'dark:border-gray-800 dark:bg-[#1a1a1a] dark:shadow-xl dark:shadow-black/50',
      )}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 dark:opacity-100" />
      <div className="mb-4 flex items-center justify-center">
        <Icon className="h-10 w-10 text-primary transition-transform duration-200 group-hover:scale-110" />
      </div>
      <h3 className="mb-2 text-center font-jakarta text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200 group-hover:text-primary">
        {title}
      </h3>
      <p className="mb-0 text-center text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {text}
      </p>
    </CardWrapper>
  );
}

export default function HeroSection() {
  return (
    <div className="w-full py-20 px-4 bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl">
        {/* Hero Text Section */}
        <div className="mb-16 text-center">
          <h2 className="mb-6 font-jakarta text-5xl font-bold text-gray-900 dark:text-white lg:text-6xl">
            Give your project{' '}
            <span className="italic text-primary">Intuition</span>.
          </h2>
          <p className="mx-auto max-w-4xl text-lg text-gray-600 dark:text-gray-300 lg:text-xl">
            Gain plug‑and‑play verifiable data, decentralized identity, and
            reputation for your app: query or submit signed data in one call,
            skip building reputation layers, and earn token rewards whenever the
            data you publish is used.
          </p>
        </div>

        {/* Main Cards Grid - 4 cards */}
        <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MAIN_CARDS.map((card) => (
            <div key={card.title} className="h-full">
              <SimpleCard {...card} />
            </div>
          ))}
        </div>

        {/* Tech Deep Dive Section */}
        <div className="mt-20">
          <h3 className="mb-8 text-center font-jakarta text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
            Tech Deep Dive Docs
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TECH_CARDS.map((card) => (
              <div key={card.title} className="h-full">
                <SimpleCard {...card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
