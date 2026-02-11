import React from 'react';
import Link from '@docusaurus/Link';
import {
  AppsAddInRegular,
  ArrowRightFilled,
  CurrencyDollarEuroFilled,
  DocumentRegular,
  OpenRegular,
  RecordRegular,
  VideoRegular,
} from '@fluentui/react-icons';
import clsx from 'clsx';
import { ChevronRight, GitHub } from 'react-feather';

interface Guide {
  title: string;
  icon: any;
  text: string;
  link: string;
}

const guides: Guide[] = [
  {
    title: 'Creating an Application',
    icon: RecordRegular,
    text: 'Explore our repos and resource to get started building on Intuition.',
    link: '/docs/getting-started/overview',
  },
  {
    title: 'Integrate Your Existing Application with Intuition',
    icon: DocumentRegular,
    text: 'Learn how to integrate your existing application with Intuition using GraphQL.',
    link: '/docs/graphql-api/overview',
  },
  {
    title: 'Smart Contract Interactions',
    icon: AppsAddInRegular,
    text: 'Learn how to directly interact with Intuition smart contracts.',
    link: '/docs/intuition-smart-contracts',
  },
  {
    title: 'Primitives Overview',
    icon: CurrencyDollarEuroFilled,
    text: 'Learn about the core building blocks of Intuition: atoms, triples, and signals.',
    link: '/docs/intuition-concepts/primitives',
  },
];

interface Sample {
  title: string;
  platform?: string;
  source?: string;
  blog?: string;
  demo?: string;
}

const samples: Sample[] = [
  {
    title: 'Intuition TypeScript',
    platform: 'TypeScript',
    source: 'https://github.com/0xIntuition/intuition-ts',
    blog: '',
    demo: '',
  },
  {
    title: 'Intuition Rust',
    platform: 'Rust',
    source: 'https://github.com/0xIntuition/intuition-rs',
    blog: '',
    demo: '',
  },
  {
    title: 'Smart Contracts',
    platform: 'Solidity',
    source: 'https://github.com/0xIntuition/intuition-contracts-v2',
    blog: '',
    demo: '',
  },
];

function Guide({
  title,
  text,
  icon: Icon,
  link,
  index = 0,
}: (typeof guides)[0] & { index?: number }) {
  return (
    <Link
      to={link}
      className="guide-item group relative flex cursor-pointer items-start gap-3 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 text-inherit shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-x-1 hover:border-primary hover:shadow-2xl hover:no-underline dark:border-gray-800 dark:bg-[#1a1a1a] dark:shadow-xl dark:shadow-black/50"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="icon-glow relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
        <Icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
      </div>

      <div className="relative flex flex-1 flex-col">
        <h4 className="mb-1 font-semibold text-gray-900 transition-colors duration-300 group-hover:text-primary dark:text-white">
          {title}
        </h4>
        <p className="mb-0 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {text}
        </p>
      </div>

      <ChevronRight className="ml-auto h-5 w-5 self-center text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}

function Sample({
  title,
  platform,
  blog,
  source,
  demo,
  index = 0,
}: Sample & { index?: number }) {
  return (
    <div
      className="sample-item group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-md backdrop-blur-sm transition-all duration-300 hover:border-primary hover:shadow-2xl dark:border-gray-800 dark:bg-[#1a1a1a] dark:shadow-xl dark:shadow-black/50"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="relative flex flex-col">
        <h4 className="mb-1 font-semibold text-gray-900 transition-colors duration-300 group-hover:text-primary dark:text-white">
          {title}
        </h4>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {platform}
          </span>
        </div>
      </div>

      <div className="relative flex items-center gap-2.5">
        {blog && (
          <Link
            to={blog}
            className="rounded-lg p-2 text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-primary dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <DocumentRegular className="h-5 w-5" />
          </Link>
        )}

        {demo && (
          <Link
            to={demo}
            className="rounded-lg p-2 text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-primary dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <OpenRegular className="h-5 w-5" />
          </Link>
        )}

        {source && (
          <Link
            to={source}
            className="clone-btn group/btn flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-2 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-gray-700 dark:to-gray-600"
          >
            <GitHub className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-12" />
            <span>Clone</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function GuidesAndSamples() {
  return (
    <section className="guides-samples-section noise-bg no-underline-links relative overflow-hidden py-20">
      <div className="animated-gradient absolute inset-0 opacity-10" />

      <div className="relative mx-auto w-full max-w-7xl px-4">
        <div className="flex flex-col gap-16 md:flex-row md:gap-20">
          <div className="guides-container flex-1">
            <div className="section-header mb-8 flex items-center justify-between">
              <h3 className="m-0 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:to-gray-300">
                Popular how to guides
              </h3>

              {/*<Link
                to="/docs/introduction/overview"
                className="group flex items-center gap-1 font-jakarta text-sm font-semibold text-primary transition-colors hover:text-primary-600"
              >
                View more guides
                <ArrowRightFilled className="ml-1 transition-transform group-hover:translate-x-1" />
              </Link>*/}
            </div>

            <div className="guides-list flex flex-col gap-4">
              {guides.map((guide, index) => (
                <Guide {...guide} key={guide.title} index={index} />
              ))}
            </div>
          </div>

          <div
            className={clsx(
              'divider-line relative mx-8 block flex-shrink-0',
              'hidden w-px md:block',
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          </div>

          <div className="samples-container w-full md:max-w-sm">
            <div className="section-header mb-8 flex items-center justify-between">
              <h3 className="m-0 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:to-gray-300">
                Intuition Repositories
              </h3>

              <Link
                to="https://github.com/0xIntuition"
                className="group flex items-center gap-1 font-jakarta text-sm font-semibold text-primary transition-colors hover:text-primary-600"
              >
                View all repos
                <ArrowRightFilled className="ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="samples-list flex flex-col gap-4">
              {samples.map((sample, index) => (
                <Sample {...sample} key={sample.title} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
