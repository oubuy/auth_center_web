import { _get, _post, _delete, _put } from './index';

// 获取table列表数据
export const getTable=(data)=>{
    let req = {
        url: `rest/outerOrgList`,
        data
    }
    return _get(req);
}

// 外部组织类型信息
export const outTypeList=(data)=>{
     let req={
        url: `rest/searchOuterOrgTypeList`,
        data
     };
     return _get(req)
};

// 获取外部组织上级组织名字
export const outHeightOrgName=(data)=>{
  let req={
    url: `rest/outerOrgsLongName`,
    data
  };
  return _get(req)
};

// 可用员工数量
export const outUserNumber=(data)=>{
  let req={
    url: `rest/orgsUserNum`,
    data
  };
  return _get(req);
};

// 禁用
export const outDelet=(data)=>{
  let req = {
    url: `rest/outerOrgDisable`,
    data
  };
  return _delete(req);
};

// 启动
export const outEndisable=(data)=>{
  let req = {
    url: `rest/outerOrgEnable`,
    data
  };
  return _put(req);
};
/**
 * 查询用户权限
 * @param params
 */
export const checkPermission = (params) => {
  return _get({
      url: 'rest/checkPermission',
      data: params
  });
};