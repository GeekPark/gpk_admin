<template lang="pug">
#admin-comment.admin
  template
    el-input(placeholder='请输入标题搜索', icon='search', v-model='search', :on-icon-click='handleIconClick')
    el-table(:data='items', border='', style='width: 100%')
      el-table-column(type="index", width="100")
      el-table-column(prop='content', label='评论内容')
      el-table-column(prop='article.title', label='评论文章')
      el-table-column(prop='user.nickname', label='用户', width="150")
      el-table-column(prop='created_at', label='日期', width="200")
      el-table-column(prop='status', label='状态', width="150")
      el-table-column(label='操作')
        template(scope='scope')
          el-button(size='small', @click='handleEdit(scope.$index, scope.row)') 编辑
          el-button(size='small', type='danger', @click='handleDelete(scope.$index, scope.row)') 删除
  el-pagination(@size-change='handleSizeChange', @current-change='handleCurrentChange',  :current-page="1", :page-size='100', layout='total, prev, pager, next', :total='1000')
</template>

<script>

export default {
  name: 'admin-comment',
  computed: {
    items () {
      return this.$store.state.adminItems
    }
  },
  data () {
    return {
      start: 0,
      search: '',
      formInline: {
          title: '',
          link: '',
      }
    }
  },
  methods: {
    fetch (start) {
      const _this = this
      const cb = function (result) {
        _this.$set(_this, 'start', start)
      }
      this.$store.dispatch('FETCH_ADMIN_ITEMS', {
        cb: cb,
        url: 'comments',
        params: {
          start: start,
          search: _this.search || null,
          type: _this.$route.params.type || null
        }
      })
    },
    handleIconClick () {
      this.fetch(0)
    },
    onSubmit() {
      if (!this.formInline.title || !this.formInline.link) {return}
      const _this = this
      this.$store.dispatch('ADD_COMMENT', {
        data: _this.formInline,
        cb: (data) => {
          if (data.data.code === 1000) {
            _this.$message('已新建评论');
            location.reload()
          }
        }
      })
    },
    handleDelete(index, row) {
      const _this = this
      this.$store.dispatch('DELETE_ADMIN_ITEM', {
        id: row._id,
        url: 'comment',
        msg: _this.$message,
        index: index
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.fetch(val - 1)
      console.log(`当前页: ${val}`);
    }
  },
  mounted () {
    this.fetch(0)
  },
  watch: {
    '$route.path' () {
      this.fetch(0)
    }
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
