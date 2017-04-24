import config from '../config'
import router from '../routers.js'
import store  from './index.js'

console.log(store);

const base_url = `${config.host}v1`



const axios = require('axios').create({
  baseURL: base_url,
  timeout: 10000,
  withCredentials: true, // 允许跨域 cookie
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  transformResponse: [function (data) {
    // console.log(data);
    let json = {};

    try {
      json = JSON.parse(data);
    } catch (e) {
      json = {};
    }

    return json;
  }],
});

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  store.commit('SET_ITEM', {
    key: 'isLoading',
    val: true
  })
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  store.commit('SET_ITEM', {
    key: 'isLoading',
    val: false
  })
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
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

// post
  _patch : (req) => {
    return axios.patch(`/${req.url}`,{data: req.data })
  },

// delete
  _delete : (req) => {
    return axios({ method: 'delete', url: `/${req.url}`, data: req.data })
  },

}
