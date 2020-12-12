module.exports = {
  'env': {
    'commonjs': true,
    'node': true,
  },
  'extends': [
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 12,
  },
  'ignorePatterns': ['dist', 'example_custom_code'],
  'rules': {
    'guard-for-in': 'off',
    'max-len': 'off',
    'object-curly-spacing': ['error', 'always'],
    'one-var': 'off',
  },
};
