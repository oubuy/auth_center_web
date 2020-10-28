import axios from 'axios';
import qs from 'qs';
import { _get, _post, _delete, _put } from './index';

// *************************************************** 楼盘模块 ***************************************************************

/**
 * 查询楼盘列表
 * @param params
 */
export const findBuilding = (params) => {
    return _get({
        url: '/build-rest/building/find',
        data: params
    });
};

/**
 * 根据ID获取楼盘详细信息
 * @param params
 */
export const getBuilding = (params) => {
    return _get({
        url: '/build-rest/building/get',
        data: params
    });
};

/**
 * 根据ID集合获取楼盘列表
 * @param params
 */
export const getBuildingByIds = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/building/getByIds',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 获取“楼盘物业类型”选项
 * @param params
 */
export const listPropertyType = (params) => {
    return _get({
        url: '/build-rest/building/listPropertyType',
        data: params
    });
};

/**
 * 获取楼盘前十个热门标签
 * @param params
 */
export const getHotBuildingLabels = (params) => {
    return _get({
        url: '/build-rest/building/getHotBuildingLabels',
        data: params
    });
};

/**
 * 上下架操作
 * @param params
 */
export const onShelfBuilding = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/building/onShelf',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 审核
 * @param params
 */
export const auditBuilding = (params) => {
  return axios({
      method: 'post',
      url: '/build-rest/building/audit',
      data: qs.stringify(params, { arrayFormat: 'brackets' })
  });
};

/**
 * 删除操作
 * @param params
 */
export const deleteBuilding = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/building/delete',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 保存楼盘信息
 * @param params
 */
export const saveBuilding = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/building/save',
        data: params
        // data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 查询经销商楼盘户型数量
 * @param params
 */
export const getBuildingModelCount = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/building/getBuildingModelCount',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 查询经销商楼盘关联案例数
 * @param params
 */
export const getBuildingSpaceCount = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/building/getBuildingSpaceCount',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

// *************************************************** 户型模块 ***************************************************************

/**
 * 查询户型列表
 * @param params
 */
export const findBuildingModel = (params) => {
    return _get({
        url: '/build-rest/buildingmodel/find',
        data: params
    });
};

/**
 * 根据ID获取楼盘详细信息
 * @param params
 */
export const getBuildingModel = (params) => {
    return _get({
        url: '/build-rest/buildingmodel/get',
        data: params
    });
};

/**
 * 根据ID集合获取户型列表
 * @param params
 */
export const getBuildingModelByIds = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/buildingmodel/getByIds',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 获取3D云设计“描户型”URL
 * @param params
 */
export const get3DCloudUrl = (params) => {
    return _get({
        url: '/build-rest/buildingmodel/get3DCloudUrl',
        data: params
    });
};

/**
 * 获取户型前十个热门标签
 * @param params
 */
export const getHotModelLabels = (params) => {
    return _get({
        url: '/build-rest/buildingmodel/getHotModelLabels',
        data: params
    });
};

/**
 * 上下架操作
 * @param params
 */
export const onShelfBuildingModel = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/buildingmodel/onShelf',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 审核
 * @param params
 */
export const auditBuildingModel  = (params) => {
  return axios({
      method: 'post',
      url: '/build-rest/buildingmodel/audit',
      data: qs.stringify(params, { arrayFormat: 'brackets' })
  });
};

/**
 * 删除操作
 * @param params
 */
export const deleteBuildingModel = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/buildingmodel/delete',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 保存户型信息
 * @param params
 */
export const saveBuildingModel = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/buildingmodel/save',
        data: params
    });
};

/**
 * 查询经销商户型关联案例数
 * @param params
 */
export const getBuildingModelSpaceCount = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/buildingmodel/getBuildingModelSpaceCount',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

// *************************************************** 案例模块 ***************************************************************

/**
 * 查询户型列表
 * @param params
 */
export const findSpace = (params) => {
    return _get({
        url: '/build-rest/space/find',
        data: params
    });
};

/**
 * 根据ID获取案例详细信息
 * @param params
 */
export const getSpace = (params) => {
    return _get({
        url: '/build-rest/space/get',
        data: params
    });
};

/**
 * 根据名称搜索产品信息
 * @param params
 */
export const findProducts = (params) => {
    return _get({
        url: '/build-rest/space/findProducts',
        data: params
    });
};

/**
 * 获取案例前十个常用特点
 * @param params
 */
export const getHotSpaceLabels = (params) => {
    return _get({
        url: '/build-rest/space/getHotSpaceLabels',
        data: params
    });
};

/**
 * 取消案例关联楼盘户型
 * @param params
 */
export const cancelRelateBuildingModel = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/space/cancelRelateBuildingModel',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 上下架操作
 * @param params
 */
export const onShelfSpace = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/space/onShelf',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 审核
 * @param params
 */
