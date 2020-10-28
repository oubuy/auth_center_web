import { _get, _post, _delete, _put } from './index';
import qs from 'qs';

export const versionList=(data)=>{
    let req={
        url:`rest/version/page`,
        data
    };
    return _get(req);
};

export const versionInfo=(data)=>{
   let req={
    url:`rest/version/get`,
    data
   };
    return _get(req);
};

// 更新保存
export const updateVersion=(data)=>{
    let req={
        url:`rest/version/update`,
        data
       };
        return _post(req);
};

// 添加保存
export const addVersion=(data)=>{
   let req={
       url:'rest/version/save',
       data
   };
   return _post(req)
};

// 删除
export const deleteVersion=(data)=>{
    let req={
        url:'rest/version/delete',
        data: qs.stringify(data, { arrayFormat: 'brackets' })
    };
    return _post(req)
}

// 下载
export const getLatest=(data)=>{
    let req={
        url:`rest/version/getLatest?arch=${data.arch}`,
    };
    return _get(req)
};

export const getUpdate=(data)=>{
    let req={
        url:`rest/version/latestByThree?arch=${data.arch}`,
    };
    return _get(req)
};
