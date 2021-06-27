const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const NullWebpackPlugin = require('./null-webpack-plugin');

const definePlugins = require('./eject-env-plugins');
const { context, R, src, dist, join, favicon } = require('../paths');
const envWrapper = require('../../config');

const { alias, fileExtensions } = require('./resolve-conf');

const { entry } = require('./entry-conf');

const htmlPlugins = [
  new HtmlWebpackPlugin({
    template: R(src, 'Boot', 'template.ejs'),
    title: envWrapper['APP_NAME'] || 'Official Website',
    filename: 'index.html',
    chunks: ['main'],
    cache: false,
    inject: true,
    favicon: favicon,
  }),
];
const entryMain = R(src, 'Boot', 'index.js');

var options = {
  context: context,
  mode: envWrapper.NODE_ENV,
  entry: entry,
  // output: {
  //   path: join(dist, envWrapper.TARGET_TYPE || 'bs'),
  //   clean: true,
  //   pathinfo: true,
  //   filename: '[name].js',
  //   filename: function (pathData) {
  //     return pathData.chunk.name === 'main'
  //       ? '[name].js'
  //       : '[name]/[chunkhash].js';
  //   },
  //   chunkFilename: (pathData) => {
  //     return pathData.chunk.name === 'main'
  //       ? '[name].js'
  //       : '[name]/[chunkhash].js';
  //   },
  //   publicPath: PUBLIC_PATH,
  // },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map(function (extension) {
        return '.' + extension;
      })
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
    rules: [
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.html/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        use: ['react-hot-loader/webpack', 'babel-loader', 'ts-loader'], // 按需加载
        // exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'source-map-loader',
          },
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    ...definePlugins,
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin({
      verbose: true,
      cleanStyleWebpackAssets: true, // Automatically remove all unused webpack assets on rebuild
      cleanOnceBeforeBuildPatterns: [],
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    process.env.NODE_ENV === 'production'
      ? new MiniCssExtractPlugin()
      : new NullWebpackPlugin(),

    ...htmlPlugins,
  ],
};

module.exports = options;