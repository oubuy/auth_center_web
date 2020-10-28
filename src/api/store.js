import { _get, _post, _delete,_put } from './index';

import axios from 'axios';
import qs from 'qs';

// 获取table表格
export const storeModityTable=(data)=>{
let req={
    url:`modity/storeModity`,
    data
};
return _get(req)
}

// 获取左右门店列表
export const dealerShopList=()=>{
    let req={
        url:`/modity/dealerShopList`,

    };
    return _get(req)
}

// 获取用户管理门店列表
export const userShopList=(data)=>{
    let test='aaaaa'
    let req={
        url:`/modity/userManagementOrgList?searchName=${data}`,

    };
    return _get(req)
}





// 商品类目
export const categoryTree=()=>{
    let req={
        url:`modity/categoryTree`
    }
    return _get(req)
}

export const categoryList=()=>{
    let req={
        url:`rest/categoryList`
    }
    return _get(req)
}

// 获取未选中门店商品信息
export const shopAddmodityPage=(data)=>{
    let req={
        url:'modity/shopAddmodityPage',
        data
    };
    return _get(req)
}

// 添加商品到门店
export const shopAddModity=(data)=>{
    let req={
        url:'modity/shopAddModity',
        data
    };
    return _post(req)
}
// 获取选中商品信息
export const shopModityPriceInfo=(data)=>{
    let req={
        url:`modity/shopModityPriceInfo`,
        data
    };
    return _get(req)
};

// 获取商品二维码
export const shopModityQrCode=(data)=>{
    let req={
        url:`modity/shopModityQrCode`,
        data
    };
    return _get(req)
};
// 编辑商品  提交
export const editShopModityPriceInfo=(data)=>{
    let req={
        url:`modity/shopModityPriceInfo`,
        data
    };
    return _put(req)
};

// 导入数据  提交
export const importShopModity=(data)=>{
    let req={
        url:`modity/importShopModity`,
        data
    };
    return _post(req)
}


// 删除门店商品
export const deleteShopModity=(data)=>{
    let req={
        url:`modity/deleteShopModity`,
        data
    };
    return _post(req)
}

// 打印
export const setPrintData=(data)=>{
    let req={
        url:`modity/setPrintData`,
        data
    };
    return _post(req)
}

// 批量修改价格
export const shopModityMannyPrice=(data)=>{
    let req={
        url:`modity/shopModityPrice`,
        data
    };
    return _put(req)
}

// 设置实物图
export const setPhysicalDisplay=(data)=>{
    let req={
        url:`modity/setPhysicalDisplay`,
        data
    };
    return _put(req)
}

export const officialModelExisted=(data)=>{
    let req={
        url:`modity/officialModelExisted`,
        data
    };
    return _post(req)
}

// 获取标签
export const findStoreModityTags=(data)=>{
    let req={
        url:`modity/findStoreModityTags?storeModityId=${data}`,
        data
    };
    return _get(req)
};

// 查询标签
export const findTags=(data)=>{
    let req={
        url:`modity/modity/findTags`,
        data
    };
    return _get(req)
};
// 保存标签
export const saveStoreModityTag=(data)=>{
    let req={
        url:`modity/saveStoreModityTag`,
        data
    };
    return _post(req)
};

// 根据门店商品ID获取商品标签集合
export const getStoreModityTags = (params) => {
  return axios({
    method: 'post',
    url: 'modity/getStoreModityTags',
    data: qs.stringify(params, {
      arrayFormat: 'brackets'
    })
  });
};
