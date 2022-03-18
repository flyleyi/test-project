const install = function(Vue) {
  const Bus = new Vue({
    methods: {
      //事件派发
      emit(event, ...args) {
        this.$emit(event, ...args);
      },
      //事件监听
      on(event, callback) {
        this.$on(event, callback);
      },
      //移除监听
      off(event, callback) {
        this.$off(event, callback);
      }
    }
  });
  // 注册给Vue对象的原型上的全局属性
  Vue.prototype.$bus = Bus;
};

export default install;
