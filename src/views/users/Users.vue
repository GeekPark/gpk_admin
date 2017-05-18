<template lang="jade">
#admin-users.admin
  .title
    h1 {{$route.meta.title}}
  .filter
    el-button(type='text', @click='handleEdit()') 全部
    | /
    el-button(type='text', @click='handleEdit()') 草稿
    | /
    el-button(type='text', @click='handleEdit()') 已删除
    el-input(placeholder="搜索",
             icon="search",
             v-model="input",
             :on-icon-click="handleIconClick")
  el-table(:data='listData.json', @current-change="rowClick" border)
    el-table-column(type="index", width="100")
    el-table-column(prop='', label='注册方式')
    el-table-column(prop='email', label='邮箱')
    el-table-column(prop='mobile', label='手机号')
    el-table-column(prop='', label='状态')
    el-table-column(prop='created_at', label='加入时间')
    el-table-column(label='操作')
      template(scope='scope')
        el-button(type='text',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(type='text',
                  @click='handleDestroy(scope.$index, scope.row, listData.json)') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='page',
                :page-size='limit_value',
                layout='total, prev, pager, next',
                :total='listData.meta.total')
</template>

<script>
const base_url = 'admin/users'

import api from 'stores/api'
import tools from 'tools'

export default {
  mounted () {
    fetch(this)
  },
  data () {
    return {
      page: 1,
      input: '',
      limit_value: 20,
      listData: {
        users: [],
        meta: {
          total: 0
        }
      }
    }
  },
  methods: {
    rowClick (row) {
      this.$router.push(`/users/info/${row.id}`)
    },
    handleSizeChange(index, val) {
      console.log(`每页 ${index} 条`)
    },
    handleCurrentChange(index, val) {
      this.page = index
      fetch(this, {page: index})
      console.log(`当前页: ${index}`)
    },
    handleIconClick () {

    }
  },
  watch: {
    'listData.json': (val) => {
      val.forEach(el => {
        el.created_at = tools.moment(el.created_at)
      })
    }
  }
}

function fetch (_this, params = {}) {
  api.account.get(base_url, {params: params}).then(result => {
    _this.listData = result.data
  }).catch(err => {
    // console.log(err)
  })
}
</script>

<style lang="stylus" scoped>

</style>
