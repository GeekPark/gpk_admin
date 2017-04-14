const isDev = process.env.NODE_ENV === 'development'

export default {
  host: isDev ? 'http://127.0.0.1:3000' : 'http://xxxx.com',
  qiniu: 'http://xxxx.clouddn.com/',
}
