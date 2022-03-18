/**
 * 查看结果接口文件
 */
import axios from '../plugins/axios.js';

export function getTableData() {
  return axios.get('/applyGuide/SBZNManage', null, 'teacher-admin');
}

/**
 * 获取实时申报-信息列表查询列表
 */
export function getTableData2(queryParams) {
  return axios.get(
    '/awardInfo/nowAwardInfos',
    {
      params: queryParams
    },
    'teacher-admin'
  );
}
