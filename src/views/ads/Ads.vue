<template lang="pug">
#admin-ads.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="addAd") 添加广告
    .filter
      el-input(placeholder="搜索",
               v-model="params.title",
               @keyup.enter.native='fetch')
        i(slot="suffix" class="el-input__icon el-icon-search" @click="search")
  el-table(:data='listData.ads', :row-class-name="tableRowClassName", border)
    el-table-column(prop='id', label='ID', width="50")
    el-table-column(prop='title', label='标题', width="200")
      template(slot-scope='scope')
        a(@click='clickAd(scope.row)') {{scope.row.title}}
    el-table-column(prop='position', label='位置')
    el-table-column(prop='active_at', label='开始时间', width="180")
    el-table-column(prop='active_through', label='结束时间', width="180")
    el-table-column(prop='views', label='点击量')
    el-table-column(label='操作', width="170")
        template(slot-scope='scope')
          el-button(type='text',
                    @click='handleEdit(scope.$index, scope.row)') 编辑
          el-button(type='text',
                    @click='handleDestroy(scope.$index, scope.row, listData.ads)') 删除
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
  url: 'admin/ads',
  data: {
    params: {
      title: ''
    }
  },
  methods: {
    tableRowClassName ({row, rowIndex}) {
      const through = new Date(row.active_through)
      const now = new Date()
      if (through > now) {
        return 'active-ad'
      }
      return ''
    },
    addAd () {
      this.$router.push('/ads/new')
    },
    handleEdit (index, row) {
      this.$router.push(`ads/new?id=${row.id}`)
    },
    search () {
      this.fetch()
    },
    clickAd (row) {
      window.open(`${row.link}`)
    }
  },
  watch: {
    'listData.ads': function (val) {
      val.forEach(el => {
        el.active_at = tool.moment(el.active_at)
        el.active_through = tool.moment(el.active_through)
      })
    }
  }
})
export default vm
</script>

<style lang="stylus">
.active-ad
  background-color #e2f0e4 !important

</style>
