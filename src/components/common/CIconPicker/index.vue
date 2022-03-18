<template>
  <!-- 图标选择面板 -->
  <div class="icon-picker-box">
    <el-scrollbar class="icon-picker el-scrollbar_x">
      <c-svg-icon
        v-for="(icon, index) in icons"
        :key="index"
        :icon-class="icon"
        class="icon"
        @click.native="$emit('select-change', icon)"
      />
    </el-scrollbar>
    <div class="text-right">
      <el-button @click.native="$emit('select-change', '')">清除</el-button>
    </div>
  </div>
</template>

<script>
import { Scrollbar, Button } from 'element-ui';
import CSvgIcon from '../CSvgIcon';

export default {
  name: 'CIconPicker',
  components: {
    [Scrollbar.name]: Scrollbar,
    [Button.name]: Button,
    CSvgIcon
  },
  data() {
    return {
      icons: [
        // 所有的图标名称
        '404',
        'bug',
        'chart',
        'clipboard',
        'component',
        'curriculum',
        'dashboard',
        'date',
        'documentation',
        'drag',
        'edit',
        'email',
        'example',
        'excel',
        'eye',
        'form',
        'guide 2',
        'guide',
        'icon',
        'index',
        'international',
        'language',
        'link',
        'list',
        'lock',
        'message',
        'money',
        'nested',
        'password',
        'people',
        'peoples',
        'qq',
        'setting',
        'shopping',
        'size',
        'star',
        'tab',
        'table',
        'theme',
        'tree',
        'user',
        'wechat',
        'zip'
      ]
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
// .icon-picker-box {
// }
.icon-picker {
  width: 100%;
  height: 300px;
  // margin-left: -20px;
  // overflow-y: auto;
  margin-top: 5px;
  margin-bottom: 5px;
  .icon {
    cursor: pointer;
    color: rgb(48, 65, 86);
    display: inline-block;
    width: 50px;
    height: 50px;
    margin-bottom: 20px;
    margin-left: 20px;
  }
}
</style>
