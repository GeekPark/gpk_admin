<template lang="jade">
#search-post
  el-select(v-model='select', filterable, remote, placeholder='搜索文章', :remote-method='remoteMethod', :loading='loading')
    el-option(v-for='item in searchData', :key='item.id', :label='item.title', :value='item.id')

</template>

<script>
import api from 'stores/api'
export default {
  name: 'search-post',
  data () {
    return {
      searchData: [],
      select: '',
      loading: false
    }
  },
  props: ['callback', 'post'],
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        api.get('admin/posts', { params: {title: query, state: 'published'} })
        .then(result => {
          this.loading = false
          this.searchData = result.data.posts.filter(item => {
            const regex = new RegExp(query, 'g')
            return item.title.match(regex)
          })
        })
      } else {
        this.searchData = []
      }
    }
  },
  watch: {
    'select': function (val) {
      this.callback(this.select)
    },
    'post': function (val) {
      if (this.post === 'deleted') {
        this.select = ''
        return
      }
      if (!this.post.id) { return }
      this.select = this.post.id
      this.searchData = [this.post]
    }
  },
  mounted () {

  }
}
</script>

<style lang="stylus" scoped>

</style>

