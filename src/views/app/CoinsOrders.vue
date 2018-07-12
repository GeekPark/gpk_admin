<template lang="pug">
#admin-columns.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
    .filter
      el-select(v-model='params.state_eq', clearable, placeholder='订单状态')
        el-option(v-for='key, val in state',
                  :label='key',
                  :value='val',
                  :key='val')
      el-input(clearable,
               v-model="params.mobile_or_content_cont",
               @keyup.enter.native='search')
      el-button(icon="el-icon-search" size="mini" @click="search")
  el-table(:data='listData.orders' border)
    el-table-column(prop='trade_no', label='订单号')
    el-table-column(prop='name', label='用户名')
    el-table-column(prop='mobile', label='手机号')
    el-table-column(prop='price', label='购买价格')
    el-table-column(prop='state', label='订单状态')
      template(slot-scope='scope')
        | {{state[scope.row.state]}}
    el-table-column(prop='created_at', label='购买时间')
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

const url = 'admin/orders/coins_order'

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
        orders: [],
        meta: {
          total_count: 0,
          limit_value: 0
        }
      },
      state: {
        pending: '未支付',
        paid: '已付款',
        closed: '已关闭'
      }
    }
  },
  methods: {
    search () {
      this.currentPage = 1
      this.fetch()
    },
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
    'listData.orders': function (val) {
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
