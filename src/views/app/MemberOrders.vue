<template lang="pug">
#admin-columns.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
    .filter
      el-select(v-model='params.state', clearable, placeholder='订单状态')
        el-option(v-for='key, val in state',
                  :label='key',
                  :value='val',
                  :key='val')
      el-select(v-model='params.buy_type', clearable, placeholder='购买方式')
        el-option(v-for='key, val in buyType',
                  :label='key',
                  :value='val',
                  :key='val')
      el-input(placeholder="手机号",
               clearable,
               v-model="params.mobile")
      el-button(icon="el-icon-search" size="mini" @click="search")
  el-table(:data='listData.orders' border)
    el-table-column(prop='id', label='订单号')
    el-table-column(prop='content', label='购买内容')
    el-table-column(prop='buy_type', label='购买方式')
    el-table-column(prop='price', label='购买价格')
    el-table-column(prop='state', label='订单状态')
      template(slot-scope='scope')
        | {{state[scope.row.state]}}
    el-table-column(prop='created_at', label='购买时间')
    el-table-column(prop='name', label='用户名')
    el-table-column(prop='mobile', label='手机号')
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

const url = 'admin/orders/member_order'
const buyType = {
  first_time: '初次购买',
  renew: '续费',
  overdue: '过期续费',
  discount: '折扣购买',
  exchange: '会员兑换',
  member: '会员购买音频',
  audio_exchange: '兑换音频',
  audio: '音频购买'
}

export default {
  data () {
    return {
      params: {
        state: '',
        buy_type: '',
        mobile: ''
      },
      currentPage: 1,
      listData: {
        orders: [],
        meta: {
          total_count: 0,
          limit_value: 0
        }
      },
      buyType: buyType,
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
        el.buy_type = buyType[el.buy_type]
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
