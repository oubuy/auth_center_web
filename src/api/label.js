import {
    _get,
    _post,
    _delete,
    _put
  } from './index';

  export const getLabel=(data)=>{
    let req={
        url:`modity/modity/findTags`,
        data
    };
    return _get(req);
};

export const deleteLabel = (data) => {
    let req = {
      url: `modity/modity/deleteModityTag`,
      data
    };
    return _post(req);
  };

  export const addEditeLabel = (data) => {
    let req = {
      url: `modity/modity/saveModityTag`,
      data
    };
    return _post(req);
  };


  export const getLabelInfo=(data)=>{
    let req={
        url:`modity/modity/getTag`,
        data
    };
    return _get(req);
};