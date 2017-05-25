<template lang="jade">
el-form-item#upload-component(label='头图')
  el-upload.avatar-uploader(
                   :action='uploadUrl',
                   name='upload_file',
                   :show-file-list="false",
                   :on-success="handleAvatarScucess",
                   :before-upload="beforeAvatarUpload")
    img.avatar(v-if="imageUrl", :src="imageUrl")
    i.avatar-uploader-icon.el-icon-plus(v-else)
</template>

<script>
import config from '../config.js'
export default {
  name: 'upload',
  computed: {
    uploadUrl() {
      return `${config.host}v1/admin/images`
    }
  },
  data () {
    return {
      imageUrl: '',
    }
  },
  props: ['callback'],
  methods: {
    handleAvatarScucess (response, file, fileList) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.callback(response.image)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<style lang="stylus">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
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
</style>
