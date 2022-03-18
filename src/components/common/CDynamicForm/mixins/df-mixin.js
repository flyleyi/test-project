export default {
  props: {
    /**
     * 值
     */
    value: {},
    /**
     * 组件配置
     */
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 值
      val: this.value
    };
  },
  computed: {
    /**
     * 属性配置
     */
    attrs() {
      return this.config.attrs || {};
    },
    events() {
      return this.config.events || {};
    }
  },
  watch: {
    /**
     * 值变化向上传递
     */
    val() {
      this.$emit('change-value', this.val);
    },
    /**
     * 更新值
     */
    value() {
      this.val = this.value;
    }
  }
};
