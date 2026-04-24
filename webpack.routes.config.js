var webpack = require("webpack");

module.exports = {
  entry: "./src/routes.ts",
  devtool: "source-map",

  output: {
    filename: "routes.bundle.js",
    path: __dirname + "/dist",
    chunkFormat: false,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    symlinks: true,
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    // Target older browsers to ensure full async/await transpilation for Hermes
                    targets: "ie 11",
                  },
                ],
              ],
            },
          },
          "ts-loader",
        ],
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

      // css loader
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
    ],
  },

  // must use the global react object for the UI to load correctly
  externals: {
    react: "React",
    "@peers-app/peers-sdk": "PeersSDK",
    "@peers-app/peers-ui": "PeersUI",
    zod: "zod",
  },
};
