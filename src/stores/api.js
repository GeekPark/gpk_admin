import config from '../config'
import axios from 'axios'
const baseUrl = `${config.api}/api/v1`

const baseReq = create()

function create (url = baseUrl) {
  return axios.create({
    baseURL: url,
    timeout: 10000,
    withCredentials: true, // 允许跨域 cookie
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    transformResponse: [function (data) {
      let json = {}
      try {
        json = JSON.parse(data)
      } catch (e) {
        json = {}
      }
      return json
    }]
  })
}

const beginLoading = () => {
  const el = document.getElementById('loading-bar')
  el.style.transition = 'width 1.5s'
  el.style.width = '100%'
}

const finishLoading = () => {
  const el = document.getElementById('loading-bar')
  el.style.transition = 'width 0s'
  el.style.width = '100%'
  setTimeout(() => {
    el.style.transition = 'width 0s'
    el.style.width = '0px'
  }, 2000)
}

baseReq.account = create(`${config.account}/`)

// Add a request interceptor
baseReq.interceptors.request.use(function (config) {
  beginLoading()
  config.params = Object.assign({roles: 'dev'}, config.params)
  return config
}, function (error) {
  finishLoading()
  return Promise.reject(error)
})

// Add a response interceptor
baseReq.interceptors.response.use(function (response) {
  finishLoading()
  return response
}, function (error) {
  finishLoading()
  return Promise.reject(error)
})

export default baseReq
