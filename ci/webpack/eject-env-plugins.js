const webpack = require('webpack');

const envWrapper = require('../../config');

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
const versionTag = `${envWrapper['APP_VERSION']}-${
  commitHash.endsWith('\n')
    ? commitHash.substring(0, commitHash.length - 2)
    : commitHash
}`;

const EJECT_ENV = EnvHandler.push('__DEBUG__', process.env.DEV_DEBUG || false)
  .push('__VERSION_TAG__', versionTag)
  .push('__INFURA_KEY__', envWrapper['INFURA_KEY'] || '')
  .push('__INFURA_SECRET__', envWrapper['INFURA_SECRET'] || '')
  .getEnv();

module.exports = [new webpack.DefinePlugin(EJECT_ENV)];
