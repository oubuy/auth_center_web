import {
  _get,
  _post,
  _delete,
  _put
} from './index';

// 获取类型
export const typesList = (data) => {
  let req = {
    url: `/rest/dealerOrganizationSubType`,
    data
  };
  return _get(req);
};

// 获取门店列表
export const shopList = (data) => {
  let req = {
    url: `/rest/dealerSubsOrganizations`,
    data
  };
  return _get(req);
};

// 新增门店
export const dealerOrganization = (data) => {
  let req = {
    url: `rest/dealerOrganization`,
    data
  };

  return _post(req);
};

// 获取门店编辑信息
export const editDealerOrganization = (data) => {
  let req = {
    url: `rest/dealerOrganization/${data.dealerOrganizationId}`,

  };

  return _get(req);
};

//  编辑
export const editAdddealerOrganization = (data) => {
  let req = {
    url: `rest/dealerOrganization`,
    data
  };

  return _put(req);
};

//   删除
export const deleteShop = (data) => {
  let req = {
    url: `rest/dealerOrganization`,
    data
  };
  return _delete(req);
};

// 员工数量
export const userNumber=(data)=>{
  let req = {
    url: `rest/orgsUserNum`,
    data
  };
  return _get(req);
}
