<template lang="jade">
#admin-comments.admin
  .title
    h1 {{$route.meta.title}}
  .filter
    el-input(placeholder="搜索",
             icon="search",
             v-model="input2",
             :on-icon-click="handleIconClick")
  el-table(:data='listData.comments',)
    el-table-column(type="index", width="100")
    el-table-column(prop='id(test)', label='id', width="100")
    el-table-column(prop='', label='用户名')
    el-table-column(prop='content', label='内容')
    el-table-column(label='来源')
      template(scope='scope')
        a() {{scope.row.commentable_title}}
    el-table-column(prop='created_at', label='创建时间')
    el-table-column(label='操作')
      template(scope='scope')
        el-button(type='text',
                  @click='handleDestroy(scope.$index, scope.row, listData.comments)') 删除
        el-button(type='text',
                  @click='handleFilter(scope.$index, scope.row)') 禁言
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='currentPage',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next',
                :total='listData.meta.total_count')
</template>

<script>
import api  from 'stores/api'
import tool from 'tools'

const url = 'admin/comments'

export default {
  data () {
    return {
      filterParams: {
        commentable_type: "",
        state: "",
      },
      currentPage: 1,
      listData: {
        meta: {
          total_count: 0,
          limit_value: 0
        }
      }
    }
  },
  methods: {
    handleSizeChange(index, val) {
      console.log(`每页 ${index} 条`)
    },
    handleCurrentChange(index, val) {
      this.currentPage = index
      fetch(this, {page: index}, )
      console.log(`当前页: ${index}`)
    },
    handleFilter() {
      fetch(this, url, {
        page: this.currentPage
      })
    },
    handleDestroy(index, val, list) {
      api.delete(`${options.url}/${val.id}`, {}).then((result) => {
        this.$message.success('success')
        list.splice(index, 1)
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
    }
  },
  mounted () {
    fetch(this, url, {page: this.currentPage})
  }
}

function fetch (_this = {}, url = '', params = {}) {
  api.get(url, {params: params}).then((result) => {
    _this.listData = result.data
  }).catch((err) => {
    console.log(err)
     _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.title
  float left
  h1
    display inline-block
    margin-right 20px


.filter
  margin-bottom 20px
  float right
  .el-button
    margin-left 0px
  .el-input
    margin-left 20px
    width 200px
</style>
