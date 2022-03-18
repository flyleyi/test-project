<template>
  <el-form
    class="dynamic-form"
    ref="elForm"
    v-bind="formAttrs"
    :model="model"
    @submit.native.prevent
  >
    <slot name="form-before" />
    <template v-for="(item, index) in formItems">
      <el-form-item
        v-if="item.type && !isHidden(item)"
        :key="(item.initCount || initCount) + '|' + index"
        :prop="item.prop"
        :label="item.label"
        :rules="item.rules"
      >
        <slot
          :name="'custom|' + item.prop"
          v-bind:data="model"
          v-if="item.type == 'custom'"
        ></slot>
        <component
          :value="model[item.prop]"
          :is="`df-${item.type}`"
          :config="item"
          @change-value="val => onChangeValue(val, item)"
          @change-label="onChangeLabel"
          @ajax-start="onAjaxStart"
          @ajax-end="onAjaxEnd"
          v-else
        />
      </el-form-item>
    </template>
    <slot name="form-after" />
  </el-form>
</template>

<script>
import DfModules from './components/df-modules';
import { Form, FormItem } from 'element-ui';

export default {
  name: 'CDynamicForm',
  components: {
    ...DfModules,
    [Form.name]: Form,
    [FormItem.name]: FormItem
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
    }
  },
  data() {
    return {
      initCount: 0, //变更时重新渲染表单组件
      model: {}, // 数据模型
      ajaxLoadList: [], // ajax正在请求列表
      // 解绑列表
      unwatchList: []
    };
  },
  computed: {},
  watch: {
    formData: {
      deep: true,
      handler: 'changeFormData',
      immediate: true
    },
    /**
     * 配置项变动重新初始化
     */
    formItems: {
      handler: 'init',
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
      this.changeFormItems();
    },
    /**
     * 表单元素配置改变
     */
    changeFormItems() {
      // this.$nextTick(() => {
      //   // 解绑上次绑定的
      //   this.execUnwatch();
      //   // 监听插件类型的表单元素值
      //   const fn = list =>
      //     list.forEach(item => {
      //       if (item.type === 'custom') {
      //         const unwatch = this.$watch(
      //           `model.${item.prop}`,
      //           (newVal, oldVal) => {
      //             // 向上通知数据变更
      //             this.$emit('change-model', this.model, newVal, item.prop);
      //           }
      //         );
      //         this.unwatchList.push(unwatch);
      //       }
      //       Array.isArray(item.children) && fn(item.children);
      //     });
      //   fn(this.formItems);
      // });
    },
    /**
     * 执行解绑
     */
    execUnwatch() {
      this.unwatchList.map(item => item());
      this.unwatchList = [];
    },
    /**
     * 初始化数据模型
     */
    changeFormData() {
      this.model = this.formData;
    },

    /**
     * 值改变
     * @param {*} value 值
     * @param {*} item 表单元素配置
     */
    onChangeValue(value, item) {
      // 更新数据
      // this.model[item.prop] = value;
      this.$set(this.model, item.prop, value);
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
    },
    /**
     * 是否隐藏表单项
     * @param {*} item 表单项
     */
    isHidden(item) {
      if (typeof item.hidden === 'function')
        return item.hidden.call(null, this.model);
      return item.hidden;
    }
  }
};
</script>

<style lang="less" scoped></style>
