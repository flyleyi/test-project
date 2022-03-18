import _ from 'lodash';
/**
 * 表单项属性合并，返回新的表单项列表
 * @param { Array } target 目标合并表单项列表
 * @param { Array } origin 源合并表单项列表
 * @return { Array }
 */
export function formItemsMergeOptions(target, origin) {
  const newFormItems = target.slice(0); // 克隆源属性
  // list转map索引查找，用空间换时间减低时间复杂度
  const map = target.reduce((map, value, index) => {
    map[value.prop] = index;
    return map;
  }, {});
  origin.forEach(originItem => {
    if (!originItem.prop) throw new Error('缺少prop属性');
    let index = map[originItem.prop];
    if (index == undefined) return;
    let targetItem = target[index];
    newFormItems.splice(index, 1, mergeOptions(targetItem, originItem));
  });
  return newFormItems;
}

/**
 * 属性存在覆盖，不存在新增
 * 表单项属性
 *	 - label 名称
 *	 - prop 字段名
 *	 - type 组件类型
 *	 - defaultValue 默认值
 *	 - rules 校验规则
 *	 - attrs 表单元素属性
 * @param { Object } target 目标合并表单项列表
 * @param { Object } origin 源合并表单项列表
 */
function mergeOptions(target, origin) {
  let keys = Object.keys(target).concat(Object.keys(origin));
  let newObj = {};
  keys.forEach(key => {
    let isHasTarget = _.has(target, key);
    let isHasOrigin = _.has(origin, key);
    let targetValue = target[key];
    let originValue = origin[key];
    let targetType = typeof targetValue;
    let originType = typeof originValue;
    if (targetValue && originValue && targetType !== originType) {
      throw new Error(key + '字段类型不一致');
    }
    if (isHasTarget && isHasOrigin) {
      if (key === 'rules') {
        newObj[key] = originValue;
      } else if (
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        // 对象类型，递归合并
        newObj[key] = mergeOptions(targetValue, originValue);
      } else {
        // 基本数据类型和数组取origin
        newObj[key] = originValue;
      }
    } else {
      // target或者origin存在
      newObj[key] = isHasTarget ? targetValue : originValue;
    }
  });
  return newObj;
}
