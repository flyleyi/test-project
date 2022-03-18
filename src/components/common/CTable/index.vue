<!--
 * @Author: your name
 * @Date: 2021-09-18 10:16:11
 * @LastEditTime: 2021-10-08 19:08:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mutilwap\src\components\common\CTable\index.vue
-->
<template>
  <div class="m-table">
    <el-table ref="table" v-bind="$props" v-on="$listeners">
      <template v-for="(col, index) in headers">
        <!-- btns操作栏 -->
        <el-table-column
          :key="index"
          v-bind="col"
          v-if="col.colType == 'btns' && !col.hidden"
        >
          <template slot-scope="scope">
            <el-button
              :size="btn.size"
              :type="btn.type"
              :key="btnIndex"
              v-for="(btn, btnIndex) in col.btns"
              v-show="isShowButton(scope.row, scope.$index, btn)"
              @click.stop="btn.click(scope.row, scope.$index, btnIndex)"
              >{{ btn.label }}</el-button
            >
          </template>
        </el-table-column>
        <!-- 自定义栏 -->
        <el-table-column
          :key="index"
          v-bind="col"
          v-else-if="col.colType == 'column' && !col.hidden"
        >
          <template slot-scope="scope">
            <slot
              :name="'column|' + (col.slotName || col.prop)"
              :row="scope.row"
              :$index="scope.$index"
            ></slot>
          </template>
        </el-table-column>
        <!-- 通用栏 -->
        <el-table-column v-bind="col" :key="index" v-else-if="!col.hidden">
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script>
import { Table, TableColumn, Button } from 'element-ui';
import props from './props';
export default {
  name: 'CTable',
  components: {
    ElButton: Button,
    ElTable: Table,
    ElTableColumn: TableColumn
  },
  props,
  activated() {
    // 解决缓存切换错位问题
    this.doLayout();
  },
  methods: {
    /**
     * 重新渲染
     */
    doLayout() {
      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.doLayout();
      });
    },
    /**
     * 是否显示按钮
     * @param {Object} row table行数据
     * @param {Number} rowIndex table行索引
     * @param {Object} btn 按钮配置项
     */
    isShowButton(row, rowIndex, btn) {
      let { hidden } = btn;
      if (typeof hidden === 'function') return !hidden(row, rowIndex, btn);
      return !hidden;
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-button + .el-button {
  margin-left: 5px;
}
/deep/ .el-button {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
