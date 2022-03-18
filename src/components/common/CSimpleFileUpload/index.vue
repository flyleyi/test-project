<template>
  <el-upload
    :class="[{ hidden: urlList.length >= limit, 'is-disabled': disabled }]"
    :action="action"
    :file-list="urlList"
    :limit="limit"
    :disabled="disabled"
    :http-request="httpRequest"
    :before-upload="onFileBeforeLoad"
    :on-remove="onFileRemove"
    :on-success="onFileUploadSuccess"
    :on-error="onFileUploadError"
    :accept="accepts.map(item => `.${item}`).join(',')"
  >
    <el-button
      v-show="urlList.length < limit"
      size="small"
      type="primary"
      :disabled="disabled"
    >
      点击上传(支持word，pdf格式)
    </el-button>
  </el-upload>
</template>
<script>
import { Upload, Message } from 'element-ui';
import emitter from 'element-ui/src/mixins/emitter';
import mime from 'mime-types';

export default {
  name: 'CPicFileUpload',
  components: {
    [Upload.name]: Upload
  },
  mixins: [emitter],
  props: {
    //请求url
    action: {
      type: String,
      default: ''
    },
    //图片url
    url: {
      type: Object,
      default: null
    },
    //请求覆盖方法
    'http-request': {
      type: Function
    },
    //接收文件类型
    accepts: {
      type: Array,
      default: () => {
        return [];
      }
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    //上传文件成功使用的field接收文件url
    successField: {
      type: String,
      default: 'fileUrl'
    },
    //最大可上传文件大小
    'max-size': {
      type: Number,
      default: 0
    },
    //自定义文件预处理错误回调（配合 @accepts-unmatch @over-max-Size）
    customFileError: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      limit: 1, //最大上传一张
      loading: false, //true=上传操作中，隐藏上传功能块
      urlList: []
    };
  },
  watch: {
    url: {
      immediate: true,
      handler: 'updateList'
    }
  },
  methods: {
    //url变化，更新文件列表
    updateList(newVal) {
      {
        if (newVal) {
          this.urlList = [newVal];
        } else {
          this.urlList = [];
        }
      }
    },
    //文件上传成功
    onFileUploadSuccess(response, file, fileList) {
      this.loading = false;
      // console.log('上传成功', ...arguments);
      let url = {
        url: response.data[this.successField],
        name: file.name
      };
      this.$emit('update:url', url);
      this.$emit('change', url);
      this.dispatch('ElFormItem', 'el.form.change', [url]);
    },
    //文件上传失败
    onFileUploadError(err, file, fileList) {
      this.loading = false;
      Message({
        type: 'error',
        duration: 5000,
        message: '上传的文件失败'
      });
    },
    //文件移除
    onFileRemove(file) {
      this.$emit('update:url', null);
      this.$emit('change', null);
      this.dispatch('ElFormItem', 'el.form.change', []);
    },
    //上传前处理
    onFileBeforeLoad(file) {
      let matchTypes = this.accepts.map(item => mime.lookup(item));
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
            message: `上传文件大小超过${maxSize}M`
          });
        }
      }
      //判断是否需要拦截上传操作
      let result = isMatchType && isSizeLimit;
      if (result) {
        this.loading = true; //设置为上传操作中
      }
      return result;
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
    display: flex;
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
/deep/ .el-upload {
  display: block;
  text-align: left;
}
/deep/ .el-upload-list__item:first-child {
  margin-top: 3px;
}
</style>
