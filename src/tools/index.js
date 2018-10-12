import moment from 'moment'
import WangEditor from 'wangeditor'
import config from '../config'
import api from '../stores/api'

const FORMAT = 'YYYY-MM-DD HH:mm:ss'
const uploadUrl = `${config.api}/api/v1/admin/images`

const createEditor = (onchange) => {
  let editor = new WangEditor('#editor')
  editor.customConfig.onchange = onchange
  editor.create()
  return editor
}

export default {
  moment: (obj, format = FORMAT) => {
    return moment(obj).format(format)
  },
  utc: (obj, format = FORMAT) => {
    return moment(obj).utc().format(format)
  },
  editor: function (vm, onchange) {
    const editor = createEditor(onchange)
    vm.$store.commit('SET_ITEM', { key: 'htmlEditor', val: editor })
    addUploadImage(vm, editor)
    addFullScreen()
    addPasteEvent(vm, editor)
    addSaveBack(vm, editor)
    return editor
  },
  autoConfirm: function (_this, handler) {
    setTimeout(() => {
      document.querySelector('.el-message-box__headerbtn').style.display = 'none'
    }, 100)
    _this.$confirm('确定要修改吗', '', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => { handler() }).catch(() => {})
  },
  deleteConfirm: function (_this, handler) {
    setTimeout(() => {
      document.querySelector('.el-message-box__headerbtn').style.display = 'none'
    }, 100)
    _this.$confirm('确定要删除吗', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => { handler() }).catch(() => {})
  }
}

const addSaveBack = (vm, editor) => {
  const save = addToolButton('保存')
  const back = addToolButton('恢复')
  save.onclick = () => {
    const html = editor.txt.html()
    window.localStorage.setItem('wangeditor', html)
    vm.$notify.success('已保存 \n 只会保存最新的一份文章')
  }
  back.onclick = () => {
    const html = window.localStorage.getItem('wangeditor')
    editor.txt.html(html)
    vm.$notify.success('已恢复')
  }
}

const addUploadImage = (vm, editor) => {
  document.querySelector('.w-e-icon-image').parentNode.outerHTML = ''
  const node = addToolButton('上传图片')
  const inputNode = document.createElement('input')
  inputNode.type = 'file'
  inputNode.accept = 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
  inputNode.multiple = 'multiple'
  inputNode.style.position = 'absolute'
  inputNode.style.zIndex = '2'
  inputNode.style.top = '0'
  inputNode.style.left = '0'
  inputNode.style.width = '100%'
  inputNode.style.height = '100%'
  inputNode.style.opacity = '0'
  inputNode.style.cursor = 'pointer'
  inputNode.addEventListener('change', () => {
    // console.log(inputNode.files)
    Array.from(inputNode.files).forEach(file => {
      upload(editor, file)
    })
    vm.$notify.warning(`选择了${inputNode.files.length}张图片`)
  })
  node.appendChild(inputNode)
}

const addPasteEvent = (vm, editor) => {
  document.querySelector('#veditor #editor .w-e-text').addEventListener('paste', function (event) {
    let items = (event.clipboardData || event.originalEvent.clipboardData).items
    for (let index in items) {
      let item = items[index]
      if (item.kind === 'file') {
        document.execCommand('undo')
        let file = item.getAsFile()
        let filename = event.clipboardData.getData('text')
        upload(editor, file, filename)
      }
    }
  })
}

const addToolButton = (name) => {
  const toolbarContaner = document.querySelector('#veditor #editor .w-e-toolbar')
  const node = document.createElement('div')
  node.innerHTML = name
  node.style.lineHeight = '44px'
  node.style.cursor = 'pointer'
  node.style.color = '#999'
  node.style.marginRight = '10px'
  node.style.position = 'relative'
  node.id = 'fullscreen'
  toolbarContaner.appendChild(node)
  return node
}

