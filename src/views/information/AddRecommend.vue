<template lang="jade">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='form', :model='form', label-width='150px', label-position='top', :rules='rules')
    el-form-item(label='产品名称', prop='title')
      el-input(placeholder='', v-model='form.title')
    el-form-item(label='推荐语', prop='description')
      el-input(type='textarea', placeholder='', v-model='form.description')
    el-form-item(label='关联文章')
    el-form-item(label='产品类别')
    el-form-item(label='背景封面')
      upload(:callback='uploadImage', :url='form.banner_url', :uploadDelete="uploadDelete")
    el-form-item(label='作者')
      search-user(:callback='searchUser')
    el-form-item(label='')
      el-button(type='primary', @click='onSubmit') 发布
      el-button(type='danger', @click='onSubmit') 关闭
</template>

<script>
import api from 'stores/api'

export default {
  data () {
    return {
      form: {
        title: '',
        description: '',
        banner_url: '',
        cover_id: '',
        column_visible: false
      },
      rules: {
        title: [
          { required: true, message: '请输入产品名称', trigger: 'blur', min: 0 }
        ],
        description: [
          { required: true, message: '请输入推荐语', trigger: 'blur', min: 0 }
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
            updateRecommend(this)
          } else {
            createRecommend(this)
          }
        }
      })
    },
    handleSelect (item) {
      console.log(item)
    },
    uploadImage (img) {
      this.form.cover_id = img.id
    },
    uploadDelete () {
      this.form.banner_url = this.form.cover_id = ''
    },
    searchUser () {

    },
    close () {
      window.close()
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getRecommend(this)
    }
  }
}

function updateRecommend (_this) {
  api.put(`admin/recommendations/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    _this.$message.success('success')
    window.close()
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function createRecommend (_this) {
  api.post('admin/recommendations', _this.form)
  .then((result) => {
    _this.$message.success('success')
    window.close()
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function getRecommend (_this) {
  api.get(`admin/recommendations/${_this.$route.query.id}`)
  .then((result) => {
    _this.form = result.data.recommend
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.el-input, .el-textarea
  width 50%

</style>
