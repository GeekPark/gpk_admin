<template lang="pug">
#vsider
  el-row.tac
    router-link(to="/")
      .sider-logo
        img(src="http://imgslim.geekpark.net/geekpark-icon-196-03ac430f5643fc17aba3b3f5429a287d.png")
        span 管理后台
    el-col(:span='8')
      el-menu(unique-opened=true, router=true, @open='handleOpen', @close='handleClose', background-color="#324157", text-color="#fff")
        el-submenu(index='/info')
          template(slot='title')
            img(src='../assets/imgs/sider_info.svg')
            span 资讯
          el-menu-item-group(title='文章')
            el-menu-item(index='/posts')  文章列表
            el-menu-item(index='/posts/new?content_type=html') 添加文章
          el-menu-item-group(title='快讯')
            el-menu-item(index='/news')  快讯列表
            el-menu-item(index='/news/new?type=create') 添加快讯
          el-menu-item-group(title='问答')
            el-menu-item(index='/qa') 问答列表
            el-menu-item(index='/qa/new') 添加问答
          el-menu-item-group(title='栏目')
            el-menu-item(index='/columns') 栏目列表
            el-menu-item(index='/columns/new') 添加栏目
          el-menu-item-group(title='专题')
            el-menu-item(index='/topics') 专题列表
            el-menu-item(index='/topics/new') 添加专题
          //- el-menu-item-group(title='极客推荐')
          //-   el-menu-item(index='/recommendations') 推荐列表
          //-   el-menu-item(index='/recommendations/new') 添加推荐
          el-menu-item-group(title='分享')
            el-menu-item(index='/share') 分享统计
        el-submenu(index='/push')
          template(slot='title')
            img(src='../assets/imgs/sider_push.svg')
            span 推送
          el-menu-item(index='/push') 推送列表
          el-menu-item(index='/push/new') 添加推送
        el-submenu(index='/comment')
          template(slot='title')
            img(src='../assets/imgs/sider_comment.svg')
            span 评论
          el-menu-item(index='/comments?type=posts') 评论列表
        el-submenu(index='/ad')
          template(slot='title')
            img(src='../assets/imgs/sider_ad.svg')
            span 广告
          el-menu-item(index='/ads') 广告列表
          el-menu-item(index='/ads/new') 添加广告
        el-submenu(index='/user')
          template(slot='title')
            img(src='../assets/imgs/sider_user.svg')
            span 用户
          el-menu-item(index='/users') 用户列表
          //- el-menu-item(index='/users/new') 添加用户
        el-submenu(index='/app')
          template(slot='title')
            img(src='../assets/imgs/sider_app.svg')
            span APP
          el-menu-item-group(title='Banner')
            el-menu-item(index='/appbanner') 管理Banner
            //- el-menu-item(index='/appbanner/new') 添加Banner
          el-menu-item-group(title='每日推荐')
            el-menu-item(index='/daily') 每日推荐列表
            el-menu-item(index='/daily/new') 添加每日推荐
          el-menu-item-group(title='IF Talk')
            el-menu-item(index='/iftalk') IF Talk 列表
            el-menu-item(index='/iftalk/new') 添加 IF Talk
            el-menu-item(index='/audios') 音频列表
            el-menu-item(index='/audios/new') 添加音频
            el-menu-item(index='/guests') 嘉宾列表
            el-menu-item(index='/guests/new') 添加嘉宾
            el-menu-item(index='/iftalk/comments') 留言列表
          el-menu-item-group(title='订单')
            el-menu-item(index='/orders') 内容订单
            el-menu-item(index='/orders/member_order') 会员订单
            el-menu-item(index='/orders/coins_order') 极客币订单
            el-menu-item(index='/orders/periodicals') 年刊领取订单
            el-menu-item(index='/orders/consume') 积分兑换订单
          el-menu-item-group(title='积分商品')
            el-menu-item(index='/products') 商品列表
            el-menu-item(index='/products/new') 添加商品
          el-menu-item-group(title='反馈')
            el-menu-item(index='/feedback') 意见反馈
        //- el-submenu(index='/wechat')
        //-   template(slot='title')
        //-     img(src='../assets/imgs/sider_wechat.svg')
        //-     span 微信
        //-   el-menu-item(index='/wechats') 微信列表
        //-   el-menu-item(index='/wechats/new') 添加微信

</template>

<script>
export default {
  name: 'vsider',
  computed: {
  },
  data () {
    return {
      routes: []
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  beforeMount () {
  }
}
</script>

<style lang="stylus" scoped>
#vsider
  text-align left
  &
    text-align left
  .sider-logo
    color #bfcbd9
    font-size 18px
    margin 20px 10px
    text-align center
    img
      width 20px
      vertical-align middle
      margin-right 5px
      border-radius 3px
    span
      height 30px
      vertical-align middle
  .el-col
    // border-top 2px solid rgb(0, 164, 186)
    img
      width 15px
      vertical-align: baseline;
      margin-top: 10px;
      position: absolute;
      top: 10px;
    span
      margin-left 25px
</style>

