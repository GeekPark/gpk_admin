<template lang="jade">
#admin-posts.admin
  .title
    h1 {{$route.meta.title}}
    el-button(type='text', @click="$router.push('/posts/new')") 添加文章
  .filter

    el-button(type='text', @click='params.state = "all"') 全部
    | /
    el-button(type='text', @click='params.state = " published"') 已发布
    | /
    el-button(type='text', @click='params.state = "unpublished"') 草稿
    | /
    el-button(type='text', @click='params.state = "closed"') 已删除
    el-input(placeholder="搜索",
             icon="search",
             v-model="params.title",
             :on-icon-click="search")
  el-table(:data='listData.posts' border)
    el-table-column(prop='title', label='标题', width="200")
    el-table-column(prop='authors.nickname', label='作者', width="100")
    el-table-column(prop='column_title', label='栏目', width="150")
    el-table-column(prop='published_at', label='发布时间', width="180")
    el-table-column(prop='state', label=' 状态', width="80")
    el-table-column(prop='views', label=' PV', width="100")
    el-table-column(label='操作', width="110")
      template(scope='scope')
        el-button(type='text',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(type='text',
                  @click='handleDestroy(scope.$index, scope.row, listData.posts)') 删除
    el-table-column(label='加入推荐', width="90")
      template(scope='scope')
        el-switch(v-model="scope.row.recommended", @change='recommendPost(scope.row)', on-text="",
  off-text="")
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
import api  from 'stores/api'

const url = 'admin/posts'

export default {
  data () {
    return {
      params: {
        title: '',
        state: 'all',
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
    handleEdit (index, row) {
      this.$router.push(`posts/new?id=${row.id}`)
    },
    search () {
      api.get(url, {params: this.params}).then(result => {
        console.log(result)
        this.listData = result.data
      }).catch((err) => {
        console.log(err)
      })
    },
    handleSizeChange(index, val) {
      console.log(`每页 ${index} 条`)
    },
    handleCurrentChange(index, val) {
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
    handleDestroy(index, val, list) {
      api.put(`${url}/${val.id}`, {state: 'closed'}).then((result) => {
        this.$message.success('success')
        list.splice(index, 1)
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    recommendPost(row) {
      api.post(`${url}/${row.id}/toggle_recommended`).then(result => {
        this.fetch()
        console.log(result)
      })
    }
  },
  watch: {
    'listData.posts': function (val) {
      val.forEach(el => {
        el.published_at = tool.moment(el.published_at)
        if (el.state === 'published') {el.state = '已发布'}
        if (el.state === 'unpublished') {el.state = '草稿'; el.published_at = ''}
        if (el.state === 'closed') {el.state = '已删除'}

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

<style lang="stylus">

</style>
