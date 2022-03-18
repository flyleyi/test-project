<template>
  <el-dialog
    title="配置服务器"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    width="560px"
  >
    <div v-for="serverCode in serverList" :key="serverCode" class="form-item">
      <label>{{ serverCode }}：</label>
      <div class="form-item-content">
        <el-input v-model="data[serverCode]" size="small" />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">
        取消
      </el-button>
      <el-button type="primary" size="small" @click="onSubmit">
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getServerUrl,
  setServerUrl,
  getServerDefaultUrl
} from '@/plugins/common/api-tools';
import { Dialog, Input, FormItem } from 'element-ui';

export default {
  name: 'CApiTools',
  components: {
    [Dialog.name]: Dialog,
    [Input.name]: Input
  },
  props: {
    /**
     * @type {string}
     * @description 可配置的服务器,用逗号分割
     */
    servers: {
      type: String,
      default: Object.keys(getServerDefaultUrl()).join(',')
    }
  },
  data() {
    return {
      // 是否显示
      visible: false,
      // 配置服务器地址
      data: {}
    };
  },
  computed: {
    /**
     * 服务器列表
     */
    serverList() {
      let servers = ''.split.call(this.servers, ',');
      return Object.keys(getServerDefaultUrl()).filter(
        key => servers.indexOf(key) !== -1
      );
    }
  },
  methods: {
    /**
     * 显示
     */
    show() {
      this.serverList.forEach(key => {
        this.$set(this.data, key, getServerUrl(key));
      });
      this.visible = true;
    },
    /**
     * 提交
     */
    onSubmit() {
      Object.keys(this.data).forEach(key => {
        setServerUrl(key, this.data[key]);
      });
      this.visible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.form-item {
  display: flex;
  label {
    width: 100px;
    line-height: 30px;
    text-align: right;
  }
  &-content {
    flex: 1;
  }
}
</style>
