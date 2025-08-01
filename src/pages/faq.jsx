import React, { useState } from 'react';
import Layout from '@theme/Layout';
import HomeFooter from '../components/homepage/HomeFooter';
import clsx from 'clsx';
import { useMemo } from 'react';
import { Minus, Plus, Search } from 'react-feather';
import { paramCase } from 'param-case';
import ReactMarkdown from 'react-markdown';

import FAQs from '../faq';
import { useEffect } from 'react';

// Define the three main categories
const CATEGORIES = {
  General: ['General', 'Getting Started', 'Community', 'Use Cases'],
  Technical: ['Development', 'Protocol', 'SDK', 'API', 'Smart Contracts'],
  Economic: ['Tokenomics', 'Staking', 'Rewards', 'Economics', 'Financial']
};

function Accordion({ title, children, open, onOpen, onClose }) {
  const headingId = paramCase(title);
  const panelId = headingId + '-panel';

  const handleOpen = () => {
    if (!open) {
      onOpen();
      history.pushState({}, '', '#' + headingId);
    } else {
      onClose();
      history.pushState({}, '', '');
    }
  };

  return (
    <div
      id={'parent-' + headingId}
      className={clsx(
        'intuition-accordion cursor-pointer border-0 border-solid last-of-type:border-0',
        open
          ? 'mb-4 rounded-2xl bg-secondary-800'
          : 'border-b border-zinc-300 dark:border-zinc-700',
      )}
      role="tab"
      aria-expanded={open}
      aria-controls={panelId}
    >
      {/* Summary */}
      <div
        role="heading"
        className={clsx(
          'flex w-full cursor-pointer select-none items-center justify-between gap-4 border-0 border-solid bg-transparent p-6',
          open && '!pb-0 text-primary dark:text-primary-100',
        )}
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
        id={headingId}
      >
        <h3 id={headingId} className="text-lg font-semibold">
          {title}
        </h3>
        <div className="text-zinc-300">
          <Minus
            className={clsx(
              'h-4 w-4 text-zinc-500 dark:text-zinc-300',
              !open && 'hidden',
            )}
          />
          <Plus
            className={clsx(
              'h-4 w-4 text-primary-100',
              open ? 'hidden' : 'block',
            )}
          />
        </div>
      </div>

      {/* Contents */}
      <div
        role="region"
        id={panelId}
        aria-labelledby={headingId}
        className={clsx(
          'accordion-content p-6 !pt-0',
          open ? 'block' : 'hidden',
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [activeFAQ, setActiveFAQ] = useState('');
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('General');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const faqId = window.location.hash.substring(1);

    if (faqId !== '') {
      setActiveFAQ(faqId);
      document.querySelector('#parent-' + faqId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, []);

  const filteredFAQs = useMemo(() => {
    if (query.trim() === '') {
      // Filter by active tab category
      const categoryTags = CATEGORIES[activeTab] || [];
      return FAQs.filter((faq) => 
        faq.tags && faq.tags.some(tag => categoryTags.includes(tag))
      );
    }

    // If there's a search query, search across all FAQs
    return FAQs.filter((faq) => {
      const str = faq.question + ' ' + faq.answer + ' ' + (faq.tags ? faq.tags.join(' ') : '');
      return str.toLowerCase().includes(query.toLowerCase());
    });
  }, [activeTab, query]);

  function TabButton({ category, label }) {
    return (
      <button
        className={clsx(
          'cursor-pointer rounded-md border-none px-6 py-3 font-jakarta text-sm font-medium transition-colors',
          activeTab === category
            ? 'bg-primary text-white'
            : 'bg-secondary-800 text-black hover:bg-secondary-700 dark:text-white dark:hover:bg-secondary-600',
        )}
        onClick={() => setActiveTab(category)}
      >
        {label}
      </button>
    );
  }

  return (
    <Layout
      title="FAQ Documentation"
      description="Find answers to frequently asked questions in Intuition's FAQ. Explore solutions and get answers to common questions."
      wrapperClassName="faq-page bg-secondary-1000"
      noFooter
    >
      {/* Hero? */}
      <section className="noise-bg px-6 py-24">
        <div className="mx-auto flex max-w-7xl flex-col place-items-center justify-center">
          <div className="font-semibold text-zinc-800 dark:text-zinc-300">
            Frequently Asked Questions
          </div>
          <div className="my-8 text-center text-4xl font-bold leading-tight text-zinc-800 dark:text-zinc-100 lg:text-6xl">
            <div>Any questions?</div>
            <div>We got you.</div>
          </div>
          <div className="relative flex w-full max-w-md items-center text-zinc-700 dark:text-white">
            <Search className="z-10 h-5 w-5 translate-x-1.5" />
            <input
              type="text"
              className="-ml-5 h-10 flex-1 rounded-md border border-solid border-zinc-200 bg-white px-3 pl-8 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-secondary-1000 dark:text-zinc-200"
              placeholder="Search your query...(sdk, api, write code)"
              value={query}
              onInput={(e) => setQuery(e.currentTarget.value)}
            />
          </div>
        </div>
      </section>

      <section className="mb-20 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {query.trim() !== '' ? (
            filteredFAQs.length === 0 ? (
              <div className="mb-12 text-2xl font-semibold">
                Sorry, no results matched your search terms
              </div>
            ) : (
              <div className="mb-12 text-xl font-semibold">
                Showing {filteredFAQs.length} results for &quot;{query}&quot;
              </div>
            )
          ) : (
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                <TabButton category="General" label="General" />
                <TabButton category="Technical" label="Technical" />
                <TabButton category="Economic" label="Economic" />
              </div>
            </div>
          )}

          {/* FAQs */}
          <div className="mt-12 flex flex-col gap-3">
            {filteredFAQs.map((faq) => {
              const id = paramCase(faq.question);
              return (
                <Accordion
                  title={faq.question}
                  tags={faq.tags || []}
                  key={faq.question}
                  open={activeFAQ === id}
                  onOpen={() => {
                    setActiveFAQ(id);
                  }}
                  onClose={() => {
                    setActiveFAQ('');
                  }}
                >
                  <ReactMarkdown>{faq.answer}</ReactMarkdown>
                </Accordion>
              );
            })}
          </div>
        </div>
      </section>

      <HomeFooter className="-mt-20 pt-32 pb-12" />
    </Layout>
  );
}
