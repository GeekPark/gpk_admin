import config     from '../config'
import {router} from '../routers'

const base_url = `${config.host}v1`



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

    return json;
  }],
});


// get
export default {
  _get : (req) => {
    const params = Object.assign({roles: 'dev'}, req.data)
    return axios.get(req.url, {params})
  },

// put
  _put : (req) => {
    return axios.put(`/${req.url}`,{data: req.data })
  },

// post
  _post : (req) => {
    return axios.post(`/${req.url}`,{data: req.data })
  },

// delete
  _delete : (req) => {
    return axios({ method: 'delete', url: `/${req.url}`, data: req.data })
  },

}
