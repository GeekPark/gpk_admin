<template lang="jade">
#search-topic
  el-select(v-model='select', placeholder='请输入关键词', :loading='loading')
    el-option(v-for='item in searchData', :key='item.id', :label='item.title', :value='item.id')

</template>

<script>
import api from 'stores/api'
export default {
  name: 'search-topic',
  data () {
    return {
      searchData: [],
      select: [],
      loading: false
    }
  },
  props: ['callback', 'topic'],
  watch: {
    'select': function (val) {
      this.callback(val)
    }
  },
  methods: {
    fetch () {
      api.get('admin/topics?per=10000')
      .then(result => {
        this.loading = false
        this.searchData = result.data.topics
        this.select = this.topic || ''
      })
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>

</style>
