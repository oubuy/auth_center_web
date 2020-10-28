import { _get, _post, _delete,_put } from './index';

// 获取省
export const province=(data)=>{
    let req={
        url:`/rest/province`,
        data
    };
    return _get(req);
};

export const city=(data)=>{
    let req={
        url:`/rest/city/${data.provinceId}`,
    };
    return _get(req);
};

export const area=(data)=>{
    let req={
        url:`/rest/area/${data.cityId}`,
    };
    return _get(req);
};

