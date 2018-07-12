<template lang="pug">
#admin-guests.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="addNew") 添加嘉宾
    .filter
      el-input(placeholder="搜索",
               v-model="params.name",
               @keyup.enter.native='fetch')
        i(slot="suffix" class="el-input__icon el-icon-search" @click="search")
  el-table(:data='listData.guests' border)
    el-table-column(prop='name', label='姓名', width="100")
    el-table-column(props='tags', label='标签')
      template(slot-scope='scope')
        | {{scope.row.tags.join(', ')}}
    el-table-column(prop='description', label='介绍')
    el-table-column(prop='operator.name', label='创建者', width="90")
    el-table-column(label='操作', width="170")
      template(slot-scope='scope')
        el-button(type='text',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(type='text',
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

const url = 'admin/guests'

export default {
  data () {
    return {
      params: {
        name: '',
        state: this.$route.query.state || 'published'
      },
      currentPage: 1,
      listData: {
        guests: [],
        meta: {
          total_count: 0,
          limit_value: 0
        }
      }
    }
  },
  methods: {
    search () {
      api.get(url, {params: this.params}).then(result => {
        console.log(result)
        this.listData = result.data
      }).catch((err) => {
        console.log(err)
      })
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
      this.$router.push(`guests/new?id=${row.id}`)
    },
    addNew () {
      this.$router.push('/guests/new')
    }
  },
  watch: {
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
.unpublished
  color #FF0000


</style>
