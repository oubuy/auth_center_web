import { _get, _post, _delete,_put } from './index';
import qs from 'qs';

export const uploadImgs=(data)=>{
    let req={
        url:`rest/outerUser/uploadImage`,
        data
    }
    return _post(req)
}
export const dealerModityList=(data)=>{
    let req={
        url:`modity/modity/findList`,
        data
    };
    return _get(req);
};

export const getCategoryAll=(data)=>{
    let req={
        url:`modity/getCategoryTree`,
        data
    }
    return _get(req)
}

export const relationStoreNum=(data)=>{
let req={
    // /rest/modity/relationSpaceNum
    url:`modity/modity/relationSpaceNum`,
    data: qs.stringify(data, { arrayFormat: 'brackets' })
};
return _post(req)
};

export const addDealerModity=(data)=>{
    let req={
        url:`modity/modity/add`,
        data
        
    };
    return _post(req)
}

export const getAddModityId=(data)=>{
    let req={
        url:`modity/modity/getModityId`,
        data
    }
    return _get(req)
}

export const getCommoncheckBox=(data)=>{//风格，空间等等
    let req={
        url:`modity/basicData/detailListByBasicCode`,
        data:qs.stringify(data)
    }
    return _post(req)
}
export const getRecommendBox=(data)=>{//推荐位
    let req={
        url:`modity/recommendation/recommendationEnableList`,
     
    }
    return _get(req)
}


export const getAModityInfo=(data)=>{
    let req={
        url:`modity/modity/getModityInfo`,
        data
    }
    return _get(req)
}

export const editAddDealerModity=(data)=>{
    let req={
        url:`modity/modity/edit`,
        data
        
    };
    return _post(req)
}

export const dealerModityUpdateStatus=(data)=>{//上架
    let req={
        url:`modity/modity/updateStatus`,
        data
        
    };
    return _post(req)
}
// 资金管理账号
export const moneyManager= (data) => {
    let req={
        url:`rest/outerUser/userAccount`,
        data
        
    };
    return _get(req)
};