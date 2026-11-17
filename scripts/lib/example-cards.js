'use strict';

const EXAMPLES_ROUTE = '/docs/examples';
const EXAMPLE_ROUTES = [
  'atom-creation-form',
  'predicate-picker',
  'identity-linking',
  'react-app',
  'core-query-api',
  'music-catalog',
].map((slug) => EXAMPLES_ROUTE + '/' + slug);

function readExampleGrid({ tree, source }) {
  const grids = tree.children.filter(
    (node) =>
      node.type === 'mdxJsxFlowElement' &&
      node.name === 'div' &&
      node.attributes.some(
        (attr) => attr.name === 'className' && attr.value === 'examples-grid',
      ),
  );
  if (!grids.length) return null; // Earlier phases have a prose landing.
  const [grid] = grids;
  if (grids.length !== 1 || grid.attributes.length !== 1)
    throw new Error('Expected one literal examples-grid wrapper');
  if (grid.children.length !== EXAMPLE_ROUTES.length)
    throw new Error('The examples grid needs exactly six Cards');
  const cards = grid.children.map((node, i) => {
    const { start, end } = node.position;
    if (
      node.type !== 'mdxJsxFlowElement' ||
      node.name !== 'Card' ||
      start.line !== end.line ||
      !source.slice(start.offset, end.offset).endsWith('/>')
    )
      throw new Error(
        'Expected a standalone self-closing Card in the examples grid',
      );
    const fields = new Map(
      node.attributes.map(({ name, value }) => [name, value]),
    );
    if (
      node.attributes.length !== 3 ||
      ['to', 'title', 'description'].some((key) => {
        const value = fields.get(key);
        return (
          typeof value !== 'string' || !value.trim() || /[\r\n]/.test(value)
        );
      })
    )
      throw new Error(
        'Example Cards require literal to, title and description attributes',
      );
    if (fields.get('to') !== EXAMPLE_ROUTES[i])
      throw new Error('Expected example Card destination ' + EXAMPLE_ROUTES[i]);
    return Object.fromEntries(fields);
  });
  return {
    cards,
    start: grid.position.start.offset,
    end: grid.position.end.offset,
  };
}

// JSX attribute entities are already decoded by the MDX parser. Encode text
// for its new Markdown context so a title or description cannot add markup.
function escapeMarkdownText(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/[\\`*_{}[\]~|]/g, '\\$&');
}

function renderExampleGrid(cards, resolve) {
  return cards
    .map(({ to, title, description }) => {
      const url = resolve(to);
      if (!url) throw new Error('Unresolved example Card destination ' + to);
      return `- [${escapeMarkdownText(title)}](${url}) — ${escapeMarkdownText(description)}`;
    })
    .join('\n');
}

module.exports = {
  EXAMPLES_ROUTE,
  EXAMPLE_ROUTES,
  readExampleGrid,
  renderExampleGrid,
};
