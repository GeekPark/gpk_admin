<template lang="jade">
#admin-comments.admin
  h2 状态
  el-radio-group(v-model="filterParams.state")
    el-radio-button(label="") 所有
    el-radio-button(label="normal") 正常
    el-radio-button(label="spam") 已屏蔽
  &nbsp &nbsp &nbsp
  el-radio-group(v-model="filterParams.commentable_type")
    el-radio-button(label="") 所有
    el-radio-button(label="Post") 文章
    el-radio-button(label="Ad") 广告
  br
  br
  el-input(placeholder="请输入内容",
           icon="search",
           v-model="filterParams.content",
           :on-icon-click="handleFilter")
  el-table(:data='listData.comments',)
    el-table-column(type="index", width="100")
    el-table-column(prop='id', label='id', width="100")
    el-table-column(prop='content', label='内容')
    el-table-column(prop='state', label='状态', width="100")
    el-table-column(label='来源')
      template(scope='scope')
        a() {{scope.row.commentable_title}}
    el-table-column(label='操作')
      template(scope='scope')
        el-button(size='small',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(size='small',
                  type='danger',
                  @click='handleDestroy(scope.$index, scope.row, listData.comments)') 删除
        el-button(size='small',
                  type='danger',
                  @click='handleFilter(scope.$index, scope.row)') 加入过滤器
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='currentPage',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next',
                :total='listData.meta.total_count')
</template>

<script>
import Base from '../base'
import api  from '../../stores/api'

const vm = Base({
  url: 'admin/comments',
  filterUrl: 'admin/comments/filter',
  data: {
    filterParams: {
      content: '',
      state: '',
      commentable_type: '',
    },
  },
  methods: {
  },
  watch: {
    'state': function (val) {
      handleFilter()
    },
    'commentable_type': function (val) {
      handleFilter()
    }
  }
})
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
