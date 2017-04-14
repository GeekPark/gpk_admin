import Vue         from 'vue'
import VueRouter   from 'vue-router'

import Index       from '../views/Index.vue'
import Errors      from '../views/Errors.vue'
import Login       from '../views/Login.vue'
import Profile     from '../views/Profile.vue'
import Article     from '../views/Article.vue'

import Timeline    from '../views/items/Timeline.vue'
import Articles    from '../views/items/Articles.vue'
import Users       from '../views/items/Users.vue'
import Votes       from '../views/items/Votes.vue'
import Comments    from '../views/items/Comments.vue'

import AddArticle  from '../views/add/Article.vue'
import AddVote     from '../views/add/Vote.vue'

Vue.use(VueRouter)

const base = 'VMS-'

export const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Index,  meta: {title: `${base}首页`} },

    { path: '/profile', component: Profile, meta: {title: `${base}个人资料`}},
    { path: '/login', component: Login, meta: {title: `${base}登录`}},

    { path: '/article', component: Article, meta: {title: `${base}预览`}},

    { path: '/timeline', component: Timeline, meta: {title: `${base}内容`}},
    { path: '/users', component: Users, meta: {title: `${base}用户`}},

    { path: '/articles', component: Articles, meta: {title: `${base}文章`}},
    { path: '/addArticle', component: AddArticle, meta: {title: `${base}添加文章`}},
    { path: '/votes', component: Votes, meta: {title: `${base}投票`}},
    { path: '/addVote', component: AddVote, meta: {title: `${base}添加投票`}},
    { path: '/comments/:type', component: Comments, meta: {title: `${base}评论`}},

    { path: '*', component: Errors, meta: {title: `${base}Error`}}

  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})
