<template>
  <div class="app-container">
    <el-row class="menu-box">
      <el-col v-loading="listLoading" :sm="12" :lg="6" class="card-box-col">
        <el-card class="card-box">
          <div class="card-label">菜单列表</div>
          <el-scrollbar class="he-item el-scrollbar_x">
            <el-tree
              ref="treeMenu"
              :props="propsOptions"
              :expand-on-click-node="false"
              :data="treeData"
              :allow-drag="allowDrap"
              :allow-drop="allowDrop"
              draggable
              node-key="menuId"
              highlight-current
              render-after-expand
              class="tree el-card-box"
              default-expand-all
              @node-contextmenu="showContext"
              @node-click="handleNodeClick"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
            />
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :sm="12" :lg="6" class="card-box-col">
        <el-card class="card-box">
          <div class="card-label deep-card">菜单详细信息</div>
          <div class="he-item el-card-box">
            <el-form
              size="small"
              label-position="left"
              label-width="100px"
              class="form-info"
            >
              <el-form-item label="菜单地址">
                <el-input :value="nowNode.url" readonly />
              </el-form-item>
              <el-form-item label="菜单名称">
                <el-input :value="nowNode.menuName" readonly />
              </el-form-item>
              <el-form-item label="上级菜单">
                <el-select
                  v-model="nowNode.parentMenuId"
                  placeholder="上级菜单"
                  clearable
                  style="width:100%"
                  disabled
                >
                  <el-option :value="-1" :label="rootTitle" />
                  <el-option :label="rootTitle" value="-1" />
                  <el-option label="无" value="-2" />
                  <el-option
                    v-for="(item, key) in superMenu"
                    :key="key"
                    :label="item"
                    :value="+key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="图标">
                <div class="icon-box">
                  <c-svg-icon
                    v-if="nowNode.icon"
                    :icon-class="nowNode.icon || ''"
                    class="icon"
                  />
                </div>
                <!-- <el-input :value="nowNode.icon" readonly/> -->
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="12" :lg="6" class="card-box-col">
        <el-card class="card-box menu-button">
          <div class="card-label">按钮权限</div>
          <div class="he-item el-card-box">
            <div class="export">
              <el-button
                size="small"
                type="primary"
                icon="el-icon-upload"
                @click="$refs.bImportDataPanel.show()"
              >
                导入
              </el-button>
              <!-- 导入 start -->
              <!-- <el-button
                type="primary"
                class="export-mb"
                icon="el-icon-upload"
                @click="$refs.file.click()"
                >导入</el-button
              >
              <input
                v-upload.xls.xlsx="{
                  path: '/auth/itfImport',
                  success: onSuccess
                }"
                v-show="false"
                ref="file"
                type="file"
                name="file"
              /> -->
              <!-- 导入 end -->
              <el-button
                size="small"
                type="primary"
                icon="el-icon-download"
                @click="exportExcel"
                >导出</el-button
              >
              <el-button
                size="small"
                :disabled="!isNowNode"
                icon="el-icon-circle-plus"
                type="primary"
                @click.stop="
                  changeBtn({ type: 0, menuId: nowNode.menuId }, 'new')
                "
                >添加</el-button
              >
            </div>
            <div class="btn-list">
              <span
                v-for="(item, index) in authList"
                :key="index"
                class="btn-item btn-item-b"
                @click.stop="changeBtn(item, 'editor')"
              >
                {{ item.itfName }}
                <img
                  :src="deletePng"
                  class="delete-img"
                  @click.stop="deleteBtn(item)"
                />
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="12" :lg="6" class="card-box-col">
        <el-card class="card-box">
          <div class="card-label deep-card">可操作角色</div>
          <div class="he-item el-card-box">
            <div class="card-list">
              <div
                v-for="item in roleList"
                :key="item.roleId"
                class="card-item"
              >
                {{ item.roleName }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div
      v-show="menuContextShow"
      id="menu-context"
      ref="menu-context"
      class="shortcut-menu"
    >
      <li
        v-if="menuContextList[0] && $has(['menu-add'])"
        class="menu-context-item"
        @click="handleTree(0)"
      >
        新建
      </li>
      <li
        v-if="menuContextList[1] && $has(['menu-edit'])"
        class="menu-context-item"
        @click="handleTree(1)"
      >
        编辑
      </li>
      <li
        v-if="menuContextList[2] && $has(['menu-delete'])"
        class="menu-context-item"
        @click="handleTree(2)"
      >
        删除
      </li>
    </div>
    <el-dialog
      center
      :visible.sync="addDialog"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="title"
      width="580px"
    >
      <el-form
        ref="addForm"
        :model="addData"
        :rules="addRules"
        label-width="120px"
        label-position="right"
        style="margin-right: 40px"
      >
        <!-- <el-form-item label="菜单类型" prop="roleType">
          <el-radio-group v-model="addData.roleType" :disabled="roleTypeDisabled">
            <el-radio label="0">pc端</el-radio>
            <el-radio label="1">钉钉端</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item label="菜单地址：" prop="url">
          <el-input v-model.trim="addData.url" />
        </el-form-item>
        <el-form-item label="菜单名称：" prop="menuName">
          <el-input v-model.trim="addData.menuName" />
        </el-form-item>
        <el-form-item label="图标：" prop="icon">
          <el-popover placement="right" width="400" trigger="click">
            <c-icon-picker @select-change="icon => (addData.icon = icon)" />
            <div slot="reference" class="icon-box">
              <c-svg-icon
                v-if="addData.icon"
                :icon-class="addData.icon"
                class="icon"
              />
            </div>
            <!-- <el-input slot="reference" v-model="addData.icon"/> -->
          </el-popover>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button
          size="small"
          :loading="confirmLoading"
          @click="addDialog = false"
          >取消</el-button
        >
        <el-button
          :loading="confirmLoading"
          type="primary"
          size="small"
          @click="addSure"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="btnDialog"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="btntitle"
      class="btn-el-dialog"
      width="580px"
    >
      <el-form
        ref="btnForm"
        :model="btnData"
        :rules="btnRules"
        label-width="120px"
        label-position="right"
        style="margin-right: 40px"
      >
        <!-- <el-form-item label="按钮名称" prop="itfName">
          <el-input v-model="btnData.itfName"/>
        </el-form-item>-->
        <el-form-item label="接口code" prop="itfCode">
          <el-input v-model.trim="btnData.itfCode" />
        </el-form-item>
        <el-form-item label="接口名称" prop="itfName">
          <el-input v-model.trim="btnData.itfName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" :loading="btnLoading" @click="btnCancel"
          >取消</el-button
        >
        <el-button
          size="small"
          :loading="btnLoading"
          type="primary"
          @click="btnSure"
          >提交</el-button
        >
      </div>
    </el-dialog>
    <b-import-data-panel
      ref="bImportDataPanel"
      url="/auth/itfImport"
      :on-success="onSuccess"
    >
    </b-import-data-panel>
  </div>
</template>
<script>
import utils from '@/plugins/common/utils';
import deletePng from '@/assets/images/delete.png';
import CIconPicker from '../../common/CIconPicker';
import CSvgIcon from '../../common/CSvgIcon';
import {
  Row,
  Col,
  Form,
  FormItem,
  Button,
  Dialog,
  Popover,
  Card,
  Option,
  Input,
  Select,
  Tree,
  Scrollbar
} from 'element-ui';
import axios from '@/plugins/axios';
import BImportDataPanel from '@/components/business/BImportDataPanel/index.vue';

function deleteOrFindArr(arrData, obj, children, _all, find, replaceArr) {
  //删除或查找数组中有某个对象的元素. _all代表是否全部删除
  children = children || 'children'; //obj可以是基本数据类型.replaceArr在删除的位置添加的数据
  if (!Object.prototype.toString.call(find) === '[object Array]') {
    find = find ? [] : find;
  }
  if (Object.prototype.toString.call(arrData) === '[object Array]') {
    for (var i = 0; i < arrData.length; i++) {
      var m = arrData[i],
        flg = 1;
      if (obj && typeof obj == 'object') {
        for (var j in obj) {
          if (
            typeof obj[j] == 'function'
              ? !obj[j](j, m[j], m, arrData, i)
              : m[j] != obj[j]
          ) {
            flg = 0;
            break;
          }
        }
      } else {
        if (m != obj) {
          flg = 0;
        }
      }
      if (flg) {
        if (find) {
          find.push(m);
        } else {
          if (typeof replaceArr == 'function') {
            replaceArr = replaceArr(i, m, arrData);
          }
          replaceArr =
            Object.prototype.toString.call(replaceArr) == '[object Array]'
              ? replaceArr
              : replaceArr || [];
          arrData.splice.apply(arrData, [i, 1].concat(replaceArr));
          i--;
          _all && (i = i + replaceArr.length);
        }
        if (!_all) {
          break;
        }
      }
      obj &&
        typeof obj == 'object' &&
        deleteOrFindArr(m, obj, children, _all, find, replaceArr);
    }
  } else if (arrData && typeof arrData == 'object') {
    Object.prototype.toString.call(arrData[children]) === '[object Array]' &&
      deleteOrFindArr(arrData[children], obj, children, _all, find, replaceArr);
  }
  return find;
}
/**
 * 拷贝
 */
function clone(obj, deep) {
  if (!obj) {
    return obj;
  }
  if (obj.tagName && obj.nodeType == 1 && typeof obj.cloneNode == 'function') {
    return obj.cloneNode(deep);
  }
  var res;
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    res = [];
    for (var i = 0; i < obj.length; i++) {
      res.push(this.clone(obj[i], deep));
    }
  } else {
    if (obj && typeof obj == 'object') {
      res = {};
      for (let i in obj) {
        if (!deep) {
          res[i] = obj[i];
        } else {
          res[i] = this.clone(obj[i], deep);
        }
      }
    } else {
      res = obj;
    }
  }
  return res;
}
export default {
  name: 'BMenuManage',
  components: {
    CIconPicker,
    CSvgIcon,
    [Row.name]: Row,
    [Col.name]: Col,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [Popover.name]: Popover,
    [Card.name]: Card,
    [Select.name]: Select,
    [Option.name]: Option,
    [Scrollbar.name]: Scrollbar,
    [Tree.name]: Tree,
    BImportDataPanel
  },
  props: {
    /**
     * 服务器类型
     */
    serverType: {
      type: String,
      default: ''
    },
    /**
     * 标题
     */
    rootTitle: {
      type: String,
      default: '菜单'
    }
  },
  data() {
    var self = this;
    this.$fn = function(ev) {
      self.hideContext.call(self, ev);
    };
    return {
      editStatus: '',
      authList: [],
      btnData: {},
      btnDialog: false,
      btnLoading: false,
      deletePng,
      btnRules: {
        // 表单验证
        itfName: [
          {
            required: true,
            trigger: 'click',
            message: '按钮名称未填写'
          }
        ],
        itfCode: [
          { required: true, trigger: 'click', message: '接口code未填写' }
        ]
      },
      menuQuery: {},
      listLoading: false,
      propsOptions: {
        // 树默认选项
        label: 'menuName',
        children: 'nodes',
        isLeaf: 'leaf'
      },
      treeData: [],
      nowNode: {}, //被选中节点数据
      nowStatus: 0, // 当前状态
      superMenu: [], //上级菜单列表
      menuContextShow: false, //鼠标反键显示菜单
      menuContextList: [], //鼠标反键要显示的列表
      title: '新增',
      addDialog: false, //新增弹窗
      addData: {},
      addRules: {
        url: [
          {
            required: true,
            trigger: 'blur',
            max: 64,
            message: '菜单地址不能为空'
          },
          { max: 64, message: '最大长度64个字符' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              // var res = deleteOrFindArr(
              //   self.treeData,
              //   { url: value },
              //   self.propsOptions.children,
              //   0,
              //   1
              // ); //查找
              if (!value || !value.toString().replace(/^\s+|\s+$/g, '')) {
                callback(new Error('菜单地址不能为空'));
              } else {
                //this.$router.options&&this.$router.options.routes&&(res=tools.deleteOrFindArr(this.$router.options.routes,{url:value},"",0,1));//查找
                //res.length>0?callback():callback(new Error("无效的菜单地址"));
                callback();
              }
            }
          }
        ],
        menuName: [
          { trigger: 'blur', max: 64, message: '最大长度64个字符' },
          { required: true, trigger: 'blur', message: '菜单名称不能为空' }
        ],
        roleType: [
          { required: true, trigger: 'change', message: '菜单类型未填写' }
        ]
        //icon:{required: false, trigger: 'blur',message: '图标不能为空'}
      },
      roleList: [],
      nodeData: {
        roleType: 0
      },
      confirmLoading: false
    };
  },
  watch: {
    nowNode() {}
  },
  computed: {
    /**
     * 是否进入在某个菜单
     */
    isNowNode() {
      if (this.nowNode && this.nowNode.url) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 模态框标题
     */
    btntitle() {
      return (
        {
          new: '新增',
          editor: '编辑'
        }[this.editStatus] || ''
      );
    },
    /**
     * 菜单类型编辑是否禁用
     * 新建一级菜单可以编辑
     */
    roleTypeDisabled() {
      return !(this.nowStatus === 0 && +this.nodeData.id === -1);
    }
  },
  created() {
    this.getList();
    axios(
      {
        method: 'GET',
        url: '/usergw/admin/auth/lastOrder'
      },
      this.serverType
    ).then(data => {
      if (data.status == 200) {
        this.superMenu = data.data;
        // console.log(this.superMenu, 'this.superMenu');
      }
    });
  },
  methods: {
    /**
     * 导出
     */
    exportExcel() {
      utils.download(
        '/model/modelDownload',
        { type: 'itf' },
        {
          method: 'GET'
        }
      );
    },
    /**
     * 初始化显示模态框
     */
    initShowDialog(type) {
      this.btnDialog = true;
      this.editStatus = type;
      this.$nextTick(() => {
        this.$refs['btnForm'].clearValidate();
      });
    },
    btnSure() {
      this.$refs['btnForm'] &&
        this.$refs['btnForm'].validate(valid => {
          if (valid) {
            if (this.editStatus == 'new') {
              axios(
                {
                  method: 'POST',
                  url: `/usergw/admin/auth/insertItf/${this.btnData.menuId}`,
                  data: this.btnData
                },
                this.serverType
              )
                .then(data => {
                  if (data.status == 200) {
                    this.getNodeList();
                    this.$message({
                      type: 'success',
                      message: '添加成功!'
                    });
                  }
                })
                .catch(error => {
                  this.$message({
                    message: error.message
                  });
                });
            } else {
              axios(
                {
                  method: 'POST',
                  url: '/usergw/admin/auth/updateItfById/0',
                  data: this.btnData
                },
                this.serverType
              )
                .then(data => {
                  if (data.status == 200) {
                    this.getNodeList();
                    this.$message({
                      type: 'success',
                      message: '修改成功!'
                    });
                  }
                })
                .catch(error => {
                  this.$message({
                    message: error
                  });
                });
            }
            this.btnDialog = false;
          }
        });
    },
    btnCancel() {
      this.btnDialog = false;
    },
    changeBtn(item, type) {
      let btnItem = Object.assign({}, item);
      this.btnData = btnItem;
      this.initShowDialog(type);
    },
    deleteBtn(item) {
      this.$confirm('是否确定删除该按钮?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            id: item.id,
            type: 1
          };
          axios(
            {
              method: 'POST',
              url: '/usergw/admin/auth/updateItfById/1',
              data: params
            },
            this.serverType
          )
            .then(data => {
              if (data.status == 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getNodeList();
              }
            })
            .catch(error => {
              this.$message({
                message: error.message
              });
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 导入execl
    onSuccess() {
      this.$message.success('导入成功');
      this.getNodeList();
    },
    getList() {
      this.listLoading = true;
      axios(
        {
          method: 'GET',
          url: '/usergw/admin/auth/listInit'
        },
        this.serverType
      )
        .then(data => {
          if (data.status == 200) {
            this.treeData = [
              {
                id: -1,
                menuName: this.rootTitle,
                parentMenuId: '-2',
                nodes: data.data,
                menuId: -1
              }
            ];
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    getDragType(dropType) {
      let res = {
        before: 0,
        after: 1,
        inner: 2
      }[dropType];
      return typeof res === 'number' ? res : 3;
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      if (draggingNode.data.menuId == dropNode.data.menuId) {
        return;
      }
      var type = this.getDragType(dropType);
      if (type == 3) {
        this.getList();
        return this.$message({
          type: 'warning',
          message: '拖拽失败'
        });
      }
      let data = {
        menuId: draggingNode.data.menuId,
        relativeId: dropNode.data.menuId,
        type: type
      };
      if (data.menuId == data.relativeId) return;
      axios(
        {
          method: 'POST',
          url: `/usergw/admin/auth/changeOrder/${data.menuId}/${data.relativeId}/${data.type}`
        },
        this.serverType
      )
        .then(() => {
          this.$message({
            type: 'success',
            message: '拖拽保存成功'
          });
        })
        .catch(() => {
          this.getList(); //刷新
        });
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {},
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.id == -1) {
        return type == 'inner';
      } else {
        return true;
      }
    },
    /**
     * 点击节点显示信息
     * @param {*} node 节点数据
     */
    handleNodeClick(node) {
      this.menuContextShow = false;
      this.nowNode = node;
      !node.menuId && (this.roleList = []);
      this.getNodeList();
    },
    getNodeList() {
      this.nowNode.menuId &&
        axios(
          {
            method: 'GET',
            url: `/usergw/admin/auth/getAuthByMenu/${this.nowNode.menuId}`
          },
          this.serverType
        ).then(data => {
          if (data.status == 200) {
            this.roleList = data.data.role;
            this.authList = data.data.auth;
          }
        });
    },
    hideContext(ev) {
      //关闭反键菜单
      this.menuContextShow = false;
    },
    getContextList(level) {
      //获取右键要展示的菜单
      var root = 1;
      if (root) {
        switch (level) {
          case 1:
            return [1];
          case 2:
            return [1, 1, 1];
          case 3:
            return [1, 1, 1];
          default:
            return [0, 1, 1];
        }
      }
      return level == 1 ? [1, 1, 1] : [0, 1, 1];
    },
    showContext(ev, data, node, ref) {
      //打开反键菜单
      if (ev.which == 3) {
        ev.returnValue = false;
        ev.preventDefault();
        var level = node.level; //层级
        this.menuContextShow = true;
        this.menuContextList = this.getContextList(level);
        this.nodeData = data;

        this.$nextTick(() => {
          // 判断位置
          var $menuContext = this.$refs['menu-context'];
          var left = ev.pageX || ev.x; // 鼠标x轴位置
          var top = ev.pageY || ev.y; // 鼠标y轴位置
          var clientHeight = document.body.clientHeight; // 窗口高度
          var width = $menuContext.scrollWidth; // 邮件菜单宽度
          var height = $menuContext.scrollHeight; // 右键菜单高度
          // 如果菜单位置底部位置超出窗口高度，菜单显示在鼠标上面
          if (top + height > clientHeight) {
            top = top - height;
          }
          // 设置位置
          $menuContext.style.left = left + 'px';
          $menuContext.style.top = top + 'px';
          // this.$refs["menu-context"].style.left=(ev.pageX||ev.x)+"px"
          // this.$refs["menu-context"].style.top=(ev.pageY||ev.y)+"px"

          document.removeEventListener('click', this.$fn, false);
          document.addEventListener('click', this.$fn, false);
        });
      }
    },
    handleTree(type) {
      //鼠标反键点击新增编辑删除
      if (type == 2) {
        //删除
        this.$confirm('是否确定删除该菜单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
          closeOnPressEscape: false
        })
          .then(() => {
            return axios(
              {
                method: 'GET',
                url: `/usergw/admin/auth/deletedMenu/${this.nodeData.menuId}`
              },
              this.serverType
            );
          })
          .then(() => {
            // tools.deleteOrFindArr(this.treeData,{menuId:this.nodeData.menuId},this.propsOptions.children,0)//删除
            return this.$nextTick();
          })
          .then(() => {
            this.$refs['treeMenu'].remove(
              this.nodeData.menuId,
              this.nowNode.parent
            );
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
          .catch(() => {
            //取消
          });
      } else {
        // 重置表单验证
        this.$nextTick(() => {
          this.$refs.addForm && this.$refs.addForm.clearValidate();
        });
        if (type == 1) {
          // 编辑
          const cloneData = clone(this.nodeData);
          // 判断是否有roleType字段，如果没有默认设置为'0'
          if (!cloneData.roleType) {
            cloneData.roleType = '0';
          }
          this.addData = cloneData;
        } else {
          // 新建
          if (this.nodeData.id === -1) {
            // 判断是否是根节点
            // 创建一级菜单
            this.addData = {
              parentMenuId: this.nodeData.menuId,
              icon: '',
              roleType: '0'
            };
          } else {
            // 创建二级菜单
            this.addData = {
              parentMenuId: this.nodeData.menuId,
              icon: '',
              roleType: this.nodeData.roleType || '0'
            };
          }
        }
        this.title = type == 1 ? '编辑' : '新增';
        this._type = type;
        this.addDialog = true;
        this.nowStatus = type; // 保存编辑状态
      }
    },
    addSure() {
      //确认新增编辑
      this.$refs.addForm &&
        this.$refs.addForm.validate(valid => {
          if (valid) {
            var orderNo = 1;
            if (!this._type) {
              //新增获取最大的orderNo
              var nodes = this.nodeData[this.propsOptions.children];
              orderNo =
                (nodes &&
                  nodes[nodes.length - 1] &&
                  (nodes[nodes.length - 1].orderNo || 0) + 1) ||
                1;
            }
            this.confirmLoading = true;
            this.editMenu(this.addData, this._type, orderNo)
              .then(data => {
                var message = ''; // 提示信息
                if (this._type == 1) {
                  //编辑
                  for (var i in this.addData) {
                    // this.nodeData[i]=this.addData[i];
                    this.$set(this.nodeData, i, this.addData[i]);
                  }
                  message = '菜单修改成功';
                } else {
                  //新增
                  this.nodeData[this.propsOptions.children] ||
                    this.$set(this.nodeData, this.propsOptions.children, []);
                  this.nodeData[this.propsOptions.children].push({
                    orderNo: orderNo,
                    menuId: data.data,
                    ...this.addData
                  });
                  message = '菜单添加成功';
                }
                this.$message.success(message);
                this.addDialog = false;
                this.confirmLoading = false;
              })
              .catch(() => {
                this.confirmLoading = false;
              });
          }
        });
    },
    editMenu(
      { menuId, menuName, url, icon, parentMenuId, roleType },
      type,
      orderNo
    ) {
      // 新增编辑菜单//type=0为新增
      var data = {
        menuId,
        menuName,
        url,
        icon,
        parentMenuId,
        roleType
      };
      if (!type) {
        // 0根节点创建
        (data.menuType = parentMenuId ? 0 : 1), (data.orderNo = orderNo);
      }
      return axios(
        {
          method: 'POST',
          url: `/usergw/admin/common/save/302/${type ? '02' : '01'}`,
          data
        },
        this.serverType
      ); // 01新增
    },
    handleQuery() {},
    handleReset() {
      for (var i in this.menuQuery) {
        this.menuQuery[i] = '';
      }
    },
    /**
     * 是否允许拖拽回调
     * @param {*} draggingNode 拖拽的节点
     * @param {*} dropNode 放下的关联节点
     * @param {*} type 放下类型
     */
    allowDrap(draggingNode, dropNode, type) {
      if (draggingNode.level === 1) return false;
      return true;
    }
  }
};
</script>
<style lang="less" scoped>
// .btn-el-dialog {
//   width: 50%;
//   margin: 0 auto;
// }
.menu-top {
  background: #fff;
  padding: 0 16px 20px 16px;
}
.menu-box {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .he-item {
    position: absolute;
    top: 58px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .el-card-box {
    padding: 15px;
  }
  &::after {
    display: block;
    content: '';
    clear: both;
  }
  .card-box {
    position: relative;
    height: 100%;
    .card-label {
      height: 58px;
      background: rgba(64, 114, 238, 1);
      box-shadow: 0px 5px 15px 0px rgba(172, 178, 193, 0.36);
      border-radius: 6px 6px 0px 0px;
      color: #fff;
      z-index: 2;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .btn-list {
      .btn-item-b {
        border: 1px solid rgba(131, 165, 247, 1);
      }
      .btn-item {
        padding: 7px 20px;
        box-sizing: border-box;
        border-radius: 8px;
        display: inline-block;
        position: relative;
        margin-right: 10px;
        margin-bottom: 10px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(64, 114, 238, 1);
        line-height: 17px;
        cursor: pointer;
        .delete-img {
          width: 14px;
          height: 14px;
          position: absolute;
          right: 2px;
          top: 2px;
        }
      }
    }
    .card-list {
      > .card-item {
        padding: 6px 10px;
        cursor: pointer;
        font-size: 14px;
        &:hover {
          background: #e6e6e6;
        }
      }
    }
  }
  .card-box-col {
    padding: 15px;
    height: 100%;
  }
  .export {
    margin-bottom: 15px;
  }
}
.menu-context {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 10;
  border: 1px solid #dcdfe6;
  box-shadow: 2px 2px 2px #999, 0 0 1px #999;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  width: 90px;
  padding: 6px 0;
  .menu-context-item {
    margin-top: -1px;
    width: 100%;
    text-align: center;
    padding: 6px 8px;
    cursor: pointer;
    color: #333;
    & + .menu-context-item {
      border-top: 1px solid #dcdfe6;
    }
    &:hover {
      color: #409eff;
    }
  }
}
// 快捷菜单
.shortcut-menu {
  position: fixed;
  z-index: 2000;
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
.icon-box {
  cursor: pointer;
  -webkit-appearance: none;
  background: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 38px;
  outline: none;
  text-align: center;
  font-size: 0;
  .icon {
    vertical-align: middle;
    width: 70%;
    height: 70%;
  }
}
.deep-card {
  background: rgba(14, 94, 187, 1) !important;
}
/deep/ .el-card__body {
  padding: 0 !important;
}
.el-scrollbar_x /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
