import Layout from '@/layout'

const segmentRouter = {
  path: '/segment',
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
}
export default segmentRouter
