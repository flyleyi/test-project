// vue 过滤器
import Vue from 'vue';

const filters = {
  /**
   * 将时间转换为指定格式
   * @param {String/Date/Number} val 时间
   * @param {String} fmt 转换格式 默认yyyy-MM-dd
   * @param {String} noData 传值为空时，默认返回值
   */
  formatDateTime(val, fmt = 'yyyy-MM-dd', noData = '') {
    let value = val || '';
    if (!value) return noData;
    // 时间戳
    if (!isNaN(value)) {
      let str = value.toString();
      value = Number((str + '0000000000000').slice(0, 13));
      value = Number(value);
    }
    // IOS 需要转成yyyy/MM/dd
    else
      value = value
        .toString()
        .replace(/-/g, '/')
        .replace(/\..$/g, '');
    let date = new Date(value);
    if (!date) return value;
    // 时间格式化
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      );
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length)
        );
      }
    }
    return fmt;
  }
};

// 注册全局过滤器
for (let key in filters) {
  Vue.filter(key, filters[key]);
}
