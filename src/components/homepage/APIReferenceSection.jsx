import React from 'react';
import Link from '@docusaurus/Link';
import { ArrowUpRight } from 'react-feather';
import Head from '@docusaurus/Head';
import ThemedImage from '@theme/ThemedImage';

export default function APIReferenceSection() {
  return (
    <section className="no-underline-links relative px-6 mb-32">
      <Head>
        <link rel="prefetch" href="/static/landing-page/api-ref-light.png" />
        <link rel="prefetch" href="/static/landing-page/api-ref-dark.png" />
      </Head>
      <div 
        className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-10 rounded-2xl bg-gradient-to-r from-black to-zinc-800 px-6 py-20 text-center text-white dark:from-zinc-100 dark:to-white dark:text-black lg:flex-row lg:p-20 lg:text-left"
        style={{
          position: 'relative',
        }}
      >
        <Link
          href="/graphql"
          aria-label="API Reference"
          target="_blank"
          className="absolute top-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-600/40 dark:bg-transparent"
        >
          <ArrowUpRight className="h-6 w-6 text-zinc-400 dark:text-black" />
        </Link>
        <div className="relative z-10 flex-1">
          <h2 className="text-4xl">GraphQL API Reference</h2>
          <p className="text-zinc-400">
            Easily read data from the Intuition knowledge graph using our GraphQL API. We've created a GraphQL playground and example queries to help you get started.
          </p>
          <Link
            href="/guides/graphql/quickstart"
            className="font-medium text-primary-100 dark:text-primary"
          >
            Get started with Intuition GraphQL &rarr;
          </Link>
          <ul className="mt-10 flex list-none flex-col gap-4 text-left lg:pl-0">
            <li className="flex flex-col gap-1">
              <Link
                href="/guides/graphql/quickstart"
                className="group font-jakarta font-semibold text-current"
              >
                Get all of the information about a given subject.
                <span className="ml-2 opacity-0 transition group-hover:translate-x-2 group-hover:opacity-100">
                  &rarr;
                </span>
              </Link>
              <div className="text-zinc-400">
                See all of a subject's claims made, and claims about about them.
              </div>
            </li>
            <li className="flex flex-col gap-1">
              <Link
                href="/guides/graphql/quickstart"
                className="group font-jakarta font-semibold text-current"
              >
                 Filter results by a user's connections.
                <span className="ml-2 opacity-0 transition group-hover:translate-x-2 group-hover:opacity-100">
                  &rarr;
                </span>
              </Link>
              <div className="text-zinc-400">
                Separate the signal from the noise by filtering results by a user's connections.
              </div>
            </li>
            <li className="flex flex-col gap-1">
              <Link
                href="/guides/graphql/quickstart"
                className="group font-jakarta font-semibold text-current"
              >
                Find collaborative 'lists of things'.
                <span className="ml-2 opacity-0 transition group-hover:translate-x-2 group-hover:opacity-100">
                  &rarr;
                </span>
              </Link>
              <div className="text-zinc-400">
                From book to movie, from song to artist, from recipe to restaurant, from product to review, and more.
              </div>
            </li>
          </ul>
        </div>
        <div className="relative z-10 flex flex-1 justify-end">
          <ThemedImage
            sources={{
              light: '/img/graphql-example.png',
              dark: '/img/graphql-example.png',
            }}
            alt="API Reference Preview"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
