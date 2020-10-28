import {
    _get,
    _post,
    _delete,
    _put
  } from './index';
  export const getUserPermission=(data)=>{
    let req={
        url:`rest/getAllUserPermission`,
        data
    };
    return _get(req);
};
