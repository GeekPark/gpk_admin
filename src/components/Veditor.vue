<template lang="jade">
#veditor
  #editor
  p.count 字数: {{this.count}}
</template>

<script>
import tools from 'tools'

export default {
  name: 'veditor',
  data () {
    return {
      count: 0
    }
  },
  mounted () {
    tools.editor(this)
    const _this = this
    this.$store.state.htmlEditor.onchange = function () {
      _this.count = this.$txt.text().length
    }
  }
}
</script>

<style lang="stylus">
#veditor
  font-size 16px
  line-height 35px
  letter-spacing 1px

  .w-e-text-container
    height 600px !important

  .count
    text-align right
    margin-top 0
    padding-right 30px
    font-size 12px
    color #959694

</style>
