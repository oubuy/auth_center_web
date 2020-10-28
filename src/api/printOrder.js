import {
  _get,
  _post,
  _delete,
  _put
} from './index';

// 搜索订单
export const searchOrder = (data) => {
  let req = {
    url: `rest/salesorder/search`,
    data
  };
  return _get(req);
};

// 订单详情
export const orderDetail = (data) => {
  let req = {
    url: `rest/salesorder/info`,
    data
  };
  return _get(req);
};

// 检测用户是否存在
export const checkCustomer = (data) => {
  let req = {
    url: `rest/salesorder/checkCustomer`,
    data
  };
  return _get(req);
};

// 生成订单
export const generateOCNumber = (data) => {
  let req = {
    url: `rest/salesorder/generateOCNumber`,
    data
  };
  return _get(req);
};

// 保存订单
export const saveOrder = (data) => {
  let req = {
    url: `rest/salesorder/save`,
    data
  };
  return _post(req);
};

// 删除订单
export const deleteOrder = (data) => {
  let req = {
    url: `rest/salesorder/delete`,
    data
  };
  return _post(req);
};

// 打印订单
export const printOrder = (data) => {
  let req = {
    url: `rest/salesorder/printOrder`,
    data
  };
  return _get(req);
};


// 型号查询
export const getCodeDetail = (data) => {
  let req = {
    url: `modity/getDetail`,
    data
  };
  return _get(req);
};

// 删除产品
export const deleteDetail = (data) => {
  let req = {
    url: `rest/salesorder/deleteDetail`,
    data
  };
  return _post(req);
};
