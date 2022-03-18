/**
 * 获取打包/运行项目的配置集合
 */
const path = require('path');
const fs = require('fs');

const ENV = process.env;
const RootPath = path.resolve(__dirname, '../../src/pages');
const DefTmp = path.resolve(__dirname, '../../public/index.html');


let isBuild = ENV.NODE_ENV == 'production';
let RUN_PAGE = !isBuild ? ENV.RUN_PAGE : ENV.page || ENV.BUILD_PAGE;
let env_page = RUN_PAGE ? RUN_PAGE.split(',') : ''; // 指定page 默认全部
let arrPages = [];
if (env_page) {
  env_page.forEach(item => {
    if (fs.existsSync(RootPath + '/' + item)) {
      // 存在指令指定page
      arrPages.push(item);
    }
  });
} else {
  // 读取/src/pages所有文件夹名
  arrPages = fs.readdirSync(RootPath);
}

/**
 * 读取顺序 page/index.html page/[page].html 公共模板public/index.html
 * @param {*} curPath
 * @param {*} arrName
 * @param {*} DefTmp
 */
function getPossibleFile (curPath, arrName, DefTmp) {
  let file = DefTmp;
  for (let i = 0; i < arrName.length; i++) {
    let name = arrName[i];
    let filePath = path.join(curPath, name);
    if (fs.existsSync(filePath)) {
      file = filePath;
      break;
    }
  }
  return file;
};

function getCdn(page) {
  // CDN引入外部依赖文件
  const CDN = {
    css: [],
    js: [
      // 'https://cdn.bootcss.com/vue/2.6.11/vue.runtime.min.js',
      // 'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js',
      // 'https://cdn.bootcss.com/vuex/3.1.2/vuex.min.js',
      // 'https://cdn.bootcss.com/axios/0.18.0/axios.min.js'
    ]
  };
  return CDN;
};

let configPages = {}; // pages配置
let configRewrites = []; // 用于配置多页面时 historyApiFallback
arrPages.forEach((page, index, arr) => {
  let pagePath = path.resolve(RootPath, page);
  let filename = page + '.html';
  let filePath = path.join(pagePath, 'config/index.js')
  let fileConfig
  //去对应项目下的页面参数配置
  if(fs.existsSync(filePath)) {
    let fileDefaultConfig = require(filePath)
    fileConfig = {
      title: fileDefaultConfig.title,
      CDN_URL: fileDefaultConfig.CDN_URL,
      // 监控应用标识
      appKey: fileDefaultConfig.appKey
    }
  }
  configPages[page] = Object.assign({
    // page 的入口
    entry: path.join(pagePath, 'main.js'),
    // 模板来源 读取顺序 page/index.html page/[page].html 公共模板public/index.html
    template: getPossibleFile(pagePath, ['index.html', page + '.html'], DefTmp),
    // 在 dist/index.html 的输出
    filename: filename,
    // 当使用 title 选项时，
    // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: page + 'Page',
    cdn: getCdn(page),
    // 在这个页面中包含的块，默认情况下会包含
    // 提取出来的通用 chunk 和 vendor chunk。
    chunks: ['runtime', 'chunk-vendors', 'chunk-common', page]
  },fileConfig);
  configRewrites.push({
    from: new RegExp(`^${ENV.VUE_APP_PUBLIC_PATH}${page}(/.*)?$`),
    to: `/${filename}`
  });
});
// console.log(configPages);
module.exports = {
  configPages,
  configRewrites
};
