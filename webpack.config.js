var webpack = require('webpack');

module.exports = {
  // entry: './src/index.ts',
  entry: './src/index.ui.ts',

  mode: 'development',
  watch: true,
  devtool: 'source-map',
  
  output: {
    filename: '00m4okzm28k8tqhmrcw00mcyp.uis.js',
    path: __dirname + '/dist',
    chunkFormat: false,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    symlinks: true,
  },
  
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts -loader'.
      { test: /\.tsx?$/, loader: "ts-loader" },
      
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

      // css loader
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
    ]
  },

  // must use the global react object for the UI to load correctly
  externals: {
    "react": "React",
  },
};