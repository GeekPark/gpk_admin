<template lang="jade">
#product-categories
  el-select(v-model='select', placeholder='请输入关键词', :loading='loading')
    el-option(v-for='(value, key) in searchData', :key='key', :label='value', :value='key')

</template>

<script>
import api from 'stores/api'
export default {
  name: 'product-categories',
  data () {
    return {
      searchData: {},
      select: '',
      loading: false
    }
  },
  props: ['callback', 'category'],
  watch: {
    'select': function (val) {
      this.callback(this.select)
    },
    'category': function (val) {
      if (!this.category) { return }
      this.select = this.category
    }
  },
  mounted () {
    api.get('admin/recommendations/product_categories').then(result => {
      this.searchData = result.data
    })
  }
}
</script>

<style lang="stylus" scoped>

</style>

