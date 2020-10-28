import axios from 'axios';
import qs from 'qs';
import { _get, _post, _delete, _put } from './index';

/**
 * 查询系统列表
 * @param params
 */
export const findSystemList = (params) => {
    return _get({
        url: 'rest/systemPage',
        data: params
    });
};


/**
 * 禁用系统
 * @param params
 */
export const disableSystemByIdList = (params) => {
    return _delete({
        url: 'rest/systemInfo',
        data: params
    });
};

/**
 * 添加系统
 * @param params
 */
export const addSystem = (params) => {
    return _post({
        url: 'rest/system',
        data: params
    });
};

/**
 * 修改系统
 * @param params
 */
export const editSystem = (params) => {
    return _put({
        url: 'rest/system',
        data: params
    });
};


/**
 * 获取系统信息
 * @param params
 */
export const getSystemInfo = (params) => {
    return _get({
        url: `rest/systemInfo/${params.systemId}`,
    });
};

// /**
//  * 获取用户详细信息
//  * @param params
//  */
// export const get = (params) => {
//     return _get({
//         url: 'rest/outerUser/get',
//         data: params
//     });
// };
//
// /**
//  * 禁用用户
//  * @param params
//  */
// export const disable = (params) => {
//     return axios({
//         method: 'post',
//         url: 'rest/outerUser/disable',
//         data: qs.stringify(params, { arrayFormat: 'brackets' })
//     });
// };
//
// /**
//  * 保存用户信息
//  * @param params
//  */
// export const save = (params) => {
//     return axios({
//         method: 'post',
//         url: 'rest/outerUser/save',
//         data: qs.stringify(params, { arrayFormat: 'brackets' })
//     });
// };
//
// /**
//  * 根据经销商名称模糊搜索
//  * @param params
//  */
// export const findDealer = (params) => {
//     return _get({
//         url: 'rest/outerUser/findDealer',
//         data: params
//     });
// };
//
// /**
//  * 查询用户所属角色
//  * @param params
//  */
// export const getRoles = (params) => {
//     return _get({
//         url: 'rest/outerUser/getRoles',
//         data: params
//     });
// };
//
// /**
//  * 获取公用角色列表
//  * @param params
//  */
// export const findRoles = (params) => {
//     return _get({
//         url: 'rest/outerUser/findRoles',
//         data: params
//     });
// };
//
// /**
//  * 根据组织ID获取组织全名
//  * @param params
//  */
// export const getFullOrgName = (params) => {
//     return _get({
//         url: 'rest/org/getFullOrgName',
//         data: params
//     });
// };