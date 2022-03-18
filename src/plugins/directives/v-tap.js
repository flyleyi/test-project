/**
 * tap事件
 * 参考：https://github.com/MeCKodo/vue-tap
 * 使用案例：
 * <div v-tap="{methods: fn, param1, param2,...}"></div>
 * <p v-tap.prevent="{ methods : scroll }">无法滑动页面</p>
 * <a href="http://www.baidu.com" v-tap>如果想要快速跳转直接写v-tap即可不用写任何参数</a>
 * <!--这样一样会直接快速跳转不会执行cant 除非设置了prevent-->
 * <a href="aaa" v-tap="{ methods : cant }">can't</a>
 */
export default {
  name: 'tap',
  option: {
    // 只调用一次，指令第一次绑定到元素时调用
    bind: function(el, binding) {
      el.isMob = 'ontouchstart' in window; // 是否移动端
      el.tapObj = {};
      // console.log('bind' ,binding)
      el.isTap = function() {
        var self = this;
        if (self.disabled) {
          return false;
        }
        var tapObj = self.tapObj;
        return (
          self.time < 300 &&
          Math.abs(tapObj.distanceX) < 10 &&
          Math.abs(tapObj.distanceY) < 10
        );
      };
      el.__touchstart = function(e) {
        var self = this;
        if (binding.modifiers.stop) e.stopPropagation();
        if (binding.modifiers.prevent) e.preventDefault();
        var touches = e.touches[0];
        var tapObj = self.tapObj;
        tapObj.pageX = touches.pageX;
        tapObj.pageY = touches.pageY;
        tapObj.clientX = touches.clientX;
        tapObj.clientY = touches.clientY;
        self.time = +new Date();
      };
      el.__touchend = function(e) {
        var self = this;
        try {
          Object.defineProperty(e, 'currentTarget', {
            // 重写currentTarget对象 与jq相同
            value: el,
            writable: true,
            enumerable: true,
            configurable: true
          });
        } catch (e) {
          // ios 7下对 e.currentTarget 用defineProperty会报错。
          // 报“TypeError：Attempting to configurable attribute of unconfigurable property”错误
          // 在catch里重写
          console.error(e.message);
          e.currentTarget = el;
        }
        e.preventDefault();

        var touches = e.changedTouches[0];
        var tapObj = self.tapObj;
        self.time = +new Date() - self.time;
        tapObj.distanceX = tapObj.pageX - touches.pageX;
        tapObj.distanceY = tapObj.pageY - touches.pageY;

        if (!self.isTap()) return;
        self.__handler(e);
      };

      el.__handler = function(e) {
        if (binding.modifiers.stop) e.stopPropagation();
        if (binding.modifiers.prevent) e.preventDefault();
        var value = binding.value;
        if (!value && el.href && !binding.modifiers.prevent) {
          return (window.location = el.href);
        }

        var tagName = e.target.tagName.toLocaleLowerCase();
        value.event = e;
        if (tagName === 'input' || tagName === 'textarea') {
          return e.target.focus();
        }
        // if(typeof value === 'function') {
        //     value.call(that, el.dataset[binding.arg])
        // }
        value.methods.call(null, value);
      };
      if (el.isMob) {
        el.addEventListener('touchstart', el.__touchstart, false);
        el.addEventListener('touchend', el.__touchend, false);
      } else {
        el.addEventListener('click', el.__handler, false);
      }
    },
    // 当被绑定的元素插入到 DOM 中时
    // inserted: function(){},
    // update: function(el, binding){},
    // componentUpdated: function(el, binding){},
    // 只调用一次，指令与元素解绑时调用
    unbind: function(el) {
      if (el.isMob) {
        el.removeEventListener('touchstart', el.__touchstart);
        el.removeEventListener('touchend', el.__touchend);
      } else {
        el.removeEventListener('click', el.__handler);
      }
    }
  }
};
