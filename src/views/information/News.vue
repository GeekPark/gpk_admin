<template lang="jade">
#admin-columns.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="addNews") 添加快讯
    .filter
      el-button(type='text',
                @click='params.state = "unpublished"',
                v-bind:class='{active: params.state === "unpublished"}') 新闻源
      | /
      el-button(type='text',
                @click='params.state = "published"',
                v-bind:class='{active: params.state === "published"}') 已发布
      el-input(placeholder="搜索",
               icon="search",
               v-model="params.title",
               @keyup.enter.native='fetch',
               :on-icon-click="fetch")
  el-table(:data='listData.news' border)
    el-table-column(prop='title', label='标题')
      template(scope='scope')
        a(:href='scope.row.source_link', target='_blank') {{scope.row.title}}
    el-table-column(prop='date', label='抓取时间', width="170", v-if='params.state === "unpublished"')
    el-table-column(prop='published_at', label='发布时间', width="170", v-else)
    el-table-column(prop='news_count', label='新闻源数量', width='110', v-if='params.state === "unpublished"')
    el-table-column(label='操作', width="120")
      template(scope='scope')
        el-button(type='text',
                  @click='handleEdit(scope.row)') 编辑
        el-button(type='text',
                  @click='handleDestroy(scope.row)', v-if='params.state === "published"') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='params.page',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next, jumper',
                :total='listData.meta.total_count')
</template>

<script>
import api from 'stores/api'
import tool from 'tools'

const url = 'admin/news'

export default {
  data () {
    return {
      params: {
        title: '',
        state: this.$route.query.state || 'unpublished',
        page: 1
      },
      listData: {
        news: [],
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
      this.params.page = index
      console.log(`当前页: ${index}`)
    },
    fetch () {
      const suffix = this.params.state === 'published' ? '/published' : ''
      api.get(url + suffix, {params: this.params}).then(result => {
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
      this.$router.push(`news/new?id=${row.id}`)
    },
    addNews () {
      this.$router.push('/news/new')
    }
  },
  watch: {
    'listData.news': function (val) {
      val.forEach(el => {
        el.date = tool.moment(getLocalTime(el.date_timestamp))
        el.published_at = tool.moment(el.published_at)
      })
    },
    'params.state': function () {
      this.listData.news = []
      this.fetch()
    },
    'params.page': function () {
      this.fetch()
    }
  },
  mounted () {
    this.fetch()
  }
}
function getLocalTime (nS) {
  return new Date(parseInt(nS) * 1000)
}
</script>

<style lang="stylus" scoped>
.active
  color #7F7F7F
.unpublished
  color #FF0000
a
  color #000

</style>
