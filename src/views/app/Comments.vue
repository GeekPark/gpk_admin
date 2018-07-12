<template lang="pug">
#admin-messages.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
    .filter
      el-input(placeholder="搜索",
               v-model="params.content",
               @keyup.enter.native='fetch')
        i(slot="suffix" class="el-input__icon el-icon-search" @click="fetch")
  el-table(:data='listData.messages',border)
    el-table-column(label='内容名称')
      template(slot-scope='scope')
        a(@click='clickCommentable(scope.row)') {{scope.row.title}}
    el-table-column(prop='content', label='留言内容')
    el-table-column(prop='messager_info.nickname', label='用户名', width="100")
    el-table-column(prop='created_at', label='留言时间', width="135")
    el-table-column(label='相关操作', width="160")
      template(slot-scope='scope')
        el-button(type='text',
                  @click='getReply(scope.row)') {{scope.row.children ? "查看回复" : "回复"}}
        el-button(type='text',
                  @click='handleBlock(scope.row)') {{scope.row.state === 'unpublished' ? "未审核" : "已审核"}}
        el-button(type='text',
                  @click='handleDestroy(scope.row)') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='currentPage',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next, jumper',
                :total='listData.meta.total_count')
  el-dialog(title="回复", :visible.sync="dialogReplyVisible")
    el-form
      el-form-item
        el-input(type="textarea", :rows="4", v-model="reply.content")
    .dialog-footer(slot="footer")
      el-button(type="primary" @click="handleReply") 确定
      el-button(@click="dialogReplyVisible = false") 关闭
  </div>
</el-dialog>
</template>

<script>
import api from 'stores/api'
import tool from 'tools'

const url = 'admin/messages'

export default {
  data () {
    return {
      params: {
        content: ''
      },
      currentPage: 1,
      listData: {
        messages: [],
        meta: {
          total_count: 0,
          limit_value: 0
        }
      },
      reply: {
        content: ''
      },
      currentId: '',
      dialogReplyVisible: false
    }
  },
  methods: {
    clickCommentable (row) {
      window.open(`http://iftalk.geekpark.net/${row.messageable_id}`)
    },
    handleSizeChange (index, val) {
      console.log(`每页 ${index} 条`)
    },
    handleCurrentChange (index, val) {
      this.currentPage = index
      this.fetch()
      console.log(`当前页: ${index}`)
    },
    fetch () {
      const params = Object.assign({page: this.currentPage}, this.params)
      api.get(url, {params: params}).then((result) => {
        console.log(result)
        result.data.messages.forEach(el => {
          el.messager_info = el.messager_info && el.messager_info[0]
        })
        this.listData = result.data
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    handleDestroy (row) {
      api.delete(`${url}/${row.id}`).then((result) => {
        this.$message.success('success')
        this.fetch()
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    handleBlock (row) {
      const str = row.state === 'unpublished' ? 'publish' : 'unpublish'
      api.patch(`${url}/${row.id}/${str}`)
      .then(result => {
        console.log(result)
        this.fetch()
      })
    },
    getReply (row) {
      this.reply = row.children || {}
      this.currentId = row.id
      this.dialogReplyVisible = true
    },
    handleReply () {
      api.post(`${url}/${this.currentId}/reply`, this.reply)
      .then(result => {
        console.log(result)
        this.dialogReplyVisible = false
        this.fetch()
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
    }
  },
  watch: {
    'listData.messages': function (val) {
      val.forEach(el => {
        el.created_at = tool.moment(el.created_at)
        if (Array.isArray(el.messager_info)) {
          el.messager_info = el.messager_info[0]
          el.messager_info.banned = el.messager_info !== null ? (el.messager_info.banned || false) : false
        }
      })
    }
  },
  beforeMount () {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>

</style>
