const isDev = process.env.NODE_ENV === 'development'

const config = {
  'development': {
    'host': ''
  },
  'production': {
    'host': ''
  }
}

export default isDev ? config['development'] : config['production']
