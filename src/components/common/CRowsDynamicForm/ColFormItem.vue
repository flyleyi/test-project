<template>
  <div class="col-bar" :style="{ flex: item.attrs && item.attrs.flex }">
    <span
      class="col-bar-label"
      :class="{ required: isRequired(item) }"
      :style="{ width: formAttrs['label-width'] }"
      v-if="item.label"
      >{{ item.label }}</span
    >
    <!-- 含有子项，递归渲染 -->
    <template v-if="item.children">
      <col-form-item
        v-bind="$props"
        :item="child"
        :key="item.prop ? item.prop : index"
        v-for="(child, index) in item.children"
        @ajax-start="onAjaxStart"
        @ajax-end="onAjaxEnd"
        @change-value="onChangeValue"
        @change-label="onChangeLabel"
      ></col-form-item>
    </template>
    <template v-else-if="item.type == 'custom'">
      <slot :name="item.slotName"></slot>
    </template>
    <template v-else-if="!item.hidden">
      <el-form-item
        class="form-item"
        :prop="item.prop"
        :rules="item.rules"
        v-if="item.type"
        v-show="!item.transparent"
      >
        <slot
          :name="'custom|' + item.prop"
          v-bind:data="model"
          v-if="item.type == 'custom'"
        ></slot>
        <component
          :value="model[item.prop]"
          class="form-item-component"
          :is="`df-${item.type}`"
          :config="item"
          @ajax-start="onAjaxStart"
          @ajax-end="onAjaxEnd"
          @change-value="val => onChangeValue(val, item)"
          @change-label="onChangeLabel"
          v-else
        />
      </el-form-item>
    </template>
  </div>
</template>
<script>
import DfModules from '../CDynamicForm/components/df-modules';
import { FormItem } from 'element-ui';
export default {
  name: 'ColFormItem',
  props: {
    /**
     * 表单项
     */
    item: {
      type: Object
    },
    model: {
      type: Object
    },
    /**
     * 表单属性
     */
    formAttrs: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    ...DfModules,
    [FormItem.name]: FormItem
  },
  methods: {
    //判断当前label是否需要显示必填标志
    isRequired(item) {
      if (item.required) return true;
      let formAttrsRules = this.formAttrs.rules; //整个表单校验规则
      let itemRules = item.rules; //单项校验规则
      let dealRules = itemRules || formAttrsRules; //使用优先级
      if (dealRules && dealRules[item.prop]) {
        let dealRuleItem = dealRules[item.prop];
        let requiredFlag = false;
        //数组类型
        if (Array.isArray(dealRuleItem)) {
          for (let rule of dealRuleItem) {
            //判断其中有一条使用必填
            if (rule.required) {
              requiredFlag = true;
              break;
            }
          }
        } else {
          requiredFlag = dealRuleItem.required;
        }
        return requiredFlag;
      } else {
        return false;
      }
    },
    /**
     * 值改变
     * @param {*} value 值
     * @param {Object} item 具体菜单项
     */
    onChangeValue(value, item) {
      // 向上通知数据变更
      this.$emit('change-value', value, item);
    },
    /**
     * 展示值改变
     * @param {*} value 值
     * @param {String} key 对象key
     */
    onChangeLabel(key, value) {
      // 向上通知数据变更
      this.$emit('change-label', key, value);
    },
    /**
     * ajax请求发起
     * @param {Symbol} symbol 请求唯一标识
     */
    onAjaxStart(symbol) {
      this.$emit('ajax-start', symbol);
    },
    /**
     * ajax请求结束
     * @param {Symbol} symbol 请求唯一标识
     */
    onAjaxEnd(symbol) {
      this.$emit('ajax-end', symbol);
    }
  }
};
</script>
<style lang="less" scoped>
.col-bar {
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  .col-bar-label {
    position: relative;
    display: inline-block;
    flex: 0 0 auto;
    margin: 0 10px;
    font-size: 14px;
    line-height: 32px;
    text-align: right;
    &.required::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
}
</style>
