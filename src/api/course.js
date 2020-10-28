import axios from 'axios';
import qs from 'qs';
import { _get, _post, _delete, _put } from './index';

/**
 * 查询系统列表
 * @param params
 */
export const findMenuList = (params) => {
    return _get({
        url: 'rest/course/list',
        data: params
    });
};
/**
 * 根据菜单ID获取菜单全名
 * @param params
 */
export const getFullMenuName = (params) => {
    return _get({
        url: 'rest/getFullMenuName',
        data: params
    });
};
// 获取所属系统
export const menuSystemName=(data)=>{
    let req={
        url:`rest/menuSystemName`,
        data
    };
    return _get(req)
};
// 更新保存
export const updateCourse=(data)=>{
    let req={
        url:`rest/course/update`,
        data
       };
        return _post(req);
};

// 添加保存
export const addCourse=(data)=>{
   let req={
       url:'rest/course/save',
       data
   };
   return _post(req)
};

export const courseInfo=(data)=>{
    let req={
     url:`rest/course/get`,
     data
    };
     return _get(req);
 };

 // 编辑章节
 export const editChapter=(data)=>{
    let req={
     url:`rest/course/saveChapter`,
     data
    };
     return _post(req);
 };

 // 删除章节
 export const deleteChapter=(data)=>{
    let req={
     url:`rest/course/deleteChapter?chapterId=${data.chapterId}`,
     data
    };
     return _post(req);
 };

 // 编辑附件
 export const saveAttachment=(data)=>{
    let req={
     url:`rest/course/saveAttachment`,
     data
    };
     return _post(req);
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
 * 获取许可证号信息
 * @param {*} params 
 */
export const getLicenseInfo = (params) => {
    return _get({
        url: `rest/license/${params.licenseCode}`,
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

