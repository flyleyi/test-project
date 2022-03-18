// FILES 拥有id, keys, resolve
const FILES = require.context('.', false, /v-.+\.js$/); // 语法: require.context(directory, useSubdirectories = false, regExp = /^.//);
// console.log(FILES.id); // ./src/pages/tmp/components/modules sync \.vue$
// console.log(FILES.keys()); //  返回文件对应的key数组 ["./Picture.vue", "./SetPicture.vue"]
// console.log(FILES.resolve(FILES.keys()[0])); // 返回相对项目的路径 ./src/pages/tmp/components/modules/Picture.vue
let allModules = [];
FILES.keys().forEach(key => {
  let module = FILES(key); // 返回es module
  // let moduleName = module.default.name; // 获取vue模块定义的name
  allModules.push(module.default || module);
});
// console.log(allModules);
// console.log(notSetModules);
export { allModules };
