<template lang="jade">
#search-tag
  el-form-item(label='标签')
    el-select(v-model='select', multiple='', filterable='', remote='', placeholder='请输入关键词', :remote-method='remoteMethod', :loading='loading')
      el-option(v-for='item in searchData', :key='item', :label='item', :value='item')

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
      states: []
    }
  },
  props: ['callback'],
  methods: {
     remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          api.get('admin/tags',{params: {name: query}})
          .then(result => {
            this.loading = false;
            this.searchData = result.data.filter(item => {
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
    'select': (val) => {

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

