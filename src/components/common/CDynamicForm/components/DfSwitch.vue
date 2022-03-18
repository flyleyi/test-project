<template>
  <el-switch v-model="val" v-bind="attrs" v-on="events" />
</template>

<script>
import { Switch } from 'element-ui';
import dfMixin from '../mixins/df-mixin';

export default {
  name: 'DfSwitch',
  mixins: [dfMixin],
  components: {
    [Switch.name]: Switch
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped></style>
