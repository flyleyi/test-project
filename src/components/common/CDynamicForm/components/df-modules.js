// 动态加载组件模块
const FILES = require.context('.', false, /Df\w+\.vue$/);

let modules = {};
FILES.keys().forEach(file => {
  let module = FILES(file);
  module = module.default || module;
  modules[module.name] = module;
});

export default modules;
