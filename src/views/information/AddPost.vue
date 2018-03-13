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
    el-form-item(label='正文', prop='content')
      el-radio(class="radio" v-model="editorName" label="wang") 旧编辑器
      el-radio(class="radio" v-model="editorName" label="smeditor") 新编辑器 (beta)
      el-button.tools-bar-btn(@click='toolsBarClick', v-show='editorName !== "wang"') 工具栏吸顶
      veditor(v-show='editorName === "wang"')
      smeditor(v-show='editorName !== "wang"')
    el-form-item(label='添加标签（标签至少3个）', prop='tags')
      search-tag(:callback='searchTag', :tags='form.tags')
      ul.users(v-if='$route.query.id')
        li
          h3 当前编辑:
        li(v-for='username in users') {{username}}
        li
          h3 历史记录:
        li(v-for='item in form.histories')
          span {{moment(item.created_at)}} &nbsp
          span {{item.history_record}}
    el-form-item(label='栏目选择', prop='column_id')
      search-column(:callback='searchColumn', :column='form.column')
    el-form-item(label='文章头图（1400×780）', prop='cover_id')
      upload(:callback='uploadImage', :url='form.cover_url', :uploadDelete="uploadDelete")
    el-form-item(label='作者', prop='authors')
      search-user(:callback='searchUser', :authors='form.authors_full',:multiple='true')
    el-form-item(label='状态')
      el-select(v-model='form.state', placeholder='请选择')
        el-option(v-for='item in post_states',
                  :label='item.title',
                  :value='item.val',
                  :key='item.val')
    el-form-item(label='发布时间', prop='date', v-if='form.state === "published"')
      el-date-picker(v-model='form.auto_publish_at',
                     type='datetime',
                     placeholder='选择日期时间')
    el-form-item(label='')
      el-button(type='primary', :disabled='disabled', @click='submitForm') 提交
      el-button(type='danger', @click='close') 关闭
</template>

<script>
import api from 'stores/api'
import smeditor from 'smeditor'
import ActionCable from 'actioncable'
import tools from '../../tools'
import config from '../../config.js'
const smeditorConfig = {
  // 接口地址
  uploadUrl: `${config.api}/api/v1/admin/images`,
  // form 里的 filename
  uploadName: 'upload_file',
  // 其他参数
  uploadParams: {},
  onScroll: () => {},
  // 上传成功回调
  uploadCallback: (data) => {
    // console.log(data)
    return data.image.url
  },
  // 上传失败回调, 可选
  uploadFailed: (err) => {
    // console.log('仅供测试, 并非真正上传')
    alert('仅供测试, 并非真正上传!', err)
  }
}

export default {
  components: {
    'smeditor': smeditor
  },
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
    return {
      isFixed: false,
      smeditorConfig: smeditorConfig,
      moment: tools.moment,
      users: [],
      disabled: false,
      editorName: 'wang',
      form: {
        title: '',
        abstract: '',
        content_type: 'html',
        content_source: '',
        tags: [],
        column: [],
        column_id: '',
        cover_id: '',
        cover_url: '',
        authors: [],
        authors_full: [],
        auto_publish_at: '',
        state: 'unpublished',
        video_id: '',
        post_type: 'text',
        histories: []
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
        authors: [
          { required: true, validator: validateArray, message: '请至少选择一个作者', trigger: 'change' }
        ]
      },
      post_states: [{
        title: '草稿',
        val: 'unpublished'
      }, {
        title: '已发布',
        val: 'published'
      }],
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
          if (this.form.video_id !== '') {
            this.form.post_type = 'video'
          }
          if (this.form.auto_publish_at === '') {
            delete this.form.auto_publish_at
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
      this.form.cover_url = ''
    },
    uploadDelete () {
      this.form.cover_url = 'deleted'
      this.form.cover_id = ''
    },
    searchUser (users) {
      this.form.authors = users
    },
    searchTag (tags) {
      this.form.tags = tags
    },
    searchColumn (column) {
      this.form.column_id = column
    },
    close () {
      this.$router.push('/posts')
    },
    getSmeditor () {
      return document.querySelector('.smeditor .input-area')
    },
    toolsBarClick () {
      this.isFixed = !this.isFixed
      const el = document.querySelector('.buttons')
      if (this.isFixed) {
        el.className += ' isFixed'
      } else {
        el.className = el.className.replace('isFixed', '')
      }
    }
  },
  watch: {
    'form.content_type': function (val) {
      const id = this.$route.query.id ? `&id=${this.$route.query.id}` : ''
      this.$router.push(`${this.$route.path}?content_type=${val}${id}`)
      addContent(this, val)
    },
    'editorName': function () {
      if (this.editorName === 'wang') {
        const html = this.getSmeditor().innerHTML
        this.$store.state.htmlEditor.txt.html(html)
        this.form.content_source = html
      } else {
        const html = this.$store.state.htmlEditor.txt.html()
        this.form.content_source = html
        this.getSmeditor().innerHTML = html
      }
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getPost(this)
      relativeTime(this)
    }
  }
}

