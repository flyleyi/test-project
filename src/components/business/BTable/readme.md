## business/BTable 业务组件 带分页功能表

### 引入说明

依赖 element-ui 组件库
[demo 样例地址](http://localhost:8989/wap/pc/table-demo)

```javascript
<template>
  <b-table
    :headers="headers"
    :ajaxGetData="getTableData2"
  ></b-table>
</template>
import BTable from '@/components/business/BTable';
export default {
  name: 'Home',
  components: {
    BTable
  },
  data() {
    return {
      headers: [
        {
          label: '姓名',
          prop: 'schoolName',
          width: 200
        },
        {
          label: '操作(colType=btns)',
          colType: 'btns',
          prop: 'name',
          btns: [
            {
              label: '新增',
              type: 'primary',
              click: (row, rowIndex, btnIndex) => {
                console.log(row, rowIndex, btnIndex, this.tableData1);
                Message({
                  type: 'success',
                  message: `点击${rowIndex}行按钮${btnIndex}`
                });
              }
            },
            {
              label: '修改',
              size: 'small',
              type: 'success',
              click: (row, rowIndex, btnIndex) => {
                console.log(row, rowIndex, btnIndex, this.tableData1);
                Message({
                  type: 'success',
                  message: `点击${rowIndex}行按钮${btnIndex}`
                });
              }
            }
          ]
        }
      ]
    };
  },
  methods: {
    getTableData2() {
      return axios({url: '/xxx'})
    }
  }
}
```

### Table Attributes

| 参数                    | 说明                                                                                                                                                                                               | 类型                                                  | 可选值                         | 默认值                                                      |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|--------------------------------|-------------------------------------------------------------|
| headers                 | 列渲染规则                                                                                                                                                                                         | Array                                                 | —                              | —                                                           |
| pg-margin-top              | 分页组件与表间距                                                                                                                                                                                   | String                                               | 20                           | —                                                           |
| height                  | Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。                              | string/number                                         | —                              | —                                                           |
| max-height              | Table 的最大高度。合法的值为数字或者单位为 px 的高度。 | string/number                                                 | —                       |—                                                      |                                                                                                                                
| show-column              | 显示/隐藏“显示列”按钮 | boolean                                                | —                       |true |      
| show-refresh              | 显示/隐藏“刷新”按钮 | boolean                                                | —                       |true |   
| form-items              | 查询表单配置项 | array                                                | —                       | — |
| initial-form-data              | 初始查询表单默认值 | object                                                | —                       | — |
| toolbars              | 工具栏默认按钮合集 | array                                                | —                       | [] |
| show-refresh              | 显示/隐藏“刷新”按钮 | boolean                                                | —                       |true |   
| saveLocal              | true=本地保存“显示列”数据，false=远程服务器保存数据 | boolean                                                | —                       | false |   
| save-column-key              | 本地保存“显示列”数据时的key | string                                                | —                       | — |   
| system              | 与save-column-key组合成关联键值，服务端保存数据时使用 | string                                                | —                       | sims |   
| save-success-msg              | 保存“显示列”数据成功提示，值为空则不提示 | string                                                | —                       | 保存成功 |   
| save-error-msg              | 保存“显示列”数据失败提示，值为空则不提示 | string                                                | —                       | 数据保存失败 |   
| immediate-load      | 立即调用接口 | boolean | - | true | - |



### Table-column Attributes

| 参数                  | 说明                                                         | 类型                                    | 可选值                                                       | 默认值                            |
| :-------------------- | :----------------------------------------------------------- | :-------------------------------------- | :----------------------------------------------------------- | :-------------------------------- |
| colType                  | 列渲染方式 normal为普通列；btns为操作列、渲染按钮列表；column为自定义列，使用slot= 'column\|[slotName/prop]'渲染自定义的列内容 | string                                  | normal                                       | —                                 |
| slotName                  | colType=column时生效，自定义插槽名称,使用插槽是指定slot='column\|[slotName]',slotName不设置时，默认使用prop作为插槽名 | string                                  |                                        | —                                 |
| btns                  | colType为"btns"时，btns的数组长度决定按钮数量,属性label为按钮文案，size为按钮大小，type为按钮样式，click为function类型，响应点击事件  Function(row, rowIndex, btnIndex)  | Array                                  | []                                       | —                                 |
| type                  | 对应列的类型。如果设置了 `selection` 则显示多选框；如果设置了 `index` 则显示该行的索引（从 1 开始计算）；如果设置了 `expand` 则显示为一个可展开的按钮 | string                                  | selection/index/expand                                       | —                                 |
| index                 | 如果设置了 `type=index`，可以通过传递 `index` 属性来自定义索引 | number, Function(index)                 | -                                                            | -                                 |
| column-key            | column 的 key，如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件 | string                                  | —                                                            | —                                 |
| label                 | 显示的标题                                                   | string                                  | —                                                            | —                                 |
| prop                  | 对应列内容的字段名，也可以使用 property 属性                 | string                                  | —                                                            | —                                 |
| width                 | 对应列的宽度                                                 | string                                  | —                                                            | —                                 |
| min-width             | 对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列 | string                                  | —                                                            | —                                 |
| fixed                 | 列是否固定在左侧或者右侧，true 表示固定在左侧                | string, boolean                         | true, left, right                                            | —                                 |
| render-header         | 列标题 Label 区域渲染使用的 Function                         | Function(h, { column, $index })         | —                                                            | —                                 |
| sortable              | 对应列是否可以排序，如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件 | boolean, string                         | true, false, 'custom'                                        | false                             |
| sort-method           | 对数据进行排序的时候使用的方法，仅当 sortable 设置为 true 的时候有效，需返回一个数字，和 Array.sort 表现一致 | Function(a, b)                          | —                                                            | —                                 |
| sort-by               | 指定数据按照哪个属性进行排序，仅当 sortable 设置为 true 且没有设置 sort-method 的时候有效。如果 sort-by 为数组，则先按照第 1 个属性排序，如果第 1 个相等，再按照第 2 个排序，以此类推 | String/Array/Function(row, index)       | —                                                            | —                                 |
| sort-orders           | 数据在排序时所使用排序策略的轮转顺序，仅当 sortable 为 true 时有效。需传入一个数组，随着用户点击表头，该列依次按照数组中元素的顺序进行排序 | array                                   | 数组中的元素需为以下三者之一：`ascending` 表示升序，`descending` 表示降序，`null` 表示还原为原始顺序 | ['ascending', 'descending', null] |
| resizable             | 对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真） | boolean                                 | —                                                            | true                              |
| formatter             | 用来格式化内容                                               | Function(row, column, cellValue, index) | —                                                            | —                                 |
| show-overflow-tooltip | 当内容过长被隐藏时显示 tooltip                               | Boolean                                 | —                                                            | false                             |
| align                 | 对齐方式                                                     | String                                  | left/center/right                                            | left                              |
| header-align          | 表头对齐方式，若不设置该项，则使用表格的对齐方式             | String                                  | left/center/right                                            | —                                 |
| class-name            | 列的 className                                               | string                                  | —                                                            | —                                 |
| label-class-name      | 当前列标题的自定义类名                                       | string                                  | —                                                            | —                                 |
| selectable            | 仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选 | Function(row, index)                    | —                                                            | —                                 |
| reserve-selection     | 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 `row-key`） | Boolean                                 | —                                                            | false                             |
| filters               | 数据过滤的选项，数组格式，数组中的元素需要有 text 和 value 属性。 | Array[{ text, value }]                  | —                                                            | —                                 |
| filter-placement      | 过滤弹出框的定位                                             | String                                  | 与 Tooltip 的 `placement` 属性相同                           | —                                 |
| filter-multiple       | 数据过滤的选项是否多选                                       | Boolean                                 | —                                                            | true                              |
| filter-method         | 数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示。 | Function(value, row, column)            | —                                                            | —                                 |
| filtered-value        | 选中的数据过滤项，如果需要自定义表头过滤的渲染方式，可能会需要此属性。 | Array                                   | —                                                            | —                                 |