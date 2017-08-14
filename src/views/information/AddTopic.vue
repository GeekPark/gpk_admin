<template lang="jade">
#add-topic.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-topic-form', :model='form', label-width='150px', label-position='top', :rules='rules')
    el-form-item(label='专题名称', prop='title')
      el-input(placeholder='', v-model='form.title')
    el-form-item(label='描述', prop='description')
      el-input(type='textarea', placeholder='', v-model='form.description')
    el-form-item(label='背景封面')
      upload(:callback='uploadImage', :url='form.banner_url', :uploadDelete="uploadDelete")
    el-form-item.actions(label='')
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
        description: '',
        banner_url: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入专题标题', trigger: 'blur', min: 0 }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur', min: 0 }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs['add-topic-form'].validate((valid) => {
        console.log(valid)
        if (valid !== true) {
          return this.$message.error('内容信息不完整, 请完善后再提交!')
        } else {
          if (this.$route.query.id) {
            updateTopic(this)
          } else {
            createTopic(this)
          }
        }
      })
    },
    handleSelect (item) {
      console.log(item)
    },
    uploadImage (img) {
      this.form.banner_id = img.id
    },
    uploadDelete () {
      this.form.banner_url = this.form.banner_id = ''
    },
    close () {
      this.$router.push('/topics')
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getTopic(this)
    }
  }
}

function updateTopic (_this) {
  _this.disabled = true
  api.put(`admin/topics/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    _this.$message.success('success')
    _this.$router.push('/topics')
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function createTopic (_this) {
  _this.disabled = true
  api.post('admin/topics', _this.form)
  .then((result) => {
    _this.$message.success('success')
    _this.$router.push('/topics')
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function getTopic (_this) {
  api.get(`admin/topics/${_this.$route.query.id}`)
  .then((result) => {
    _this.form = result.data.topic
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.el-input, .el-textarea
  width 50%

</style>
