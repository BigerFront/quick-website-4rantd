const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const definePlugins = require('./webpack/eject-env-plugins');
const { context, R, src } = require('./paths');
const envWrapper = require('../config');

const { alias, fileExtensions } = require('./webpack/file-extension.js');

const ASSET_PATH = process.env.ASSET_PATH || '/';

const entry = {
  main: R(src, 'Boot', 'index.js'),
};

const options = {
  context: context,
  mode: envWrapper.NODE_ENV,
  entry: entry,
  output: {
    path: R(dist, envWrapper.TARGET_TYPE),
    clean: true,
    pathinfo: true,
    filename: '[name].bundle.js',
    publicPath: ASSET_PATH,
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat([
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.css',
        '.less',
        '.sass',
        '.scss',
      ]),
  },
  module: {
    rules: [],
  },
  plugins: [
    ...definePlugins,
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin({
      verbose: true,
      cleanStyleWebpackAssets: true, // Automatically remove all unused webpack assets on rebuild
      cleanOnceBeforeBuildPatterns: [],
    }),
  ],
};

module.exports = options;
