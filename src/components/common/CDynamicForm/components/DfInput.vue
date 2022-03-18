<template>
  <el-input
    v-if="attrs.type === 'number'"
    v-model.number="val"
    v-bind="attrs"
    v-on="events"
  />
  <el-input v-else v-model.trim="val" v-bind="attrs" v-on="events" />
</template>

<script>
import { Input } from 'element-ui';
import dfMixin from '../mixins/df-mixin';

export default {
  name: 'DfInput',
  mixins: [dfMixin],
  components: {
    [Input.name]: Input
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped></style>
