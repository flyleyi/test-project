import Vue from 'vue';
import Decimal from 'decimal.js';
const utils = {
  /**
   * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
   *
   * @param  {function} func        传入函数
   * @param  {number}   wait        表示时间窗口的间隔
   * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
   * @return {function}             返回客户调用函数
   */
  debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    let later = function() {
      // 据上一次触发时间间隔
      let last = new Date().getTime() - timestamp;

      // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = new Date().getTime();
      let callNow = immediate && !timeout;
      // 如果延时不存在，重新设定延时
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  },
  /**
   *let testDate = new Date( 1320336000000 );//这里必须是整数，毫秒
   *let testStr = testDate.format("yyyy年MM月dd日hh小时mm分ss秒");
   *let testStr2 = testDate.format("yyyyMMdd hh:mm:ss");
   */
  dateConverter: function(formatData, timestamp = new Date(), noData = '-') {
    if (!timestamp) return noData;
    if (this.isNumber(timestamp)) {
      // 数字补充13位数
      let str = timestamp.toString();
      timestamp = Number(timestamp);
    } else if (this.isString(timestamp)) {
      // IOS 需要转成yyyy/MM/dd
      timestamp = timestamp
        .toString()
        .replace(/-/g, '/')
        .replace(/T/gi, ' ')
        .replace(/\..$/g, '');
    }

    if (!Date.prototype.format) {
      Date.prototype.format = function(format) {
        let o = {
          'M+': this.getMonth() + 1, //month
          'd+': this.getDate(), //day
          'h+': this.getHours(), //hour
          'm+': this.getMinutes(), //minute
          's+': this.getSeconds(), //second
          'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
          S: this.getMilliseconds() //millisecond
        };

        if (/(y+)/.test(format)) {
          format = format.replace(
            RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length)
          );
        }

        for (let k in o) {
          if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ('00' + o[k]).substr(('' + o[k]).length)
            );
          }
        }
        return format;
      };
    }
    // console.log(timestamp);
    let timeFormat = new Date(timestamp || '');
    return timeFormat.format(formatData);
  },
  // =========== js小数计算
  /**
   * 加法运算，解决js小数运算精度不准问题
   */
  numAdd: function(num1, num2) {
    return +new Decimal(+num1).add(new Decimal(+num2));
  },
  /**
   * 减法运算，解决js小数运算精度不准问题
   */
  numSub: function(num1, num2) {
    return +new Decimal(+num1).sub(new Decimal(+num2));
  },
  /**
   * 乘法运算，解决js小数运算精度不准问题
   */
  numMul: function(num1, num2) {
    return +new Decimal(+num1).mul(new Decimal(+num2));
  },
  /**
   * 除法运算，解决js小数运算精度不准问题
   */
  numDiv: function(num1, num2) {
    return +new Decimal(+num1).div(new Decimal(+num2));
  },
  /**
   * 最多保留两位小数，将浮点数四舍五入
   */
  numToDecimal2: function(num) {
    var f = parseFloat(num);
    if (isNaN(f)) {
      return;
    }
    f = Math.round(num * 100) / 100;
    return f;
  },
  //删除url中的指定参数
  //url 要处理的url
  //name 要删除的参数名
  deleteURLPar(url, name) {
    let searchIndex = url.indexOf('?');
    if (searchIndex < 0) return url;
    let baseUrl = url.substr(0, searchIndex);
    let query = url.substr(searchIndex + 1);
    if (query.indexOf(name) > -1) {
      let obj = {};
      let arr = query.split('&');
      for (let i = arr.length - 1; i >= 0; i--) {
        let tmp = arr[i];
        arr[i] = arr[i].split('=');
        tmp = tmp.replace(arr[i][0] + '=', ''); //key=value，tmp表示去掉前缀key=后的value值
        obj[arr[i][0]] = tmp;
      }
      delete obj[name];
      let params = '';
      for (let key in obj) {
        if (obj[key]) params += key + '=' + obj[key] + '&';
      }
      let len = params.length;
      if (len > 1) params = params.substr(0, len - 1); //删除最后的&
      //let params=JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
      url = baseUrl + (params ? '?' : '') + params;
    }
    return url;
  },
  //替换链接上的参数值
  //url  替换链接
  //ref  替换的参数名
  //value 替换的值
  //replaceRouterParam  是否替换路由参数 false 默认替换非路由参数（非#后的参数）
  //  例 替换param1 http://xxx/a.html?param1=xxx&param2=xxx#/?param1=xxx  true替换 #后的param / false替换#前的参数
  changeURLPar(url, ref, value, replaceRouterParam) {
    let str = url;
    let routerAppend = '';
    let routerBefore = '';
    let searchBefore = '';
    let routerSplitIndex = str.indexOf('#');
    if (routerSplitIndex != -1) {
      routerAppend = url.substr(routerSplitIndex); //#后的数据，包括#
      routerBefore = url.substr(0, routerSplitIndex); //#前的数据，不包括#
      str = replaceRouterParam ? routerAppend : routerBefore; //替换路由后的参数，取routerAppend，否则取routerBefore
    } else {
      //原链接不带# 则按默认replaceRouterParam=false处理
      replaceRouterParam = false;
    }
    if (str.indexOf('?') != -1) {
      //参数串带?,则截取?后的数据
      searchBefore = str.substr(0, str.indexOf('?') + 1);
      str = str.substr(str.indexOf('?') + 1);
    } else {
      //不带?直接拼上
      let refv = str + '?' + ref + '=' + value;
      return replaceRouterParam
        ? routerBefore + '#' + refv
        : refv + routerAppend;
    }
    let returnurl = '';
    let setparam = '';
    let arr;
    let modify = '0';

    if (str.indexOf('&') != -1) {
      //--start--新增--20181210  去除链接带的空值 例  a.html?x=1&y=2&z& ==> a.html?x=1&y=2
      arr = str.split('&');
      for (let j = 0; j < arr.length; j++) {
        let tp = arr[j];
        if (!tp || !tp.split('=')[1]) {
          arr.splice(j, 1);
          j = j - 1;
        }
      }
      str = arr.join('&');
      //--end
      arr = str.split('&');
      for (let i = 0; i < arr.length; i++) {
        let tmp = arr[i]; //保存临时值 key=value
        if (arr[i].split('=')[0] == ref) {
          setparam = value;
          modify = '1';
        } else {
          setparam = tmp.replace(arr[i].split('=')[0] + '=', ''); //删除 “key=” ， 留下value字符串
        }
        returnurl = returnurl + arr[i].split('=')[0] + '=' + setparam + '&';
      }
      returnurl = returnurl.substr(0, returnurl.length - 1);
      if (modify == '0' && returnurl == str)
        returnurl = returnurl + '&' + ref + '=' + value;
    } else {
      if (str.indexOf('=') != -1) {
        let tmp = str;
        arr = str.split('=');
        if (arr[0] == ref) {
          setparam = value;
          modify = '1';
        } else {
          setparam = tmp.replace(arr[0] + '=', '');
        }
        returnurl = arr[0] + '=' + setparam;
        if (modify == '0' && returnurl == str)
          returnurl = returnurl + '&' + ref + '=' + value;
      } else returnurl = ref + '=' + value;
    }
    let result = replaceRouterParam
      ? routerBefore + searchBefore + returnurl
      : searchBefore + returnurl + routerAppend;
    return result;
  },
  //判断是否字符串类型
  isString(arg) {
    return typeof arg === 'string';
  },
  //判断是否为数字类型
  isNumber(arg) {
    return typeof arg === 'number' && !isNaN(arg);
  },
  /**
   * 将列表数据转为多维数组
   * @param {*} list 处理的数据
   * @param {*} idKey 主键id
   * @param {*} parentKey 父组件id
   * @param {*} copy 是否要拷贝数据(默认true)
   */
  listConvertTree(
    list = [],
    idKey = 'id',
    parentKey = 'parentId',
    copy = true
  ) {
    // 如果不是数组并且长度为0返回空数组
    if (!Array.isArray(list) || !list.length) return [];
    // 剔除，id等于父id的数据，以防死递归
    list = list.slice(0).filter(item => item[idKey] !== item[parentKey]);
    // 找根数据
    let roots = [];
    let ids = list.map(value => value[idKey]);
    list.forEach(function(item) {
      let id = item[idKey];
      let parentId = item[parentKey];
      if (id === parentId || ids.indexOf(parentId) === -1) {
        item.children = item.children || [];
        roots.push(copy ? Object.assign({}, item) : item);
      }
    });
    let fn = function(roots) {
      roots.forEach(function(value) {
        var res = [];
        list.forEach(item => {
          if (item[parentKey] === value[idKey]) {
            res.push(copy ? Object.assign({}, item) : item);
          }
        });
        if (res.length >= 1) {
          value.children = res;
          fn(value.children);
        }
      });
    };
    fn(roots);
    return roots;
  },

  /**
   * 下载文件
   * @param {*} url 请求地址
   * @param {*} sendData 请求参数
   */
  download(url, sendData, { method } = {}, fastFile) {
    sendData = sendData || {};
    // 创建表单
    var form = document.createElement('form');
    form.target = '_blank';
    form.method = method || 'POST';
    form.action = (fastFile || process.env.VUE_APP_BASE_API) + url;
    form.style.display = 'none'; // 隐藏
    // 表单元素
    var createInput = function(key, value) {
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      return input;
    };
    // 循环添加参数元素
    if (typeof sendData === 'object') {
      for (const key in sendData) {
        const value = sendData[key];
        if (Array.isArray(value)) {
          value.forEach(item => {
            form.appendChild(createInput(key, item));
          });
        } else {
          form.appendChild(createInput(key, value));
        }
      }
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  },
  /**
   * html转text文本
   * @param {string} html html代码
   */
  html2text(html) {
    if (typeof html !== 'string') return '';
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.innerText;
  },
  /**
   * 字符串转数组
   * @param {string} str 字符串
   * @param {string} splitChar 分割字符
   * @returns {Array}
   */
  string2array(str, splitChar = ',') {
    // 不是字符串返回空数组
    if (!str || typeof str !== 'string') return [];
    return str.split(',');
  },
  /**
   * 下载 excel 文件
   * @param { Bolb} content 文件内荣
   * @param {string} fileName 文件名称
   * @returns void
   */
  downLoadBlob(content, fileName) {
    const blob = new Blob([content], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

Vue.prototype.$util = utils;
window.$util = utils;
export default utils;
