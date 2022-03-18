let props = {
  //****************自定义入参************* */
  //表头数组，根据内容渲染列内容
  headers: {
    type: Array,
    default: () => {
      return [];
    }
  },
  /*******************element-ui自带入参******************/
  //展示数据内容
  data: {
    type: Array,
    default: () => {
      return [];
    }
  },
  //table高度
  height: {
    type: [Number, String]
  },
  //table最大高
  maxHeight: {
    type: [Number, String]
  },
  //是否带有纵向边框
  border: {
    type: Boolean,
    default: false
  },
  //斑马纹
  stripe: {
    type: Boolean,
    default: false
  },
  //尺寸 medium / small / mini
  size: {
    type: String,
    default: 'medium'
  },
  //列的宽度是否自撑开
  fit: {
    type: Boolean,
    default: true
  },
  //是否显示表头
  showHeader: {
    type: Boolean,
    default: true
  },
  //是否高亮当前行
  highlightCurrentRow: {
    type: Boolean,
    default: true
  },
  //当前行的 key，只写属性
  currentRowKey: {
    type: [String, Number]
  },
  //行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className Function({row, rowIndex})/String
  rowClassName: {
    type: [Function, String]
  },
  //行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。 | Function({row, rowIndex})/Object
  rowStyle: {
    type: [Function, Object]
  },
  //单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。 | Function({row, column, rowIndex, columnIndex})/String
  cellClassName: {
    type: [Function, String]
  },
  //单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。 | Function({row, column, rowIndex, columnIndex})/Object
  cellStyle: {
    type: [Function, Object]
  },
  //表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。 | Function({row, rowIndex})/String
  headerRowClassName: {
    type: [Function, String]
  },
  //表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。 | Function({row, rowIndex})/Object
  headerRowStyle: {
    type: [Function, Object]
  },
  //表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。 | Function({row, column, rowIndex, columnIndex})/String
  headerCellClassName: {
    type: [Function, String]
  },
  //表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。 | Function({row, column, rowIndex, columnIndex})/Object
  headerCellStyle: {
    type: [Function, Object]
  },
  //行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。类型为 String 时，
  //支持多层访问：`user.info.id`，但不支持 `user.info[0].id`，此种情况请使用 `Function`。 | Function(row)/String
  rowKey: {
    type: [Function, String]
  },
  //空数据时显示的文本内容，也可以通过 `slot="empty"` 设置  默认“暂无数据”
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  //是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
  defaultExpandAll: {
    type: Boolean,
    default: false
  },
  //可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组
  expandRowKeys: {
    type: Array
  },
  /**
   * 默认的排序列的 prop 和顺序
   * @property {String} order ascending, descending 指定默认排序的顺序 @default ascending
   * @property {String} prop 指定默认的排序的列
   */
  defaultSort: {
    type: Object
  },
  //tool-tip effect属性  dark/light
  tooltipEffect: {
    type: String
  },
  // 是否在表尾显示合计行
  showSummary: {
    type: Boolean,
    default: false
  },
  //合计行第一列的文本
  sumText: {
    type: String,
    default: '合计'
  },
  //自定义的合计计算方法 Function({ columns, data }
  summaryMethod: {
    type: Function
  },
  //合并列或行的计算方法 Function({ row, column, rowIndex, columnIndex }
  spanMethod: {
    type: Function
  },
  //在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。若为 true，则选中所有行；若为 false，则取消选择所有行
  selectOnIndeterminate: {
    type: Boolean,
    default: true
  },
  //展示树形数据时，树节点的缩进
  indent: {
    type: Number,
    default: 16
  },
  //是否懒加载子节点数据
  lazy: {
    type: Boolean
  },
  //加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息 Function(row, treeNode, resolve)
  load: {
    type: Function
  },
  //渲染嵌套数据的配置选项
  treeProps: {
    type: Object
  }
};
export default props;
