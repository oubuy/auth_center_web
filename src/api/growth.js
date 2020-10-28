import { _get, _post, _delete, _put } from './index';
import qs from 'qs';

export const growthList=(data)=>{
    let req={
        url:`rest/growth/page`,
        data
    };
    return _get(req);
};

export const growthInfo=(data)=>{
   let req={
    url:`rest/growth/get`,
    data
   };
    return _get(req);
};

// 更新保存
export const saveGrowth=(data)=>{
    let req={
        url:`rest/growth/save`,
        data
       };
        return _post(req);
};


// 删除
export const deleteVersion=(data)=>{
    let req={
        url:'rest/version/delete',
        data: qs.stringify(data, { arrayFormat: 'brackets' })
    };
    return _post(req)
}

// 下载
export const getLatest=(data)=>{
    let req={
        url:`rest/version/getLatest?arch=${data.arch}`,
    };
    return _get(req)
};

export const studentList=(data)=>{
    let req={
        url:`rest/growth/enrollmentUsers`,
        data
    };
    return _get(req);
};
export const searchStudent=(data)=>{
    let req={
        url:`rest/growth/getUser`,
        data
       };
        return _get(req);
};
export const saveStudent=(data)=>{//添加学员
    let req={
        url:`rest/growth/addUser`,
        // data: qs.stringify(data)
        data
       };
        return _post(req);
};
export const deleteStudent=(data)=>{
  let req={
      url:`rest/growth/cancelEnrolled`,
      data
  }
  return _post(req);
};
export const usreList=(data)=>{
    let req={
        url:`rest/growth/users`,
        data
    };
    return _get(req);
};
export const deleteUser=(data)=>{
    let req={
        url:`rest/growth/deleteUser`,
        data
    }
    return _post(req);
};
export const addScore=(data)=>{
    let req={
        url:`rest/growth/addScore`,
        data
    }
    return _post(req);
};
export const readExcel=(data)=>{
    let req={
        url:`rest/growth/file/readExcel`,
        data
    }
    return _post(req);
};
export const addQixinMessage=(data)=>{
    let req={
        url:`rest/growth/addQixinMessage`,
        data
    }
    return _post(req);
};
// 获取课程
export const allCourses = (data) => {
    let req = {
      url: `rest/growth/allCourses`,
      data
    };
    return _get(req);
  };
export const exportUsers = (data) => {
let req = {
    url: `rest/growth/exportUsers`,
    data
};
return _get(req);
};
// 导入学员积分  提交
export const importUserScore=(data)=>{
    let req={
        url:`rest/growth/importUserScore`,
        data
    };
    return _post(req)
};
// 导入报名  提交
export const importEnrolled=(data)=>{
    let req={
        url:`rest/growth/importEnrolled`,
        data
    };
    return _post(req)
};
// 开放报名开始时间和结束时间（当天）
export const setOpenTime = (data) => {
    let req = {
      url: `rest/growth/setOpenTime`,
      data
    };
    return _get(req);
};
  // 重置报名开始时间和结束时间
export const resetOpenTime = (data) => {
    let req = {
        url: `rest/growth/resetOpenTime`,
        data
    };
    return _get(req);
};
// 查询学分列表
export const scoreList = (data) => {
let req = {
    url: `rest/growth/scoreList`,
    data
};
return _get(req);
};
// 查询学分列表
export const signList = (data) => {
    let req = {
        url: `rest/growth/signList`,
        data
    };
    return _get(req);
    };
    // 修改分数上限
export const changeLimitScore=(data)=>{
    let req={
        url:`rest/growth/changeLimitScore`,
        data
    };
    return _post(req)
};
    