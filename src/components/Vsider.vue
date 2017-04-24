<template lang="jade">
#vsider
  el-row.tac
    router-link(to="/")
      img(src="../assets/imgs/copyright.png")
    el-col(:span='8')
      el-menu.el-menu-vertical-demo(router=true, @open='handleOpen', @close='handleClose', theme="dark")
        el-menu-item(index='/') 仪表盘
        el-menu-item(index='/charts') 图表
        el-submenu(index='/1')
          template(slot='title')
            | 用户管理
          el-menu-item(index='/users') 用户列表
          el-menu-item(index='/users/new') 添加用户
        el-submenu(index='/2')
          template(slot='title')
            | 文章
          el-menu-item(index='/posts')  文章列表
          el-menu-item(index='/posts/new?content_type=markdown') 添加文章
        el-submenu(index='/3')
          template(slot='title')
            | 评论
          el-menu-item(index='/comments?type=posts') 评论列表
          el-menu-item(index='/comments/blocked') 屏蔽管理
        el-submenu(index='/4')
          template(slot='title')
            | 视频
          el-menu-item(index='/videos') 视频列表
          el-menu-item(index='/videos/new') 添加视频
        el-submenu(index='/6')
          template(slot='title')
            | 广告
          el-menu-item(index='/ads') 广告列表
          el-menu-item(index='/ads/new') 添加广告
        el-submenu(index='/8')
          template(slot='title')
            | 微信
          el-menu-item(index='/wechats') 微信列表
          el-menu-item(index='/wechats/new') 添加微信
        el-submenu(index='/5')
          template(slot='title')
            | 关于
          el-menu-item(index='/about') 关于

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
  width calc(100% - 40px)
  margin 20px
#vsider
  texta-align left

  &
    text-align left
</style>

