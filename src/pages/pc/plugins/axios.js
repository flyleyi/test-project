import Vue from 'vue';
import { Message } from 'element-ui';
import axios, { axiosPlugin } from '@/plugins/axios.js';
const codeDealsMap = {
  'S|403': res => {
    Message({
      message: res.message,
      type: 'error',
      duration: 5 * 1000
    });
  },
  'E|404': (err, message) => {
    Message({
      message,
      type: 'error',
      duration: 5 * 1000
    });
  },
  E: (err, message) => {
    Message({
      message,
      type: 'error',
      duration: 5 * 1000
    });
  }
};
Vue.use(axiosPlugin, codeDealsMap);
export default axios;
