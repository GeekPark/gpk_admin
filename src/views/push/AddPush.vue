<template lang="jade">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='form', :model='form', label-width='80px')
    el-form-item(label='内容ID')
      el-input(placeholder='', v-model='form.redirect')
    el-form-item(label='内容标题')
      el-input(placeholder='', v-model='form.content')
    el-form-item(label='定时发送')
      el-date-picker(v-model='form.send_at',
                     type='datetime',
                     placeholder='选择日期时间')
    el-form-item(label='')
      el-button(type='primary', @click='onSubmit') 提交
      //- el-button(type='danger', @click='onSubmit') 关闭
</template>

<script>
import api from 'stores/api'

export default {
  data () {
    return {
      form: {
        redirect: '',
        content_type: 'topic_type',
        content: '',
        send_at: ''
      }
    }
  },
  methods: {
    onSubmit () {
      createAd(this)
    }
  },
  mounted () {
  }
}

function createAd (_this) {
  console.log(_this.form)
  if (_this.form.send_at === '') {
    delete _this.form.send_at
  }
  api.account.post('api/v1/broadcasts', _this.form)
  .then((result) => {
    _this.$message.success('success')
    _this.$router.push('/push')
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.el-input
  width 50%

</style>
