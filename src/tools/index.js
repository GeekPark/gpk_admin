import moment from 'moment'
import WangEditor from 'wangeditor'
import config from '../config'
import api from '../stores/api'

const FORMAT = 'YYYY-MM-DD HH:mm:ss'
// let isUpload = false
export default {
  moment: (obj, format = FORMAT) => {
    return moment(obj).format(format)
  },
  utc: (obj, format = FORMAT) => {
    return moment(obj).utc().format(format)
  },
  editor: function (vm, onchange) {
    let editor = new WangEditor('#editor')
    editor.customConfig.onchange = onchange
    editor.customConfig.uploadImgMaxSize = 20 * 1024 * 1024
    editor.customConfig.uploadImgMaxLength = 5
    editor.customConfig.uploadImgServer = `${config.api}/api/v1/admin/images`
    editor.customConfig.uploadFileName = 'upload_file'
    editor.customConfig.uploadImgHooks = {
      before: function (xhr, editor, files) {
        // 图片上传之前触发
        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
      },
      success: function (xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
      },
      fail: function (xhr, editor, result) {
        // 图片上传并返回结果，但图片插入错误时触发
      },
      error: function (xhr, editor) {
        // 图片上传出错时触发
      },
      timeout: function (xhr, editor) {
        // 图片上传超时时触发
      },
      customInsert: function (insertImg, result, editor) {
        const url = result.image.url
        insertImg(url)
      }
    }
    editor.customConfig.withCredentials = true
    editor.create()
    vm.$store.commit('SET_ITEM', { key: 'htmlEditor', val: editor })

    const oTest = document.querySelector('#veditor #editor .w-e-toolbar')

    const fullScreenNode = document.createElement('div')
    fullScreenNode.innerHTML = '全屏'
    fullScreenNode.style.lineHeight = '44px'
    fullScreenNode.style.cursor = 'pointer'
    fullScreenNode.style.color = '#999'
    fullScreenNode.id = 'fullscreen'
    oTest.appendChild(fullScreenNode)

    // 获取使用到的元素
    const toolbarContaner = document.querySelector('#editor .w-e-toolbar')
    const editorText = document.querySelector('#editor .w-e-text-container')
    const cover = document.getElementById('editor-cover')
    const container = document.getElementById('editor')
    const sider = document.getElementById('vsider')
    const addPost = document.getElementById('add-post')
    const header = document.getElementById('vheader')
    const footer = document.getElementById('vfooter')
    // 给 img 元素添加点击输入框

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

    function changeDom (arr, state) {
      arr.forEach(el => {
        el.style.display = state
      })
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

    const uploadUrl = `${config.api}/api/v1/admin/images`
    document.querySelector('#veditor #editor .w-e-text').addEventListener('paste', function (event) {
      event.preventDefault()
      let items = (event.clipboardData || event.originalEvent.clipboardData).items
      for (let index in items) {
        let item = items[index]
        if (item.kind === 'file') {
          let blob = item.getAsFile()
          let filename = event.clipboardData.getData('text')
          let param = new window.FormData()
          param.append('upload_file', blob, blob.name)
          api.post(uploadUrl, param, {
            headers: {'Content-Type': 'multipart/form-data'}
          })
          .then(response => {
            const elid = `image-${Date.now()}`
            editor.cmd.do('insertHTML', `<div style="margin:10px 0px;"><img class="paste-image" src="${response.data.image.url}" style="max-width:100%;"/></div><div class="${elid}"><span></br></span></div>`)
            document.querySelectorAll('.paste-image').forEach(el => {
              el.parentNode.parentNode.innerHTML = el.parentNode.parentNode.innerHTML.replace(filename, '')
              document.getSelection().collapse(document.querySelector(`.${elid}`), 0)
            })
          })
          // var reader = new window.FileReader()
          // reader.onload = function (event) {
          //   console.log(event.target.result)
          // }
          // reader.readAsDataURL(blob)
        }
      }
    }, false)

    return editor
  },
  deleteConfirm: function (_this, handler) {
    setTimeout(() => {
      document.querySelector('.el-message-box__headerbtn').style.display = 'none'
    }, 100)
    _this.$confirm('确定要删除吗', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      handler()
    }).catch(() => {
    })
  }
}
