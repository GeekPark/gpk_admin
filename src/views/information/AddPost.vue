<template lang="jade">
.admin#add-post
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-post-form', :model='form', label-position='top', :rules="rules")
    el-form-item(label='标题', prop='title')
      el-input(v-model='form.title')
    el-form-item(label='摘要', prop='abstract')
      el-input(type='textarea',v-model='form.abstract')
    el-form-item(label='CCID')
      el-input(placeholder='视频类文章填写该项', v-model='form.video_id')
    el-form-item(label='写作模式')
      el-select(v-model='form.content_type', placeholder='请选择')
        el-option(v-for='item in content_types',
                  :label='item.title',
                  :value='item.val',
                  :key='item.val',)
    el-form-item(label='正文', prop='content')
      vmarkdown(v-if='$route.query.content_type !=="html"'
              v-bind:markdown='form.markdown')
      veditor(v-else)
    el-form-item(label='添加标签', prop='tags')
      search-tag(:callback='searchTag')
    el-form-item(label='栏目选择', prop='column_id')
      search-column(:callback='searchColumn')
    el-form-item(label='文章头图', prop='cover_id')
      upload(:callback='uploadImage', :url='form.cover_url', :uploadDelete="uploadDelete")
    el-form-item(label='作者', prop='author_ids')
      search-user(:callback='searchUser', :multiple='true')
    el-form-item(label='定时发送', prop='date')
      el-date-picker(v-model='form.auto_publish_at',
                     type='datetime',
                     placeholder='选择日期时间')
    el-form-item(label='')
      el-button(type='primary', @click='submitForm') 发布
      el-button(type='success', @click='state="unpublished", submitForm') 存草稿
      el-button(type='danger', @click='close') 关闭
</template>

<script>
import api from 'stores/api'

export default {
  data () {
    const validateContent = (rule, value, callback) => {
      getContent(this)
      if (this.form.content_source === '') {
        callback(new Error('请输入内容'))
      } else {
        callback()
      }
    }
    const validateArray = (rule, value, callback) => {
      if (value === undefined || value.length && value.length === 0) {
        callback(new Error('请输入内容'))
      } else {
        callback()
      }
    }
    const contentType = this.$route.query.content_type || ''
    return {
      form: {
        title: '',
        abstract: '',
        content_type: contentType,
        content_source: '',
        tags: [],
        column_id: '',
        cover_id: '',
        cover_url: '',
        author_ids: [],
        auto_publish_at: null,
        state: 'published',
        video_id: '',
        post_type: 'text'
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur', min: 0 }
        ],
        abstract: [
          { required: true, message: '请输入文章摘要', trigger: 'blur', min: 0 }
        ],
        content: [
          { required: true, validator: validateContent, trigger: 'blur' }
        ],
        date: [
          { type: 'date', message: '请选择日期', trigger: 'change' }
        ],
        column_id: [
          { required: true, validator: validateArray, message: '请至少选择一个专栏', trigger: 'change' }
        ],
        tags: [
          { required: true, validator: validateArray, message: '请至少选择一个标签', trigger: 'change' }
        ],
        cover_id: [
          { type: 'number', required: true, message: '请上传文章头图', trigger: 'change' }
        ],
        author_ids: [
          { required: true, validator: validateArray, message: '请至少选择一个作者', trigger: 'change' }
        ]
      },
      content_types: [{
        title: '富文本',
        val: 'html'
      }, {
        title: 'markdown',
        val: 'markdown'
      }]
    }
  },
  methods: {
    submitForm () {
      this.$refs['add-post-form'].validate((valid) => {
        if (valid) {
          delete this.form.cover_url
          if (this.form.video_id !== '') {
            this.form.post_type = 'video'
          }
          if (this.$route.query.id) {
            updatePost(this)
          } else {
            createPost(this)
          }
        } else {
          this.$message.error('内容信息不完整, 请完善后再提交!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs['add-post-form'].resetFields()
    },
    uploadImage (img) {
      this.form.cover_id = img.id
    },
    uploadDelete () {
      this.form.cover_url = this.form.cover_id = ''
    },
    searchUser (users) {
      this.form.author_ids = users
    },
    searchTag (tags) {
      this.form.tags = tags
    },
    searchColumn (column) {
      this.form.column_id = column
    },
    close () {
      window.close()
    }
  },
  watch: {
    'form.content_type': function (val) {
      const id = this.$route.query.id ? `&id=${this.$route.query.id}` : ''
      this.$router.push(`${this.$route.path}?content_type=${val}${id}`)
      addContent(this, val)
    }
  },
  mounted () {
    if (this.$route.query.id) { getPost(this) }
  }
}

function getContent (_this) {
  if (_this.$route.query.content_type === 'html') {
    _this.form.content_source = _this.$store.state.htmlEditor.txt.html()
  } else {
    _this.form.content_source = _this.$store.state.markdownEditor.value()
  }
}

function addContent (_this, val) {
  setTimeout(() => {
    if (val === 'html') {
      _this.$store.state.htmlEditor.txt.html(_this.form.content_source)
    } else {
      _this.$store.state.markdownEditor.value(_this.form.content_source)
    }
  }, 100)
}

function updatePost (_this) {
  getContent(_this)
  api.put(`admin/posts/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    _this.$message.success('success')
    window.close()
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function createPost (_this) {
  getContent(_this)
  api.post('admin/posts', _this.form)
  .then((result) => {
    _this.$message.success('success')
    window.close()
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function getPost (_this) {
  api.get(`admin/posts/${_this.$route.query.id}`)
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
.el-select-dropdown
  z-index 99999 !important

#add-post
  hegiht auto !important
</style>
