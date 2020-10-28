import { _get, _post, _delete,_put } from './index';

//获取验证码图片
export const getVerifiImage=(data)=>{
    let req={
        url:`/rest/verifi-image`,

    };
    return _get(req);
};
