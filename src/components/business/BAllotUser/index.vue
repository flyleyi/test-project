<template>
  <div class="app-container">
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
      </div>
    </div>
    <div v-loading="loading" class="menu-box">
      <el-col :sm="10" class="card-box-col">
        <el-card class="card-box">
          <div class="card-label tc">
            未分配用户
          </div>
          <div>
            <el-input
              size="small"
              v-model.trim="undist.staffName"
              placeholder="输入账号或姓名搜索"
              @keyup.native="search($event, 0)"
            />
          </div>

          <div
            class="user-list"
            @scroll="scroll($event, 0)"
            style="overflow-y: auto; height: calc(100vh - 84px - 94px - 126px - 40px); "
          >
            <!-- <el-scrollbar
              ref="scrollbar"
              class="el-scrollbar_x"
              style="overflow-y: auto; height: calc(100vh - 84px - 94px - 126px - 40px); "
            > -->
            <el-table
              size="small"
              :data="undist.list"
              border
              @selection-change="
                res => {
                  undist.checked = res;
                }
              "
            >
              <el-table-column type="selection" align="center" />
              <el-table-column label="账号" prop="staffCode" />
              <el-table-column label="姓名" prop="staffName" />
            </el-table>
            <!-- </el-scrollbar> -->
          </div>
        </el-card>
      </el-col>
      <el-col :sm="4" class="card-box-col">
        <div class="card-box tb" style="display: table; width: 100%;">
          <div
            class="td"
            style="vertical-align: middle;text-align:center; display: table-cell;"
          >
            <div class="item-btn">
              <el-button
                size="small"
                :loading="distLoading"
                type="primary"
                @click="add"
              >
                添加分配
                <i class="el-icon-arrow-right" />
              </el-button>
            </div>
            <div class="item-btn cancelbtn">
              <el-button size="small" :loading="undistLoading" @click="remove">
                <i class="el-icon-arrow-left" />
                取消分配
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :sm="10" class="card-box-col">
        <el-card class="card-box">
          <div class="card-label card-label2 tc">
            已分配用户
          </div>
          <div>
            <el-input
              size="small"
              v-model.trim="dist.staffName"
              placeholder="输入账号或姓名搜索"
              @keyup.native="search($event, 1)"
            />
          </div>

          <div
            class="user-list"
            style="height:calc(100vh - 84px - 94px - 126px - 40px);overflow-y: auto; overflow-x: hidden;"
            @scroll="scroll($event, 1)"
          >
            <!-- <el-scrollbar
              class="el-scrollbar_x"
              style="height:calc(100vh - 84px - 94px - 126px - 40px);overflow-y: auto; overflow-x: hidden;"
            > -->
            <el-table
              size="small"
              :data="dist.list"
              border
              @selection-change="
                res => {
                  dist.checked = res;
                }
              "
            >
              <el-table-column type="selection" align="center" />
              <el-table-column label="账号" prop="staffCode" />
              <el-table-column label="姓名" prop="staffName" />
            </el-table>
            <!-- </el-scrollbar> -->
          </div>
        </el-card>
      </el-col>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import axios from '@/plugins/axios';
import {
  Card,
  Tree,
  Row,
  Input,
  Select,
  Form,
  FormItem,
  Col,
  Table,
  TableColumn,
  Scrollbar,
  Tag,
  Loading
} from 'element-ui';
import CSvgIcon from '../../common/CSvgIcon';

let count = 0;

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

