import Cookies from 'js-cookie';

const TokenKey = 'Authorization';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function getUserName() {
  return Cookies.get('UserName');
}

export function setUserName(name) {
  return Cookies.set('UserName', name);
}

export function getUserId() {
  return Cookies.get('UserId');
}
export function setUserId(name) {
  return Cookies.set('UserId', name);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
