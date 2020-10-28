import axios from 'axios';
import qs from 'qs';
import { _get, _post, _delete, _put } from './index';

/**
 * 查询外部人员
 * @param params
 */
export const find = (params) => {
    return _get({
        url: 'rest/innerUser/find',
        data: params
    });
};

/**
 * 获取用户详细信息
 * @param params
 */
export const get = (params) => {
    return _get({
        url: 'rest/innerUser/get',
        data: params
    });
};

/**
 * 禁用用户
 * @param params 
 */
export const disable = (params) => {
    return axios({
        method: 'post',
        url: 'rest/innerUser/disable',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 保存用户信息
 * @param params 
 */
export const update = (params) => {
    return axios({
        method: 'post',
        url: 'rest/innerUser/update',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 获取公共角色与私有角色集合
 * @param params
 */
export const findRoles = (params) => {
    return _get({
        url: 'rest/innerUser/findRoles',
        data: params
    });
};