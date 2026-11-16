/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  docs: [
    'index',
    {
      type: 'category',
      label: 'AI agents',
      items: ['agents/skills'],
    },
    {
      type: 'category',
      label: 'Community',
      link: { type: 'doc', id: 'community/index' },
      items: [],
    },
  ],
};
