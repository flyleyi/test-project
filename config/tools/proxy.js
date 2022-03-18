/**
 * 本地接口层代理转发
 */
module.exports = {
  '/rzzp-admin(?=/)': {
    target: 'http://10.10.21.71:8122/rzzp-admin/', // 问卷调查
    changeOrigin: true,
    ws: true
  },
  // 管理端
  '/brand-data-admin(?=/)': {
    target: 'http://10.10.21.174:8082/', // 数据看板
    changeOrigin: true,
    ws: true
  },
  // 用户端
  '/bonus_count_front(?=/)': {
    target: 'http://10.10.21.172:8082/', // 外网地址
    changeOrigin: true,
    ws: true
  },
  // 管理端
  '/bonus_count_admin(?=/)': {
    target: 'http://10.10.21.172:8081/bonus_count_admin/', // 外网地址
    changeOrigin: true,
    ws: true
  },
  '/teacher-admin(?=/)': {
    // target: 'http://campus.hailiangedu.com:8092/', // 外网地址
    target: 'http://10.10.21.107:8092/',
    changeOrigin: true,
    ws: true
  },
  'score(?=/)': {
    target: 'http://10.10.21.118:12280/', // 外网地址
    changeOrigin: true,
    ws: true
  },
  // '/stu(?=/)': {
  //   target: 'http://10.10.21.118:12280/', // 外网地址
  //   changeOrigin: true,
  //   ws: true
  // },
  // '/class(?=/)': {
  //   target: 'http://10.30.5.44:12180/', // 外网地址
  //   changeOrigin: true,
  //   ws: true
  // },
  '/examReport(?=/)': {
    target: 'http://10.30.5.44:12180/', // 外网地址
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/examReport': ''
    }
  },
  '/bskpt-admin(?=/)': {
    target: 'http://campus.hailiangedu.com:8092/', // 外网地址
    changeOrigin: true,
    ws: true
  },
  '/logistical-admin(?=/)': {
    target: 'http://campus.hailiangedu.com:8092/', // 外网地址
    changeOrigin: true,
    ws: true
  },
  '/teacher-admin(?=/)': {
    // target: 'http://campus.hailiangedu.com:8092/', // 外网地址
    target: 'http://10.10.21.107:8092/',
    changeOrigin: true,
    ws: true
  },
  '/growth(?=/)': {
    target: 'http://campus.hailiangedu.com:8092',
    Host: 'campus.hailiangedu.com:8092'
  },
  '/laborcost-api(?=/)': {
    target: 'http://10.10.21.172:8660', // 外网地址
    // target: 'http://192.168.14.6', // 外网地址
    changeOrigin: true,
    ws: true
  },
  '/simsbff(?=/)': {
    target: 'http://10.30.5.34', // 外网地址
    // target: 'http://192.168.14.6', // 外网地址
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/simsbff': '/sims'
    }
  },
  // 学情分析，h5
  '/exam-analysis-front(?=/)': {
    target: 'http://10.30.5.44:17234', // 外网地址
    changeOrigin: true,
    ws: true
  },
  '(?<=/)serve(?=/)': {
    target: 'http://172.17.15.42:8507/' // 外网地址
    // target: 'http://10.10.21.172:8080/',

    // target: 'http://192.168.14.143:8507', // 外网地址
  },
  '/catering-admin(?=/)': {
    target: 'http://10.10.21.119', // 外网地址
    // target: 'http://192.168.14.237:8990', // 外网地址
    changeOrigin: true,
    ws: true
  },
  '/zuul/growth': {
    target: 'http://campus.hailiangedu.com:8092/growth-2'
  },
  '/charity(?=/)': {
    // target: 'http://172.17.15.42:8082/', // 外网地址
    target: 'http://jczx.ehailiang.com:7608', // 外网地址
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/charity': '/api'
    }
  },
  '/pdf(?=/)': {
    target: 'http://172.17.15.42:8001/', // 外网地址
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/pdf': ''
    }
  },
  '/run-school-bible-front': {
    target: 'http://10.10.21.172:8664'
  },
  '/run-school-bible-admin': {
    target: 'http://10.10.21.172:8663'
  },
  '/logistics-data-api(?=/)': {
    // 后勤数据采集
    target: 'http://10.10.21.172:8665',
    // target: 'http://10.10.21.172:8660', // 外网地址
    // target: 'http://192.168.14.6', // 外网地址
    changeOrigin: true,
    ws: true
  },
  '/logistical-front': {
    // target: 'http://115.231.207.6:8098/',
    // target: 'http://campus.hailiangedu.com:8092/',
    target: 'http://10.30.5.34/',
    // target:"http://lms.hailiangedu.com:9093/",//外网地址
    changeOrigin: true,
    ws: true
  },
  // 管理端后端服务器代理配置
  '/logistical-admin': {
    target: 'http://115.231.207.6:8098/',
    changeOrigin: true,
    ws: true
  },
  // 文件服务器
  '/fast-file': {
    // target: 'http://8.136.208.28', // 生产地址
    target: 'http://10.10.21.107', // 测试地址
    changeOrigin: true,
    ws: true,
    headers: {
      // Host: '8.136.208.28'
      Host: '10.10.21.107'
    }
  },
  // pdf预览服务
  '/pdf-preview': {
    // target: 'http://8.136.208.28', // 生产地址
    target: 'http://10.10.21.107', // 测试地址
    changeOrigin: true
  },
  '/k12(?=/)': {
    // target: 'http://8.136.208.28',  //生产
    target: 'http://10.30.5.34',  //测试
    changeOrigin: true,
    ws: true
  },
  '/jx-survey(?=/)': {
    target: 'https://hai.hailiangedu.com/api',  //生产
    // target: 'https://apptest.jxgy.hlliuxue.com/api',  //测试
    secure: false, // 如果是https接口，需要配置这个参数
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/jx-survey': ''
    }
  }
};
