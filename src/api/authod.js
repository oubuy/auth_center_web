import {
  _get,
  _post,
  _delete,
  _put
} from './index';

// 获取左侧的tree列表数据
export const permissionTree = (data) => {
  let req = {
    url: `rest/permissionTree`,
    data
  };
  return _get(req)
};

// 获取系统组织
export const systemList = (data) => {
  let req = {
    url: `rest/systemList`,
    data
  };
  return _get(req);
};

// 新建左侧权限
export const addLeftPermission = (data) => {
  let req = {
    url: `rest/permission`,
    data
  };
  return _post(req);
};

// 删除权限
export const deletePermission=(data)=>{
   let req={
       url:`rest/permission`,
       data
   };
   return _delete(req);
};

// 获取权限信息
export const getPermissionInfo=(data)=>{
    let req={
        url:`/rest/permissionInfo/${data.permissionId}`
    }
    return _get(req)
};

// 编辑更新
export const editPermission=(data)=>{
   let req={
       url:`rest/permission`,
       data
   };
   return _put(req);
}

// 获取下级列表（右侧table）
export const getPermissionTable=(data)=>{
      let req={
          url:`rest/permissionPage`,
          data
      };
      return _get(req)
}