<template lang="jade">
#upload
  el-upload.avatar-uploader(
                   :action='uploadHost',
                   name='upload_file',
                   :show-file-list="false",
                   :on-success="handleAvatarScucess",
                   :before-upload="beforeAvatarUpload")
    img.avatar(v-if="displayUrl", :src="displayUrl")
    i.avatar-uploader-icon.el-icon-plus(v-else)
  i.avatar-delete-icon.el-icon-delete(v-if="displayUrl != ''", @click="avatarDelete")
</template>

<script>
import config from '../config.js'
export default {
  name: 'upload',
  computed: {
    uploadHost () {
      return `${config.api}/api/v1/admin/images`
    },
    displayUrl () {
      const handle = (link) => {
        if (link.length < 0) {
          return ''
        }
        return link.replace('www.geekpark.net', 'geekpark.geeklabs.vc')
      }
      if (this.url === null || this.url === '') {
        return handle(this.uploadUrl)
      } else if (this.url === 'deleted') {
        return ''
      } else {
        return handle(this.url)
      }
    }
  },
  data () {
    return {
      uploadUrl: ''
    }
  },
  props: ['callback', 'url', 'uploadDelete'],
  methods: {
    handleAvatarScucess (response, file, fileList) {
      console.log(response)
      this.$message.success('上传成功')
      this.uploadUrl = response.image.url
      this.callback(response.image)
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    avatarDelete () {
      this.uploadDelete()
    }
  }
}
</script>

<style lang="stylus">
.avatar-uploader {
  display: inline-block;
}

.avatar-uploader .el-upload {
  border: 1px dashed #B2B2B2;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  padding: 10px;
  overflow: hidden;
  text-align: center;
  width: 200px;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: auto;
  height: 178px;
  display: block;
}
.avatar-delete-icon {
  z-index: 10;
  right: 10px;
  top: 0;
  cursor: pointer;
  position: absolute;
  left: 230px;
  font-size: 25px;
}
</style>
