import { _get, _post, _delete, _put } from './index';

// 获取人员列表
export const persionList = (data) => {
    let req = {
        //  url:`rest/users/${persionId.comId}`,
        url: `rest/users`,
        data
    };
    return _get(req);
};

// 获取人员信息
export const getUserInfo = (data) => {
    let req = {
        url: `/rest/dealer/user/get`,
        data
    };
    return _get(req);
};

// 获取用户角色
export const persionAthoud = (data) => {
    let req = {
        //  url:`rest/usersPermission`,
        url: `rest/usersRole`,
        data
    };

    return _post(req);
};


// 获取经销商人员列表（所属组织搜索）
// /dealerOrganizations/{dealerOrganizationId}
export const dealerOrganizations = (data) => {
    let req = {
        //   url:`rest/dealerShops`,
        url: `rest/dealerOrganizations`,
    };
    return _get(req);
};

// 新增人员（所属组织）

export const addDealerOrganizations = (data) => {
    let req = {
        url: `rest/dealerOrganizations`,
    };
    return _get(req);
};

// 编辑
export const editPersion = (data) => {
    let req = {
        url: `rest/user/${data.userId}`,
    };
    return _get(req);
};

// 获取职业
export const positionList = (data) => {
    let req = {
        url: `rest/positionList`,
    };
    return _get(req);
}

// 获取经销商管线范围
export const dealerShopsList = (data) => {
    let req = {
        // url:`rest/dealerShops/${data.dealerOrganizationId}`,
        url: `rest/dealerShops`,
    };
    return _get(req);
}

// 获取角色
export const rolesList = (data) => {
    let req = {
        // url:`rest/roles/${data.organizationId}`,
        url: `rest/comRoles`,
    };
    return _get(req);
}

// 添加保存
export const userSave = (data) => {
    let req = {
        url: `rest/user`,
        data
    };
    return _post(req);
};
// 删除
export const deleteList = (data) => {
    let req = {
        url: `rest/user`,
        data
    };
    return _delete(req);
}

// 重置密码
export const resetPassword = (data) => {
    let req = {
        url: `rest/user/resetPassword/${data.userId}`
    };
    return _get(req)
}