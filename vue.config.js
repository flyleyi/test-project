const proxy = require('./config/tools/proxy'); //引入代理模块
const fs = require('fs');
const path = require('path'); //引入node的path模块
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin; //引入analyzer模块
const { configPages, configRewrites } = require('./config/tools/page-hooks');
const TerserPlugin = require('terser-webpack-plugin'); //去console优化
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const webpack = require('webpack');
const { library } = require('./config/dll/dll.config.js'); //dll配置项
const dllPath = './config/dll/vendor/'; //dll存放目录
const ENV = process.env;

let isDev = ENV.NODE_ENV == 'development';
let mode = ENV.mode; //打包模式 com/sit/prd
console.log('vue-config:', ENV.NODE_ENV);
let sPublicPath = ENV.VUE_APP_PUBLIC_PATH; //获取项目运行打包的基础publicpath  /wap
let sRunPage = ENV.RUN_PAGE; //获取运行项目集合
let sRunPageArr = sRunPage.split(',');
let sBuildPage = ENV.page || ENV.BUILD_PAGE; // 优先读取指令page 再读取.env配置的BUILD_PAGE
if (ENV.type === 'build') {
  //打包模式
  console.log(
    'start build' + '|' + sPublicPath + sBuildPage + '===================='
  );
} else {
  //运行模式
  console.log(
    'start run' + '|' + sPublicPath + sRunPageArr + '===================='
  );
  //增加proxy代理配置，单项目代理配置
  sRunPageArr.forEach(rPage => {
    let proxyPath = resolve(`src/pages/${rPage}/proxy.js`);
    //运行项目存在proxy.js，将代理配置补充到全局
    if (fs.existsSync(proxyPath)) {
      Object.assign(proxy, require(proxyPath));
    }
  });
}
let realPages = {}; //项目多页入口配置

