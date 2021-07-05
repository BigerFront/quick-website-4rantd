const CopyWebpackPlugin = require('copy-webpack-plugin');

const { TARGET_TYPE } = require('../../config');
const { R, dist } = require('../paths');

const copyPlugins = [
  new CopyWebpackPlugin({
    patterns: [
      {
        from: R('shared', 'js'),
        to: R(dist, TARGET_TYPE, 'shared/js'),
        force: true,
      },
      {
        from: R('shared', 'images'),
        to: R(dist, TARGET_TYPE, 'shared/images'),
        force: true,
      },
    ],
  }),
];

module.exports = copyPlugins;
