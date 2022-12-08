import Layout from '@/layout/index.vue'

const dashboardRouter = {
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [
    {
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
    },
    {
      path: '/test',
      component: () => import('@/views/rulesengine/test/index'),
      name: 'Test',
      hidden: true,
      meta: {
        title: '测试',
        roles: ['admin', 'editor'], // 或者你可以给每一个子路由设置自己的权限
        noCache: true // 不会被 <keep-alive> 缓存
      }
    }
  ]
}

export default dashboardRouter
