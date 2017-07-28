<template lang="jade">
#search-tag
  el-select(v-model='tags', multiple, filterable, allow-create, placeholder='请选择文章标签', :loading='loading')
    el-option(v-for='item in tags', :key='item', :label='item', :value='item')
</template>

<script>
import api from 'stores/api'
export default {
  name: 'search-tag',
  data () {
    return {
      tags: [],
      loading: false
    }
  },
  props: {callback: Function},
  methods: {
    fetch () {
      api.get(`admin/tags`).then(result => {
        this.tags = result.data.tags || []
      })
    }
  },
  watch: {
    'tags': function (val) {
      this.callback(this.tags)
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
</style>

