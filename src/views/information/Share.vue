<template lang="jade">
#admin-posts.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
    .filter
      el-input(placeholder="搜索",
               icon="search",
               v-model="input2",
               :on-icon-click="handleIconClick")
  el-table(:data='listData.posts' border)
    el-table-column(prop='title', label='标题')
    el-table-column(prop='author', label='作者', width="100")
    el-table-column(prop='published_at', label='发布时间', width="180")
    el-table-column(prop='', label='微信分享', width="100")
    el-table-column(prop='', label='Twitter分享', width="100")
    el-table-column(prop='', label='LinkedIn分享', width="100")
    el-table-column(prop='', label='总计', width="100")
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='currentPage',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next, jumper',
                :total='listData.meta.total_count')
</template>

<script>
import Base from '../base'
import tool from 'tools'
const vm = Base({
  url: 'admin/posts',
  data: {
    recommend: false,
    input2: ''
  },
  methods: {
    handleEdit (index, row) {
      this.$router.push(`posts/new?id=${row.id}`)
    },
    handleIconClick () {
    }
  },
  watch: {
    'listData.posts': function (val) {
      val.forEach(el => {
        if (el.state === 'published') { el.state = '已发布' }
        el.published_at = tool.moment(el.published_at)
      })
    }
  }
})
export default vm
</script>

<style lang="stylus" scoped>

</style>
