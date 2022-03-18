<template>
  <el-dialog
    class="check-dialog"
    :visible.sync="visible"
    :title="title"
    center
    v-on="$listeners"
    :before-close="onBeforeClose"
    @closed="onClosed"
  >
    <el-checkbox-group v-model="checkedList" :disabled="loading">
      <el-checkbox
        v-for="item in defaultCheckList"
        :label="item.prop"
        :key="item.prop"
        :disabled="item.required"
        >{{ item.label }}</el-checkbox
      >
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" :loading="loading" @click="onCloseDialog">
        取消
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="onSubmit"
        :loading="loading"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { Checkbox, CheckboxGroup, Button, Dialog, Message } from 'element-ui';
export default {
  name: 'CFilterCheckPanel',
  components: {
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Button.name]: Button,
    [Dialog.name]: Dialog
  },
  props: {
    //传入数据项
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    //标题名称
    title: {
      type: String,
      default: '显示列'
    },
    //是否修改数据源
    editOriginData: {
      type: Boolean,
      default: true
    },
    //显示的标签字段
    labelField: {
      type: String,
      default: 'label'
    },
    //选型的值字段
    propField: {
      type: String,
      default: 'prop'
    },
    //当前是否未选中
    hiddenField: {
      type: String,
      default: 'hidden'
    },
    //是否必要字段
    requiredField: {
      type: String,
      default: 'required'
    },
    //成功文案
    successMsg: {
      type: String,
      default: ''
    },
    //失败文案
    errorMsg: {
      type: String,
      default: '数据保存失败'
    },
    //关闭弹窗后回调
    onClosed: {
      type: Function,
      default: () => {}
    },
    //请求方法 需要返回promise
    ajaxFun: {
      type: Function
    },
    //数据回调，点击提交时触发
    callback: {
      type: Function
    }
  },
  data() {
    return {
      inited: false,
      visible: false, //默认不显示弹窗 用于弹窗动画
      loading: false, //true=接口请求中
      defaultCheckList: [], //默认传入的数据转换成内部格式
      initCheckList: [], //初始选中的字段列
      checkedList: [] //当前选中的数据字段
    };
  },
  mounted() {},
  methods: {
    //展示弹窗
    show() {
      if (!this.data) return;
      //以组件形式使用时，不重复处理数据，只做显示隐藏
      if (this.inited) {
        this.visible = true;
        return;
      }
      this.inited = true;
      //{label: '姓名', prop: 'name',required: true,hidden: true}
      this.defaultCheckList = this.data
        .filter(item => item[this.propField])
        .map(item => {
          let prop = item[this.propField]; //传入的值 默认[prop]
          if (!prop) return;
          let label = item[this.labelField]; //传入的显示标签[label]
          let hidden = item[this.hiddenField] || false; //传入的默认隐藏状态[hidden]
          let required = item[this.requiredField] || false; //传入的默认必选状态[required]
          //当前选项是必选的，或者已选中
          if (required || !hidden) {
            this.checkedList.push(prop);
          }
          return {
            label,
            prop,
            hidden,
            required
          };
        });
      this.initCheckList = JSON.parse(JSON.stringify(this.checkedList)); //赋值初始选中数据
      this.visible = true;
    },
    //按传入顺序，获取数据项
    getData() {
      let result = [];
      this.defaultCheckList.forEach(item => {
        result.push({
          ...item,
          hidden: !this.checkedList.includes(item[this.propField])
        });
      });
      return result;
    },
    //数据处理，如果设置editOriginData=true，则代表会改变源数据，否则只会回调选中的列表
    saveData() {
      if (this.editOriginData) {
        //源数据直接修改
        this.data.forEach((item, index) => {
          let prop = item[this.propField];
          if (!prop) return;
          let ifShow = this.checkedList.includes(prop);
          item[this.hiddenField] = !ifShow; //设置是否隐藏（未选中）
          this.$set(this.data, index, item);
        });
      } else {
        let callback = this.callback;
        typeof callback == 'function' && callback(this.checkedList);
      }
    },
    //比较提交时，选中数据是否发生变更
    compareCheckChange() {
      let beforeList = this.initCheckList; //初始选中数据
      let afterList = this.checkedList; //提交时选中数据
      return (
        JSON.stringify(beforeList.sort()) == JSON.stringify(afterList.sort())
      );
    },
    //点击提交按钮
    onSubmit() {
      if (this.checkedList.length == 0) {
        Message({
          message: '请至少选中一项',
          type: 'warning',
          duration: 5 * 1000
        });
        return;
      }
      //数据无变化
      if (this.compareCheckChange()) {
        this.onCloseDialog(); //直接关闭
        return;
      }
      if (this.loading) return;
      this.loading = true; //设置查询中
      let ajaxFun;
      if (typeof this.ajaxFun == 'function')
        ajaxFun = this.ajaxFun(this.getData());
      //点击确定时需要接口请求
      if (ajaxFun && typeof ajaxFun.then == 'function') {
        ajaxFun
          .then(() => {
            this.loading = false;
            this.saveData();
            //成功提示
            if (this.successMsg) {
              Message({
                message: this.successMsg,
                type: 'success',
                duration: 5 * 1000
              });
            }
            this.onCloseDialog(); //成功后关闭当前窗口
          })
          .catch(e => {
            //接口异常，错误提示
            this.loading = false;
          });
      } else {
        //无需接口请求，直接返回结果
        this.loading = false;
        this.saveData();
        this.onCloseDialog(); //成功后关闭当前窗口
      }
    },
    //处理dialog默认的关闭行为
    onBeforeClose(done) {
      if (this.loading) return;
      done();
    },
    onCloseDialog() {
      if (this.loading) return;
      this.visible = false;
    }
  }
};
</script>
<style lang="less" scoped>
.check-dialog {
  .el-checkbox {
    margin-top: 10px;
  }
}
</style>
