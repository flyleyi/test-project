# _组件目录_ 

>每个`components/common`,`components/business`文件夹下最多只有一层文件夹，文件夹名称统一大写开头（PascalCase），且文件夹名称为组件的名称，文件夹下必须有index.vue或index.js，其他.vue文件统一大写开头（PascalCase）

> 建议通用非业务组件存放在`src/components/common`，通用业务组件存放在`src/components/business`， 具体的业务组件或非通用组件建议存放在对应pages下`src/pages/${page}/components`下

## 组件说明

### 通用组件
- CHamburger 导航折叠icon ？
- CSvgIcon svg图标引入组件
- CTable 通用表,动态渲染列

### 业务组件