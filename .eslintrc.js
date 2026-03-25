module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['unused-imports'],
  env: {
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-console': ['error', {allow: ['warn', 'error']}],
    'no-debugger': 'error',
    'no-var': 'error',
    'prefer-const': ['error', {destructuring: 'all'}],
    eqeqeq: ['error', 'always', {null: 'ignore'}],
    curly: ['error', 'all'],
    'object-shorthand': ['error', 'always'],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'no-unused-vars': 'off',
    'no-duplicate-imports': 'error',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.{js,jsx}', '**/*.{test,spec}.{js,jsx}'],
      env: {
        jest: true,
      },
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: [
        'babel.config.js',
        'metro.config.js',
        'jest.config.js',
        'react-native.config.js',
      ],
      env: {
        node: true,
      },
    },
  ],
};
