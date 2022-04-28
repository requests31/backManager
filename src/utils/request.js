import axios from 'axios'
// 引入 Vuex 的数据
import store from '@/store'
// 引入 element-ui中的Message组件
import { Message } from 'element-ui'
import router from '@/router'
// 引入qs用于进行请求参数处理
import qs from 'qs'

// create创建axios实例
const request = axios.create({
  // timeout: 5000
  // baseURL:
  // headers:
})

function getBaseUrl (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagounews.com'
  } else {
    return 'http://edufront.lagounews.com'
  }
}

// 设置拦截器
request.interceptors.request.use(function (config) {
//   console.log(config)
  config.baseURL = getBaseUrl(config.url)

  // 统一设置 Token 信息
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      // currentRoute 就是存储了路由信息的对象
      redirect: router.currentRoute.fullPath
    }
  })
}
// 存储是否正在更新Token的状态
let isRefreshing = false
// 存储因为等待Token刷新而挂载的请求
let requests = []
// 设置响应拦截器
request.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response) {
    // 请求发送成功，响应接收完毕，但状态码为失败状态的情况
    // 1、判断失败的状态情况（主要处理401的情况）
    const { status } = error.response
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      // 1、无Token信息
      if (!store.state.user) {
        // 跳转登录页
        redirectLogin()
        return Promise.reject(error)
      }
      // 判断是否已经存在了正在刷新的 Token请求
      if (isRefreshing) {
        // 将当前失败的请求，存储到请求列表中
        return requests.push(() => {
          // 当前函数调用后，会自动发送本次失败的请求
          request(error.config)
        })
      }
      isRefreshing = true
      // 2、Token无效（过期处理）
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        console.log(res)
        // 刷新token失败
        if (res.data.state !== 1) {
          // 清空无效的用户信息
          store.commit('setUser', null)
          // 跳转到登录页
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新token成功
        // 存储新的token
        store.commit('setUser', res.data.content)
        // 重新发送失败请求(根据requests发送的所有失败的请求)
        requests.forEach(callback => callback())
        // 发送完毕，清除requests内容
        requests = []
        // error.config 本次失败的请求的配置对象
        return request(error.config)
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        // 请求发送完毕，响应处理完毕，将刷新状态更改为false
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务端错误，请联系管理员'
    }
    Message.error(errorMessage)
  } else if (error.request) {
    // 请求发送成功，但是未收到响应
    Message.error('请求超时，请重试')
  } else {
    // 意料之外的错误
    Message.error(error.message)
  }
  // 将本次请求的错误对象继续向后抛出，让接收响应处理的处理函数继续操作
  return Promise.reject(error)
})

export default request
