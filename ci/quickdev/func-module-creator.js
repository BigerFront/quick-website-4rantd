const chalk = require('chalk');
const fs = require('fs-extra');
const emoji = require('node-emoji');
const dayjs = require('dayjs');
const { capitalize } = require('lodash');

const { src, R, join } = require('../paths');

const {
  showHelp,
  getArgumentForFunc,
  getBooleanArgv,
  getFuncFileName,
  getRootClzName,
  getFuncScssFileName,
  getFuncName,
} = require('./cmd-utils');

const {
  ERR_TEXT_HEX_COLOR,
  SUCCESS_TEXT_HEX_COLOR,
  WIKI_TEXT_HEX_COLOR,
  WIKI_PREFIX_COLOR,
} = require('../colors-cnsts');

const OUT_OPT = {
  encoding: 'utf8',
};

const CMD_KEY_MAPS = {
  VIEW_BASE: ['-v', '--view-base'],
  MOD_PATH: ['-m', '--mod-path'],
  MOD_NAME: ['-n', '--mod-name'],
  MOD_FULLPATH: ['-f', '--mod-fullpath'],
  NO_SCSS: ['--no-scss'],
  HELP: ['-h', '--help'],
};

main()
  .then((res) => {
    console.log(chalk.hex(SUCCESS_TEXT_HEX_COLOR)(res));
  })
  .catch((err) => {
    if (typeof err === 'object') {
      console.log(
        chalk.hex(ERR_TEXT_HEX_COLOR)(
          err.message ? err.message : 'generate failed.'
        )
      );
    } else {
      console.log(chalk.hex(ERR_TEXT_HEX_COLOR)(err));
    }
  });

/**
 * main
 */
async function main() {
  let originalArgvs = process.env.npm_config_argv
    ? JSON.parse(process.env.npm_config_argv).original
    : process.argv;

  showHelp(originalArgvs, cmdFuncCreatorDocs());
  return new Promise((resolve, reject) => {
    try {
      const config = parseArgv(originalArgvs);
      // console.log(config);
      const { indexFilePath, funcFilePath, scssFilePath } =
        checkModFiles(config);

      let genFiles = [];
      const indexRes = writeIndex(config, indexFilePath);
      genFiles.push(indexRes);
      const funcRes = writeFuncFile(config, funcFilePath);

      genFiles.push(funcRes);
      const scssRes = writeScssFile(config, scssFilePath);

      genFiles.push(scssRes);

      return resolve(
        '✨✨✨✨\nGenerate module successful.\n✨✨✨✨\n' +
          genFiles.map((t) => '\t✔ ' + t).join('\n')
      );
    } catch (error) {
      let msg = '❌\n' + error?.message + '\n' + cmdFuncCreatorDocs();

      return reject(new Error(msg));
    }
  });
}

function parseArgv(originalArgvs) {
  let opts = {
    C_CURR_TS: dayjs().format('YY-MM-DD HH:mm dddd'),
    viewBase: '',
    modPath: '',
    modName: '',
    genScss: getBooleanArgv(originalArgvs, CMD_KEY_MAPS.NO_SCSS[0]),
  };

  opts.viewBase = getArgumentForFunc(
    originalArgvs,
    CMD_KEY_MAPS.VIEW_BASE[0],
    CMD_KEY_MAPS.VIEW_BASE[1],
    'VIEW_BASE'
  );

  opts.modPath = getArgumentForFunc(
    originalArgvs,
    CMD_KEY_MAPS.MOD_PATH[0],
    CMD_KEY_MAPS.MOD_PATH[1],
    'MOD_PATH'
  );

  opts.modName = getArgumentForFunc(
    originalArgvs,
    CMD_KEY_MAPS.MOD_NAME[0],
    CMD_KEY_MAPS.MOD_NAME[1],
    'MOD_NAME'
  );

  if (opts.modName) {
    opts.modFuncFileName = opts.modName;
    opts.scssFileName = opts.modName;
  } else {
    opts.modFuncFileName = getFuncFileName(opts.modPath);
    opts.scssFileName = getFuncScssFileName(opts.modPath);
  }

  opts.funcName = getFuncName(opts.modName || opts.modPath);

  opts.rootClassName = getRootClzName(opts.modFuncFileName, 'container');

  opts.modBasePath = join(src, opts.viewBase, opts.modPath);

  return opts;
}

