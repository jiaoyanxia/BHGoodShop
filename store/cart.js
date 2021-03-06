export default {
  namespaced: true,

  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),

  mutations: {
    addToCart(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      if (!findResult) {
        state.cart.push(goods)
      } else {
        findResult.goods_count++
      }

      this.commit('m_cart/saveToStorage')
    },
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购物车中商品的勾选状态
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_state = goods.goods_state
        this.commit('m_cart/saveToStorage')
      }
    },
    // 更新商品的数量
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_count = goods.goods_count
        this.commit('m_cart/saveToStorage')
      }
    },
    // 根据 Id 删除对应的商品
    removeGoodsById(state, goods_id) {
		console.log(goods_id);
		const delNum = state.cart.filter(i => i.goods_id != goods_id )
		state.cart = delNum
		console.log("删除成功");
		this.commit('m_cart/saveToStorage')
		
    },
    // 更新购物车中所有商品的勾选状态
    updateAllGoodsState(state, newState) {
		// const all = state.cart.map(i=>{
		// 	i.goods_state = !i.goods_state
		// })
		state.cart.forEach(x => x.goods_state= newState)
		this.commit('m_cart/saveToStorage')
		// console.log( newState ? '选中成功': "" );
    }
  },

  getters: {
    // 购物车中所有商品的总数量
    total(state) {
      return state.cart.reduce((total, item) => total += item.goods_count, 0)
    },
    // 购物车中已勾选商品的总数量
	checkedCount(state) {
		// 查找购物车列表中已被选中的商品，将他们的数量依次添加 ， 默认值为 0 
		return state.cart.filter(i => i.goods_state).reduce((total,item) => total += item.goods_count, 0)
	},
	checkedGoodsPrice(state){
		return state.cart.filter(i=> i.goods_state).reduce((total, item) => total += item.goods_count * item.goods_price, 0).toFixed(2)
	}
   }
}
