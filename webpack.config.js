const path = require("path");
const os = require('os');
const webpack = require("webpack");
const WebpackBar = require("webpackbar");
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const glob = require("glob");
const { cache } = require("webpack");

const PATHS = {
  src: path.join(__dirname, "src"),
};

const CUPS = os.cpus()

const isDev = process.env.NODE_ENV === 'development' // 是否是开发模式
console.log("========= isDev =========", isDev, path.resolve('src'))

module.exports = {
  // mode: isDev ? "development" : "production",
  mode: "development",
  devtool: "source-map",
  entry: {
    main: "./src/index.js",
  },
  cache: {
    type: 'filesystem', // 
    cacheDirectory: path.resolve(__dirname, 'cache')
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    // filename: 'bundle.[hash:5].js',
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/",
  },
  externals: {
    // 检查是否有这样的配置，将其删除或注释掉
    react: "React",
    "react-dom": "ReactDOM",
    lodash: "_"
  },
  // watch: true,
  // context: path.resolve(__dirname, "src"),
  // target: 'web' // web node
  // resolve: {},
  // external: {},
  optimization: {
    // usedExports: true
    minimizer: isDev ? [] : [
      new CssMinimizerPlugin(), // 压缩css

      new TerserPlugin({ // 压缩js
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"] // 删除console.log
          }
        }
      }),
    ],
  },
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
    setupMiddlewares: require('./mock.js'),
  },
  resolve: {
    extensions: [".jsx", ".js", ".tsx", ".ts", ".json"],
    alias: {
      "@": path.join(__dirname, "./src"),
      components: path.resolve(__dirname, 'src/components'),
      // 'common-variables': path.resolve(__dirname, 'common/css/variable.less'),
    },
    // modules: [path.resolve("node_modules")], // 指定去本项目 node_modules 查找模块，不允许向上查找，全局
  },
  // 找loader的解析路径
  // resolveLoader: {
  //   modules: ['loaders', 'node_modules']
  // },
  module: {
    // noParse: /lodash/,
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, // 匹配.ts, tsx文件
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: typeof CUPS !== 'undefined' ? CUPS.length : 1
            }
          },
          {
            loader: "babel-loader",
            // options: {
            //   // 预设执行顺序由右往左,所以先处理ts,再处理jsx
            //   presets: ["@babel/preset-react", "@babel/preset-typescript"],
            // },
          },
        ]
      },
      {
        test: /isarray\.js/,
        use: [
          {
            loader: "expose-loader",
            options: {
              exposes: {
                globalName: "isarray",
                override: true, // window 如果有覆盖
              }
            }
          }
        ]
      },
      {
        test: /.css$/, //匹配 css和less 文件
        use: [
          // "style-loader",
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
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
              esModule: false,

              // sourceMap: true,
             
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

    new WebpackBar(),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
      // chunks: ['all']
      // filename: "my App --",
      title: "My App",
    }),

    new webpack.DefinePlugin({
      'process.env.N_ENV': JSON.stringify(process.env.N_ENV),
      '__insert_blade__': "INSERT_BLADE_01"
    }),

    // 每个 tsx 文件自动引入 import isarray from 'isarray';
    // 建议和  expose-loader 取其中一个
    // new webpack.ProvidePlugin({
    //   isarray: "isarray"
    // })

    // 忽略 moment 模块下的 locale 资源
    new webpack.IgnorePlugin({
        contextRegExp: /moment$/,
        resourceRegExp: /locale/
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css' // 抽离css的输出目录和名称
    }),

    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './public'), // 复制public下文件
          to: path.resolve(__dirname, './dist'), // 复制到dist目录中
          filter: source => {
            return !source.includes('index.html') // 忽略index.html
          }
        },
      ],
    }),

    /**
     * 合并多余文件 "./src/title.js": function() {}
     * 
     * 生产  var title = "hello title";
     *      var src_title = (title);
     * 
     */
    new webpack.optimize.ModuleConcatenationPlugin(),
    // new PurgeCSSPlugin({
    //   paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    // })
  ],
};

// https://static.kancloud.cn/cyyspring/webpack/2015728
