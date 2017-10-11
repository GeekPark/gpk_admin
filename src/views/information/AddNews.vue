<template lang="jade">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-news-form', :model='form', label-width='150px', label-position='top', :rules='rules')
    el-form-item(label='标题', prop='title')
      el-input(placeholder='', v-model='form.title')
    el-form-item(label='摘要', prop='summary')
      el-input(type='textarea', placeholder='', v-model='form.summary')
    el-form-item(label='新闻来源'. prop='source')
       el-input(placeholder='', v-model='form.source')
    el-form-item(label='原文链接', prop='source_link')
       el-input(placeholder='', v-model='form.source_link')
    el-form-item(label='')
      el-button(type='primary', :disabled='disabled', @click='onSubmit') 发布
      el-button(type='danger', @click='close') 关闭
</template>

<script>
import api from 'stores/api'

export default {
  data () {
    return {
      disabled: false,
      form: {
        title: '',
        summary: '',
        source: '',
        source_link: '',
        state: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur', min: 0 }
        ],
        summary: [
          { required: true, message: '请输入摘要', trigger: 'blur', min: 0 }
        ],
        source: [
          { required: true, message: '请输入新闻来源', trigger: 'blur', min: 0 }
        ],
        source_link: [
          { required: true, message: '请输入原文链接', trigger: 'blur', min: 0 }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs['add-news-form'].validate((valid) => {
        if (valid !== true) {
          return this.$message.error('内容信息不完整, 请完善后再提交!')
        } else {
          if (this.form.state === 'published') {
            updateNews(this)
          } else {
            createNews(this)
          }
        }
      })
    },
    close () {
      this.$router.push(`/news?state=${this.form.state}`)
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getNews(this)
    }
  }
}

function updateNews (_this) {
  _this.disabled = true
  api.put(`admin/news/${_this.$route.query.id}`, _this.form)
  .then(result => {
    _this.$message.success('success')
    _this.$router.push('/news?state=published')
  }).catch(err => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function createNews (_this) {
  _this.disabled = true
  api.patch(`admin/news/${_this.$route.query.id}/publish`)
  .then(result => {
    _this.$message.success('success')
    _this.$router.push('/news?state=published')
  }).catch(err => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function getNews (_this) {
  api.get(`admin/news/${_this.$route.query.id}`)
  .then(result => {
    Object.keys(_this.form).forEach(key => {
      _this.form[key] = result.data.new[key]
    })
  }).catch(err => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.el-input, .el-textarea
  width 50%

</style>
