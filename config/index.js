const chalk = require('chalk');
const fs = require('fs-extra');
const pkgJson = require('../package.json');
const path = require('path');

let localeEnv = {};

!process.env.NODE_ENV && (process.env.NODE_ENV = 'development');

const prodMode = process.env.NODE_ENV === 'production';

const localeEnvPath = path.resolve(
  __dirname,
  `.env.${process.env.NODE_ENV}.js`
);

if (fs.existsSync(localeEnvPath)) {
  localeEnv = require(localeEnvPath);
} else {
  console.log(
    chalk.redBright(`Unfund ${localeEnvPath} locale env config file.`)
  );
}

/* Secret Configuration */
let SECRETS_ENV_PATH = path.resolve(__dirname, '../../', '.localenv');
let secretsEnv = {};
if (fs.existsSync(path.join(SECRETS_ENV_PATH, '/.ws-secrets.env.js'))) {
  secretsEnv = require(path.join(SECRETS_ENV_PATH, '/.ws-secrets.env.js'));
} else {
  console.log(
    chalk.redBright(
      `Unfund ${path.join(
        SECRETS_ENV_PATH,
        '/secrets.env.js'
      )} locale secrets config file.`
    )
  );
}

const mixinProperty = (key, defaultValue = '') => {
  return process.env[key] || localeEnv[key] || defaultValue;
};

let envWarpper = Object.assign({}, secretsEnv, localeEnv, {
  NODE_ENV: process.env.NODE_ENV, // 预处理过的
  APP_NAME: mixinProperty('APP_NAME', pkgJson.name),
  APP_VERSION: mixinProperty('APP_VERSION', pkgJson.version),
  APP_AUHTOR: mixinProperty('APP_AUTHOR', pkgJson.author),
  TARGET_TYPE: getTargetArgv(),
  prodMode: prodMode,
});

console.log(
  'Used Build Env:',
  chalk.yellowBright(JSON.stringify(envWarpper, null, 2))
);

function getTargetArgv() {
  /**
   * https://webpack.js.org/configuration/target/#root
   */
  let target = 'web'; // browserslist
  if (process.env.TARGET_TYPE === 'gitpages') {
    return process.env.TARGET_TYPE;
  }

  let originalArgvs = process.env.npm_config_argv
    ? JSON.parse(process.env.npm_config_argv).original
    : process.argv;

  if (originalArgvs && originalArgvs.length) {
    let idx = originalArgvs.findIndex((argv) => argv === '--target-type');
    let _argvTarget =
      idx < originalArgvs.length - 1 ? originalArgvs[idx + 1] : '';

    (_argvTarget === 'web' || _argvTarget === 'gitpages') &&
      (target = _argvTarget);
  }

  return target;
}

module.exports = envWarpper;
