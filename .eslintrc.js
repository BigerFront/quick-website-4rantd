
const parseOpts = {
  parser: '@typescript-eslint/parser',
  extends : [
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ]
};


module.exports = {
  parserOptions: { ecmaVersion: 6 },
  extends: 'react-app',
  globals: {},
};
