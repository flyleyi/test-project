<template>
  <el-dialog
    :visible.sync="visible"
    :title="title || '导入数据'"
    center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    v-on="$listeners"
    @closed="onClosed"
  >
    <div class="import-data-content">
      <h3>导入流程</h3>
      <p>
        1、我们为您设置了导入模板，下载后按照模板格式内容上传即可；
        <el-button v-if="templateUrl" type="primary" @click="downloadTemplate">
          下载模板
        </el-button>
      </p>
      <p>2、黄色表头表示的列为必填项；</p>
      <p>3、请不要进行插入列操作；</p>
      <p>4、excel表格数据行之间不要有空行。</p>
      <el-input :value="fileName" placeholder="选择文件" readonly>
        <el-button slot="append" @click="$refs.file.click()">浏览</el-button>
      </el-input>
      <input
        v-show="false"
        v-if="renderFile"
        type="file"
        ref="file"
        accept=".xls,.xlsx"
        @change="onChange"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button size="small" type="primary" @click="startUpalodFile">
        确定上传
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from '@/plugins/axios';
import {
  MessageBox,
  Button,
  Dialog,
  Message,
  Input,
  Loading
} from 'element-ui';
/**
 * 获取文件地址后缀名
 * @param {string} url url地址
 */
function getExtension(url) {
  if (!url || typeof url !== 'string') return '';
  // eslint-disable-next-line no-useless-escape
  var res = /\.([0-9a-zA-Z]+)(?:[\?#]|$)/i.exec(url);
  if (!res) return '';
  return res[1];
}

export default {
  name: 'BImportDataPanel',
  components: {
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [Input.name]: Input
  },
  props: {
    /**
     * 上传地址
     */
    url: {
      type: String,
      default: ''
    },
    ajaxImport: {
      type: Function,
      default: () => {}
    },
    /**
     * 最大文件大小
     * 单位：MB
     */
    maxFileSize: {
      type: Number,
      default: 2
    },
    /**
     * 标题
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * 模板下载地址
     */
    templateUrl: {
      type: String,
      default: ''
    },
    /**
     * 成功回调
     */
    onSuccess: {
      type: Function
    }
  },
  data() {
    return {
      renderFile: true, // 渲染文件上传表单
      visible: false, // 是否显示模态框
      file: null // 文件
    };
  },
  computed: {
    /**
     * 文件名
     */
    fileName() {
      return (this.file && this.file.name) || '';
    }
  },
  watch: {},
  methods: {
    /**
     * 选择文件
     */
    onChange(event) {
      let { files } = event.target;
      let file = files[0];
      this.resetFile();
      if (!files.length) return;
      if (!this.checkFile(files[0])) return;
      this.file = file;
    },
    /**
     * 校验文件
     */
    checkFile(file) {
      // 校验文件类型
      let isExcel =
        ['xls', 'xlsx'].indexOf(getExtension(file.name).toLowerCase()) !== -1;
      // 校验文件大小
      let isLt = file.size / 1024 / 1024 < this.maxFileSize;
      if (!isExcel) Message.warning('上传文件只能是xls、xlsx格式');
      if (!isLt) Message.warning('上传文件只能最大2MB');
      return isExcel && isLt;
    },
    /**
     * 重置file表单，解决重复选择同一个文件不触发change事件问题
     */
    resetFile() {
      this.renderFile = false;
      this.$nextTick(() => {
        this.renderFile = true;
      });
    },
    /**
     * 开始上传文件
     */
    startUpalodFile() {
      if (!this.file || !(this.file instanceof File))
        return Message.warning('文件未填写');
      let formData = new FormData();
      formData.append('file', this.file);
      let loading = Loading.service({
        text: '导入中...'
      });
      let ajaxPromise = this.ajaxImport && this.ajaxImport(formData);
      //没有传入ajaxImport，或者非promise类型，则直接执行axios方法
      if (!ajaxPromise || typeof ajaxPromise.then != 'function') {
        ajaxPromise = axios({
          method: 'POST',
          url: this.url
        });
      }
      ajaxPromise
        .then(({ data }) => {
          this.hide();
          //数据没有完全成功，则显示对应下载按钮
          if (data && data.total != data.successNum) {
            let msg = `共${data.total}条数据，已成功导入${data.successNum}条，点击“下载”下载错误报告`;
            MessageBox.confirm(msg, '提示', {
              confirmButtonText: '下载',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal: false,
              closeOnPressEscape: false,
              showClose: false
            }).then(() => {
              //点击下载
              window.open(data.fileUrl);
            });
          } else {
            MessageBox.alert(
              `恭喜！共${data.total}条数据，全部完成导入`,
              '提示',
              {
                confirmButtonText: '确定',
                type: 'success'
              }
            );
          }

          typeof this.onSuccess === 'function' && this.onSuccess.call();
        })
        .catch(e => {
          console.log('e', e);
        })
        .finally(() => {
          loading.close();
        });
    },
    /**
     * 下载模板
     */
    downloadTemplate() {
      window.open(this.templateUrl);
    },
    /**
     * 显示
     */
    show() {
      this.file = null;
      this.visible = true;
    },
    /**
     * 隐藏
     */
    hide() {
      this.visible = false;
    },
    /**
     * 关闭模态框动画结束
     */
    onClosed() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="less" scoped>
.import-data-content {
  h3 {
    font-size: 16px;
    color: #303133;
  }
  p {
    font-size: 14px;
    margin: 15px 0;
  }
}
</style>
