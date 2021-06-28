const chalk = require('chalk');
const dayjs = require('dayjs');

const pkgJson = require('../../package.json');

const cmdArgv = JSON.parse(process.env.npm_config_argv);
const originalArgvs = cmdArgv.original;

const PATH_REGEX = /^[a-z]+([a-z0-9]*([\-\/]?)(?!\2))*[a-z0-9]+$/;

const MOD_NAME_REGEX = /^[a-z]+([a-z0-9]*([\-]?)(?!\2))*[a-z0-9]+$/;

const ERR_COLOR_HEX = '#FF4500';
const CMD_COLOR_HEX = '#9400D3';

function getSubModName() {
  let subModName = '';
  let idx = originalArgvs.findIndex((arg) => arg === '--sub-mod-name');
  if (idx > 0 && idx < originalArgvs.length - 1) {
    let _subModName = originalArgvs[idx + 1];
    if (/^[a-z]+([a-z0-9]*([\-]?)(?!\2))*[a-z0-9]+$/g.test(_subModName)) {
      subModName = _subModName;
    }
  }

  if (process.env.SUB_MOD_NAME) {
    subModName = process.env.SUB_MOD_NAME;
  }

  if (
    subModName &&
    !/^[a-z]+([a-z0-9]*([\-]?)(?!\2))*[a-z0-9]+$/g.test(subModName)
  ) {
    let errMsg =
      chalk.yellowBright(`⚠ Arguments SUB_MOD_NAME Incorrect format.\n`) +
      chalk.blueBright(
        'The module name must be a string of lowercase letters, numbers or "-".'
      );
    throw new Error(errMsg);
  }

  return subModName;
}

/**
 * --mod-path or --m
 * env MOD_PATH
 */
