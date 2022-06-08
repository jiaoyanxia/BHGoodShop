export default {
	// 1. 开启命名空间
	namespaced: true,

	// 2. 存储 state 数据
	state: () => ({
		// 地址数据
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		// token 凭证
		token: uni.getStorageSync('token') || '',
		// 用户的基本信息
		userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
		// 重定向的 object 对象
		redirectInfo: null
	}),
	mutations: {
		// 地址块 ---------------------
		// 更新收获地址
		updateAddress(state, address) {
			state.address = address
			this.commit('m_user/saveStorageAddress')
		},
		// 保存地址数据
		saveStorageAddress(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		},
		
		// 用户块 ---------------------
		// 更新用户数据
		updateUserInfo(state, userInfo) {
			state.userinfo = userInfo
			this.commit('m_user/saveStorageUser')
		},
		// 保存用户数据
		saveStorageUser(state) {
			uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
		},
		
		// token块 ---------------------
		updateToken(state, token) {
			state.token = token
			this.commit('m_user/saveStorageToken')
		},
		saveStorageToken(state){
			uni.setStorageSync('token', state.token)
		},
		// 更新重定向地址
		updateRedirectInfo(state, info){
			state.redirectInfo = info
			console.log(state.redirectInfo);
		}
	},
	// 计算属性
	getters: {
		addstr(state) {
			if (!state.address.provinceName) return ''
			console.log(state.address.provinceName);
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address
				.detailInfo
		}
	}
}
