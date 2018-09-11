<template lang="pug">
#admin-columns.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="exportCsv") 导出
  el-table(:data='listData.periodicals' border)
    el-table-column(prop='id', label='ID', width="60")
    el-table-column(prop='name', label='姓名', width="90")
    el-table-column(prop='contact', label='电话', width="120")
    el-table-column(prop='address', label='地址')
    el-table-column(prop='created_at', label='创建时间', width="180")
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

const url = 'admin/periodicals'

export default {
  data () {
    return {
      currentPage: 1,
      listData: {
        periodicals: [],
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
      api.get(url, {params: params}).then(result => {
        console.log(result)
        this.listData = result.data
      }).catch(err => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    exportCsv () {
      let link = api.defaults.baseURL + '/' + url + '/export_csv'
      window.open(link, '_blank')
    }
  },
  watch: {
    'listData.periodicals': function (val) {
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