function parseModSubPath() {
  const CMD_MOD_ARGV_NAME = '--mod-path';
  const CMD_MOD_ARGV_SHORT_NAME = '-m';

  let modPath = '';
  let modSubPath = false;
  let modName = '';
  let errMsg = '';

  let idx = originalArgvs.findIndex((arg) => arg === CMD_MOD_ARGV_NAME);

  // console.log(JSON.stringify(originalArgvs, null, 2));

  if (idx > 0 && idx < originalArgvs.length - 1) {
    if (new RegExp(PATH_REGEX, 'g').test(originalArgvs[idx + 1]))
      modPath = originalArgvs[idx + 1];
    else {
      errMsg =
        chalk.redBright(
          `❌ Arguments MOD_PATH [${CMD_MOD_ARGV_NAME} ${
            originalArgvs[idx + 1]
          }] incorrect.\n`
        ) + modPathRuleComments();
      throw new Error(errMsg);
    }
  }

  // short
  idx = originalArgvs.findIndex((arg) => arg === CMD_MOD_ARGV_SHORT_NAME);
  if (idx > 0 && idx < originalArgvs.length - 1) {
    if (new RegExp(PATH_REGEX, 'g').test(originalArgvs[idx + 1]))
      modPath = originalArgvs[idx + 1];
    else {
      errMsg =
        chalk.redBright(
          `❌ Arguments MOD_PATH [${CMD_MOD_ARGV_SHORT_NAME} ${
            originalArgvs[idx + 1]
          }] incorrect.\n`
        ) + modPathRuleComments();
      throw new Error(errMsg);
    }
  }

  if (process.env.MOD_PATH) {
    modPath = process.env.MOD_PATH;
  }

  if (!modPath) {
    errMsg =
      chalk.redBright('❌ Arguments MOD_PATH required.\n') +
      modPathRuleComments();
    throw new Error(errMsg);
  }

  if (!new RegExp(PATH_REGEX, 'g').test(modPath)) {
    errMsg =
      chalk.redBright(`❌ Arguments MOD_PATH [${modPath}] incorrect.\n`) +
      modPathRuleComments();
    throw new Error(errMsg);
  }

  let _splitPaths = modPath.split(/\//i).filter((p) => p !== '' && p !== '-');

  if (_splitPaths.length > 1) {
    modSubPath = _splitPaths.slice(0, _splitPaths.length - 1).join('/');
    modPath = _splitPaths.join('/');
    // last
  }
  modName = _splitPaths[_splitPaths.length - 1];
  if (!new RegExp(MOD_NAME_REGEX, 'g').test(modName)) {
    errMsg =
      chalk.redBright(
        `❌ Arguments parse  module name [${modName}] incorrect.\n`
      ) + modPathRuleComments();
    throw new Error(errMsg);
  }

  return {
    modPath,
    modName,
    modSubPath,
  };
}

function modPathRuleComments() {
  let ruleComments =
    chalk.bold.hex(ERR_COLOR_HEX)(
      '\t- The Module path must be a path or module name,\n\tlike : [sub/mod-name,modname,mod-name]\n'
    ) +
    chalk.hex(ERR_COLOR_HEX)(
      '\t- Module name can only consist of lowercase letters, numbers or - .\n'
    ) +
    chalk.hex(ERR_COLOR_HEX)('\t☞☞') +
    chalk.hex(CMD_COLOR_HEX)(
      ` Your can pass in arguments in the following ways\n`
    ) +
    chalk.greenBright(`\t✔ `) +
    chalk.hex(CMD_COLOR_HEX)(
      `Use command like: --mod-path \'<your module path>\' or -m \'<your module path>\',\n`
    ) +
    chalk.greenBright(`\t✔ `) +
    chalk.hex(CMD_COLOR_HEX)(
      `Use cross-env cli like: cross-env MOD_PATH=<your module path> \n `
    ) +
    chalk.hex(CMD_COLOR_HEX)(
      '\n♞♞♞ More about module name rule see the document at docs.♞♞♞'
    );

  return ruleComments;
}

function getModCoreName() {
  const CMD_MOD_CORE_NAME = '--mod-corename';
  const CMD_MOD_CORE_SHORT_NAME = '-n';
  const CRS_ENV_KEY = 'MOD_CORE_NAME';
  let corename = '';
  let hasInputArgv = false;
  let avalibleCMD = '';

  let _tmp = '';

  let idx = originalArgvs.findIndex((arg) => arg === CMD_MOD_CORE_SHORT_NAME);

  if (idx > 0 && idx < originalArgvs.length - 1) {
    hasInputArgv = true;
    _tmp = originalArgvs[idx + 1];
    avalibleCMD = `command line args [${CMD_MOD_CORE_SHORT_NAME}] `;
  }

  idx = originalArgvs.findIndex((arg) => arg === CMD_MOD_CORE_NAME);
  if (idx > 0 && idx < originalArgvs.length - 1) {
    hasInputArgv = true;
    _tmp = originalArgvs[idx + 1];
    avalibleCMD = `command line args [${CMD_MOD_CORE_NAME}] `;
  }

  if (process.env[CRS_ENV_KEY]) {
    hasInputArgv = true;
    _tmp = process.env[CRS_ENV_KEY];
    avalibleCMD = `cross-env parameter [${CRS_ENV_KEY}] `;
  }

  if (hasInputArgv && !new RegExp(MOD_NAME_REGEX).test(_tmp)) {
    let errMsg =
      chalk.redBright('❌ ' + avalibleCMD + 'no value or format incorrect.\n') +
      chalk.hex(CMD_COLOR_HEX)(
        `you should entry like: module-a, moda,m-a9 ...`
      );
    throw new Error(errMsg);
  } else {
    corename = _tmp;
    return corename;
  }
}

function getConfiguration() {
  return new Promise((resolve, reject) => {
    try {
      const parseModArgv = parseModSubPath();
      const baseConfig = {
        C_CURRTS: dayjs().format('YY-MM-DD HH:mm dddd'),
        C_AUTHOR: process.env.DEV_AUTHOR || pkgJson.author || pkgJson.name,
        VIEW_BASE: 'views',
        SUB_ENTRY: '',
        noContainer: originalArgvs.includes('--noContainer'),
        notPage: originalArgvs.includes('--notPage'),
        noComments: originalArgvs.includes('--noComments'),
        subModName: getSubModName(),
        corename: getModCoreName(), // --mod-corename -n or MOD_CORENAME
        subpath: false,
        ...parseModArgv,
      };
      resolve(baseConfig);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = getConfiguration;
