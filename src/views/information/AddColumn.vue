<template lang="jade">
#add-column.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-column-form', :model='form', label-width='150px', label-position='top', :rules="rules")
    el-form-item(label='栏目标题', prop='title')
      el-input(placeholder='', v-model='form.title')
    el-form-item(label='描述', prop='description')
      el-input(type='textarea',  v-model='form.description')
    el-form-item(label='背景封面')
      upload(:callback='uploadImage', :url='form.banner_url', :uploadDelete="uploadDelete")
    el-form-item.column_visible(label='文章是否显示在首页')
      el-radio.radio(v-model='form.column_visible', :label="true") 是
      el-radio.radio(v-model='form.column_visible', :label="false") 否
    el-form-item(label='')
      el-button(type='primary',:disabled='disabled', @click='onSubmit') 发布
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
        banner_url: '',
        banner_id: '',
        column_visible: false
      },
      rules: {
        title: [
          { required: true, message: '请输入栏目标题', trigger: 'blur', min: 0 }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur', min: 0 }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs['add-column-form'].validate((valid) => {
        if (valid !== true) {
          return this.$message.error('内容信息不完整, 请完善后再提交!')
        } else {
          if (this.$route.query.id) {
            updateColumn(this)
          } else {
            createColumn(this)
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
      this.form.banner_url = 'deleted'
      this.form.banner_id = ''
    },
    close () {
      this.$router.push('/columns')
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getColumn(this)
    }
  }
}

function updateColumn (_this) {
  _this.disabled = true
  api.put(`admin/columns/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    _this.$message.success('success')
    _this.$router.push('/columns')
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function createColumn (_this) {
  _this.disabled = true
  api.post('admin/columns', _this.form)
  .then((result) => {
    _this.$message.success('success')
    _this.$router.push('/columns')
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function getColumn (_this) {
  api.get(`admin/columns/${_this.$route.query.id}`)
  .then((result) => {
    _this.form = result.data.column
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.el-input, .el-textarea
  width 50%

.column_visible
  margin-top 20px

</style>
