import {
  _get,
  _post,
  _delete,
  _put
} from './index';

//   获取列表
export const getRolesList = (data) => {
  let req = {
    url: `/rest/dealer/role/find`,
    data
  };

  return _get(req);
};
// 获取权限
export const getPersionAthoud = (data) => {
  let req = {
    url: `rest/rolesPermission`,
    data
  };

  return _post(req);
};


// 获取类型
export const typesList = (data) => {
  let req = {
    url: `/rest/dealerOrganizationType`,
    data
  };
  return _get(req);
};

