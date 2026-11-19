const path = require('path');
const postcss = require('postcss');

// The onboarding film at the root, copied from Learn, is styled with
// Tailwind 4; the docs keep Tailwind 3. Each stylesheet goes through its own.
const LEARN = path.join(__dirname, '..', 'src', 'learn') + path.sep;

const docs = postcss([
  require('postcss-import'),
  require('tailwindcss/nesting'),
  require('tailwindcss'),
  require('autoprefixer'),
]);
const learn = postcss([require('@tailwindcss/postcss')()]);

const tailwinds = {
  postcssPlugin: 'tailwinds',
  async Once(root, { result }) {
    const from = result.opts.from ?? '';
    const processed = await (from.startsWith(LEARN) ? learn : docs).process(
      root,
      { ...result.opts, from },
    );
    if (processed.root !== root) {
      root.removeAll();
      root.append(processed.root.nodes);
    }
    result.messages.push(...processed.messages);
  },
};

function tailwindPlugin(context, options) {
  return {
    name: 'tailwind-plugin',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins = [tailwinds];
      return postcssOptions;
    },
  };
}

module.exports = tailwindPlugin;
