import Vue from 'vue'
import VueRouter from 'vue-router'
// import config from './config.js'

import Index from 'views/Index.vue'
import Errors from 'views/Errors.vue'

import Posts from 'views/information/Posts.vue'
import AddPost from 'views/information/AddPost.vue'
import Share from 'views/information/Share.vue'
import Recommendations from 'views/information/Recommendations.vue'
import AddRecommend from 'views/information/AddRecommend.vue'
import Topics from 'views/information/Topics.vue'
import AddTopic from 'views/information/AddTopic.vue'
import Columns from 'views/information/Columns.vue'
import AddColumn from 'views/information/AddColumn.vue'

import Push from 'views/push/Push.vue'
import AddPush from 'views/push/AddPush.vue'
import Ads from 'views/ads/Ads.vue'
import AddAd from 'views/ads/AddAd.vue'

import UsersInfo from 'views/users/UsersInfo.vue'
import Users from 'views/users/Users.vue'
import AddUser from 'views/users/AddUser.vue'

import Comments from 'views/comments/Comments.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/',
      name: 'index',
      component: Index,
      meta: {title: '首页'}
    },

    { path: '/users',
      name: 'users',
      component: Users,
      meta: {title: '用户列表'}
    },
    { path: '/users/new',
      name: 'users-new',
      component: AddUser,
      meta: {title: '添加用户'}
    },
    { path: '/users/info/:id',
      name: 'users-info',
      component: UsersInfo,
      meta: {title: '用户详情'}
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
    { path: '/share',
      name: 'info-share',
      component: Share,
      meta: {title: '分享统计'}
    },
    { path: '/recommendations',
      name: 'info-recommendations',
      component: Recommendations,
      meta: {title: '推荐列表'}
    },
    { path: '/recommendations/new',
      name: 'info-recommendation-new',
      component: AddRecommend,
      meta: {title: '推荐列表'}
    },
    { path: '/topics',
      name: 'info-topics',
      component: Topics,
      meta: {title: '专题列表'}
    },
    { path: '/topics/new',
      name: 'info-topic-new',
      component: AddTopic,
      meta: {title: '添加专题'}
    },
    { path: '/columns',
      name: 'info-columns',
      component: Columns,
      meta: {title: '栏目列表'}
    },
    { path: '/columns/new',
      name: 'info-column-new',
      component: AddColumn,
      meta: {title: '添加栏目'}
    },

    { path: '/ads',
      name: 'ads',
      component: Ads,
      meta: {title: '广告列表'}
    },
    { path: '/ads/new',
      name: 'ads-new',
      component: AddAd,
      meta: {title: '添加广告'}
    },
    { path: '/push',
      name: 'push',
      component: Push,
      meta: {title: '推送列表'}
    },
    { path: '/push/new',
      name: 'push-new',
      component: AddPush,
      meta: {title: '添加推送'}
    },

    { path: '/comments',
      name: 'comments',
      component: Comments,
      meta: {title: '评论列表'}
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
