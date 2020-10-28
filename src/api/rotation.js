import axios from 'axios';
import qs from 'qs';
import { _get, _post, _delete, _put } from './index';


/**
 * 列表
 * @param params
 */
export const getBannerList= (params) => {
    return _get({
        url: 'rest/banner/page',
        data: params
    });
};
// 禁用 true启用，false禁用
export const enabledRotation=(data)=>{
    let req={
        url:`rest/banner/enabled`,
        data
    }
    return _post(req)
}

// 保存
export const saveRotation=(data)=>{
    let req={
        url:`rest/banner/save`,
        data
    }
    return _post(req)
}
//详情
export const getBannerInfo= (params) => {
    return _get({
        url: 'rest/banner/find',
        data: params
    });
};

// 删除
export const deleteRotation=(data)=>{
    let req={
        url:`rest/banner/delete`,
        data
    }
    return _post(req)
}