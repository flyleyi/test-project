/**
 * create by xujb 20180929 [自定义指令集合]
 */
import Vue from 'vue';
import { allModules } from './directives/index.js';

// 批量注册指令
allModules.forEach(item => {
  Vue.directive(item.name, item.option);
});
