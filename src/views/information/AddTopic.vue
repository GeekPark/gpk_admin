<template lang="jade">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='form', :model='form', label-width='150px', label-position='top')
    el-form-item(label='专题名称')
      el-input(placeholder='', v-model='form.title')
    el-form-item(label='描述')
      el-input(type='textarea', placeholder='', v-model='form.description')
    el-form-item(label='背景封面')
      upload(:callback='uploadImage')
    el-form-item.actions(label='')
      el-button(type='primary', @click='onSubmit') 发布
      el-button(type='danger', @click='close') 关闭
</template>

<script>
import api from 'stores/api'

export default {
  data () {
    return {
      form: {
        title: '',
        description: '',
        picture: '',
        content_type: 'normal',
        is: false
      }
    }
  },
  methods: {
    onSubmit () {
      if (this.$route.query.id) {
        updateTopic(this)
      } else {
        createTopic(this)
      }
    },
    handleSelect (item) {
      console.log(item)
    },
    uploadImage (img) {
      this.form.cover_id = img.id
    },
    close () {
      window.close()
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getTopic(this)
    }
  }
}

function updateTopic (_this) {
  api.put(`admin/topics/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    _this.$message.success('success')
    window.close()
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function createTopic (_this) {
  api.post('admin/topics', _this.form)
  .then((result) => {
    _this.$message.success('success')
    window.close()
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function getTopic (_this) {
  api.get(`admin/topics/${_this.$route.query.id}`)
  .then((result) => {
    _this.form = result.data.post
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.el-input, .el-textarea
  width 50%

</style>
