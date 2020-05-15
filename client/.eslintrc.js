module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:react/recommended',
    'standard',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['jest', 'react', '@typescript-eslint'],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'jest/no-identical-title': 0,
    'jest/no-disabled-tests': 0,
    'prefer-arrow-callback': 'error',
    'space-before-function-paren': ['error', 'never'],
  },
}
