<template>
  <!-- 数据字典 -->
  <div class="app-container" @click="closeMenu">
    <div class="header">
      <el-form
        inline
        class="search-form"
        size="small"
        @keyup.enter.native="query"
      >
        <el-form-item label="业务ID：">
          <el-input
            v-model.trim="queryParams.dictionaryKey"
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="业务名称：">
          <el-input
            v-model.trim="queryParams.dictionaryValueZh"
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="状态：">
          <el-select
            v-model="queryParams.status"
            clearable
            style="width: 160px"
          >
            <el-option :value="0" label="启用" />
            <el-option :value="1" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" @click="query">
            查询
          </el-button>
          <el-button :loading="loading" type="primary" @click="resetForm">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="plate-group">
      <el-col :md="12">
        <div class="plate plate-tree shortcut-menu-box">
          <el-tree
            ref="treeDict"
            :data="treeData"
            :props="propsOptions"
            :lazy="true"
            :load="loadNode"
            :default-expanded-keys="defaultExpandedKeys"
            :expand-on-click-node="false"
            node-key="id"
            highlight-current
            class="tree-dict"
            @node-contextmenu="onContextMenu"
            @node-click="onNodeClick"
          />
          <c-shortcut-menu
            v-show="showMenu"
            ref="shortcutMenu"
            :style="menuStyle"
            :menu-items="menuItems"
            class="shortcut-menu"
            @command="command"
          />
        </div>
      </el-col>
      <el-col :md="12">
        <div class="plate plate-info">
          <el-form>
            <el-form-item label="父业务ID：">
              {{ nowDictData.parentKey }}
            </el-form-item>
            <el-form-item label="父业务名称：">
              {{ nowDictData.parentText }}
            </el-form-item>
            <el-form-item label="业务ID：">
              {{ nowDictData.dictionaryKey }}
            </el-form-item>
            <el-form-item label="业务名称：">
              {{ nowDictData.dictionaryValueZh }}
            </el-form-item>
            <el-form-item label="状态：">
              {{ nowDictData.status | filtersStatus }}
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <!-- 字典编辑模态框 start -->
    <el-dialog
      center
      :visible.sync="showDialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="formRules"
        size="1"
        label-position="left"
        label-width="105px"
        class="edit-form"
      >
        <el-form-item label="父业务ID">
          {{ editForm.parentKey }}
        </el-form-item>
        <el-form-item label="父业务名称">
          {{ editForm.parentText }}
        </el-form-item>
        <el-form-item label="业务ID" prop="dictionaryKey">
          <el-input
            v-model.trim="editForm.dictionaryKey"
            :disabled="editStatus === 'editor'"
          />
        </el-form-item>
        <el-form-item label="业务名称" prop="dictionaryValueZh">
          <el-input v-model.trim="editForm.dictionaryValueZh" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :loading="confirmLoading"
          size="small"
          type="primary"
          @click="confirm"
          >确定</el-button
        >
        <el-button
          :loading="confirmLoading"
          size="small"
          @click="showDialog = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
    <!-- 字典编辑模态框 end -->
  </div>
</template>

<script>
import {
  Row,
  Col,
  Form,
  FormItem,
  Dialog,
  Input,
  Tree,
  Select,
  Option,
  Radio,
  RadioGroup
} from 'element-ui';
import CShortcutMenu from '../../common/CShortcutMenu';
import utils from '@/plugins/common/utils';
import axios from '@/plugins/axios';

const commands = {
  NEW: 'new',
  EDITOR: 'editor',
  DELETE: 'delete'
};
function getObjXy(obj) {
  var xy = obj.getBoundingClientRect();
  var top =
      xy.top -
      document.documentElement.clientTop +
      document.documentElement.scrollTop, //document.documentElement.clientTop 在IE67中始终为2，其他高级点的浏览器为0
    bottom = xy.bottom,
    left =
      xy.left -
      document.documentElement.clientLeft +
      document.documentElement.scrollLeft, //document.documentElement.clientLeft 在IE67中始终为2，其他高级点的浏览器为0
    right = xy.right,
    width = xy.width || right - left, //IE67不存在width 使用right - left获得
    height = xy.height || bottom - top;

  return {
    top: top,
    right: right,
    bottom: bottom,
    left: left,
    width: width,
    height: height
  };
}

