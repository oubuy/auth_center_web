import { _get, _post, _delete, _put } from './index';

// 获取角色列表（第一个table）
export const rolePage=(data)=>{
    let req={
        url:`rest/rolePage`,
        data
    };
    return _get(req)
}

// 获取角色的类型
export const roleLevelTypeList=(data)=>{
      let req={
          url:`rest/roleLevelTypeList`,
          data
      };

      return _get(req);
};

// 获取角色的权限和人数
export const rolePermissionAndUserNum=(data)=>{
    let req={
        url:`rest/rolePermissionAndUserNum`,
        data
    };

    return _get(req)
};

// 获取角色用户列表(第二个table)
export const roleUserList=(data)=>{
  let req={
      url:`/rest/roleUserList`,
      data
  };
  return _get(req)
};

/**
 * 根据组织ID获取组织全名
 * @param params
 */
export const getFullOrgName = (data) => {
    let req={
        url:`rest/org/getFullOrgName`,
        data
    }
  return _get(req);
};

// 获取添加按钮弹出的树
export const orgTree=(data)=>{
    let req={
        url:`rest/outerOrgTree`,
        data
    };
    return _get(req)
};

//添加角色
export const addRole=(data)=>{
  let req={
      url:`rest/role`,
      data
  };
  return _post(req)
};
// 编辑添加角色
export const editPutRole=(data)=>{
    let req={
        url:`rest/role`,
        data
    };
    return _put(req)
};

// 获取角色编辑信息
export const getRoleInfo=(data)=>{
let req={
    url:`rest/roleInfo/${data.roleId}`,
};
return _get(req)
};

// 删除角色
export const deleteRoleInfo=(data)=>{
  let req={
      url:`rest/roleInfo`,
      data
  };
  return _delete(req)
}

// 删除角色用户id
export const deleteRoleUser=(data)=>{
   let req={
       url:`rest/roleUser`,
       data
   };
   return _delete(req)
};

// 获取人员
export const getUserNumber=(data)=>{
    let req={
        url:`rest/userList`,
        data
    };
    return _get(req)
}
// 添加人员
export const addRoleUser=(data)=>{
    let req={
        url:`rest/roleUser`,
        data
    };
    return _post(req)
}

// 检测添加的人员是否再对应组织内
export const checkRoleUser = (data) => {
    let req = {
      url: `rest/checkRoleUser`,
      data
    };
  
    return _post(req);
  }
  