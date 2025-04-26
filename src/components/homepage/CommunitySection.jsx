import React from 'react';
import Link from '@docusaurus/Link';

const socialLinks = [
  {
    name: 'Discord',
    handle: '0xintuition',
    icon: '🎮',
    link: 'https://discord.gg/RgBenkX4mx',
  },
  {
    name: 'Telegram',
    handle: 't.me/intuitionsystems',
    icon: '✈️',
    link: 'https://t.me/intuitionsystems',
  },
  {
    name: 'Twitter',
    handle: '0xintuition',
    icon: '🐦',
    link: 'https://twitter.com/0xintuition',
  },
  {
    name: 'Medium',
    handle: '0xintuition',
    icon: '📝',
    link: 'https://medium.com/0xintuition',
  },
  {
    name: 'LinkedIn',
    handle: '0xintuition',
    icon: '💼',
    link: 'https://linkedin.com/company/0xintuition',
  },
  {
    name: 'Guild',
    handle: 'Intuition',
    icon: '🏰',
    link: 'https://guild.xyz/intuition',
  },
  {
    name: 'Mirror',
    handle: 'Intuition',
    icon: '🪞',
    link: 'https://mirror.xyz/intuition',
  },
  {
    name: 'Warpcast',
    handle: 'Intuition',
    icon: 'W',
    link: 'https://warpcast.com/intuition',
  },
];

export default function CommunitySection() {
  return (
    <section className="no-underline-links">
      <div className="mx-auto flex w-full flex-col items-center justify-center bg-gradient-to-b from-zinc-200/90 to-white px-4 py-16 pt-32 pb-32 text-zinc-700 dark:from-[#262626] dark:to-black dark:text-white">
        <h2 className="text-3xl mb-10">
          Join the <span className="text-primary-100">community</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl w-full">
          {socialLinks.map((platform) => (
            <Link
              key={platform.name}
              href={platform.link}
              className="no-underline group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-start gap-4 rounded-lg border border-zinc-700/10 bg-zinc-900 px-4 pt-4 transition-colors hover:border-zinc-700/30 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:hover:border-zinc-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700/20 text-2xl">
                  {platform.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{platform.name}</h3>
                  <p className="text-sm text-zinc-400">{platform.handle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
