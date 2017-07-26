<template lang="jade">
#admin-columns.admin
  .title
    h1 {{$route.meta.title}}
    el-button(type='text', @click="$router.push('/columns/new')") 添加栏目
  .filter
    el-input(placeholder="搜索",
             icon="search",
             v-model="params.title",
             :on-icon-click="search")
  el-table(:data='listData.columns' border)
    el-table-column(prop='title', label='栏目名称', width="200")
    el-table-column(prop='description', label='描述', width="300")
    el-table-column(prop='', label='是否显示在首页', width="150")
    el-table-column(prop='published_at', label='添加时间', width="200")
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
    searchText: '',
    params: {
      title: ''
    }
  },
  methods: {
    handleEdit (index, row) {
      this.$router.push(`columns/new?id=${row.id}`)
    },
    search () {
      this.fetch()
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
