<template lang="pug">
#admin-if_talks.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="addNew") 添加 IF Talk
      el-button(type='text', @click="exportCsv") 导出
    .filter
      el-button(type='text',
                @click='params.state = "publish"',
                v-bind:class='{active: params.state === "publish"}') 已发布
      | /
      el-button(type='text',
                @click='params.state = "unpublish"',
                v-bind:class='{active: params.state === "unpublish"}') 未发布
      el-input(placeholder="搜索",
               v-model="params.title",
               @keyup.enter.native='fetch')
        i(slot="suffix" class="el-input__icon el-icon-search" @click="search")
  el-table(:data='listData.if_talks' border)
    el-table-column(prop='id', label='ID', width="45")
    el-table-column(prop='title', label='标题')
      template(slot-scope='scope')
        a(@click='clickArticle(scope.row)') {{scope.row.title}}
    el-table-column(prop='state', label=' 状态', width="70")
      template(slot-scope='scope')
        span(v-bind:class='{unpublish: scope.row.state === "未发布"}') {{scope.row.state}}
    el-table-column(prop='listen_count', label='收听次数', width="70")
    el-table-column(prop='price', label='价格', width="55")
    el-table-column(prop='published_at', label='发布时间', width="140", v-if='params.state === "publish"')
    el-table-column(prop='click_count', label='PV', width="50")
    el-table-column(prop='operator.name', label='创建者', width="80")
    el-table-column(label='操作', width="120")
      template(slot-scope='scope')
        el-button(type='text',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(type='text',
            v-if='scope.row.state === "已发布"',
            @click='recommend(scope.row)') {{scope.row.is_recommend ? "取消推荐": "⾸页推荐"}}
        //- el-button(type='text',
                  @click='handleDestroy(scope.$index, scope.row)') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                background,
                :current-page='currentPage',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next, jumper',
                :total='listData.meta.total_count')
</template>

<script>
import tool from 'tools'
import api from 'stores/api'
// import config from '../../config.js'
import Sortable from 'sortablejs'

const url = 'admin/if_talks'

export default {
  data () {
    return {
      params: {
        name: '',
        state: this.$route.query.state || 'publish'
      },
      currentPage: this.$route.query.page ? parseInt(this.$route.query.page) : 1,
      newData: [],
      listData: {
        if_talks: [],
        meta: {
          total_count: 0,
          limit_value: 0
        }
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
      const params = Object.assign({page: this.currentPage}, this.params)
      api.get(url, {params: params}).then((result) => {
        console.log(result)
        this.listData = result.data
        this.newData = [].concat(result.data.if_talks)
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
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    handleDestroy (index, val, list) {
      const destroy = () => {
        api.delete(`${url}/${val.id}`).then((result) => {
          this.$message.success('success')
          this.fetch()
        }).catch((err) => {
          console.log(err)
          this.$message.error(err.toString())
        })
      }
      tool.deleteConfirm(this, destroy)
    },
    handleEdit (index, row) {
      this.$router.push(`iftalk/new?id=${row.id}&page=${this.currentPage}`)
    },
    clickArticle (row) {
      if (row.state === '已发布') {
        window.open(`http://iftalk.geekpark.net/${row.id}`)
      }
      // else {
      //   api.get(`if_talks/${row.id}/preview`).then(result => {
      //     window.open(result.data.url)
      //   })
      // }
    },
    recommend (row) {
      const path = row.is_recommend ? 'cancel_recommend' : 'recommend'
      api.patch(`${url}/${row.id}/${path}`).then(result => {
        this.fetch()
      })
    },
    addNew () {
      this.$router.push('/iftalk/new')
    },
    exportCsv () {
      let link = api.defaults.baseURL + '/' + url + '/export_csv'
      window.open(link, '_blank')
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
    'listData.if_talks': function (val) {
      val.forEach(el => {
        el.published_at = tool.moment(el.published_at)
        if (el.state === 'publish') { el.state = '已发布' }
        if (el.state === 'unpublish') { el.state = '未发布' }
        if (el.state === 'closed') { el.state = '已删除' }
      })
    },
    'params.state': function () {
      this.search()
    }
  },
  beforeMount () {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
.active
  color #7F7F7F
.unpublish
  color #FF0000


</style>
