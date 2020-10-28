import { _get, _post, _delete, _put } from './index';

/**
 * 新增公告
 * @param params 
 */
export const add = (params) => {
    return _post({
        url: `rest/notice/add`,
        data: params
    });
};

/**
 * 获取公告列表
 * @param params
 */
export const announcementList = (params) => {
    return _get({
        url: `rest/notice/getStateList`,
        data: params
    });
};

/**
 * 编辑公告
 * @param params
 */
export const modityAnnouncement = (params) => {
    return _post({
        url: `rest/notice/modity`,
        data: params
    });
};

/**
 * 删除公告
 * @param params
 */
export const deleteAnnouncement = (params) => {
    return _post({
        url: `rest/notice/delete`,
        data: params
    });
};

/**
 * 登录获取公告
 * @param params
 */
export const getByChannel = (params) => {
    return _get({
        url: `rest/notice/getByChannel`,
        data: params
    });
};