<template>
  <el-date-picker v-model="val" v-bind="attrs" v-on="events"></el-date-picker>
</template>

<script>
import { DatePicker } from 'element-ui';
import dfMixin from '../mixins/df-mixin';

export default {
  name: 'DfDatePicker',
  mixins: [dfMixin],
  components: {
    [DatePicker.name]: DatePicker
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped></style>
