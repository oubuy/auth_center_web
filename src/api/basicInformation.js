import { _get, _post, _delete,_put } from './index';

// 获取基本信息
export const getBasicInfoData = (data) => {
    let req = {
        url: `rest/dealerBaseInfo`
    }
    return _get(req);
   
};

//更新经销商基本信息
export const updateBasic=(data)=>{
    let req = {
        data,
        url: `rest/dealerBaseInfo`
    };
    return _put(req);
}