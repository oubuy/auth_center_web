import { _get, _post, _delete, _put } from './index';
import axios from 'axios';
import qs from 'qs';

/**
 * 同步外部组织到企信
 * @param params
 */
export const syncOrgToQixin = (params) => {
    return axios({
        method: 'post',
        url: 'rest/syncQixin/syncOrgToQixin',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 禁用用户
 * @param params 
 */
export const syncUserToQixin = (params) => {
    return axios({
        method: 'post',
        url: 'rest/syncQixin/syncUserToQixin',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 获取所有组织
 * @param params
 */
export const getAllOrgs = (params) => {
    return _get({
        url: 'rest/syncQixin/getAllOrgs',
        data: params
    });
};

/**
 * 获取企信部门列表
 * @param params
 */
export const getQixinOrgs = (params) => {
    return _get({
        url: 'rest/syncQixin/getQixinOrgs',
        data: params
    });
};

/**
 * 查询用户列表
 * @param params
 */
export const findUsers = (params) => {
    return _get({
        url: 'rest/syncQixin/findUsers',
        data: params
    });
};

/**
 * 查询用户列表
 * @param params
 */
export const getQixinUsers = (params) => {
    return _get({
        url: 'rest/syncQixin/getQixinUsers',
        data: params
    });
};

/**
 * 查询客户列表
 * @param params
 */
export const findCustomer = (params) => {
    return _get({
        url: 'rest/syncCustomer/find',
        data: params
    });
};

/**
 * 获取“客户基本分类”选项
 * @param params
 */
export const listBrowseGroupId = (params) => {
    return _get({
        url: 'rest/syncCustomer/listBrowseGroupId',
        data: params
    });
};

/**
 * 根据“客户基本分类”查询主数据客户信息，并同步到本地数据库
 * @param params
 */
export const syncCustomerToLocal = (params) => {
    return _get({
        url: 'rest/syncCustomer/syncToLocal',
        data: params
    });
};

/**
 * 同步销区经理管辖范围
 * @param params
 */
export const syncSalesMgt = (params) => {
    return _get({
        url: 'rest/syncCustomer/syncSalesMgt',
        data: params
    });
};