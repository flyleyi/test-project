<template>
  <el-checkbox-group v-model="val" v-bind="attrs">
    <template v-for="(item, index) in optionList">
      <el-checkbox-button
        v-if="config.radioButton"
        v-bind="item"
        v-on="events"
        :key="index"
        :label="item[valueKey]"
      >
        {{ item[labelKey] }}
      </el-checkbox-button>
      <el-checkbox
        v-else
        v-bind="item"
        v-on="events"
        :key="index"
        :label="item[valueKey]"
      >
        {{ item[labelKey] }}
      </el-checkbox>
    </template>
  </el-checkbox-group>
</template>

<script>
import { Checkbox, CheckboxGroup, CheckboxButton } from 'element-ui';
import dfOptionsMixin from '../mixins/df-options-mixin';

export default {
  name: 'DfCheckbox',
  mixins: [dfOptionsMixin],
  props: {
    /**
     * 值
     */
    value: {
      type: Array,
      default: () => []
    }
  },
  components: {
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [CheckboxButton.name]: CheckboxButton
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style lang="less" scoped></style>
