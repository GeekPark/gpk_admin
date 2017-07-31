<template lang="jade">
#admin-comments.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
    .filter
      el-input(placeholder="搜索",
               icon="search",
               v-model="params.title",
               :on-icon-click="search")
  el-table(:data='listData.comments',border)
    el-table-column(prop='commenter_info.nickname', label='用户名', width="100")
    el-table-column(prop='content', label='内容')
    el-table-column(label='来源')
      template(scope='scope')
        a() {{scope.row.commentable_title}}
    el-table-column(prop='created_at', label='创建时间', width="170")
    el-table-column(label='操作', width="110")
      template(scope='scope')
        el-button(type='text',
                  @click='search(scope.row)') 删除
        el-button(type='text',
                  @click='search(scope.row)') 禁言
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

const url = 'admin/comments'

export default {
  data () {
    return {
      params: {
        title: '',
        state: 'all'
      },
      currentPage: 1,
      listData: {
        comments: [],
        meta: {
          total_count: 0,
          limit_value: 0
        }
      }
    }
  },
  methods: {
    handleEdit (index, row) {
      this.$router.push(`comments/new?id=${row.id}`)
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
      window.open('/comments/new?content_type=html')
    }
  },
  watch: {
    'listData.comments': function (val) {
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
