<template lang="pug">
.admin#add-products
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-products-form', :model='form', label-position='top', :rules="rules")
    el-form-item(label='商品名称', prop='name')
      el-input(v-model='form.name')
    el-form-item(label='商品简介', prop='abstract')
      el-input(type='textarea',v-model='form.abstract')
    el-form-item(label='市场价')
      el-input(v-model='form.market_price')
    el-form-item(label='兑换积分')
      el-input(v-model='form.price')
    el-form-item(label='库存')
      el-input(v-model='form.inventory')
    el-form-item(label='商品图', prop='cover_id')
      upload(:callback='uploadCover', :url='form.cover_url', :uploadDelete="deleteCover")
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
      currentPage: this.$route.query.page || 1,
      form: {
        name: '',
        abstract: '',
        inventory: 0,
        price: 0,
        market_price: 0,
        cover_url: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur', min: 0 }
        ],
        abstract: [
          { required: true, message: '请输入商品简介', trigger: 'blur', min: 0 }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['add-products-form'].validate((valid) => {
        if (valid) {
          if (this.$route.query.id) {
            updateProducts(this)
          } else {
            createProducts(this)
          }
        } else {
          this.$message.error('内容信息不完整, 请完善后再提交!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs['add-products-form'].resetFields()
    },
    uploadCover (img) {
      this.form.cover_id = img.id
      this.form.cover_url = ''
      console.log(img)
    },
    deleteCover () {
      this.form.cover_url = 'deleted'
      this.form.cover_id = ''
    },
    close () {
      this.$router.push(`/products?page=${this.currentPage}`)
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getProducts(this)
    }
  }
}

function updateProducts (_this) {
  _this.disabled = true
  api.put(`admin/products/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    _this.$message.success('success')
    _this.$router.push(`/products?page=${_this.currentPage}`)
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function createProducts (_this) {
  _this.disabled = true
  api.post('admin/products', _this.form)
  .then((result) => {
    _this.$message.success('success')
    _this.$router.push(`/products`)
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function getProducts (_this) {
  api.get(`admin/products/${_this.$route.query.id}`)
  .then((result) => {
    const {product} = result.data
    Object.keys(_this.form).forEach(key => {
      _this.form[key] = product[key] || _this.form[key]
    })
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus">
#add-products
  .el-input, .el-textarea
    width 50%
  .el-textarea textarea
    height 150px !important
  h3
    color #9B9B9B
</style>
