<template lang="pug">
#admin-products.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="addNew") 添加商品
  el-table(:data='listData.products' border)
    el-table-column(prop='id', label='ID', width="50")
    el-table-column(prop='name', label='商品名称')
    el-table-column(prop='market_price', label='市场价', width="110")
    el-table-column(prop='price', label='兑换积分', width="110")
    el-table-column(prop='published_at', label='添加时间', width="140")
    el-table-column(prop='inventory', label='当前库存', width="90")
    el-table-column(label='操作', width="120")
      template(slot-scope='scope')
        el-button(type='text',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(type='text',
                  @click='handleDestroy(scope.$index, scope.row)') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                background,
                :current-page='currentPage',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next, jumper',
                :total='listData.meta.total_count')
</template>

<script>
import tool from 'tools'
import api from 'stores/api'
// import config from '../../config.js'

const url = 'admin/products'

export default {
  data () {
    return {
      params: {
      },
      currentPage: this.$route.query.page ? parseInt(this.$route.query.page) : 1,
      listData: {
        products: [],
        meta: {
          total_count: 0,
          limit_value: 0
        }
      }
    }
  },
  methods: {
    search () {
      this.currentPage = 1
      this.fetch()
    },
    handleSizeChange (index, val) {
      console.log(`每页 ${index} 条`)
    },
    handleCurrentChange (index, val) {
      this.currentPage = index
      this.fetch()
      console.log(`当前页: ${index}`)
    },
    fetch () {
      const params = Object.assign({page: this.currentPage}, this.params)
      api.get(url, {params: params}).then((result) => {
        console.log(result)
        this.listData = result.data
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    handleDestroy (index, val, list) {
      const destroy = () => {
        api.delete(`${url}/${val.id}`).then((result) => {
          this.$message.success('success')
          this.fetch()
        }).catch((err) => {
          console.log(err)
          this.$message.error(err.toString())
        })
      }
      tool.deleteConfirm(this, destroy)
    },
    handleEdit (index, row) {
      this.$router.push(`products/new?id=${row.id}&page=${this.currentPage}`)
    },
    addNew () {
      this.$router.push('/products/new')
    }
  },
  watch: {
    'listData.products': function (val) {
      val.forEach(el => {
        el.published_at = tool.moment(el.published_at)
      })
    }
  },
  beforeMount () {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
.active
  color #7F7F7F
.unpublish
  color #FF0000


</style>