export default {
  name: 'BDataDict',
  // 注册组件
  components: {
    [CShortcutMenu.name]: CShortcutMenu, // 快捷菜单
    [Row.name]: Row,
    [Col.name]: Col,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Dialog.name]: Dialog,
    [Input.name]: Input,
    [Tree.name]: Tree,
    [Select.name]: Select,
    [Option.name]: Option,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio
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
      loading: false, // 数据加载中
      queryParams: {
        // 查询参数
        dictionaryKey: '', // 字典键
        dictionaryValueZh: '', // 字典值
        status: '' // 状态
      },
      treeData: [
        // 树数据
      ],
      nowDictData: {}, // 当前字典数据
      nowDictNode: {}, // 当前字典节点
      propsOptions: {
        // 树组件配置
        label: 'dictionaryValueZh'
        // isLeaf: function (data, node) {
        //   return data.isLeaf === '1'
        // }
      },
      showMenu: false, // 是否显示菜单
      menuTop: 0, // 菜单距离顶部距离
      menuLeft: 0, // 菜单距离右侧距离
      menuLocation: {
        // 菜单位置
        pageX: 0,
        pageY: 0,
        relativeX: 0,
        relativeY: 0
      },
      // offsetY: 0,             // 保存上次右键位置
      // offsetX: 0,             // 保存上次右键位置
      screenWidth: document.body.clientWidth, // 页面宽度监听
      showDialog: false, // 是否显示模态框
      editForm: {
        // 菜单编辑表单
        parentKey: '', // 父业务Id
        parentText: '', // 父业务名称
        parentId: '', // 父节点id
        dictionaryKey: '', // 字典键
        dictionaryValueZh: '', // 字典值
        status: 0 // 状态
      },
      formRules: {
        // 表单验证
        dictionaryKey: [
          { required: true, trigger: 'blur', message: '业务ID未填写' },
          {
            validator: function(rule, value, callback) {
              if (/,/.test(value))
                callback(new Error('非法字符，不允许存在“ , ”。'));
              else callback();
            }
          },
          { max: 64, trigger: '', message: '最大长度64个字符' }
        ],
        dictionaryValueZh: [
          { required: true, trigger: 'blur', message: '业务名称未填写' },
          { max: 128, trigger: '', message: '最大长度128个字符' }
        ],
        status: [
          { required: true, trigger: 'click', message: '业务名称未填写' }
        ]
      },
      editStatus: '', // 编辑状态
      confirmLoading: false, // 提交中
      defaultExpandedKeys: ['-1']
    };
  },
  // 计算属性
  computed: {
    /**
     * 快捷菜单项
     */
    menuItems() {
      console.log('this.nowDictNode', this.nowDictNode);
      if (this.nowDictNode.level === 1) {
        // 根节点只能新增
        return [
          { label: '新增', command: commands.NEW, auth: ['datadict-add'] }
        ];
      } else if (!this.nowDictNode.isLeaf) {
        // 有子节点不允许删除
        return [
          { label: '新增', command: commands.NEW, auth: ['datadict-add'] },
          { label: '编辑', command: commands.EDITOR, auth: ['datadict-edit'] }
        ];
      } else {
        // 叶子节点
        return [
          { label: '新增', command: commands.NEW, auth: ['datadict-add'] },
          { label: '编辑', command: commands.EDITOR, auth: ['datadict-edit'] },
          { label: '删除', command: commands.DELETE, auth: ['datadict-delete'] }
        ];
      }
    },
    /**
     * 快捷菜单样式
     */
    menuStyle() {
      return {
        top: this.menuTop + 'px',
        left: this.menuLeft + 'px'
      };
    },
    /**
     * 模态框标题
     */
    dialogTitle() {
      return (
        {
          new: '新增',
          editor: '编辑'
        }[this.editStatus] || ''
      );
    }
  },
  // 侦听器
  watch: {
    screenWidth(newVal, oldVal) {
      this.calcMenuPosition();
    }
  },
  // 创建完成钩子
  created() {},
  // 挂在完成钩子
  mounted() {
    /**
     * 监听页面变化事件
     */
    window.addEventListener('resize', this.onResize);
  },
  destroyed() {
    /**
     * 移除监听页面变化事件
     */
    window.removeEventListener('resize', this.onResize);
  },
  // 方法定义
  methods: {
    /**
     * 表单查询
     */
    query() {
      this.treeData = [
        {
          id: '-1',
          dictionaryKey: '-1',
          dictionaryValueZh: '数据字典',
          status: 0
        }
      ];
    },
    /**
     * 加载节点
     */
    loadNode(node, resolve) {
      if (node.level === 0)
        return resolve([
          {
            id: '-1',
            dictionaryKey: '-1',
            dictionaryValueZh: '数据字典',
            status: 0
          }
        ]);
      if (this.loading) return;
      this.loading = true;
      axios(
        {
          method: 'POST',
          url: '/commonData/dictionaryApi/select/dic/children',
          data: {
            keyList: [node.data.dictionaryKey],
            dictionaryValueZh: this.queryParams.dictionaryValueZh,
            status: this.queryParams.status
          }
        },
        this.serverType
      )
        .then(({ data }) => {
          resolve(data || []);
          this.loading = false;
        })
        .catch(() => {
          resolve([]);
          this.loading = false;
        });
      // var sendData = {};
      // var res = false;
      // var keys = ['dictionaryKey', 'dictionaryValueZh', 'status'];
      // for (let key of keys) {
      //   if (this.queryParams[key] !== '') {
      //     res = true;
      //     break;
      //   }
      // }
      // if (res && node.level === 1) {
      //   sendData = this.queryParams;
      //   axios(
      //     {
      //       method: 'GET',
      //       url: '/dictionary/selectDictionaryWithChildren',
      //       params: sendData
      //     },
      //     this.serverType
      //   )
      //     .then(({ data }) => {
      //       resolve(data || []);
      //       this.loading = false;
      //     })
      //     .catch(() => {
      //       resolve([]);
      //       this.loading = false;
      //     });
      // } else {
      //   axios(
      //     {
      //       url: `/dictionary/selectDictionaryWithChildren/${node.data.dictionaryId}`,
      //       method: 'GET',
      //       params: sendData
      //     },
      //     this.serverType
      //   )
      //     .then(({ data }) => {
      //       resolve(data || []);
      //       this.loading = false;
      //     })
      //     .catch(() => {
      //       resolve([]);
      //       this.loading = false;
      //     });
      // }
    },
    /**
     * 重置表单
     * @param {String} form 表单的ref
     */
    resetForm(form) {
      this.queryParams = {
        // 查询参数
        dictionaryKey: '', // 字典键
        dictionaryValueZh: '', // 字典值
        status: '' // 状态
      };
    },
    /**
     * 右键快捷菜单
     * @param {Event} event 事件对象
     * @param {*} data 节点数据
     * @param {*} node 节点
     * @param {*} ref 节点组件本身
     */
    onContextMenu(event, data, node, ref) {
      // 保存
      this.nowDictData = data;
      this.nowDictNode = node;
      // 显示菜单
      this.showMenu = true;
      Object.keys(this.menuLocation).forEach(key => {
        this.menuLocation[key] = event[key];
      });
      this.$nextTick(() => {
        var xy = getObjXy(this.$refs['treeDict'].$el);
        this.menuLocation.relativeX = this.menuLocation.pageX - xy.left;
        this.menuLocation.relativeY = this.menuLocation.pageY - xy.top;
        this.calcMenuPosition();
      });
    },
    /**
     * 关闭菜单显示
     */
    closeMenu() {
      this.showMenu = false;
    },
    /**
     * 计算设置菜单位置
     */
    calcMenuPosition() {
      if (!this.showMenu) return;
      this.$nextTick(() => {
        // 快捷菜单宽度
        var shortcutMenu = this.$refs['shortcutMenu'];
        var treeDict = this.$refs['treeDict'];
        var shortcutMenuWidth = shortcutMenu.$el.offsetWidth;
        var treeDictWidth = treeDict.$el.offsetWidth;
        var relativeX = this.menuLocation.relativeX;
        var relativeY = this.menuLocation.relativeY;
        this.menuTop = relativeY;
        // 判断快捷菜单是否超出范围
        if (relativeX + shortcutMenuWidth > treeDictWidth) {
          this.menuLeft = treeDictWidth - shortcutMenuWidth;
        } else {
          this.menuLeft = relativeX;
        }
      });
    },
    /**
     * 更新页面宽度
     */
    onResize: utils.debounce(function() {
      window.screenWidth = document.body.clientWidth;
      this.screenWidth = window.screenWidth;
    }, 200),
    /**
     * 指令执行
     */
    command(event, command, data) {
      switch (command) {
        case commands.NEW:
          this.editStatus = command;
          // 新增
          this.editForm = {
            isLeaf: '1',
            parentId: this.nowDictData.dictionaryId,
            parentText: this.nowDictData.dictionaryValueZh,
            parentKey: this.nowDictData.dictionaryKey,
            dictionaryKey: '', // 字典键
            dictionaryValueZh: '', // 字典值
            status: 0, // 状态
            dicOrder:
              ((this.nowDictNode.childNodes &&
                this.nowDictNode.childNodes.length) ||
                0) + 1
          };
          this.initShowDialog();
          break;
        case commands.EDITOR:
          // 编辑
          this.editStatus = command;
          var editData = new Object();
          [
            'isLeaf',
            'parentKey',
            'parentId',
            'dictionaryId',
            'dictionaryKey',
            'dictionaryValueZh',
            'status',
            'dicOrder'
          ].forEach(key => {
            editData[key] = this.nowDictData[key];
          });
          editData.parentText =
            (this.nowDictNode.parent &&
              this.nowDictNode.parent.data &&
              this.nowDictNode.parent.data.dictionaryValueZh) ||
            '';
          this.editForm = editData;
          this.initShowDialog();
          break;
        case commands.DELETE:
          // 删除
          this.$confirm('是否确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              return axios(
                {
                  method: 'GET',
                  url: '/dictionary/deleteDictionary',
                  params: {
                    ids: this.nowDictData.dictionaryId
                  }
                },
                this.serverType
              );
            })
            .then(() => {
              return this.$nextTick();
            })
            .then(() => {
              this.$refs['treeDict'].remove(this.nowDictNode);
              this.$message.success('删除成功');
            })
            .catch(() => {});
          break;
      }
    },
    /**
     * 提交表单
     */
    confirm() {
      if (this.confirmLoading) return;
      this.$refs['editForm'].validate(valid => {
        var sendData = {};
        if (valid) {
          switch (this.editStatus) {
            case 'new':
              // 新增
              sendData = { ...this.editForm };
              delete sendData['isLeaf'];
              this.confirmLoading = true;
              axios(
                {
                  method: 'POST',
                  url: '/commonData/dictionaryApi/add/dic',
                  data: sendData
                },
                this.serverType
              )
                .then(({ data }) => {
                  this.$nextTick(() => {
                    if (!this.nowDictData.children) {
                      this.$set(this.nowDictData, 'children', []);
                    }
                    this.nowDictData.children.push(data);

                    this.showDialog = false;
                    this.confirmLoading = false;
                    this.$message.success('新增成功');
                  });
                })
                .catch(() => {
                  this.confirmLoading = false;
                });
              break;
            case 'editor':
              // 编辑
              this.confirmLoading = true;
              axios(
                {
                  method: 'POST',
                  url: '/commonData/dictionaryApi/update/dic',
                  data: { ...this.editForm }
                },
                this.serverType
              )
                .then(() => {
                  Object.assign(this.nowDictData, this.editForm);
                  this.showDialog = false;
                  this.confirmLoading = false;
                  this.$message.success('修改成功');
                })
                .catch(() => {
                  this.confirmLoading = false;
                });
              break;
            default:
              this.$message.warning('提交异常，无处理方法');
              break;
          }
        }
      });
    },
    /**
     * 初始化显示模态框
     */
    initShowDialog() {
      this.showDialog = true;
      this.$nextTick(() => {
        this.$refs['editForm'].clearValidate();
      });
    },
    /**
     * 点击节点事件
     * @param {*} data 节点数据
     * @param {*} node 节点对象
     * @param {*} ref 节点组件本身
     */
    onNodeClick(data, node, ref) {
      this.showMenu = false;
      this.nowDictData = data;
      this.nowDictNode = node;
      this.nowDictData.parentText =
        (this.nowDictNode.parent &&
          this.nowDictNode.parent.data &&
          this.nowDictNode.parent.data.dictionaryValueZh) ||
        '';
    }
  },
  // 过滤器
  filters: {
    filtersStatus(value) {
      return (
        {
          0: '启用',
          1: '禁用'
        }[value] || ''
      );
    }
  }
};
</script>

<style lang="less" scoped>
.app-container {
  padding: 15px 20px;
}
.plate {
  min-height: 300px;
  background: rgba(254, 255, 255, 1);
  box-shadow: 0px 3px 6px 0px rgba(219, 219, 219, 0.5);
  border-radius: 6px;
  border: 1px solid rgba(235, 235, 235, 1);
  box-sizing: border-box;
  &-info {
    padding: 15px 28px;
    margin: 15px;
    .el-form-item--small.el-form-item {
      margin-bottom: 23px;
    }
    /deep/ .el-form-item__label {
      font-weight: 400;
    }
  }
  &-tree {
    padding: 15px 10px;
    margin: 15px;
    .el-tree {
      background: transparent;
    }
  }
}

// 快捷菜单
.shortcut-menu-box {
  position: relative;
  min-height: 300px;
  overflow-y: auto;
}
.shortcut-menu {
  position: absolute;
  z-index: 2000;
}
// .edit-form {
//   /deep/ .el-form-item__label {
//     font-size: 16px;
//   }
//   /deep/ .el-input__inner {
//     width: 400px;
//   }
//   /deep/ .el-form-item {
//     margin-bottom: 20px;
//   }
// }
</style>
