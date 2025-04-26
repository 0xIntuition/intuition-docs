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
    image:
      '/img/intuition-intro.png',
    duration: '15 min',
  },
  {
    url: 'https://www.youtube.com/watch?v=Buc5TkuNi-0&ab_channel=ETHDenver',
    type: 'video',
    title: 'Towards a Trustful Interaction Layer',
    description:
      'Learn more about how we are building a trustful interaction layer for the decentralizedinternet on top of Intuition.',
    image:
      '/img/trustful-interaction.png',
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
      "Community developer roundtable from The Hacking Project, a developer-led coding school building on Intuition.",
    image:
      '/img/thp-intro.png',
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
}: Resource) {
  return (
    <Link
      className="group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
      key={title}
      href={url}
    >
      <div>
        <div className="mb-4 overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-md">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="aspect-video h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <h3 className="mb-2 font-semibold text-black transition-colors group-hover:text-primary dark:text-white dark:group-hover:text-primary-100 lg:text-xl">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {`${duration} ${type === 'Video' ? 'watch' : 'read'}`}
        </div>
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
    <section className="no-underline-links my-20 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <span className="intuition-badge mb-4 inline-block">RESOURCES</span>
            <h2 className="text-4xl font-bold">Would you like to know more?</h2>
          </div>
          <Link
            to="https://intuition-systems.notion.site/108450d37d06808fbd43f863e3daca22?v=fff450d37d068106a163000c0a2bf4b4"
            className="group flex items-center font-jakarta text-sm font-semibold text-primary transition-colors hover:text-primary-600"
          >
            All Media 
            <ArrowRightFilled className="ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mb-8 flex gap-4 font-jakarta text-sm font-medium">
          <button
            className={clsx(
              'rounded-full px-6 py-2 transition-all duration-300 ease-in-out hover:scale-105',
              activeType === 'all'
                ? 'bg-primary text-white shadow-lg hover:bg-primary-600'
                : 'text-gray-600 hover:bg-gray-100 hover:shadow-md dark:text-gray-300 dark:hover:bg-gray-800',
            )}
            onClick={() => setActiveType('all')}
          >
            All
          </button>
          <button
            className={clsx(
              'rounded-full px-6 py-2 transition-all duration-300 ease-in-out hover:scale-105',
              activeType === 'blog'
                ? 'bg-primary text-white shadow-lg hover:bg-primary-600'
                : 'text-gray-600 hover:bg-gray-100 hover:shadow-md dark:text-gray-300 dark:hover:bg-gray-800',
            )}
            onClick={() => setActiveType('blog')}
          >
            Blogs
          </button>
          <button
            className={clsx(
              'rounded-full px-6 py-2 transition-all duration-300 ease-in-out hover:scale-105',
              activeType === 'video'
                ? 'bg-primary text-white shadow-lg hover:bg-primary-600'
                : 'text-gray-600 hover:bg-gray-100 hover:shadow-md dark:text-gray-300 dark:hover:bg-gray-800',
            )}
            onClick={() => setActiveType('video')}
          >
            Videos
          </button>
        </div>

        <div className="relative flex flex-col">
          <div className="no-underline-links grid grid-cols-3 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {currentResources.map((resource, idx) => (
              <Resource {...resource} key={idx} />
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className={clsx(
                'flex h-10 w-10 items-center justify-center rounded-full transition-all',
                page === 1
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <ChevronLeftRegular className="h-5 w-5" />
            </button>

            <button
              onClick={nextPage}
              disabled={page === pages}
              className={clsx(
                'flex h-10 w-10 items-center justify-center rounded-full transition-all',
                page === pages
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
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
