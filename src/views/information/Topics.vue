<template lang="pug">
#admin-topics.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="addTopic") 添加专题
    .filter
      el-input(placeholder="搜索",
               v-model="params.title",
               @keyup.enter.native='fetch')
        i(slot="suffix" class="el-input__icon el-icon-search" @click="search")
  el-table(:data='listData.topics' border)
    el-table-column(prop='title', label='专题名称', width="150")
      template(slot-scope='scope')
        a(@click='clickColumn(scope.row)') {{scope.row.title}}
    el-table-column(prop='description', label='专题描述')
    el-table-column(prop='post_count', label='文章数量', width="100")
    el-table-column(prop='published_at', label='发布时间', width="150")
    el-table-column(label='操作', width="240")
        template(slot-scope='scope')
          el-button(type='text',
                    @click='handleManagement(scope.$index, scope.row)') 管理
          el-button(type='text',
                    @click='handleEdit(scope.$index, scope.row)') 编辑
          el-button(type='text',
                    @click='handleDestroy(scope.$index, scope.row, listData.topics)') 删除
          el-button(type='text',
                    @click='recommendTopic(scope.row)') {{scope.row.is_recommended === false ? "推荐": "取消推荐"}}
          el-button(type='text',
                    @click='hiddenTopic(scope.row)') {{scope.row.is_hidden === false ? "隐藏": "取消隐藏"}}
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='currentPage',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next, jumper',
                :total='listData.meta.total_count')
</template>

<script>
import Base from '../base'
import tool from 'tools'
import config from '../../config.js'
import api from 'stores/api'

const max = 40
const vm = Base({
  url: 'admin/topics',
  data: {
    params: {
      title: ''
    }
  },
  methods: {
    addTopic () {
      this.$router.push('/topics/new')
    },
    handleEdit (index, row) {
      this.$router.push(`topics/new?id=${row.id}`)
    },
    handleManagement (index, row) {
      this.$router.push(`topics/management?id=${row.id}`)
    },
    search () {
      this.fetch()
    },
    clickColumn (row) {
      window.open(`${config.main}/topic/${row.id}`)
    },
    recommendTopic (row) {
      api.post(`admin/topics/${row.id}/${row.is_recommended ? 'undorecommend' : 'recommend'}`).then(result => {
        this.fetch()
      })
    },
    hiddenTopic (row) {
      api.post(`admin/topics/${row.id}/${row.is_hidden ? 'undohidden' : 'hidden'}`).then(result => {
        this.fetch()
      })
    }
  },
  watch: {
    'listData.topics': function (val) {
      val.forEach(el => {
        if (el.state === 'published') { el.state = '已发布' }
        el.published_at = tool.moment(el.created_at)
        if (el.description && el.description.length > max) {
          el.description = `${el.description.substring(0, max)}...`
        }
      })
    }
  }
})
export default vm
</script>

<style lang="stylus" scoped>

</style>
