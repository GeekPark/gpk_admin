<template lang="pug">
.admin#add-iftalk
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-iftalk-form', :model='form', label-position='top', :rules="rules")
    el-form-item(label='标题', prop='title')
      el-input(v-model='form.title')
    el-form-item(label='摘要', prop='abstract')
      el-input(type='textarea',v-model='form.abstract')

    el-form-item(label='显示类型')
      el-select(v-model='form.display_type', placeholder='请选择')
        el-option(v-for='item in display_type_states',
                  :label='item.title',
                  :value='item.val',
                  :key='item.val')

    el-form-item(label='音频')
      el-input(placeholder='音频ID', v-model='form.audio_id')

    el-form-item(label='本期嘉宾', prop='guest')
      search-guest(:callback='searchGuest', :guests='form.guest')
    el-form-item(label='话题内容', prop='topic_abstract')
      #topic_abstract
        smeditor(:config='smeditorConfig')
    el-form-item(label='封面图', prop='cover_id')
      upload(:callback='uploadCover', :url='form.cover_url', :uploadDelete="deleteCover")
    el-form-item(label='限免分享图', prop='share_id')
      upload(:callback='uploadShare', :url='form.share_url', :uploadDelete="deleteShare")
    el-form-item(label='文稿标题', prop='manuscript_title')
      el-input(v-model='form.manuscript_title')
    el-form-item(label='文稿正文', prop='content_source')
      #content_source
        smeditor(:config='smeditorConfig')
    el-form-item(label='状态')
      el-select(v-model='form.state', placeholder='请选择')
        el-option(v-for='item in post_states',
                  :label='item.title',
                  :value='item.val',
                  :key='item.val')
    el-form-item(label='限免时间', prop='date')
      el-date-picker(v-model='form.free_date',
                     type='datetime',
                     placeholder='选择日期时间')
    el-form-item(label='')
      el-button(type='primary', :disabled='disabled', @click='submitForm') 提交
      el-button(type='danger', @click='close') 关闭
</template>

<script>
import api from 'stores/api'
import smeditor from 'smeditor'
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
    // const validateArray = (rule, value, callback) => {
    //   if (value === undefined || value.length && value.length === 0) {
    //     callback(new Error('请输入内容'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      smeditorConfig: smeditorConfig,
      moment: tools.moment,
      disabled: false,
      editorName: 'wang',
      form: {
        title: '',
        abstract: '',
        display_type: 'text',
        content_source: '',
        topic_abstract: '',
        manuscript_title: '',
        audio_id: '',
        cover_url: '',
        share_url: '',
        guests: [],
        guest: [],
        free_date: '',
        state: 'unpublish'
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur', min: 0 }
        ],
        abstract: [
          { required: true, message: '请输入文章摘要', trigger: 'blur', min: 0 }
        ]
      },
      post_states: [{
        title: '草稿',
        val: 'unpublish'
      }, {
        title: '已发布',
        val: 'publish'
      }],
      display_type_states: [{
        title: '文本',
        val: 'text'
      }, {
        title: '图像',
        val: 'graphic'
      }]
    }
  },
  methods: {
    submitForm () {
      this.$refs['add-iftalk-form'].validate((valid) => {
        if (valid) {
          this.get_topic_abstract()
          this.get_content_source()
          if (this.$route.query.id) {
            updateIftalk(this)
          } else {
            createIftalk(this)
          }
        } else {
          this.$message.error('内容信息不完整, 请完善后再提交!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs['add-iftalk-form'].resetFields()
    },
    uploadCover (img) {
      this.form.cover_id = img.id
      this.form.cover_url = ''
    },
    deleteCover () {
      this.form.cover_url = 'deleted'
      this.form.cover_id = ''
    },
    uploadShare (img) {
      this.form.share_id = img.id
      this.form.share_url = ''
    },
    deleteShare () {
      this.form.share_url = 'deleted'
      this.form.share_id = ''
    },
    searchGuest (guests) {
      this.form.guests = guests
    },
    close () {
      this.$router.push('/if_talks')
    },
    getSmeditor () {
      return document.querySelector('.smeditor .input-area')
    },
    get_topic_abstract () {
      this.form.topic_abstract = document.querySelector('#topic_abstract .input-area').innerHTML
    },
    get_content_source () {
      this.form.content_source = document.querySelector('#content_source .input-area').innerHTML
    }
  },
  // watch: {
  //   'editorName': function () {
  //     const html = this.$store.state.htmlEditor.txt.html()
  //     this.form.content_source = html
  //     this.getSmeditor().innerHTML = html
  //     document.querySelector('.preview').style.display = 'none'
  //   }
  // },
  mounted () {
    if (this.$route.query.id) {
      getIftalk(this)
    }
  }
}

function updateIftalk (_this) {
  _this.disabled = true
  api.put(`admin/if_talks/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    _this.$message.success('success')
    _this.$router.push(`/iftalk?state=${_this.form.state}`)
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function createIftalk (_this) {
  _this.disabled = true
  api.post('admin/if_talks', _this.form)
  .then((result) => {
    _this.$message.success('success')
    _this.$router.push(`/iftalk?state=${_this.form.state}`)
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function getIftalk (_this) {
  api.get(`admin/if_talks/${_this.$route.query.id}`)
  .then((result) => {
    const {if_talk} = result.data
    Object.keys(_this.form).forEach(key => {
      _this.form[key] = if_talk[key] || _this.form[key]
    })
    // _this.form.guests = if_talk.guest || []
    document.querySelector('#topic_abstract .input-area').innerHTML = _this.form.topic_abstract || ''
    document.querySelector('#content_source .input-area').innerHTML = _this.form.content_source || ''
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

</script>

<style lang="stylus">
#add-iftalk
  .el-input, .el-textarea
    width 50%
  .el-textarea textarea
    height 150px !important
  .guests
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
    .preview
      display none
</style>
