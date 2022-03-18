<template>
  <!-- 用户管理 -->
  <div class="app-container">
    <b-table
      loading
      :headers="columns"
      :form-items="formItems"
      :ajax-get-data="ajaxGetUserData"
    >
    </b-table>
  </div>
</template>

<script>
import BTable from '../BTable';
import axios from '@/plugins/axios';
export default {
  name: 'BUserManage',
  // 注册组件
  components: {
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
    return {
      // 定义查询表单
      formItems: [
        {
          type: 'input',
          prop: 'staffName',
          label: '姓名：'
        },
        {
          type: 'input',
          prop: 'staffCode',
          label: '工号：'
        },
        {
          type: 'select',
          options: [
            {
              value: '0',
              label: '启用'
            },
            {
              value: '1',
              label: '禁用'
            }
          ],
          prop: 'isShow',
          label: '状态：'
        }
      ]
    };
  },
  // 计算属性
  computed: {
    // 定义列
    columns: () => {
      return [
        {
          label: '教师名称',
          prop: 'staffName'
        },
        {
          label: '教师工号',
          prop: 'staffCode'
        },
        {
          label: '手机号码',
          prop: 'mobile'
        },
        {
          label: '性别',
          prop: 'gender'
        },
        {
          label: '状态',
          prop: 'isShow',
          formatter(row, column, cellValue) {
            return cellValue == '0' ? '启用' : '禁用';
          }
        },
        {
          label: '单位/部门',
          prop: 'organization',
          'show-overflow-tooltip': true
        }
      ];
    }
  },
  // 侦听器
  watch: {},
  // 创建完成钩子
  created() {},
  // 挂在完成钩子
  mounted() {},
  // 方法定义
  methods: {
    /**
     * 获取用户数据
     */
    ajaxGetUserData(params) {
      return axios(
        {
          method: 'GET',
          url: '/userManage/queryUserInfo',
          params
        },
        this.serverType
      );
    }
  }
};
</script>

<style lang="less" scoped>
.user {
  background: #fff;
  border-radius: 2px;
  padding: 0 25px 0;
  &-table {
    padding-top: 23px;
  }
}
</style>
