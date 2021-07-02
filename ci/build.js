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
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const {
  ERR_TEXT_HEX_COLOR,
  SUCCESS_TEXT_HEX_COLOR,
  WIKI_TEXT_HEX_COLOR,
} = require('./colors-cnsts');

showHelp();

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
  runtimeChunk: true,
  minimize: true,
  minimizer: [
    new TerserPlugin({
      parallel: true,
    }),
    new CssMinimizerPlugin(),
  ],
  splitChunks: {
    chunks: 'async', //表示将选择哪些块进行优化。提供字符的有效值为all、async和initial,默认是仅对异步加载的块进行分割。
    minSize: 100 * 1024, //模块大于minSize时才会被分割出来。默认100k
    minChunks: 3,
    minRemainingSize: 0,
    automaticNameDelimiter: '_',
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
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
};

// handle rule
// envRulesHandle(config, true);

envDevToolHandle(config, process.env.NODE_ENV, devtool);

const { analyzerMode, openAnalyzer } = handleArgvs();

/** Build plugins */
const buildPlugins = [
  new MiniCssExtractPlugin({
    filename: `${cssBase}/[name].css`,
    chunkFilename: `${cssBase}/[id].css`,
  }),
  new CompressionPlugin({
    algorithm: 'gzip',
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: analyzerMode,
    analyzerPort: 8864,
    openAnalyzer: openAnalyzer,
  }),
];

config.plugins = config.plugins.concat(buildPlugins);

const compiler = webpack(config, (err, stats) => {
  if (err) {
    console.log(
      '🤢🤢🤢Build fail : \n' + chalk.hex(ERR_TEXT_HEX_COLOR)(err.message)
    );
  }
});

function showHelp() {
  let originalArgvs = process.env.npm_config_argv
    ? JSON.parse(process.env.npm_config_argv).original
    : process.argv;
  let idx = originalArgvs.findIndex((argv) => argv === '--help');
  let cidx = originalArgvs.findIndex((argv) => argv === '-h');
  if (idx > 0 || cidx > 0) {
    console.log(cmdComments());
    process.exit(0);
  }
}

function handleArgvs() {
  let bashOptions = {
    analyzerMode: 'disabled',
    openAnalyzer: false,
  };
  const SERVER_ARGV_KEYS = ['-r', '--report'];

  let originalArgvs = process.env.npm_config_argv
    ? JSON.parse(process.env.npm_config_argv).original
    : process.argv;

  let idx = -1;
  const argvLen = originalArgvs.length;
  idx = originalArgvs.findIndex((argv) => argv === SERVER_ARGV_KEYS[0]);

  if (idx > 0) {
    if (
      argvLen > idx + 1 &&
      ['server', 'static', 'json'].includes(originalArgvs[idx + 1])
    ) {
      bashOptions.analyzerMode = originalArgvs[idx + 1];
      originalArgvs[idx + 1] === 'server' && (bashOptions.openAnalyzer = true);
    } else {
      bashOptions.analyzerMode = 'server';
      bashOptions.openAnalyzer = true;
    }
  }

  idx = originalArgvs.findIndex((argv) => argv === SERVER_ARGV_KEYS[1]);

  if (idx > 0) {
    if (
      argvLen > idx + 1 &&
      ['server', 'static', 'json'].includes(originalArgvs[idx + 1])
    ) {
      bashOptions.analyzerMode = originalArgvs[idx + 1];
      originalArgvs[idx + 1] === 'server' && (bashOptions.openAnalyzer = true);
    } else {
      bashOptions.analyzerMode = 'server';
      bashOptions.openAnalyzer = true;
    }
  }

  return bashOptions;
}

function cmdComments() {
  let c =
    '\n' +
    chalk.hex(WIKI_TEXT_HEX_COLOR)(`terminal arguments:\n`) +
    chalk.hex(WIKI_TEXT_HEX_COLOR)(`\t -h or --help : show commands help.\n`) +
    chalk.hex(WIKI_TEXT_HEX_COLOR)(
      `\t --report or -r : start a analyzer server.\n`
    );

  return c;
}
