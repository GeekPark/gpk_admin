import api from 'stores/api'

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
      this.fetch()
      console.log(`当前页: ${index}`)
    },
    fetch (url = '') {
      const params = Object.assign({page: this.currentPage}, this.params)
      api.get(options.url, {params: params}).then((result) => {
        this.listData = result.data
      }).catch((err) => {
        console.log(err)
         this.$message.error(err.toString())
      })
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
      this.fetch()
    }
  }
  return base
}
