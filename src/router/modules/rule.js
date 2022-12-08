import Layout from '@/layout'

const ruleRouter = {
  path: '/rule',
  component: Layout,
  redirect: '/rule/index', // 重定向地址，在面包屑中点击会重定向去的地址
  hidden: false, // 不在侧边栏显示
  alwaysShow: false, // 一直显示根路由
  meta: { roles: ['admin', 'editor'] }, // 你可以在根路由设置权限，这样它下面所有的子路由都继承了这个权限
  children: [
    {
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
    }
  ]
}
export default ruleRouter
