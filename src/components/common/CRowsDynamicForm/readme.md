## 动态表单组件
基于CdynamicForm做的二次封装，用于需要固定每行展示固定数量的表单项排版，  
`colsMax`代表每行显示的最大表单数，formItems兼容原有传参格式的情况下，  
1、增加`children`属性，封装子集合，子集合的数据格式与原有item相同  
2、增加`colsapn`属性，代表占比，与`colsMax`对应，代表在行内所占比例，不传则默认为1

#### 属性
- formItems 表单元素列表
- formAttrs 表单属性
- colsMax 最大列数
- gutter 每列间隔

|参数|说明|类型|可选值|默认值|
|:-:|:-:|:-:|:-:|:-:|
|formItems|表单元素列表|Array|-|-|
|formAttrs|表单属性|Object|-|-|
|colsMax|表单属性|Number|-|3|
|gutter|表单属性|Number|-|0|

#### 表单元素公共属性 - formItems
- label 名称
- prop 字段名
- type 组件类型
- defaultValue 默认值
- rules 校验规则
- attrs 表单元素属性

|参数|说明|类型|可选值|默认值|
|:-:|:-:|:-:|:-:|:-:|
|label|名称|string|-|-|
|prop|字段名|string|-|-|
|type|组件类型|string|-|-|
|defaultValue|默认值|number \| string \| Array|-|-|
|rules|校验规则|Array|-|-|
|attrs|属性配置|Object|-|-|

## 表单元素属性

#### 下拉组件 - DfSelect
- options 选项数据
- valueKey 值的键
- labelKey 名称的键
- ajax 异步请求数据方法
- parentProp 上级联动组件prop

|参数|说明|类型|可选值|默认值|
|:-:|:-:|:-:|:-:|:-:|
|options|选项数据|Array|-|[]|
|valueKey|值的键|string|-|value|
|labelKey|名称的键|string|-|label|
|ajax|异步请求数据方法|function|-|-|
|parentProp|上级联动组件prop|string|-|-|

> 如果有ajax参数使用远程数据、否者options静态数据

#### 单选框组件 - DfRadio
- options 选项数据
- valueKey 值的键
- labelKey 名称的键
- ajax 异步请求数据方法

|参数|说明|类型|可选值|默认值|
|:-:|:-:|:-:|:-:|:-:|
|options|选项数据|Array|-|[]|
|valueKey|值的键|string|-|value|
|labelKey|名称的键|string|-|label|
|ajax|异步请求数据方法|function|-|-|

#### 多选框组件 - DfCheckBox
- options 选项数据
- valueKey 值的键
- labelKey 名称的键
- ajax 异步请求数据方法

|参数|说明|类型|可选值|默认值|
|:-:|:-:|:-:|:-:|:-:|
|options|选项数据|Array|-|[]|
|valueKey|值的键|string|-|value|
|labelKey|名称的键|string|-|label|
|ajax|异步请求数据方法|function|-|-|
