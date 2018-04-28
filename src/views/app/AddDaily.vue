<template lang="pug">
#add-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='add-daily-form', :model='form', label-width='150px', label-position='top', :rules='rules')
    el-form-item(label='类型', prop='recommendable_type')
      el-select(v-model='form.recommendable_type', placeholder='请选择', @change='changeType')
        el-option(v-for='item in type_options',
                  :label='item.title',
                  :value='item.val',
                  :key='item.val')
    el-form-item(label='模板', prop='style', v-show='form.recommendable_type === "Post"')
      el-select(v-model='form.style', placeholder='请选择')
        el-option(v-for='item in style_options',
                  :label='item.title',
                  :value='item.val',
                  :key='item.val')
    el-form-item(label='关联', prop='recommendable_id')
      el-input(placeholder='ID', v-model='form.recommendable_id')
      el-button(icon="el-icon-search" size="mini" @click="search")
    p {{title}}
    p &nbsp;
    el-form-item(label='')
      el-button(type='primary', :disabled='disabled', @click='onSubmit') 提交
      el-button(type='danger', @click='close') 关闭
</template>

<script>
import api from 'stores/api'
const url = 'admin/daily_recommendations'
const titleApi = {
  'Ad': 'admin/ads',
  'Post': 'admin/posts',
  'IfTalk': 'admin/if_talks'
}

export default {
  data () {
    return {
      disabled: false,
      title: '',
      form: {
        recommendable_type: '',
        style: 'one',
        recommendable_id: ''
      },
      rules: {
        recommendable_type: [
          { required: true, message: '请选择类别', trigger: 'blur', min: 0 }
        ],
        recommendable_id: [
          { required: true, message: '请输入关联ID', trigger: 'blur', min: 0 }
        ]
      },
      type_options: [
        {
          title: '广告',
          val: 'Ad'
        }, {
          title: '文章',
          val: 'Post'
        }, {
          title: 'IfTalk',
          val: 'IfTalk'
        }
      ],
      style_options: [
        {
          title: '大图',
          val: 'one'
        }, {
          title: '小图',
          val: 'two'
        }
      ]
    }
  },
  methods: {
    onSubmit () {
      this.$refs['add-daily-form'].validate((valid) => {
        if (valid !== true) {
          return this.$message.error('内容信息不完整, 请完善后再提交!')
        } else {
          if (this.$route.query.id) {
            updateDaily(this)
          } else {
            createDaily(this)
          }
        }
      })
    },
    changeType (val) {
      this.form.recommendable_id = ''
      this.title = ''
    },
    search () {
      if (!this.form.recommendable_type || !this.form.recommendable_id) return
      api.get(`${titleApi[this.form.recommendable_type]}/${this.form.recommendable_id}`)
        .then(result => {
          let key = Object.keys(result.data)[0]
          this.title = result.data[key].title
        }).catch(err => {
          this.$message.error(err.toString())
        })
    },
    close () {
      this.$router.push('/daily')
    }
  },
  mounted () {
    if (this.$route.query.id) {
      getDaily(this)
    }
  }
}

function updateDaily (_this) {
  delete _this.form.post
  _this.disabled = true
  api.put(`${url}/${_this.$route.query.id}`, _this.form)
  .then(result => {
    _this.$message.success('success')
    _this.$router.push('/daily')
  }).catch(err => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function createDaily (_this) {
  _this.disabled = true
  api.post(url, _this.form)
  .then(result => {
    console.log(result)
    _this.$message.success('success')
    _this.$router.push('/daily')
  }).catch(err => {
    _this.disabled = false
    _this.$message.error(err.toString())
  })
}

function getDaily (_this) {
  api.get(`${url}/${_this.$route.query.id}`)
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
