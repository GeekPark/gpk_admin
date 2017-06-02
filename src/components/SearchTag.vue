<template lang="jade">
#search-tag
  el-select(v-model='select', multiple='', filterable='', remote='', placeholder='请输入关键词', :remote-method='remoteMethod', :loading='loading')
    el-option(v-for='item in searchData', :key='item', :label='item', :value='item')
    //- el-button(v-show='canAdd', @click='addTag') 添加
</template>

<script>
import api from 'stores/api'
export default {
  name: 'search-tag',
  data () {
    return {
      searchData: [],
      select: [],
      list: [],
      loading: false,
      query: ''
    }
  },
  computed: {
    canAdd () {
      return this.searchData.length === 0 &&  this.query.length > 0
    }
  },
  props: {callback: Function},
  methods: {
    addTag() {
      api.post('admin/tags', {name: this.query})
      .then(result => {
        console.log(result);
      })
    },
    remoteMethod(query) {
      this.query = query
      if (query !== '') {
        this.loading = true;
        api.get(`admin/tags?name=${query}`)
        .then(result => {
          this.loading = false;
          this.searchData = result.data.length === undefined ? [] : result.data.filter(item => {
            const regex = new RegExp(query, "g");
            return item.match(regex);
          });
        })
      } else {
        this.searchData = [];
      }
    }
  },
  watch: {
    'select': function(val) {
      this.callback(val)
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>