const addFullScreen = () => {
  const toolbarContaner = document.querySelector('#veditor #editor .w-e-toolbar')
  const fullScreenNode = addToolButton('全屏')
  // 获取使用到的元素
  const editorText = document.querySelector('#editor .w-e-text-container')
  const cover = document.getElementById('editor-cover')
  const container = document.getElementById('editor')
  const sider = document.getElementById('vsider')
  const addPost = document.getElementById('add-post')
  const header = document.getElementById('vheader')
  const footer = document.getElementById('vfooter')
  // 全屏事件
  function doFullScreen () {
    cover.style.display = 'block'
    editorText.style.height = '100%'
    fullScreenNode.style.lineHeight = '26px'
    header.style.opacity = '0'
    toolbarContaner.style.padding = '10px 5px'
    changeDom([sider, addPost, footer], 'none')
    cover.appendChild(toolbarContaner)
    cover.appendChild(editorText)
    fullScreenNode.innerHTML = '取消'
  }
  // 退出全屏事件
  function unDoFullScreen () {
    changeDom([sider, addPost, footer], 'block')
    container.appendChild(toolbarContaner)
    container.appendChild(editorText)
    editorText.style.height = '300px'
    cover.style.display = 'none'
    header.style.opacity = '1'
    toolbarContaner.style.padding = '0px 5px'
    fullScreenNode.style.lineHeight = '44px'
    fullScreenNode.innerHTML = '全屏'
  }
  // 是否是全屏的标志
  let isFullScreen = false

  // 点击事件
  fullScreenNode.addEventListener('click', function () {
    if (isFullScreen) {
      isFullScreen = false
      unDoFullScreen()
    } else {
      isFullScreen = true
      doFullScreen()
    }
  }, false)
}

const upload = (editor, blob, filename) => {
  let param = new window.FormData()
  param.append('upload_file', blob, blob.name)
  api.post(uploadUrl, param, {
    headers: {'Content-Type': 'multipart/form-data'}
  })
  .then(response => {
    const elid = `image-${Date.now()}`
    console.log(response.data.image)

    editor.cmd.do('insertHTML', `
      <br><div class="image-desc" style="text-align: center; color: #333;">
          <img class="uploaded-img" src=${response.data.image.url} max-width="100%" width="auto" height="auto">
        </div>
      <br>
      <p class="${elid}" style="text-align: left;"><span></span></p>`)
    // <div class="image-caption" style="min-width: 20%; max-width: 80%; height: 35px; display: inline-block; padding: 10px 10px 0px 10px; margin: 0 auto; border-bottom: 1px solid #d9d9d9; font-size: 16px; color: #999; padding-bottom: 30px; content: "";"></div>
    // getEditorElement().onkeypress = function (event) {
    //   const el = getSelectedNode()
    //   if (event.keyCode === 13 && el.className === 'image-caption') {
    //     const node = getEditorElement()
    //     node.innerHTML += '<p><br></p>'
    //     document.getSelection().collapse(node, node.childNodes.length - 1)
    //     return false
    //   }
    //   if (el.localName === 'img') {
    //     return false
    //   }
    // }
    // getEditorElement().onkeydown = function (event) {
    //   const el = getSelectedNode()
    //   console.log(el)
    //   if (event.keyCode === 8) {
    //     if (el.className === 'image-caption' && el.innerHTML.length <= 1 && el.innerHTML !== '&nbsp') {
    //       el.innerHTML = '&nbsp'
    //       return false
    //     }
    //     if (el.className === 'image-desc') {
    //       return false
    //     }
    //   }
    // }
    document.querySelectorAll('.paste-image').forEach(el => {
      document.getSelection().collapse(document.querySelector(`.${elid}`), 0)
    })
  })
}

// function getEditorElement () {
//   return document.querySelector('.w-e-text')
// }

// function getSelectedNode () {
//   if (document.selection) {
//     return document.selection.createRange().parentElement()
//   } else {
//     let selection = window.getSelection()
//     if (selection.rangeCount > 0) {
//       return selection.getRangeAt(0).startContainer.parentNode
//     }
//   }
// }

const changeDom = (arr, state) => {
  arr.forEach(el => {
    el.style.display = state
  })
}
