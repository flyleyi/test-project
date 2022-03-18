const API_HOST = {
  //本地环境
  development: {
    //教师管理后台接口
    'teacher-admin': '/teacher-admin',
    'bskpt-admin': '/bskpt-admin',
    'logistical-admin': '/logistical-admin',
    'rzzp-admin': '/rzzp-admin', // 问卷调查H5
    growth: '/growth',
    simsbff: '/simsbff',
    'bonus-be': '/bonus_count_admin',
    'bonus-fe': '/bonus_count_front',
    cater: '/catering-admin',
    'score-analysic-score': '/score',
    'score-analysic-stu': '/stu',
    'score-analysic-class': '/class',
    'executive-serve': '/serve',
    charity: '/charity', // 慈善基金会
    laborcost: '/laborcost-api',
    'school-secret': '/run-school-bible-front',
    'school-book-admin': '/run-school-bible-admin',
    'logistics-data': '/logistics-data-api', // 后勤数据采集
    'brand-data-admin': '/brand-data-admin', //电话热线数据
    examReport: '/exam-analysis-front',
    'teaching-point-mobile': '/k12',
    'teaching-point-mobile-pre': '/k12', //k12-学前
    'cater-h5': '/catering-front', //餐饮系统钉钉
    'logistical-guest': '/logistical-guest', //访客系统钉钉
    'analysis-admin': '/exam-analysis-admin',
    goverServeAdmin: '/gover_serve_admin', //资源共享平台管理端
    goverServeFront: '/gover_serve_front', //用户端
    jlxtAdmin: '/jlxt-admin',
    'exam-analysis-front': '/exam-analysis-front', // 学情分析，h5
    lxtAdmin: '/jlxt-admin',
    'jx-survey-h5': '/jx-survey', // 家校问卷调查，h5
    'hl-homework': 'http://10.30.5.52:8888/api' // 常态化作业
  },
  //新增联调环境
  com: {
    //教师管理后台接口
    'teacher-admin': '//campus.hailiangedu.com:8092/teacher-admin',
    'bskpt-admin': '//campus.hailiangedu.com:8092/bskpt-admin',
    'logistical-admin': '//campus.hailiangedu.com:8092/bskpt-admin',
    growth: '//campus.hailiangedu.com:8092/growth',
    simsbff: '//10.30.5.37:8080/sims',
    'bonus-be': '/bonus_count_admin',
    'bonus-fe': '/bonus_count_front',
    cater: '/catering-admin',
    'score-analysic-score': 'http://10.10.21.118:12280/score',
    'score-analysic-stu': 'http://10.10.21.118:12280/stu',
    'score-analysic-class': 'http://10.10.21.118:12280/class',
    'rzzp-admin': 'http://test.hailiangedu.com:81/rzzp-admin', // 问卷调查H5
    'executive-serve': '/serve',
    charity: 'http://cs.hailiangedu.com:8766/csgl', // 慈善基金会
    laborcost: '/laborcost-api',
    'school-secret': '/run-school-bible-front',
    'school-book-admin': '/run-school-bible-admin',
    'brand-data-admin': '/brand-data-admin', //电话热线数据
    'logistics-data': '/logistics-data-api', // 后勤数据采集
    'teaching-point-mobile': '//10.10.21.107/k12',
    'teaching-point-mobile-pre': '/k12', //k12-学前
    'cater-h5': '/catering-front', //餐饮系统钉钉
    'logistical-guest': '/logistical-guest', //访客系统钉钉
    'analysis-admin': '/exam-analysis-admin',
    goverServeAdmin: '/gover_serve_admin',
    goverServeFront: '/gover_serve_front',
    jlxtAdmin: '/jlxt-admin',
    'hl-homework': 'http://10.30.5.52:8888/api' // 常态化作业
  },
  //测试环境
  sit: {
    //教师管理后台接口
    'teacher-admin': '//10.10.21.107:8092/teacher-admin',
    'bskpt-admin': '//campus.hailiangedu.com:8092/bskpt-admin',
    'logistical-admin': '//campus.hailiangedu.com:8092/bskpt-admin',
    growth: '//campus.hailiangedu.com:8092/growth',
    simsbff: '//10.30.5.35:8080/sims',
    'bonus-be': '/bonus_count_admin',
    'bonus-fe': '/bonus_count_front',
    cater: '/catering-admin',
    'executive-serve': '/serve',
    'score-analysic-score': 'http://10.10.21.174:12280/score',
    'score-analysic-stu': 'http://10.10.21.174:12280/stu',
    'score-analysic-class': 'http://10.10.21.174:12280/class',
    'rzzp-admin': 'http://test.hailiangedu.com:81/rzzp-admin', // 问卷调查H5
    charity: 'http://cs.hailiangedu.com:8766/api', // 慈善基金会
    laborcost: '/laborcost-api',
    'school-secret': '/run-school-bible-front',
    'school-book-admin': '/run-school-bible-admin',
    'logistics-data': '/logistics-data-api', // 后勤数据采集
    'brand-data-admin': '/brand-data-admin', //电话热线数据
    examReport: '/exam-analysis-front',
    'teaching-point-mobile': '/k12',
    'teaching-point-mobile-pre': '/k12', //k12-学前
    'cater-h5': '/catering-front', //餐饮系统钉钉
    'logistical-guest': '/logistical-guest', //访客系统钉钉
    'analysis-admin': '/exam-analysis-admin',
    goverServeAdmin: '/gover_serve_admin',
    goverServeFront: '/gover_serve_front',
    jlxtAdmin: '/jlxt-admin',
    'jx-survey-h5': 'https://haih5.jxgy.hlliuxue.com/jxgyapptest/api', // 家校问卷调查，h5
    'hl-homework': 'http://10.30.5.66:8888/api', // 常态化作业
    'exam-analysis-front': '/exam-analysis-front' // 学情分析，h5
  },
  //生产环境
  production: {
    //教师管理后台接口
    'teacher-admin': '//integral-admin.hailiangedu.com/teacher-admin',
    'bskpt-admin': '//campus.hailiangedu.com:8092/bskpt-admin',
    'logistical-admin': '//campus.hailiangedu.com:8092/bskpt-admin',
    growth: '//campus.hailiangedu.com:8092/growth',
    cater: '//i.hailiangedu.com/catering-admin',
    'bonus-be': '/bonus_count_admin',
    'bonus-fe': '/bonus_count_front',
    'executive-serve': '/serve',
    simsbff: '/sims',
    'score-analysic-score': 'http://10.10.21.174:12280/score',
    'score-analysic-stu': 'http://10.10.21.174:12280/stu',
    'score-analysic-class': 'http://10.10.21.174:12280/class',
    'rzzp-admin': 'http://test.hailiangedu.com:81/rzzp-admin', // 问卷调查H5
    charity: '/api', // 慈善基金会
    laborcost: '//i.hailiangedu.com/laborcost-api',
    'school-secret': '/run-school-bible-front',
    'school-book-admin': '/run-school-bible-admin',
    'logistics-data': '//i.hailiangedu.com/logistics-data-api', // 后勤数据采集
    'brand-data-admin': '//i.hailiangedu.com/brand-data-admin', //电话热线数据
    examReport: '/exam-analysis-front',
    'exam-analysis-front': '/exam-analysis-front', //学情分析h5
    'teaching-point-mobile': '//8.136.208.28/k12',
    'teaching-point-mobile-pre': '/k12', //k12-学前
    'cater-h5': '/catering-front', //餐饮系统钉钉
    'logistical-guest': '/logistical-guest', //访客系统钉钉
    'analysis-admin': '/exam-analysis-admin',
    goverServeAdmin: '/gover_serve_admin',
    goverServeFront: '/gover_serve_front',
    jlxtAdmin: '/jlxt-admin',
    'jx-survey-h5': 'https://hai.hailiangedu.com/api', // 家校问卷调查，h5
    'hl-homework': 'http://10.30.5.52:8888/api' // 常态化作业
  }
};

// 当前的api配置
let api = API_HOST[process.env.NODE_ENV] || API_HOST['production'];

export default api;

/**
 * 设置服务器地址
 * @param {string} serverCode 服务code
 * @param {string} url 服务器地址
 */
export function setUrl(serverCode, url) {
  api[serverCode] = url;
}

/**
 * 获取服务器地址
 * @param {string} serverCode 服务code
 * @return {string}
 */
export function getUrl(serverCode) {
  return api[serverCode];
}
