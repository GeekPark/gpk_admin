<template lang="jade">
#admin-users.admin
  .title
    h1 {{$route.meta.title}}
  .filter
    el-button(type='text', @click='handleEdit()') 全部
    | /
    el-button(type='text', @click='handleEdit()') 未验证
    | /
    el-button(type='text', @click='handleEdit()') 已验证
    | /
    el-button(type='text', @click='handleEdit()') 已禁言
    el-input(placeholder="搜索",
             icon="search",
             v-model="searchText",
             :on-icon-click="handleIconClick")
  el-select(v-model="role",placeholder="请选择", @change='rolesChange')
        el-option(v-for="item in possible_roles", :label="item", :value="item")
  el-table(:data='listData.json', @current-change="rowClick" border)
    el-table-column(type="index", width="100")
    el-table-column(prop='', label='注册方式')
    el-table-column(prop='nickname', label='nickname')
    el-table-column(prop='realname', label='realname')
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
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next, jumper',
                :total='listData.meta.total_count')
</template>

<script>
const base_url = 'admin/users'

import api from 'stores/api'
import tools from 'tools'

export default {
  mounted () {
    fetchUsers(this)
    fetch(this, 'api/v1/users/possible_roles', 'possible_roles')
  },
  data () {
    return {
      page: 1,
      searchText: '',
      possible_roles: [],
      role: 'user',
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
    rowClick (row) {
      this.$router.push(`/users/info/${row.id}`)
    },
    handleSizeChange(index, val) {
      console.log(`每页 ${index} 条`)
    },
    handleCurrentChange(index, val) {
      this.page = index
      fetchUsers(this)
      console.log(`当前页: ${index}`)
    },
    handleIconClick () {
      fetchUsers(this)
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
  api.account.get(base_url, {params: {
    nickname: _this.searchText ,
    page: _this.page,
    role: _this.role,
    mode: 'filter',
  }}).then(result => {
    _this.listData = result.data
  }).catch(err => {
    // console.log(err)
  })
}


function fetch (_this, url, key) {
  api.account.get(url).then(result => {
    _this[key] = result.data
  })
}
</script>

<style lang="stylus" scoped>

</style>
