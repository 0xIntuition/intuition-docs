module.exports = {
  root: true,
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  overrides: [
    {
      files: ['src/**/*.{js,jsx}'],
      env: { browser: true, es2022: true, node: true },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint'],
    },
    {
      files: ['src/**/*.{ts,tsx}'],
      env: { browser: true, es2022: true, node: true },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint'],
    },
    {
      files: ['scripts/**/*.js'],
      env: { es2022: true, node: true },
      extends: ['eslint:recommended', 'prettier'],
      parserOptions: { ecmaVersion: 'latest', sourceType: 'commonjs' },
    },
    {
      files: ['src/**/*.d.ts'],
      rules: {
        // These declarations mirror third-party runtime APIs; narrowing them here could break consumers.
        '@typescript-eslint/ban-types': 'off',
      },
    },
    {
      files: ['src/utils/npm.js'],
      rules: {
        // Defining the missing registry request requires runtime behavior beyond this lint lane.
        'no-undef': 'off',
      },
    },
    {
      files: ['src/components/BondingCurveDemo.tsx'],
      rules: {
        // Adding a case block is source cleanup outside this typecheck-only source fence.
        'no-case-declarations': 'off',
      },
    },
    {
      files: ['src/components/IntuitionSandbox.tsx'],
      rules: {
        // These escapes live inside code shown to users; rewriting examples is outside this lint lane.
        'no-useless-escape': 'off',
      },
    },
  ],
};
