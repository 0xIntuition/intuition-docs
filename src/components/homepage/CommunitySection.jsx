import React from 'react';
import Link from '@docusaurus/Link';
import {
  GitHub,
  MessageCircle,
  Twitter,
  Mail,
  BookOpen,
  HelpCircle,
  Video,
  FileText,
  Users,
  Zap,
  ExternalLink,
  ArrowRight,
  Code,
  Send
} from 'react-feather';
import { CodeRegular, DatabaseRegular } from '@fluentui/react-icons';

const supportChannels = [
  {
    title: 'Discord Community',
    description: 'Join our active community for real-time support and discussions',
    icon: MessageCircle,
    link: 'https://discord.gg/0xintuition',
    color: 'from-indigo-500 to-purple-600',
    external: true
  },
  {
    title: 'GitHub',
    description: 'Report issues, contribute code, and explore our repositories',
    icon: GitHub,
    link: 'https://github.com/0xintuition',
    color: 'from-gray-700 to-gray-900',
    external: true
  },
  {
    title: 'X / Twitter',
    description: 'Follow us for the latest updates and announcements',
    icon: Twitter,
    link: 'https://x.com/0xintuition',
    color: 'from-blue-400 to-blue-600',
    external: true
  },
  {
    title: 'Video Tutorials',
    description: 'Learn through step-by-step video guides',
    icon: Video,
    link: 'https://youtube.com/@0xIntuition',
    color: 'from-red-500 to-pink-600',
    external: true
  },
  {
    title: 'Forum',
    description: 'Join discussions and get help from the community',
    icon: Users,
    link: 'https://atlas.discourse.group',
    color: 'from-purple-500 to-indigo-600',
    external: true
  }
];

const quickLinks = [
  {
    title: 'Getting Started',
    description: 'Kits and repos to get started building',
    icon: Zap,
    link: '/docs/quickstart/intuition-kits'
  },
  {
    title: 'SDK',
    description: 'Getting started with our SDK',
    icon: CodeRegular,
    link: '/docs/developer-tools/sdks/overview'
  },
  {
    title: 'GraphQL API Reference',
    description: 'GraphQL API documentation',
    icon: DatabaseRegular,
    link: '/docs/developer-tools/graphql-api/overview'
  },
  {
    title: 'Video Tutorials',
    description: 'Learn through video walkthroughs',
    icon: Video,
    link: 'https://youtube.com/@0xIntuition'
  },
];

function SupportCard({ title, description, icon: Icon, link, color, external }) {
  const CardWrapper = external ? 'a' : Link;
  const cardProps = external
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : { to: link };

  return (
    <CardWrapper
      {...cardProps}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-gray-800 dark:bg-[#1a1a1a] dark:shadow-xl dark:shadow-black/50"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />

      <div className="relative z-10 flex items-start gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>

        <div className="flex-1">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            {title}
            {external && (
              <ExternalLink className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100" />
            )}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </CardWrapper>
  );
}

function QuickLinkCard({ title, description, icon: Icon, link }) {
  const isExternal = link.startsWith('http');
  const CardWrapper = isExternal ? 'a' : Link;
  const cardProps = isExternal
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : { to: link };

  return (
    <CardWrapper
      {...cardProps}
      className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm transition-all duration-200 hover:border-primary hover:bg-white hover:shadow-lg dark:border-gray-800 dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/30 dark:hover:border-primary"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </CardWrapper>
  );
}

export default function CommunitySection() {
  return (
    <section className="noise-bg relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="intuition-badge mb-4 inline-block">SUPPORT</span>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            We're Here to Help
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Get the support you need through our various channels. Our community and team are ready to assist you with any questions or challenges.
          </p>
        </div>

        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {supportChannels.map((channel) => (
            <SupportCard key={channel.title} {...channel} />
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-8 shadow-md dark:border-gray-800 dark:bg-[#1a1a1a] dark:from-[#1a1a1a] dark:to-[#1a1a1a] dark:shadow-xl dark:shadow-black/50">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Quick Resources
            </h3>
            <Link
              to="/docs/getting-started/overview"
              className="group flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-600"
            >
              View all docs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <QuickLinkCard key={link.title} {...link} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
