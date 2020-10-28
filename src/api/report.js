import axios from 'axios';
import qs from 'qs';
import { _get, _post, _delete, _put } from './index';

/**
 * 查询案例点击数排名
 * @param params
 */
export const querySpaceHits = (params) => {
  return _get({
      url: '/rest/reportTvWeb/querySpaceHits',
      data: params
  });
};

/**
 * 查询产品点击数排名
 * @param params
 */
export const queryProductHits = (params) => {
  return _get({
      url: '/rest/reportTvWeb/queryProductHits',
      data: params
  });
};


/**
 * 查询楼盘访问量排名
 * @param params
 */
export const queryBuildingHits = (params) => {
  return _get({
      url: '/rest/reportTvWeb/queryBuildingHits',
      data: params
  });
};

/**
 * 查询户型访问量排名
 * @param params
 */
export const queryBuildingModelHits = (params) => {
  return _get({
      url: '/rest/reportTvWeb/queryBuildingModelHits',
      data: params
  });
};

/**
 * 查询门店活跃度排行
 * @param params
 */
export const queryStoreActivity = (params) => {
  return _get({
      url: '/rest/reportTvWeb/queryStoreActivity',
      data: params
  });
};
