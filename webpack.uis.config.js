module.exports = {
  entry: "./src/uis.ts",
  devtool: "source-map",
  output: {
    filename: "uis.bundle.js",
    path: `${__dirname}/dist`,
    chunkFormat: false,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    symlinks: true,
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: "ts-loader" },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
    ],
  },
  externals: {
    react: "React",
    "@peers-app/peers-sdk": "PeersSDK",
    "@peers-app/peers-ui": "PeersUI",
    zod: "zod",
  },
};
