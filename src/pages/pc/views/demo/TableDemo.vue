<template>
  <div class="test-table">
    <c-filter-check-panel
      ref="checkPanel"
      :data="headers1"
      :successMsg="successMsg"
      :ajaxFun="ajaxTest"
    ></c-filter-check-panel>
    <el-button size="small" type="primary" @click="onPop">列排序</el-button>
    <el-button size="small" type="primary" @click="onPop2">列排序2</el-button>
    <h1>通用表+分页</h1>
    <c-table
      ref="table"
      :headers="headers1"
      :data="tableData1"
      :border="border"
      :maxHeight="maxHeight"
      @cell-click="onCellClick"
      @header-click="onHeaderClick"
      @cell-dlclick="onCellDblClick"
      @row-click="onRowClick"
      @row-dblclick="onRowDblClick"
      @current-change="onCurrentChange"
    >
    </c-table>
    <h1>自定义列内容</h1>
    <b-table
      :headers="headers2"
      :ajaxGetData="getTableData2"
      :spanMethod="spanMethod"
      :loading="true"
      @header-click="onHeaderClick"
    >
      <div
        class="test"
        slot-scope="scope"
        slot="column|t1"
        @click.stop="onTest(scope.row, scope.$index)"
      >
        <div>custom1-{{ scope.row.name }}</div>
        <div>custom2-{{ scope.row.date | formatDateTime('yyyy-MM-dd') }}</div>
      </div>
      <div
        class="test2"
        slot-scope="scope"
        slot="column|demo"
        @click.stop="onTest(scope.row, scope.$index)"
      >
        <div>custom1-{{ scope.row.name + 'eees' }}</div>
      </div>
    </b-table>
    <!-- <HlTable
      ref="table"
      :headers="headers2"
      :data="tableData2"
      :border="border"
      :showPagination="false"
      :maxHeight="maxHeight"
    >
      <div
        class="test"
        slot-scope="scope"
        slot="column|t1"
        @click.stop="onTest(scope.row, scope.$index)"
      >
        <div>custom1-{{ scope.row.name }}</div>
        <div>custom2-{{ scope.row.date | formatDateTime('yyyy-MM-dd') }}</div>
      </div>
      <div
        class="test2"
        slot-scope="scope"
        slot="column|t2"
        @click.stop="onTest(scope.row, scope.$index)"
      >
        <div>custom1-{{ scope.row.name + 'eees' }}</div>
      </div>
    </HlTable> -->
  </div>
</template>

