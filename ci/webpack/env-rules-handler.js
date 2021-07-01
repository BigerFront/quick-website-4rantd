const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { compactThemeSingle } = require('antd/dist/theme');
const { AntdThemeVariables, AntdDarkThemeVariables } = require('../theme');

const antdLessRule = {
  test: /antd.*\.less$/,
  use: [
    'css-loader',
    {
      loader: 'less-loader',
      options: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            ...compactThemeSingle,
            ...AntdThemeVariables,
          },
        },
        // javascriptEnabled: true,  // less-loader < 6
      },
    },
  ],
};

const scssRule = {
  test: /\.(sa|sc|c)ss$/,
  use: [
    {
      loader: 'css-loader', // 将CSS转化成ComminJS模块
    },
    {
      loader: 'resolve-url-loader', // 置于 loader 链中的 sass-loader 之前，就可以重写 url ,解决url()
    },
    {
      loader: 'sass-loader', //将Sass 编译成CSS
      options: {
        sourceMap: true,
        implementation: require('sass'),
        sassOptions: {
          fiber: require('fibers'),
        },
      },
    },
  ],
};

function envRulesHandle(config, isDev = false) {
  if (isDev) {
    antdLessRule.use = ['style-loader'].concat(antdLessRule.use);
    scssRule.use = ['style-loader'].concat(scssRule.use);
  } else {
    antdLessRule.use = [MiniCssExtractPlugin.loader].concat(antdLessRule.use);
    scssRule.use = [MiniCssExtractPlugin.loader].concat(scssRule.use);
  }

  config.module.rules = [antdLessRule, scssRule].concat(
    config.module.rules || []
  );
}

function envDevToolHandle(config, NODE_ENV, devtool) {
  config.devtool = devtool;
  if (NODE_ENV === 'production') {
  } else if (NODE_ENV === 'development') {
    config.target = 'web';
    config.stats = {
      // colors: '\u001b[32m',
      // entrypoints: 'auto',
      errors: true,
      errorDetails: true,
    };
  }
}
module.exports = {
  envRulesHandle,
  envDevToolHandle,
};
