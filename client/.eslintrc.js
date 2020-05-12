module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    'jest/globals': true,
    node: true,
  },
  extends: [
    'prettier',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'standard',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
  },

  plugins: ['jest', 'prettier', 'react'],
  rules: {
    'react/prop-types': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'prettier/prettier': 'error',
    'space-before-function-paren': ['error', 'never'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
