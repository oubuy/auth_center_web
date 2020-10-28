
import router from '@/router';
import {removeInfo} from '@/utils/auth';
import axios from 'axios';


// get 获取数据
export const _get = (req) => {
    return  axios.get(req.url, {params: req.data})
  }
  
  // post 增加
  export const _post = (req) => {
    return axios({method: 'post', url: `/${req.url}`, data: req.data})
  }
  
  //patch 编辑数据put请求
  export const _put = (req) => {
    return axios({method: 'put', url: `/${req.url}`, data: req.data})
  }
  
  //delete  删除
  export const _delete = (req) => {
    return axios({method: 'delete', url: `/${req.url}`, data: req.data})
  }
  
 