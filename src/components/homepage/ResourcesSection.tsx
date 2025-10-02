import Link from '@docusaurus/Link';
import React, { useState } from 'react';
import clsx from 'clsx';
import {
  ArrowRightFilled,
  ChevronLeftRegular,
  ChevronRightRegular,
} from '@fluentui/react-icons';

interface Resource {
  url: string;
  type: string;
  title: string;
  description: string;
  image: string;
  duration: string;
}

const ALL_RESOURCES: Resource[] = [
  {
    url: 'https://www.youtube.com/watch?v=jcmUvVZmUVk&ab_channel=0xbilly',
    type: 'video',
    title: 'Intuition Introduction',
    description:
      'An introduction to the core concepts and motivations behind Intuition.',
    image: '/img/intuition-intro.png',
    duration: '15 min',
  },
  {
    url: 'https://www.youtube.com/watch?v=Buc5TkuNi-0&ab_channel=ETHDenver',
    type: 'video',
    title: 'Towards a Trustful Interaction Layer',
    description:
      'Learn more about how we are building a trustful interaction layer for the decentralizedinternet on top of Intuition.',
    image: '/img/trustful-interaction.png',
    duration: '15 min',
  },
  {
    url: 'https://www.youtube.com/watch?v=VxypSHPIa44&ab_channel=ETHDenver',
    type: 'video',
    title: 'BREAKING: Devs Remix Frontend. What They Did May Surprise',
    description:
      'Welcome to the future of frontend development - Remix and Vite are the new hotness, and the foundation of many of our template apps.',
    image: '/img/remix-vite.png',
    duration: '20 min',
  },
  {
    url: 'https://www.youtube.com/embed/WZFyTnujeWc',
    type: 'video',
    title: 'Community Roundtable: Intro to Intuition from THP',
    description:
      'Community developer roundtable from The Hacking Project, a developer-led coding school building on Intuition.',
    image: '/img/thp-intro.png',
    duration: '40 min',
  },
];

function Resource({
  type,
  url,
  image,
  title,
  description,
  duration,
  index = 0,
}: Resource & { index?: number }) {
  return (
    <Link
      className="resource-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:no-underline dark:border-gray-800 dark:bg-[#1a1a1a] dark:shadow-xl dark:shadow-black/50"
      key={title}
      href={url}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
    >
      <div>
        <div className="image-container relative mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="aspect-video h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
          {type === 'video' && (
            <div className="play-button absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
              <svg
                className="h-8 w-8 translate-x-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
          <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {duration}
          </div>
        </div>
        <div className="px-4 pb-4">
          <h3 className="mb-2 font-semibold text-gray-900 transition-colors duration-300 group-hover:text-primary dark:text-white lg:text-xl">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
            {type}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors group-hover:text-primary dark:text-gray-400">
          {type === 'video' ? 'Watch' : 'Read'}
          <svg
            className="h-3 w-3 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function ResourcesSection() {
  const [page, setPage] = useState(1);
  const [activeType, setActiveType] = useState<'all' | 'blog' | 'video'>('all');

  const resources =
    activeType === 'all'
      ? ALL_RESOURCES
      : ALL_RESOURCES.filter((r) => r.type === activeType);

  const currentResources = resources.slice((page - 1) * 3, page * 3);
  const pages = Math.ceil(resources.length / 3);

  const nextPage = () => {
    if (page < pages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <section className="resources-section noise-bg no-underline-links relative my-20 overflow-hidden px-6">
      <div className="animated-gradient absolute inset-0 opacity-10" />

      <div className="relative mx-auto max-w-5xl">
        <div className="resources-header mb-12 flex items-center justify-between">
          <div>
            <span className="intuition-badge mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              RESOURCES
            </span>
            <h2 className="bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:via-primary-200 dark:to-white">
              Would you like to know more?
            </h2>
          </div>
          <Link
            to="https://intuition-systems.notion.site/108450d37d06808fbd43f863e3daca22?v=fff450d37d068106a163000c0a2bf4b4"
            className="group flex items-center font-jakarta text-sm font-semibold text-primary transition-colors hover:text-primary-600"
          >
            All Media
            <ArrowRightFilled className="ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="filter-buttons mb-8 flex gap-4 font-jakarta text-sm font-medium">
          <button
            className={clsx(
              'filter-btn relative overflow-hidden rounded-full px-6 py-2 transition-all duration-300 ease-in-out hover:scale-105',
              activeType === 'all'
                ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg'
                : 'border border-gray-200 bg-white/80 text-gray-600 backdrop-blur-sm hover:border-primary/50 hover:bg-gray-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700',
            )}
            onClick={() => setActiveType('all')}
          >
            <span className="relative z-10">All</span>
          </button>
          <button
            className={clsx(
              'filter-btn relative overflow-hidden rounded-full px-6 py-2 transition-all duration-300 ease-in-out hover:scale-105',
              activeType === 'blog'
                ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg'
                : 'border border-gray-200 bg-white/80 text-gray-600 backdrop-blur-sm hover:border-primary/50 hover:bg-gray-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700',
            )}
            onClick={() => setActiveType('blog')}
          >
            <span className="relative z-10">Blogs</span>
          </button>
          <button
            className={clsx(
              'filter-btn relative overflow-hidden rounded-full px-6 py-2 transition-all duration-300 ease-in-out hover:scale-105',
              activeType === 'video'
                ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg'
                : 'border border-gray-200 bg-white/80 text-gray-600 backdrop-blur-sm hover:border-primary/50 hover:bg-gray-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700',
            )}
            onClick={() => setActiveType('video')}
          >
            <span className="relative z-10">Videos</span>
          </button>
        </div>

        <div className="relative flex flex-col">
          <div className="resources-grid no-underline-links grid grid-cols-3 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {currentResources.map((resource, idx) => (
              <Resource {...resource} key={idx} index={idx} />
            ))}
          </div>

          <div className="pagination mt-12 flex items-center justify-center gap-4">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className={clsx(
                'pagination-btn flex h-12 w-12 items-center justify-center rounded-full border transition-all',
                page === 1
                  ? 'cursor-not-allowed border-gray-200 opacity-50'
                  : 'border-gray-200 bg-white hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg dark:border-gray-700 dark:bg-gray-800',
              )}
            >
              <ChevronLeftRegular className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={clsx(
                    'h-2 w-2 rounded-full transition-all',
                    page === i + 1
                      ? 'w-8 bg-primary'
                      : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600',
                  )}
                />
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={page === pages}
              className={clsx(
                'pagination-btn flex h-12 w-12 items-center justify-center rounded-full border transition-all',
                page === pages
                  ? 'cursor-not-allowed border-gray-200 opacity-50'
                  : 'border-gray-200 bg-white hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg dark:border-gray-700 dark:bg-gray-800',
              )}
            >
              <ChevronRightRegular className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
