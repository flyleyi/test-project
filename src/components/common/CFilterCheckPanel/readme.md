## 多选checkbox插件，适用于表单显示列选择

#### 调用方式
[demo 样例地址](http://localhost:8989/wap/pc/table-demo)  
以插件形式调用,`CFilterCheckPanel.show(config)`
```javascript
//引入js
import CFilterCheckPanel from '@/components/common/CFilterCheckPanel/index.js';
//CFilterCheckPanel.show(config)
CFilterCheckPanel.show({
  title: 'xxxxx', //弹窗标题，默认'显示列'
  data: this.headers1, //数据源
  ajaxFun: this.ajaxTest, //点击确认时的请求，不填时直接关闭
  successMsg: '保存成功', //保存成功提示，不填则不弹窗
  errorMsg: '保存失败', //保存失败提示
  editOriginData: false, //是否修改源数据，true=修改，即传入的数据源data在点击保存时会被直接修改
  callback(data) {
    //console.log(data) // ['name', 'age' ...]
  }
});
```

#### config属性

|参数|说明|类型|默认值|
|:-:|:-:|:-:|:-:|
|title|弹窗标题|String|显示列|
|data|数据源|Array|[]|
|ajaxFun|请求方法|Function||
|editOriginData|是否修改数据源|Boolean|true|
|successMsg|保存成功提示|String||
|errorMsg|保存失败提示|String|数据保存失败|
|callback|保存成功回调(必须在editOriginData=false时才生效)|Function||
|labelField|对应data属性的label字段|String|label|
|valueField|对应data属性的prop字段|String|prop|
|requiredField|对应data属性的required字段|String|required|
|hiddenField|对应data属性的hidden字段|String|hidden|

#### 数据源属性 - data
- label 名称
- prop 字段名
- hidden 是否隐藏
- required 是否必选
