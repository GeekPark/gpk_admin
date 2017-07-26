<template lang="jade">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='form', :model='form', label-width='80px')
    el-form-item(label='标题')
      el-input(placeholder='请输入标题 必填', v-model='form.title')
    el-form-item(label='跳转链接')
      el-input(placeholder='请输入网页链接', v-model='form.link')
    el-form-item(label='视频地址')
      el-input(placeholder='请输入视频地址', v-model='form.link')
    el-form-item(label='开始时间')
      el-date-picker(v-model='form.active_at',
                     type='datetime',
                     placeholder='选择日期时间')
    el-form-item(label='结束时间')
      el-date-picker(v-model='form.active_through',
                     type='datetime',
                     placeholder='选择日期时间')
    el-form-item(label='广告位置')
      el-select(v-model='form.position', placeholder='请选择')
        el-option(v-for='item in positions',
                  :label='item',
                  :value='item',
                  :key='item')
    el-form-item(label='广告标识')
    el-form-item(label='图片')
      upload(:callback='uploadImage')
    el-form-item(label='')
      el-button(type='primary', @click='onSubmit') 发布
      el-button(type='danger', @click='onSubmit') 关闭
</template>

<script>
import api from 'stores/api'

export default {
  data () {
    return {
      form: {
        active_at: '',
        active_through: '',
        picture: '',
        link: '',
        position: '',
        title: ''
      },
      positions: ['banner', 'logo', 'top_left', 'top_right']
    }
  },
  methods: {
    onSubmit () {
      if (this.$route.query.id) {
        updateAd(this)
      } else {
        createAd(this)
      }
    },
    handleSelect (item) {
      console.log(item)
    },
    uploadImage (img) {
      this.form.cover_id = img.id
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getAd(this)
    }
  }
}

function updateAd (_this) {
  api.put(`admin/ads/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    window.close()
    _this.$message.success('success')
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function createAd (_this) {
  api.post('admin/ads', _this.form)
  .then((result) => {
    window.close()
    _this.$message.success('success')
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function getAd (_this) {
  api.get(`admin/ads/${_this.$route.query.id}`)
  .then((result) => {
    _this.form = result.data.post
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.el-input
  width 50%

</style>
