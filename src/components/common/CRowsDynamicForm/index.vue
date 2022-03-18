<template>
  <el-form
    class="dynamic-form"
    ref="elForm"
    v-bind="formAttrs"
    :model="model"
    @submit.native.prevent
  >
    <slot name="form-before" />
    <template v-for="(row, rowIndex) in rowsFormItems">
      <el-row :gutter="gutter" class="form-row-bar" :key="'row|' + rowIndex">
        <el-col
          :span="colSpanMethod(item)"
          v-for="(item, colIndex) in row.children"
          :key="initCount + '|col|' + (item.prop ? item.prop : colIndex)"
        >
          <col-form-item
            v-bind="$props"
            :model="model"
            :item="item"
            @change-value="onChangeValue"
            @change-label="onChangeLabel"
            @ajax-start="onAjaxStart"
            @ajax-end="onAjaxEnd"
            v-show="!item.transparent"
          >
            <template v-slot:[item.slotName]>
              <slot v-bind:data="model" :name="item.slotName"></slot>
            </template>
          </col-form-item>
        </el-col>
      </el-row>
    </template>
    <slot name="form-after" />
  </el-form>
</template>

<script>
import DfModules from '../CDynamicForm/components/df-modules';
import ColFormItem from './ColFormItem';
import { Form, FormItem, Col, Row } from 'element-ui';

export default {
  name: 'CRowsDynamicForm',
  components: {
    ...DfModules,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Col.name]: Col,
    [Row.name]: Row,
    ColFormItem
  },
  provide() {
    return {
      CDynamicForm: this
    };
  },
  props: {
    /**
     * 表单数据
     */
    formData: {
      type: Object,
      default: () => ({})
    },
    /**
     * 表单元素列表
     */
    formItems: {
      type: Array,
      default: () => []
    },
    /**
     * 表单属性
     */
    formAttrs: {
      type: Object,
      default: () => ({})
    },
    //列数
    colsMax: {
      type: Number,
      default: 3
    },
    //栅栏间隔
    gutter: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      initCount: 0, //变更时重新渲染表单组件
      model: {}, // 数据模型
      ajaxLoadList: [] // ajax正在请求列表
    };
  },
  computed: {
    //渲染成行列，每行包含多个表单项集合
    rowsFormItems() {
      let result = [];
      let cols = this.colsMax;
      let rowObj = {
        count: 0,
        children: []
      };
      result.push(rowObj);
      this.formItems.forEach(item => {
        if (item.hidden) return;
        let colspan = (item.colspan = item.colspan || 1);
        if (rowObj.count + colspan <= cols) {
          rowObj.count += colspan;
          rowObj.children.push(item);
        } else {
          rowObj = {
            count: colspan,
            children: [item]
          };
          result.push(rowObj);
        }
      });
      return result;
    },
    //计算列占比 24栅
    colSpanMethod() {
      return item => {
        let { colspan } = item;
        return Math.floor((24 / this.colsMax) * colspan);
      };
    }
  },
  watch: {
    formData: {
      deep: true,
      handler: 'changeFormData',
      immediate: true
    }
  },
  mounted() {
    this.extendElFormMethods();
  },
  methods: {
    /**
     * 手动更新表单组件，使校验功能及联动下拉功能正常使用
     */
    init() {
      this.initCount += 1;
    },
    /**
     * 初始化数据模型
     */
    changeFormData() {
      this.model = {
        ...this.formData
      };
    },

    /**
     * 值改变
     * @param {*} value 值
     * @param {*} item 表单元素配置
     */
    onChangeValue(value, item) {
      // 更新数据
      this.model[item.prop] = value;
      // 向上通知数据变更
      this.$emit('change-model', this.model, value, item.prop);
    },
    /**
     * 展示值改变
     * @param {*} value 值
     * @param {*} key 对象key
     */
    onChangeLabel(key, value) {
      // 更新数据
      this.model[key] = value;
      // 向上通知数据变更
      this.$emit('change-model', this.model, value, key);
    },
    /**
     * ajax请求发起
     * @param {Symbol} symbol 请求唯一标识
     */
    onAjaxStart(symbol) {
      this.ajaxLoadList.push(symbol);
    },
    /**
     * ajax请求结束
     * @param {Symbol} symbol 请求唯一标识
     */
    onAjaxEnd(symbol) {
      let { ajaxLoadList } = this;
      let index = ajaxLoadList.indexOf(symbol);
      index !== -1 && ajaxLoadList.splice(index, 1);
    },

    /**
     * 继承ElForm组件方法
     */
    extendElFormMethods() {
      let elForm = this.$refs.elForm;
      ['validate', 'validateField', 'resetFields', 'clearValidate'].forEach(
        key => {
          let methods = elForm[key];
          typeof methods === 'function' && (this[key] = methods);
        }
      );
    },
    /**
     * 设置model数据
     * @param {*} prop 字段名
     * @param {*} value 值
     */
    setModelData(prop, value) {
      let res = this.formItems.find(item => item.prop === prop);
      res && this.onChangeValue(value, res);
    }
  }
};
</script>

<style lang="less" scoped>
.form-row-bar {
  display: flex;
  // align-items: center;
}
/deep/ .el-select {
  display: block;
}
/deep/ .form-item {
  width: 100%;
  .el-form-item__content {
    width: 100%;
    /**日期选择组件，宽度自适应 */
    .el-date-editor.el-input {
      width: inherit;
    }
  }
}
</style>
