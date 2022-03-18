/**
 * 在滚动外触发
 * 例：代表当前绑定元素内部滚动正常，外部的滚动会触发onClose
 * <div v-scrolloutclose="onClose"></div>
 * 例：代表.container范围内，.test元素内的滚动正常，.test元素外的滚动会触发onClose
 * <div v-scrolloutclose="{ el: '.test', handler: onClose, container: '.container' }"></div>
 */
export default {
  name: 'scrolloutclose',
  option: {
    /**
     * 为元素绑定区域外滚动触发方法
     * @param {DOM} el 当前绑定元素
     * @param {Object/Function} value  绑定方法 或者 绑定对象，为对象时，格式如下
     * {
     *    el: 绑定区域，在此区域外的滚动，做回调触发
     *    handler: 触发回调方法
     *    container: 指定滚动容器，默认document，当el在滚动区域内（排除自身）触发滚动时，执行回调
     * }
     */
    bind: function(el, { value }) {
      let handler = value.handler || value; //事件处理
      let container = document; //设置滚动容器，默认取document
      if (value.container) {
        container = document.querySelector(value.container);
      }
      if (!container) return;
      //滚动回调
      function scrollHandler(e) {
        let bindEl = document.querySelector(value.el) || el;
        //当前滚动区域包含滚动触发滚动的节点，则不作处理
        if (bindEl.contains(e.target)) {
          return false;
        }
        //区域外的滚动，执行回调
        if (handler) {
          handler(e, value.el);
        }
      }
      el.__container__ = container;
      el.__scrollHandler__ = scrollHandler;
      if (document.attachEvent) {
        container.attachEvent('onscroll', el.__scrollHandler__);
      } else {
        container.addEventListener('scroll', el.__scrollHandler__);
      }
    },
    // 解绑时清除
    unbind: function(el) {
      let container = el.__container__;
      if (!container) return;
      if (document.attachEvent) {
        container.detachEvent('onscroll', el.__scrollHandler__);
      } else {
        container.removeEventListener('scroll', el.__scrollHandler__);
      }
      Reflect.deleteProperty(el, '__scrollHandler__');
      Reflect.deleteProperty(el, '__container__');
    }
  }
};
