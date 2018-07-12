<template lang="pug">
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
      template(slot-scope='scope')
        a(@click='clickColumn(scope.row)') {{scope.row.title}}
    el-table-column(prop='authors', label='作者', width='110')
      template(slot-scope='scope')
        span(v-for='item in scope.row.authors', :key='item.nickname') {{item.nickname}}
    el-table-column(prop='column.title', label='栏目', width="130")
    el-table-column(prop='', label='发布时间', width="180")
        template(slot-scope='scope')
          span {{scope.row.published_timestamp}}
    el-table-column(label='操作', width="100")
        template(slot-scope='scope')
          el-button(type='text',
                    @click='handleDestroy(scope.$index, scope.row)') 移除
          el-button(type='text',
                    @click='stickTop(scope.$index, scope.row)') 置顶
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
    stickTop (index, val) {
      api.patch(`/admin/posts/${val.id}/stick_to_top`, {
        stick_at: new Date()
      })
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
        if (result.data.message) {
          this.$message.error(result.data.message)
        }
        this.fetch()
        this.post = 'deleted'
      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
    'topic': function (val) {
      val.created_at = tool.moment(val.created_at)
      val.posts.forEach(el => {
        el.published_timestamp = tool.moment(new Date(el.published_timestamp * 1000))
      })
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
