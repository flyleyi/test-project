/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 验证身份证号
 * @param {number} number
 */
export function checkIdCard(number) {
  var len = number.length;
  if (len !== 18) {
    return false;
  }
  // 校验字符串
  if (
    !/(^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/.test(
      number
    )
  )
    return false;

  var a = number.split('');
  var w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];

  var c = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];

  var sum = 0;
  for (var i = 0; i < 17; i++) {
    sum += a[i] * w[i];
  }
  var r = sum % 11;
  var res = c[r];
  return res == a[17];
}

/**
 * 联系方式（手机、座机）校验
 * @param {*} str 字符串
 * @return {Boolean}
 */
export function validTel(str) {
  if (!str) return true;
  return /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(str);
}

/**
 * 校验数字/字母组合
 * @param {String} value 要校验的值
 * @return {Boolean}
 */
export function validAlphaAndNum(value) {
  return /^[a-zA-Z0-9]*$/.test(value);
}

/**
 * 校验通用名称
 * @param {String} str 字符串
 * @return {Boolean}
 */
export function validCommonName(str) {
  return /^[a-zA-Z0-9\u2E80-\uFE4F\s]*$/.test(str);
}

/**
 * 校验数据前后发生变化（null/undefined互转时不视作变化）
 * 主作用域表单填写前后判断数据是否变更
 * @param {Object} originData 原始数据 作为比较项，遍历所有key做一一对比
 * @param {Object} targetData 目标数据 用来与原始数据做对比
 */
export function validDataNotChange(originData, targetData) {
  let result = true;
  //比较项目至少其中一项为空，则进入判断，若取boolean判断相同，则认为相同（空字符串与undefined）
  if (!originData || !targetData) {
    return !originData == !targetData;
  }
  //比较项均不为空，并且不是object类型，直接比较结果
  if (typeof originData != 'object') {
    return originData == targetData;
  }
  //数组类型时，优先判断长度是否相同
  if (Array.isArray(originData)) {
    try {
      if (originData.length != targetData.length) {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  //object类型遍历key校验
  for (let key in originData) {
    let originValue = originData[key];
    let targetValue = targetData[key];
    //遍历项为object类型，递归处理
    if (typeof originValue == 'object') {
      let res = validDataNotChange(originValue, targetValue);
      if (!res) {
        console.log('compare-obj-' + key, originValue, targetValue, false);
        result = false;
        break;
      }
    } else if (originValue && targetValue && originValue != targetValue) {
      console.log('compare-' + key, originValue, targetValue, false);
      //比较项目均有值
      result = false;
      break;
    } else if ((!originValue || !targetValue) && !originValue != !targetValue) {
      console.log('compare-' + key, originValue, targetValue, false);
      //其中至少有一项不存在在值，则取boolean作比较
      result = false;
      break;
    }
    console.log('compare-' + key, originValue, targetValue, true);
  }
  return result;
}
