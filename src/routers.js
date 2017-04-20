import Vue         from 'vue'
import VueRouter   from 'vue-router'
import config      from './config'

import Index       from './views/Index.vue'
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
      component: Index,
      meta: {title: `${base}首页`}
    },
    { path: '/timeline',
      component: Timeline,
      meta: {title: `${base}内容`}
    },

    { path: '/users',
      component: Users,
      meta: {title: `${base}用户`}
    },
    { path: '/user/add',
      component: AddUser,
      meta: {title: `${base}添加用户`}
    },

    { path: '/posts',
      component: Posts,
      meta: {title: `${base}文章`}
    },
    { path: '/post/add',
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
