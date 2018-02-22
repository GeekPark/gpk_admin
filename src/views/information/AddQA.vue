<template lang="jade">
#add-news.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-qa-form', :model='form', label-width='150px', label-position='top', :rules='rules')
    el-form-item(label='标题 (必填)', prop='title')
      el-input(placeholder='请输入标题', v-model='form.title')
    el-form-item(label='补充描述')
      el-input(type='textarea',  v-model='form.description')
      .count 字数 {{form.description.length}}
    el-form-item(label='是否添加投票')
      el-select(v-model='form.is_vote', placeholder='请选择')
        el-option(v-for='(value, key) in types', :label='key', :value='value', :key='value')
    el-form-item(v-if='form.is_vote === "true"')
       el-checkbox(v-model="single") 单选
       el-checkbox(v-model="multiple") 多选
    el-form-item(v-if='form.is_vote === "true"', v-for='(voteItem, index) in form.options_attributes', :label="'选项' + parseInt(index + 1) ", :key='voteItem.key',:rules="{\
        required: true, message: '选项不能为空', trigger: 'blur'\
        }")
        el-input(v-model='voteItem.name')

        .upload(@click='uploadAction(voteItem)')
          el-upload.avatar-uploader(
                           :action='uploadUrl',
                           name='upload_file',
                           :show-file-list="false",
                           :on-success="handleAvatarScucess",
                           :before-upload="beforeAvatarUpload")
            img.avatar(v-if="voteItem.cover_url", :src="voteItem.cover_url")
            i.avatar-uploader-icon.el-icon-plus(v-else)
          i.avatar-delete-icon.el-icon-delete(v-if="voteItem.cover_url != ''", @click="avatarDelete(voteItem)")
        el-button.remove-vote(@click.prevent='removevoteItem(voteItem)', v-show='form.options_attributes.length > 2') 删除
    el-form-item(label='', v-if='form.is_vote === "true"')
      el-button(@click='addvoteItem') 添加选项
    el-form-item(label='上传头图 (必填)')
      upload(:callback='uploadImage', :url='form.cover_url', :uploadDelete="deleteImage")
    el-form-item(label='')
      el-button(type='primary', :disabled='disabled', @click='onSubmit') 发布
      el-button(type='danger', @click='close') 关闭
</template>

<script>
import api from 'stores/api'
import config from '../../config.js'
const url = 'admin/questions'
const maxVote = 2
export default {
  data () {
    return {
      uploadUrl: `${config.api}/api/v1/admin/images`,
      disabled: false,
      types: {
        '是': 'true',
        '否': 'false'
      },
      form: {
        title: '',
        description: '',
        is_vote: 'false',
        question_type: 'single',
        cover_url: '',
        cover_id: '',
        options_attributes: []
      },
      voteItem: {},
      single: true,
      multiple: false,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur', min: 0 }
        ]
      }
    }
  },
  methods: {
    uploadAction (voteItem) {
      this.voteItem = voteItem
    },
    onSubmit () {
      if (this.form.cover_id === '') {
        return this.$message.error('请选择头图')
      }
      this.$refs['add-qa-form'].validate((valid) => {
        if (valid !== true) {
          return this.$message.error('内容信息不完整, 请完善后再提交!')
        } else {
          console.log(this.form)
          if (this.$route.query.id) {
            this.form.options_attributes = this.form.options_attributes.map(el => {
              return {name: el.name, cover_id: el.cover_id, id: el.id}
            })
            updateQA(this)
          } else {
            this.form.options_attributes = this.form.options_attributes.map(el => {
              return {name: el.name, cover_id: el.cover_id}
            })
            createQA(this)
          }
        }
      })
    },
    close () {
      this.$router.push('/qa')
    },
    deleteImage () {
      this.form.cover_url = 'deleted'
      this.form.cover_id = ''
    },
    uploadImage (img) {
      this.form.cover_id = img.id
      this.form.cover_url = ''
    },
    handleAvatarScucess (response, file, fileList) {
      console.log(response)
      this.$message.success('上传成功')
      this.form.options_attributes.forEach((el, index) => {
        if (el.key === this.voteItem.key) {
          el.cover_url = response.image.url
          el.cover_id = response.image.id
          this.$set(this.form.options_attributes, index, el)
        }
      })
      this.voteItem = {}
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 20MB!')
      }
      return isLt2M
    },
    avatarDelete (voteItem) {
      voteItem.cover_url = ''
      voteItem.cover_id = ''
      this.voteItem = {}
    },
    removevoteItem (item) {
      if (this.form.options_attributes.length <= maxVote) {
        return
      }
      let index = this.form.options_attributes.indexOf(item)
      if (index !== -1) {
        this.form.options_attributes.splice(index, 1)
      }
    },
    addvoteItem () {
      this.form.options_attributes.push({
        name: '',
        cover_url: '',
        cover_id: '',
        key: Date.now() + Math.ceil(Math.random() * 10000)
      })
    }
  },
  watch: {
    'form.is_vote': function (val) {
      console.log(val)
      if (val && this.form.options_attributes.length < 2) {
        this.addvoteItem()
        this.addvoteItem()
      }
    },
    'single': function (val) {
      if (val) {
        this.multiple = false
        this.form.question_type = 'multiple'
      }
    },
    'multiple': function (val) {
      if (val) {
        this.single = false
        this.form.question_type = 'single'
      }
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getQA(this)
    } else {
      for (let i = 0; i < maxVote; i++) {
        this.addvoteItem()
      }
    }
  }
}

function updateQA (_this) {
  _this.disabled = true
  _this.form.question_type = _this.single === true ? 'single' : 'multiple'
  // console.log(_this.form)
  api.put(`${url}/${_this.$route.query.id}`, {question: _this.form})
  .then(result => {
    _this.$message.success('success')
    _this.close()
  }).catch(err => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function createQA (_this) {
  _this.disabled = true
  const form = Object.assign({}, _this.form)
  delete form.cover_url
  form.question_type = _this.single === true ? 'single' : 'multiple'
  api.post(`${url}/`, {question: form})
  .then(result => {
    _this.$message.success('success')
    _this.close()
  }).catch(err => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function getQA (_this) {
  api.get(`${url}/${_this.$route.query.id}`)
  .then(result => {
    Object.keys(_this.form).forEach(key => {
      _this.form[key] = result.data.question[key]
    })
    _this.form.is_vote = _this.form.is_vote.toString()
    if (_this.form.question_type === 'single') {
      _this.single = true
      _this.multiple = false
    } else {
      _this.single = false
      _this.multiple = true
    }
    _this.form.options_attributes.forEach(el => {
      el.key = Date.now() + Math.ceil(Math.random() * 10000)
    })
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
.upload {
  position: relative;
  margin-top 10px
  .el-input {
    width 40%
  }
}
.remove-vote {
    display inline-block
  }
</style>
