<template lang="pug">
#admin.admin
  section
    el-card.box-card
      span 用户 {{total.user}}
    el-card.box-card
      span 文章 {{total.article}}
    el-card.box-card
      span 评论 {{total.comment}}
    el-card.box-card
      span 投票 {{total.vote}}
</template>

<script>

import * as api from '../stores/api'

export default {

  name: 'admin',

  data () {
    return {
      total: {},
    }
  },

  methods: {
    fetch () {
      const _this = this
      api._get({
        url: 'statistics/total',
        data: _this.ruleForm
      }).then((result) => {
        _this.$set(_this, 'total', result.data.data)
      }).catch((err) => {
        console.log(err);
         _this.$message.error(err.toString())
      })
    }
  },

  beforeMount () {
    this.fetch()
  }
}

</script>

<style lang="stylus" scoped>
#admin

  .el-card
    cursor pointer
    position relative
    width calc(20% - 25px)
    margin 30px
    display inline-block
    font-family 'Microsoft YaHei'

    span
      font-size 2rem
</style>
