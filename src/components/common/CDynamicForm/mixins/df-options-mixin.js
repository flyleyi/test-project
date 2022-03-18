import dfMixin from './df-mixin';

/**
 * 是否是空值
 * 空值
 * - []
 * - ''
 * - null
 * - undefined
 * @param {*} value 值
 */
const isEmptyValue = value => {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value) && !value.length) return true;
  if (value === '') return true;
  return false;
};

export default {
  mixins: [dfMixin],
  inject: ['CDynamicForm'],
  data() {
    return {
      remoteOptionList: [], // 远程选项列表
      lastRequestSymbol: null // 最后一次请求唯一标识
    };
  },
  computed: {
    /**
     * 标签key
     */
    labelKey() {
      return this.config.labelKey || 'label';
    },
    /**
     * 值key
     */
    valueKey() {
      return this.config.valueKey || 'value';
    },
    /**
     * 选项列表数据
     */
    optionList() {
      let { options } = this.config;
      let optionList = this.isAjax ? this.remoteOptionList : options;
      return Array.isArray(optionList) ? optionList : [];
    },
    /**
     * 是否ajax请求数据
     */
    isAjax() {
      let { ajax } = this.config;
      return ajax && typeof ajax === 'function';
    }
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    /**
     * 初始化
     */
    async init() {
      // 校验是否有表单元素包裹
      if (!this.CDynamicForm) throw new Error('缺少CDynamicForm组件包裹');
      let { parentProp } = this.config;
      if (parentProp) {
        // 上级联动
        let unwatch = this.CDynamicForm.$watch(
          `model.${parentProp}`,
          this.changeParentValue
        );
        // 解绑
        this.$on('hook:destroyed', () => {
          unwatch();
        });
        this.CDynamicForm.model[parentProp] && this.ajaxOptionList();
      } else {
        this.ajaxOptionList();
      }
    },
    /**
     * 上级元素数据改变
     */
    changeParentValue(newVal, oldVal) {
      this.$nextTick(() => {
        this.val = Array.isArray(this.val) ? [] : '';
      });
      this.ajaxOptionList();
    },
    /**
     * ajax请求选项数据
     */
    async ajaxOptionList() {
      let { ajax, parentProp } = this.config;
      if (!this.isAjax) return;
      // fix：校验空数组、null、空字符串、undefined
      if (parentProp && isEmptyValue(this.CDynamicForm.model[parentProp]))
        return (this.remoteOptionList = []);
      let symbol = Symbol(this.config.prop);
      try {
        this.$emit('ajax-start', symbol);
        this.lastRequestSymbol = symbol;
        let res = await ajax(
          this.CDynamicForm.model,
          this.val,
          this.config.prop
        );
        res = Array.isArray(res) ? res : [];
        // 防止后面的请求先返回导致数据不准确
        this.lastRequestSymbol === symbol && (this.remoteOptionList = res);
      } catch (e) {
        this.remoteOptionList = [];
        throw e;
      } finally {
        this.$emit('ajax-end', symbol);
        this.lastRequestSymbol = null;
      }
    }
  }
};
