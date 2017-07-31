<template lang="jade">
#search-tag
  el-select(v-model='select', multiple, filterable, allow-create, placeholder='请选择文章标签', :loading='loading')
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
    fetch () {
      api.get(`admin/tags`).then(result => {
        this.allTags = result.data.tags || []
      })
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
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
</style>

