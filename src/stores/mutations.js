export default {
  SET_ITEM: (state, obj) => {
    state[obj.key] = obj.val
  },
  DEL_ITEM: (state, obj) => {
    state[obj.key].splice(obj.index, 1)
  },
  ADD_ITEM: (state, obj) => {
    state[obj.key].unshift(obj.val)
  },
  LOADING: (state, val) => {
    state.isLoading = val
  },
  UPDATE_ARRAY_ITEM: (state, obj) => {
    let array = state[obj.key]
    for (let item in array) {
      if (item._id === obj.id) { item = obj.val; break }
    }
  }
}
