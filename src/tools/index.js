import moment     from 'moment'
import wangEditor from 'wangeditor'
import config     from '../config.js'
console.log(config);
const domain = config.qiniu

function printLog(title, info) {
  window.console && console.log(title, info);
}

export default {
  qiniu: (_this, btnId, dropElement, key, callback) => {
    let uploader = Qiniu.uploader({
      runtimes: 'html5,flash,html4',
      browse_button: btnId,
      uptoken: _this.$store.state.uptoken,
      uptoken_func: function () {
        return _this.$store.state.uptoken
      },
      unique_names: false,
      domain: domain,
      // container: containerId,
      max_file_size: '100mb',
      flash_swf_url: './assets/js/plupload/Moxie.swf',
      filters: {
        mime_types: [
          //只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
          { title: "图片文件", extensions: "jpg,gif,png,bmp,jpeg" }
        ]
      },
      max_retries: 3,             //上传失败最大重试次数
      dragdrop: true,             //开启可拖曳上传
      drop_element: dropElement,  //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
      chunk_size: '4mb',          //分块上传时，每片的体积
      auto_start: true,           //选择文件后自动上传，若关闭需要自己绑定事件触发上传
      init: {
        'FilesAdded': function (up, files) {
          plupload.each(files, function (file) {
            // 文件添加进队列后,处理相关的事情
            printLog('on FilesAdded');
          });
        },
        'BeforeUpload': function (up, file) {
          // 每个文件上传前,处理相关的事情
          printLog('on BeforeUpload');
          console.log(up)
        },
        'UploadProgress': function (up, file) {
          // 显示进度条
          _this.$store.state.showUploadProgress &&
          _this.$store.state.showUploadProgress(file.percent);
        },
        'FileUploaded': function (up, file, info) {
          printLog(info);
          let domain = up.getOption('domain');
          let res = $.parseJSON(info);
          let sourceLink = domain + res.key; //获取上传成功后的文件的Url
          callback(sourceLink);
        },
        'Error': function (up, err, errTip) {
          //上传出错时,处理相关的事情
          printLog('on Error');
          printLog(err);
          printLog(errTip);
        },
        'UploadComplete': function () {
          //队列文件处理完毕后,处理相关的事情
          printLog('on UploadComplete');
          _this.$store.state.showUploadProgress &&
          _this.$store.state.hideUploadProgress();
        },
        'Key': function (up, file) {
          let date = new Date()
          let format = moment(date).format("YYYY/MM/DD_H:mm:ss")
          // do something with key
          return key + '/' + format + '.png'
        }
      }
    });
  },

  editor: function (vm) {
    let __this = this;
    let uploadInit = function () {
      let token = vm.$store.state.uptoken;
      let editor = this;
      let btnId = editor.customUploadBtnId;
      let containerId = editor.customUploadContainerId;
      __this.qiniu(vm, btnId, 'editor-container', 'article', (sourceLink) => {
        const el = `<img src="${sourceLink}" style="max-width:100%;"/>`
        editor.command(null, 'insertHtml', el)
      })
    };

    let editor = new wangEditor('editor');
    editor.config.customUpload = true;
    editor.config.customUploadInit = uploadInit;
    wangEditor.config.printLog = false;
    editor.config.emotions = {
      'default': {
        title: '默认',
        data: 'http://oivm82a2h.bkt.clouddn.com/emotions.data'
      }
    };
    editor.create();
    vm.$store.commit('SET_ITEM', { key: 'editor', val: editor })
  }
}
