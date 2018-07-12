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
import ManageTopics from 'views/information/ManageTopics.vue'

import Columns from 'views/information/Columns.vue'
import AddColumn from 'views/information/AddColumn.vue'

import Preview from 'views/information/Preview.vue'

import Push from 'views/push/Push.vue'
import AddPush from 'views/push/AddPush.vue'

import News from 'views/information/News.vue'
import AddNews from 'views/information/AddNews.vue'

import QA from 'views/information/QA.vue'
import AddQA from 'views/information/AddQA.vue'

import Ads from 'views/ads/Ads.vue'
import AddAd from 'views/ads/AddAd.vue'

import UsersInfo from 'views/users/UsersInfo.vue'
import Users from 'views/users/Users.vue'
import AddUser from 'views/users/AddUser.vue'

import AppBanner from 'views/app/Banner.vue'
import AppBannerNew from 'views/app/AddBanner.vue'
import Daily from 'views/app/Daily.vue'
import AddDaily from 'views/app/AddDaily.vue'
import Iftalk from 'views/app/Iftalk.vue'
import AddIftalk from 'views/app/AddIftalk.vue'
import IftalkComments from 'views/app/Comments.vue'
import Guests from 'views/app/Guests.vue'
import AddGuest from 'views/app/AddGuest.vue'
import Audios from 'views/app/Audios.vue'
import AddAudio from 'views/app/AddAudio.vue'
import Orders from 'views/app/Orders.vue'
import MemberOrders from 'views/app/MemberOrders.vue'
import CoinsOrders from 'views/app/CoinsOrders.vue'

import Comments from 'views/comments/Comments.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/',
      name: 'index',
      component: Index,
      meta: {title: '极客公园管理后台'}
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
    {
      path: '/preview',
      name: 'Preview',
      component: Preview,
      meta: {title: '临时预览'}
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
    { path: '/topics/management',
      name: 'info-topic-management',
      component: ManageTopics,
      meta: {title: '管理专题'}
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

    { path: '/news',
      name: 'News',
      component: News,
      meta: {title: '快讯列表'}
    },
    { path: '/news/new',
      name: 'news-new',
      component: AddNews,
      meta: {title: '添加快讯'}
    },

    { path: '/qa',
      name: 'qa',
      component: QA,
      meta: {title: '问答列表'}
    },
    { path: '/qa/new',
      name: 'AddQA',
      component: AddQA,
      meta: {title: '添加问答'}
    },

    { path: '/comments',
      name: 'comments',
      component: Comments,
      meta: {title: '评论列表'}
    },

    { path: '/appbanner',
      name: 'appbanner',
      component: AppBanner,
      meta: {title: 'App Banner'}
    },
    { path: '/appbanner/new',
      name: 'appbanner-new',
      component: AppBannerNew,
      meta: {title: 'App Banner'}
    },
    { path: '/daily',
      name: 'daily',
      component: Daily,
      meta: {title: '每日推荐'}
    },
    { path: '/daily/new',
      name: 'daily-new',
      component: AddDaily,
      meta: {title: '添加每日推荐'}
    },
    { path: '/iftalk',
      name: 'iftalk',
      component: Iftalk,
      meta: {title: 'IF Talk 列表'}
    },
    { path: '/iftalk/new',
      name: 'iftalk-new',
      component: AddIftalk,
      meta: {title: '添加 IF Talk'}
    },
    { path: '/iftalk/comments',
      name: 'iftalk-comments',
      component: IftalkComments,
      meta: {title: 'IF Talk 评论'}
    },
    { path: '/guests',
      name: 'guests',
      component: Guests,
      meta: {title: '嘉宾列表'}
    },
    { path: '/guests/new',
      name: 'guests-new',
      component: AddGuest,
      meta: {title: '添加嘉宾'}
    },
    { path: '/audios',
      name: 'audios',
      component: Audios,
      meta: {title: '音频列表'}
    },
    { path: '/audios/new',
      name: 'audios-new',
      component: AddAudio,
      meta: {title: '添加音频'}
    },
    { path: '/orders',
      name: 'orders',
      component: Orders,
      meta: {title: '内容订单'}
    },
    { path: '/orders/member_order',
      name: 'member_order',
      component: MemberOrders,
      meta: {title: '会员订单'}
    },
    { path: '/orders/coins_order',
      name: 'coins_order',
      component: CoinsOrders,
      meta: {title: '极客币订单'}
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
