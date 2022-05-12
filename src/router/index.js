import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '仪表盘',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    },
    {
      path: '/rulesEngine',
      component: () => import('@/views/rulesengine/index'),
      name: 'RulesEngine',
      hidden: true,
      meta: {
        title: '规则引擎',
        roles: ['admin', 'editor'], // 或者你可以给每一个子路由设置自己的权限
        noCache: true // 不会被 <keep-alive> 缓存
      }
    }]
  },

  {
    path: '/database',
    component: Layout,
    redirect: '/database/library', // 重定向地址，在面包屑中点击会重定向去的地址
    hidden: false, // 不在侧边栏显示
    alwaysShow: false, // 一直显示根路由
    meta: { title: '知识库', icon: 'el-icon-coin', roles: ['admin', 'editor'] },
    children: [{
      path: 'catalog',
      component: () => import('@/views/database/catalog/index'),
      name: 'Catalog',
      meta: {
        title: '目录',
        icon: 'el-icon-collection', // 图标
        roles: ['admin', 'editor'], // 或者你可以给每一个子路由设置自己的权限
        noCache: true // 不会被 <keep-alive> 缓存
      }
    },
    {
      path: 'library',
      component: () => import('@/views/database/library/index'),
      name: 'Library',
      meta: {
        title: '库',
        icon: 'el-icon-notebook-1', // 图标
        roles: ['admin', 'editor'], // 或者你可以给每一个子路由设置自己的权限
        noCache: true // 不会被 <keep-alive> 缓存
      }
    },
    {
      path: 'attribute',
      component: () => import('@/views/database/attribute/index'),
      name: 'Attribute',
      meta: {
        title: '属性',
        icon: 'el-icon-notebook-2', // 图标
        roles: ['admin', 'editor'], // 或者你可以给每一个子路由设置自己的权限
        noCache: true // 不会被 <keep-alive> 缓存
      }
    },
    {
      path: 'model',
      component: () => import('@/views/database/model/index'),
      name: 'Model',
      meta: {
        title: '模型',
        icon: 'el-icon-s-data', // 图标
        roles: ['admin', 'editor'], // 或者你可以给每一个子路由设置自己的权限
        noCache: true // 不会被 <keep-alive> 缓存
      }
    },
    {
      path: 'model/create',
      component: () => import('@/views/database/model/components/create'),
      name: 'CreateModel',
      hidden: true,
      meta: {
        title: '创建模型',
        roles: ['admin', 'editor'], // 或者你可以给每一个子路由设置自己的权限
        noCache: true // 不会被 <keep-alive> 缓存
      }
    }]
  },

  {
    path: '/rule',
    component: Layout,
    redirect: '/rule/index', // 重定向地址，在面包屑中点击会重定向去的地址
    hidden: false, // 不在侧边栏显示
    alwaysShow: false, // 一直显示根路由
    meta: { roles: ['admin', 'editor'] }, // 你可以在根路由设置权限，这样它下面所有的子路由都继承了这个权限
    children: [{
      path: 'index',
      component: () => import('@/views/rule/index'),
      name: 'Rule',
      meta: {
        title: '规则',
        icon: 'el-icon-s-operation', // 图标
        roles: ['admin', 'editor'], // 或者你可以给每一个子路由设置自己的权限
        noCache: true // 不会被 <keep-alive> 缓存
      }
    },
    {
      path: 'edit',
      component: () => import('@/views/rule/components/edit'),
      name: 'EditRule',
      hidden: true,
      meta: {
        title: '规则',
        roles: ['admin', 'editor'], // 或者你可以给每一个子路由设置自己的权限
        noCache: true // 不会被 <keep-alive> 缓存
      }
    },
    {
      path: 'expression',
      component: () => import('@/views/rule/components/expression'),
      name: 'Expression',
      hidden: true,
      meta: {
        title: '表达式',
        roles: ['admin', 'editor'], // 或者你可以给每一个子路由设置自己的权限
        noCache: true // 不会被 <keep-alive> 缓存
      }
    }]
  },

  {
    path: '/segment.js',
    component: Layout,
    redirect: '/segment/index', // 重定向地址，在面包屑中点击会重定向去的地址
    hidden: false, // 不在侧边栏显示
    alwaysShow: false, // 一直显示根路由
    meta: { roles: ['admin', 'editor'] }, // 你可以在根路由设置权限，这样它下面所有的子路由都继承了这个权限
    children: [{
      path: 'index',
      component: () => import('@/views/segment/index'),
      name: 'Segment',
      meta: {
        title: '片段',
        icon: 'el-icon-price-tag', // 图标
        roles: ['admin', 'editor'], // 或者你可以给每一个子路由设置自己的权限
        noCache: true // 不会被 <keep-alive> 缓存
      }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
