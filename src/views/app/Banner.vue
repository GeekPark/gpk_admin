<template lang="pug">
#admin-banners.admin
  .admin-header
    .title
      h1 {{$route.meta.title}}
      el-button(type='text', @click="addBanner", v-show="banners.length < Object.keys(positions).length") 添加Banner
  el-table(:data='banners', border)
    el-table-column(prop='position', label='位置')
      template(slot-scope='scope')
        span(v-if='!scope.row.isEditing' @click="scope.row.isEditing = true") {{positions[scope.row.position]}}
        div(v-else)
          el-select(v-model='scope.row.position_new', placeholder='请选择')
            el-option(v-for='(value, key) in positions',
                      :label='value',
                      :value='key',
                      :key='key')
          el-button(@click='handleEdit(scope.$index, scope.row)') 保存
    el-table-column(prop='cover_url', label='图片', width='250')
      template(slot-scope='scope')
        img(:src='scope.row.cover_url', style='width: 100%')
    el-table-column(prop='model', label='类型')
      template(slot-scope='scope')
        span {{scope.row.banner_type === 'internal' ? scope.row.model : '外部链接'}}
    el-table-column(prop='state', label='状态')
    el-table-column(prop='operator.name', label='创建者', width="90")
    el-table-column(label='操作')
        template(slot-scope='scope')
          el-button(type='text',
                    v-if="!scope.row.isEditing",
                    @click='scope.row.isEditing = true') 编辑
          el-button(type='text',
                    v-else,
                    @click='handleEdit(scope.$index, scope.row)') 保存
          el-button(type='text',
                    @click='handleDestroy(scope.row)') 删除
</template>

<script>
import api from 'stores/api'
import tool from 'tools'
const url = 'admin/banners'

export default {
  data () {
    return {
      currentPage: 1,
      positions: {},
      banners: []
    }
  },
  methods: {
    fetch () {
      let params = { page: this.currentPage }
      api.get(url, {params: params}).then(result => {
        this.banners = result.data.banners.map(el => {
          el.isEditing = false
          el.position_new = el.position
          return el
        })
      }).catch(err => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    handleDestroy (val) {
      const destroy = () => {
        api.delete(`${url}/${val.id}`).then(result => {
          this.$message.success('success')
          this.fetch()
        }).catch(err => {
          console.log(err)
          this.$message.error(err.toString())
        })
      }
      tool.deleteConfirm(this, destroy)
    },
    addBanner () {
      this.$router.push('/appbanner/new')
    },
    handleEdit (index, row) {
      console.log(row.id, row.position_new)
      api.put(`${url}/${row.id}`, {position: row.position_new})
      .then((result) => {
        this.banners[index].position = row.position_new
        this.banners[index].isEditing = false
        this.$message.success('success')
      }).catch((err) => {
        this.$message.error(err.toString())
      })
    },
    getPosition () {
      api.get(`${url}/app_positions`)
      .then((result) => {
        this.positions = result.data
      }).catch((err) => {
        this.$message.error(err.toString())
      })
    }
  },
  mounted () {
    this.fetch()
    this.getPosition()
  }
}
</script>

<style lang="stylus">
.active-ad
  background-color #e2f0e4 !important
.el-select
  width 70%
</style>
