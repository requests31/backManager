import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// 引入路由中组要使用的组件功能
// import Login from '@/views/login/index.vue'
// import Layout from '@/views/layout/index.vue'
// import Home from '@/views/home/index.vue'
// import Role from '@/views/role/index.vue'
// import Menu from '@/views/menu/index.vue'
// import Resource from '@/views/resource/index.vue'
// import Course from '@/views/course/index.vue'
// import User from '@/views/user/index.vue'
// import Advert from '@/views/advert/index.vue'
// import AdvertSpace from '@/views/advert-space/index.vue'
// import ErrorPage from '@/views/error-page/index.vue'

Vue.use(VueRouter)

// 路由规则（添加需要认证的 requiresAuth信息）
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */'@/views/login/index')
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: 'layout' */'@/views/layout/index'),
    // 直接给某个路由设置，这时内部的子路由都需要认证（包含当前路由）
    meta: { requiresAuth: true },
    children: [
      {
        // 主页
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */'@/views/home/index')
      },
      // 角色组件
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */'@/views/role/index')
      },
      // 分配菜单路由组件
      {
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: 'alloc-menu' */'@/views/role/alloc-menu'),
        props: true
      },
      // 菜单组件
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/index')
      },
      // 添加菜单组件
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create' */'@/views/menu/create')
      },
      // 编辑菜单组件
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-edit' */'@/views/menu/edit')
      },
      // 资源组件
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */'@/views/resource/index')
      },
      // 添加资源组件
      {
        path: '/resource/create',
        name: 'resource-create',
        component: () => import(/* webpackChunkName: 'resource-create' */'@/views/resource/create')
      },
      // 编辑资源组件
      {
        path: '/resource/:id/edit',
        name: 'resource-edit',
        component: () => import(/* webpackChunkName: 'resource-edit' */'@/views/resource/edit')
      },
      // 课程组件
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */'@/views/course/index')
      },
      // 添加课程组件
      {
        path: '/course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName: 'course-create' */'@/views/course/create')
      },
      // 编辑课程组件
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunkName: 'course-edit' */'@/views/course/edit'),
        props: true
      },
      // 课程内容管理
      {
        path: '/course/:courseId/section',
        name: 'course-section',
        component: () => import(/* webpackChunkName: 'course-section' */'@/views/course/section'),
        props: true
      },
      // 上传视频组件
      {
        path: '/course/:courseId/video',
        name: 'course-video',
        component: () => import(/* webpackChunkName: 'course-video' */'@/views/course/video'),
        props: true
      },
      // 用户组件
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */'@/views/user/index')
      },
      // 广告组件
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */'@/views/advert/index')
      },
      // 广告位列表组件
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */'@/views/advert-space/index')
      }
    ]
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: 'error-page' */'@/views/error-page/index')
  }
]

const router = new VueRouter({
  routes
})

// 设置路由守卫
router.beforeEach((to, from, next) => {
  console.log(to)
  // 验证to路由是否需要进行身份认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 验证Vuex的store中的登录用户信息是否存储
    if (!store.state.user) {
    // 未登录，跳转到登录页
      return next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    }
    // 已登录，允许通过
    next()
  } else {
    next()
  }
})

export default router
