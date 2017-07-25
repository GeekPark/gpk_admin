<template lang="jade">
#app(v-loading="isLoading", element-loading-text="拼命加载中")
  vsider
  vheader
  transition(name="slide-fade")
    router-view
  vfooter
</template>

<script>
import api from 'stores/api'
export default {
  name: 'app',
  computed: {
    isLoading () {
      return this.$store.state.isLoading;
    }
  }
}
</script>

<style lang="stylus">

$siderrWidth = 200px
$headerHeight = 60px

html, body
  width 100%
  margin 0
  padding 0
  overflow-x hidden

#app
  color #2c3e50
  background transparent
  width 100%

.admin
  box-shadow 3px 2px 10px 0px #B0B0B0;
  width calc(100% - $siderrWidth)
  margin-left $siderrWidth
  height calc(100% - 120px)
  background rgb(250, 250, 250)
  padding 30px
  padding-top 30px

  .form-inline
    top 12px
    position relative

#vsider .el-row
  position absolute
  bottom 0
  left 0
  width $siderrWidth
  height 100%
  background-color rgb(0, 188, 212)
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
  height $headerHeight
  width calc(100% - 200px)
  margin-left $siderrWidth
  padding-right 30px
  background #fff
  top 0
  left 0

// element -ui
.el-table
  font-size 40%
.el-pagination
  text-align left

.el-submenu, .el-menu
  background-color rgb(0, 188, 212)

  .el-menu-item-group, .el-menu-item
    background-color rgb(23, 183, 204)

  .el-menu-item:hover
    background-color rgb(0, 172, 193)

  * {
    color: #fff
  }
  .is-active {
    color: #fff
  }
  .el-menu-item-group__title {
    color: #E1E1E1
  }

.el-submenu__title:hover
  background-color rgb(0, 172, 193)


.el-form
  clear both


//  public css

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

.title
  float left
  h1
    display inline-block
    margin-right 20px

.filter
  margin-bottom 20px
  float right
  .el-button
    margin-left 0px
  .el-input
    margin-left 20px
    width 200px

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
