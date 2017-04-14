import Vuex     from 'vuex'
import Vue      from 'vue'
import * as api from './api'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    adminItems:       [],
    uptoken:          '',
    total:            {},
    editor:           {},
    isMarkdownEditor: false,
  },

  mutations: {
    SET_ITEM: (state, obj) => {
      state[obj.key] = obj.val
    },
    DEL_ITEM: (state, obj) => {
      state[obj.key].splice(obj.index, 1)
    },
    ADD_ITEM: (state, obj) => {
      state[obj.key].unshift(obj.val)
    },
    UPDATE_ARRAY_ITEM: (state, obj) => {
      let array = state[obj.key]
      for (let item in array) {
        if (item._id === obj.id) { item = obj.val; break }
      }
    }
  },


  actions: {
    FETCH_ADMIN_ITEMS: ({ commit, state }, req) => {
      return api._get(req).then((items) => {
        req.cb && req.cb(items.data.data)
        commit('SET_ITEM', {key: 'adminItems', val: items.data.data })
      }).catch((err) => {
        console.log(err)
        req.msg.error('error')
      })
    },
    ADD_ADMIN_ITEM: ({ commit, state }, req) => {
      api._post(req).then((result) => {
        req.cb && req.cb(result)
        if (result.status === 200) {
          req.msg.success('success')
          commit('ADD_ITEM', { key: 'adminItems', val: result.data.data})
        } else {
          req.msg.error(result.data.msg || 'error')
        }
      }).catch((err) => {
        console.log(err)
        req.msg.error('error')
      })
    },
    UPDATE_ADMIN_ITEM: ({ commit, state }, req) => {
      api._put(req).then((result) => {
        req.cb && req.cb(result)
        if (result.status === 200) {
          req.msg.success('success')
        } else {
          req.msg.error('error')
        }
      }).catch((err) => {
        console.log(err)
        req.msg.error('error')
      })
    },
    DELETE_ADMIN_ITEM: ({ commit, state }, req) => {
      api._delete(req).then((result) => {
        req.cb && req.cb(result)
        if (result.status === 200) {
          req.msg.success('success')
        } else {
          req.msg.error('error')
        }
      }).catch((err) => {
        req.msg.error('error')
        console.log(err)
      })
    }
  }
})


