<template lang="pug">
#vfooter
</template>

<script>

export default {
  name: 'vfooter',
  computed: {
  },
  data () {
    return {
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  beforeMount () {
  }
}
</script>


<style lang="stylus" scoped>
#vfooter
  text-align center
  position absolute
  bottom 0
  left 0
  right 0
</style>
