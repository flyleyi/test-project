<template>
  <el-radio-group v-model="val" v-bind="attrs" v-on="events">
    <template v-for="(item, index) in optionList">
      <el-radio-button
        v-if="config.radioButton"
        v-bind="item"
        :key="index"
        :label="item[valueKey]"
      >
        {{ item[labelKey] }}
      </el-radio-button>
      <el-radio v-else v-bind="item" :key="index" :label="item[valueKey]">
        {{ item[labelKey] }}
      </el-radio>
    </template>
  </el-radio-group>
</template>

<script>
import { Radio, RadioGroup, RadioButton } from 'element-ui';
import dfOptionsMixin from '../mixins/df-options-mixin';

export default {
  name: 'DfRadio',
  mixins: [dfOptionsMixin],
  components: {
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [RadioButton.name]: RadioButton
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
