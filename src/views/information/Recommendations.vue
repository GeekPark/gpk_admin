<template lang="jade">
#admin-columns.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="addRecommend") 添加推荐
    .filter
      el-input(placeholder="搜索",
               icon="search",
               v-model="params.title",
               @keyup.enter.native='fetch',
               :on-icon-click="fetch")
  el-table(:data='listData.recommendations' border)
    el-table-column(prop='product_name', label='产品名称')
    el-table-column(prop='author', label='作者', width="140")
      template(scope='scope')
        span(v-for='item in scope.row.author') {{item.nickname}}
    el-table-column(prop='product_category', label='类别', width="100")
    el-table-column(prop='created_at', label='发布时间', width="170")
    el-table-column(prop='', label='分享数量', width="100")
    el-table-column(label='操作', width="120")
      template(scope='scope')
        el-button(type='text',
                  @click='handleEdit(scope.row)') 编辑
        el-button(type='text',
                  @click='handleDestroy(scope.row)') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='currentPage',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next, jumper',
                :total='listData.meta.total_count')
</template>

<script>
import api from 'stores/api'
import tool from 'tools'

const url = 'admin/recommendations'

export default {
  data () {
    return {
      params: {
        title: ''
      },
      currentPage: 1,
      listData: {
        recommendations: [],
        meta: {
          total_count: 0,
          limit_value: 0
        }
      }
    }
  },
  methods: {
    handleSizeChange (index, val) {
      console.log(`每页 ${index} 条`)
    },
    handleCurrentChange (index, val) {
      this.currentPage = index
      this.fetch()
      console.log(`当前页: ${index}`)
    },
    fetch () {
      api.get(url).then(result => {
        console.log(result)
        this.listData = result.data
      }).catch(err => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    handleDestroy (val) {
      const destroy = () => {
        api.delete(`${url}/${val.id}`).then(result => {
          this.$message.success('success')
          this.fetch()
        }).catch(err => {
          console.log(err)
          this.$message.error(err.toString())
        })
      }
      tool.deleteConfirm(this, destroy)
    },
    handleEdit (row) {
      this.$router.push(`recommendations/new?id=${row.id}`)
    },
    addRecommend () {
      this.$router.push('/recommendations/new')
    }
  },
  watch: {
    'listData.recommendations': function (val) {
      val.forEach(el => {
        el.created_at = tool.moment(el.created_at)
      })
    },
    'params.state': function () {
      this.search()
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>

</style>
