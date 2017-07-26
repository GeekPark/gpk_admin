<template lang="jade">
#admin-columns.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="$router.push('/recommendations/new')") 添加推荐
    .filter
      el-input(placeholder="搜索",
               icon="search",
               v-model="input2",
               :on-icon-click="handleIconClick")
  el-table(:data='listData.columns' border)
    el-table-column(prop='', label='产品名称')
    el-table-column(prop='', label='作者', width="100")
    el-table-column(prop='', label='类别', width="200")
    el-table-column(prop='', label='发布时间', width="100")
    el-table-column(prop='', label='分享数量', width="100")
    el-table-column(prop='', label='LinkedIn分享', width="100")
    el-table-column(prop='', label='总计', width="100")
    el-table-column(label='操作', width="120")
      template(scope='scope')
        el-button(type='text',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(type='text',
                  @click='handleDestroy(scope.$index, scope.row, listData.columns)') 删除
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
const vm = Base({
  url: 'admin/columns',
  data: {
    recommend: false,
    input2: ''
  },
  methods: {
    handleEdit (index, row) {
      this.$router.push(`columns/new?id=${row.id}`)
    },
    handleIconClick () {

    }
  },
  watch: {
    'listData.columns': function (val) {
      val.forEach(el => {
        if (el.state === 'published') { el.state = '已发布' }
        el.published_at = tool.moment(el.published_at)
      })
    }
  }
})
export default vm
</script>

<style lang="stylus" scoped>

</style>
