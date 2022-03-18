## 导入数据组件

#### 属性
- url 上传地址
- maxFileSize 最大文件大小
- title 标题
- templateUrl 模板下载地址
- on-success 导入成功回调地址

#### 方法
- show() 显示模态框
- hide() 隐藏模态框

#### 方法使用方式
```js
import BImportData from '@/components/business/BImportData/index.js';

// 显示导入数据模态框
BImportData({
  url: '',
  title: '导出数据'
  // 传入的属性
});
```