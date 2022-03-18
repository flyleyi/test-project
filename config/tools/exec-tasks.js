/*
 * 默认打包src/pages/..下所有页面；支持环境变量指定pages -> yarn buildAll pages=demo
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk'); //粉笔
const successChalk = chalk.rgb(13,188,121); //用于打印绿色log
const failChalk = chalk.rgb(222,65,58); //用于打印红色log
//获取$命令参数
const getArgv = function(name) {
  let arr = process.argv.slice(2);
  let obj = {};
  arr.forEach(val => {
    if (val.indexOf('=') != -1) {
      let el = val.split('=');
      obj[el[0]] = el[1];
    }
  });
  return name ? obj[name] : obj;
};

let pagesPath = path.resolve(__dirname, '../../src/pages');
let ENV = process.env;
let argv = getArgv();
let pages = argv['pages']; //获取打包命令入参 pages，格式为字符串a,b,c...，按逗号分割
let pageArr = pages ? pages.split(',') : []; //['demo']; //将pages转换为数组类型
let cmdStr = ''; //要执行的打包命令
let cmdModeStr = ENV.mode ? `--mode ${ENV.mode}` : '';
if (!pageArr || pageArr.length == 0) {
  //如果不传值，默认打包pages下所有项目
  pageArr = fs.readdirSync(pagesPath);
}

console.log(pageArr);
cmdStr = `node config/tools/jest.js ${pages || ''} && `;
pageArr.forEach(val => {
  //当前项目下不存在main.js，忽略此目录，不做打包处理
  if(!fs.existsSync(`src/pages/${val}/main.js`)) return;
  //拼接打包命令
  cmdStr += `cross-env page=${val} type=build vue-cli-service build ${cmdModeStr} && `;
});
cmdStr += 'echo end';
console.log(cmdStr); // 执行指令
let startTime = new Date().getTime(); //命令开始时间
try {
  execSync(cmdStr, {
    'stdio': 'inherit',
    'cwd': process.cwd()
  })
  let endTime = new Date().getTime(); //执行完成时间
  let duration = Math.floor(endTime-startTime)/1000;
  console.log(successChalk(`build complete cost ${duration}s`))
} catch (error) {
  //打包命令出错，抛出异常
    console.log(failChalk(error.message))
    process.exit(1);
}

