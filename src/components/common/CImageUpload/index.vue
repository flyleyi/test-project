<template>
  <div>
    <el-upload
      ref="elUpload"
      list-type="picture-card"
      :class="[
        { hidden: value.length >= limit, 'is-disabled': disabled },
        'pic-file-upload',
        `img-fit-${imageFit}`
      ]"
      :action="action"
      :file-list="fileList"
      :limit="limit"
      :disabled="disabled"
      :http-request="httpRequest"
      :before-upload="onFileBeforeLoad"
      :on-remove="onFileRemove"
      :on-success="onFileUploadSuccess"
      :on-error="onFileUploadError"
      :on-preview="onPictureCardPreview"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { Upload, Message, Row, Col, Dialog } from 'element-ui';
import emitter from 'element-ui/src/mixins/emitter';

export default {
  name: 'CImageUpload',
  components: {
    [Upload.name]: Upload,
    [Dialog.name]: Dialog
  },
  mixins: [emitter],
  props: {
    /**
     * @type {string}
     * @description 图片url地址列表
     */
    value: {
      type: Array,
      default: () => []
    },
    /**
     * @type {string}
     * @description 请求地址
     */
    action: {
      type: String,
      default: ''
    },
    /**
     * @type {Function}
     * @description 请求覆盖方法
     */
    httpRequest: {
      type: Function
    },
    /**
     * @type {Array}
     * @description 接送文件类型
     */
    accepts: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /**
     * @type {boolean}
     * @description 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * @type {number}
     * @description 最大文件大小（单位：MB）
     */
    maxSize: {
      type: Number,
      default: 5
    },
    /**
     * @type {string}
     * @description 上传文件成功使用的field接送文件url
     */
    successField: {
      type: String,
      default: 'fileUrl'
    },
    /**
     * @type {boolean}
     * @description 自定义文件预处理错误回调
     */
    customFileError: {
      type: Boolean,
      default: false
    },
    //图片填充规则，默认保持比例，显示全部内容
    //contain 保持原比例，以最大边填充满（留白）
    //cover 保持原比例，以最小边填充满（超出不显示）
    //fill 不保持原比例，填充满
    imageFit: {
      type: String,
      default: 'contain'
    },
    /**
     * @type {Number}
     * @description 自定义文件预处理错误回调（配合 @accepts-unmatch @over-max-Size）
     */
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      loadingList: [], // 上传中列表
      fileList: [], // 文件列表
      dialogVisible: false,
      dialogImageUrl: ''
    };
  },
  computed: {
    /**
     * 是否在上传中
     */
    loading() {
      return !!this.loadingList.length;
    }
  },
  created() {
    // 处理初始数据
    Array.isArray(this.value) &&
      this.value.length &&
      (this.fileList = this.value.map(item => ({
        url: item
      })));
  },
  methods: {
    /**
     * 文件上传成功
     * @method
     * @param {Object} response 响应对象
     * @param {Object} file 文件对象
     * @param {Array} fileList 文件列表
     */
    onFileUploadSuccess(response, file, fileList) {
      this.endUpload(file);
      // console.log('上传成功', ...arguments);
      let url = response.data[this.successField];
      file.url = url;
      let urls = [...this.value, url];
      this.$emit('input', urls);
      this.dispatch('ElFormItem', 'el.form.change', [urls]);
    },
    /**
     * 文件上传失败
     * @method
     * @param {Object} err 异常对象
     * @param {Object} file 文件对象
     * @param {Array} fileList 文件列表
     */
    onFileUploadError(err, file, fileList) {
      this.endUpload(file);
      Message({
        type: 'error',
        duration: 5000,
        message: '上传的文件失败'
      });
    },
    /**
     * 文件移除
     * @method
     * @param {Object} file 文件对象
     * @param {Array} fileList 文件列表
     */
    onFileRemove(file, fileList) {
      // fileList 为删除后的文件列表
      let index = fileList.indexOf(file);
      index > -1 && fileList.splice(index);
      const value = fileList.map(v => v.url);
      this.$emit('input', value);
      this.dispatch('ElFormItem', 'el.form.change', [value]);
      this.endUpload(file);
    },
    /**
     * 上传前处理
     * @method
     * @param {Object} file 文件对象
     */
    onFileBeforeLoad(file) {
      let matchTypes = this.accepts.map(item => 'image/' + item);
      let maxSize = this.maxSize;
      //matchTypes长度为0表示不作文件扩展名限制
      let isMatchType =
        matchTypes.length == 0 ? true : matchTypes.includes(file.type);
      //maxSize为0表示文件大小不做限制
      let isSizeLimit =
        maxSize === 0 ? true : file.size / 1024 / 1024 < maxSize;
      //上传文件不符合类型校验
      if (!isMatchType) {
        if (this.customFileError) {
          this.$emit('accepts-unmatch', file);
        } else {
          Message({
            type: 'warning',
            duration: 5000,
            message: '上传的文件格式支持：' + this.accepts.join('、')
          });
        }
      }
      //上传文件大小超出限制
      if (!isSizeLimit) {
        if (this.customFileError) {
          this.$emit('over-max-size', file);
        } else {
          Message({
            type: 'warning',
            duration: 5000,
            message: `上传图片大小超过${maxSize}M，请缩小图片后重新上传`
          });
        }
      }
      //判断是否需要拦截上传操作
      let result = isMatchType && isSizeLimit;
      if (result) {
        this.startUpload(file);
      }
      return result;
    },
    /**
     * 开始上传
     */
    startUpload(file) {
      this.loadingList.push(file.uid);
    },
    /**
     * 结束上传
     */
    endUpload(file) {
      let index = this.loadingList.indexOf(file.uid);
      index !== -1 && this.loadingList.splice(index, 1);
    },
    /**
     * 预览大图
     */
    onPictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.hidden /deep/ .el-upload--picture-card {
  display: none; /* 上传按钮隐藏 */
}
.pic-file-upload {
  .upload-bar {
    width: 100%;
    height: 100%;
  }
  /deep/ .el-upload-list__item {
    display: inline-flex;
    vertical-align: top;
    justify-content: center;
    align-items: center;
  }
  &.img-fit-contain /deep/ .el-upload-list__item-thumbnail {
    object-fit: contain;
  }
  &.img-fit-fill /deep/ .el-upload-list__item-thumbnail {
    object-fit: fill;
  }
  &.img-fit-cover /deep/ .el-upload-list__item-thumbnail {
    object-fit: cover;
  }
}
.is-disabled {
  /*上传图片按钮鼠标手势禁用+背景色*/
  & /deep/ .el-upload--picture-card {
    cursor: not-allowed;
    background-color: @disabled-bg;
  }
  /**预览图鼠标手势禁用 */
  & /deep/ .el-upload-list__item-actions {
    cursor: not-allowed;
  }
  /*预览图设置禁用底色*/
  & /deep/ .el-upload-list__item-thumbnail {
    background-color: @disabled-bg;
  }
}
</style>
