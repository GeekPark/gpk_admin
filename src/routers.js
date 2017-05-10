import Vue         from 'vue'
import VueRouter   from 'vue-router'
import config      from './config'

import Index       from './views/Index.vue'
import Charts      from './views/Charts.vue'
import Errors      from './views/Errors.vue'
import Timeline    from './views/Timeline.vue'

import Posts       from './views/posts/Posts.vue'
import AddPost     from './views/posts/AddPost.vue'
import Share       from './views/posts/Share.vue'


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
      meta: {title: '首页'}
    },

    { path: '/charts',
      name: 'charts',
      component: Charts,
      meta: {title: 'Charts'}
    },

    { path: '/users',
      name: 'users',
      component: Users,
      meta: {title: '用户'}
    },
    { path: '/users/new',
      name: 'users-new',
      component: AddUser,
      meta: {title: '添加用户'}
    },

    { path: '/posts',
      name: 'posts',
      component: Posts,
      meta: {title: '文章列表'}
    },
    { path: '/posts/new',
      name: 'posts-new',
      component: AddPost,
      meta: {title: '添加文章'}
    },
    { path: '/posts/share',
      name: 'posts-share',
      component:  Share,
      meta: {title: '分享统计'}
    },
    { path: '/comments',
      component: Comments,
      meta: {title: '评论'}
    },
    { path: '*',
      component: Errors,
      meta: {title: 'Error'}
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
