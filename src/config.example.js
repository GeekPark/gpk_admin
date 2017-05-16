const isDev = process.env.NODE_ENV === 'development'

const config = {
  'development': {
    'host': '',
    'account': ''
  },
  'production': {
    'host': '',
    'account': ''
  }
}

export default isDev ? config['development'] : config['production']
