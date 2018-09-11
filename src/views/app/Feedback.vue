<template lang="pug">
#admin-columns.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
  el-table(:data='listData.feedbacks' border)
    el-table-column(prop='id', label='ID', width="50")
    el-table-column(prop='content', label='内容')
    el-table-column(prop='contact', label='联系方式', width="200")
    el-table-column(prop='phone_model', label='手机型号', width="200")
    el-table-column(prop='version', label='版本', width="100")
    el-table-column(prop='created_at', label='创建时间', width="180")
    el-table-column(prop='attachment', label='附件', width="60")
      template(slot-scope='scope')
        a(v-if="scope.row.attachment" :href="scope.row.attachment" target="_blank") 查看
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='currentPage',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next, jumper',
                :total='listData.meta.total_count')
</template>

<script>
import api from 'stores/api'
import tool from 'tools'

const url = 'admin/feedback'

export default {
  data () {
    return {
      params: {
        state_eq: '',
        buy_type_eq: '',
        mobile_or_content_cont: ''
      },
      currentPage: 1,
      listData: {
        feedbacks: [],
        meta: {
          total_count: 0,
          limit_value: 0
        }
      }
    }
  },
  methods: {
    handleSizeChange (index, val) {
      console.log(`每页 ${index} 条`)
    },
    handleCurrentChange (index, val) {
      this.currentPage = index
      this.fetch()
      console.log(`当前页: ${index}`)
    },
    fetch () {
      let params = { page: this.currentPage }
      for (let key in this.params) {
        if (this.params[key]) {
          params[key] = this.params[key]
        }
      }

      api.get(url, {params: params}).then(result => {
        console.log(result)
        this.listData = result.data
      }).catch(err => {
        console.log(err)
        this.$message.error(err.toString())
      })
    }
  },
  watch: {
    'listData.feedbacks': function (val) {
      val.forEach(el => {
        el.created_at = tool.moment(el.created_at)
      })
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
.el-date-editor, .el-select
  width auto
</style>
