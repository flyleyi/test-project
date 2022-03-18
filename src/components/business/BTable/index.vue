<template>
  <div class="c-table">
    <c-dynamic-form
      v-if="formItems && formItems.length"
      ref="cDynamicForm"
      :form-data="formData"
      :form-items="computedFormItems"
      :form-attrs="formAttrs"
      @change-model="model => (formData = model)"
      @keyup.enter.native="onQueryForm"
    >
      <el-form-item slot="form-after">
        <el-button @click="onResetForm">重置</el-button>
        <el-button type="primary" @click="onQueryForm">查询</el-button>
        <el-button
          type="primary"
          v-if="showQueryFilter"
          @click="onFilterQueryCondition"
          >设置筛选项</el-button
        >
      </el-form-item>
    </c-dynamic-form>
    <div class="toolbars">
      <div class="toolbars-left">
        <template v-for="(tool, index) in toolbars">
          <el-dropdown
            v-if="tool.type === 'dropdown'"
            :key="index"
            size="small"
            @command="
              command =>
                typeof tool.command === 'function' &&
                tool.command(command, selectRows)
            "
          >
            <el-button type="primary" v-bind="tool.attrs" size="small">
              {{ tool.label }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu
              v-if="tool.btns && tool.btns.length"
              slot="dropdown"
            >
              <el-dropdown-item
                v-for="(btn, i) in tool.btns"
                v-bind="btn.attrs"
                type="primary"
                size="small"
                :key="'' + index + i"
                v-show="!isHiddenButton(tool)"
                @click.native="
                  typeof btn.click === 'function' && btn.click(selectRows)
                "
              >
                {{ btn.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <slot
            v-else-if="tool.type === 'slot'"
            :name="'toolbars|' + tool.slotName"
            v-bind:rows="selectRows"
          />
          <el-button
            v-else
            v-bind="tool.attrs"
            :key="index"
            type="primary"
            size="small"
            v-show="!isHiddenButton(tool)"
            @click="typeof tool.click === 'function' && tool.click(selectRows)"
          >
            {{ tool.label }}
          </el-button>
        </template>
      </div>
      <div class="toolbars-right">
        <el-button
          type="primary"
          v-if="showRefresh"
          size="small"
          @click="onRefreshTable"
          >刷新</el-button
        >
        <el-button
          type="primary"
          v-if="showColumn"
          size="small"
          @click="onChangeColumn"
          >自定义显示列</el-button
        >
      </div>
    </div>
    <!-- <hl-table :data="data" :headers="headers"></hl-table> -->
    <slot name="table-before" />
    <slot name="table-title"></slot>
    <c-table
      :border="true"
      v-bind="$attrs"
      v-on="$listeners"
      size="small"
      :data="tableData"
      :headers="computedHeaders"
      @selection-change="onSelectionChange"
      @sort-change="onSortChange"
      ref="table"
    >
      <!-- 自定义列插槽 -->
      <template
        v-for="col in headers"
        :slot="'column|' + (col.slotName || col.prop)"
        slot-scope="scope"
      >
        <slot
          :name="'column|' + (col.slotName || col.prop)"
          :row="scope.row"
          :$index="scope.$index"
        ></slot>
      </template>
    </c-table>
    <el-pagination
      background
      layout="total, prev, pager, next, sizes, slot, jumper"
      :page-sizes="pageSizes"
      :total="pageParams.total"
      :current-page.sync="pageParams.page"
      :page-size="pageParams.limit"
      :style="{ 'margin-top': pgMarginTop + 'px' }"
      @size-change="onPgSizeChange"
    >
      <span class="el-pagination-slot">跳至</span>
    </el-pagination>
  </div>
</template>
<script>
let CFilterCheckPanel = () =>
  import('@/components/common/CFilterCheckPanel/index.js');
import axios from '@/plugins/axios';
import { Button, Pagination, Loading, FormItem, Message } from 'element-ui';
import CDynamicForm from '../../common/CDynamicForm';
import CTable from '../../common/CTable';
import { getConfig } from './config';
/**
 * 格式化空数据显示
 */
let formatterEmptyData = str =>
  ['', null, undefined].indexOf(str) >= 0 ? '-' : str;
export default {
  name: 'BTable',
  props: {
    //数据查询是否展示loading
    loading: {
      type: Boolean,
      default: false
    },
    //数据查询func，返回promise对象
    ajaxGetData: {
      type: Function,
      default: () => {}
    },
    //保存筛选结果（显示列/筛选项）
    ajaxFilterSave: {
      type: Function
    },
    //查询筛选结果（显示列/筛选项）
    ajaxFilterQuery: {
      type: Function
    },
    //表头数组
    headers: {
      type: Array,
      default: () => []
    },
    //分页组件与表间距
    pgMarginTop: {
      type: Number,
      default: 20
    },
    //每页展示数量选择
    pageSizes: {
      type: Array,
      default: () => [10, 50, 100, 500, 1000]
    },
    //默认每页展示数量
    pageLimit: {
      type: Number,
      default: 50
    },
    // 表单配置
    formItems: {
      type: Array,
      default: () => []
    },
    // 初始化表单数据
    initialFormData: {
      type: Object,
      default: () => ({})
    },
    // 工具栏
    toolbars: {
      type: Array,
      default: () => []
    },
    //显示刷新按钮
    showRefresh: {
      type: Boolean,
      default: true
    },
    //显示列
    showColumn: {
      type: Boolean,
      default: false
    },
    //显示筛选项按钮
    showQueryFilter: {
      type: Boolean,
      default: false
    },
    //保存column列显示所使用的的key
    saveColumnKey: {
      type: String,
      default: ''
    },
    //保存筛选项显示所使用的的key
    saveQueryKey: {
      type: String,
      default: ''
    },
    //项目系统(用于保存列数据时的参数)
    system: {
      type: String,
      default: undefined
    },
    //保存列对应的成功提示文案
    saveSuccessMsg: {
      type: String,
      default: '保存成功'
    },
    //保存列对应的失败提示文案
    saveErrorMsg: {
      type: String,
      default: '数据保存失败'
    },
    /**
     * 立即加载
     */
    immediateLoad: {
      type: Boolean,
      default: true
    }
    /**
     * 行数据键值
     */
    // rowKey: {
    //   type: [Function, String]
    // },
    // expandRowKeys: {
    //   type: Array
    // }
  },
  components: {
    CTable,
    ElPagination: Pagination,
    CDynamicForm,
    [FormItem.name]: FormItem,
    [Button.name]: Button
  },
  data() {
    return {
      headerPromise: null,
      computedHeaders: [],
      computedFormItems: [],
      ajaxCount: 0,
      selectRows: [],
      loadingIns: null,
      //分页参数
      pageParams: {
        total: 0,
        offset: 0,
        limit: this.pageLimit,
        page: 1
      },
      //排序参数
      sortParams: {
        sort: undefined,
        order: undefined
      },
      tableData: [],
      // 表单数据
      formData: { ...this.initialFormData },
      // 表单数据
      formAttrs: {
        inline: true,
        size: 'small'
      },
      // 是否是数组
      isArray: arr => Array.isArray(arr),
      sysConfig: {} //根据配置参数及prop入参，动态配置
    };
  },
  watch: {
    //每页展示数量变化
    'pageParams.limit'() {
      let { page } = this.pageParams;
      if (page == 1) {
        //在第一页修改每页数量时，触发重新请求
        this.ajaxGetTableDataByPage();
      } else {
        //非首页修改，将页码改为首页，触发页码更新监听
        this.pageParams.page = 1;
      }
    },
    //当前页码变化
    'pageParams.page'() {
      let { page, limit } = this.pageParams;
      this.pageParams.offset = limit * (page - 1);
      this.ajaxGetTableDataByPage();
    },
    // 数据变化
    tableData() {
      this.$emit('table-data-change', this.tableData);
    },
    formItems() {
      //formItems 变化处理
      this.dealQueryItems();
    }
  },
  computed: {
    //请求入参
    ajaxPageParams() {
      // let param = this.pageParams;
      let { offset, limit, page } = this.pageParams;
      return { offset, limit, pageSize: limit, pageNum: page };
    },
    //存储列数据所用key
    computedSaveColumnKey() {
      if (this.saveColumnKey) return this.saveColumnKey;
      let key;
      try {
        key = this.$route.path;
      } catch (error) {
        key = 'default';
      }
      return 'table|' + key;
    },
    //存储筛选项所用key
    computedSaveQueryKey() {
      if (this.saveQueryKey) return this.saveQueryKey;
      let key;
      try {
        key = this.$route.path;
      } catch (error) {
        key = 'default';
      }
      return 'query|' + key;
    }
  },
  created() {
    this.initConfig(); //默认配置初始化
    this.headerPromise = this.dealHeaders(); //表头处理
    this.dealQueryItems(); //表单查询项处理
  },
  mounted() {
    this.immediateLoad && this.ajaxGetTableDataByPage();
  },
  methods: {
    //分页接口请求数据处理
    ajaxGetTableDataByPage() {
      (this.$refs.cDynamicForm
        ? this.$refs.cDynamicForm.validate()
        : Promise.resolve()
      ).then(() => {
        let tAjaxCount = ++this.ajaxCount;
        let lastLoadingMap = this.lastLoadingMap;
        if (!this.$refs.table) return; //查询中途实例被销毁，终端
        //默认load实例不存在，创建/已存在，使用原有load对象
        if (!this.loadingIns) {
          //填充loading展示默认值，兼容处理
          let loadIns = {
            close() {}
          };
          //需要展示loading
          if (this.loading) {
            loadIns = Loading.service({
              target: this.$refs.table.$el
            });
          }
          this.loadingIns = loadIns;
        }
        let ajaxParams = {
          ...this.ajaxPageParams,
          ...this.formData,
          ...this.sortParams
        };
        //获取func入参
        let dataFun = this.ajaxGetData;
        //完成回调
        let callFun = res => {
          // console.log('-', tAjaxCount, ajaxCount, res, this.pageParams);
          if (tAjaxCount != this.ajaxCount) return; //当前请求非最新请求，跳过处理
          this.loadingIns.close(); //关闭loading
          this.loadingIns = null; //置空load示例
          if (!res) return;
          let data = res.data || {};
          this.tableData = Array.isArray(data.records) ? data.records : []; //表数据
          this.pageParams.total = data.total || 0; //数据长度
          if (this.tableData.length === 0) this.pageParams.page = 1; //无数据时，重定向第一页
        };
        //func判非空并执行
        let dataPromise = dataFun && dataFun(ajaxParams);
        //promise接收返回值
        if (dataPromise && typeof dataPromise.then == 'function') {
          Promise.all([dataPromise, this.headerPromise])
            .then(res => {
              callFun(res[0]);
            })
            .catch(e => {
              console.error(e);
              callFun();
            });
        } else {
          callFun();
        }
      });
    },
    /**
     * 获取服务端保存的列/筛选项配置信息
     * @param {Number} type 1=表头列信息  2=筛选项信息
     */
    ajaxGetShowFilterData(type = 1) {
      let { system, ajaxFilterQuery } = this.sysConfig;
      let key = this.getSaveKey(type);
      if (typeof ajaxFilterQuery == 'function')
        return ajaxFilterQuery({
          system,
          key
        });
      return [];
    },
    /**
     * 保存显示列/筛选项
     * @param {Number} type 1=表头列信息  2=筛选项信息
     */
    ajaxSaveFilterData(params, type = 1) {
      let { system, ajaxFilterSave } = this.sysConfig;
      let key = this.getSaveKey(type);
      if (typeof ajaxFilterSave == 'function')
        return ajaxFilterSave({
          system,
          key,
          columns: params
        });
      return [];
    },
    //表单查询项预处理，默认筛选显示数据从远程或本地获取并覆盖
    async dealQueryItems() {
      let formItems = this.formItems;
      let { ajaxFilterQuery, ajaxFilterSave } = this.sysConfig;
      //需要“显示列”按钮时，表头需要获取本地或远程保存数据
      if (this.showQueryFilter) {
        let remoteQuerys;
        //服务端保存
        if (ajaxFilterQuery && ajaxFilterSave) {
          try {
            let res = await this.ajaxGetShowFilterData(2);
            remoteQuerys = res;
            console.log('remote-querys', remoteQuerys);
          } catch (error) {
            remoteQuerys = [];
          }
        } else {
          remoteQuerys = this.getLocalFilterData(2);
          console.log('local-querys', remoteQuerys);
        }
        this.dealColumnsHeader(formItems, remoteQuerys); //使用服务端数据覆盖本地数据
      }
      //对header做默认赋值处理
      formItems = formItems.map(headItem => {
        //初始需要赋值字段，否则页面无法根据字段响应
        headItem.required = headItem.required || false;
        headItem.hidden = headItem.hidden || false;

        // 下拉选择默认启用清除按钮功能
        if (headItem.type === 'select') {
          let clearable = headItem.attrs && headItem.attrs.clearable;
          clearable = clearable === undefined ? true : clearable;
          if (!headItem.attrs) headItem.attrs = {};
          headItem.attrs.clearable = clearable;
        }
        return headItem;
      });
      this.computedFormItems = formItems;
    },
    //header二次封装，处理分页返回数据
    async dealHeaders() {
      let headers = this.headers;
      let { ajaxFilterQuery, ajaxFilterSave } = this.sysConfig;
      //需要“显示列”按钮时，表头需要获取本地或远程保存数据
      if (this.showColumn) {
        let remoteHeaders;
        //服务端保存
        if (ajaxFilterQuery && ajaxFilterSave) {
          try {
            let res = await this.ajaxGetShowFilterData();
            remoteHeaders = res;
            console.log('remote-headers', remoteHeaders);
          } catch (error) {
            remoteHeaders = [];
          }
        } else {
          remoteHeaders = this.getLocalFilterData();
          console.log('local-headers', remoteHeaders);
        }
        this.dealColumnsHeader(headers, remoteHeaders); //使用服务端数据覆盖本地数据
      }
      //对header做默认赋值处理
      this.computedHeaders = headers.map(headItem => {
        //初始需要赋值字段，否则页面无法根据字段响应
        headItem.required = headItem.required || false;
        headItem.hidden = headItem.hidden || false;
        headItem.resizable = headItem.resizable || false;
        let fun = headItem.index;
        //序号类型，补充分页信息返回
        if (headItem.type == 'index' && typeof fun == 'function') {
          headItem.index = index =>
            fun(index, this.pageParams.page, this.pageParams.limit);
          // console.log(headItem.index);
        }
        // 处理空数据显示横杠
        let formatter = headItem.formatter;
        if (typeof formatter === 'function') {
          headItem.formatter = (...args) => {
            let res = formatter.apply(null, args);
            return formatterEmptyData(res);
          };
        } else {
          headItem.formatter = (row, col, value) => formatterEmptyData(value);
        }
        return headItem;
      });
    },
    // 初始化配置，从全局取配置
    initConfig() {
      let config = getConfig();
      let { system, ajaxFilterSave, ajaxFilterQuery } = this.$props;
      this.sysConfig.system = system !== undefined ? system : config.system;
      this.sysConfig.ajaxFilterSave =
        ajaxFilterSave !== undefined ? ajaxFilterSave : config.ajaxFilterSave;
      this.sysConfig.ajaxFilterQuery =
        ajaxFilterQuery !== undefined
          ? ajaxFilterQuery
          : config.ajaxFilterQuery;
    },
    /**
     * 获取保存列或筛选项的key
     * @param {Number} type 1=表头列信息  2=筛选项信息
     */
    getSaveKey(type) {
      return type == 1 ? this.computedSaveColumnKey : this.computedSaveQueryKey;
    },
    /**
     * 保存本地列/筛选项数据
     * @param {Array} saveData 需要保存的表头列/筛选项数据
     * @param {Number} type 1=需要保存的表头列/2=筛选项数据
     * @returns {Promise} 返回promise对象
     */
    saveLocalFilterData(saveData, type = 1) {
      let key = this.getSaveKey(type);
      return new Promise((resolve, reject) => {
        try {
          localStorage.setItem(key, JSON.stringify(saveData));
          resolve();
        } catch (error) {
          Message({
            message: error.name + ':' + error.message,
            type: 'warning',
            duration: 5 * 1000
          });
          reject();
        }
      });
    },
    /**
     * 获取本地列数据
     * @param {Number} type 1=需要保存的表头列/2=筛选项数据
     */
    getLocalFilterData(type = 1) {
      let key = this.getSaveKey(type);
      let result;
      try {
        result = JSON.parse(localStorage.getItem(key)) || [];
      } catch (error) {
        result = [];
      }
      return result;
    },
    /**
     * 获取查询参数
     */
    getQueryParam() {
      return {
        ...this.ajaxPageParams,
        ...this.formData,
        ...this.sortParams
      };
    },
    /**
     * 统一处理表头数据，服务端数据覆盖本地数据（数据以本地为准，本地不存在的列不作处理）
     * @param {Array} localList 本地初始的表头数据
     * @param {Array} remoteList 服务端配置的表头数据
     */
    dealColumnsHeader(localList, remoteList) {
      // console.time('dealColumnsHeader-time');
      let tempRemoteList = JSON.parse(JSON.stringify(remoteList)); //拷贝远程数据
      for (let i = 0, len = localList.length; i < len; i++) {
        let localItem = localList[i];
        let localProp = localItem.prop;
        //数据关键key不存在，此数据项不做处理
        if (!localProp) {
          continue;
        }
        for (let j = 0; j < tempRemoteList.length; j++) {
          let remoteItem = tempRemoteList[j];
          let remoteProp = remoteItem.prop;
          //数据key一致，覆盖本地数据，并在拷贝数据中移除此项，不做重复循环
          if (remoteProp == localProp) {
            Object.assign(localItem, remoteItem, {
              required: localItem.required,
              label: localItem.label //优先使用本地名称
            });
            tempRemoteList.splice(j, 1);
            break;
          }
        }
      }
      // console.timeEnd('dealColumnsHeader-time');
    },
    /**
     * 页码切换
     * @param {Number} curr 当前页卡索引
     */
    // onPgCurrentChange(curr) {
    //   console.log(curr);
    //   this.pageParams.page = curr;
    // },
    //每页展示数量切换
    onPgSizeChange(size) {
      this.pageParams.limit = size;
    },
    /**
     * 表单查询
     */
    onQueryForm() {
      this.$emit('query-form');
      let { page } = this.pageParams;
      page === 1 ? this.ajaxGetTableDataByPage() : (this.pageParams.page = 1);
    },
    /**
     * 表单重置
     */
    onResetForm() {
      this.formData = { ...this.initialFormData };
      this.$refs.cDynamicForm && this.$refs.cDynamicForm.init();
      this.$emit('reset-form');
    },
    //过滤筛选条件
    async onFilterQueryCondition() {
      let { ajaxFilterSave, ajaxFilterQuery } = this.sysConfig;
      let checkFilterPlugin = (await CFilterCheckPanel()).default;
      //调用显示列插件
      checkFilterPlugin.show({
        data: this.formItems, //源数据 checkbox集合
        //点击提交时调用的接口
        ajaxFun:
          ajaxFilterSave && ajaxFilterQuery
            ? params => this.ajaxSaveFilterData(params, 2) //本地缓存
            : params => this.saveLocalFilterData(params, 2), //接口保存
        successMsg: this.saveSuccessMsg,
        errorMsg: this.saveErrorMsg
      });
    },
    //监听选择变化
    onSelectionChange(rows) {
      this.selectRows = rows;
    },
    //监听排序变化
    onSortChange({ order, prop }) {
      this.sortParams = {
        order: order == 'ascending' ? 'asc' : 'desc',
        sort: prop
      };
      this.ajaxGetTableDataByPage();
    },
    //刷新table
    onRefreshTable() {
      this.ajaxGetTableDataByPage();
    },
    //显示列
    async onChangeColumn() {
      let { ajaxFilterSave, ajaxFilterQuery } = this.sysConfig;
      let checkFilterPlugin = (await CFilterCheckPanel()).default;
      //调用显示列插件
      checkFilterPlugin.show({
        title: '自定义显示列',
        data: this.headers, //源数据 checkbox集合
        //点击提交时调用的接口
        ajaxFun:
          ajaxFilterSave && ajaxFilterQuery
            ? this.ajaxSaveFilterData //本地缓存
            : this.saveLocalFilterData, //接口保存
        successMsg: this.saveSuccessMsg,
        errorMsg: this.saveErrorMsg
      });
    },
    /**
     * 是否显示按钮
     * @param {*} btn 修改列表
     */
    isHiddenButton(btn) {
      let { hidden } = btn;
      if (typeof hidden === 'function') return hidden(btn);
      return hidden;
    }
  }
};
</script>

<style lang="less" scoped>
.toolbars {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.el-button + .el-dropdown,
.el-dropdown + .el-button {
  margin-left: 10px;
}
.el-pagination-slot {
  color: @normal-txt;
  font-weight: normal;
  margin-right: -54px;
  background: #fff;
  display: inline-block;
  position: relative;
  z-index: 1;
}
</style>
