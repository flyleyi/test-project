import { getAreaList, areaMap } from '@/plugins/common/area.js';

/**
 * 查询省数据列表
 */
export function getProvinceList() {
  return getAreaList('province');
}

/**
 * 获取市数据列表
 * @param {*} provinceCode 省编码
 */
export function getCityList(provinceCode) {
  return getAreaList('city', provinceCode);
}

/**
 * 获取区县数据列表
 * @param {*} cityCode 市编码
 */
export function getCountyList(cityCode) {
  return getAreaList('county', cityCode);
}

/**
 * 编码转换名称
 * @param {*} code 编码
 */
export function codeConverterName(code) {
  return areaMap[code];
}
