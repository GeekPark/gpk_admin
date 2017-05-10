<template lang="jade">
#add-post.admin
  el-form(ref='form', :model='form', label-width='80px')
    el-form-item(label='切换')
      el-select(v-model='form.content_type', placeholder='请选择')
        el-option(v-for='item in content_types',
                  :label='item.title',
                  :value='item.val')
    el-form-item(label='文章标题')
      el-input(placeholder='请输入标题 必填', v-model='form.title')
    el-form-item(label='摘要')
      el-input(type='textarea',
               placeholder='请输入摘要 可选',
               v-model='form.abstract')
    el-form-item(label='正文')
      vmarkdown(v-if='$route.query.content_type !=="html"'
              v-bind:markdown='form.markdown')
      veditor#veditor(style="height:400px;max-height:500px;", v-else)
    el-form-item(label='标签')
      el-tag(:key='tag',
             v-for='tag in form.tags',
             :closable='true',
             :close-transition='false',
             type='primary',
             @close='handleClose(tag)') | {{tag}}
      el-input.input-new-tag(v-if='inputVisible',
                             v-model='inputValue',
                             ref='saveTagInput',
                             size='mini',
                             @keyup.enter.native='handleInputConfirm',
                             @blur='handleInputConfirm')
      el-button.button-new-tag(v-else='',
                               size='small',
                               @click='showInput') + New Tag
    el-form-item(label='栏目选择')
      el-select(v-model='form.column_id', placeholder='请选择')
        el-option(v-for='item in columns',
                  :label='item.title',
                  :value='item.id')
    el-form-item(label='文章头图')
      el-upload.upload-demo(drag="", action='//jsonplaceholder.typicode.com/posts/', mutiple)
        i.el-icon-upload
        .el-upload__text
          | 将文件拖到此处，或
          em 点击上传
        .el-upload__tip(slot='tip') 只能上传jpg/png文件，且不超过500kb
    el-form-item(label='作者')
      el-autocomplete(v-model='state',
                      :fetch-suggestions='querySearchAsync',
                      placeholder='请输入内容',
                      @select='handleSelect')
    //- el-form-item(label='共同作者')
    //-   el-autocomplete(v-model='state',
    //-                   :fetch-suggestions='querySearchAsync',
    //-                   placeholder='请输入内容',
    //-                   @select='handleSelect')
    el-form-item(label='定时发送')
      el-date-picker(v-model='form.auto_publish_at',
                     type='datetime',
                     placeholder='选择日期时间')
    el-form-item(label='')
      el-button(type='primary', @click='onSubmit') 发布
      el-button(type='success', @click='onSubmit') 存草稿
      el-button(type='danger', @click='onSubmit') 取消
</template>

<script>

import tools    from '../../tools'
import api      from '../../stores/api'

