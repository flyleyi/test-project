'use strict';

import axios from 'axios';
import API_HOST from './common/api';
import qs from 'qs';
// import { Message, MessageBox } from 'element-ui';
import { getToken, setToken } from '@/plugins/core/auth';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.VUE_APP_BASE_API || '',
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache'
  }
};

let codeFunMap = {};
const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = token; // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  function(error) {
    // Do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // 刷新token
    if (response && response.headers && response.headers.Authorization) {
      setToken(response.headers.Authorization);
    }

    // Do something with response data
    const res = response.data;
    // 请求成功
    if (res.status === 200) {
      return response.data;
    }
    // 家校PHP返回码用的都是code来做判断
    if (res.code === 200) {
      return response.data;
    }
    if (res.code === 8200) {
      return response.data;
    }
    // 文件类型直接返回
    if (Blob && res instanceof Blob) {
      return res;
    }
    // 处理请求其他异常状态程序
    let customCodeDealFun =
      codeFunMap['S|' + response.data.status] || codeFunMap['S'];
    // 执行配置的code异常对应方法
    if (customCodeDealFun && typeof customCodeDealFun == 'function') {
      customCodeDealFun(response.data);
    }
    return Promise.reject(res);
  },
  function(error) {
    // Do something with response error
    var defaultError = {
      status: 500,
      message: '系统异常'
    };
    if (error.message && error.message.cancel == 'cancel') {
      return Promise.reject(error.response || defaultError);
    }
    let customCodeDealFun;
    let message;
    // 判断是否是网络异常请求
    if (error.response) {
      let { response } = error;
      message = (response.data && response.data.message) || response.statusText;
      customCodeDealFun = codeFunMap['E|' + response.status] || codeFunMap['E'];
    } else {
      message = error.message;
      if (
        error.code === 'ECONNABORTED' &&
        !error.message.indexOf('timeout') !== -1
      ) {
        message = '网络超时,请稍后重试！';
      }
      customCodeDealFun = codeFunMap['E'];
    }
    let res = error.response || defaultError;
    // 执行配置的code异常对应方法
    if (customCodeDealFun && typeof customCodeDealFun == 'function') {
      customCodeDealFun(res, message);
    }
    return Promise.reject(res);
  }
);

var Plugin = {};
Plugin.install = function(Vue, options) {
  Vue.axios = axiosWithHost;
  codeFunMap = options;
  Vue.prototype.axios = axiosWithHost;
  Vue.prototype.$axios = axiosWithHost;
  window.axios = axiosWithHost;
};
//请求域名拼接
function axiosWithHost(config, type) {
  let url = (API_HOST[type] || '') + config.url;
  let axiosConfig = Object.assign({}, config, { url });
  return _axios(axiosConfig);
}
axiosWithHost.get = function(ajaxUrl, config, type) {
  let url = (API_HOST[type] || '') + ajaxUrl;
  return _axios.get(url, { params: config });
};
axiosWithHost.post = function(ajaxUrl, data, config, type) {
  let url = (API_HOST[type] || '') + ajaxUrl;
  return _axios.post(url, data, config);
};
axiosWithHost.delete = function(ajaxUrl, data, config, type) {
  let url = (API_HOST[type] || '') + ajaxUrl;
  return _axios.delete(url, data, config);
};

export default axiosWithHost;
export const axiosPlugin = Plugin;
