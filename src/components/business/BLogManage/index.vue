·<template>
  <!-- 系统日志 -->
  <div class="app-container">
    <!-- url配置获取数据 -->
    <!-- <xm-table
      url="/usergw/admin/common/pageList/100">
    </xm-table> -->
    <b-table
      ref="bTable"
      loading
      :headers="columns"
      :form-items="formItems"
      :ajax-get-data="fatchMethod"
    >
      <template slot="column|unitList" slot-scope="{ row }">
        <el-table class="expand-table" size="1" :data="row.unitList" border>
          <el-table-column label="列注释" prop="colNameZn" />
          <el-table-column label="列名" prop="colName" />
          <el-table-column label="列新值" prop="colValueNew" />
          <el-table-column label="列旧值" prop="colValueOri" />
        </el-table>
      </template>
    </b-table>
    <!-- <xm-table
      ref="xmTable"
      :fatch-method="fatchMethod"
      :form-items="formItems"
      :columns="columns"
      :tableOptions="{ size: '1' }"
    >
      <template slot="table-prepend">
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-table class="expand-table" size="1" :data="row.unitList" border>
              <el-table-column label="列注释" prop="colNameZn" />
              <el-table-column label="列名" prop="colName" />
              <el-table-column label="列新值" prop="colValueNew" />
              <el-table-column label="列旧值" prop="colValueOri" />
            </el-table>
          </template>
        </el-table-column>
      </template>
      <template slot="otherHandle" slot-scope="{ row }">
        <el-button
          :loading="row.loading"
          type="primary"
          @click="handletoggle(row)"
          >启用</el-button
        >
      </template>
    </xm-table> -->
  </div>
</template>

<script>
import axios from '@/plugins/axios';
import { Button, TableColumn, Table } from 'element-ui';
import BTable from '../BTable';
import utils from '@/plugins/common/utils';
export default {
  name: 'BLogManage',
  // 注册组件
  components: {
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    BTable
  },
  props: {
    /**
     * 服务器类型
     */
    serverType: {
      type: String,
      default: ''
    }
  },
  // 定义数据
  data() {
    const self = this;
    return {
      /**
       * 定义列
       */
      columns: [
        {
          prop: 'unitList',
          colType: 'column',
          type: 'expand'
        },
        {
          label: '表名',
          prop: 'tableName',
          'show-overflow-tooltip': true
        },
        {
          label: 'ip',
          prop: 'ip'
        },
        {
          label: '操作页面',
          prop: 'operatePage'
        },
        {
          label: '操作按钮',
          prop: 'operateButton'
        },
        {
          label: '操作类型',
          prop: 'operateType'
        },
        {
          label: '用户账号',
          prop: 'operateUserId'
        },
        {
          label: '开始时间',
          prop: 'createDate',
          width: '191px',
          formatter(row, column, cellValue) {
            return utils.dateConverter('yyyy-MM-dd hh:mm:ss', cellValue);
          }
        }
      ],
      // 定义查询表单
      formItems: [
        {
          type: 'input',
          prop: 'ip',
          label: 'IP地址',
          maxlength: 15
        },
        {
          type: 'input',
          prop: 'tableName',
          label: '表名',
          maxlength: 255
        },
        {
          type: 'input',
          prop: 'operateUserId',
          label: '用户账户'
        },
        {
          type: 'select',
          prop: 'result',
          label: '操作结果',
          options: [
            {
              label: '成功',
              value: 'success'
            },
            {
              label: '失败',
              value: 'failure'
            }
          ]
        },
        {
          type: 'select',
          prop: 'operateType',
          label: '操作类型',
          options: [
            {
              value: '新增',
              label: '新增'
            },
            {
              value: '更新',
              label: '更新'
            },
            {
              value: '删除',
              label: '删除'
            }
          ]
        },
        {
          type: 'date-picker',
          prop: 'date',
          label: '日期范围',
          attrs: {
            type: 'daterange',
            'value-format': 'yyyy-MM-dd',
            'range-separator': '至',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期',
            'unlink-panels': true,
            align: 'right',
            pickerOptions: {
              shortcuts: [
                {
                  text: '最近一周',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                  }
                },
                {
                  text: '最近一个月',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                  }
                },
                {
                  text: '最近三个月',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                  }
                }
              ]
            }
          }
        }
      ]
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 创建完成钩子
  created() {},
  // 挂在完成钩子
  mounted() {},
  // 方法定义
  methods: {
    /**
     * 获取列表数据的请求方法
     */
    fatchMethod(params) {
      params.currentPage = params.page;
      params = { ...params };
      if (params.date && params.date.length >= 2) {
        // 处理日期
        params.startDate = params.date[0];
        params.endData = params.date[1];
        delete params.date;
      }
      return axios(
        {
          method: 'GET',
          url: '/logInfo/list',
          params
        },
        this.serverType
      ).then(({ data }) => {
        return {
          data: {
            records: Array.isArray(data.list) ? data.list : [],
            total: data.totalRecords || 0
          }
        };
      });
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-table__expanded-cell {
  padding: 0 0 0 47px;
}
/deep/ .el-table__header-wrapper th {
  background: rgba(245, 246, 247, 1);
}
.expand-table {
  border-top: none;
  /deep/ .el-table__header-wrapper th {
    background: rgba(241, 246, 255, 1);
  }
}
</style>
