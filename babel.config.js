// babel.config.js
/**
 * 课时74 = useBuiltIns
 */

module.exports = {
  // options: {
  //   cacheDirectory: true, // 打包的缓存起来
  // },
  // 执行顺序由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
  presets: [
    [
      "@babel/preset-env", // 默认只能转换ES6语法
      {
        // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        // "targets": {
        //  "chrome": 35,
        //  "ie": 9
        // },
        // 按需引入, 缺点污染全局变量
        useBuiltIns: "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        corejs: 3 // 配置使用core-js使用的版本
      }
    ],
    "@babel/preset-react",
    // "@babel/preset-typescript"
  ],
  plugins: [
    ["@babel/plugin-transform-runtime", {
      corejs: false,
      helpers: true, // 公共方法提取
      regenerator: false, // 提供的 polyfill 有可能污染全局变量
    }],
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
  ].filter(Boolean)
}
