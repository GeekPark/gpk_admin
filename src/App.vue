<template lang="pug">
#app
  vsider
  vheader
  transition(name="slide-fade")
    router-view
  vfooter
</template>

<script>

export default {
  name: 'app',
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
  overflow-x hidden

#app
  color #2c3e50
  background rgb(248, 248, 248)
  height 100%
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

.el-pagination
  text-align center

.no-touch-bg
  user-select none
  -webkit-tap-highlight-color transparent
  -webkit-touch-callout none
  -webkit-user-select none

.border1
  border 1px solid #D3D3D3

.slide-fade-enter-active
  transition: all .1s ease
.slide-fade-leave-active
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0)
.slide-fade-enter, .slide-fade-leave-active
  transform: translateX(10px)
  opacity: 0;

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video
  margin 0
  border 0
  vertical-align baseline

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
  font-size 50%

a
  text-decoration none
  cursor pointer
</style>
