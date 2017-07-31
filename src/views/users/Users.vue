<template lang="jade">
#admin-users.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
    .filter
      //- el-select(v-model="params.state",placeholder="请选择", @change='typeChange')
      //-   el-option(v-for="item in types", :label="item.value", :value="item.key", :key="item.key")
      el-select(v-model="params.role",placeholder="请选择", @change='rolesChange')
        el-option(v-for="item in possible_roles", :label="item", :value="item", :key="item")
      el-input(placeholder="搜索",
               icon="search",
               v-model="params.searchText",
               :on-icon-click="rolesChange")
  el-table(:data='listData.json' border)
    el-table-column(prop='', label='注册方式', width="100")
    el-table-column(prop='nickname', label='nickname')
    el-table-column(prop='realname', label='realname', width="120")
    el-table-column(prop='email', label='邮箱', width="200")
    el-table-column(prop='mobile', label='手机号', width="150")
    el-table-column(prop='', label='状态', width="80")
    el-table-column(prop='created_at', label='加入时间', width="180")
    el-table-column(label='操作', width="130")
      template(scope='scope')
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
const url = 'admin/users'

import api from 'stores/api'
import tools from 'tools'

export default {
  mounted () {
    fetchUsers(this)
    fetch(this, 'api/v1/users/possible_roles', 'possible_roles')
  },
  data () {
    return {
      possible_roles: [],
      types: [{
        key: 'all',
        value: '全部'
      }, {
        key: 'banned',
        value: '已禁言'
      }],
      params: {
        role: 'user',
        page: 1,
        state: '',
        searchText: ''
      },
      listData: {
        users: [],
        meta: {
          total: 0
        }
      }
    }
  },
  methods: {
    rolesChange () {
      fetchUsers(this)
    },
    typeChange () {

    },
    rowClick (row) {
      window.open(`/users/info/${row.id}`)
    },
    handleSizeChange (index, val) {
      console.log(`每页 ${index} 条`)
    },
    handleCurrentChange (index, val) {
      this.params.page = index
      fetchUsers(this)
      console.log(`当前页: ${index}`)
    },
    handleDestroy (val) {
      api.account.delete(`${url}/${val.id}`).then(result => {
        this.$message.success('success')
        this.fetch()
      }).catch(err => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    handleEdit (row) {
      window.open(`users/info/${row.id}`)
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

function fetchUsers (_this) {
  api.account.get(url, {params: {
    nickname: _this.params.searchText,
    page: _this.params.page,
    role: _this.params.role,
    mode: 'filter'
  }}).then(result => {
    _this.listData = result.data
  }).catch(err => {
    console.log(err)
  })
}

function fetch (_this, url, key) {
  api.account.get(url).then(result => {
    _this[key] = result.data
  })
}
</script>

<style lang="stylus" scoped>
h1 {
  top: -5px;
}
.el-select
  width 150px !important
  margin-right 50px
</style>
