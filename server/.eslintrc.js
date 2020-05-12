module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'prettier',
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
  plugins: ['jest', 'prettier', 'react', '@typescript-eslint'],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'jest/no-identical-title': 0,
    'jest/no-disabled-tests': 0,
    'prefer-arrow-callback': 'error',
    'prettier/prettier': 'error',
    'space-before-function-paren': ['error', 'never'],
  },
}