function relativeTime (_this) {
  var nickname = window.localStorage.getItem('username')
  var cable = ActionCable.createConsumer('ws://main_test.geekpark.net/cable')
  var c = cable.subscriptions.create({channel: 'PostChannel', id: _this.$route.query.id}, {
    connected: function () {
      this.enter()
    },
    disconnected: function () {
      this.exit()
    },
    received: function (data) {
      // console.log(data)
      data.forEach(el => {
        _this.users.push(el)
      })
      _this.users = unique(_this.users)
    },
    enter: function () {
      this.perform('enter', {
        username: nickname
      })
    },
    exit: function () {
      this.perform('exit', {
        username: nickname
      })
    }
  })
  window.onbeforeunload = function () {
    c.exit()
    return 'Bye now!'
  }
}

function unique (arr) {
  const seen = new Map()
  return arr.filter((a) => !seen.has(a) && seen.set(a, 1))
}

function getContent (_this) {
  let html = ''
  if (_this.editorName === 'wang') {
    html = _this.$store.state.htmlEditor.txt.html()
  } else {
    html = _this.getSmeditor().innerHTML
  }
  _this.form.content_source = html
}

function addContent (_this, val) {
  setTimeout(() => {
    _this.$store.state.htmlEditor.txt.html(_this.form.content_source)
  }, 100)
}

function updatePost (_this) {
  getContent(_this)
  _this.disabled = true
  api.put(`admin/posts/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    createHistory(_this.$route.query.id, _this)
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function createHistory (id, _this) {
  // 这个 api写的真差
  var nickname = window.localStorage.getItem('username')
  api.post(`admin/posts/${id}/history?history_record=${nickname}`).then((res) => {
    _this.$message.success('success')
    _this.$router.push(`/posts?state=${_this.form.state}`)
  })
}

function createPost (_this) {
  _this.disabled = true
  api.post('admin/posts', _this.form)
  .then((result) => {
    createHistory(result.data.id, _this)
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function getPost (_this) {
  api.get(`admin/posts/${_this.$route.query.id}`)
  .then((result) => {
    const {post} = result.data
    post.column_id = post.column.id
    Object.keys(_this.form).forEach(key => {
      _this.form[key] = post[key]
    })
    _this.form.auto_publish_at = post.published_at
    _this.form.authors_full = post.authors
    _this.form.authors = _this.form.authors_full ? _this.form.authors_full.map(el => el.id) : []
    _this.form.video_id = post.extra.video_id
    addContent(_this, _this.form.content_type)
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

</script>

<style lang="stylus">
#add-post
  hegiht auto !important
  .el-input, .el-textarea
    width 50%
  .el-textarea textarea
    height 150px !important
  .users
    position absolute
    right 150px
    list-style none
    font-size 15px
    border 1px solid #BFBFBF
    padding 7.5px
    line-height 20px
  .tools-bar-btn
    margin 10px
.isFixed
  .buttons
    position fixed
    top 0
    width 100%
</style>
