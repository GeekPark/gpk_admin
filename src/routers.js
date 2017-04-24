import Vue         from 'vue'
import VueRouter   from 'vue-router'
import config      from './config'

import Index       from './views/Index.vue'
import Charts      from './views/Charts.vue'
import Errors      from './views/Errors.vue'
import Timeline    from './views/Timeline.vue'

import Posts       from './views/posts/Posts.vue'
import AddPost     from './views/posts/AddPost.vue'


import Users       from './views/users/Users.vue'
import AddUser     from './views/users/AddUser.vue'

import Comments    from './views/comments/Comments.vue'


Vue.use(VueRouter)

const base = config.title

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/',
      name: 'index',
      component: Index,
      meta: {title: `${base}首页`}
    },

    { path: '/charts',
      name: 'charts',
      component: Charts,
      meta: {title: `${base}Charts`}
    },

    { path: '/users',
      name: 'users',
      component: Users,
      meta: {title: `${base}用户`}
    },
    { path: '/users/new',
      name: 'users-new',
      component: AddUser,
      meta: {title: `${base}添加用户`}
    },

    { path: '/posts',
      name: 'posts',
      component: Posts,
      meta: {title: `${base}文章`}
    },
    { path: '/posts/new',
      name: 'posts-new',
      component: AddPost,
      meta: {title: `${base}添加文章`}
    },
    { path: '/comments',
      component: Comments,
      meta: {title: `${base}评论`}
    },
    { path: '*',
      component: Errors,
      meta: {title: `${base}Error`}
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
