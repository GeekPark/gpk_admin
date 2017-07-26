<template lang="jade">
#admin-topics.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="addTopic") 添加专题
    .filter
      el-input(placeholder="搜索",
               icon="search",
               v-model="input2",
               :on-icon-click="handleIconClick")
  el-table(:data='listData.topics' border)
    el-table-column(prop='title', label='专题名称', width="150")
    el-table-column(prop='description', label='专题描述')
    el-table-column(prop='post_count', label='文章数量', width="90")
    el-table-column(prop='published_at', label='添加时间', width="160")
    el-table-column(label='操作', width="110")
        template(scope='scope')
          el-button(type='text',
                    @click='handleEdit(scope.$index, scope.row)') 编辑
          el-button(type='text',
                    @click='handleDestroy(scope.$index, scope.row, listData.topics)') 删除
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
  url: 'admin/topics',
  data: {
    recommend: false,
    input2: ''
  },
  methods: {
    handleEdit (index, row) {
      this.$router.push(`topics/new?id=${row.id}`)
    },
    handleIconClick () {
    },
    addTopic () {
      window.open('/topics/new')
    }
  },
  watch: {
    'listData.topics': function (val) {
      val.forEach(el => {
        if (el.state === 'published') { el.state = '已发布' }
        el.published_at = tool.moment(el.created_at)
      })
    }
  }
})
export default vm
</script>

<style lang="stylus" scoped>

</style>
