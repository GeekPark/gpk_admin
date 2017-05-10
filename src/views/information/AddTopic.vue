<template lang="jade">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='form', :model='form', label-width='150px', label-position='top')
    el-form-item(label='标题')
      el-input(placeholder='请输入标题 必填', v-model='form.title')
    el-form-item(label='描述')
      el-input(type='textarea', placeholder='描述', v-model='form.description')
    el-form-item(label='背景封面')
      el-upload.upload-demo(drag="", action='', mutiple)
        i.el-icon-upload
        .el-upload__text
          | 将文件拖到此处，或
          em 点击上传
        .el-upload__tip(slot='tip') 只能上传jpg/png文件，且不超过500kb
    el-form-item(label='')
      el-button(type='primary', @click='onSubmit') 发布
      el-button(type='danger', @click='onSubmit') 关闭
</template>

<script>

import tools    from '../../tools'
import api      from '../../stores/api'

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
        updateAd(this)
      } else {
        createAd(this)
      }
    },
    handleSelect(item) {
      console.log(item);
    }
  },
  mounted () {
     if (this.$route.query.id) {
       getAd(this)
     }
  }
}

function updateAd(_this) {
  api.put(`admin/columns/${_this.$route.query.id}`, _this.form)
  .then((result) => {
     _this.$message.success('success')
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}

function createAd(_this) {
  api.post('admin/columns', _this.form)
  .then((result) => {
     _this.$message.success('success')
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}

function getAd(_this) {
  api.get(`admin/columns/${_this.$route.query.id}`)
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
