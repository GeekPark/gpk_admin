<template lang="pug">
#search-tag
  el-select(v-model='select', multiple, filterable, allow-create, remote,placeholder='请选择文章标签', :remote-method='remoteMethod', :loading='loading')
    el-option(v-for='item in allTags', :key='item', :label='item', :value='item')
</template>

<script>
import api from 'stores/api'
export default {
  name: 'search-tag',
  data () {
    return {
      allTags: [],
      select: [],
      loading: false
    }
  },
  props: {callback: Function, tags: Array},
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        api.get('admin/tags', { params: {name: query} })
        .then(result => {
          this.loading = false
          this.allTags = result.data.filter(item => {
            const regex = new RegExp(query, 'g')
            return item.match(regex)
          })
        })
      } else {
        this.allTags = []
      }
    }
  },
  watch: {
    'select': function (val) {
      this.callback(this.select)
    },
    'tags': function (val) {
      if (this.tags.length <= 0) { return }
      this.allTags = this.select = this.tags
    }
  },
  mounted () {
  }
}
</script>

<style lang="stylus" scoped>
</style>

