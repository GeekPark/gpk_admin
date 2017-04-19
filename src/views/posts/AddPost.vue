<template lang="jade">
#add-post.admin
  el-form(ref='form', :model='form', label-width='80px')
    el-input(placeholder='请输入标题 必填', v-model='form.title')
    el-input(placeholder='短标题，10~14汉字（两个英文字符算一个汉字） 可选', v-model='form.subTitle')
    el-input(type='textarea', placeholder='请输入摘要 可选', v-model='form.abstract')
    vmarkdown(v-if='isMarkdownEditor' v-bind:markdown='form.markdown')
    veditor#veditor(style="height:400px;max-height:500px;", v-else)
    el-form-item(label='标签')
      el-tag(:key='tag', v-for='tag in form.tags', :closable='true', :close-transition='false', @close='handleClose(tag)')
        | {{tag}}
      el-input.input-new-tag(v-if='inputVisible', v-model='inputValue', ref='saveTagInput', size='mini', @keyup.enter.native='handleInputConfirm', @blur='handleInputConfirm')
      el-button.button-new-tag(v-else='', size='small', @click='showInput') + New Tag
    el-form-item(label='合集')
      el-select(v-model='form.column_id', placeholder='请选择')
        el-option(v-for='item in columns', :label='item.title', :value='item.id')
    el-form-item(label='作者')
      el-autocomplete(v-model='state4', :fetch-suggestions='querySearchAsync', placeholder='请输入内容', @select='handleSelect')
    el-form-item(label='共同作者')
      el-autocomplete(v-model='state4', :fetch-suggestions='querySearchAsync', placeholder='请输入内容', @select='handleSelect')

</template>

<script>

import tools    from '../../tools'
import api      from '../../stores/api'

export default {
  name: 'add-post',
  computed: {
    isMarkdownEditor () {
     return this.$store.state.isMarkdownEditor
    },
    isUpdate () {
      return this.$route.query.id || undefined
    },
  },
  data () {
    return {
      form: {
        title:     '',
        subTitle:  '',
        headerImg: '',
        sendAt:    '',
        status:    'send',
        html:      '',
        markdown:  '',
        tags: [],
        column_id: '',
      },
      columns: [],
      inputVisible: false,
      inputValue:   '',
      editor:       {},
      restaurants: [],
      state4: '',
      timeout:  null
    }
  },
  methods: {
    onSubmit() {
      // let _this    = this,
      // dispatch     = 'ADD_ADMIN_ITEM',
      // url          = 'article';
      // if (!this.form.title ||
      //     this.form.status === 'schedule' &&
      //     this.form.sendAt < Date.now()) {
      //   this.$message.error('内容未填写');
      //   return;
      // }

      // if (this.isMarkdownEditor) {
      //   this.form.markdown = this.$store.state.editor.value();
      // } else {
      //   this.form.html = this.$store.state.editor.$txt.html();
      // }

      // if (this.isUpdate) {
      //   dispatch = 'UPDATE_ADMIN_ITEM',
      //   url = `article/${_this.form._id}`
      // }

      // this.$store.dispatch(dispatch, {
      //   url: url,
      //   msg: _this.$message,
      //   data: _this.form,
      //   cb: () => {_this.$set(_this, 'dialogVisible', true)}
      // })
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
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

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
    },
  },
  mounted () {
     getColumns(this)
     this.restaurants = this.loadAll();
  }
}

function getColumns (_this) {
  api._get({
    url: 'admin/columns',
  }).then((result) => {
    console.log(result);
    _this.columns = result.data.columns
  }).catch((err) => {
    console.log(err);
     _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus">
#add-post
  .el-input, #editor-header, #editor
    margin 10px 0

  #editor-header
    height 200px
    line-height 200px
    cursor pointer
    font-size 2rem
    overflow hidden
    padding-left 20px

    img
      position absolute
      top 0
      left 0

  .el-switch
    margin-right 20px

.el-autocomplete-suggestion
  border 1px solid #D7D7D7
  background white !important
  height 250px !important
  overflow-y scroll !important
  li
    padding 10px !important
</style>
