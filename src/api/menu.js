import { _get, _post, _delete,_put } from './index';


// 获取左侧tree
export const menuTree=(data)=>{
  let req={
      url:`rest/menuTree`,
      data
  };
  return _get(req)
};

// 获取右侧对应的table
export const menuPage=(data)=>{
  let req={
      url:`rest/menuPage`,
      data
  };
  return _get(req)
};

// 获取所属系统
export const systemList=(data)=>{
    let req={
        url:`rest/menuSystemName`,
        data
    };
    return _get(req)
};

// 获取功能名字
export const menuPermissionName=(data)=>{
 let req={
     url:`rest/menuPermissionName`,
     data
 };
 return _get(req)
};

// 新增菜单
export const addMenu=(data)=>{
  let req={
      url:`rest/menu`,
      data
  };
  return _post(req)
};
// 获取菜单编辑信息
export const getMenuInfo=(data)=>{
     let req={
         url:`rest/menuInfo/${data.menuId}`
     };
     return _get(req);
};

// 编辑新增
export const editMenu=(data)=>{
      let req={
          url:`rest/menu`,
          data
      };
      return _put(req);
};

// 删除
export const deleteMenu=(data)=>{
       let req={
           url:`rest/menu`,
           data
       };
       return _delete(req)
}