<template lang="jade">
#admin-topics.admin
  .admin-header
    .title
      h1 {{topic.title}} 专题
      //- el-button(type='text', @click="addTopic") 添加专题
    .filter
      search-post(:callback='searchPost', :post='post')
      el-button(type="primary", @click='addToTopic') 添加
  el-table(:data='topic.posts' border)
    el-table-column(prop='title', label='标题')
      template(scope='scope')
        a(@click='clickColumn(scope.row)') {{scope.row.title}}
    el-table-column(prop='authors', label='作者', width='110')
      template(scope='scope')
        span(v-for='item in scope.row.authors', :key='item.nickname') {{item.nickname}}
    el-table-column(prop='post_count', label='栏目', width="90")
    el-table-column(prop='', label='发布时间', width="180")
        template(scope='scope')
          span {{topic.created_at}}
    el-table-column(label='操作', width="70")
        template(scope='scope')
          el-button(type='text',
                    @click='handleDestroy(scope.$index, scope.row)') 移除
  el-pagination(@size-change='handleSizeChange',
              @current-change='handleCurrentChange',
              :current-page='currentPage',
              :page-size='pageSize',
              layout='total, prev, pager, next, jumper',
              :total='topic.post_count')
</template>

<script>
import api from 'stores/api'
import tool from '../../tools'
import config from '../../config'
export default {
  data () {
    return {
      topic: {
        posts: []
      },
      post: '',
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    fetch () {
      api.get(`/admin/topics/${this.$route.query.id}`, {params: {page: this.currentPage}}).then(result => {
        this.topic = result.data.topic
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
    handleDestroy (index, val) {
      api.delete(`/admin/topics/${this.$route.query.id}/${val.id}`)
      .then(result => {
        this.fetch()
      })
    },
    searchPost (val) {
      this.post = val
    },
    clickColumn (row) {
      window.open(`${config.main}/news/${row.id}`)
    },
    addToTopic () {
      api.post(`/admin/topics/${this.$route.query.id}/members`,
        {post_ids: [this.post]})
      .then(result => {
        this.fetch()
        this.post = 'deleted'
      })
    }
  },
  watch: {
    'topic': function (val) {
      val.created_at = tool.moment(val.created_at)
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style lang="stylus">
#admin-topics .filter #search-post
    display inline
    width 400px
    max-width 500px
    .el-input
      width calc(100% - 30px)
</style>
