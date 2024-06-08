module.exports = {
  'env': {
    'browser': true,
    'es2020': true,
  },
  'extends': [
    'plugin:react/recommended',
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 11,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    '@typescript-eslint',
  ],
  'rules': {
    "indent": "off",
    "comma-dangle": "off",
    "object-curly-spacing": "off",
    "require-jsdoc": "off",
    "quotes": "off",
    '@typescript-eslint/no-unused-vars': [
      'warn', // or "error"
      {
        'argsIgnorePattern': '^_*',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_*',
      },
    ],
  },
};
