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
    el-table-column(type="index", width="100")
    el-table-column(prop='id', label='id(test)', width="100")
    el-table-column(prop='title', label='标题', width="200")
    el-table-column(prop='description', label='描述', width="300")
    el-table-column(prop='published_at', label='发布时间', width="200")
    el-table-column(prop='', label='类型')
    el-table-column(prop='', label='文章是否显示在首页')
    el-table-column(label='操作', width="150")
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
        if (el.state === 'published') {el.state = '已发布'}
        if (el.description.length >= 30) {
          el.description = `${el.description.slice(0, 30)}...`
        }
        el.published_at = tool.moment(el.published_at)
      })
    }
  }
});
export default vm
</script>

<style lang="stylus" scoped>

</style>
