<template lang="jade">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='form', :model='form', label-width='150px', label-position='top')
    el-form-item(label='产品名称')
      el-input(placeholder='', v-model='form.title')
    el-form-item(label='推荐语')
      el-input(type='textarea', placeholder='', v-model='form.description')
    el-form-item(label='关联文章')
    el-form-item(label='展品类别')
    upload(:callback='uploadImage')
    el-form-item(label='作者')
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
        title: '',
        description: '',
        picture: '',
        content_type: 'normal',
        is: false
      }
    }
  },
  methods: {
    onSubmit() {
      if (this.$route.query.id) {
        updateRecommend(this)
      } else {
        createRecommend(this)
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
       getRecommend(this)
     }
  }
}

function updateRecommend(_this) {
  api.put(`admin/topics/${_this.$route.query.id}`, _this.form)
  .then((result) => {
     _this.$message.success('success')
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}

function createRecommend(_this) {
  api.post('admin/topics', _this.form)
  .then((result) => {
     _this.$message.success('success')
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}

function getRecommend(_this) {
  api.get(`admin/topics/${_this.$route.query.id}`)
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
.el-input, .el-textarea
  width 50%

</style>
