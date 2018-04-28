<template lang="pug">
#add-news.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-news-form', :model='form', label-width='150px', label-position='top', :rules='rules')
    el-form-item(label='标题', prop='title')
      el-input(placeholder='请输入标题', v-model='form.title')
    el-form-item(label='摘要', prop='summary')
      el-input(type='textarea', placeholder='摘要内容请控制在200字以内', v-model='form.summary', @change='onChange')
      .count 字数 {{count}}
    el-form-item(label='新闻来源')
       el-input(placeholder='请输入新闻来源, 如(新浪科技)', v-model='form.source')
    el-form-item(label='原文链接')
       el-input(placeholder='请输入原文链接', v-model='form.source_link')
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
      count: 0,
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
          console.log(this.$route.query.type)
          if (this.$route.query.type === 'update') {
            updateNews(this)
          } else if (this.$route.query.type === 'create') {
            createNews(this)
          } else {
            createUpdateNews()
          }
        }
      })
    },
    onChange () {
      this.count = this.form.summary.length
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
  api.post(`admin/news/`, _this.form)
  .then(result => {
    _this.$message.success('success')
    _this.$router.push('/news?state=published')
  }).catch(err => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function createUpdateNews (_this) {
  _this.disabled = true
  api.put(`admin/news/${_this.$route.query.id}`, _this.form)
  .then(result => {
    console.log(result)
    api.patch(`admin/news/${_this.$route.query.id || result.data.id}/publish`)
    .then(result => {
      _this.$message.success('success')
      _this.$router.push('/news?state=published')
    })
  })
}

function getNews (_this) {
  api.get(`admin/news/${_this.$route.query.id}`)
  .then(result => {
    Object.keys(_this.form).forEach(key => {
      _this.form[key] = result.data.new[key]
    })
    _this.count = _this.form.summary.length
  }).catch(err => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus">
#add-news
  .count
    width 50%
    text-align right
  .el-input, .el-textarea
    width 50%
  .el-textarea textarea
    height 150px !important
</style>
