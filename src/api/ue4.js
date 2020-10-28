import { _get, _post, _delete, _put } from './index';
import qs from 'qs';

export const ueList=(data)=>{
    let req={
        url:`build-rest/ue4program/page`,
        data
    };
    return _get(req);
};

export const versionInfo=(data)=>{
   let req={
    url:`build-rest/ue4program/get`,
    data
   };
    return _get(req);
};

// 更新保存
export const updateVersion=(data)=>{
    let req={
        url:`build-rest/ue4program/update`,
        data
       };
        return _post(req);
};

// 添加保存
export const addVersion=(data)=>{
   let req={
       url:'build-rest/ue4program/save',
       data
   };
   return _post(req)
};

// 删除
export const deleteVersion=(data)=>{
    let req={
        url:'build-rest/ue4program/delete',
        data: qs.stringify(data, { arrayFormat: 'brackets' })
       
    };
    return _post(req)
}

// 场景管理

// 获取列表
export const getScenceList=(data)=>{
    let req={
        url:'build-rest/ue4scence',
        data
       
    };
    return _get(req);
};

// 新增
export const addSecence=(data)=>{
    let req={
        url:'build-rest/ue4scence/save',
        data
       
    };
    return _post(req);
};

// 获取版本号列表
export const versionList=()=>{
    let req={
        url:'build-rest/ue4scence/versions',
    };
    return _get(req);
}

// 删除
export const secenceDelete=(data)=>{
    let req={
        url:'build-rest/ue4scence/delete',
        data: qs.stringify(data,{ arrayFormat: 'brackets' })
       
    };
    return _post(req)
};

// 删除
export const secenceParamDelete=(data)=>{
    let req={
        url:`build-rest/ue4scence/deleteParam/${data}`,
    };
    return _get(req)
};

// 获取详情
export const getScenceInfo=(data)=>{
    let req={
        url:`build-rest/ue4scence/${data}`,
    };
    return _get(req);
}