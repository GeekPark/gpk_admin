<template lang="pug">
#admin-posts.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="addPost") 添加文章
    .filter
      el-button(type='text',
                @click='params.state_eq = "published"',
                v-bind:class='{active: params.state_eq === "published"}') 已发布
      | /
      el-button(type='text',
                @click='params.state_eq = "unpublished"',
                v-bind:class='{active: params.state_eq === "unpublished"}') 草稿
      el-date-picker(v-model="daterange"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions")
      el-input(placeholder="按文章标题或栏目搜索",
               v-model="params.title_or_column_title_cont",
               clearable,
               @keyup.enter.native='search')
        // i(slot="suffix" class="el-input__icon el-icon-search" @click="search")
      el-button(type='primary', @click='search') 搜索
  el-table(:data='listData.posts' border)
    el-table-column(prop='id', label='ID', width="70")
    el-table-column(prop='title', label='标题')
      template(slot-scope='scope')
        a(@click='clickArticle(scope.row)') {{scope.row.title}}
    el-table-column(props='authors', label='作者', width="130")
      template(slot-scope='scope')
        span(v-for='author in scope.row.authors') {{author.nickname + ' '}}
    el-table-column(prop='column_title', label='栏目', width="110")
    el-table-column(prop='published_at', label='发布时间', width="140", v-if='params.state === "published"')
    el-table-column(prop='state', label=' 状态', width="70")
      template(slot-scope='scope')
        span(v-bind:class='{unpublished: scope.row.state === "草稿"}') {{scope.row.state}}
    el-table-column(prop='click_count', label=' PV', width="70")
    el-table-column(label='操作', width="130")
      template(slot-scope='scope')
        el-button(type='text',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(type='text',
                  @click='handleDestroy(scope.$index, scope.row)') 删除
        el-button(type='text',
                  v-if='scope.row.state !== "草稿"',
                  @click='recommendPost(scope.row)') {{scope.row.recommended === false ? "推荐": "取消推荐"}}
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
import config from '../../config.js'
import smeditor from 'smeditor'

const url = 'admin/posts'

export default {
  components: {
    'smeditor': smeditor
  },
  data () {
    return {
      daterange: [],
      params: {
        title_or_column_title_cont: '',
        state_eq: this.$route.query.state || 'published'
      },
      currentPage: 1,
      listData: {
        posts: [],
        meta: {
          total_count: 0,
          limit_value: 0
        }
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
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
    'daterange': function (val) {
      if (val) {
        this.params.start_date = val[0]
        this.params.end_date = val[1]
      } else {
        delete this.params.start_date
        delete this.params.end_date
      }
    },
    'params.state_eq': function () {
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
.filter .el-date-editor--daterange.el-input__inner
  width 240px
  margin-left 20px
</style>
