import axios from 'axios';
import qs from 'qs';
import { _get, _post, _delete, _put } from './index';

/**
 * 查询外部人员
 * @param params
 */
export const find = (params) => {
    return _get({
        url: 'rest/outerUser/find',
        data: params
    });
};

/**
 * 获取用户详细信息
 * @param params
 */
export const get = (params) => {
    return _get({
        url: 'rest/outerUser/get',
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
        url: 'rest/outerUser/disable',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 保存用户信息
 * @param params 
 */
export const save = (params) => {
    return axios({
        method: 'post',
        url: 'rest/outerUser/save',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 根据经销商名称模糊搜索
 * @param params
 */
export const findDealer = (params) => {
    return _get({
        url: 'rest/outerUser/findDealer',
        data: params
    });
};

/**
 * 查询用户所属角色
 * @param params
 */
export const getRoles = (params) => {
    return _get({
        url: 'rest/outerUser/getRoles',
        data: params
    });
};

/**
 * 获取公用角色列表
 * @param params
 */
export const findRoles = (params) => {
    return _get({
        url: 'rest/outerUser/findRoles',
        data: params
    });
};

// 通过组织id获取角色
export const findRolesByOrgId=(data)=>{
    let req={
        url:'rest/outerUser/findRolesByOrgId',
        data
    }
    return _get(req)
  }

/**
 * 根据组织ID获取组织全名
 * @param params
 */
export const getFullOrgName = (params) => {
    return _get({
        url: 'rest/org/getFullOrgName',
        data: params
    });
};

/**
 * 禁用用户
 * @param params 
 */
export const resetPassword = (params) => {
    return axios({
        method: 'post',
        url: 'rest/outerUser/resetPassword',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 根据角色ID集合查询角色权限
 * @param params 
 */
export const findRolePermissions = (params) => {
    return axios({
        method: 'post',
        url: 'rest/outerUser/findRolePermissions',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};
/**
 * 查询用户权限
 * @param params
 */
export const checkPermission = (params) => {
    return _get({
        url: 'rest/checkPermission',
        data: params
    });
  };