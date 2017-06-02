<template lang="jade">
#admin-posts.admin
  .title
    h1 {{$route.meta.title}}
    el-button(type='text', @click="$router.push('/ push/new')") 添加推送
  el-table(:data='listData.ads' border)
    el-table-column(prop='', label='内容')
    el-table-column(prop='', label='发送时间', width="200")
    el-table-column(prop='', label='状态', width="100")
    el-table-column(prop='', label='iOS点击', width="150")
    el-table-column(prop='', label='Android点击', width="150")
    el-table-column(label='操作', width="100")
      template(scope='scope')
        el-button(type='text',
                  @click='handleDestroy(scope.$index, scope.row, listData.posts)') 删除
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
  url: 'admin/ads',
  data: {
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

</style>
