<template lang="jade">
#vheader
  img.avatar(:src='info.avatar_url')
  span.nickname {{info.nickname}}
  img.logout(src='../assets/imgs/header-logout.svg', @click='logout')
</template>

<script>
import api from 'stores/api'
import config from '../config'
export default {
  name: 'vheader',
  data () {
    return {
      info: {}
    }
  },
  methods: {
    logout () {
      if (this.info.avatar_url) {
        api.account.delete(`logout`).then(result => {
          console.log(result)
        })
      } else {
        window.open(config.account)
      }
    }
  },
  mounted () {
    api.account.get('my/access_key').then(result => {
      if (Object.keys(result.data) <= 0) {
        this.$message.error('未登录, 请再新窗口登录后, 刷新本页面')
        const tab = window.open('about:blank')
        setTimeout(() => { tab.location = config.account }, 200)
        return
      }
      const url = `admin/info?access_key=${result.data.access_key}`
      api.get(url).then(result => {
        this.info = result.data
      })
    })
  }
}
</script>

<style lang="stylus" scoped>
#vheader
  font-size 15px
  display flex
  justify-content flex-end
  align-items center
  padding-right 30px

  .avatar
    position relative
    height 60%
    border-radius 4px
    margin-right 15px
    cursor pointer
    border-radius 100%
  .nickname
    margin-right 20px
    cursor pointer
  .logout
    height 40%
    cursor pointer

</style>

