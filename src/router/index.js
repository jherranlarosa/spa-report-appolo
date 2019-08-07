import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)
import Layout from '../views/layout/Layout'
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/report',
    component: Layout,
    redirect: '/dashboard/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'Report',
      icon: 'documentation',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'accountAnalysis',
      component: _import('report/accountAnalysis'),
      name: 'pageAccountAnalysis',
      meta: {
        title: 'pageAccountAnalysis',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]
