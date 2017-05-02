<template lang="jade">
#admin-posts.admin
  el-table(:data='listData.posts',)
    el-table-column(type="index", width="100")
    el-table-column(prop='id', label='id', width="100")
    el-table-column(prop='title', label='标题'  )
    el-table-column(prop='state', label=' 状态', width="100")
    el-table-column(prop='column_title', label=' 专栏')
    el-table-column(prop='published_at', label='发送时间', width="200")
    el-table-column(label='操作')
      template(scope='scope')
        el-button(size='small',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(size='small',
                  @click='handlePreview(scope.$index, scope.row)') 预览
        el-button(size='small',
                  type='danger',
                  @click='handleDestroy(scope.$index, scope.row, listData.posts)') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='currentPage',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next',
                :total='listData.meta.total_count')
</template>

<script>

import Base from '../base'
const vm = Base({
  url: 'admin/posts',
  methods: {
    handleEdit (index, row) {
      this.$router.push(`posts/new?id=${row.id}`)
    }
  },
  watch: {
    'listData.posts': function (val) {
      val.forEach(el => {
        if (el.state === 'published') {el.state = '已发布'}
      })
    }
  }
});
export default vm
</script>

<style lang="stylus" scoped>
.el-table, .el-pagination
  margin-top 20px
.el-input
  width 40%
.add-btn
  margin-left 30px
.el-table
  margin-top 30px
</style>
