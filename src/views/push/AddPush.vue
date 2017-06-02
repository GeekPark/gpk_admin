<template lang="jade">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='form', :model='form', label-width='80px')
    el-form-item(label='内容ID')
      el-input(placeholder='', v-model='form.title')
    el-form-item(label='内容标题')
      el-input(placeholder='', v-model='form.link')
    el-form-item(label='定时发送')
      el-date-picker(v-model='form.active_at',
                     type='datetime',
                     placeholder='选择日期时间')
    el-form-item(label='')
      el-button(type='primary', @click='onSubmit') 发布
      el-button(type='danger', @click='onSubmit') 关闭
</template>

<script>

import tools    from 'tools'
import api      from 'stores/api'

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
    onSubmit() {
      if (this.$route.query.id) {
        updateAd(this)
      } else {
        createAd(this)
      }
    },
    handleSelect(item) {
      console.log(item);
    },
    uploadImage(img) {
      this.form.cover_id = img.id
    }
  },
  mounted () {
     if (this.$route.query.id) {
       getAd(this)
     }
  }
}

function updateAd(_this) {
  getContent(_this)
  api.put(`admin/ads/${_this.$route.query.id}`, _this.form)
  .then((result) => {
     _this.$message.success('success')
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}

function createAd(_this) {
  getContent(_this)
  api.post('admin/ads', _this.form)
  .then((result) => {
     _this.$message.success('success')
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}

function getAd(_this) {
  api.get(`admin/ads/${_this.$route.query.id}`)
  .then((result) => {
    result.data.post.column_id = result.data.post.column.id
    _this.form = result.data.post
    addContent(_this, _this.form.content_type)

  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.el-input
  width 50%

</style>
