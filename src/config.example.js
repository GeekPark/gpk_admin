const isDev = process.env.NODE_ENV === 'development'
// 分别是
// api url
// 账号站 url
// 主站 url

const config = {
  development: {
    api: '',
    account: '',
    main: ''
  },
  production: {
    api: '',
    account: '',
    main: ''
  }
}

export default isDev ? config['development'] : config['production']

