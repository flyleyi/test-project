const config = {
  system: 'demo', //默认使用系统标识，建议以项目名命名
  ajaxFilterSave: undefined, //保存【筛选项/显示列】数据的接口，回参为数组
  ajaxFilterQuery: undefined //查询【筛选项/显示列】数据的接口，回参为数组
};
function getConfig() {
  return config;
}
function setConfig(params) {
  Object.assign(config, params);
}
export { setConfig, getConfig };
