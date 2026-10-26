module.exports = {
  entry: "./src/routes.ts",
  devtool: "source-map",
  output: {
    filename: "routes.bundle.js",
    path: `${__dirname}/dist`,
    chunkFormat: false,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    symlinks: true,
  },
  module: {
    rules: [{ test: /\.tsx?$/, use: "ts-loader" }],
  },
  externals: {
    react: "React",
    "@peers-app/peers-sdk": "PeersSDK",
    "@peers-app/peers-ui": "PeersUI",
    zod: "zod",
  },
};
