<template lang="jade">
#admin-comments.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
    .filter
      el-input(placeholder="搜索",
               icon="search",
               v-model="params.content",
               @keyup.enter.native='fetch',
               :on-icon-click="fetch")
  el-table(:data='listData.comments',border)
    el-table-column(prop='commenter_info.nickname', label='用户名', width="100")
    el-table-column(prop='content', label='内容')
    el-table-column(label='来源')
      template(scope='scope')
        a(@click='clickCommentable(scope.row)') {{scope.row.commentable_title}}
    el-table-column(prop='created_at', label='创建时间', width="170")
    el-table-column(label='操作', width="140")
      template(scope='scope')
        el-button(type='text',
                  @click='handleDestroy(scope.row)') 删除
        el-button(type='text',
                  @click='handleBlock(scope.row)',
                  v-if='scope.row.commenter_info') {{scope.row.commenter_info.banned ? "取消禁言" : "禁言"}}
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
import config from '../../config.js'

const url = 'admin/comments'

export default {
  data () {
    return {
      params: {
        content: ''
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
    clickCommentable (row) {
      window.open(`${config.main}/news/${row.commentable_id}#comment`)
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
    handleDestroy (row) {
      api.delete(`${url}/${row.id}`).then((result) => {
        this.$message.success('success')
        this.fetch()
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    handleBlock (row) {
      const str = row.commenter_info.banned ? 'unban' : 'ban'
      api.account.post(`admin/users/${row.commenter_info.id}/${str}`)
      .then(result => {
        console.log(result)
        this.fetch()
      })
    }
  },
  watch: {
    'listData.comments': function (val) {
      val.forEach(el => {
        el.created_at = tool.moment(el.created_at)
        if (Array.isArray(el.commenter_info)) {
          el.commenter_info = el.commenter_info[0]
          el.commenter_info.banned = el.commenter_info !== null ? (el.commenter_info.banned || false) : false
        }
      })
    }
  },
  beforeMount () {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>

</style>