function checkModFiles(config) {
  const { modBasePath, modFuncFileName, scssFileName, modPath = '' } = config;

  const subModName = modPath.split(/\//)[modPath.split(/\//).length - 1];

  let errMsg = '';

  const funcPaths = {
    indexFilePath: R(modBasePath, 'index.js'),
    funcFilePath: R(modBasePath, `${modFuncFileName}.jsx`),
    scssFilePath: R(modBasePath, `${scssFileName}.scss`),
  };

  if (fs.existsSync(funcPaths.indexFilePath)) {
    errMsg = `Module file ${subModName} already exists in ${modBasePath} directory. Please remove or use another MOD_NAME.`;
    throw new Error(errMsg);
  }
  if (fs.existsSync(funcPaths.funcFilePath)) {
    errMsg = `Module file ${subModName}/${modFuncFileName}.jsx already exists in ${modBasePath} directory. Please remove or use another MOD_NAME.`;
    throw new Error(errMsg);
  }
  if (fs.existsSync(funcPaths.scssFilePath)) {
    errMsg = `Module file ${subModName}/${scssFileName}.scss already exists in ${modBasePath} directory. Please remove or use another MOD_NAME.`;
    throw new Error(errMsg);
  }

  return funcPaths;
}

function writeIndex(config, filePath) {
  const { C_CURR_TS, modPath, modFuncFileName, funcName } = config;

  let TPL =
    '/**\n' +
    ` * ${C_CURR_TS} \n` +
    ` * This file is the module ${modPath} entry.\n` +
    ` */\n\n`;

  TPL += `export { default as ${funcName} } from './${modFuncFileName}';\n`;
  fs.outputFileSync(filePath, TPL, OUT_OPT);

  return `${modPath}/index.js`;
}

function writeFuncFile(config, filePath) {
  const {
    C_CURR_TS,
    modPath,
    modFuncFileName,
    funcName,
    rootClassName,
    genScss,
  } = config;

  const TPL_COMMENTS =
    '/**\n' +
    ` * ${C_CURR_TS}\n` +
    ` * This file used define the module ${modPath} functions.\n` +
    ` */\n\n`;

  let TOL_IMPORT =
    `import React from 'react';\n` +
    '\n' +
    `import { useHistory } from 'react-router-dom';\n` +
    '\n';

  let TPL = genScss
    ? `export default function ${funcName}(props) {\n` +
      `  let history = useHistory();\n` +
      '\n' +
      `  return (\n` +
      `    <div className="${rootClassName}-container">\n` +
      `      <h1 className="${rootClassName}-h1">Test</h1>\n` +
      `    </div>\n` +
      `  );\n` +
      `}\n` +
      '\n'
    : `export default function ${funcName}(props) {\n` +
      `  let history = useHistory();\n` +
      '\n' +
      `  return (\n` +
      `    <div >\n` +
      `      <h1>Test</h1>\n` +
      `    </div>\n` +
      `  );\n` +
      `}\n` +
      '\n';

  fs.outputFileSync(filePath, TPL_COMMENTS + TOL_IMPORT + TPL, OUT_OPT);

  return `${modPath}/${modFuncFileName}.jsx`;
}

function writeScssFile(config, filePath) {
  const {
    C_CURR_TS,
    modPath,
    modFuncFileName,
    rootClassName,
    genScss,
    scssFileName,
  } = config;

  const TPL_COMMENTS =
    '/**\n' +
    ` * ${C_CURR_TS}\n` +
    ` * This file used define the module ${modPath} styles.\n` +
    ` * This file must be imported into parent scss file, to take it effect.\n` +
    ` * like : @import './${modPath}/${scssFileName}.scss';\n` +
    ` */\n\n`;

  let TOL_IMPORT = `/* there can define module variables or function */` + '\n';

  let TPL =
    `.${rootClassName} {\n` +
    `  &-container {\n` +
    `    color: #fff;\n` +
    `  }\n` +
    `}\n` +
    '\n';
  if (genScss) {
    fs.outputFileSync(filePath, TPL_COMMENTS + TOL_IMPORT + TPL, OUT_OPT);

    return `${modPath}/${modFuncFileName}.scss`;
  } else {
    return `Skip generate ${modPath}/${modFuncFileName}.scss`;
  }
}

function cmdFuncCreatorDocs() {
  let c =
    '✨✨✨\n' +
    chalk.hex(WIKI_TEXT_HEX_COLOR)(`Terminal arguments:\n`) +
    chalk.hex(WIKI_PREFIX_COLOR)('✔ ⇨ ') +
    chalk.hex(WIKI_TEXT_HEX_COLOR)(
      `${CMD_KEY_MAPS.HELP.join(' or ')}: show commands help.\n`
    ) +
    chalk.hex(WIKI_PREFIX_COLOR)('✔ ⇨ ') +
    chalk.hex(WIKI_TEXT_HEX_COLOR)(
      `${CMD_KEY_MAPS.VIEW_BASE.join(
        ' or '
      )}: the view base dir argument,also can use cross-env VIEW_BASE=<base path>.\n`
    ) +
    chalk.hex(WIKI_PREFIX_COLOR)('✔ ⇨ ') +
    chalk.hex(WIKI_TEXT_HEX_COLOR)(
      `${CMD_KEY_MAPS.MOD_PATH.join(
        ' or '
      )} : the function module path, or use cross-env MOD_PATH=<module path>` +
        '\n\t Like: -m views/aaa/bb-func.jsx\n'
    ) +
    chalk.hex(WIKI_PREFIX_COLOR)('✔ ⇨ ') +
    chalk.hex(WIKI_TEXT_HEX_COLOR)(
      `${CMD_KEY_MAPS.MOD_NAME.join(
        ' or '
      )}: the view base dir argument,or use cross-env MOD_NAME=<module name>.\n`
    ) +
    '\n✨✨✨\n' +
    chalk.hex(WIKI_PREFIX_COLOR)('  Priority : -m < --mod-path < cross-env') +
    '\n✨✨✨\n';
  return c;
}
