<template lang="jade">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-post-form', :model='form', label-position='top', :rules="rules")
    el-form-item(label='标题', prop='title')
      el-input(v-model='form.title')
    el-form-item(label='摘要', prop='abstract')
      el-input(type='textarea',v-model='form.abstract')
    el-form-item(label='CCID')
      el-input(placeholder='极客制造栏目专用', v-model='form.ccid')
    el-form-item(label='写作模式')
      el-select(v-model='form.content_type', placeholder='请选择')
        el-option(v-for='item in content_types',
                  :label='item.title',
                  :value='item.val',
                  :key='item.val',)
    el-form-item(label='正文', prop='content')
      vmarkdown(v-if='$route.query.content_type !=="html"'
              v-bind:markdown='form.markdown')
      veditor#veditor(style="height:400px;max-height:500px;", v-else)
    el-form-item(label='添加标签', prop='tags')
      search-tag(:callback='searchTag')
    el-form-item(label='栏目选择', prop='column_id')
      search-column(:callback='searchColumn')
    el-form-item(label='文章头图', prop='img')
      upload(:callback='uploadImage')
    el-form-item(label='作者', prop='user')
      search-user(:callback='searchUser')
    el-form-item(label='定时发送', prop='date')
      el-date-picker(v-model='form.auto_publish_at',
                     type='datetime',
                     placeholder='选择日期时间')
    el-form-item(label='')
      el-button(type='primary', @click='submitForm') 发布
      el-button(type='success', @click='submitForm') 存草稿
      el-button(type='danger', @click='submitForm') 取消
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
      if (value.length === 0) {
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
        column_id: [],
        cover_id: '',
        author_ids: [],
        auto_publish_at: null,
        state: 'published',
        meta: {},
        ccid: ''
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
        img: [
          { type: 'string', required: true, message: '请上传文章头图', trigger: 'change' }
        ],
        user: [
          { required: true, validator: validateArray, message: '请至少选择一个作者', trigger: 'change' }
        ]
      },
      content_types: [{
        title: '富文本',
        val: 'html'
      }, {
        title: 'markdown',
        val: 'markdown'
      }, {
        title: 'plain',
        val: 'plain'
      }]
    }
  },
  methods: {
    submitForm () {
      this.$refs['add-post-form'].validate((valid) => {
        if (valid) {
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
    searchUser (user) {
    },
    searchTag (tags) {
      this.form.tags = tags
    },
    searchColumn (column) {
      this.form.column_id = column
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
    if (this.$route.query.id) {
      getPost(this)
    }
  }
}

function getContent (_this) {
  if (_this.$route.query.content_type === 'html') {
    _this.form.content_source = _this.$store.state.htmlEditor.$txt.html()
  } else {
    _this.form.content_source = _this.$store.state.markdownEditor.value()
  }
}

function addContent (_this, val) {
  setTimeout(() => {
    if (val === 'html') {
      _this.$store.state.htmlEditor.$txt.html(_this.form.content_source)
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
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function createPost (_this) {
  getContent(_this)
  api.post('admin/posts', _this.form)
  .then((result) => {
    _this.$message.success('success')
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

<style lang="stylus">
.el-select-dropdown
  z-index 99999 !important

#add-post
  .el-select
    width 50%

</style>
