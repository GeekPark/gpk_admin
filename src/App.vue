<template lang="jade">
#app(v-loading="isLoading", element-loading-text="拼命加载中")
  vsider
  vheader
  transition(name="slide-fade")
    router-view
  vfooter
</template>

<script>

export default {
  name: 'app',
  computed: {
    isLoading () {
      return this.$store.state.isLoading;
    }
  },
  mounted () {
  }
}

</script>

<style lang="stylus">
$siderrWidth = 200px
$headerWidth = 60px

html, body
  width 100%
  height 100%
  margin 0
  padding 0
  overflow-x hidden

#app
  color #2c3e50
  background rgb(248, 248, 248)
  height calc(100%)
  width 100%

.admin
  width calc(100% - $siderrWidth)
  margin-left $siderrWidth
  height calc(100% - 120px)
  background white
  padding 30px
  padding-top 90px

  .form-inline
    top 12px
    position relative

#vsider .el-row
  position absolute
  bottom 0
  left 0
  width $siderrWidth
  height 100%
  background-color #324157
  position fixed
  overflow-y scroll
  z-index 2

  .el-col
    width 100%

#vsider .el-row::-webkit-scrollbar
  display none

#vsider, #vheader
  display block !important


#vheader
  height $headerWidth
  width calc(100% - 230px)
  margin-left $siderrWidth
  padding-right 30px
  background #324157
  position fixed
  z-index 2
  display block
  top 0
  left 0

.el-pagination
  text-align center

.no-touch-bg
  user-select none
  -webkit-tap-highlight-color transparent
  -webkit-touch-callout none
  -webkit-user-select none

.a-title-text
  color #2c3e50
  font-size 2rem
  font-weight bold

.border1
  border 1px solid #D3D3D3

.slide-fade-enter-active
  transition all .1s ease
.slide-fade-leave-active
  transition all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0)
.slide-fade-enter, .slide-fade-leave-active
  transform translateX(10px)
  opacity 0

.el-row
  margin-bottom 20px
  &:last-child
    margin-bottom 0
.el-col
  border-radius 4px
  cursor pointer
.bg-purple-dark
  background #99a9bf
.bg-purple
  background #d3dce6
.bg-purple-light
  background #e5e9f2
.grid-content
  border-radius 4px
  min-height 46px
  padding 10px
  position relative
.center
  position   absolute
  top        50%
  left       50%
  transform  translate(-50%,-50%)
.row-bg
  padding 10px 0
  background-color #f9fafc


article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section
  display block

body
  line-height 1

blockquote, q
  quotes none

blockquote:before, blockquote:after,

q:before, q:after
  content ''
  content none

table
  border-collapse collapse
  border-spacing 0

html
  font-size 62.5%

a
  text-decoration none
  cursor pointer
</style>
