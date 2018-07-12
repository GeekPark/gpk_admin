<template lang="pug">
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
      info: {
        avatar_url: ''
      }
    }
  },
  methods: {
    logout () {
      const url = `${config.account}?callback_url=${location.href}`
      if (this.info.avatar_url !== '') {
        api.account.delete(`logout`).then(result => {
          console.log(result)
          location.href = config.account
        }).catch(err => {
          console.log(err)
          location.href = url
        })
      } else {
        location.href = url
      }
    }
  },
  mounted () {
    api.account.get('my/access_key').then(result => {
      if (Object.keys(result.data) <= 0) {
        location.href = `${config.account}/login/?callback_url=${location.href}`
        return
      }
      sessionStorage.setItem('access_key', result.data.access_key)
      const url = `admin/info?access_key=${result.data.access_key}`
      api.get(url).then(result => {
        if (result.data != null) {
          this.info = result.data
          window.localStorage.setItem('username', this.info.nickname)
          window.localStorage.setItem('userinfo', JSON.stringify(this.info))
          if (result.data.roles.includes('admin') === false) {
            location.href = config.main
          }
        }
      })
    }).catch(e => {
      console.log(e)
      location.href = `${config.account}/login/?callback_url=${location.href}`
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

