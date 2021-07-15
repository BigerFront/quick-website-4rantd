const chalk = require('chalk');
const { capitalize } = require('lodash');

const PATH_REGEX = /^[a-z]+([a-z0-9]*([\-\/]?)(?!\2))*[a-z0-9]+$/;

const MOD_NAME_REGEX = /^[a-z]+([a-z0-9]*([-]?)(?!\2))*[a-z0-9]+$/;

const { ERR_TEXT_HEX_COLOR } = require('../colors-cnsts');

function checkViewBase(viewBase) {
  if (viewBase === '') return viewBase;
  if (new RegExp(PATH_REGEX).test(viewBase)) {
    return viewBase;
  } else {
    const errMsg = chalk.hex(ERR_TEXT_HEX_COLOR)(
      `❌ Argument viewBase Illegal,viewBase must a sub module path:\n` +
        `\t Like: sub/submod or mod`
    );
    throw new Error(errMsg);
  }
}

function getArgumentForFunc(originalArgvs, shortCmd, longCmd, crossCMDKey) {
  let _argv = '';

  let reg;
  let required = false;
  switch (crossCMDKey) {
    case 'VIEW_BASE':
      reg = PATH_REGEX;
      break;
    case 'MOD_NAME':
      reg = MOD_NAME_REGEX;
      break;
    case 'MOD_PATH':
      required = true;
      reg = PATH_REGEX;
      break;
    default:
      console.error(chalk.redBright(`${crossCMDKey} key unsupport.`));
      process.exit(0);
  }

  let idx = -1;
  const len = originalArgvs.length;
  idx = originalArgvs.findIndex((argv) => argv === shortCmd);
  if (idx > 0 && idx + 1 < len && originalArgvs[idx + 1]) {
    _argv = originalArgvs[idx + 1];
  }

  idx = originalArgvs.findIndex((argv) => argv === longCmd);
  if (idx > 0 && idx + 1 < len && originalArgvs[idx + 1]) {
    _argv = originalArgvs[idx + 1];
  }

  _argv = process.env[crossCMDKey] || _argv;

  let _msg = '';
  if (required && _argv && reg && !reg.test(_argv)) {
    _msg = `argument ${crossCMDKey} :[${_argv}] illegal.`;
    throw new Error(_msg);
  } else if (required && !_argv) {
    _msg = `argument ${crossCMDKey} is required.`;
    throw new Error(_msg);
  } else if (_argv && reg && !reg.test(_argv)) {
    _msg = `argument ${crossCMDKey} :[${_argv}] illegal.`;
    throw new Error(_msg);
  }

  return _argv;
}

function getBooleanArgv(originalArgvs, longCmd, shortCmd) {
  let idx = -1;
  idx = originalArgvs.findIndex((argv) => argv === longCmd);
  if (idx > 0) return false;
  shortCmd && (idx = originalArgvs.findIndex((argv) => argv === shortCmd));
  if (idx > 0) return false;

  return true;
}

function showHelp(originalArgvs, helpDoc) {
  let idx = originalArgvs.findIndex((argv) => argv === '--help');
  let cidx = originalArgvs.findIndex((argv) => argv === '-h');
  if (idx > 0 || cidx > 0) {
    console.log(helpDoc);
    process.exit(0);
  }
}

function getFuncFileName(modPath) {
  const splitPaths = modPath.split(/\//i).filter((p) => p !== '' && p !== '-');
  let _subModName = '';

  const len = splitPaths.length;
  if (len > 1) {
    _subModName = splitPaths.slice(len - 1)[0];
  } else {
    _subModName = splitPaths[0];
  }

  let _splitNames = _subModName
    .split(/-/i)
    .filter((p) => p !== '' && p !== '-');
  if (_splitNames.length > 1)
    _splitNames = _splitNames.filter((t) => t !== 'index');

  _splitNames.length > 2 &&
    (_splitNames = _splitNames.slice(_splitNames.length - 2));

  _subModName = _splitNames.join('-');

  return _subModName;
}

function getFuncName(modPath) {
  const splitPaths = modPath.split(/\//i).filter((p) => p !== '' && p !== '-');
  let _subModName = '';

  const len = splitPaths.length;
  if (len > 1) {
    _subModName = splitPaths.slice(len - 1)[0];
  } else {
    _subModName = splitPaths[0];
  }

  let _splitNames = _subModName
    .split(/-/i)
    .filter((p) => p !== '' && p !== '-');
  if (_splitNames.length > 1)
    _splitNames = _splitNames.filter((t) => t !== 'index');

  _splitNames.length > 2 &&
    (_splitNames = _splitNames.slice(_splitNames.length - 2));

  _subModName = _splitNames.map((t) => capitalize(t)).join('');

  return _subModName;
}

function getFuncScssFileName(modPath) {
  const splitPaths = modPath.split(/\//i).filter((p) => p !== '' && p !== '-');
  let _subModScssName = '';

  const len = splitPaths.length;
  if (len > 1) {
    _subModScssName = splitPaths.slice(len - 1)[0];
  } else {
    _subModScssName = splitPaths[0];
  }

  let _splitNames = _subModScssName
    .split(/-/i)
    .filter((p) => p !== '' && p !== '-');

  _splitNames.length > 2 && (_splitNames = _splitNames.slice(0, 2));

  _subModScssName = _splitNames.join('-');

  return _subModScssName;
}

function getRootClzName(subModName) {
  let splitNames = subModName.split(/-/i).filter((p) => p !== '' && p !== '-');

  let _clz = splitNames[splitNames.length - 1];

  return `${_clz}`;
}

module.exports = {
  showHelp,
  checkViewBase,
  getArgumentForFunc,
  getBooleanArgv,
  getFuncFileName,
  getRootClzName,
  getFuncScssFileName,
  getFuncName,
};
