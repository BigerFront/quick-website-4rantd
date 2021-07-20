const chalk = require('chalk');
const fs = require('fs-extra');
const emoji = require('node-emoji');
const { capitalize } = require('lodash');

const { src, R } = require('../paths');
const getConfiguration = require('./config');

let Config = {};
/** Controll options */
const CFG_OPTS = {
  debugScript: true,
};

const OUT_OPT = {
  encoding: 'utf8',
};

main()
  .then((message) => {
    console.log(message);
  })
  .catch((err) => {
    console.error(
      chalk.redBright('♘♘♘----- ERROR -------♘♘♘') + '\n' + err.message
    );
  });
/** function  */
async function main() {
  Config = await getConfiguration();
  printDebug(
    chalk.rgb(153, 50, 204)(JSON.stringify(Config, null, 2)),
    'Command args'
  );

  const subEntryBase = process.env.SUB_ENTRY || Config.SUB_ENTRY;
  const { modName, modPath, corename } = Config;

  const baseViewPath = subEntryBase
    ? R(src, Config.VIEW_BASE, subEntryBase)
    : R(src, Config.VIEW_BASE);

  const params = modNameParser(modName, subEntryBase, corename);

  const viewModPath = checkedViewMod(baseViewPath, modPath, params);

  //
  createIndexFile(viewModPath, params);

  // scss file
  createScssFile(viewModPath, params);

  createComponent(viewModPath, params);

  createContainer(viewModPath, params);

  return successMsg(viewModPath, params);
}

function successMsg(viewModPath, params) {
  // console.log(JSON.stringify(viewParams, null, 2));
  const { modName, view } = params;

  const { compFileName, scssFileName, containerFileName } = view;

  let msgTitle = `✨✨✨  Create view module [${modName}] success!`;

  console.log('🎉🎉🎉🎉🎉✨✨✨ noContainer >>', Config.noContainer);
  let msg =
    chalk.greenBright(msgTitle) +
    '  ✨✨✨' +
    '\n' +
    chalk.blue(`    In ${viewModPath}:\n`) +
    chalk.hex('#FF7F50')('\t- index.js\n') +
    chalk.hex('#FF7F50')(`\t- ${compFileName}\n`) +
    chalk.hex('#FF7F50')(`\t- ${scssFileName}\n`);

  if (!Config.noContainer)
    msg += chalk.hex('#FF7F50')(`\t- ${containerFileName}\n`);

  return msg;
}

function checkedViewMod(baseView, modName, params) {
  const { compFileName, containerFileName, scssFileName } = params.view;

  const viewModPath = R(baseView, modName);

  if (fs.existsSync(R(viewModPath, 'index.js'))) {
    const errMsg = `Module ${modName} already exists in ${baseView} directory. Please remove or use another MOD_NAME.`;
    throw new Error(errMsg);
  }

  if (fs.existsSync(R(viewModPath, compFileName))) {
    const errMsg = `Module file ${compFileName} already exists in ${baseView} directory. Please remove or use another MOD_NAME.`;
    throw new Error(errMsg);
  }

  if (fs.existsSync(R(viewModPath, scssFileName))) {
    const errMsg = `Module file ${scssFileName} already exists in ${baseView} directory. Please remove or use another MOD_NAME.`;
    throw new Error(errMsg);
  }

  if (fs.existsSync(R(viewModPath, containerFileName))) {
    const errMsg = `Module file ${containerFileName} already exists in ${baseView} directory. Please remove or use another MOD_NAME.`;
    throw new Error(errMsg);
  }
  return viewModPath;
}

function modNameParser(modName, subEntryBase, corename) {
  // modName : a-b
  const mns = modName.split(/\-/);
  let coreName = mns.length > 1 ? mns[1] : mns[0];

  const notPage = Config.notPage;

  const corenameSeted = Boolean(corename);

  let rootClzPrefix = corenameSeted ? corename : coreName;
  rootClzPrefix =
    rootClzPrefix.split(/-/).filter((it) => it !== 'index').length > 0
      ? rootClzPrefix
          .split(/-/)
          .filter((it) => it !== 'index')
          .join('-')
      : rootClzPrefix;

  const _params = {
    corename,
    modName,
    subEntryBase,
    view: {
      extendsComp: notPage ? 'Component' : 'PureComponent',
      compName: `${capitalize(coreName)}${notPage ? 'Component' : 'Page'}`, //
      compFileName: `${coreName}-comp.jsx`, //
      containerFileName: `${coreName}-container.js`,
      scssFileName: corenameSeted
        ? `${corename}.scss`
        : `${mns.filter((n, i) => i < 2).join('-')}.scss`,
      rootClassName: notPage
        ? `${rootClzPrefix}-container`
        : `${rootClzPrefix}-page`,
    },
  };

  printDebug(
    chalk.hex('#800080')(JSON.stringify(_params, null, 2)),
    'Mod Parameters'
  );
  return _params;
}

function createIndexFile(viewModPath, params) {
  const { modName, view } = params;

  const { compFileName, scssFileName, containerFileName } = view;

  let COMMENTS_TPL = '';
  if (!Config.noComments) {
    COMMENTS_TPL +=
      '/**\n' +
      ' *\n' +
      ` * @module: ${modName}\n` +
      ` *   Main file: index.js\n` +
      ` *   DOM files: ${compFileName},${scssFileName},${
        Config.noContainer ? containerFileName : ''
      }\n` +
      ` * @Created: ${Config.C_AUTHOR || ''} ${Config.C_CURRTS}\n` +
      ` * \n` +
      ' */\n';
  }
  const relativeFile = Config.noContainer ? compFileName : containerFileName;
  const INDEX_TPL = `export { default } from './${relativeFile}';\n`;

  fs.outputFileSync(
    R(viewModPath, 'index.js'),
    COMMENTS_TPL + INDEX_TPL,
    OUT_OPT
  );
}

