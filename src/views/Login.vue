
<template lang="pug">
.login
  .logo
    img(src="http://ohusmobs2.bkt.clouddn.com/20170323149024023196292.png")
  .login-wapper
    el-form.demo-ruleForm(:model='ruleForm', :rules='rules', ref='ruleForm', label-width='0px')
      el-form-item(prop='email', auto-complete='on')
        el-input(v-model='ruleForm.email', placeholder='email')
      el-form-item(prop='password', auto-complete='on')
        el-input(type='password', placeholder='password', v-model='ruleForm.password', @keyup.enter.native="submitForm('ruleForm')")
      .login-btn
        el-button(type='primary', @click="submitForm('ruleForm')") 登录
      p(style='font-size:12px;line-height:30px;color:#999;') ╮(╯▽╰)╭
</template>

<script>
import * as api from '../stores/api'
export default {
  data: function(){
    return {
      ruleForm: {
        email: '123454321@qq.com',
        password: '123454321'
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      const _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          api._post({
            url: 'account/login',
            data: _this.ruleForm
          }).then((result) => {
            console.log(result);
              _this.$router.push('/');
              localStorage.setItem('email',_this.ruleForm.email);
              localStorage.setItem('user',result.data.data._id);
          }).catch((err) => {
            console.log(err);
             _this.$message.error(err.toString())
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  beforeMount () {

  }
}
</script>

<style lang="stylus">
  #vheader, #vsider
    display none

  .login
    position relative
    width 100%
    height 100%
    background #324157
    z-index 10
  .logo
    position absolute
    top 50%
    width 100%
    margin-top -230px
    text-align center
    font-size 30px
    color #fff
  .login-wapper
    position absolute
    left 50%
    top 50%
    width 300px
    height 160px
    margin -150px 0 0 -190px
    padding 40px
    border-radius 5px
    // background #fff
  .login-btn
      text-align  center
  .login-btn button
      width 100%
      height 36px
</style>
