import api from '../stores/api'

function fetch (_this = {}, params = {}, url = '') {
  api.get(url, {params: params}).then((result) => {
    _this.listData = result.data
  }).catch((err) => {
    console.log(err)
     _this.$message.error(err.toString())
  })
}

export default (options) => {

  let {
    methods = {},
    data    = {},
    watch   = {}
  } = options

  methods = Object.assign({
    handleSizeChange(index, val) {
      console.log(`每页 ${index} 条`)
    },
    handleCurrentChange(index, val) {
      this.currentPage = index
      fetch(this, {page: index}, options.url)
      console.log(`当前页: ${index}`)
    },
    handleFilter() {

    },
    handleDestroy(index, val, list) {
      api.delete(`${options.url}/${val.id}`, {}).then((result) => {
        this.$message.success('success')
        list.splice(index, 1)
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
  }}, methods)

  data = Object.assign({
    currentPage: 1,
    listData: {
      meta: {
        total_count: 0,
        limit_value: 0
      }
    }
  }, data)

  const base =  {
    computed: {
    },
    data () {
      return data
    },
    methods: methods,
    watch: watch,
    beforeMount () {
      fetch(this, {page: this.currentPage}, options.url)
    }
  }
  return base
}
