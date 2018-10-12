<template lang="pug">
#admin-columns.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="exportCsv") 导出
  el-table(:data='listData.consume_point_details' border)
    el-table-column(prop='id', label='ID', width="60")
    el-table-column(prop='product_name', label='兑换商品')
    el-table-column(prop='name', label='收件人', width="90")
    el-table-column(prop='contact', label='电话', width="120")
    el-table-column(prop='address', label='地址')
    el-table-column(prop='created_at', label='提交时间', width="180")
    el-table-column(label='处理', width="120")
      template(slot-scope='scope')
        el-button(type='text',
                  v-if='scope.row.state === "original"',
                  @click='handleEdit(scope.$index, scope.row)') 待处理
        span(v-if='scope.row.state === "handled"') 已处理
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

const url = 'admin/consume_point_details'

export default {
  data () {
    return {
      currentPage: 1,
      listData: {
        consume_point_details: [],
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
    handleEdit (index, row) {
      const destroy = () => {
        api.put(`${url}/${row.id}`, {state: 'handled'}).then((result) => {
          this.$message.success('success')
          this.fetch()
        }).catch((err) => {
          console.log(err)
          this.$message.error(err.toString())
        })
      }
      tool.autoConfirm(this, destroy)
    },
    exportCsv () {
      let link = api.defaults.baseURL + '/' + url + '/export_csv'
      window.open(link, '_blank')
    }
  },
  watch: {
    'listData.consume_point_details': function (val) {
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
