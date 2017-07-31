<template lang="jade">
#search-column
  el-select(v-model='select', placeholder='请输入关键词', :loading='loading')
    el-option(v-for='item in searchData', :key='item.id', :label='item.title', :value='item.id')

</template>

<script>
import api from 'stores/api'
export default {
  name: 'search-column',
  data () {
    return {
      searchData: [],
      select: [],
      list: [],
      loading: false,
      states: []
    }
  },
  props: ['callback'],
  methods: {
  },
  watch: {
    'select': function (val) {
      this.callback(val)
    }
  },
  mounted () {
    api.get('admin/columns')
    .then(result => {
      this.loading = false
      this.searchData = result.data.columns
    })
  }
}
</script>

<style lang="stylus" scoped>

</style>
