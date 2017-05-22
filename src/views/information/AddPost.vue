<template lang="jade">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='form', :model='form', label-position='top')
    el-form-item(label='标题')
      el-input(placeholder='请输入标题 必填', v-model='form.title')
    el-form-item(label='摘要')
      el-input(type='textarea',
               placeholder='请输入摘要 可选',
               v-model='form.abstract')
    el-form-item(label='CCID')
      el-input(placeholder='极客制造栏目专用', v-model='form.title')
    el-form-item(label='写作模式')
      el-select(v-model='form.content_type', placeholder='请选择')
        el-option(v-for='item in content_types',
                  :label='item.title',
                  :value='item.val')
    el-form-item(label='正文')
      vmarkdown(v-if='$route.query.content_type !=="html"'
              v-bind:markdown='form.markdown')
      veditor#veditor(style="height:400px;max-height:500px;", v-else)
    el-form-item(label='添加标签')
      el-tag(:key='tag',
             v-for='tag in form.tags',
             :closable='true',
             :close-transition='false',
             type='primary',
             @close='handleClose(tag)') | {{tag}}
      el-input.input-new-tag(v-if='inputVisible',
                             v-model='inputValue',
                             ref='saveTagInput',
                             size='mini',
                             @keyup.enter.native='handleInputConfirm',
                             @blur='handleInputConfirm')
      el-button.button-new-tag(v-else='',
                               size='small',
                               @click='showInput') + New Tag
    el-form-item(label='栏目选择')
      el-select(v-model='form.column_id', placeholder='请选择')
        el-option(v-for='item in columns',
                  :label='item.title',
                  :value='item.id')
    upload(:callback='uploadImage')
    search-user
    el-form-item(label='定时发送')
      el-date-picker(v-model='form.auto_publish_at',
                     type='datetime',
                     placeholder='选择日期时间')
    el-form-item(label='')
      el-button(type='primary', @click='onSubmit') 发布
      el-button(type='success', @click='onSubmit') 存草稿
      el-button(type='danger', @click='onSubmit') 取消
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
        column_id:       null,
        cover_id:        '',
        author_ids:      [],
        auto_publish_at: null,
        state:           'published',
        meta:            {},
      },
      columns: [],
      inputVisible: false,
      inputValue:   '',
      editor:       {},
      state: '',
      timeout:  null,
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
    onSubmit() {
      if (this.$route.query.id) {
        updatePost(this)
      } else {
        createPost(this)
      }
    },
    handleClose(tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1);
    },

    uploadImage(img) {
      this.form.cover_id = img.id
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  },
  watch: {
    'form.content_type': function (val) {
       this.$router.push(`${this.$route.path}?content_type=${val}&id=${this.$route.query.id}`)
       addContent(this, val)
    }
  },
  mounted () {
     getColumns(this)
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


function getColumns (_this) {
  api.get('admin/columns')
  .then((result) => {
    _this.columns = result.data.columns
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus">
#add-post
  .el-input--mini
      width 200px !important

  .el-form-item
    margin-bottom 5px !important


.el-autocomplete-suggestion
  border 1px solid #D7D7D7
  background white !important
  height 250px !important
  overflow-y scroll !important
  li
    padding 10px !important
    list-style none !important
</style>
