<template lang="jade">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-recommend-form', :model='form', label-width='150px', label-position='top', :rules='rules')
    el-form-item(label='产品名称', prop='product_name')
      el-input(placeholder='', v-model='form.product_name')
    el-form-item(label='推荐语', prop='description')
      el-input(type='textarea', placeholder='', v-model='form.description')
    el-form-item(label='关联文章')
      search-post(:callback='searchPost', :post='form.post')
    el-form-item(label='产品类别')
      product-categories(:callback='productCategories', :category='form.product_category')
    el-form-item(label='背景封面')
      upload(:callback='uploadImage', :url='form.cover_url', :uploadDelete="uploadDelete")
    el-form-item(label='作者')
      search-user(:callback='searchUser', :author='form.author')
    el-form-item(label='')
      el-button(type='primary', @click='onSubmit') 发布
      el-button(type='danger', @click='close') 关闭
</template>

<script>
import api from 'stores/api'

export default {
  data () {
    return {
      form: {
        product_name: '',
        description: '',
        product_category: '',
        post_id: '',
        author_id: '',
        cover_url: '',
        cover_id: ''
      },
      rules: {
        product_name: [
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
      this.$refs['add-recommend-form'].validate((valid) => {
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
    uploadImage (img) {
      this.form.cover_id = img.id
    },
    uploadDelete () {
      this.form.cover_url = this.form.cover_id = ''
    },
    searchUser (user) {
      this.form.author_id = user
    },
    searchPost (post) {
      this.form.post_id = post
    },
    productCategories (product) {
      this.form.product_category = product
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
  delete _this.form.author
  delete _this.form.post
  api.put(`admin/recommendations/${_this.$route.query.id}`, _this.form)
  .then(result => {
    _this.$message.success('success')
    window.close()
  }).catch(err => {
    _this.$message.error(err.toString())
  })
}

function createRecommend (_this) {
  api.post('admin/recommendations', _this.form)
  .then(result => {
    console.log(result)
    _this.$message.success('success')
    // window.close()
  }).catch(err => {
    _this.$message.error(err.toString())
  })
}

function getRecommend (_this) {
  api.get(`admin/recommendations/${_this.$route.query.id}`)
  .then(result => {
    _this.form = result.data.recommendation
  }).catch(err => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.el-input, .el-textarea
  width 50%

</style>
