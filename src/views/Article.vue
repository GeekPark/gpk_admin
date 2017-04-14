<template>
<dir id="article" class="admin " v-highlightjs>
  <div v-html='templateHtml()' v-highlightjs></div>
</dir>
</template>

<script>
import * as api from '../stores/api'

export default {
  name: 'article',
  computed: {
  },
  data () {
    return {
      article: {}
    }
  },
  methods: {
    templateHtml() {
      if (this.article.markdown) {
        return  marked(this.article.markdown, { sanitize: true })
      }
      return this.article.html
    },
    fetch () {
      api._get({url: `article/${this.$route.query.id}`})
      .then(res => {
        this.article = res.data.data
        this
      }).catch(error => {
        console.log(error);
      })
    }
  },
  beforeMount () {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
#article
  text-align left
  margin-top 0
  font-size 2.2rem
  line-height 30px
</style>
