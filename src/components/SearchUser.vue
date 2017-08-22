<template lang="jade">
#search-user
  el-select(v-if='multiple', v-model='select', multiple, filterable, remote, placeholder='请输入关键词', :remote-method='remoteMethod', :loading='loading')
    el-option(v-for='item in data', :key='item.id', :label='item.nickname', :value='item.id')

  el-select(v-else, v-model='select', filterable, remote, placeholder='请输入关键词', :remote-method='remoteMethod', :loading='loading')
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
      loading: false
    }
  },
  computed: {
    'data' () {
      if (this.users && this.users.length > 0) {
        // setTimeout(() => {
        //   this.select = this.users.map(el => el.id)
        // }, 100)
        return this.users
      }
      return this.searchData
    }
  },
  props: ['callback', 'multiple', 'authors', 'author'],
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        api.account.get('admin/users', { params: {nickname: query} })
        .then(result => {
          this.loading = false
          console.log(result.data)
          this.searchData = result.data.json.filter(item => {
            const regex = new RegExp(query, 'g')
            return item.nickname.match(regex)
          })
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
    'author': function () {
      if (!this.author) { return }
      this.searchData = this.author
      this.select = this.author.map(el => el.id)
    },
    'authors': function () {
      if (!this.authors) { return }
      this.searchData = this.authors
      this.select = this.authors.map(el => el.id)
    }
  },
  mounted () {
  }
}
</script>

<style lang="stylus" scoped>

</style>

