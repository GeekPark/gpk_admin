import moment from 'moment'
import WangEditor from 'wangeditor'
import config from '../config'

const FORMAT = 'YYYY-MM-DD HH:mm:ss'
let isUpload = false
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
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
      },
      success: function (xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      fail: function (xhr, editor, result) {
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: function (xhr, editor) {
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      timeout: function (xhr, editor) {
        // 图片上传超时时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      customInsert: function (insertImg, result, editor) {
        const url = result.image.url
        insertImg(url)
        const timer = setInterval(() => {
          document.querySelectorAll('#editor .w-e-text img').forEach(el => {
            if (el.getAttribute('src') === url) {
              clearInterval(timer)
              addImgLabel(vm, url)
            }
          })
        }, 200)
      }
    }
    editor.customConfig.withCredentials = true
    editor.create()
    vm.$store.commit('SET_ITEM', { key: 'htmlEditor', val: editor })

    const oTest = document.querySelector('#veditor #editor .w-e-toolbar')
    const newNode = document.createElement('div')
    newNode.innerHTML = '全屏'
    newNode.style.lineHeight = '44px'
    newNode.style.cursor = 'pointer'
    newNode.style.color = '#999'
    newNode.id = 'fullscreen'
    oTest.appendChild(newNode)

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
      newNode.style.lineHeight = '26px'
      header.style.opacity = '0'
      toolbarContaner.style.padding = '10px 5px'
      changeDom([sider, addPost, footer], 'none')
      cover.appendChild(toolbarContaner)
      cover.appendChild(editorText)
      newNode.innerHTML = '取消'
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
      newNode.style.lineHeight = '44px'
      newNode.innerHTML = '全屏'
    }

    function changeDom (arr, state) {
      arr.forEach(el => {
        el.style.display = state
      })
    }

    // 是否是全屏的标志
    let isFullScreen = false

    // 点击事件
    newNode.addEventListener('click', function () {
      if (isFullScreen) {
        isFullScreen = false
        unDoFullScreen()
      } else {
        isFullScreen = true
        doFullScreen()
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

function addImgLabel (_this, url) {
  let val = '请点击此处输入图片描述'
  isUpload = true
  const $ = window.$
  const updateEl = () => {
    document.querySelectorAll('#editor .w-e-text img').forEach(el => {
      const parent = el.parentNode
      parent.style.textAlign = 'center'
      if (val.trim() === '') {
        val = '请点击此处输入图片描述'
      }
      if (parent.querySelectorAll('.img-label').length === 0 && el.getAttribute('src') === url) {
        const labelNode = document.createElement('div')
        const style = {
          lineHeight: '30px',
          cursor: 'pointer',
          fontSize: '16px',
          letterSpacing: '0px',
          width: '100%',
          border: 'none',
          color: '#BD232E',
          backgroundColor: 'transparent',
          outline: 'none',
          height: '30px',
          overflow: 'hidden'
        }
        labelNode.style = style
        labelNode.style.color = '#999'
        labelNode.innerHTML = val
        labelNode.className = 'img-label'
        labelNode.addEventListener('click', function () {
          labelNode.contenteditable = true
          if (labelNode.innerHTML === val) {
            labelNode.innerHTML = '&nbsp;'
            labelNode.focus()
          }
        })
        document.addEventListener('keyup', function (e) {
          if (e.key === 'Enter' && isUpload) {
            console.log('ENTER')
            // $('.w-e-text p').append($('.img-label')[1])
            $('.w-e-text').focus()
            var place = document.createElement('p')
            place.innerHTML = '&nbsp;'
            document.querySelector('.w-e-text').append(place)
            setTimeout(() => {
              var r = document.getSelection()
              var eles = document.querySelectorAll('.w-e-text p')
              var labels = $(parent).find('.img-label')
              if (labels.length > 1) {
                $(labels).last().hide()
              }
              r.collapse(eles[eles.length - 1], 1)
            }, 100)
            isUpload = false
            return false
          }
        })
        parent.appendChild(labelNode)
      } else if (parent.querySelectorAll('.img-label').length === 1 && el.getAttribute('src') === url) {
      }
    })
  }
  updateEl()
}
