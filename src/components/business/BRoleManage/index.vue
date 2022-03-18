<template>
  <!-- 角色管理 -->
  <div class="app-container">
    <b-table
      ref="bTable"
      loading
      :headers="columns"
      :form-items="formItems"
      :ajax-get-data="ajaxGetRoleData"
      :toolbars="toolbars"
      :show-column="false"
    ></b-table>
    <!-- 新增编辑弹窗 -->
    <el-dialog
      :title="dialog.isedit ? '编辑' : '新增'"
      width="540px"
      center
      class="dialog"
      :visible.sync="dialog.visible"
    >
      <el-form ref="elForm" label-width="80px" :model="ruleForm" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input type="input" v-model.trim="ruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input type="input" v-model.trim="ruleForm.roleDesc"></el-input>
        </el-form-item>
        <el-form-item v-if="dialog.isedit" label="角色状态" prop="roleDesc">
          <el-select v-model="ruleForm.isShow">
            <el-option
              v-for="(item, index) in formItems[2].options"
              :key="index"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialog.visible = false">取消</el-button>
        <el-button size="small" type="primary" @click="sureDialog"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Dialog,
  Button,
  Select,
  Option,
  Input,
  Form,
  FormItem
} from 'element-ui';
import BTable from '../BTable';
import axios from '@/plugins/axios';
function mergeDefault() {
  var f = {},
    m = arguments.length,
    o = arguments[m - 1],
    b = 0,
    k,
    h,
    d,
    g;
  if (typeof o == 'boolean') {
    b++;
    h = o;
  }
  if (Object.prototype.toString.call(arguments[0]) === '[object Array]') {
    d = true;
    g = arguments[0];
    k = arguments[1];
  } else {
    k = arguments[0] || {};
  }
  for (var c = 0; c < m - b; c++) {
    var a = arguments[c];
    for (var e in d ? g : k) {
      var n = d ? g[e] : e;
      if (a && a[n] !== undefined) {
        h ? (f[n] = a[n]) : (k[n] = a[n]);
      } else {
        h && c == 0 && (f[n] = k[n]);
      }
    }
  }
  return h ? f : k;
}

