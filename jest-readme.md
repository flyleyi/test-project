# 1集成jest单元测试
## 1.1 安装依赖
`npm install --save-dev vue-jest`  
需要测试vue文件时，需要在安装以下依赖
identity-obj-proxy 测试的文件中引入了css，需要安装此依赖  
`npm install --save-dev babel-jest @babel/core @babel/preset-env babel-core@^7.0.0-bridge.0 identity-obj-proxy @vue/test-utils`
## 1.2 配置jest
在package.json配置jest或者新建jest.config.js文件配置
```json
"jest": {
  //识别文件格式
  "moduleFileExtensions": [
    "js",
    "json",
    "vue"
  ],
  "moduleNameMapper": {
    // 同webpack配置相同别名，令@映射到src
    "^@/(.*)$": "<rootDir>/src/$1",
    // 若测试的文件引入了css样式，则需要增加此配置
    "\\.(css|less)$": "identity-obj-proxy"
  },
  "transform": {
    // 使用vue-jest解析vue文件
    ".*\\.(vue)$": "vue-jest",
    //使用babel-jest解析js文件
    ".*\\.(js)$": "babel-jest"
  },
  //覆盖率要求，global表示对所有匹配到的test文件生效
  //functions:50表示覆盖到的方法占比必须为50%以上，否则单元测试不通过
  "coverageThreshold": {
    "global": {
      "branches": 50,
      "functions": 50,
      "lines": 50,
      "statements": 50
    }
  }
}
```
更多JEST配置请[查看](https://jestjs.io/zh-Hans/docs/configuration)
vue组件单元测试[查看](https://vue-test-utils.vuejs.org/zh/guides/)
## 1.3 babel配置
在babel.config.js 或者babelrc.json中添加babel预设配置  

```json
{
  "presets": ["@babel/preset-env"]
}
```
## 1.4 运行单元测试
在package.json新增脚本
```javascript
"script": {
  ...
  "unit": "jest --coverage"
}
```
运行`npm run unit`查看运行结果

## 1.5 添加jest可视化配置
[查看jest-stare](https://www.npmjs.com/package/jest-stare)
### 1.5.1 安装依赖  
`npm install --save-dev jest-stare`
### 1.5.2 修改配置
在package.json修改配置
```json
//修改
"script": {
  //增加--reporters default jest-stare
  "unit": "jest --coverage --reporters default jest-stare"
},
//修改
"jest": {
  //生成的覆盖率结果目录位置
  "coverageDirectory": "<rootDir>/jest-result",
},
//+新增配置
"jest-stare": {
  //jest生成的结果存放路径
  "resultDir": "jest-result",
  //jest生成的结果html标题
  "reportTitle": "单元测试结果展示",
  //jest生成的结果html链接覆盖率查看的url
  "coverageLink": "./lcov-report/index.html",
  "jestStareConfigJson": "jest-stare.json"
}
```
### 1.5.3 运行测试
`npm run unit`

