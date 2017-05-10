<template lang="jade">
#admin-posts.admin
  .title
    h1 {{$route.meta.title}}
    el-button(type='text', @click="$router.push('/posts/new')") 添加文章
  .filter
    el-button(type='text', @click='handleEdit()') 全部
    | /
    el-button(type='text', @click='handleEdit()') 草稿
    | /
    el-button(type='text', @click='handleEdit()') 已删除
    el-input(placeholder="搜索",
             icon="search",
             v-model="input2",
             :on-icon-click="handleIconClick")
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
                layout='total, prev, pager, next',
                :total='listData.meta.total_count')
</template>

<script>

import Base from '../base'
import tool from '../../tools'
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
        if (el.state === 'published') {el.state = '已发布'}
        el.published_at = tool.moment(el.published_at)
      })
    }
  }
});
export default vm
</script>

<style lang="stylus" scoped>
.title
  float left
  h1
    display inline-block
    margin-right 20px


.filter
  margin-bottom 20px
  float right
  .el-button
    margin-left 0px
  .el-input
    margin-left 20px
    width 200px
</style>