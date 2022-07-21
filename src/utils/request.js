/**
 * 请求模块
 */
import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/', // 接口的基准路径
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  // 请求前要做什么
  // config 本次请求的配置
  // 必须要返回出去
  (config) => {
    // config添加token
    const token = store.state.user.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  // 请求错误的时候，处理的方法
  (error) => {
    return Promise.reject(error)
  }
)
// 响应拦截器

export default request