<script>
import CTable from '@/components/common/CTable';
import BTable from '@/components/business/BTable';
import CFilterCheckPanel from '@/components/common/CFilterCheckPanel/index.js';
import CFilterCheckPanel2 from '@/components/common/CFilterCheckPanel/index.vue';
import UTILS from '@/plugins/common/utils';
import { Message, Button } from 'element-ui';
import { getTableData, getTableData2 } from '../../api/test';
export default {
  name: 'Home',
  components: {
    ElButton: Button,
    BTable,
    CTable,
    [CFilterCheckPanel2.name]: CFilterCheckPanel2
    // CFilterCheckPanel
  },
  data() {
    return {
      successMsg: '保存成功',
      checkList: [
        {
          label: '哈哈哈',
          prop: 'sage',
          show: true
          // required: true
        },
        {
          label: 'xxx',
          prop: 'nam',
          required: true
        }
      ],
      border: true,
      maxHeight: 300,
      headers1: [
        {
          label: '序号',
          type: 'index',
          prop: 'index',
          //type设置为index后，为index设置function，可以自定义序号返回格式
          index: index => {
            return '第' + (index + 1) + '项';
          },
          width: 100,
          fixed: 'left'
        },
        {
          label: '姓名',
          prop: 'name',
          width: 200,
          required: true
        },
        {
          label: 'waaa',
          width: 200
        },
        {
          label: '姓名2',
          prop: 'name2',
          width: 200,
          hidden: true
        },
        {
          label: '日期',
          prop: 'date',
          formatter: (row, col, value) => {
            return UTILS.dateConverter('yyyy-MM-dd hh:mm:ss', value);
          }
        }
      ],
      headers2: [
        {
          label: '序号',
          type: 'index',
          //type设置为index后，为index设置function，可以自定义序号返回格式
          index: (index, page, size) => {
            console.log(index, page);
            return '第' + (index + 1 + (page - 1) * size) + '项';
          },
          width: 100,
          fixed: 'left'
        },
        {
          label: '姓名',
          sortable: 'custom',
          prop: 'schoolName',
          filters: [
            { text: '小学', value: '小学' },
            { text: '海', value: '海' }
          ],
          filterMathod: (value, row) => {
            return row.schoolName.indexOf(value) != -1;
          },
          width: 200
        },
        {
          label: '使用slot + colType=column',
          colType: 'column',
          prop: 't1',
          width: 300
        },
        {
          label: '使用slot + colType=column',
          colType: 'column',
          slotName: 'demo',
          prop: 't2',
          width: 300
        },
        {
          label: '操作(colType=btns)',
          colType: 'btns',
          prop: 'name',
          btns: [
            {
              label: '新增',
              type: 'primary',
              click: (row, rowIndex, btnIndex) => {
                console.log(row, rowIndex, btnIndex, this.tableData1);
                Message({
                  type: 'success',
                  message: `点击${rowIndex}行按钮${btnIndex}`
                });
              }
            },
            {
              label: '修改',
              size: 'small',
              type: 'success',
              click: (row, rowIndex, btnIndex) => {
                console.log(row, rowIndex, btnIndex, this.tableData1);
                Message({
                  type: 'success',
                  message: `点击${rowIndex}行按钮${btnIndex}`
                });
              }
            }
          ]
        }
      ],
      tableData1: [],
      tableData2: [
        {
          name: 'wa2',
          date: new Date().getTime()
        },
        {
          name: 'kesa1',
          date: new Date().getTime()
        }
      ]
    };
  },
  mounted() {
    this.ajaxGetTabelDataDemo();
  },
  methods: {
    getTableData,
    getTableData2,
    ajaxGetTabelDataDemo() {
      let data = [];
      for (let i = 0; i < 10; i++) {
        let now = new Date();
        data.push({
          date: now.getTime(),
          name: '测试|' + i,
          name2: '测试2|' + i
        });
      }
      this.tableData1 = data;
    },
    ajaxTest(params) {
      console.log(params);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.7) {
            resolve({ data: 'ok' });
          } else {
            reject({ data: 'err' });
          }
        }, 2000);
      });
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    onPop() {
      this.$refs.checkPanel.show();
      // CFilterCheckPanel.show({
      //   data: this.headers1,
      //   ajaxFun: this.ajaxTest,
      //   successMsg: '保存成功',
      //   editOriginData: true,
      //   callback(data) {
      //     //console.log(data); // ['name', 'age' ...]
      //   }
      // });
    },
    onPop2() {
      CFilterCheckPanel.show({
        title: '多列测试',
        data: this.headers2,
        callback(data) {
          //console.log(data) // ['name', 'age' ...]
        }
      });
    },
    onTest(row, index) {
      console.log('test', row, index);
      Message({
        type: 'success',
        message: '点击自定义列' + index
      });
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      console.log('current-change', currentRow, oldCurrentRow);
    },
    onHeaderClick(column, event) {
      console.log('header-click', column, event);
    },
    onRowClick(row, column, event) {
      console.log('row-click', row);
    },
    onRowDblClick(row, column, event) {
      console.log('row-dblclick', row);
    },
    onCellClick(row, column, cell, event) {
      console.log('cell-click', row);
    },
    onCellDblClick(row, column, cell, event) {
      console.log('cell-dblclick', row);
    }
  }
};
</script>
<style lang="less" scoped></style>
