const { R, src } = require('../paths');

const entry = {
  main: R(src, 'Boot', 'index.js'),
};
const notHotReload = ['devtools'];

const htmlExternals = [
  {
    module: 'react',
    global: 'React',
    entry: {
      path: 'umd/react.production.min.js',
    },
  },
  {
    module: 'react-is',
    global: 'ReactIs',
    entry: {
      path: 'umd/react-is.production.min.js',
    },
  },
  {
    module: 'react-dom',
    global: 'ReactDOM',
    entry: {
      path: 'umd/react-dom.production.min.js',
    },
  },
  {
    module: 'react-router',
    global: 'ReactRouter',
    entry: {
      path: 'umd/react-router.min.js',
      attributes: {
        // integrity:
        //   'sha512-sWGrnSIvNDdGRsqnFIm5q1uHjPt5912wNVBK9vChpbHPReP96giWBGeztcd/rva+n82nQLTJ1SFbZqLHbCqMiw==',
        // crossorigin: 'anonymous',
      },
    },
  },
  {
    module: 'react-router-dom',
    global: 'ReactRouterDOM',
    entry: {
      path: 'umd/react-router-dom.min.js',
    },
  },
  {
    module: 'redux',
    global: 'Redux',
    entry: {
      path: 'dist/redux.min.js',
    },
  },
  {
    module: 'redux-logger',
    global: 'reduxLogger',
    entry: {
      path: 'dist/redux-logger.js',
    },
  },
  {
    module: 'antd',
    global: 'antd',
    entry: {
      path: 'dist/antd.min.js',
    },
  },
  {
    module: 'antd',
    entry: 'dist/antd.min.css',
  },
];

module.exports = {
  htmlExternals,
  entry,
  notHotReload,
};
