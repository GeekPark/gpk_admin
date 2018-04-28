<template lang="pug">
.admin#add-guest
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-guest-form', :model='form', label-position='top', :rules="rules")
    el-form-item(label='姓名', prop='name')
      el-input(placeholder='请输入姓名', v-model='form.name')
    el-form-item(label='介绍', prop='description')
      el-input(type='textarea', placeholder='嘉宾介绍', v-model='form.description')
    el-form-item(label='标签', prop='tags')
      el-select(v-model='form.tags', multiple, filterable, allow-create, placeholder='请填写标签')
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
        name: '',
        description: '',
        tags: []
      },
      rules: {
        name: [
          { required: true, message: '请输入嘉宾姓名', trigger: 'blur', min: 0 }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['add-guest-form'].validate((valid) => {
        if (valid) {
          if (this.$route.query.id) {
            updateGuest(this)
          } else {
            createGuest(this)
          }
        } else {
          this.$message.error('内容信息不完整, 请完善后再提交!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs['add-guest-form'].resetFields()
    },
    close () {
      this.$router.push('/guests')
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getGuest(this)
    }
  }
}

function updateGuest (_this) {
  _this.disabled = true
  api.put(`admin/guests/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    _this.$message.success('success')
    _this.$router.push(`/guests?state=${_this.form.state}`)
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function createGuest (_this) {
  _this.disabled = true
  api.post('admin/guests', _this.form)
  .then((result) => {
    _this.$message.success('success')
    _this.$router.push(`/guests?state=${_this.form.state}`)
  }).catch((err) => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function getGuest (_this) {
  api.get(`admin/guests/${_this.$route.query.id}`)
  .then((result) => {
    const {guest} = result.data
    Object.keys(_this.form).forEach(key => {
      _this.form[key] = guest[key]
    })
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus">
#add-guest
  .el-input, .el-textarea
    width 50%
  .el-textarea textarea
    height 150px !important
  h3
    color #9B9B9B
</style>
