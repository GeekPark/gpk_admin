<template lang="jade">
#admin-users.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
    .filter
      el-select(v-model="params.role",placeholder="请选择角色", @change='rolesChange')
        el-option(v-for="item in possible_roles", :label="item", :value="item", :key="item")
      el-select(v-model="searchType",placeholder="请选择")
        el-option(v-for="item in  searchParams", :label="item.key", :value="item.val", :key='item.key')
      el-input(placeholder="搜索",
               icon="search",
               v-model="params.searchText",
               @keyup.enter.native='rolesChange',
               :on-icon-click="rolesChange")
  el-table(:data='listData.json' border)
    el-table-column(prop='nickname', label='昵称', width="120")
    el-table-column(prop='realname', label='真实姓名', width="100")
    el-table-column(prop='email', label='邮箱', width="180")
    el-table-column(prop='mobile', label='手机号')
    el-table-column(prop='created_at', label='加入时间', width="180")
    el-table-column(label='操作', width="110")
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
import tool from 'tools'

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
      searchParams: [{
        key: '昵称',
        val: 'nickname'
      }, {
        key: '手机号',
        val: 'mobile'
      }, {
        key: '邮箱',
        val: 'email'
      }],
      searchType: 'email',
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
      this.$router.push(`/users/info/${row.id}`)
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
      const destroy = () => {
        api.account.delete(`${url}/${val.id}`).then(result => {
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
      this.$router.push(`users/info/${row.id}`)
    }
  },
  watch: {
    'listData.json': (val) => {
      val.forEach(el => {
        el.created_at = tool.moment(el.created_at)
      })
    }
  }
}

function fetchUsers (_this) {
  const params = {
    page: _this.params.page,
    role: _this.params.role,
    mode: 'filter'
  }
  params[_this.searchType] = _this.params.searchText
  api.account.get(url, {params: params}).then(result => {
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
