<template lang="jade">
el-form-item(label='头图')
  el-upload#upload(drag="", :action='url', name='upload_file', :on-success='onSuccess')
    i.el-icon-upload
    .el-upload__text
      | 将文件拖到此处，或
      em 点击上传
    .el-upload__tip(slot='tip') 只能上传jpg/png文件，且不超过500kb
</template>

<script>
import config from '../config.js'
export default {
  name: 'upload',
  computed: {
    url() {
      return `${config.host}v1/admin/images`
    }
  },
  methods: {
    onSuccess (response, file, fileList) {
      console.log(response.image)
    }
  }
}
</script>

<style lang="stylus" scoped>
#upload
  width 300px
  border 1px dashed #d9d9d9
  padding 10px
  cursor pointer
</style>
