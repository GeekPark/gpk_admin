<template lang="pug">
#search-guest
  el-select(v-model='select', multiple, filterable, remote, placeholder='请输入关键词', :remote-method='remoteMethod', :loading='loading')
    el-option(v-for='item in searchData', :key='item.id', :label='item.name', :value='item.id')
</template>

<script>
import api from 'stores/api'
export default {
  name: 'search-guest',
  data () {
    return {
      searchData: [],
      select: [],
      loading: false
    }
  },
  props: {callback: Function, guests: Array},
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        api.get('admin/guests', { params: {name: query} })
        .then(result => {
          this.loading = false
          console.log(result.data.guests)
          this.searchData = result.data.guests
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
    'guests': function () {
      if (this.guests.length <= 0) { return }
      this.searchData = this.guests
      this.select = this.guests.map(el => el.id)
    }
  },
  mounted () {
  }
}
</script>

<style lang="stylus" scoped>
</style>

