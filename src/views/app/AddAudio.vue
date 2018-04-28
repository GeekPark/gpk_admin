<template lang="pug">
.admin#add-audio
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-audio-form', :model='form', label-position='top')
    el-form-item(label='音频文件', prop='file')
      input(type="file" @change="getFile($event)")
    el-form-item(label='价格', prop='price')
      el-input(placeholder='请输入价格', v-model='form.price')
    el-form-item(label='')
      el-button(type='primary', :disabled='disabled', @click='submitForm') 提交
      el-button(type='danger', @click='close') 关闭
</template>

<script>
import api from 'stores/api'

export default {
  data () {
    return {
      disabled: false,
      form: {
        file: '',
        price: 0
      },
      rules: {
        file: [
          { required: true, message: '请选择音频文件', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['add-audio-form'].validate((valid) => {
        if (valid) {
          let formData = new FormData()
          formData.append('price', this.form.price)
          formData.append('file', this.form.file)
          if (this.$route.query.id) {
            updateAudio(this, formData)
          } else {
            createAudio(this, formData)
          }
        } else {
          this.$message.error('内容信息不完整, 请完善后再提交!')
          return false
        }
      })
    },
    getFile (event) {
      this.form.file = event.target.files[0]
      console.log(this.form.file)
    },
    resetForm () {
      this.$refs['add-audio-form'].resetFields()
    },
    close () {
      this.$router.push('/audios')
    },
    beforeUpload (file) {
      this.form.file = file
      console.log('123')
      // const isLt2M = file.size / 1024 / 1024 < 20
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 20MB!')
      // }
      // return isLt2M
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getAudio(this)
    }
  }
}

let headersConfig = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}

function updateAudio (_this, formData) {
  _this.disabled = true
  api.put(`admin/audios/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    _this.$message.success('success')
    _this.$router.push(`/audios?state=${_this.form.state}`)
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function createAudio (_this, formData) {
  _this.disabled = true
  api.post('admin/audios', formData, headersConfig)
  .then((result) => {
    _this.$message.success('success')
    _this.$router.push(`/audios?state=${_this.form.state}`)
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function getAudio (_this) {
  api.get(`admin/audios/${_this.$route.query.id}`)
  .then((result) => {
    const {audio} = result.data
    Object.keys(_this.form).forEach(key => {
      _this.form[key] = audio[key]
    })
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus">
#add-audio
  .el-input, .el-textarea
    width 50%
  .el-textarea textarea
    height 150px !important
  h3
    color #9B9B9B
</style>
