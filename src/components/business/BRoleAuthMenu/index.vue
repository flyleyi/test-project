<template>
  <!-- 测试动态页面 -->
  <div class="app-container">
    <div class="rolePermission">
      <div class="header">
        <div class="header-right">
          <span class="current-role">当前角色：</span>
          <el-tag>{{ roleName }}</el-tag>
        </div>
        <div class="header-left">
          <el-button
            type="primary"
            icon="el-icon-arrow-left"
            size="small"
            @click="$router.push('/system/role')"
            >返回</el-button
          >
          <el-button size="small" type="primary" @click="saveData"
            >保存</el-button
          >
        </div>
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          v-loading="loading"
          style="width: 100%"
          row-key="menuId"
          border
          default-expand-all
          :header-cell-class-name="headerStyle"
          :cell-class-name="cellStyle"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="menuName" label="菜单列表" width="300">
          </el-table-column>
          <el-table-column label="菜单权限" width="100">
            <template slot-scope="scope">
              <div
                v-if="
                  scope.row.hasParent == '-1' &&
                    scope.row.children &&
                    scope.row.children.length > 0
                "
                style="text-align:center;"
              >
                <img
                  :src="
                    scope.row.checked
                      ? selectedCheckboxIcon
                      : normalCheckboxIcon
                  "
                  class="f-l"
                  @click="check(scope.row.checked, scope.row, '0')"
                />
              </div>
              <div
                v-else-if="
                  scope.row.hasParent == '-1' &&
                    (!scope.row.children || scope.row.children.length <= 0)
                "
                style="text-align:center;"
              >
                <img
                  :src="
                    scope.row.checked
                      ? selectedCheckboxIcon
                      : normalCheckboxIcon
                  "
                  class="f-l"
                  @click="check(scope.row.checked, scope.row, '0')"
                />
              </div>
              <div
                v-else-if="scope.row.buttons && scope.row.buttons.length > 0"
              >
                <img
                  :src="
                    scope.row.checked
                      ? selectedCheckboxIcon
                      : normalCheckboxIcon
                  "
                  class="f-l"
                  @click="check(scope.row.checked, scope.row, '1')"
                />
              </div>
              <div v-else>
                <img
                  :src="
                    scope.row.checked
                      ? selectedCheckboxIcon
                      : normalCheckboxIcon
                  "
                  class="f-l"
                  @click="check(scope.row.checked, scope.row, '1')"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="按钮权限">
            <template slot-scope="scope">
              <div class="f-c table-list">
                <div
                  class="f-c f-l table-list-item"
                  v-for="(item, i) in scope.row.buttons"
                  :key="i"
                  @click="
                    item.checked = !item.checked;
                    check(item.checked, scope.row, '2');
                  "
                >
                  <img
                    :src="
                      item.checked ? selectedCheckboxIcon : normalCheckboxIcon
                    "
                    class="f-l"
                  />
                  <div class="f-l">{{ item.btnName }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/plugins/axios';
import normalCheckboxIcon from '@/assets/images/icon/checkbox-normal.png';
import selectedCheckboxIcon from '@/assets/images/icon/checkbox-selected.png';
import utils from '@/plugins/common/utils';
import { Table, TableColumn, Button, Tag } from 'element-ui';
// eslint-disable-next-line indent
function treeDataChangeField(arrData, settings) {
  //对象数组或对象字段key修改
  settings = settings || {};
  settings.refer = settings.refer === undefined ? 1 : settings.refer;
  var data;
  if (Object.prototype.toString.call(arrData) === '[object Array]') {
    //数组
    data = [];
    for (var i in arrData) {
      data.push(this.treeDataChangeField(arrData[i], settings));
    }
  } else if (arrData && typeof arrData === 'object') {
    //对象
    var opt = settings.data;
    data = {};
    for (let i in settings.refer ? arrData : opt) {
      if (arrData[i] !== undefined) {
        settings.contain && (data[i] = arrData[i]); //包含原数据所有字段，可能会被覆盖
        if (typeof opt[i] == 'function') {
          var obj = opt[i](i, arrData[i], arrData);
          if (Object.prototype.toString.call(obj) === '[object Array]') {
            data[obj[0]] = obj[1];
          } else if (obj && typeof obj === 'object') {
            for (var j in obj) {
              data[j] = obj[j];
            }
          }
        } else {
          var isArr =
            Object.prototype.toString.call(settings.treeNodes) ===
            '[object Array]';
          let key = opt[i] ? opt[i] : i;
          if (isArr) {
            data[key] = settings.treeNodes.indexOf(i) >= 0;
          } else {
            data[key] =
              !settings.treeNodes || settings.treeNodes === i
                ? this.treeDataChangeField(arrData[i], settings)
                : arrData[i];
          }
        }
      }
    }
  } else {
    data = arrData;
  }
  return data;
}
export default {
  name: 'BRoleAuthMenu',
  // 注册组件
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Button.name]: Button,
    [Tag.name]: Tag
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
      id: this.$route.query.id,
      tableData: [],
      normalCheckboxIcon: normalCheckboxIcon,
      selectedCheckboxIcon: selectedCheckboxIcon,
      roleName: '', //当前角色
      loading: false // 加载中
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 创建完成钩子
  created() {
    this.getData();
    this.getName();
  },
  // 挂在完成钩子
  mounted() {},
  // 方法定义
  methods: {
    check(item, row, flg) {
      //flg 0根节点 1子节点 2 按钮权限节点
      if (flg == '0') {
        row.checked = !item;
        if (row.children && row.children.length > 0) {
          for (let i = 0; i < row.children.length; i++) {
            row.children[i].checked = !item;
            for (let j = 0; j < row.children[i].buttons.length; j++) {
              row.children[i].buttons[j].checked = !item;
            }
          }
        }
        if (row.buttons && row.buttons.length > 0) {
          row.buttons.forEach(button => {
            button.checked = !item;
          });
        }
      } else {
        if (flg == '1') {
          row.checked = !item;
          if (row.buttons && row.buttons.length > 0) {
            for (let i = 0; i < row.buttons.length; i++) {
              row.buttons[i].checked = !item;
            }
          }
        } else {
          let res =
            row.buttons &&
            row.buttons.length > 0 &&
            row.buttons.some(value => value.checked)
              ? true
              : false;
          if (res) row.checked = true;
        }
        this.tableData.forEach((item, index, arr) => {
          if (item.children && item.children.length > 0) {
            return (item.checked = item.children.some(value => value.checked)
              ? true
              : false);
          }
        });
      }
    },
    goBack() {
      //返回
      this.$router.push({
        name: 'role'
      });
    },
    headerStyle({ row, rowIndex }) {
      return 'bskHeader';
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'bskCell';
    },
    getData() {
      //获取列表数据
      this.loading = true;
      axios(
        {
          method: 'GET',
          url: `/usergw/admin/roleAuth/selectRoleAuth/${this.id}`
        },
        this.serverType
      )
        .then(res => {
          this.tableData = utils.listConvertTree(
            res.data,
            'menuId',
            'hasParent',
            true
          );
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getChildTree(data) {
      //转换树形结构
      var arr = [];
      arr = treeDataChangeField(arr, {
        data: {
          buttons: 'list'
        },
        treeNodes: 'buttons'
      });
      return arr;
    },
    getName() {
      //获取默认角色
      return axios(
        {
          method: 'GET',
          url: `/usergw/admin/roleAuth/getRoleName/${this.id}`
        },
        this.serverType
      )
        .then(res => {
          this.roleName = res.data;
        })
        .catch(() => {});
    },
    isTopMenu(item) {
      //是否一级菜单
      return item.hasParent == '-1';
    },
    saveData() {
      //保存
      var btnIds = [],
        menuIds = [];
      this.tableData.forEach((item, index, arr) => {
        if (item.checked) {
          menuIds.push(item.menuId);
        }
        // 父级菜单的按钮权限
        Array.isArray(item.buttons) &&
          item.buttons.forEach(item2 => {
            item2.checked && btnIds.push(item2.btnId);
          });
        if (item.children && item.children.length > 0) {
          item.children.forEach((item2, index2, arr2) => {
            if (item2.checked) {
              menuIds.push(item2.menuId);
            }
            if (item2.buttons && item2.buttons.length > 0) {
              item2.buttons.forEach((item3, index3, arr3) => {
                if (item3.checked) {
                  btnIds.push(item3.btnId);
                }
              });
            }
          });
        }
      });
      this.loading = true;
      axios(
        {
          method: 'POST',
          url: '/usergw/admin/roleAuth/saveRoleAuth',
          data: {
            btnIds,
            menuids: menuIds,
            roleId: this.id
          }
        },
        this.serverType
      )
        .then(res => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  margin-bottom: 15px;
  &-right {
    float: right;
    font-size: 14px;
    line-height: 32px;
    .current-role {
      font-weight: bold;
    }
  }
}
.rolePermission {
  background: #fff;
  .btns {
    margin-bottom: 15px;
  }
  &-main {
    &-title {
      font-size: 14px;
      // font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 20px;
      &-label {
        color: rgba(50, 50, 50, 1);
        margin-bottom: 15px;
      }
      &-text {
        color: rgba(112, 114, 118, 1);
      }
    }
    &-btnicon {
      width: 14px;
      position: absolute;
      top: 8px;
      left: 20px;
    }
  }
  .table {
    font-size: 14px;
    // font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(112, 114, 118, 1);
    line-height: 20px;
    &-list {
      &-item {
        height: 20px;
        line-height: 20px;
        margin-right: 30px;
        img {
          margin: 2px 6px 0 0 !important;
          cursor: pointer;
        }
      }
    }
    /deep/.el-icon-arrow-right {
      font-size: 14px;
      line-height: 14px;
    }
    /deep/.el-icon-arrow-right:before {
      content: '\e723';
    }
    /deep/.el-table__expand-icon--expanded .el-icon-arrow-right:before {
      content: '\e722';
    }
    /deep/.el-table__expand-icon--expanded {
      transform: rotate(0deg);
      margin-left: -14px;
    }
    img {
      width: 16px;
      margin: 0px 32px 0;
      cursor: pointer;
    }
  }

  /deep/.bskHeader {
    background-color: #f5f6f7 !important;
    color: #313131;
    padding: 0 !important;
    text-align: center !important;
    height: 47px;
  }
  /deep/.bskCell {
    text-align: center !important;
    padding: 8px 0 !important;
  }
  /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #f1f6ff;
  }
  /deep/.el-table__row .el-button {
    box-shadow: none;
    border: none;
    color: #4375ef;
    border-color: transparent;
    background-color: transparent;
  }
  /deep/.el-table th.is-leaf,
  .el-table td {
    border-bottom: 1px solid #ebebeb;
  }
  /deep/.el-table--border td {
    height: 47px;
  }
  /deep/.el-table .cell {
    display: inline-block;
    line-height: 20px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
  }
}
.table-list {
  display: table;
}
.table-list-item {
  text-align: left;
  display: table-cell;
  cursor: pointer;
}
.f-l {
  float: left;
}
</style>
