#!/usr/bin/env node

/** Make early set env */
const DEV_ENV_VALT = 'production';
process.env.BABEL_ENV = DEV_ENV_VALT;
process.env.NODE_ENV = DEV_ENV_VALT;

const { webpack } = require('webpack');
const chalk = require('chalk');
const fs = require('fs-extra');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const {
  envRulesHandle,
  envDevToolHandle,
} = require('./webpack/env-rules-handler');
const {
  R,
  join,
  dist,
  jsBase,
  cssBase,
  fontsBase,
  imagesBase,
} = require('./paths');

const { TARGET_TYPE, devtool, PUBLIC_PATH } = require('../config');

const distTarget = join(dist, TARGET_TYPE || 'bs');
if (fs.existsSync(distTarget)) {
  fs.removeSync(distTarget);
}

var config = require('./webpack/webpack.config');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
config.output = {
  path: distTarget,
  clean: true,
  pathinfo: true,
  // filename: `${jsBase}/[name].js`,
  filename: function (pathData) {
    return pathData.chunk.name === 'main'
      ? `${jsBase}/[name].[hash].js`
      : `${jsBase}/[name].[chunkhash].js`;
  },
  chunkFilename: (pathData) => {
    return pathData.chunk.name === 'main'
      ? `${jsBase}/[name].[hash].js`
      : `${jsBase}/[name].[chunkhash].js`;
  },
  publicPath: PUBLIC_PATH,
};

config.optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      parallel: true,
    }),
    new OptimizeCssAssetsPlugin(),
  ],
  splitChunks: {
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/, // window diff uinx
        name: 'vendors',
        chunks: 'initial',
      },
      async: {
        test: /[\\/]node_modules[\\/]/,
        name: 'async',
        chunks: 'async',
        minChunks: 4,
      },
    },
  },
  runtimeChunk: true,
};

// handle rule
envRulesHandle(config, true);

envDevToolHandle(config, process.env.NODE_ENV, devtool);

/** Build plugins */
const buildPlugins = [
  // new CompressionPlugin({
  //   filename: '[path].gz[query]',
  //   algorithm: 'gzip',
  //   test: new RegExp(/\.js(\?.*)?$/, 'i'),
  //   threshold: 10240,
  //   minRatio: 0.8,
  // }),
  new BundleAnalyzerPlugin({
    analyzerPort: 8864,
  }),
];

config.plugins = config.plugins.concat(buildPlugins);

const compiler = webpack(config, (err, stats) => {
  if (err) {
    console.log('🤢🤢🤢Build fail : \n' + chalk.redBright(err.message));
  }
});
