const chalk = require('chalk');

const { R, dist } = require('./paths');
const { TARGET_TYPE, PUBLIC_PATH } = require('../config');

const PROT = 18964;

const { createProxyMiddleware } = require('http-proxy-middleware');

const apiProxy = createProxyMiddleware('/api', {
  target: 'xxx',
  changeOrigin: true, // for vhosted sites
});

module.exports = {
  port: PROT,
  browser: ['chrome'],
  files: ['./src/**/*.{html,scss,js,jsx}'],
  server: {
    baseDir: R(dist, TARGET_TYPE),
    // middleware: {
    //   10: apiProxy,
    // },
  },
  open: true,
};
