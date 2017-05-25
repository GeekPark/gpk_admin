<template lang="jade">
#search-column
  el-form-item(label='栏目', required)
    el-select(v-model='select', multiple='', filterable='', remote='', placeholder='请输入关键词', :remote-method='remoteMethod', :loading='loading')
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
     remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          api.get('admin/columns',{params: {title: query}})
          .then(result => {
            this.loading = false;
            console.log(result);
            this.searchData = result.data.columns.filter(item => {
              const regex = new RegExp(query, "g");
              return item.title.match(regex);
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
