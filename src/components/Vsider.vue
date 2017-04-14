<template lang="pug">
#vsider
  el-row.tac
    router-link(to="/")
      img(src="http://ohusmobs2.bkt.clouddn.com/20170323149024023196292.png")
    el-col(:span='8')
      el-menu.el-menu-vertical-demo(router=true, @open='handleOpen', @close='handleClose', theme="dark")
        el-menu-item(index='/')
          i.el-icon-menu
          | 仪表盘 😂
        el-menu-item(index='/users')
          i.el-icon-setting
          | 用户管理
        el-submenu(index='/1')
          template(slot='title')
            i.el-icon-document
            | 内容管理
          el-menu-item(index='/timeline') 信息流管理
          el-menu-item-group(title = '文章')
            el-menu-item(index='/articles')  文章管理
            el-menu-item(index='/addArticle') 添加文章
            el-menu-item(index='/comments/article') 评论管理
          el-menu-item-group(title = '投票')
            el-menu-item(index='/votes')  投票管理
            el-menu-item(index='/addVote') 添加投票
            el-menu-item(index='/comments/vote') 评论管理
        el-submenu(index='/2')
          template(slot='title')
            i.el-icon-more
            | 关于 VMS
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

