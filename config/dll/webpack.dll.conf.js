/**
 * 打包dll文件，提取常用文件不加入打包流程，加速打包
 */
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { library } = require("./dll.config.js");

// dll文件存放的目录
const dllPath = "vendor";
module.exports = {
  // 入口文件
  entry: {
    ...library
  },
  // 输出文件
  output: {
    path: path.join(__dirname, dllPath),
    filename: "dll.[name].[hash:8].js",
    library: "[name]_[hash]"
  },
  plugins: [
    // 清除之前的dll文件
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      path: path.join(__dirname, dllPath, "[name]-manifest.json"),
      name: "[name]_[hash]"
    })
  ]
};