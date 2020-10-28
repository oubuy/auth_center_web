import { _get, _post, _delete,_put } from './index';
import qs from 'qs';
import axios from 'axios';


// 获取左侧类目
export const categoryLeftTree=(data)=>{
    let req={
        url:`modity/getCategoryTree`,
        data
    };
    return _get(req);
}
// 获取右侧table表
export const categoryTableList=(data)=>{
    let req={
        url:`modity/categoryList`,
        data
    };
    return _get(req);
}

// 获取平台
export const moduleConfig=()=>{
    let req={
        // url:`modity/moduleConfig`,
        url:`modity/recommendation/recommendationEnableList`,

    };
    return _get(req);
};

// 获取类目商品数量
export const categoryModityNum=(data)=>{
    let req={
        url:`modity/categoryModityNum`,
        data
    };
    return _get(req);
}
// 添加类目获取父类
export const categoryTreeAll=(data)=>{
    let req={
        url:`modity/categoryTreeAll`,
        data
    };
    return _get(req);
};

// 添加获取category的id
export const categoryId=()=>{
    let req={
        url:`modity/categoryId`,

    };
    return _get(req);
};

// 添加类目
export const category=(data)=>{
    let req={
        url:`modity/category`,
        data
    };
    return _post(req);
};
// 获取类目详细信息
export const editCategory=(data)=>{
    let req={
        url:`modity/category`,
        data
    };
    return _get(req);
};
// 获取属性table
export const searchCategoryAttribute=(data)=>{
    let req={
        url:`modity/searchCategoryAttribute`,
        data
    };
    return _get(req);

};

// 获取自身批量添加的属性原来的值
export const brandList=(data)=>{
    let req={
        url:`modity/brandList`,
        data
    };
    return _get(req);
};

// 获取自身 品牌原来的值
export const categoryAttributeList=(data)=>{
    let req={
        url:`modity/categoryAttributeList`,
        data
    };
    return _get(req);
};

// 品牌批量添加
export const searchBrand=(data)=>{
    let req={
        url:`modity/searchBrand`,
        data
    };
    return _get(req);

}


// 编辑更新类目
export const editAddCategory=(data)=>{
    let req={
        url:`modity/category`,
        data
    };
    return _put(req)
}


// 获取编辑属性同步到子级的值
export const categoryIdPath=(data)=>{
    let req={
        url:`modity/categoryIdPath`,
        data
    };
    return _get(req)
};

// 排量排序
export const updateSortNum=(data)=>{
    let req={
        url:`modity/updateSortNum`,
        data
    };
    return _post(req)
}

// 获取同步到子级的树
export const childCategoryTreeById=(data)=>{
    let req={
        url:`modity/categoryTreeById`,
        data
    };
    return _get(req)
}

// 继承过来的商品属性数据
export const inheritParentModity=(data)=>{
    let req={
        url:`modity/categoryAttributeListByParentId`,
        data
    };
    return _get(req)
}

/**
 * 保存类目信息
 * @param params
 */
export const saveCategory = (params) => {
  return axios({
      method: 'post',
      url: '/modity/saveCategory',
      data: params
  });
};

/**
 * 禁用类目
 * @param params
 */
export const disableCategory = (params) => {
  return axios({
      method: 'post',
      url: '/modity/disableCategory',
      data: qs.stringify(params, { arrayFormat: 'brackets' })
  });
};