function createScssFile(viewModPath, params) {
  const notPage = Config.notPage;
  const { modName, view } = params;
  let SCSS_TPL =
    '/**\n' +
    ` * This file is used to define the ${view.compName} style.\n` +
    ` * This file must be imported into parent scss file, to take it effect.\n` +
    ` * like : @import './${modName}/${view.scssFileName}';\n` +
    '*/\n' +
    `.${view.rootClassName} {\n  &__wrapper {\n    width: 100%;\n    display: flex;`;

  if (notPage) {
    SCSS_TPL += '\n    flex-flow: row;';
  } else {
    SCSS_TPL += '\n    flex-flow: column nowrap;';
  }

  SCSS_TPL += '\n  }\n}\n';

  fs.outputFileSync(R(viewModPath, `${view.scssFileName}`), SCSS_TPL, OUT_OPT);
}

function createComponent(viewModPath, params) {
  const notPage = Config.notPage;

  const { modName, view } = params;
  const prefixClassName = view.rootClassName || '';

  const IMP_TPL =
    `import React, { ${view.extendsComp} } from 'react';\n` + '\n';

  const COMP_TPL_OPEN = `export default class ${view.compName} extends ${view.extendsComp} {\n`;
  const COMP_TPL_CLOSE = '}\n';

  let COMP_TPL_CONTENT = '  state = {};\n';

  if (!notPage) {
    // header
    COMP_TPL_CONTENT +=
      '\n' +
      '  renderHeader() {\n' +
      `    return <div className="${prefixClassName}__header"> ${modName} Header</div>;\n` +
      '  }\n';

    // content
    COMP_TPL_CONTENT +=
      '\n' +
      '  renderContent() {\n' +
      `    return <div className="${prefixClassName}__main">${modName} Content</div>;\n` +
      '  }\n';

    //
    COMP_TPL_CONTENT +=
      '\n' +
      '  renderFooter() {\n' +
      `    return <div className="${prefixClassName}__footer">${modName} Footer</div>;\n` +
      '  }\n';

    // render
    COMP_TPL_CONTENT +=
      '\n' +
      '  render() {\n' +
      '    // const { xxx } = this.props;\n\n' +
      '    return (\n' +
      `      <div className="${prefixClassName}">\n` +
      `        {this.renderHeader()}\n` +
      `        {this.renderContent()}\n` +
      '        {this.renderFooter()}\n' +
      '      </div>\n' +
      '    );\n' +
      '  }\n';
  } else {
    COMP_TPL_CONTENT +=
      '\n' +
      '  render() {\n' +
      '    // const { xxx } = this.props;\n\n' +
      '    return ' +
      `<div className="${prefixClassName}">` +
      `${modName} html write here!` +
      '</div>;\n' +
      '  }\n';
  }

  const OUT_TPL = IMP_TPL + COMP_TPL_OPEN + COMP_TPL_CONTENT + COMP_TPL_CLOSE;

  fs.outputFileSync(R(viewModPath, view.compFileName), OUT_TPL, OUT_OPT);
}

function createContainer(viewModPath, params) {
  const { modName, view } = params;
  const { compName, compFileName, containerFileName } = view;

  const TPL_IMPORT =
    "import { compose } from 'redux';\n" +
    `import { connect } from 'react-redux';\n` +
    `import { withRouter } from 'react-router-dom';\n` +
    '\n' +
    `import ${compName} from './${compFileName}';\n`;

  let COMMENTS_TPL = '\n';
  if (!Config.noComments) {
    COMMENTS_TPL +=
      '/**\n' +
      ' *\n' +
      ` * @module: ${modName} \n` +
      ` * @Created: ${Config.C_AUTHOR || ''} ${Config.C_CURRTS}\n` +
      ' * make state inject into react dom props\n' +
      ' *\n' +
      ' */\n';
  }

  // mapState
  const TPL_MAP_STATE =
    'const mapStateToProps = (state) => {\n' +
    '  const { skinState:{header} } = state; // global state contains skinState ... ed.\n' +
    '\n' +
    '  return {\n' +
    '    header,\n' +
    '  };\n' +
    '};\n';

  const TPL_MAP_DISPATCH =
    '\n' +
    'const mapDispatchToProps = (dispatch) => {\n' +
    '  return {\n' +
    '    // doSomeThing:(arg1,arg2) => (dispatch) => {\n' +
    '    //   ...\n' +
    '    //   dispatch(action);\n' +
    '    // },\n' +
    '  };\n' +
    '};\n';

  const EXP_TPL =
    '\n' +
    'export default compose(\n' +
    '  withRouter,\n' +
    `  connect(mapStateToProps, mapDispatchToProps)\n` +
    `)(${compName});\n`;

  const OUTPUT_TPL =
    TPL_IMPORT + COMMENTS_TPL + TPL_MAP_STATE + TPL_MAP_DISPATCH + EXP_TPL;

  if (!Config.noContainer)
    fs.outputFileSync(R(viewModPath, containerFileName), OUTPUT_TPL, OUT_OPT);
}
function printDebug(strInfo, tag) {
  if (CFG_OPTS.debugScript) {
    let debugMsg = `👉👉👉 DEBUG INFO: ${tag || ''} 👀\n` + strInfo || '';
    console.log(debugMsg);
  }
}

function showEmoji(code) {
  return chalk.bold.yellowBright(emoji.emojify(code, (name) => name));
}
