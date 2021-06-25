const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const fs = require('fs-extra');

const {
  envRulesHandle,
  envDevToolHandle,
} = require('./webpack/env-rules-handler');
const { R, join, dist } = require('./paths');

const DEV_ENV_VALT = 'development';

process.env.BABEL_ENV = DEV_ENV_VALT;
process.env.NODE_ENV = DEV_ENV_VALT;

const { DEV_PORT, TARGET_TYPE, devtool } = require('../config');
const { notHotReload } = require('./webpack/entry-conf');

const distTarget = join(dist, TARGET_TYPE);
if (fs.existsSync(distTarget)) {
  fs.removeSync(distTarget);
}

var config = require('./webpack/webpack.config');

// handle rule
// envRulesHandle(config, true);

// envDevToolHandle(config, process.env.NODE_ENV, devtool);

// handle hotreload
// let excludeEntriesToHotReload = notHotReload || [];
// for (var entryName in config.entry) {
//   if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
//     let _tmpEntry = config.entry[entryName];
//     config.entry[entryName] = [
//       'webpack-dev-server/client?http://localhost:' + DEV_PORT,
//       'webpack/hot/dev-server',
//     ].concat(_tmpEntry);
//   }
// }
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
  // openPage: ['options/options.html'],
  injectClient: false,
  writeToDisk: true,
  historyApiFallback: true,
  publicPath: `http://localhost:${DEV_PORT}`,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  disableHostCheck: true,
};

// WebpackDevServer.addDevServerEntrypoints(config, HMROptions);
var compiler = Webpack(config);
console.log('>>>>WebpackDevServer>>>>>DEBUG>>>>>', compiler);
const server = new WebpackDevServer(compiler, HMROptions);

// if (process.env.NODE_ENV === 'development' && module.hot) {
//   module.hot.accept();
// }

server.listen(DEV_PORT, 'localhost', () => {
  console.log(chalk.greenBright('dev Server listening on port:' + DEV_PORT));
});

// console.log('>>>>WebpackDevServer>>>>>DEBUG>>>>>');
