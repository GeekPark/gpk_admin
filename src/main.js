import Vue        from 'vue'
import Vuex       from 'vuex'

import App        from './App'
/* eslint-disable no-new */
import { router } from './routers'
import { store }  from './stores'
import Element    from 'element-ui'
import Vsider     from "./components/Vsider.vue"
import Vheader    from "./components/Vheader.vue"
import Vfooter    from "./components/Vfooter.vue"
import Veditor    from "./components/Veditor.vue"
import Commit     from "./components/Commit.vue"
import Vsearch    from "./components/Vsearch.vue"
import Vmarkdown  from "./components/Vmarkdown.vue"
import hljs       from 'highlight.js'
import VueDND     from 'awe-dnd'

Vue.use(VueDND)
Vue.use(Element)
Vue.component(Vheader.name,   Vheader)
Vue.component(Vfooter.name,   Vfooter)
Vue.component(Vsider.name,    Vsider)
Vue.component(Veditor.name,   Veditor)
Vue.component(Commit.name,    Commit)
Vue.component(Vsearch.name,   Vsearch)
Vue.component(Vmarkdown.name, Vmarkdown)


Vue.directive('highlightjs', el => {
  let blocks = el.querySelectorAll('pre');
  Array.prototype.forEach.call(blocks, hljs.highlightBlock);
})

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})


