<template lang="pug">
#veditor
  #editor(style="height:400px;max-height:1000px;")
</template>

<script>
import tools from '../tools'
import * as api from '../stores/api'

export default {
  name: 'veditor',
  beforeMount () {
    const _this = this
    api._get({ url: 'services/uptoken', data: {}}).then((result) => {
      _this.$store.commit('SET_ITEM', {
        key: 'uptoken',
        val: result.data.uptoken
      })
    }).catch((err) => {
      console.log(err);
       _this.$message.error(err.toString())
    })
  },
  mounted () {
    tools.editor(this)
  }
}
</script>

<style lang="stylus" scoped>
#veditor
  font initial
  margin-top 10px
  margin-bottom 30px
</style>
