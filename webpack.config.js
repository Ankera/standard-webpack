const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    main: "./index.js",
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[hash:5].js',
    clean: true, // 在生成文件之前清空 output 目录
    // dry: true,
  },
  context: path.resolve(__dirname, "src"),
  // target: 'web' // web node
  // resolve: {},
  // external: {},
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    proxy: {
      
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      // chunks: ['all']
      // filename: "my App --",
      title: 'My App',
    })
  ]
};

// https://static.kancloud.cn/cyyspring/webpack/2015728
