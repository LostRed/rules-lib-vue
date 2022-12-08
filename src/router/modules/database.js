import Layout from '@/layout'

const databaseRouter = {
  path: '/database',
  component: Layout,
  redirect: '/database/library', // 重定向地址，在面包屑中点击会重定向去的地址
  hidden: false, // 不在侧边栏显示
  alwaysShow: true, // 一直显示根路由
  meta: { title: '知识库', icon: 'el-icon-coin', roles: ['admin', 'editor', 'guest'] },
  children: [
    {
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
        roles: ['admin', 'editor', 'guest'], // 或者你可以给每一个子路由设置自己的权限
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
    }
  ]
}
export default databaseRouter
