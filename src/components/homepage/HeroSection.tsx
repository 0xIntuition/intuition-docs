import React from 'react';
import Link from '@docusaurus/Link';
import {
  ChatMultipleRegular,
  LiveRegular,
  CurrencyDollarEuroFilled,
  PersonStarburstRegular,
} from '@fluentui/react-icons';
import ThemedImage from '@theme/ThemedImage';
import clsx from 'clsx';

const PRODUCTS = [
  {
    title: 'Build Personalized Experiences',
    link: '/guides/overview/the-primitives',
    icon: PersonStarburstRegular,
    lightImage: '/img/hero1.png',
    darkImage: '/img/hero1.png',
    text: "Create truly adaptive products by tapping into Intuition's open knowledge graph. Query on-chain attestations, preferences, and reputations to let your app—or AI agent—respond to each user's context in real time, delivering uniquely personal flows and recommendations.",
  },
  {
    title: 'Get Paid for Your Data',
    link: '/guides/overview/the-economics',
    icon: CurrencyDollarEuroFilled,
    lightImage: '/img/hero2.png',
    darkImage: '/img/hero2.png',
    text: "Publish verifiable claims to Intuition, stake $TRUST, and earn protocol rewards whenever your data powers searches, AI answers, or downstream apps. Your contributions remain yours—now they generate ongoing yield.",
  },
  {
    title: 'Find the Information You Need',
    link: '/guides/graphql/quickstart',
    icon: LiveRegular,
    lightImage: '/img/hero3.png',
    darkImage: '/img/hero3.png',
    text: "Intuition weaves scattered facts into a cryptographically trusted Web of Trust, so humans and machines can instantly surface authoritative answers, complete with provenance trails and reputation scores for any subject.",
  },
  {
    title: 'Explore Bonding Curves',
    link: '/guides/overview/the-economics/bonding-curves',
    icon: CurrencyDollarEuroFilled,
    lightImage: '/img/hero2.png',
    darkImage: '/img/hero2.png',
    text: "Discover how bonding curves create dynamic pricing mechanisms that automatically adjust based on supply and demand. Learn about automated market making and economic incentives.",
  },
];

function HeroProduct({
  link,
  title,
  icon: Icon,
  text,
  lightImage,
  darkImage,
}: (typeof PRODUCTS)[0]) {
  return (
    <Link
      to={link}
      style={{
        borderWidth: '1px',
        height: '100%',
      }}
      className={clsx(
        'group cursor-pointer overflow-clip rounded-3xl from-primary/30 via-transparent to-transparent text-black transition-all hover:bg-gradient-to-tr hover:text-primary hover:no-underline dark:text-white',
        'w-full border-secondary-700 bg-secondary-900 hover:!border-primary dark:border-secondary-800',
      )}
    >
      <div className="p-6 !pb-0">
        <h3 className="mb-3 flex items-center gap-3 font-jakarta text-lg font-semibold group-hover:text-primary">
          <Icon className="h-6 w-6" />
          <div>
            {title}
            {/* {beta && <span className="font-normal text-text-400"> (Beta)</span>} */}
          </div>
        </h3>
        <p className="mb-0 text-sm leading-relaxed text-zinc-400">{text}</p>
      </div>
      <div className="flex justify-end px-6 pt-6">
        <ThemedImage
          sources={{
            light: lightImage,
            dark: darkImage,
          }}
          alt={title}
          className="w-1/2 transition-transform group-hover:scale-110"
        />
      </div>
    </Link>
  );
}

export default function HeroSection() {
  return (
    <div className="noise-bg w-full py-20 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Hero Text Section */}
        <div className="text-center mb-16">
          <h2 className="mb-6 font-jakarta text-5xl lg:text-6xl font-bold">
            Give your project <span className="italic">Intuition</span>.
          </h2>
          <p className="text-lg lg:text-xl text-text-400 max-w-4xl mx-auto">
            Gain plug‑and‑play verifiable data, decentralized identity, and reputation for your app: query or submit signed data in one call, skip building reputation layers, and earn token rewards whenever the data you publish is used.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => (
            <div key={product.title} className="h-full">
              <HeroProduct {...product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
