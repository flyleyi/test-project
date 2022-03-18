const path = require('path');
const ejs = require('ejs');
const express = require('express');
const fs = require('fs');
const history = require('connect-history-api-fallback');
const app = express();
const router = express.Router();
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8990;
const serverPath = path.join(__dirname, '../dist'); // 可以指定项目外的目录地址
// const serverPath = path.join(__dirname, '../dest'); // 😤 可以指定项目外的目录地址

// const cookieParser = require('cookie-parser'); // 获取cookie参数中间件
// const bodyParser = require('body-parser'); // 获取post请求参数中间件
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
const BASE_URL = process.env.BASE_URL;
// const PAGE = process.env.PAGE || '/demo.html';
let defPage = `${BASE_URL}demo/demo.html`;

app.set('views', serverPath);
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// 解决ico路径不对问题：例 /wap/demo/favicon.ico -> /wap/favicon.ico
// let icoRoute = router.get(`${BASE_URL}*/*.ico`, (req, res) => {
//   let reg = new RegExp('/([^/]*/)([^/]*.ico)');
//   let icoPath = req.path.replace(reg, '/$2');
//   res.send(fs.readFileSync(path.join(serverPath, icoPath)));
// });
// app.use('/', icoRoute);
app.all('*', function(req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*');
  //允许的header类型
  res.header('Access-Control-Allow-Headers', 'content-type');
  //跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
  if (req.method.toLowerCase() == 'options') res.send(200);
  //让options尝试请求快速结束
  else next();
});
app.use(express.static(serverPath)); // 启动静态服务。
app.use(express.static(path.join(__dirname, '../static'))); // 启动静态服务。
app.use(
  history({
    verbose: true, // 打印日志
    disableDotRule: true, // 禁用文件名包含.规则
    index: defPage, // 默认转发页面
    // htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'], // 针对转发请求类型
    rewrites: [
      {
        from: new RegExp(`^${BASE_URL}.*$`),
        to: function(context) {
          // 所有page单独打包的执行代码 （分）
          let pagename = context.parsedUrl.pathname.replace(
            new RegExp(`^${BASE_URL}([^/]+)(/.*)?$`),
            '$1'
          ); // 获取文件名
          let filePath = `${BASE_URL}${pagename}/${pagename}.html`;
          if (!fs.existsSync(path.join(serverPath, filePath))) {
            filePath = defPage;
          }
          // console.log('defPage', defPage, filePath);
          return filePath;
        }
      }
    ]
  })
);

// *.html路由规则 ·需写在history后面·
let comRoute = router.get('/*.html', (req, res) => {
  let time = new Date().getTime();
  let pageName = req.path.substr(1, req.path.length - 6);
  res.set('Cache-Control', 'no-store'); //html访问不走缓存
  res.render(pageName, { time: time });
});
app.use('/', comRoute);

// let nfRoute = router.get('*', (req, res) => {
//     let time = new Date().getTime();
//     console.log(time)
//     res.render(`wap/404`, {time})
// })
// app.use('/', nfRoute);

// ==== 404 ====
// app.use((req, res) => {
//   let time = new Date().getTime();
//   let path = BASE_URL.replace('/', '');
//   // res.send('抱歉，访问的资源不存在，请检查访问链接是否正确');
//   res.render(`${path}404.html`.replace(/^\//, ''), { time });
// });
// app.use(function(req, res, err) {
//     // res.status(err.status || 500);
//     res.render('404');
// });

app.listen(port);
console.log('Server listening on http://' + host + ':' + port); // eslint-disable-line no-console
