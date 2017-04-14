<template lang="pug">
#admin-vote.admin
  vsearch(model='Vote', searchKey='title', :start='start')
  router-link(to='/addVote')
      el-button.add-btn(type="text" @click="") 新建投票
  template
    el-table(:data='items', border='', style='width: 100%')
      el-table-column(type='expand')
        template(scope='props')
          el-form.demo-table-expand(label-position='left', inline='')
            el-form-item(label='观点列表', style='width: 100%')
              br
              div(v-for='point in props.row.points') {{point.value}}
      el-table-column(type="index", width="100")
      el-table-column(prop='_index', label='')
      el-table-column(prop='title', label='标题')
      el-table-column(prop='status', label=' 状态', width="200")
      el-table-column(prop='user.nickname', label='用户名', width="150")
      el-table-column(prop='send_at', label='发送时间', width="200")
      el-table-column(label='操作')
        template(scope='scope')
          el-button(size='small',
                    type='danger',
                    @click='handleDelete(scope.$index, scope.row)') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page="1",
                :page-size='100',
                layout='total, prev, pager, next',
                :total='1000')
</template>

<script>
export default {
  name: 'admin-vote',
  computed: {
    items () {
      return this.$store.state.adminItems
    }
  },
  data () {
    return {
      start: 0,
      search: ''
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
        url: 'votes',
        data: {
          start: start,
        }
      })
    },
    handleDelete(index, row) {
      const _this = this
      this.$store.dispatch('DELETE_ADMIN_ITEM', {
        url: `vote/${row._id}`,
        msg: _this.$message,
        cb: _this.fetch,
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
  beforeMount () {
    this.fetch(0)
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
