<template lang="pug">
#vheader
  el-menu.el-menu-demo(theme='dark',
                       :default-active='activeIndex',
                       mode='horizontal',
                       @select='handleSelect')
    el-menu-item(index='email') {{email}}
    el-submenu(index='profile')
      template(slot='title') 个人中心
      el-menu-item(index='profile') 账号
      el-menu-item(index='logout') 登出
</template>

<script>
import * as api from '../stores/api'
export default {
  name: 'vheader',
  computed: {
  },
  data () {
    return {
      activeIndex: "1",
      email: '',
      routes: [
      ]
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      if (key === 'logout') {
        const _this = this
        api._post({
          url: 'account/logout',
          data: {}
        }).then((result) => {
          console.log(result);
          if (result.status === 200) {
            localStorage.setItem('email', null);
            localStorage.setItem('user', null);
            _this.$router.push('/login');
          }
        }).catch((err) => {
          console.log(err);
        })
      } else {
        this.$router.push(`/${key}`)
      }
      console.log(key, keyPath);
    }
  },
  beforeMount () {
    let email = localStorage.getItem('email');
    this.$set(this, 'email', email);
  }
}
</script>

<style lang="stylus" scoped>
.el-menu
  float right
</style>

