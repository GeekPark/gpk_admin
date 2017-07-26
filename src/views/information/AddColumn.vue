<template lang="jade">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='form', :model='form', label-width='150px', label-position='top')
    el-form-item(label='栏目标题')
      el-input(placeholder='', v-model='form.title')
    el-form-item(label='描述')
      el-input(type='textarea', placeholder='描述', v-model='form.description')
    el-form-item(label='背景封面')
      upload(:callback='uploadImage')
    el-form-item.column_visible(label='文章是否显示在首页')
      el-radio.radio(v-model='form.column_visible', :label="true") 是
      el-radio.radio(v-model='form.column_visible', :label="false") 否
    el-form-item(label='')
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
        column_visible: false
      }
    }
  },
  methods: {
    onSubmit () {
      if (this.$route.query.id) {
        updateColumn(this)
      } else {
        createColumn(this)
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
      getColumn(this)
    }
  }
}

function updateColumn (_this) {
  api.put(`admin/columns/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    _this.$message.success('success')
    window.close()
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function createColumn (_this) {
  api.post('admin/columns', _this.form)
  .then((result) => {
    _this.$message.success('success')
    window.close()
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function getColumn (_this) {
  api.get(`admin/columns/${_this.$route.query.id}`)
  .then((result) => {
    console.log(_this.form)
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.el-input, .el-textarea
  width 50%

.column_visible
  margin-top 20px

</style>
