/**
 * 点击节点外触发
 * 例： <div v-clickoutclose="handleClose"></div>
 */
export default {
  name: 'clickoutclose',
  option: {
    bind: function(el, binding, vnode) {
      vnode;
      function documentHandler(e) {
        if (el.contains(e.target)) {
          return false;
        }
        if (binding.value) {
          binding.value(e);
        }
      }
      el.__vueClickOutClose__ = documentHandler;
      if (document.attachEvent) {
        document.attachEvent('onclick', el.__vueClickOutClose__);
      } else {
        document.addEventListener('click', el.__vueClickOutClose__);
      }
    },
    // 解绑时清除
    unbind: function(el, binding) {
      binding;
      if (document.attachEvent) {
        document.detachEvent('onclick', el.__vueClickOutClose__);
      } else {
        document.removeEventListener('click', el.__vueClickOutClose__);
      }
      delete el.__vueClickOutClose__;
    }
  }
};
