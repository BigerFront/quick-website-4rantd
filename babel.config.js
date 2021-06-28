const presets = [
  [
    '@babel/preset-env',
    {
      modules: false,
      targets: {
        browsers: ['last 1 version', '> 5%', 'not dead'],
      },
      // useBuiltIns: 'usage', // 按需引入不支持的es6 方法,like includes
      // corejs: 3,
      debug: false, //方便调试
    },
  ],
  '@babel/preset-react',
  '@babel/preset-typescript',

  // 'react-app',
];

const plugins = [
  [
    '@babel/plugin-transform-runtime',
    {
      corejs: {
        version: 3,
        proposals: true,
      },
      useESModules: true,
    },
  ],
  [
    'babel-plugin-import',
    {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    },
  ],
  [
    'import',
    {
      libraryName: '@ant-design/icons',
      // libraryDirectory: 'es/icons',
      camel2DashComponentName: false,
      customName: function (transformedMethodName) {
        // console.log('Antd Icons>>>>>>', transformedMethodName);
        if (transformedMethodName === 'default') {
          return '@ant-design/icons/es/components/Icon';
        } else {
          return `@ant-design/icons/es/icons/${transformedMethodName}`;
        }
      },
    },
    '@ant-design/icons',
  ],
  'react-hot-loader/babel',
];

module.exports = function (api) {
  api.cache(true);
  return { presets, plugins };
};