export default {
  data () {
    const content_type = this.$route.query.content_type || '';
    return {
      form: {
        title:           '',
        abstract:        '',
        content_type:    content_type,
        content_source:  '',
        tags:            [],
        column_id:       null,
        picture:         '',
        author_ids:      [],
        auto_publish_at: null,
        state:           'published',
        meta:            {},
      },
      columns: [],
      inputVisible: false,
      inputValue:   '',
      editor:       {},
      restaurants: [],
      state: '',
      timeout:  null,
      content_types: [{
        title: '富文本',
        val: 'html',
      },{
        title: 'markdown',
        val: 'markdown'
      },{
        title: 'plain',
        val: 'plain'
      }],
    }
  },
  methods: {
    onSubmit() {
      if (this.$route.query.id) {
        updatePost(this)
      } else {
        createPost(this)
      }
    },
    handleClose(tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ?
                    restaurants.filter(this.createStateFilter(queryString)) :
                    restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    loadAll() {
      return [
        { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
        { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
           { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
          { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
          { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" },
          { "value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号" },
          { "value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F" },
          { "value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层" },
          { "value": "NONO JUICE  鲜榨果汁", "address": "上海市长宁区天山西路119号" },
          { "value": "CoCo都可(北新泾店）", "address": "上海市长宁区仙霞西路" },
          { "value": "快乐柠檬（神州智慧店）", "address": "上海市长宁区天山西路567号1层R117号店铺" },
          { "value": "Merci Paul cafe", "address": "上海市普陀区光复西路丹巴路28弄6号楼819" },
          { "value": "猫山王（西郊百联店）", "address": "上海市长宁区仙霞西路88号第一层G05-F01-1-306" },
          { "value": "枪会山", "address": "上海市普陀区棕榈路" },
          { "value": "纵食", "address": "元丰天山花园(东门) 双流路267号" },
          { "value": "钱记", "address": "上海市长宁区天山西路" },
          { "value": "壹杯加", "address": "上海市长宁区通协路" },
          { "value": "唦哇嘀咖", "address": "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元" },
          { "value": "爱茜茜里(西郊百联)", "address": "长宁区仙霞西路88号1305室" },
          { "value": "爱茜茜里(近铁广场)", "address": "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺" },
          { "value": "鲜果榨汁（金沙江路和美广店）", "address": "普陀区金沙江路2239号金沙和美广场B1-10-6" },
          { "value": "开心丽果（缤谷店）", "address": "上海市长宁区威宁路天山路341号" },
          { "value": "超级鸡车（丰庄路店）", "address": "上海市嘉定区丰庄路240号" },
          { "value": "妙生活果园（北新泾店）", "address": "长宁区新渔路144号" },
          { "value": "香宜度麻辣香锅", "address": "长宁区淞虹路148号" },
          { "value": "凡仔汉堡（老真北路店）", "address": "上海市普陀区老真北路160号" },
          { "value": "港式小铺", "address": "上海市长宁区金钟路968号15楼15-105室" },
          { "value": "蜀香源麻辣香锅（剑河路店）", "address": "剑河路443-1" },
          { "value": "北京饺子馆", "address": "长宁区北新泾街道天山西路490-1号" },
          { "value": "饭典*新简餐（凌空SOHO店）", "address": "上海市长宁区金钟路968号9号楼地下一层9-83室" },
          { "value": "焦耳·川式快餐（金钟路店）", "address": "上海市金钟路633号地下一层甲部" },
          { "value": "动力鸡车", "address": "长宁区仙霞西路299弄3号101B" },
          { "value": "浏阳蒸菜", "address": "天山西路430号" },
          { "value": "四海游龙（天山西路店）", "address": "上海市长宁区天山西路" },
          { "value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室" },
          { "value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号" },
          { "value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号" },
        ]
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    }
  },
  watch: {
    'form.content_type': function (val) {
       this.$router.push(`${this.$route.path}?content_type=${val}&id=${this.$route.query.id}`)
       addContent(this, val)
    }
  },
  mounted () {
     getColumns(this)
     this.restaurants = this.loadAll();
     if (this.$route.query.id) {
       getPost(this)
     }
  }
}

function getContent(_this) {
  if (_this.$route.query.content_type === 'html') {
    _this.form.content_source = _this.$store.state.htmlEditor.$txt.html()
  } else {
    _this.form.content_source = _this.$store.state.markdownEditor.value()
  }
}

function addContent(_this, val) {
  setTimeout(() => {
    if (val === 'html') {
      _this.$store.state.htmlEditor.$txt.html(_this.form.content_source)
    } else {
      _this.$store.state.markdownEditor.value(_this.form.content_source)
    }
  },100)
}

function updatePost(_this) {
  getContent(_this)
  api.put(`admin/posts/${_this.$route.query.id}`, _this.form)
  .then((result) => {
     _this.$message.success('success')
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}

function createPost(_this) {
  getContent(_this)
  api.post('admin/posts', _this.form)
  .then((result) => {
     _this.$message.success('success')
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}

function getPost(_this) {
  api.get(`admin/posts/${_this.$route.query.id}`)
  .then((result) => {
    result.data.post.column_id = result.data.post.column.id
    _this.form = result.data.post
    addContent(_this, _this.form.content_type)

  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}


function getColumns (_this) {
  api.get('admin/columns')
  .then((result) => {
    _this.columns = result.data.columns
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus">
#add-post

  .el-input--mini
      width 200px !important

  .el-form-item
    margin-bottom 5px !important


.el-autocomplete-suggestion
  border 1px solid #D7D7D7
  background white !important
  height 250px !important
  overflow-y scroll !important
  li
    padding 10px !important
    list-style none !important

.upload-demo
  width 300px
  border 1px dashed #d9d9d9
  padding 10px
  cursor pointer

</style>
