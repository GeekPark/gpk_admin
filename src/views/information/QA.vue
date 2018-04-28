<template lang="pug">
#admin-columns.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="addQA") 添加问答
    .filter
      el-input(placeholder="搜索",
               v-model="params.title",
               @keyup.enter.native='fetch')
        i(slot="suffix" class="el-input__icon el-icon-search" @click="fetch")
  el-table(:data='listData.questions' border)
    el-table-column(prop='title', label='标题')
    el-table-column(prop='created_at', label='添加时间', width='170')
    el-table-column(prop='count', label='回答数量', width='170')
    el-table-column(label='操作', width="120")
      template(slot-scope='scope')
        el-button(type='text',
                  @click='handleEdit(scope.row)') 编辑
        el-button(type='text',
                  @click='handleDestroy(scope.row)') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='params.page',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next, jumper',
                :total='listData.meta.total_count')
</template>

<script>
import api from 'stores/api'
import tool from 'tools'

const url = 'admin/questions'

export default {
  data () {
    return {
      params: {
        title: '',
        page: 1
      },
      listData: {
        news: [],
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
      this.params.page = index
      console.log(`当前页: ${index}`)
    },
    fetch () {
      api.get(url, {params: this.params}).then(result => {
        console.log(result)
        this.listData = result.data
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
    handleEdit (row) {
      this.$router.push(`/qa/new?id=${row.id}`)
    },
    addQA () {
      this.$router.push('/qa/new')
    }
  },
  watch: {
    'listData.questions': function (val) {
      val.forEach(el => {
        el.created_at = tool.moment(el.created_at)
      })
    },
    'params.state': function () {
      this.listData.news = []
      this.fetch()
    },
    'params.page': function () {
      this.fetch()
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
.active
  color #7F7F7F
.unpublished
  color #FF0000
a
  color #000

</style>
