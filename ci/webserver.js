const DEV_ENV_VALT = 'development';

process.env.BABEL_ENV = DEV_ENV_VALT;
process.env.NODE_ENV = DEV_ENV_VALT;

const { webpack } = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const fs = require('fs-extra');

const {
  envRulesHandle,
  envDevToolHandle,
} = require('./webpack/env-rules-handler');
const { R, join, dist } = require('./paths');

const {
  DEV_PORT = 38924,
  TARGET_TYPE,
  devtool,
  PUBLIC_PATH,
} = require('../config');

const { notHotReload } = require('./webpack/entry-conf');

const distTarget = join(dist, TARGET_TYPE || 'bs');
if (fs.existsSync(distTarget)) {
  fs.removeSync(distTarget);
}

var config = require('./webpack/webpack.config');

config.output = {
  path: distTarget,
  clean: true,
  pathinfo: true,
  // filename: '[name].js',
  filename: function (pathData) {
    return pathData.chunk.name === 'main'
      ? '[name].js'
      : '[name]/[chunkhash].js';
  },
  chunkFilename: (pathData) => {
    return pathData.chunk.name === 'main'
      ? '[name].js'
      : '[name]/[chunkhash].js';
  },
  publicPath: PUBLIC_PATH,
};

// handle rule
// envRulesHandle(config, true);

envDevToolHandle(config, process.env.NODE_ENV, devtool);

// handle hotreload
let excludeEntriesToHotReload = notHotReload || [];
for (var entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    let _tmpEntry = config.entry[entryName];
    config.entry[entryName] = [
      'webpack-dev-server/client?http://localhost:' + DEV_PORT,
      'webpack/hot/dev-server',
    ].concat(_tmpEntry);
  }
}
// if (process.env.DEBUG_CONFIG || true) {
//   console.log(
//     'Entries :\n ',
//     chalk.magentaBright(JSON.stringify(config.entry, null, 2))
//   );
// }

const HMROptions = {
  contentBase: join(__dirname, 'dist', TARGET_TYPE),
  port: DEV_PORT,
  hot: true,
  open: false,
  // openPage: ['index.html'],
  injectClient: true,
  writeToDisk: true,
  historyApiFallback: true,
  publicPath: `http://localhost:${DEV_PORT}`,
  lazy: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  disableHostCheck: true,
};

WebpackDevServer.addDevServerEntrypoints(config, HMROptions);
var compiler = webpack(config);

// console.log('>>>>WebpackDevServer>>>>>DEBUG>>>>>', config);
const server = new WebpackDevServer(compiler, HMROptions);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}

server.listen(DEV_PORT, 'localhost', () => {
  console.log(
    chalk.greenBright(
      'dev Server listening on : http://localhost:' + DEV_PORT + '/'
    )
  );
});

module.exports = config;
