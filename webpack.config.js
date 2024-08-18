const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    main: "./index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    // filename: 'bundle.[hash:5].js',
    clean: true, // 在生成文件之前清空 output 目录
    publicPath: "/",
  },
  // watch: true,
  context: path.resolve(__dirname, "src"),
  // target: 'web' // web node
  // resolve: {},
  // external: {},
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    // open: true, // 是否自动打开浏览器
    // proxy: {
    //   "/api": {
    //     target: "https://open.duyidu.com",
    //     changeOrigin: true, // 更改请求头中的 host 和 origin
    //   },
    // },
  },
  resolve: {
    extensions: [".jsx", ".js", ".tsx", ".ts"],
    alias: {
      "@": path.join(__dirname, "./src"),
      // 'common-variables': path.resolve(__dirname, 'common/css/variable.less'),
    },
    // modules: [path.resolve("node_modules")], // 指定去本项目 node_modules 查找模块，不允许向上查找，全局
  },
  module: {
    rules: [
      {
        test: /.css$/, //匹配 css和less 文件
        use: [
          "style-loader",
          {
            loader: "css-loader",
            // exclude: path.resolve(__dirname, 'src/styles/global'),
            // options: {
            //   modules: {
            //     auto: true, // 根据文件名自动决定是否使用 CSS Modules
            //     localIdentName: "[name]__[local]-[hash:base64:5]",
            //   },
            // },
            options: {
              // url: false,
              // import: false,
              modules: true,
              // sourceMap: true,
              esModule: false,
              // importLoaders: 0
            },
          },
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        /**
         *
         */
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 1 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/images/[hash:8]_[name][ext]", // 文件输出目录和命名
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/fonts/[name][ext]", // 文件输出目录和命名
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/media/[name][ext]", // 文件输出目录和命名
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
      // chunks: ['all']
      // filename: "my App --",
      title: "My App",
    }),

    new webpack.DefinePlugin({
      'process.env.N_ENV': JSON.stringify(process.env.N_ENV)
    })
  ],
};

// https://static.kancloud.cn/cyyspring/webpack/2015728
