import Vue from 'vue';
import file from './index.vue';
let CFCConstruct = Vue.extend(file);

let instance;
//关闭/移除弹窗
function close() {
  document.body.removeChild(instance.$el);
  instance = null;
}

const CFilterCheckPanel = {};
//显示组件
CFilterCheckPanel.show = function(options) {
  if (instance) {
    close();
  }
  //实例化组件
  instance = new CFCConstruct({
    propsData: Object.assign({}, options, {
      onClosed: close
    })
  });
  instance.$mount();
  document.body.appendChild(instance.$el); //挂载组件dom节点
  Vue.nextTick(() => {
    instance.show();
  });
};
export default CFilterCheckPanel;
