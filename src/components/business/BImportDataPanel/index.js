import Vue from 'vue';
import BImportDataPanel from './index.vue';

let instance = null;

const BImportDataPanelConstructor = Vue.extend(
  Object.assign({}, BImportDataPanel, {
    methods: {
      ...BImportDataPanel.methods,
      // 重写onClosed方法处理
      onClosed: function() {
        document.body.removeChild(this.$el);
      }
    }
  })
);

/**
 * 显示导入数据模态框
 * @param {*} options 选项
 */
const BImportData = function(options) {
  if (instance) {
    // 隐藏模态框
    instance.hide();
    instance = null;
  }
  options = options || {};
  // 校验参数是否是字符串
  if (typeof options === 'string') options = { url: options };
  // 创建实例
  instance = new BImportDataPanelConstructor({
    el: document.createElement('div'),
    propsData: options
  });
  document.body.appendChild(instance.$el);
  Vue.nextTick(() => {
    // 显示
    instance.show();
  });
};

export default BImportData;
export { BImportData };
