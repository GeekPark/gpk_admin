<template lang="pug">
#admin-user.admin
  vsearch(model='User', searchKey='nickname', :start='start')
  el-button.add-btn(type="text" @click="dialogFormVisible = true; isAddAdmin = false") 新建用户
  el-button.add-btn(type="text" @click="dialogFormVisible = true; isAddAdmin = true") 新建管理员
  el-dialog(title='新建用户', v-model='dialogFormVisible', v-if='!isAddAdmin')
    el-form(:model='form')
      el-form-item(label='用户级别', :label-width='formLabelWidth')
        el-select(v-model='form.permission', placeholder='请选择权限', size="large" multiple)
          el-option(v-for='item in options', :label='item.label', :value='item.value')
      el-form-item(label='权重', :label-width='formLabelWidth', placeholder='必填')
        el-input-number(v-model="form.weight", v-bind:min="0", v-bind:max="10")
      el-form-item(label='昵称', :label-width='formLabelWidth', placeholder='必填')
        el-input(v-model='form.nickname', auto-complete='off')
      el-form-item(label='公司', :label-width='formLabelWidth')
        el-input(v-model='form.company')
      el-form-item(label='职位', :label-width='formLabelWidth')
        el-input(v-model='form.title')
      el-form-item(label='电话', :label-width='formLabelWidth')
        el-input(v-model='form.phone.number')
        el-switch(v-model='form.phone.hidden', on-text='隐藏', off-text='公开')
      el-form-item(label='微信', :label-width='formLabelWidth')
        el-input(v-model='form.wechat.number')
        el-switch(v-model='form.wechat.hidden', on-text='隐藏', off-text='公开')
      el-form-item(label='邮箱', :label-width='formLabelWidth')
        el-input(v-model='form.email.addr')
        el-switch(v-model='form.email.hidden', on-text='隐藏', off-text='公开')
      el-form-item(label='一句话简介', :label-width='formLabelWidth')
        el-input(v-model='form.sign')
      el-form-item(label='简介', :label-width='formLabelWidth')
        el-input(v-model='form.intro', type='textarea')
    .dialog-footer(slot='footer')
      el-button(@click='dialogFormVisible = false') 取 消
      el-button(type='primary', @click='onSubmit') 确 定

  el-dialog(title='新建管理员', v-model='dialogFormVisible' v-if='isAddAdmin')
    el-form(:model='form')
      el-form-item(label='用户级别', :label-width='formLabelWidth')
        el-select(v-model='form.permission', placeholder='请选择权限', size="large" multiple)
          el-option(v-for='item in options', :label='item.label', :value='item.value')
      el-form-item(label='用户名', :label-width='formLabelWidth')
        el-input(v-model='form.nickname', auto-complete='off', placeholder='必填')
      el-form-item(label='邮箱', :label-width='formLabelWidth')
        el-input(v-model='form.email.addr', auto-complete='off', placeholder='必填')
      el-form-item(label='密码', :label-width='formLabelWidth')
        el-input(v-model='form.password', placeholder='必填')
    .dialog-footer(slot='footer')
      el-button(@click='dialogFormVisible = false') 取 消
      el-button(type='primary', @click='onSubmit') 确 定
  template
    el-table(:data='items', border='', style='width: 100%')
      el-table-column(type="index", width="100")
      el-table-column(prop='email.addr', label='email')
      el-table-column(prop='nickname', label='昵称')
      el-table-column(prop='company', label='公司')
      el-table-column(prop='title', label='职位')
      el-table-column(prop='permission', label='权限')
      el-table-column(prop='code', label='邀请码')
      el-table-column(prop='status', label='状态')
      el-table-column(prop='created_at', label='created')
      el-table-column(label='操作')
        template(scope='scope')
          el-button(size='small',
                    @click='handleEdit(scope.$index, scope.row)') 编辑
          el-button(size='small',
                    type='danger',
                    @click='handleDelete(scope.$index, scope.row)') 删除

  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page="1",
                :page-size='100',
                layout='total, prev, pager, next',
                :total='total')
</template>

<script>

function initialState () {
  return {
    start:             0,
    dialogFormVisible: false,
    isAddAdmin:        false,
    formLabelWidth:    '120px',
    command:           'create',
    search:            '',
    id:                '',
    options:           [{
      label: '游客',
      value: 'visitor'
    },{
      label: '受邀请用户',
      value: 'user'
    },{
      label: '运营',
      value: 'runner'
    },{
      label: '记者',
      value: 'reporter'
    },{
      label: '编辑',
      value: 'editor'
    },{
      label: '管理员',
      value: 'admin'
    }],
    form: {
        nickname:   faker.name.findName(),
        company:    faker.company.companyName(),
        title:      faker.name.jobTitle(),
        permission: ['visitor'],
        summary:    faker.random.words(),
        sign:       faker.random.words(),
        intro:      faker.random.words(),
        _from:      'admin',
        openid:     '0',
        password:   '123456',
        weight:     0,
        wechat:     {
          number: faker.internet.email(),
          hidden: false,
        },
        email: {
          addr:   faker.internet.email(),
          hidden: false,
        },
        phone: {
          number: faker.phone.phoneNumber(),
          hidden: false,
        },
      },
  }
}
export default {
  name: 'admin-user',
  computed: {
    items () {
      return this.$store.state.adminItems
    },
    total () {
      return this.$store.state.total.user || 100000
    }
  },
  data: initialState,
  methods: {
    fetch (start = 0) {
      const _this = this
      const cb = function (result) {
        _this.$set(_this, 'start', start)
      }
      this.$store.dispatch('FETCH_ADMIN_ITEMS', {
        cb: cb,
        url: 'users',
        data: {
          start: start,
        }
      })
    },
    onSubmit(index) {
      console.log(this.form)
      const _this = this
      const dispatch = this.command === 'create' ? 'ADD_ADMIN_ITEM' : 'UPDATE_ADMIN_ITEM'
      const url = this.command === 'create' ? 'user/add' : `user/${_this.id}`
      const sendData = {
        data: _this.form,
        url: url,
        msg: _this.$message,
        cb: (data) => {
          Object.assign(_this.$data, _this.$options.data());
          _this.fetch();
        }
      }
      this.$store.dispatch(dispatch, sendData)
    },
    handleDelete(index, row) {
      this.$message.error(' API 是可以用的, 请不要删除用户 谢谢啦!😀');
      const _this = this
      return;
      this.$store.dispatch('DELETE_ADMIN_ITEM', {
        url: `user/${row._id}`,
        msg: _this.$message,
        cb: _this.fetch
      })
    },
    handleEdit (index, row) {
      this.$set(this, 'id', row._id)
      this.$set(this, 'command', 'update')
      this.$set(this, 'form', Object.assign({}, row))
      this.$set(this, 'dialogFormVisible', true)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.fetch(val - 1)
      console.log(`当前页: ${val}`);
    }
  },
  beforeMount () {
    this.fetch(0)
  }
}
</script>

<style lang="stylus"  scoped>
.el-table, .el-pagination
  margin-top 20px
.el-input
  width 40%
.add-btn
  margin-left 30px
.el-table
  margin-top 30px

</style>
