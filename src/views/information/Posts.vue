<template lang="jade">
#admin-posts.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="addPost") 添加文章
    .filter
      el-button(type='text',
                @click='params.state = "published"',
                v-bind:class='{active: params.state === "published"}') 已发布
      | /
      el-button(type='text',
                @click='params.state = "unpublished"',
                v-bind:class='{active: params.state === "unpublished"}') 草稿
      el-input(placeholder="搜索",
               icon="search",
               v-model="params.title",
               @keyup.enter.native='fetch',
               :on-icon-click="search")
  el-table(:data='listData.posts' border)
    el-table-column(prop='title', label='标题')
      template(scope='scope')
        a(@click='clickArticle(scope.row)') {{scope.row.title}}
    el-table-column(props='authors', label='作者', width="100")
      template(scope='scope')
        span(v-for='author in scope.row.authors') {{author.nickname + ' '}}
    el-table-column(prop='column_title', label='栏目', width="110")
    el-table-column(prop='published_at', label='发布时间', width="180", v-if='params.state === "published"')
    el-table-column(prop='state', label=' 状态', width="80")
      template(scope='scope')
        span(v-bind:class='{unpublished: scope.row.state === "草稿"}') {{scope.row.state}}
    el-table-column(prop='views', label=' PV', width="70")
    el-table-column(label='操作', width="170")
      template(scope='scope')
        el-button(type='text',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(type='text',
                  @click='handleDestroy(scope.$index, scope.row)') 删除
        el-button(type='text',
                  @click='recommendPost(scope.row)') {{scope.row.recommended === false ? "推荐": "取消推荐"}}
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='currentPage',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next, jumper',
                :total='listData.meta.total_count')
</template>

<script>
import tool from 'tools'
import api from 'stores/api'
import config from '../../config.js'

const url = 'admin/posts'

export default {
  data () {
    return {
      params: {
        title: '',
        state: 'published'
      },
      currentPage: 1,
      listData: {
        posts: [],
        meta: {
          total_count: 0,
          limit_value: 0
        }
      }
    }
  },
  methods: {
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
      const destroy = () => {
        api.put(`${url}/${val.id}`, {state: 'closed'}).then((result) => {
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
      this.$router.push(`posts/new?id=${row.id}`)
    },
    clickArticle (row) {
      if (row.state === '已发布') {
        window.open(`${config.main}/news/${row.id}`)
      } else {
        api.get(`posts/${row.id}/preview`).then(result => {
          window.open(result.data.url)
        })
      }
    },
    recommendPost (row) {
      api.post(`${url}/${row.id}/toggle_recommended`).then(result => {
        this.fetch()
        console.log(result)
      })
    },
    addPost () {
      this.$router.push('/posts/new?content_type=html')
    }
  },
  watch: {
    'listData.posts': function (val) {
      val.forEach(el => {
        el.published_at = tool.moment(el.published_at)
        if (el.state === 'published') { el.state = '已发布' }
        if (el.state === 'unpublished') { el.state = '草稿'; el.published_at = '' }
        if (el.state === 'closed') { el.state = '已删除' }
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
.active
  color #7F7F7F
.unpublished
  color #FF0000


</style>
