// Preference order follows the documentation tree, not a release phase number.
const positions = [
  {
    name: 'Architecture',
    targets: ['/docs/get-started/how-it-fits'],
    fallback: '/docs/v1/intuition-concepts/architecture',
  },
  {
    name: 'Primitives',
    targets: ['/docs/concepts'],
    fallback: '/docs/v1/intuition-concepts/primitives',
  },
  {
    name: 'Smart Contracts',
    targets: ['/docs/reference/contracts', '/docs/reference/packages/protocol'],
    fallback: '/docs/v1/intuition-smart-contracts',
  },
  {
    name: 'GraphQL API',
    targets: [],
    fallback: '/docs/v1/graphql-api/overview',
  },
  {
    name: 'SDK',
    targets: ['/docs/reference/packages/sdk'],
    fallback: '/docs/v1/intuition-sdk/installation-and-setup',
  },
  {
    name: 'AI Integration',
    targets: ['/docs/agents', '/docs/agents/skills'],
  },
];

export function getDeveloperLinks(shippedRoutes) {
  // Native Docusaurus paths retain section-index slashes even when emitted
  // links use trailingSlash:false. Compare their canonical route forms.
  const routes = new Set(
    shippedRoutes.map((route) => route.replace(/\/+$/, '') || '/'),
  );
  return positions.map(({ name, targets, fallback }) => {
    const currentTarget = targets.find((route) => routes.has(route));
    // The skills page is required in the initial current tree. Let the build's
    // broken-link check reject a missing page rather than silently hiding it.
    if (!fallback) return { name, href: currentTarget ?? targets.at(-1) };
    return currentTarget
      ? { name, href: currentTarget }
      : { name: `${name} (V1)`, href: fallback };
  });
}