Vue.use(Loading);
export default {
  name: 'BAllotUser',
  components: {
    [Card.name]: Card,
    [Tree.name]: Tree,
    [Row.name]: Row,
    [Col.name]: Col,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [CSvgIcon.name]: CSvgIcon,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Scrollbar.name]: Scrollbar,
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
  data() {
    return {
      roleName: '',
      listLoading: false,
      dist: {
        //已分配用户
        pagin: {
          roleId: this.$route.query.roleId,
          limit: 50,
          page: 1,
          offset: 0
        },
        staffName: '', //搜索字段
        checked: [],
        list: []
      },
      undist: {
        //未分配用户
        pagin: {
          roleId: this.$route.query.roleId,
          limit: 50,
          page: 1,
          offset: 0
        },
        staffName: '',
        checked: [],
        list: [
          // { id: 1, name: "张三", number: "100011" }
        ]
      },
      saveData: {
        //已分配用户
        add: [], //添加了
        remove: [] //移除了
      },
      distLoading: false, // 分配中
      undistLoading: false, // 取消分配中
      loading: false, // 加载中
      lastRequest1: null,
      lastRequest2: null
    };
  },
  created() {
    var roleId = this.$route.query.roleId;
    if (!roleId) {
      return this.$router.go(-1);
    }
    this.loading = true;
    Promise.all([this.getUndist(), this.getDist()])
      .then(() => {
        return axios(
          {
            method: 'GET',
            url: `/usergw/admin/roleAuth/getRoleName/${roleId}`
          },
          this.serverType
        );
      })
      .then(res => {
        this.roleName = res.data;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
  },
  methods: {
    lock(type) {
      setTimeout(() => {
        this['_lock' + type] = false;
      }, 50);
    },
    /**
     * 查询用户列表
     */
    queryUser(type, pagin, key) {
      // type=0分配  1未分配,key:搜索字段
      return axios(
        {
          method: 'GET',
          url: '/usergw/admin/edusysStaff/selectUserByRoleId',
          params: {
            type: type,
            ...pagin,
            staffName: key
          }
        },
        this.serverType
      );
    },
    getUndist(key) {
      //未分配
      // console.log(this.undist.pagin.offset);
      let lastRequeset = (this.lastRequest1 = ++count);
      return this.queryUser(1, this.undist.pagin, this.undist.staffName)
        .then(res => {
          // 是否是最后一次请求
          if (lastRequeset !== this.lastRequest1) return;
          var data = res.data.records || [];
          this.undist.list = this.undist.list.concat(data);
          // this._el && (this._el.scrollTop = this._scrollTop);
          // if (data.length == this.undist.pagin.limit) {
          this.$nextTick(() => {
            this._el && (this._el.scrollTop = this._scrollTop);
            this.lock(0);
          });
          // }
        })
        .catch(() => {
          //this.lock(0)
        });
    },
    getDist(key) {
      let lastRequeset = (this.lastRequest2 = ++count);
      return this.queryUser(0, this.dist.pagin, this.dist.staffName)
        .then(res => {
          // 是否是最后一次请求
          if (lastRequeset !== this.lastRequest2) return;
          var data = res.data.records || [];
          this.dist.list = this.dist.list.concat(data);
          // this._el && (this._el.scrollTop = this._scrollTop);
          // if (data.length == this.dist.pagin.limit) {
          this.$nextTick(() => {
            this._el && (this._el.scrollTop = this._scrollTop);
            this.lock(1);
          });
          // }
        })
        .catch(() => {
          //this.lock(1)
        });
    },
    search(ev, type) {
      if (ev.which == 13) {
        if (type) {
          this.dist.pagin.page = 1;
          this.dist.pagin.offset = 0;
          this.dist.list = [];
          this.getDist();
        } else {
          this.undist.pagin.page = 1;
          this.undist.pagin.offset = 0;
          this.undist.list = [];
          this.getUndist();
        }
      }
    },
    scroll(ev, type) {
      //type:0未分配
      var el = ev.target || ev.srcElement;
      var max = el.scrollHeight - Math.max(el.clientHeight, el.offsetHeight);
      // console.log(max,el.scrollTop);
      if (max - el.scrollTop <= 10) {
        if (this['_lock' + type]) {
          return;
        }
        this['_lock' + type] = true;
        this.$nextTick(() => {
          this._el = el;
          this._scrollTop = el.scrollTop;
          type ? this.dist.pagin.page++ : this.undist.pagin.page++;
          type
            ? (this.dist.pagin.offset =
                (this.dist.pagin.page - 1) * this.dist.pagin.limit)
            : (this.undist.pagin.offset =
                (this.undist.pagin.page - 1) * this.undist.pagin.limit);
          type ? this.getDist() : this.getUndist();
        });
      }
      // console.log(Math.random());
    },
    add() {
      //console.log(this.undist.checked);
      if (!(this.undist.checked && this.undist.checked.length > 0)) {
        return this.$message.warning('请至少选择一个未分配用户');
      }
      this.distLoading = true;
      this.updateDistData(
        this.undist.checked.map(item => item.staffId),
        []
      )
        .then(() => {
          this.distLoading = false;
          for (var i in this.undist.checked) {
            var m = this.undist.checked[i];
            this.dist.list.unshift(m);
            deleteOrFindArr(this.undist.list, m, '', 0);

            deleteOrFindArr(this.saveData.remove, m.staffId, '', 0);
            var res = deleteOrFindArr(this.saveData.add, m.staffId, '', 0, 1);
            if (res.length < 1) {
              this.saveData.add.push(m.staffId);
            }
          }
          this.refresh(0);
          this.refresh(1);
        })
        .catch(() => {
          this.distLoading = false;
        });
      //console.log(this.saveData)
    },
    remove() {
      //console.log(this.dist.checked);
      if (!(this.dist.checked && this.dist.checked.length > 0)) {
        return this.$message.warning('请至少选择一个已分配用户');
      }
      this.undistLoading = true;
      this.updateDistData(
        [],
        this.dist.checked.map(item => item.staffId)
      )
        .then(() => {
          this.undistLoading = false;
          for (var i in this.dist.checked) {
            var m = this.dist.checked[i];
            this.undist.list.unshift(m);
            deleteOrFindArr(this.dist.list, m, '', 0);

            deleteOrFindArr(this.saveData.add, m.staffId, '', 0);
            var res = deleteOrFindArr(
              this.saveData.remove,
              m.staffId,
              '',
              0,
              1
            );
            if (res.length < 1) {
              this.saveData.remove.push(m.staffId);
            }
          }
          this.refresh(0);
          this.refresh(1);
        })
        .catch(() => {
          this.undistLoading = false;
        });
      //console.log(this.saveData)
    },
    /**
     * 保存用户分配数据
     */
    saveAllotData(data) {
      return axios(
        {
          method: 'POST',
          url: '/usergw/admin/roleUser/roleAddUser',
          data
        },
        this.serverType
      );
    },
    handleSave() {
      //保存
      // console.log(this.saveData)
      return this.saveAllotData({
        ...this.saveData,
        roleId: this.$route.query.roleId
      }).then(res => {
        this.saveData.add = [];
        this.saveData.remove = [];
        this.$message.success('保存成功');
      });
    },
    /**
     * 更新分配数据
     * @param {Array} add 添加分配
     * @param {Array} remove 移除分配
     */
    updateDistData(add, remove) {
      return this.saveAllotData({
        add,
        remove,
        roleId: this.$route.query.roleId
      }).then(res => {
        this.saveData.add = [];
        this.saveData.remove = [];
        this.$message.success('保存成功');
      });
    },
    /**
     * 刷新列表
     * - 0 (未分配列表)
     * - 1 (已分配列表)
     * @param {Number} type 刷新什么列表
     */
    refresh(type) {
      var name = type ? 'dist' : 'undist';
      // 刷新列表的方法
      var fn = type ? this.getDist : this.getUndist;
      // 列表的参数
      var param = type ? this.dist : this.undist;
      // 滚动容器
      var el = this.$refs[type ? 'dist' : 'undist'];
      if (param.list.length) {
        var offset = param.pagin.offset;
        var limit = param.pagin.limit;
        param.pagin.offset = 0;
        param.pagin.limit = param.list.length;
        var restore = () => {
          param.pagin.offset = offset;
          param.pagin.limit = limit;
        };
        param.list = [];
        fn()
          .then(() => {
            restore();
          })
          .catch(restore);
      } else {
        param.pagin.offset = 0;
        fn();
      }
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
.menu-box {
  &::after {
    display: block;
    content: '';
    clear: both;
  }
  .card-box {
    height: calc(100vh - 84px - 94px - 60px);
    margin-bottom: 0;
    overflow: hidden;
    position: relative;
    padding-top: 58px;
    &.card-auto {
      height: auto;
    }
    .card-label {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      background: #4072ee;
      padding: 18px 0 20px;
      color: #fff;
      z-index: 2;
      font-size: 14px;
      text-align: center;
      // height: 58px;
    }
    .card-label2 {
      background: #0e5ebb;
    }
    .card-list {
      margin: -20px;
      > .card-item {
        padding: 6px 10px;
        cursor: pointer;
        font-size: 14px;
        &:hover {
          background: #e6e6e6;
        }
      }
    }
    .user-list {
      margin: 20px -20px 0;
      padding: 0 20px;
    }
    .item-btn {
      & + .item-btn {
        margin-top: 15px;
      }
    }
  }
}
.el-scrollbar_x /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
