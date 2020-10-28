import {
    _get,
    _post,
    _delete,
    _put
  } from './index';

  export const updateUserInfo=(data)=>{
     let req={
         url:`rest/loginUser`,
         data
     };
     return _post(req);
  }
