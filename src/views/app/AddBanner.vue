<template lang="pug">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-row(:gutter='10')
    el-col(:span='14')
      el-form.grid-content(ref='form', :model='form', label-width='80px', label-position='top')
        el-form-item(label='跳转类型')
          el-select(v-model='form.banner_type', placeholder='请选择')
            el-option(v-for='(value, key) in banner_types',
                      :label='value',
                      :value='key',
                      :key='key')
        template(v-if='form.banner_type === "internal"')
          el-form-item(label='选择模块', v-show='form.banner_type === "internal"')
            el-select(v-model='form.model', placeholder='请选择')
              el-option(v-for='(value, key) in models',
                        :label='value',
                        :value='key',
                        :key='key')
          el-form-item(label='跳转ID')
            el-input(v-model='form.link')
        template(v-else)
          el-form-item(label='跳转链接')
            el-input(v-model='form.link', placeholder="http://xxx.xxx")
        el-form-item(label='位置')
          el-select(v-model='form.position', placeholder='请选择')
            el-option(v-for='(value, key) in positions',
                      :label='value',
                      :value='key',
                      :key='key')
        el-form-item(label='图片')
          upload(:callback='uploadImage', :url='form.cover_url', :uploadDelete="uploadDelete")
        el-form-item(label='状态')
          el-switch(v-model="form.state", active-value="publish", inactive-value="unpublish")
          p &nbsp;
        el-form-item(label='')
          el-button(type='primary', @click='onSubmit') 提交
          el-button(type='danger', @click='close') 关闭
</template>

<script>
import api from 'stores/api'
const url = 'admin/banners'

export default {
  data () {
    return {
      form: {
        cover_id: '',
        cover_url: '',
        model: 'IfTalk',
        banner_type: 'internal',
        position: '',
        link: '',
        state: 'publish'
      },
      models: {IfTalk: 'IfTalk', Post: '文章', Topic: '专题'},
      banner_types: {internal: '内部', external: '外部'},
      positions: {}
    }
  },
  methods: {
    onSubmit () {
      if (this.$route.query.id) {
        updateBanner(this)
      } else {
        createBanner(this)
      }
    },
    uploadImage (img) {
      this.form.cover_id = img.id
      this.form.cover_url = ''
    },
    uploadDelete () {
      this.form.cover_url = 'deleted'
      this.form.cover_id = ''
    },
    close () {
      this.$router.push('/appbanner')
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getBanner(this)
    }
    getPosition(this)
  },
  watch: {
  }
}

function updateBanner (_this) {
  console.log(_this.form)
  api.put(`${url}/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    _this.$router.push('/appbanner')
    _this.$message.success('success')
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function createBanner (_this) {
  api.post(url, _this.form)
  .then((result) => {
    _this.$router.push('/appbanner')
    _this.$message.success('success')
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function getBanner (_this) {
  api.get(`${url}/${_this.$route.query.id}`)
  .then((result) => {
    Object.keys(_this.form).forEach(key => {
      _this.form[key] = result.data.banners[key]
    })
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function getPosition (_this) {
  api.get(`${url}/app_positions`)
  .then((result) => {
    _this.positions = result.data
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.el-input
  width 80%

</style>
