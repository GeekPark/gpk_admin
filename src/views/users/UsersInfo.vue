<template lang="jade">
#users-info.admin
  .title
    h1 {{$route.meta.title}}
  el-form
    el-form-item(label="ID: ") {{user.id}}
    el-form-item(label="用户名: ") {{user.nickname}}
    el-form-item(label="真实姓名: ") {{user.realname}}
    el-form-item(label="性别: ") {{user.gender}}
    el-form-item(label="手机号: ") {{user.mobile}}
    el-form-item(label="出生日期: ") {{user.birthday}}
    el-form-item(label="地区: ")
    el-form-item(label="公司: ") {{user.company}}
    el-form-item(label="职位: ") {{user.title}}
    el-form-item(label="简介: ") {{user.bio}}
    br
    h2 账号状态
    el-form-item(label="邮箱绑定: ") {{user.email ? '是' : '否'}}
    el-form-item(label="手机绑定: ") {{user.mobile ? '是' : '否'}}
    el-form-item(label="微信绑定: ") {{user.wechat_enabled ? '是' : '否'}}
    el-form-item(label="微博绑定: ") {{user.weibo_enabled ? '是' : '否'}}
    el-form-item(label="两步验证: ") {{user.two_factor_enable ? '是' : '否'}}
    br
    h2 操作
    el-form-item(label="编辑权限: ")
      el-select(v-model="user.roles",placeholder="请选择", multiple)
        el-option(v-for="item in roles", :label="item", :value="item", :key='item')
    el-form-item(label='是否禁言:')
      el-switch(v-model="user.banned", on-text="", off-text="", @change='blockChange')
    el-form-item(label='')
      el-button(type='primary', :disabled='disabled', @click='onSubmit') 保存
</template>

<script>
import api from 'stores/api'
import tools from 'tools'

export default {
  mounted () {
    fetch(this, `admin/users/${this.$route.params.id}`, 'user')
    fetch(this, 'api/v1/users/possible_roles', 'roles')
    // fetch(this, 'my/access_key', 'access_token')
  },
  data () {
    return {
      disabled: false,
      user: {},
      roles: []
    }
  },
  methods: {
    onSubmit () {
      this.disabled = true
      api.account.put(`admin/users/${this.$route.params.id}`, {
        roles: this.user.roles
      }).then(result => {
        this.$message.success('success')
        this.$router.push('/users')
      }).catch(err => {
        console.log(err)
        this.disabled = false
      })
    },
    blockChange (val) {
      console.log(val)
      ban(this, val ? 'ban' : 'unban')
    }
  },
  watch: {
    'user': (val) => {
      val.created_at = tools.moment(val.created_at)
    }
  }
}

function fetch (_this, url, key) {
  api.account.get(url).then(result => {
    _this[key] = result.data
  })
}

function ban (_this, action) {
  api
  .account
  .post(`admin/users/${_this.$route.params.id}/${action}`)
  .then(result => {
    console.log(result)
  })
}
</script>

<style lang="stylus" scoped>
.el-form
  clear both

  .el-form-item
    margin-bottom 10px
</style>
