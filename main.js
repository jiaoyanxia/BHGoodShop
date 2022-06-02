import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

import { $http } from '@escook/request-miniprogram'

// 配置请求
uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 配置请求拦截器
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...'
	})
}

// 配置响应拦截器
$http.afterRequest = function() {
	uni.hideLoading()
}

// 失败消息提示
// uni.$showMsg = function () {
// 	uni.$showMsg({
// 		    title,
// 		    duration,
// 		    icon: 'none',
// 	})
// }

uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}

