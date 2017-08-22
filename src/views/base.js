import api from 'stores/api'
import tool from '../tools'

export default (options) => {
  let {
    methods = {},
    data = {},
    watch = {}
  } = options

  methods = Object.assign({
    handleSizeChange (index, val) {
      console.log(`每页 ${index} 条`)
    },
    handleCurrentChange (index, val) {
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
    handleDestroy (index, val, list) {
      const destroy = () => {
        api.delete(`${options.url}/${val.id}`, {}).then((result) => {
          this.$message.success('success')
          this.fetch()
        }).catch((err) => {
          console.log(err)
          this.$message.error(err.toString())
        })
      }
      tool.deleteConfirm(this, destroy)
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

  const base = {
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
