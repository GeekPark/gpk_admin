<template lang="jade">
#admin-posts.admin
  el-table(:data='postsData.posts',)
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
                  @click='handleDelete(scope.$index, scope.row)') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='currentPage',
                :page-size='postsData.meta.limit_value',
                layout='total, prev, pager, next',
                :total='postsData.meta.total_count')
</template>

<script>

import api from '../../stores/api'

export default {
  name: 'admin-posts',
  computed: {
  },
  data () {
    return {
      currentPage: 1,
      postsData: {
        meta: {
          total_count: 0,
          limit_value: 0,
        }
      },
    }
  },
  methods: {
    fetch (currentPage = 1) {
      const _this = this
      api._get({
        url: 'admin/posts',
        data: {
          page: currentPage,
        }
      }).then((result) => {
        console.log(result);
        _this.postsData = result.data
      }).catch((err) => {
        console.log(err);
         _this.$message.error(err.toString())
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.fetch(val)
      console.log(`当前页: ${val}`);
    },
  },
  watch:{
    'postsData.posts': function (val) {
      val.forEach(el => {
        if (el.state === 'published') {el.state = '已发布'}
      })
    }
  },
  beforeMount () {
    this.fetch()
  }
}
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
