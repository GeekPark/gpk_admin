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
    let editor = new wangEditor('editor');
    editor.config.customUpload = true;
    // editor.config.menuFixed = 200,
    wangEditor.config.printLog = false;
    editor.config.emotions = {
      'default': {
        title: '默认',
        data: 'http://oivm82a2h.bkt.clouddn.com/emotions.data'
      }
    };
    editor.create();
    vm.$store.commit('SET_ITEM', { key: 'htmlEditor', val: editor })
    return editor;
  }
}
