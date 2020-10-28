import { _get, _post, _delete, _put } from './index';

/**
 * 获取左侧栏列表
 * @param params
 */
export const getDataTree = (params) => {
    return _get({
        url: `basicData/tree`,
        data: params
    });
};

/**
 * 获取父表格
 * @param params (basicId,page,row)
 */
export const getPage = (params) => {
    return _get({
        url: `basicData/page?page=1&rows=50`,
        data: params
    });
};

/**
 * 获取具体表格
 * @param params (basicId,page,row)
 */
export const getDetailPage = (params) => {
    return _get({
        url: `basicData/detailPage`,
        data: params
    });
};

/**
 * 创建信息
 * @param params
 */
export const add = (params) => {
    return _post({
        url: `basicData/add`,
        data: params
    });
};

/**
 * 创建信息
 * @param params
 */
export const detailAdd = (params) => {
    return _post({
        url: `basicData/detailAdd`,
        data: params
    });
};

/**
 * 编辑信息
 * @param params
 */
export const detailEdit = (params) => {
    return _post({
        url: `basicData/detailEdit`,
        data: params
    });
};

/**
 * 判断重复编码
 * @param params
 */
export const checkDetailCode = (params) => {
    return _post({
        url: `basicData/checkDetailCode`,
        data: params
    });
};

/**
 * 禁用信息
 * @param params
 */
export const detailDisable = (params) => {
    return _post({
        url: `basicData/detailDisable?ids=`+params,
        // data: params
    });
};

/**
 * 禁用基础数据
 * @param params
 */
export const disableBasicData = (params) => {
    return _post({
        url: `basicData/disable?ids=`+params,
        // data: params
    });
};

/**
 * 编辑基础数据
 * @param params
 */
export const editBasicData = (params) => {
    return _post({
        url: `basicData/edit`,
        data: params
    });
};
