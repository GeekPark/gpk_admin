<template lang="pug">
#admin-columns.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="addDaily") 添加推荐
  el-table(:data='listData.daily_recommendations' border)
    el-table-column(prop='recommendable.recommendable_type', label='类别', width="100")
    el-table-column(prop='id', label='ID', width="50")
    el-table-column(prop='content.title', label='标题')
    el-table-column(prop='content', label='作者', width="140")
      template(slot-scope='scope')
        template(v-if="scope.row.content.authors")
          span(v-for='item in scope.row.content.authors') {{item.nickname}}
    el-table-column(prop='content.column_title', label='栏目', width="100")
    el-table-column(prop='created_at', label='发布时间', width="150")
    el-table-column(prop='click_count', label='PV', width="50")
    el-table-column(prop='operator.name', label='创建者', width="90")
    el-table-column(label='操作', width="120")
      template(slot-scope='scope')
        el-button(type='text',
                  @click='handleDestroy(scope.row)') 删除
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
import Sortable from 'sortablejs'

const url = 'admin/daily_recommendations'

export default {
  data () {
    return {
      currentPage: 1,
      newData: [],
      listData: {
        daily_recommendations: [],
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
        this.listData = result.data
        this.newData = [].concat(result.data.daily_recommendations)
        const table = document.querySelector('.el-table__body-wrapper tbody')
        const _this = this
        Sortable.create(table, {
          onEnd ({ newIndex, oldIndex }) {
            if (newIndex === oldIndex) return
            let targetRow = _this.newData.splice(oldIndex, 1)[0]
            _this.newData.splice(newIndex, 0, targetRow)
            _this.updateRow(targetRow.id, newIndex)
          }
        })
      }).catch(err => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    handleDestroy (val) {
      const destroy = () => {
        api.delete(`${url}/${val.id}`).then(result => {
          this.$message.success('success')
          this.fetch()
        }).catch(err => {
          console.log(err)
          this.$message.error(err.toString())
        })
      }
      tool.deleteConfirm(this, destroy)
    },
    addDaily () {
      this.$router.push('/daily/new')
    },
    updateRow (id, newIndex) {
      newIndex += (this.currentPage - 1) * 10
      api.patch(`${url}/${id}/update_row_order`, {row_order_position: newIndex}).then(result => {
        this.$message.success('success')
      }).catch(err => {
        console.log(err)
        this.$message.error(err.toString())
      })
    }
  },
  watch: {
    'listData.daily_recommendations': function (val) {
      val.forEach(el => {
        let key = el.recommendable.recommendable_type.toLowerCase().replace('iftalk', 'if_talk')
        el.recommendable_type = el.recommendable.recommendable_type
        el.content = (el[key] && el[key][key]) || {}
        el.created_at = tool.moment(el.recommendable.created_at)
      })
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>

</style>
