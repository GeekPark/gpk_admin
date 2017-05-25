<template lang="jade">
#vsider
  el-row.tac
    router-link(to="/")
      img(src="../assets/imgs/copyright.png")
    el-col(:span='8')
      el-menu.el-menu-vertical-demo(router=true, @open='handleOpen', @close='handleClose', theme="light")
        el-submenu(index='/2')
          template(slot='title')
            | 资讯
          el-menu-item-group(title='文章')
            el-menu-item(index='/posts')  文章列表
            el-menu-item(index='/posts/new?content_type=html') 添加文章
          el-menu-item-group(title='栏目')
            el-menu-item(index='/columns') 栏目列表
            el-menu-item(index='/columns/new') 添加栏目
          el-menu-item-group(title='专题')
            el-menu-item(index='/topics') 专题列表
            el-menu-item(index='/topics/new') 添加专题
          el-menu-item-group(title='极客推荐')
            el-menu-item(index='/recommendations') 推荐列表
            el-menu-item(index='/recommendations/new') 添加推荐
          el-menu-item-group(title='分享')
            el-menu-item(index='/share') 分享统计
        el-submenu(index='/3')
          template(slot='title')
            | 评论
          el-menu-item(index='/comments?type=posts') 评论列表
        el-submenu(index='/6')
          template(slot='title')
            | 广告
          el-menu-item(index='/ads') 广告列表
          el-menu-item(index='/ads/new') 添加广告
        el-submenu(index='/1')
          template(slot='title')
            | 用户
          el-menu-item(index='/users') 用户列表
          //- el-menu-item(index='/users/new') 添加用户
        el-submenu(index='/8')
          template(slot='title')
            | 微信
          el-menu-item(index='/wechats') 微信列表
          el-menu-item(index='/wechats/new') 添加微信

</template>

<script>

export default {
  name: 'vsider',
  computed: {
  },
  data () {
    return {
      routes: [
      ]
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  beforeMount () {
  }
}
</script>

<style lang="stylus" scoped>
img
  height 30px
  margin 15px 20px
#vsider
  texta-align left

  &
    text-align left
</style>

