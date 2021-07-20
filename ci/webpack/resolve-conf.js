const { R, src } = require('../paths');

const alias = {
  '~': src,
  '~Assets': R(src, 'assets'),
  '~Lib': R(src, 'lib'),
  '~Layouts': R(src, 'layouts'),
  '~Pages': R(src, 'pages'),
  '~Store': R(src, 'store'),
  '~UI': R(src, 'ui'),
  '~Views': R(src, 'views'), // 备用
  '~Widgets': R(src, 'ui/widgets'),
  'react-dom': '@hot-loader/react-dom',
};

const fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

module.exports = { alias, fileExtensions };
