module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'react/display-name': 0,
    'react/prop-types': 0,
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: 'React' }],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/ban-types': 0,
    'prefer-rest-params': 0,
  },
};
