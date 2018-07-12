<template lang="pug">
#index.admin
  el-row.index-header(:gutter='20')
    el-col(:span='6')
      .item.bg-purple
        img.icon(src='../assets/imgs/index_article.png')
        .count
          h1 {{postCount}}
          span 昨日新增文章
    el-col(:span='6')
      .item.bg-purple
        img.icon(src='../assets/imgs/index_comment.png')
        .count
          h1 {{commentCount}}
          span 昨日新增评论
    el-col(:span='6')
      .item.bg-purple
        img.icon(src='../assets/imgs/index_user.png')
        .count
          h1 {{userCount}}
          span 昨日新增用户
  el-row.index-articles(:gutter='40')
    el-col(:span='12')
      h1 最新文章
      .item.pointer(v-for='item in posts', @click='handleEdit(item)')
        p {{item.title}}
    el-col(:span='12')
        h1 7日热门排行
        .item(v-for='item in hotWeek')
          p {{item.title}}
          span {{item.views}}
  el-row.index-quickly(:gutter="20")
    el-col
      h1 快速访问
    el-col(v-for='item in quickly',
           :key='item.id',
           :span='Math.floor((24 / quickly.length))')
      .item.bg-purple
        a(:href='item.url', target='_blank').a-title-text {{item.title}}
</template>

<script>
import api from 'stores/api'

export default {
  data () {
    return {
      quickly: [{
        title: '活动站后台',
        url: 'http://events.geekpark.net/admin'
      }, {
        title: '极光推送',
        url: 'https://www.jiguang.cn/dev/#/app/list#dev'
      }, {
        title: 'iTunes Connect',
        url: 'https://itunesconnect.apple.com'
      }, {
        title: '极客公园官网',
        url: 'http://geekpark.net'
      }],
      postCount: 0,
      commentCount: 0,
      userCount: 0,
      hotWeek: [],
      posts: []
    }
  },

  methods: {
    fetch () {
      api.get('admin/posts?state_eq=published').then(result => {
        this.posts = result.data.posts.splice(0, 7)
      })
      api.get('admin/posts/yesterday').then(result => {
        this.postCount = result.data.meta.total_count
      })
      api.get('admin/comments/yesterday').then(result => {
        this.commentCount = result.data.meta.total_count
      })
      api.account.get('admin/users/yesterday').then(result => {
        this.userCount = result.data.meta.total_count
      })
      api.get('posts//hot_in_week').then(result => {
        this.hotWeek = result.data.posts
      })
    },
    handleEdit (item) {
      this.$router.push(`/posts/new/?content_type=html&id=${item.id}`)
    }
  },
  beforeMount () {
    this.fetch()
  }
}

</script>

<style lang="stylus" scoped>
.el-col
  margin-bottom 20px

.index-header .el-col .item
  // border 1px solid #B2B2B2
  height 90px
  display flex
  justify-content space-between
  align-items center
  padding 0 20px
  border-radius 4px
  h1
    padding-left 10px
    font-size 30px
    margin-bottom 5px
    margin-top 5px
  span
    font-size 14px
.index-articles
  min-height 300px
.index-quickly .item
  height 90px
  display flex
  justify-content center
  align-items center
  border-radius 4px
  a
    font-size 18px
.index-articles
  .pointer
    cursor pointer
  .item
    display flex
    justify-content space-between
    align-items center
  p
    font-size 14px
    width 100%
    white-space nowrap
    text-overflow ellipsis
    overflow hidden
    margin 0
    line-height 30px
</style>
