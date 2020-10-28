import {
  _get,
  _post,
  _delete,
  _put
} from './index';

// 获取风格
export const getListStyle = (data) => {
  let req = {
    url: `/build-rest/common/listStyle`
  };
  return _get(req);
};

// 获取空间
export const getListSpaceTyle = (data) => {
  let req = {
    url: `/build-rest/common/listSpaceType`
  };
  return _get(req);
};

// 搜索产品
export const findProducts = (data) => {
  let req = {
    url: `/build-rest/space/findProducts`,
    data
  };
  return _get(req);
};

// 获取省
export const getProvince = (data) => {
  let req = {
    url: `/common/province`,
    data
  };
  return _get(req);
};

// 获取市
export const getCity = (data) => {
  let req = {
    url: `/common/city/${data}`
  };
  return _get(req);
};

// 获取区
export const getCounty = (data) => {
  let req = {
    url: `/common/area/${data}`
  };
  return _get(req);
};

// 获取实景案例列表
export const findMySceneProgramme = (data) => {
  let req = {
    url: `build-rest/sceneProgramme/findMySceneProgramme`,
    data
  };
  return _get(req);
};

// 获取实景案例详情
export const sceneProgrammeDetail = (data) => {
  let req = {
    url: `build-rest/sceneProgramme/get/${data}`
  };
  return _get(req);
};

// 获取实景案例空间详情
export const sceneSpaceDetail = (data) => {
  let req = {
    url: `build-rest/sceneSpace/get/${data}`
  };
  return _get(req);
};

// 删除实景案例空间
export const deleteMySceneSpace = (data) => {
  let req = {
    url: `build-rest/sceneSpace/deleteMySceneSpace/${data}`
  };
  return _delete(req);
};

// 删除实景案例
export const deleteMySceneProgramme = (data) => {
  let req = {
    url: `build-rest/sceneProgramme/deleteMySceneProgramme/${data}`
  };
  return _delete(req);
};

// 保存实景案例空间
export const sceneSpaceSave = (data) => {
  let req = {
    url: `build-rest/sceneSpace/save`,
    data
  };
  return _post(req);
};

// 上传图片
export const uploadImage = (data) => {
  let req = {
    url: `build-rest/file/uploadImage`,
    data
  };
  return _post(req);
};

// 上传实景图案例
export const saveSceneProgramme = (data) => {
  let req = {
    url: `build-rest/sceneProgramme/save`,
    data
  };
  return _post(req);
};

// 实景图提交审核
export const submitAudit = (data) => {
  let req = {
    url: `build-rest/sceneProgramme/submitAudit/${data}`
  };
  return _post(req);
};

// 实景图取回修改
export const backModify = (data) => {
  let req = {
    url: `build-rest/sceneProgramme/backModify/${data}`
  };
  return _post(req);
};

// 获取文件上传签名
export const getUploadPolicy = (data) => {
  let req = {
    url: `build-rest/file/getUploadPolicy`
  };
  return _get(req);
};

// 获取实景图审核列表
export const findSceneList = (data) => {
  let req = {
    url: `build-rest/sceneProgramme/find`,
    data
  };
  return _get(req);
};

// 删除实景案例
export const deleteScene = (data) => {
  let req = {
    url: `build-rest/sceneProgramme/delete/${data}`
  };
  return _delete(req);
};

// 获取实景案例详情
export const getsceneProgramme = (data) => {
  let req = {
    url: `build-rest/sceneProgramme/admin/get/${data}`
  };
  return _get(req);
};

// 实景图评审保存
export const sceneProgrammeSave = (data,programmeId) => {
  let req = {
    url: `build-rest/sceneProgramme/audit/${programmeId}`,
    data
  };
  return _post(req);
};



// 新实景案例列表
export const sceneCase = (data) => {
  let req = {
    url: `build-rest/sceneCase/find`,
    data
  };
  return _get(req);
};

// 新实景案例详情
export const sceneCaseDetail = (id) => {
  let req = {
    url: `build-rest/sceneCase/get/${id}`
  };
  return _get(req);
};

// 新实景案例楼盘查询
export const findBuilding = (data) => {
  let req = {
    url: `build-rest/building/find`,
    data
  };
  return _get(req);
};

// 新实景图评审保存
export const sceneCaseSave = (data) => {
  let req = {
    url: `build-rest/sceneCase/save`,
    data
  };
  return _post(req);
};

// 新实景图删除
export const sceneCaseDelete = (data) => {
  let req = {
    url: `build-rest/sceneCase/delete`,
    data
  };
  return _delete(req);
};

// 检测审核权限
export const checkPermission = (data) => {
  let req = {
    url: `rest/checkPermission/${data}`
  };
  return _get(req);
};


// 实景图评审保存
export const sceneProgrammeSaveAudit = (data) => {
  let req = {
    url: `build-rest/sceneProgramme/admin/save`,
    data
  };
  return _post(req);
};

// 720云网站跳转
export const get720yunTicket = (data) => {
  let req = {
    url: `rest/get720yunTicket`
  };
  return _get(req);
};