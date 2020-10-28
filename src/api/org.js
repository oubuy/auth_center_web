import { _get, _post, _delete, _put } from './index';

/**
 * 获取组织详细信息
 * @param params
 */
export const getOrg = (params) => {
    return _get({
        url: 'rest/org/getOrg',
        data: params
    });
};

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
 * 获取直属下级组织列表
 * @param params
 */
export const findDirectSubs = (params) => {
    return _get({
        url: 'rest/org/findDirectSubs',
        data: params
    });
};

/**
 * 获取组织树状列表信息
 * @param params
 */
export const getOrgTree = (params, type) => {
    var urlTemp;
    if (type == 'outer') {
        urlTemp = 'rest/outerOrgTree';
    } else if (type == 'userOuter') {
        urlTemp = 'rest/userOuterOrgTree';
    } else {
        urlTemp = 'rest/innerOrgTree';
    }

    return _get({
        url: urlTemp,
        data: params
    });
};



