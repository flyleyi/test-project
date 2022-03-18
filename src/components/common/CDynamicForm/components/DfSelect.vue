<template>
  <el-select
    ref="select"
    :popper-class="popperClass"
    v-model="val"
    v-bind="attrs"
    v-on="events"
    v-scrolloutclose="{
      el: scrollEl, //scroll滚动区域
      handler: onCloseDropDown //触发事件
    }"
    :title="labelVal"
    :loading="!!lastRequestSymbol"
    @change="onChange"
  >
    <el-option
      v-for="(item, index) in optionList"
      v-bind="item"
      :key="index"
      :value="item[valueKey]"
      :label="item[labelKey]"
    >
    </el-option>
  </el-select>
</template>

<script>
import { generateUUID } from '@/plugins/common/generate';
import { Select, Option } from 'element-ui';
import dfOptionsMixin from '../mixins/df-options-mixin';

export default {
  name: 'DfSelect',
  mixins: [dfOptionsMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  data() {
    return {
      uuid: generateUUID()
    };
  },
  computed: {
    //展示下拉框本文tip
    labelVal() {
      let { model } = { ...this.CDynamicForm };
      let { labelProp } = { ...this.config };
      //无值不展示
      if (this.val !== false && !this.val) return '';
      if (labelProp) {
        return model[labelProp];
      }
      let res = this.optionList.find(item => item[this.valueKey] === this.val);
      if (res) {
        return res[this.labelKey];
      } else {
        return '';
      }
    },
    popperClass() {
      return 'dropdown-' + this.config.prop + '-' + this.uuid;
    },
    scrollEl() {
      return '.' + this.popperClass + ' .el-select-dropdown__wrap';
    }
  },
  watch: {
    //值清空时,将【labelProp】对应的值清空
    val(value) {
      if (value) return;
      this.config.labelProp &&
        this.$emit('change-label', this.config.labelProp, '');
    }
  },
  created() {},
  methods: {
    //下拉框区域外滚动，将下拉框隐藏
    onCloseDropDown(e, el) {
      let selectRef = this.$refs['select'];
      //当前绑定的滚动区域是此下拉框，并且下拉框显示了，则将其隐藏
      if (this.scrollEl === el && selectRef && selectRef.visible)
        selectRef.blur();
    },
    /**
     * 值改变
     * - 如果有设置labelProp自动填充
     * @param {*} value 值
     */
    onChange(value) {
      if (this.config.labelProp) {
        let res;
        //多选下拉
        if (Array.isArray(value)) {
          res = [];
          value.forEach(val => {
            let v = this.optionList.find(item => item[this.valueKey] === val);
            v && res.push(v[this.labelKey]);
          });
          this.CDynamicForm.model[this.config.labelProp] = res;
        } else {
          res = this.optionList.find(item => item[this.valueKey] === value);
          if (res) {
            this.CDynamicForm.model[this.config.labelProp] = res[this.labelKey];
          } else {
            this.CDynamicForm.model[this.config.labelProp] = '';
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped></style>
