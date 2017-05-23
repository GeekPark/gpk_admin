<template lang="jade">
#admin-posts.admin
  .title
    h1 {{$route.meta.title}}
    el-button(type='text', @click="$router.push('/posts/new')") 添加文章
  .filter
    el-button(type='text', @click='currentState = "published"') 全部
    | /
    el-button(type='text', @click='currentState = "unpublished"') 草稿
    | /
    el-button(type='text', @click='currentState = "closed"') 已删除
    el-input(placeholder="搜索",
             icon="search",
             v-model="searchText",
             :on-icon-click="search")
  el-table(:data='listData.posts' border)
    el-table-column(type="index", width="100")
    el-table-column(prop='id', label='id(test)', width="100")
    el-table-column(prop='title', label='标题')
    el-table-column(prop='author', label='作者')
    el-table-column(prop='column_title', label='栏目')
    el-table-column(prop='published_at', label='发布时间', width="200")
    el-table-column(prop='state', label=' 状态', width="100")
    el-table-column(prop='pv', label=' PV', width="100")
    el-table-column(label='操作')
      template(scope='scope')
        el-button(type='text',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(type='text',
                  @click='handleDestroy(scope.$index, scope.row, listData.posts)') 删除
    el-table-column(label='加入推荐')
      template(scope='scope')
        el-switch(v-model="recommend" on-text="" off-text="")
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
const vm = Base({
  url: 'admin/posts',
  data: {
    recommend: false,
    searchText: '',
    currentState: 'published',
  },
  methods: {
    handleEdit (index, row) {
      this.$router.push(`posts/new?id=${row.id}`)
    },
    search () {
      api.get('admin/posts', {params: {
        title: this.searchText,
        state: this.currentState
      }}).then(result => {
        console.log(result)
        this.listData = result.data
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  watch: {
    'listData.posts': function (val) {
      val.forEach(el => {
        if (el.state === 'published') {el.state = '已发布'}
        el.published_at = tool.moment(el.published_at)
      })
    },
    'currentState': function () {
      this.search()
    }
  }
});
export default vm
</script>

<style lang="stylus" scoped>

</style>
