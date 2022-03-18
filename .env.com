CDN_URL=//hlmp-test.oss-cn-hangzhou.aliyuncs.com/web/mutilwap_com

#用于生产部署页面访问公共路径，如/wap/；路由设置base路径
VUE_APP_PUBLIC_PATH=/wap/

#指定运行页面：默认全部(可指定page运行，逗号隔开) demo h5 pc sims
RUN_PAGE=

#指定编译页面：必须指定，一次只能指定一个 [src/pages/...下目录名]；也可通过指令指定，如cross-env page=demo vue-cli-service build
BUILD_PAGE=

NODE_ENV=com