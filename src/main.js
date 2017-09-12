// import 'assets/css/theme/index.css'
import Vue from 'vue'

import App from './App'
/* eslint-disable no-new */
import router from './routers.js'
import store from 'stores'
import Element from 'element-ui'
import Vsider from 'components/Vsider.vue'
import Vheader from 'components/Vheader.vue'
import Vfooter from 'components/Vfooter.vue'
import Veditor from 'components/Veditor.vue'
import Upload from 'components/Upload.vue'
import SearchUser from 'components/SearchUser.vue'
import SearchTag from 'components/SearchTag.vue'
import SearchColumn from 'components/SearchColumn.vue'
import SearchArticle from 'components/SearchArticle.vue'
import ProductCategories from 'components/ProductCategories.vue'
Vue.use(Element)
Vue.component(Vheader.name, Vheader)
Vue.component(Vfooter.name, Vfooter)
Vue.component(Vsider.name, Vsider)
Vue.component(Veditor.name, Veditor)
Vue.component(Upload.name, Upload)
Vue.component(SearchUser.name, SearchUser)
Vue.component(SearchTag.name, SearchTag)
Vue.component(SearchColumn.name, SearchColumn)
Vue.component(SearchArticle.name, SearchArticle)
Vue.component(ProductCategories.name, ProductCategories)

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
