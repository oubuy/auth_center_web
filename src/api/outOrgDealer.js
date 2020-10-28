import { _get, _post, _delete, _put } from './index';

// 获取经销商组织类别
export const outerOrgDealerTypeList=(data)=>{
    let req = {
        url: `rest/outerOrgDealerTypeList`,
        data
    }
    return _get(req);
};

// 添加 经销商组织
export const addOuterOrgDealerType=(data)=>{
    let req = {
        url: `rest/outerOrgDealerType`,
        data
    }
    return _post(req);
};

// 获取门店/部门类别
export const outerOrgShopTypeList=(data)=>{
    let req = {
        url: `rest/outerOrgShopTypeList`,
        data
    }
    return _get(req);
};

// 添加门店/部门
export const outerOrgShopType=(data)=>{
    let req = {
        url: `rest/outerOrgShopType`,
        data
    }
    return _post(req);
};

// 获取其他 类别
export const outerOrgOtherTypeList=(data)=>{
    let req = {
        url: `rest/outerOrgOtherTypeList`,
        data
    }
    return _get(req);
};

// 添加 其他
export const outerOrgOtherType=(data)=>{
    let req = {
        url: `rest/outerOrgOtherType`,
        data
    }
    return _post(req);
};


// 编辑获取的组织信息
export const outerOrgAllInfo=(data)=>{
    let req = {
        url: `rest/outerOrg/${data.orgId}`,
       
    }
    return _get(req);
};

// 编辑添加经销商
export const editeOuterOrgDealerType=(data)=>{
    let req = {
        url: `rest/outerOrgDealerType`,
        data
    }
    return _put(req);
};

// 编辑添加 其他
export const editOuterOrgOtherType=(data)=>{
   let req={
       url:`rest/outerOrgOtherType`,
       data
   };
   return _put(req);
};

// 编辑添加 门店/部门
export const editOuterOrgShopType=(data)=>{
   let req={
       url:`rest/outerOrgShopType`,
       data,
   };
   return _put(req)
}
