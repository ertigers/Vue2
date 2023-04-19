import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/index.vue'
import Login from '../views/login.vue'
import PushLog from '../views/pushLog/index.vue'
import User from '../views/user/index.vue'
import Setup from '../views/setup/index.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' ,meta:{title: '登录'}},
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta:{title: '首页'},
    children:[
      {
        path: "", 
        redirect: "/pushLog"
      },
      {
        path: '/pushLog',
        name: 'PushLog',
        component: PushLog,
        meta:{title: '推送日志'}
      },
      {
        path: '/user',
        name: 'User',
        component: User,
        meta:{title: '用户管理'}
      },
      {
        path: '/setup',
        name: 'Setup',
        component: Setup,
        meta:{title: '我的信息'}
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{title: '登录'}
  },


]

const router = new VueRouter({
  routes
})

export default router
