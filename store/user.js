export default {
	// 1. 开启命名空间
	namespaced:true,
	
	// 2. 存储 state 数据
	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}')
	}),
	mutations: {
		// 3. 更新收获地址
		updateAddress(state, address) {
			state.address = address
			this.commit('m_user/saveStorageAddress')
		},
		// 保存数据
		saveStorageAddress(state){
			uni.setStorageSync('address', JSON.stringify(state.address))
		}
	},
	// 计算属性
	getters: {
		addstr(state) {
			if (!state.address.provinceName) return ''
			console.log(state.address.provinceName);
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		}
	}
}