/** saas单点登录 */
import url from 'url';
import { setToken } from './auth.js';
import Cookie from 'js-cookie';
// 其他存储参数
const otherParams = ['appId', 'schoolId', 'staffId', 'tenantId', 'orgId'];
// 单点登录
// 入口地址查询
try {
  const { query } = url.parse(location.href, true);
  const { Authorization } = query;
  if (Authorization) {
    // 记录令牌
    setToken(Authorization);
    // 清除登陆令牌
    delete query.Authorization;
    // 存储其他登陆信息
    otherParams.forEach(key => {
      const value = query[key];
      if (value) {
        Cookie.set(key, value);
      }
      delete query[key];
    });
    history.replaceState(
      null,
      null,
      `${location.href.split('?')[0]}${url.format({
        query
      })}`
    );
  }
} catch (error) {
  console.error(error);
}
