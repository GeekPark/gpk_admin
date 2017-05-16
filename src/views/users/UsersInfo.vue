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
    el-form-item(label="微信绑定: ")
    el-form-item(label="微博绑定: ")
    el-form-item(label="两步验证: ") {{user.two_factor_enable ? '是' : '否'}}
    br
    h2 操作
    el-form-item(label="编辑权限: ")
    //- company:null
    //- created_at:"2017-05-16 17:20:42"
    //- authorizations:Array[0]
    //- bio:"fdf"
    //- avatar_url:"/uploads/user/avatar/f3435f2a-e1d4-4110-93d1-cbf532555288/0f2d8874d20dd104e33276b27cbc1b3d.jpg"
    //- city:null
    //- birthday:null
    //- is_old:false
    //- gender:"not_sure"
    //- email:"k****@yahoo.com"
    //- id:"f3435f2a-e1d4-4110-93d1-cbf532555288"
    //- mobile:null
    //- nickname:"kevinwang"
    //- preference:Object
    //- realname:null
    //- roles:Array[1]
    //- title:null
    //- two_factor_enable:null
</template>

<script>
const base_url = 'admin/users'

import api from 'stores/api'
import tools from 'tools'

export default {
  mounted () {
    fetch(this, `${base_url}/${this.$route.params.id}`, 'user')
  },
  data () {
    return {
      user: {}
    }
  },
  methods: {
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
</script>

<style lang="stylus" scoped>
.el-form
  clear both

  .el-form-item
    margin-bottom 10px
</style>
