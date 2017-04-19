
<template lang="jade">
.commit-component
  template
    el-form-item(label='提交状态')
      el-select(v-model='_form.status', placeholder='请选择')
        el-option(label='草稿', value='draft')
        el-option(label='定时', value='schedule')
        el-option(label='发送', value='send')
    el-form-item(label='时间', v-if='_form.status === "schedule"')
      el-date-picker( v-model='_form.sendAt', type='datetime', placeholder='选择日期时间')
    el-button(type='primary', size="large", @click='changeEditor') 切换编辑器
    el-button(type='primary', size="large", @click='onSubmit') 提交
</template>

<script>

export default {
  name: 'commit-component',
  computed: {
  },
  props: {
    _form: Object,
    dialogVisible: Boolean,
    dialogConfim: Function,
    onSubmit: Function,
  },
  data () {
    return {
    }
  },
  methods: {
    changeEditor () {
      if (this.$route.query.id) {
        this.$message.error('已经编辑过, 不能切换, 请新建文章')
        return
      }
      const current = this.$store.state.isMarkdownEditor
      this.$store.commit('SET_ITEM', {
        key: 'isMarkdownEditor',
        val: !current
      })
      this.$message.success('切换成功')
    }
  },
  beforeMount () {
  }
}
</script>

