const webpack = require('webpack');

const {
  APP_VERSION,
  INFURA_KEY,
  INFURA_SECRET,
  APP_TITILE = 'Quick Race',
} = require('../../config');

const EnvHandler = {
  env: {},
  push: (key, value) => {
    if (typeof key === 'string') {
      EnvHandler.env[key] = JSON.stringify(value);
    }
    return EnvHandler;
  },
  getEnv: () => {
    return { ...EnvHandler.env };
  },
};

let commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString();
const versionTag = `${APP_VERSION}-${
  commitHash.endsWith('\n')
    ? commitHash.substring(0, commitHash.length - 2)
    : commitHash
}`;

const EJECT_ENV = EnvHandler.push(
  '__QK_DEBUG__',
  process.env.DEV_DEBUG || false
)
  .push('__APP_TITLE__', APP_TITILE)
  .push('__VERSION_TAG__', versionTag)
  .push('__INFURA_KEY__', INFURA_KEY || '')
  .push('__INFURA_SECRET__', INFURA_SECRET || '')
  .getEnv();

module.exports = [new webpack.DefinePlugin(EJECT_ENV)];
