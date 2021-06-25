class NullWebpackPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('NullWebpackPlugin', (compilation) => {});
  }
}

module.exports = NullWebpackPlugin;
