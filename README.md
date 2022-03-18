# mutilwap
本项目为多项目集合，src/pages下的所有一级目录都作为一个单独的项目，例 demo,h5,pc...  
注意，为防止环境因素影响导致代码运行及打包校验出现异常，需要统一环境版本，`git>=2.13.0 node>=12.13.0`

### 1 启动
>`npm install`  
`npm run serve`

  
### 2 启动配置
默认执行`npm run serve`时，会将所有项目启动，`localhost:8989/wap/项目名` 即可访问对应的项目页面
新建.env.local文件 加入参数`RUN_PAGE=demo,h5`,即可指定要启动的项目，默认不填则启动所有项目
```javascript
RUN_PAGE=xxx
```

### 3 项目打包
联调环境使用`npm run buildCom`
测试环境使用`npm run buildSit `   
生产环境使用`npm run build`  
使用 `pages=demo,h5`可以指定打包的项目合集[demo,h5]  
默认不指定打包的页面时，将会打包所有项目
> `npm run buildSit pages=xxx,yyy`  
 `npm run build pages=xxx,yyy`

#### 3.1 jenkins地址
发布联调/测试环境使用jenkins地址
>[联调环境jenkins](http://10.10.21.119:8080/job/119-mutilwap%EF%BC%88%E8%81%94%E8%B0%83%E7%8E%AF%E5%A2%83%EF%BC%89) 119-mutilwap（联调环境）   
>[测试环境jenkins](http://10.10.21.119:8080/job/119-mutilwap%EF%BC%88%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%EF%BC%89/) 119-mutilwap（测试环境）   

### 4 开发注意项
#### 4.1 不同业务层的接口请求，在src/plugins/common/api.js中配置对应的type
```javascript
//配置不同环境下的请求域名
const API_HOST = {
  //本地开发环境
  development: {
    //教师管理后台接口
    'teacher-admin': '/teacher-admin',
    //'type2': '/xxxxx'
  },
  //测试环境使用
  sit: {
    //教师管理后台接口
    'teacher-admin': '//campus.hailiangedu.com:8092/teacher-admin',
    //'type2': '//www.xxxx.com/xxx'
  },
  //生产环境
  production: {
      //...
  }
}
```
#### 4.2 在写axios请求时，在最后一个参数补上对应的type
比如type填写对应上例的`teacher-admin`，请求url是`/test/user.json`,   
在`development`(本地开发)环境时，请求的整体url会是  
`/teacher-admin/test/user.json`  
在`sit`环境时，请求的整体url会是  
`//campus.hailiangedu.com:8092/teacher-admin/test/user.json`  
增加type的写法示例如下（原理是在src/plugins/axios.js中通过封装一层方法，在调用axios时拼装好url，实际导出的是封装好的方法） 

```javascript
//axios.get(url,config,type)
axios.get(
    '/test/xxx',
    {
        params
    },
    'teacher-admin'
);
//axios.post(url,data,config,type)
axios.post(
    '/test/xxx',
    data,
    config,
    'teacher-admin'
);
//axios(config,type)
axios.post({
    method: 'post',
    url: '/test/xxx',
    data
}, 'teacher-admin');
```
#### 4.3 在config/tools/proxy.js中 配置代理  
上例2的写法中，本地开发development配置的type类型`teacher-admin`是访问不通的，需要做个代理映射
例
```javascript
'/teacher-admin(?=/)': {
    target: 'http://campus.hailiangedu.com:8092/', // 外网地址
    changeOrigin: true,
    ws: true
},
```
在每个单独项目下（`src/pages/${page}`）可以单独创建proxy.js文件，作用依然为生成本地代理，内容写法与`config/tools/proxy.js`相同，不同`${page}`下的proxy文件只会对当前启用的项目（.env文件中配置的`RUN_PAGE`）生效
#### 4.4 项目个性定制
默认所有项目引用的html模板是`public/index.html`，当需要自定义html模板时，需要在对应项目下，新建`项目名.html`,优先会以此html作为模板文件  
通用项目页面使用的title，默认为`项目名Page`，若需要对此做修改，需要在项目目录下新建`config/index.js`文件，内容如下  
具体可参照`src/pages/sims/config/index.js`
```javascript
module.exports = {
  title: '这是页面标题',
  CDN_URL: '项目打包后使用的配置路径' //注，优先取此项配置，无此项配置时，打包项目默认取.env中的CDN_URL配置，打包后的资源文件默认都使用CDN_URL作为路径域名
}
```

#### 4.5 vue文件无法使用别名路径提示解决办法
1、第一步安装插件
插件名：Path Intellisense
2、第二步指定安装版本
插件右下角设置按钮 -> 安装另一个版本 -> 1.4.2
3、第三步设置别名路径配置
插件右下角设置按钮 -> 扩展设置 -> Path-intellisense: Mappings选项下面有个：在settings.json中编辑
按照下面代码配置
```json
{
  "path-intellisense.mappings": {
    "@": "${workspaceRoot}/src"
  }
}
```
4、第四步重启vscode
#### 4.6 eslint校验
除了`src/plugins/lib`目录下，默认`src`下所有`.vue/.js`文件都会做eslint校验
要对某个单独文件做跳过校验处理，可在对应文件首行加入`/* eslint-disable */`
```javascript
/* eslint-disable */
```

### 5 单元测试

#### 5.1 jest 
1、创建test文件  
在pages/${page}/下新建目录tests，并建立*.spec.js文件，即可创建对应测试用例执行文件，案例可以参考项目根目录下的tests/*.spec.js  
2、执行测试  
`npm run jest`将运行所有.spec.js测试文件，拼接参数${page}可以限定测试范围  
例 `npm run jest sims`，则只会运行pages/sims/tests下的所有.spec.js文件  
3、查看执行结果  
直接使用浏览器打开项目根目录jest-result文件夹下的index.html即可查看可视化的执行结果  
4、[api参考](https://jestjs.io/zh-Hans/docs/api)

#### 5.2 cypress
1、创建测试文件  
在cypress/integration目录下创建项目所属目录，在目录下创建.js文件用于测试  
2、运行cypress  
执行`npm run cypress`开启可视化工具，在工具上执行测试用例  
3、[api参考](https://www.cypress.io/)
