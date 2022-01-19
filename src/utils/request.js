import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { Loading } from 'element-ui'

// 内存中请求的数量
let loadingNum = 0
let loading
let timer

// 显示加载
function openLoading() {
  if (loadingNum === 0) {
    loading = Loading.service({
      lock: true,
      text: '数据加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.5)'
    })
  }
  // 请求次数加1
  loadingNum++
}

// 关闭加载
function closeLoading() {
  // 请求次数减1
  loadingNum--
  // 处理两个连续请求导致loading闪烁
  timer = setTimeout(() => {
    if (loadingNum <= 0) {
      loading.close()
      clearTimeout(timer)
    }
  })
}
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    openLoading()
    // do something before request is sent
    const token = store.getters.token || getToken()
    if (token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      if (config.params && config.params.login) {
        config.headers['Authorization'] = 'Basic cGM6cGM='
        config.headers['isToken'] = false
      } else {
        config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带自定义token
      }
    } else {
      config.headers['Authorization'] = 'Basic cGM6cGM='
      config.headers['isToken'] = false
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    closeLoading()
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code === '-2') {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.alert('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      // 如果是下载文件流(Blob方式)单独处理
      if (Object.prototype.toString.call(response.data).slice(8, -1) === 'Blob') {
        return response
      } else {
        return res
      }
    }
  },
  error => {
    closeLoading()
    console.log('err' + error) // for debug
    if (error.response && error.response.status === 401) {
      store.dispatch('user/logout').then(res => {
        window.location.href = '/'
      })
    }
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
