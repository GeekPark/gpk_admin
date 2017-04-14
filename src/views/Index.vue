<template lang="pug">
#index.admin
  el-row.new-posts(:gutter="20")
    el-col(:span='9')
      .grid-content.bg-purple
        h1 最新文章
        p.title(v-for='item in postsData.posts') {{item.title}}
    el-col(:span='5')
      .grid-content.bg-purple-light
        h1 最新活动
    el-col(:span='5')
      .grid-content.bg-purple
        h1 日常数据
    el-col(:span='5')
      .grid-content.bg-purple-light
        h1 日历
  el-row
    el-col(:span='24')
      h1 后台管理中心
  el-row(:gutter="20")
    el-col(v-for='item in sections', :span='Math.floor((24 / sections.length))')
      .grid-content.bg-purple
        h1.center {{item.title}}
  el-row
    el-col(:span='24')
      h1 快速访问
  el-row(:gutter="20")
    el-col(v-for='item in quickly', :span='Math.floor((24 / sections.length))')
      .grid-content.bg-purple
        h1.center {{item.title}}

</template>

<script>

import * as api from '../stores/api'

export default {

  name: 'index',

  data () {
    return {
      sections: [{
        title: '文章管理',
        url: '',
      },{
        title: '活动后台',
        url: '',
      },{
        title: '用户管理',
        url: '',
      },{
        title: '广告管理',
        url: '',
      },{
        title: '微信管理',
        url: '',
      }],
      quickly: [{
        title: '极客公园',
        url: '',
      },{
        title: 'teambition',
        url: '',
      },{
        title: '极光推送',
        url: '',
      },{
        title: 'innoawards',
        url: '',
      }],
      postsData: {
        posts: [],
      },
    }
  },

  methods: {
    fetch () {
      const _this = this
      api._get({
        url: 'admin/posts',
      }).then((result) => {
        console.log(result);
        // _this.postsData = result.data
        _this.$set(_this, 'postsData', result.data)
      }).catch((err) => {
        console.log(err);
         // _this.$message.error(err.toString())
      })
    }
  },

  beforeMount () {
    this.fetch()
  }
}

</script>

<style lang="stylus" scoped>
.new-posts
  .grid-content
    min-height 150px
    overflow hidden
  h1
    margin-bottom 20px
  p
    line-height 25px
    font-size 1.7rem
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  cursor: pointer;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 46px;
  padding: 10px;
  position: relative;
}

.center {
  position  : absolute;
  top       : 50%;
  left      : 50%;
  transform : translate(-50%,-50%);
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
  // .el-card
  //   cursor pointer
  //   position relative
  //   width calc(20% - 25px)
  //   margin 30px
  //   display inline-block
  //   font-family 'Microsoft YaHei'

  //   span
  //     font-size 2rem
</style>
