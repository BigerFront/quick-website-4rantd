const { R, src } = require('../paths');

const entry = {
  main: R(src, 'Boot', 'index.js'),
};
const notHotReload = ['devtools'];

module.exports = {
  entry,
  notHotReload,
};
