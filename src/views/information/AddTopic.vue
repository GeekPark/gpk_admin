<template lang="pug">
#add-topic.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-topic-form', :model='form', label-width='150px', label-position='top', :rules='rules')
    el-form-item(label='专题名称', prop='title')
      el-input(placeholder='', v-model='form.title')
    el-form-item(label='描述', prop='description')
      el-input(type='textarea', placeholder='', v-model='form.description')
    el-form-item(label='PC端背景封面（1920×300，主体内容<1507像素）')
      upload(:callback='uploadBanner', :url='form.banner_url', :uploadDelete="deleteBanner")
    el-form-item(label='移动端背景封面（750×480）')
      upload(:callback='uploadAppBanner', :url='form.app_banner_url', :uploadDelete="deleteAppBanner")
    //- el-form-item(label='栏目模板')
    //-   el-select(v-model='form.template', placeholder='请选择')
    //-     el-option(v-for='item in topic_style',
    //-               :label='item.title',
    //-               :value='item.val',
    //-               :key='item.val')
    //- template(v-show='form.template !== "template_two"')
    //-   el-form-item(label='banner1')
    //-     el-input(placeholder='在此输入文章ID', v-model.trim.number='form.banners[0]' clearable)
    //-   el-form-item(label='banner2')
    //-     el-input(placeholder='在此输入文章ID', v-model.trim.number='form.banners[1]' clearable)
    //-   el-form-item(label='banner3')
    //-     el-input(placeholder='在此输入文章ID', v-model.trim.number='form.banners[2]' clearable)
    //-   el-form-item(label='banner4')
    //-     el-input(placeholder='在此输入文章ID', v-model.trim.number='form.banners[3]' clearable)
    //-   el-form-item(label='banner5')
    //-     el-input(placeholder='在此输入文章ID', v-model.trim.number='form.banners[4]' clearable)
    el-form-item(label='是否隐藏标题')
      el-switch(v-model="form.title_visible",inactive-value="false")
    el-form-item.actions(label='')
      el-button(type='primary', :disabled='disabled', @click='onSubmit') 提交
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
        app_banner_url: '',
        app_banner_id: '',
        template: 'template_one',
        banners: new Array(5),
        title_visible: false
      },
      rules: {
        title: [
          { required: true, message: '请输入专题标题', trigger: 'blur', min: 0 }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur', min: 0 }
        ]
      },
      topic_style: [{
        title: '正常样式',
        val: 'template_one'
      }, {
        title: '轮播样式',
        val: 'template_two'
      }]
    }
  },
  methods: {
    onSubmit () {
      this.$refs['add-topic-form'].validate((valid) => {
        console.log(valid)
        if (valid !== true) {
          return this.$message.error('内容信息不完整, 请完善后再提交!')
        } else {
          // this.form.banner_ids = this.form.banners.filter(item => item)
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
    uploadBanner (img) {
      this.form.banner_id = img.id
      this.form.banner_url = ''
    },
    deleteBanner () {
      this.form.banner_url = 'deleted'
      this.form.banner_id = ''
    },
    uploadAppBanner (img) {
      this.form.app_banner_id = img.id
      this.form.app_banner_url = ''
    },
    deleteAppBanner () {
      this.form.app_banner_url = 'deleted'
      this.form.app_banner_id = ''
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
  api.patch(`admin/topics/${_this.$route.query.id}`, _this.form)
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
    // const {topic} = result.data
    // Object.keys(_this.form).forEach(key => {
    //   _this.form[key] = topic[key] || _this.form[key]
    // })
    // if (topic.topic_banner) {
    //   let arr = new Array(5)
    //   topic.topic_banner.banners.forEach((item, index) => { arr[index] = item.id })
    //   _this.form.banners = arr
    //   _this.form.template = topic.topic_banner.template
    // }
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
