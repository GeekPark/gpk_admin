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
    tools.editor(this, () => {
      this.count = this.$store.state.htmlEditor.txt.text().length
    })
  }
}
</script>

<style lang="stylus">
#veditor
  font-size 16px
  line-height 35px
  letter-spacing 1px

  #editor
    z-index: 10;
    position: relative;

  .w-e-text-container
    height 450px !important
    max-height 600px !important

  .count
    text-align right
    margin-top 0
    padding-right 30px
    font-size 12px
    color #959694

</style>
