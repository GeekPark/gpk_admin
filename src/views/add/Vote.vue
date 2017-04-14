<template lang="pug">
#add-vote.admin
  el-form.demo-dynamic(:model='voteForm', ref='voteForm', label-width='100px')
    el-form-item(label='标题', prop='title')
      el-input(type='text', v-model='voteForm.title', auto-complete='off')
    el-form-item(v-for='(item, index) in voteForm.points',
                :label="'投票' + (index + 1)", :key='item.key',
                :prop="'points.' + index + '.value'",
                :rules="{\required: true, message: '描述不能为空', trigger: 'blur'\}")
      el-input.vote-input(v-model='item.value')
      el-button.vote-delete-btn(@click.prevent='removeItem(item)') 删除
    el-form-item(label='是否可以多选')
      el-radio.radio(v-model="voteForm.multiSelect", :label='true') 是
      el-radio.radio(v-model="voteForm.multiSelect", :label='false') 否
      .block
      el-button(@click='addItem') 新增可投票
      el-button(@click="resetForm('voteForm')") 重置
    commit-component(:_form         = 'voteForm',
                     :dialogVisible = 'dialogVisible',
                     :onSubmit      = 'onSubmit',
                     :dialogConfim  = 'dialogConfim')
</template>

<script>

export default {
  name: 'add-vote',
  computed: {
  },
  data () {
    return {
      max: 5,
      dialogVisible: false,
      voteForm: {
        points: [{
          value: ''
        }],
        title:       '',
        multiSelect: false,
        status:      'send',
        sendAt:      ''
      }
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeItem(item) {
      var index = this.voteForm.points.indexOf(item)
      if (index !== -1) {
        this.voteForm.points.splice(index, 1)
      }
    },
    addItem() {
      if(this.voteForm.points.length >= this.max) {
        this.$message.error(`最多 ${this.max} 个投票项`)
        return;
      }
      this.voteForm.points.push({
        value: '',
        key: Date.now()
      });
    },
    dialogConfim () {
      this.$router.push('/votes')
      Object.assign(this.$data, this.$options.data());
    },
    onSubmit() {
      if (!this.voteForm.title || !this.voteForm.points.length) {
        this.$message.error('内容未填写')
        return;
      }
      console.log(this.voteForm)
      let _this = this
      this.$store.dispatch('ADD_ADMIN_ITEM', {
        url: 'vote',
        data: _this.voteForm,
        _this: _this,
        cb: (data) => {
          _this.$set(_this, 'dialogVisible', true)
        }
      })
    },
  },
  beforeMount () {
  }
}
</script>

<style lang="stylus">
.vote-input
  width calc(100% - 120px)
  margin-right 20px
.vote-delete-btn
  width 100px
</style>
