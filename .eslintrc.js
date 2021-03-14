module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'consistent-return': 'off',
    'object-curly-newline': ['error', {
      ObjectPattern: { multiline: true, minProperties: 5 },
    }],
    'max-len': ['error', {
      code: 200,
    }],
    'no-unused-vars': 'off',
  },
};
