//打包忽略文件，提升打包速度
//libary下的key代表生成的文件名，value里的项越多，文件越大
module.exports = {
  library: {
    vue: ["vue", "vue-router", "vuex"],
    others: ["axios", "js-cookie", "lodash"],
  }
};