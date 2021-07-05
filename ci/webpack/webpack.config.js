const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const NullWebpackPlugin = require('./null-webpack-plugin');

const { context, R, src, join, favicon } = require('../paths');
const { prodMode, APP_TITLE, NODE_ENV } = require('../../config');

const { alias, fileExtensions } = require('./resolve-conf');
const { entry, htmlExternals } = require('./entry-conf');
const { compactThemeSingle } = require('antd/dist/theme');
const { AntdNinJaThemeVariables } = require('../theme');

const definePlugins = require('./eject-env-plugins');
const copyPlugins = require('./copy-plugin-conf');

let htmlPlugins = [
  new HtmlWebpackPlugin({
    template: R(src, 'Boot', 'template.ejs'),
    title: APP_TITLE || 'Official Website',
    filename: 'index.html',
    chunks: ['main'],
    cache: false,
    inject: true,
    favicon: favicon,
  }),
];

if (prodMode) {
  htmlPlugins = htmlPlugins.concat([
    new HtmlWebpackExternalsPlugin({
      externals: [...htmlExternals],
    }),
  ]);
}

var options = {
  context: context,
  mode: NODE_ENV,
  entry: entry,
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map(function (extension) {
        return '.' + extension;
      })
      .concat(['.js', '.jsx', '.ts', '.tsx']),
  },
  module: {
    rules: [
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          limit: 8192,
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
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          prodMode ? { loader: MiniCssExtractPlugin.loader } : 'style-loader',
          {
            loader: 'css-loader', // 将CSS转化成ComminJS模块
          },
          {
            loader: 'resolve-url-loader', // 置于 loader 链中的 sass-loader 之前，就可以重写 url ,解决url()
          },
          {
            loader: 'sass-loader', //将Sass 编译成CSS
            options: {
              sourceMap: true,
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
              },
            },
          },
        ],
      },
      {
        test: /antd.*\.less$/,
        use: [
          prodMode ? { loader: MiniCssExtractPlugin.loader } : 'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  ...compactThemeSingle,
                  ...AntdNinJaThemeVariables,
                },
              },
              // javascriptEnabled: true,  // less-loader < 6
            },
          },
        ],
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

    ...copyPlugins,
    ...htmlPlugins,
  ],
};

module.exports = options;
