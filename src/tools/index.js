import moment     from 'moment'
import wangEditor from 'wangeditor'
import config     from '../config.js'
// console.log(config);

function printLog(title, info) {
  window.console && console.log(title, info);
}

export default {
  moment: (obj, format = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(obj).format(format)
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
    vm.$store.commit('SET_ITEM', { key: 'htmlEditor', val: editor })
  }
}
