import axios from 'axios';
import qs from 'qs';
import { _get, _post, _delete, _put } from './index';
/**
 * 查询系统列表
 * @param params
 */
export const findLicenseList = (params) => {
    return _get({
        url: 'rest/license/licenses',
        data: params
    });
};

/**
 * 禁用许可证号
 * @param params
 */
export const disableLicenseByIdList = (params) => {
    return _delete({
        url: 'rest/license/licenses',
        data: params
    });
};

/**
 * 添加许可证号
 * @param params
 */
export const addLicense = (params) => {
    return _post({
        url: 'rest/license/add',
        data: params
    });
};

/**
 * 修改许可证
 * @param params
 */
export const updateLicense = (params) => {
    return _put({
        url: 'rest/license/licenses',
        data: params
    });
};
/**
 * 重置生效时间
 * @param params
 */
export const saveBeginEndTime = (params) => {
    return _put({
        url: 'rest/license/updateBeginEndTime',
        data: params
    });
};
/**
 * 查询用户权限
 * @param params
 */
export const checkPermission = (params) => {
    return _get({
        url: 'rest/license/checkPermission',
        data: params
    });
};
/**
 * 重置（反激活）许可证号
 * @param params
 */
export const resetActivated = (params) => {
    return _put({
        url: 'rest/license/resetActivated',
        data: params
    });
};
/**
 * 获取许可证号信息
 * @param {*} params 
 */
export const getLicenseInfo = (params) => {
    return _get({
        url: `rest/license/detail/${params.licenseCode}`,
    });
};