export default {
  name: 'BRoleManage',
  // 注册组件
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [Select.name]: Select,
    [Option.name]: Option,
    [Input.name]: Input,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
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
    // 权限校验方法
    let $has = this.$has;
    typeof $has !== 'function' && ($has = () => true);
    return {
      $has,
      dialog: {
        visible: false,
        isedit: false
      },
      ruleForm: {
        // roleId: '',//角色编码
        roleName: '', //角色姓名
        roleDesc: '', //角色描述
        isShow: '' //角色状态 0启用 1禁用
      },
      rules: {
        roleName: [
          { required: true, trigger: 'blur', message: '角色名称未填写' }
        ],
        isShow: [{ required: true, trigger: 'blur', message: '角色状态未填写' }]
      }
    };
  },
  // 计算属性
  computed: {
    /**
     * 表单列
     */
    columns() {
      let btns = [
        {
          label: '编辑',
          click: this.editTableRole,
          hidden: () => !this.$has(['role-edit']),
          size: 'mini',
          type: 'primary'
        },
        {
          label: '删除',
          click: row => this.del(row.roleId),
          hidden: () => !this.$has(['role-delete']),
          size: 'mini',
          type: 'primary'
        },
        {
          label: '菜单授权',
          click: row => this.menuPermission(row.roleId),
          hidden: () => !this.$has(['role-permission']),
          size: 'mini',
          type: 'primary'
        },
        {
          label: '分配用户',
          click: row => this.allotUser(row.roleId),
          hidden: () => !this.$has(['role-allotUser']),
          size: 'mini',
          type: 'primary'
        }
      ];
      return [
        {
          label: '角色编码',
          prop: 'roleId'
        },
        {
          label: '角色名称',
          prop: 'roleName',
          'show-overflow-tooltip': true
        },
        {
          label: '角色描述',
          prop: 'roleDesc',
          'show-overflow-tooltip': true
        },
        {
          label: '角色状态',
          prop: 'isShow',
          formatter(row, column, cellValue) {
            return cellValue == '0' ? '启用' : '禁用';
          }
        },
        {
          label: '操作',
          colType: 'btns',
          btns: btns.filter(item => this.$has(item.auth)),
          width: '340px'
        }
      ];
    },
    /**
     * 表单项
     */
    formItems() {
      return [
        {
          type: 'input',
          prop: 'roleName',
          label: '角色名称：'
        },
        {
          type: 'input',
          prop: 'roleId',
          label: '角色编码：'
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
      ];
    },
    /**
     * 工具栏
     */
    toolbars() {
      let toolbars = [
        {
          label: '新增',
          click: this.addtableRole,
          auth: ['role-add']
        }
      ];
      return toolbars.filter(item => this.$has(item.auth));
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
    ajaxGetRoleData(params) {
      return axios(
        {
          method: 'GET',
          url: '/usergw/admin/common/pageList/301',
          params
        },
        this.serverType
      );
    },
    menuPermission(id) {
      //菜单授权
      this.$router.push({
        path: '/system/role/menu-auth',
        query: {
          id: id
        }
      });
    },
    del(id) {
      //删除
      this.$confirm('删除后不可恢复，确定删除？', '删除确认', {
        customClass: 'box-danger',
        center: true
      })
        .then(() => {
          this.confirmLoading = true;
          axios(
            {
              method: 'GET',
              url: `/usergw/admin/roleAuth/deleteRole/${id}`
            },
            this.serverType
          )
            .then(({ data }) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.$refs.bTable.ajaxGetTableDataByPage();
            })
            .catch(() => {
              this.confirmLoading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    allotUser(id) {
      this.$router.push({
        path: '/system/role/allot-user',
        query: {
          roleId: id
        }
      });
    },
    addtableRole() {
      this.dialog.visible = true;
      this.dialog.isedit = false;
      for (var i in this.ruleForm) {
        this.ruleForm[i] = '';
      }
      delete this.ruleForm.roleId;
    },
    editTableRole(row) {
      this.dialog.visible = true;
      this.dialog.isedit = true;
      mergeDefault(this.ruleForm, row);
      this.ruleForm.roleId = row.roleId;
    },
    async sureDialog() {
      //新增编辑弹窗
      if (!this.dialog.isedit) {
        this.ruleForm.isShow = '0';
      }
      try {
        await this.$refs.elForm.validate();

        this.confirmLoading = true;
        if (this.dialog.isedit) {
          axios(
            {
              method: 'POST',
              url: '/usergw/admin/common/save/301/02',
              data: this.ruleForm
            },
            this.serverType
          )
            .then(({ data }) => {
              this.dialog.visible = false;
              this.$message({
                type: 'success',
                message: '编辑成功!'
              });
              this.$refs.bTable.ajaxGetTableDataByPage();
            })
            .catch(() => {
              this.confirmLoading = false;
            });
        } else {
          axios(
            {
              method: 'POST',
              url: '/usergw/admin/common/save/301/01',
              data: this.ruleForm
            },
            this.serverType
          )
            .then(({ data }) => {
              this.dialog.visible = false;
              this.$message({
                type: 'success',
                message: '新增成功!'
              });
              this.$refs.bTable.ajaxGetTableDataByPage();
            })
            .catch(() => {
              this.confirmLoading = false;
            });
        }
      } catch (e) {
        // 表单校验失败
        console.error('表单校验失败', e);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.role {
  background: #fff;
  padding: 0 25px 0;
  &-main {
    padding-top: 23px;
  }
  .dialog {
    &-content {
      &-item {
        margin-bottom: 29px;
        margin-left: 8px;
        &-label {
          float: left;
          min-width: 90px;
        }
        &-red {
          color: #f5222d;
        }
        &-text {
          text-align: left;
        }
      }
      &-btns {
        text-align: center;
        padding-bottom: 27px;
        button {
          margin: 0 20px;
          width: 86px;
          height: 36px;
          font-size: 14px;
          // font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
