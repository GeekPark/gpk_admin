<template lang="jade">
#search-user
  el-select(v-model='select', multiple='', filterable='', remote='', placeholder='请输入关键词', :remote-method='remoteMethod', :loading='loading')
    el-option(v-for='item in searchData', :key='item.id', :label='item.nickname', :value='item.id')

</template>

<script>
import api from 'stores/api'
export default {
  name: 'search-user',
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
     remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          api.account.get('admin/users',{params: {nickname: query}})
          .then(result => {
            this.loading = false;
            console.log(result.data)
            this.searchData = result.data.json.filter(item => {
              const regex = new RegExp(query, "g");
              return item.nickname.match(regex);
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
  },
  mounted () {
    this.list = this.states.map(item => {
      return { value: item, label: item };
    });
  }
}
</script>

<style lang="stylus" scoped>

</style>

