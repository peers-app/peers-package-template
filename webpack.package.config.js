const path = require('path');

module.exports = {
  entry: './src/package.ts',
  devtool: 'source-map',

  output: {
    filename: 'package.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs2',   // so we can `require()` or `eval()` easily
    },
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    symlinks: true,
    fallback: {
      // optional: avoid pulling in Node polyfills
      fs: false,
      path: false,
      crypto: false,
    },
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },

  externals: {
    // treat peers runtime API as external
    '@peers-app/peers-sdk': 'PeersSDK',
    'zod': 'zod',
  },
};