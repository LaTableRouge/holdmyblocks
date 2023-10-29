module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard', 'eslint:recommended', 'plugin:react/recommended'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module',
  },
  globals: {
    wp: true,
    jQuery: true,
    block_params: true,
    plugin_params: true
  },
  plugins: [
    'unused-imports',
    'simple-import-sort'
  ],
  rules: {
    'object-shorthand': 0,
    'space-before-function-paren': 'off',
    'comma-dangle': ['error', 'only-multiline'],
    'generator-star-spacing': ['error', { before: false, after: true }],
    'unused-imports/no-unused-imports': 'warn',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'no-console': 'warn',
    'operator-linebreak': ['error', 'before']
  }
}
