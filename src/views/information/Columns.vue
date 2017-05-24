<template lang="jade">
#admin-columns.admin
  .title
    h1 {{$route.meta.title}}
  .filter
    el-input(placeholder="搜索",
             icon="search",
             v-model="input2",
             :on-icon-click="handleIconClick")
  el-table(:data='listData.columns' border)
    el-table-column(type="index", width="100")
    el-table-column(prop='id', label='id(test)', width="100")
    el-table-column(prop='title', label='标题')
    el-table-column(prop='description', label='描述', width="300")
    el-table-column(prop='published_at', label='发布时间', width="200")
    el-table-column(prop='', label='类型')
    el-table-column(prop='', label='文章是否显示在首页')
    el-table-column(label='操作')
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
        if (el.state === 'published') {el.state = '已发布'}
        el.published_at = tool.moment(el.published_at)
      })
    }
  }
});
export default vm
</script>

<style lang="stylus" scoped>

</style>
