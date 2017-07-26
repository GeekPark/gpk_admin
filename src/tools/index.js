import moment from 'moment'
import WangEditor from 'wangeditor'

export default {
  moment: (obj, format = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(obj).format(format)
  },
  editor: function (vm) {
    let editor = new WangEditor('#editor')
    editor.create()
    vm.$store.commit('SET_ITEM', { key: 'htmlEditor', val: editor })
    return editor
  }
}
