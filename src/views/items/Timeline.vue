<template lang="pug">
#admin-timeline.admin
  div(v-loading.fullscreen.lock="fullscreenLoading")
  vsearch(model='Article', searchKey='title', :start='start')
  el-button(@click='handleConfirm') 确定排序
  el-card(v-for="item in items" v-dragging="{ item: item, list: items, group: 'item' }", :key="item._id") 文章: {{item.title}}
  el-pagination(@size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page="1", :page-size='100', layout='total, prev, pager, next', :total='1000')
</template>

<script>
let isFirst = true
import * as api from '../../stores/api'
export default {
  name: 'admin-timeline',
  computed: {
    items () {
      const articles = this.$store.state.adminItems
      return articles
    }
  },
  data () {
    return {
      start:             0,
      copyItems:         [],
      fullscreenLoading: false
    }
  },
  methods: {
    fetch (start) {
      const _this = this
      const cb = function (result) {
        _this.$set(_this, 'start', start)
        isFirst && _this.$set(_this, 'copyItems', result.concat())
        isFirst = false
      }
      this.$store.dispatch('FETCH_ADMIN_ITEMS', {
        start: start,
        cb: cb,
        url: 'articles'
      })
    },
    handleIconClick () {
      this.fetch(0)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.fetch(val - 1)
      console.log(`当前页: ${val}`);
    },
    handleConfirm () {
      const _this = this
      const value = this.items
      let puts = []
      value.forEach((el, index) => {
        let copyItem = _this.copyItems[index]
        puts.push({ id: el._id, index: copyItem._index, title: el.title})
      })

      puts.length && api._post({ url: 'article/update/index', data: {items: puts}
      }).then((result)=> {
        _this.$message.success('success')
      }).catch((err) => {
        console.log(err);
      })
    }
  },
  mounted () {
    this.fetch(0)

    // this.$dragging.$on('dragged', ({ value }) => {
    // })
  }
}
</script>

<style lang="stylus" scoped>
.el-table, .el-pagination
  margin-top 20px
.el-button
  margin-bottom 30px
  margin-left 20px

.add-btn
  margin-left 30px
.el-table
  margin-top 30px
</style>
