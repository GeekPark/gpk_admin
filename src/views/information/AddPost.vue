<template lang="pug">
.admin#add-post
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-post-form', :model='form', label-position='top', :rules="rule")
    el-form-item(label='标题', prop='title')
      el-input(v-model='form.title')
    el-form-item(label='摘要', prop='abstract')
      el-input(type='textarea',v-model='form.abstract')
    el-form-item(label='CCID')
      el-input(placeholder='视频类文章填写该项', v-model='form.video_id')
    el-form-item(label='音频ID')
      el-input(placeholder='早知道音频ID', v-model='form.audio_id')
    el-form-item(label='正文', prop='content')
      el-radio(class="radio" v-model="editorName" label="wang") 旧编辑器
      el-radio(class="radio" v-model="editorName" label="smeditor") 新编辑器 (beta)
      veditor(v-show='editorName === "wang"')
      smeditor(v-show='editorName !== "wang"', :config='smeditorConfig')
    el-form-item(label='添加标签（标签至少3个）', prop='tags')
      search-tag(:callback='searchTag', :tags='form.tags')
      ul.users(v-if='$route.query.id')
        li
          h3 当前编辑:
        li(v-for='username in users') {{username}}
        li
          h3 操作日志:
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
    el-form-item(label='发布时间', prop='date', v-if='form.state === "unpublished"')
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
    // const validateContent = (rule, value, callback) => {
    //   getContent(this)
    //   if (this.form.content_source === '') {
    //     callback(new Error('请输入内容'))
    //   } else {
    //     callback()
    //   }
    // }

    return {
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
        audio_id: '',
        post_type: 'text',
        histories: []
      },
      rulesOmit: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur', min: 0 }
        ],
        column_id: [
          { required: true, message: '请至少选择一个专栏', trigger: 'change' }
        ]
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur', min: 0 }
        ],
        abstract: [
          { required: true, message: '请输入文章摘要', trigger: 'blur', min: 0 }
        ],
        // content: [
        //   { required: true, validator: validateContent, trigger: 'blur' }
        // ],
        date: [
          { type: 'date', message: '请选择日期', trigger: 'change' }
        ],
        column_id: [
          { required: true, message: '请至少选择一个专栏', trigger: 'change' }
        ],
        tags: [
          { required: true, type: 'array', message: '请至少选择一个标签', trigger: 'change' }
        ],
        cover_id: [
          { type: 'number', required: true, message: '请上传文章头图', trigger: 'change' }
        ],
        authors: [
          { required: true, type: 'array', message: '请至少选择一个作者', trigger: 'change' }
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
  computed: {
    rule: function () {
      return (this.form.state === 'published' || this.form.auto_publish_at) ? this.rules : this.rulesOmit
    }
  },
  methods: {
    submitForm () {
      this.$refs['add-post-form'].validate((valid) => {
        if (valid) {
          if (this.form.video_id !== '') {
            this.form.post_type = 'video'
          }
          if (this.form.audio_id === '') {
            delete this.form.audio_id
          } else if (this.form.audio_id === 'null') {
            this.form.audio_id = null
          }
          if (this.form.state === 'published' || this.form.auto_publish_at === '') {
            delete this.form.auto_publish_at
          }
          getContent(this)
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
        const el = document.querySelector('.buttons')
        if (el.className.indexOf('isBarFixed') < 0) {
          el.className += ' isBarFixed'
        }
        document.querySelector('.preview').style.display = 'none'
      }
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getPost(this)
      relativeTime(this)
    } else {
      var userinfo = JSON.parse(window.localStorage.getItem('userinfo'))
      this.form.authors_full = [userinfo]
      this.form.authors = [userinfo]
    }
  }
}

function relativeTime (_this) {
  var nickname = window.localStorage.getItem('username')
  var cable = ActionCable.createConsumer(config.ws)
  var c = cable.subscriptions.create({
    channel: 'PostChannel',
    id: _this.$route.query.id,
    username: nickname}, {
      connected: function () {
      },
      disconnected: function () {
      },
      received: function (data) {
        // console.log(data)
        data.forEach(el => {
          _this.users.push(el)
        })
        _this.users = unique(_this.users)
        _this.users.forEach(user => {
          _this.$notify.warning(user + '正在该页面')
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
  _this.disabled = true
  api.put(`admin/posts/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    createHistory(_this.$route.query.id, _this, '编辑过文章')
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function createHistory (id, _this, other) {
  // 这个 api写的真差
  var nickname = window.localStorage.getItem('username')
  api.post(`admin/posts/${id}/history?history_record=${nickname}${other}`).then((res) => {
    _this.$message.success('success')
    _this.$router.push(`/posts?state=${_this.form.state}`)
  })
}

function createPost (_this) {
  _this.disabled = true
  api.post('admin/posts', _this.form)
  .then((result) => {
    createHistory(result.data.id, _this, '创建了文章')
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
    // _this.form.auto_publish_at = post.published_at
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
  height auto !important
  .el-input, .el-textarea
    width 50%
  .el-textarea textarea
    height 150px !important
  .users
    position absolute
    right 150px
    list-style none
    font-size 15px
    border 1px solid #9B9B9B
    padding 10px
    line-height 20px
    color #9B9B9B
    z-index 20
    padding-bottom 20px
  h3
    color #9B9B9B
  .tools-bar-btn
    margin 10px
  .smeditor
    position relative
  .el-form-item__content
    img
      max-width 100%
.isBarFixed
  position fixed
  top 0
  width calc(100% + 30px) !important
  margin-left -30px
  height 40px
</style>
