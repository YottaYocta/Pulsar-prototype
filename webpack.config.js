const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: "PULSAR",
      metaDesc: "RLTTB",
      template: "./src/templates/index.html",
      filename: "index.html",
      inject: "body",
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/assets", to: "assets" }
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/transform-runtime"],
          }
        },
      },
    ],
  },
  entry: "./src/bundle/index.js",
  mode: "development",
  output: {
    clean: true,
  },
  devServer: {
    contentBase: "./dist",
    open: true,
  },
};
