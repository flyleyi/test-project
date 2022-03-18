import Cookies from 'js-cookie';
import api, { setUrl } from '@/plugins/common/api';

/**
 * @type {string}
 * @description 默认服务器地址
 */
const DEFAULT_API = { ...api };

/**
 * @type {string}
 * @description 服务器地址cookie键值
 */
const COOKIE_API_URL_KEY = 'COOKIE_API_URL_KEY';

/**
 * 存储到cookie中
 * @param {string} serverCode 服务code
 * @param {string} url 服务器地址
 */
function setCache(serverCode, url) {
  if (serverCode == undefined) throw new Error('缺少serverCode参数');
  let json = getCacheJSON();
  json[serverCode] = url;
  Cookies.set(COOKIE_API_URL_KEY, json);
}

/**
 * 获取缓存json对象
 * @param {string} serverCode 服务code
 */
function getCache(serverCode) {
  let json = getCacheJSON();
  if (serverCode == undefined) return json;
  return json && json[serverCode];
}

/**
 * 获取缓存json对象
 * @param {string} serverCode 服务code
 */
function clearCache(serverCode) {
  // 没传serverCode清除全部
  if (serverCode == undefined) {
    Cookies.remove(COOKIE_API_URL_KEY);
    return;
  }
  let json = getCacheJSON();
  delete json[serverCode];
  Cookies.set(COOKIE_API_URL_KEY, json);
}

/**
 * 获取缓存json对象
 * @return {Object}
 */
function getCacheJSON() {
  let json = Cookies.getJSON(COOKIE_API_URL_KEY);
  typeof json !== 'object' && (json = {});
  return json;
}

/**
 * 设置服务器地址
 * @param {string} serverCode 服务code
 * @param {string} url 服务器地址
 */
export function setServerUrl(serverCode, url) {
  if (serverCode == undefined) throw new Error('缺少serverCode参数');
  let defaultUrl = getServerDefaultUrl(serverCode); // 默认地址
  setCache(serverCode, url || defaultUrl);
  setUrl(serverCode, url || defaultUrl);
}

/**
 * 获取服务器地址
 * @param {string} serverCode 服务code
 * @return {string}
 */
export function getServerUrl(serverCode) {
  let defaultUrl = getServerDefaultUrl(serverCode); // 默认地址
  return getCache(serverCode) || defaultUrl;
}

/**
 * 获取默认服务器地址
 * @param {string} serverCode 服务code
 * @return {string}
 */
export function getServerDefaultUrl(serverCode) {
  if (serverCode == undefined) return DEFAULT_API;
  return DEFAULT_API && DEFAULT_API[serverCode];
}

/**
 * 清除服务器地址
 * @param {string} serverCode 服务code
 */
export function clearServerUrl(serverCode) {
  clearCache(serverCode);
  setUrl(serverCode, getServerDefaultUrl(serverCode));
}

/**
 * 初始化服务器地址
 */
export function initServerUrl() {
  let json = getServerUrl();
  Object.keys(json).forEach(key => {
    setUrl(key, json[key]);
  });
}
