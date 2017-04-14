import config     from '../config'
import {router} from '../routers'

const base_url = `${config.host}/api/admin`



const axios = require('axios').create({
  baseURL: base_url,
  timeout: 10000,
  withCredentials: true, // 允许跨域 cookie
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  transformResponse: [function (data) {
    console.log(data);
    let json = {};

    try {
      json = JSON.parse(data);
    } catch (e) {
      json = {};
    }

    if (json.msg === 'session error') {
      console.log('session error');
      router.push('/login');
    }

    return json;
  }],
});


// get
export const _get = (req) => {
  return axios.get(req.url, {params: req.data})
}

// put
export const _put = (req) => {
  return axios({ method: 'put', url: `/${req.url}`, data: req.data })
}

// post
export const _post = (req) => {
  return axios({ method: 'post', url: `/${req.url}`, data: req.data })
}

// delete
export const _delete = (req) => {
  return axios({ method: 'delete', url: `/${req.url}`, data: req.data })
}
