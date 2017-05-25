<template lang="jade">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-post-form', :model='form', label-position='top', :rules="rules")
    el-form-item(label='标题', prop='title', required)
      el-input(placeholder='请输入标题 必填', v-model='form.title')
    el-form-item(label='摘要')
      el-input(type='textarea',
               placeholder='请输入摘要 可选',
               v-model='form.abstract')
    el-form-item(label='CCID')
      el-input(placeholder='极客制造栏目专用', v-model='form.title')
    el-form-item(label='写作模式', required)
      el-select(v-model='form.content_type', placeholder='请选择')
        el-option(v-for='item in content_types',
                  :label='item.title',
                  :value='item.val')
    el-form-item(label='正文')
      vmarkdown(v-if='$route.query.content_type !=="html"'
              v-bind:markdown='form.markdown')
      veditor#veditor(style="height:400px;max-height:500px;", v-else)
    search-tag(:callback='searchTag')
    upload(:callback='uploadImage')
    search-user(:callback='searchUser')
    search-column(:callback='searchColumn')
    el-form-item(label='定时发送')
      el-date-picker(v-model='form.auto_publish_at',
                     type='datetime',
                     placeholder='选择日期时间')
    el-form-item(label='')
      el-button(type='primary', @click='submitForm') 发布
      el-button(type='success', @click='submitForm') 存草稿
      el-button(type='danger', @click='submitForm') 取消
</template>

<script>

import tools    from 'tools'
import api      from 'stores/api'

export default {
  data () {
    const content_type = this.$route.query.content_type || '';
    return {
      form: {
        title:           '',
        abstract:        '',
        content_type:    content_type,
        content_source:  '',
        tags:            [],
        column_id:       [],
        cover_id:        '',
        author_ids:      [],
        auto_publish_at: null,
        state:           'published',
        meta:            {},
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        date: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ]
      },
      content_types: [{
        title: '富文本',
        val: 'html',
      },{
        title: 'markdown',
        val: 'markdown'
      },{
        title: 'plain',
        val: 'plain'
      }],
    }
  },
  methods: {
    submitForm() {
      this.$refs['add-post-form'].validate((valid) => {
        if (valid) {
          if (this.$route.query.id) {
            updatePost(this)
          } else {
            createPost(this)
          }
        } else {
          this.$message.error('参数错误!')
          return false;
        }
      });
    },
    resetForm() {
      this.$refs['add-post-form'].resetFields();
    },
    uploadImage(img) {
      this.form.cover_id = img.id
    },
    searchUser(user) {

    },
    searchTag(tags) {
      this.form.tags = tags;
    },
    searchColumn(column) {

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

function getContent(_this) {
  if (_this.$route.query.content_type === 'html') {
    _this.form.content_source = _this.$store.state.htmlEditor.$txt.html()
  } else {
    _this.form.content_source = _this.$store.state.markdownEditor.value()
  }
}

function addContent(_this, val) {
  setTimeout(() => {
    if (val === 'html') {
      _this.$store.state.htmlEditor.$txt.html(_this.form.content_source)
    } else {
      _this.$store.state.markdownEditor.value(_this.form.content_source)
    }
  },100)
}

function updatePost(_this) {
  getContent(_this)
  api.put(`admin/posts/${_this.$route.query.id}`, _this.form)
  .then((result) => {
     _this.$message.success('success')
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}

function createPost(_this) {
  getContent(_this)
  api.post('admin/posts', _this.form)
  .then((result) => {
     _this.$message.success('success')
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}

function getPost(_this) {
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
#add-post
  .el-select
    width 50%
</style>
