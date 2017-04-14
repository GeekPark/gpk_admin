<template lang="pug">
#vsearch
  el-input(placeholder='请输入搜索内容',
           icon='search',
           v-model='searchVal',
           :on-icon-click='handleSearch')
</template>

<script>
import * as api from '../stores/api'
export default {
  name: 'vsearch',
  data () {
    return {
      searchVal: ''
    }
  },
  props: ['model', 'searchKey', 'start'],
  methods: {
    handleSearch() {
      const _this = this
      api._get({
        url: 'search',
        data: {
          model: _this.model,
          searchKey: _this.searchKey,
          searchVal: _this.searchVal,
          start: _this.start || 0,
        }
      }).then((result) => {
        console.log(result);
        if (result.status === 200) {
          _this.$store.commit('SET_ITEM', {
            key: 'adminItems',
            val: result.data.data
          })
        }
      }).catch((err) => {
        console.log(err);
      })
    }
  },
  beforeMount () {
  }
}
</script>

<style lang="stylus" scoped>
.el-input
  width 60%
  float left
</style>