if (ENV.type === 'build' && !sBuildPage) {
  //打包模式，必须指定打包项目
  throw new Error('必须指定单次打包项目');
} else if (ENV.type == 'build' && sBuildPage) {
  //打包模式，指定打包入口
  ENV.NODE_ENV = 'production'; //打包使用production变量
  realPages[sBuildPage] = configPages[sBuildPage];
} else if (ENV.type != 'build' && sRunPageArr.length > 0) {
  //运行模式，运行指定多page
  sRunPageArr.map(function(runPage) {
    let pageData = configPages[runPage];
    if (pageData) realPages[runPage] = pageData;
  });
}
//未指定或者指定了错误page，则默认运行全部
if (Object.keys(realPages) == 0) {
  realPages = configPages;
}
//打包，cdn从项目获取
let CDN_URL = ENV.CDN_URL;
let buildPage = realPages[sBuildPage];
//异常处理
if (ENV.type === 'build' && !buildPage) {
  throw new Error(`打包项目路径src/pages/${sBuildPage}不存在`);
}
if (ENV.type === 'build' && buildPage.CDN_URL != undefined) {
  CDN_URL = realPages[sBuildPage].CDN_URL;
}
function resolve(dir) {
  return path.join(__dirname, dir);
}
//打包后的publicpath
let buildPublicPath = `${CDN_URL + sPublicPath + sBuildPage}`;
require('events').EventEmitter.defaultMaxListeners = 20;
module.exports = {
  pages: realPages,
  // 打包后的文件夹名称，默认dist
  outputDir: `dist${sPublicPath + sBuildPage}`,
  publicPath: isDev ? '/' : buildPublicPath, // 从.env配置中获取
  productionSourceMap: isDev || mode != 'prd', // 生产环境是否开启source map
  configureWebpack() {
    let config = {
      devServer: {
        historyApiFallback: {
          verbose: true,
          index: '/404.html',
          htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'], // 针对转发请求类型
          rewrites: configRewrites
        }
      },
      // 去除console
      optimization: {
        runtimeChunk: 'single', //打包模式加缓存，增量打包
        splitChunks: {
          cacheGroups: {
            vendors: {
              name: 'chunk-vendors',
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              chunks: 'initial'
            },
            common: {
              name: 'chunk-common',
              minChunks: 2,
              priority: -20,
              chunks: 'initial',
              reuseExistingChunk: true
            }
          }
        },
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              //打包后去除console.log
              compress: { pure_funcs: ['console.log'] }
            }
          })
        ]
      },
      // 不从bundle中引用依赖，解决的是，所创建的 bundle 依赖于那些存在于用户环境(consumer environment)中的依赖。
      externals: {
        // vue: 'Vue',
        // vuex: 'Vuex',
        // 'vue-router': 'VueRouter',
        // axios: 'axios',
      },
      plugins: [], //[isDev ? () => {} : new BundleAnalyzerPlugin()], // 打包分析插件加载
      //生产环境去除source-map
      devtool: isDev || mode != 'prd' ? 'source-map' : undefined
    };
    //打包模式，将公用提取成dll，不加入打包
    if (ENV.type === 'build') {
      config.plugins = config.plugins.concat([
        ...Object.keys(library).map(name => {
          return new webpack.DllReferencePlugin({
            context: '.',
            manifest: path.join(dllPath, `${name}-manifest.json`)
          });
        }), // 将 dll 注入到 生成的 html 模板中
        new AddAssetHtmlPlugin({
          // dll文件位置
          filepath: resolve(dllPath + '*.js'),
          // dll 引用路径
          publicPath: buildPublicPath + '/vendor',
          // dll最终输出的目录
          outputPath: './vendor'
        })
      ]);
    }
    return config;
  },
  devServer: {
    proxy,
    open: isDev,
    // 打开页面路径：基础路径 + 指定页面（默认demo）
    openPage: `${
      sPublicPath ? sPublicPath.replace(/^\//, '') : ''
    }${sRunPage.split(',')[0] || 'demo'}`,
    port: 8989,
    disableHostCheck: true // 花生壳内网穿透配置true
  },
  css: {
    loaderOptions: {
      //scss全局配置
      // sass: {
      //   prependData: '@import "@/assets/less/variable.less";'
      // },
      postcss: {
        plugins: [
          //px换算rem
          require('postcss-pxtorem')({
            rootValue: 50, // 换算的基数
            propList: ['*'],
            exclude: function(file) {
              const includes = [
                // 包含/src/pages/h5目录下的文件
                function(file) {
                  return file.indexOf(path.normalize('/src/pages/h5/')) > -1;
                },
                // 包含/src/pages/h5目录下的文件
                function(file) {
                  return (
                    file.indexOf(path.normalize('/src/pages/catering-h5/')) > -1
                  );
                },
                function(file) {
                  return (
                    file.indexOf(path.normalize('/src/pages/visitor\-h5/')) > -1
                  );
                },
                // 包含vant插件
                function(file) {
                  return (
                    file.indexOf(path.normalize('/node_modules/vant/')) > -1
                  );
                }
              ];
              return !includes.some(fn => fn(file));
            }
          }),
          require('autoprefixer')({})
        ]
      }
    },
    //css压缩+提取文件
    extract: isDev
      ? false
      : {
          ignoreOrder: true //忽略引入顺序不同导致的警告
        }
  },
  chainWebpack: config => {
    //测试环境打包，注入测试变量
    if (ENV.mode === 'sit') {
      console.log('mode=sit');
      config.plugin('define').tap(args => {
        args[0]['process.env'].NODE_ENV = JSON.stringify('sit');
        return args;
      });
    } else if (ENV.mode === 'com') {
      //联调环境
      console.log('mode=com');
      config.plugin('define').tap(args => {
        args[0]['process.env'].NODE_ENV = JSON.stringify('com');
        return args;
      });
    }
    // ✨新增js babel编译过滤lib目录
    config.module
      .rule('js')
      .exclude.add(path.resolve('./src/plugins/lib'))
      .end();
    Object.keys(realPages).map(pageName => {
      config.plugins.delete(`preload-${pageName}`);
      config.plugins.delete(`prefetch-${pageName}`);
    });
    // 移除 prefetch 插件
    // 修改它的选项：
    // config.plugin('prefetch').tap(options => {
    //   options[0].fileBlacklist = options[0].fileBlacklist || []
    //   options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
    //   return options
    // })

    // ✨eslint 忽略lib目录下的三方插件
    config.module
      .rule('eslint')
      .exclude.add(path.resolve('./src/plugins/lib'))
      .end();
    //忽略index.html拷贝
    config.plugin('copy').tap(args => {
      let opt = args[0];
      let icoPath = `src/pages/${sBuildPage}/favicon.ico`;
      if (ENV.type === 'build' && fs.existsSync(icoPath)) {
        //拷贝favicon图标
        opt.push({
          from: icoPath,
          to: path.resolve(`dist${sPublicPath}/${sBuildPage}`) // dest/wap/project
        });
      }
      // 忽略public/index.html
      opt[0].ignore.push('**/*index.html');
      return args;
    });
    //将public下文件拷贝到dist/wap目录下，所有项目共享favicon.icon等资源，为node服务用
    // config.plugin('copy').tap(args => {
    //   let opt = args[0];
    //   // 1、原有参数 新增忽然.svga文件
    //   opt[0].ignore.push('**/*index.html');

    //   // 😤2、public文件拷贝至dest/wap下
    //   opt.push({
    //       from: '**/*',
    //       to: path.resolve(`dist${sPublicPath}`), // dest/wap
    //       context: 'public', // context指定from目录，默认会将from整个目录拷贝过去，如public/**/* -> dest/public/**/*
    //       globOptions: {
    //           ignore: ['**/*.svga', '**/*index.html']
    //       }
    //   });
    //   return args;
    // });

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    config.module
      .rule('fonts')
      .test(/.(ttf|otf|eot|woff|woff2)$/)
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.limit = 1000 * 1000;
        return options;
      })
      .end();
  },
  pluginOptions: {
    //less全局变量引入
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/less/global/index.less')]
    }
  }
};