export const auditSpace  = (params) => {
  return axios({
      method: 'post',
      url: '/build-rest/space/audit',
      data: qs.stringify(params, { arrayFormat: 'brackets' })
  });
};

/**
 * 删除操作
 * @param params
 */
export const deleteSpace = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/space/delete',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 保存
 * @param params
 */
export const saveSpace = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/space/save',
        data: params
    });
};

/**
 * 获取“案例户型面积”选项
 * @param params
 */
export const listSpaceModelArea = (params) => {
    return _get({
        url: '/build-rest/space/listSpaceModelArea',
        data: params
    });
};

/**
 * 获取“案例户型”选项
 * @param params
 */
export const listSpaceModelType = (params) => {
    return _get({
        url: '/build-rest/space/listSpaceModelType',
        data: params
    });
};

/**
 * 获取“案例上架渠道”选项
 * @param params
 */
export const listSpaceChannel = (params) => {
  return _get({
      url: '/build-rest/space/listSpaceChannel',
      data: params
  });
};


/**
 * 获取案例效果图列表
 * @param params
 */
export const getXgtImages = (params) => {
    return _get({
        url: '/build-rest/space/getXgtImages',
        data: params
    });
};

// *************************************************** 整屋方案模块 ***************************************************************

/**
 * 经销商分页查询方案列表
 * @param params
 */
export const findProgrammeForDealer = (params) => {
  return _get({
      url: '/build-rest/programme/findForDealer',
      data: params
  });
};

/**
 * 根据ID查询方案详情
 * @param params
 */
export const getProgramme = (params) => {
  return _get({
      url: '/build-rest/programme/get',
      data: params
  });
};

/**
 * 保存方案
 * @param params
 */
export const saveProgramme = (params) => {
  return axios({
      method: 'post',
      url: '/build-rest/programme/save',
      data: params
  });
};

/**
 * 删除操作
 * @param params
 */
export const deleteProgramme = (params) => {
  return axios({
      method: 'post',
      url: '/build-rest/programme/delete',
      data: qs.stringify(params, { arrayFormat: 'brackets' })
  });
};

/**
 * 上下架操作
 * @param params
 */
export const onShelfProgramme = (params) => {
  return axios({
      method: 'post',
      url: '/build-rest/programme/onShelf',
      data: qs.stringify(params, { arrayFormat: 'brackets' })
  });
};

/**
 * 审核
 * @param params
 */
export const auditProgramme = (params) => {
  return axios({
      method: 'post',
      url: '/build-rest/programme/audit',
      data: qs.stringify(params, { arrayFormat: 'brackets' })
  });
};

// *************************************************** 互联网来源楼盘模块 ***************************************************************

/**
 * 分页查询互联网来源楼盘
 * @param params
 */
export const findCrawlerBuilding = (params) => {
    return _get({
        url: '/build-rest/crawlerBuilding/find',
        data: params
    });
};

/**
 * 根据ID获取互联网来源楼盘信息
 * @param params
 */
export const getCrawlerBuilding = (params) => {
    return _get({
        url: '/build-rest/crawlerBuilding/get',
        data: params
    });
};

/**
 * 根据ID批量同步互联网来源楼盘与户型到楼盘中心
 * @param params
 */
export const syncCrawlerBuilding = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/crawlerBuilding/sync',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};

/**
 * 修改与同步互联网来源楼盘信息
 * @param params
 */
export const updateCrawlerBuilding = (params) => {
    return axios({
        method: 'post',
        url: '/build-rest/crawlerBuilding/update',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};


// *************************************************** 其它 ***************************************************************

/**
 * 分页查询户型明细列表
 * @param params
 */
export const findSpaceLayout = (params) => {
    return _get({
        url: '/build-rest/spaceLayout/findDetail',
        data: params
    });
};

/**
 * 获取“风格”选项
 * @param params
 */
export const listStyle = (params) => {
    return _get({
        url: '/build-rest/common/listStyle',
        data: params
    });
};

/**
 * 获取“空间类型”选项
 * @param params
 */
export const listSpaceType = (params) => {
    return _get({
        url: '/build-rest/common/listSpaceType',
        data: params
    });
};

/**
 * 获取“房型”选项
 * @param params
 */
export const listSpaceShape = (params) => {
    return _get({
        url: '/build-rest/common/listSpaceShape',
        data: params
    });
};

/**
 * 获取“房型明细”选项
 * @param params
 */
export const listSpaceLayout = (params) => {
    return _get({
        url: '/build-rest/common/listSpaceLayout',
        data: params
    });
};

/**
 * 获取当前登录人员所属公司基本信息
 * @param params
 */
export const getComInfo = (params) => {
    return _get({
        url: '/rest/getComInfo',
        data: params
    });
};
