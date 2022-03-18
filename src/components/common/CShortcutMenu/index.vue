<template>
  <!-- 快捷菜单 start -->
  <ul class="shortcut-menu">
    <template v-for="(item, index) in menuItems">
      <li
        v-auth="item.auth"
        :key="index"
        class="shortcut-menu__item"
        @click="triggerCommand($event, item, index)"
      >
        {{ item.label }}
      </li>
    </template>
  </ul>
  <!-- 快捷菜单 end -->
</template>

<script>
export default {
  name: 'CShortcutMenu',
  props: {
    /**
     * 菜单项配置
     * label: 显示名称
     * command: 指令
     * disabled: 禁用
     */
    menuItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  methods: {
    /**
     * 触发指令
     * @param {Event} event 事件
     * @param {*} 数据
     * @param {*} 菜单项索引
     */
    triggerCommand(event, data, index) {
      this.$emit('command', event, data.command, data);
    },
    /**
     * 右键事件
     * @param {Event} event 事件对象
     */
    onClickRight(event) {
      // console.log(event)
    }
  }
};
</script>

<style lang="less" scoped>
// 快捷菜单
.shortcut-menu {
  min-width: 100px;
  display: inline-block;
  margin: 0;
  padding: 5px 0;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  li {
    font-size: 14px;
    list-style: none;
    padding: 5px 15px;
    line-height: 26px;
    cursor: pointer;
    user-select: none;
    &:hover {
      background-color: #ecf5ff;
      color: #66b1ff;
    }
  }
}
</style>
