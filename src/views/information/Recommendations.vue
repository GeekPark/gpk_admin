<template lang="jade">
#admin-columns.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="$router.push('/recommendations/new')") 添加推荐
    .filter
      el-input(placeholder="搜索",
               icon="search",
               v-model="params.title",
               :on-icon-click="search")
  el-table(:data='listData.columns' border)
    el-table-column(prop='', label='产品名称')
    el-table-column(prop='', label='作者', width="100")
    el-table-column(prop='', label='类别', width="200")
    el-table-column(prop='', label='发布时间', width="100")
    el-table-column(prop='', label='分享数量', width="100")
    el-table-column(prop='', label='LinkedIn分享', width="100")
    el-table-column(prop='', label='总计', width="100")
    el-table-column(label='操作', width="120")
      template(scope='scope')
        el-button(type='text',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(type='text',
                  @click='handleDestroy(scope.$index, scope.row, listData.columns)') 删除
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
    handleEdit (index, row) {
      this.$router.push(`recommendations/new?id=${row.id}`)
    },
    search () {
      api.get(url, {params: this.params}).then(result => {
        console.log(result)
        this.listData = result.data
      }).catch((err) => {
        console.log(err)
      })
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
      api.delete(`${url}/${val.id}`).then((result) => {
        this.$message.success('success')
        this.fetch()
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    recommendPost (row) {
      api.post(`${url}/${row.id}/toggle_recommended`).then(result => {
        this.fetch()
        console.log(result)
      })
    },
    addPost () {
      window.open('/recommendations/new?content_type=html')
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
  beforeMount () {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>

</style>
