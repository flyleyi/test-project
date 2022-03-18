import url from 'url';
import { setToken } from './auth.js';
// 单点登录
// 入口地址查询
try {
  const pathReg = /\/sso\/auth$/;
  // 符合单点登录授权地址
  const data = url.parse(location.href, true);
  if (
    pathReg.test(location.pathname) &&
    data.query &&
    data.query.Authorization
  ) {
    const query = Object.assign({}, data.query);
    delete query.Authorization;
    window.location.search = url.format({
      query
    }); // 删除query参数
    if (data.query && data.query.Authorization)
      setToken(data.query.Authorization);
  }
} catch (error) {
  console.error(error);
}
