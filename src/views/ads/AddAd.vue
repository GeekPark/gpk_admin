<template lang="pug">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-row(:gutter='10')
    el-col(:span='14')
      el-form.grid-content(ref='form', :model='form', label-width='80px', label-position='top')
        el-form-item(label='标题')
          el-input(v-model='form.title')
        el-form-item(label='跳转链接')
          el-input(v-model='form.link')
        el-form-item(label='视频地址')
          el-input(placeholder='APP 视频广告专用', v-model='form.video_link')
        el-form-item(label='开始时间')
          el-date-picker(v-model='form.active_at',
                         type='datetime',
                         placeholder='选择日期时间')
        el-form-item(label='结束时间')
          el-date-picker(v-model='form.active_through',
                         type='datetime',
                         placeholder='选择日期时间')
        el-form-item(label='选择广告投放平台')
          el-select(v-model='ad_type', placeholder='请选择')
            el-option(v-for='(value, key) in types',
                      :label='value',
                      :value='key',
                      :key='key')
        el-form-item(label='选择广告位置')
          el-select(v-model='form.position', placeholder='请选择', v-if='ad_type === "web"')
            el-option(v-for='(value, key) in positions',
                      :label='value',
                      :value='key',
                      :key='key')
          el-select(v-model='form.position', placeholder='请选择', v-else)
            el-option(v-for='(value, key) in app_positions',
                      :label='value',
                      :value='key',
                      :key='key')
        el-form-item(label='专题选择', v-show='form.position === "app_topic" || form.position === "专题广告"')
          search-topic(:callback='searchTopic', :topic='form.topic_id')
        el-form-item(label='图片')
          upload(:callback='uploadImage', :url='form.cover_url', :uploadDelete="uploadDelete")
        el-form-item(label='')
          el-button(type='primary', @click='onSubmit') 提交
          el-button(type='danger', @click='onSubmit') 关闭
    el-col(:span='10')
      .grid-content.ad-position
        h1 广告位尺寸说明点击图片查看大图
        a(v-for='item in imgs', :key='item', :href='item', target='_blank')
          img(:src='item')

</template>

<script>
import api from 'stores/api'

export default {
  data () {
    return {
      form: {
        active_at: '',
        active_through: '',
        cover_id: '',
        cover_url: '',
        link: '',
        video_link: '',
        position: '',
        title: ''
      },
      types: {web: '网站端广告', app: ' APP端广告'},
      app_positions: {},
      ad_type: 'web',
      positions: {},
      // 'ad-pc-home.png' , 'ad-pc-home.png', ad-app.png
      imgs: ['http://imgslim.geekpark.net/006tNc79ly1fpdhmye3zaj31hc3omu0y.jpg', 'http://imgslim.geekpark.net/006tNc79ly1fpdhmq3hfrj31hc0xdkc8.jpg', 'http://imgslim.geekpark.net/006tNc79ly1fpdhmbsnarj30ku112js5.jpg']
    }
  },
  methods: {
    onSubmit () {
      if (this.$route.query.id) {
        updateAd(this)
      } else {
        createAd(this)
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
    searchTopic (topic) {
      this.form.topic_id = topic
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getAd(this)
    }
    getPosition(this)
  },
  watch: {
  }
}

function getPosition (_this) {
  const setPosition = () => {
    if (Object.keys(_this.positions).indexOf(_this.form.position) > -1) {
      _this.ad_type = 'web'
    } else {
      _this.ad_type = 'app'
    }
  }
  api.get(`admin/ads/positions`)
  .then((result) => {
    _this.positions = result.data
    setPosition()
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
  api.get(`admin/ads/app_positions`)
  .then((result) => {
    _this.app_positions = result.data
    setPosition()
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function updateAd (_this) {
  Object.keys(_this.positions).forEach(key => {
    if (_this.form.position === _this.positions[key]) {
      _this.form.position = key
    }
  })
  Object.keys(_this.app_positions).forEach(key => {
    if (_this.form.position === _this.app_positions[key]) {
      _this.form.position = key
    }
  })
  console.log(_this.form)
  api.put(`admin/ads/${_this.$route.query.id}`, _this.form)
  .then((result) => {
    _this.$router.push('/ads')
    _this.$message.success('success')
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function createAd (_this) {
  api.post('admin/ads', _this.form)
  .then((result) => {
    _this.$router.push('/ads')
    _this.$message.success('success')
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}

function getAd (_this) {
  api.get(`admin/ads/${_this.$route.query.id}`)
  .then((result) => {
    Object.keys(_this.form).forEach(key => {
      _this.form[key] = result.data.ad[key]
    })
  }).catch((err) => {
    _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.el-input
  width 80%
.ad-position
  img
    margin-bottom 20px
    width 100%

</style>
