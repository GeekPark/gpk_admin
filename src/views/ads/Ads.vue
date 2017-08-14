<template lang="jade">
#admin-ads.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="addColumn") 添加广告
    .filter
      el-input(placeholder="搜索",
               icon="search",
               v-model="params.title",
               :on-icon-click="search")
  el-table(:data='listData.ads', :row-class-name="tableRowClassName", border)
    el-table-column(prop='title', label='标题', width="200")
      template(scope='scope')
        a(@click='clickColumn(scope.row)') {{scope.row.title}}
    el-table-column(prop='position', label='位置')
    el-table-column(prop='active_at', label='开始时间', width="180")
    el-table-column(prop='active_through', label='结束时间', width="180")
    el-table-column(label='操作', width="170")
        template(scope='scope')
          el-button(type='text',
                    @click='handleEdit(scope.$index, scope.row)') 编辑
          el-button(type='text',
                    @click='handleClose(scope.row)') {{scope.row.is_active ? '关闭' : '开启'}}
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
import config from '../../config.js'
import api from 'stores/api'

const vm = Base({
  url: 'admin/ads',
  data: {
    params: {
      title: ''
    }
  },
  methods: {
    tableRowClassName (row) {
      const through = new Date(row.active_through)
      const now = new Date()
      console.log(through)
      console.log(now)
      console.log(through > now)
      if (through > now) {
        return 'active-ad'
      }
      return ''
    },
    addColumn () {
      this.$router.push('/ads/new')
    },
    handleEdit (row) {
      this.$router.push(`ads/new?id=${row.id}`)
    },
    search () {
      this.fetch()
    },
    clickColumn (row) {
      window.open(`${config.main}/collections/${row.title}`)
    },
    handleClose (row) {
      api.patch(`admin/ads/${row.id}`, {is_active: !row.is_active}).then(result => {
        console.log(result)
      })
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
