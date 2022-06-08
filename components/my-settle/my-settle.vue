<template>
	<!-- 最外层的容器 -->
	<view class="my-settle-container">
		<!-- 全选 -->
		<label class="radio" @click="changeAllState()">
			<radio color="#C00000" :checked="isFullcheck" /><text>全选</text>
		</label>

		<!-- 合计 -->
		<view class="amount-box">
			合计:<text class="amount">￥{{checkedGoodsPrice}}</text>
		</view>

		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {}
		},
		computed: {
			...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsPrice']),
			...mapGetters('m_user', ['addstr']),
			...mapState('m_cart', ['cart']),
			...mapState('m_user', ['token']),
			// 动态绑定全选按钮
			isFullcheck() {
				return this.total === this.checkedCount
			}
		},
		methods: {
			...mapMutations('m_cart', ['updateAllGoodsState']),
			...mapMutations('m_user', ['updateRedirectInfo']),
			// 点击全选
			changeAllState() {
				this.updateAllGoodsState(!this.isFullcheck)
			},
			// 点击结算
			settlement() {
				// 1. 先判断是否勾选了要结算的商品
				if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！');
				// 2. 再判断用户是否选择了收货地址
				if (!this.addstr) return uni.$showMsg('请选择收获地址');
				// 3. 最后判断用户是否登录了
				if (!this.token) return this.delayNavigate();
				// 4. 调用微信支付方法
				this.payOrder();
			},
			// 倒计时的提示消息
			showTips(s) {
				uni.showToast({
					// 不展示任何图标
					icon: 'none',
					// 提示的消息
					title: '请登录后再结算！' + s + ' 秒后自动跳转到登录页',
					// 为页面添加透明遮罩，防止点击穿透
					mask: true,
					// 1.5 秒后自动消失
					duration: 1500
				})
			},
			// 未登录跳转登录页面
			delayNavigate() {
				let seconds = 3; // 倒计时的秒数
				let timer = null; // 定时器的 Id
				this.showTips(seconds) // 首次执行弹窗提示
				timer = setInterval(() => {
					seconds--;
					// 清除定时器
					if (seconds <= 0) {
						clearInterval(timer)
						// 跳转到指定页面
						uni.switchTab({
							url: '/pages/my/my',
							success: () => {
								// 页面跳转成功之后将跳转信息存储到 Store 中
								this.updateRedirectInfo({
									openType: 'switchTab', // 跳转的方式
									from: '/pages/cart/cart' // 从哪个页面跳转过去的
								})
							}
						})
						return // 终止代码
					}
					this.showTips(seconds) // 执行弹窗提示
				}, 1000)
			},
			// 订单支付功能
			async payOrder() {
				// 1. 创建订单对象 --- --- --- --- 
				const orderInfo = {
					order_price: 0.01,
					consignee_addr: this.addstr,
					goods: this.cart.filter(i => i.goods_state).map(x => ({
						goods_id: x.goods_id, // 订单id
						goods_number: x.goods_count, // 订单数量
						goods_price: x.goods_price //订单价格
					}))
				}
				// 2. 发送订单请求 --- --- --- --- 
				const {
					data: res
				} = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
				if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
				const order_number = res.message.order_number
				console.log("orderNumber",order_number);
				// 3. 订单预支付 --- --- --- --- 
				const {
					data: res2
				} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
					order_number
				})
				if (res.meta.status !== 200) return uni.$showError('预付订单生成失败！')
				const payInfo = res2.message.pay;
				payInfo.appid = 'wx518cc9d7cb0a295a';
				console.log('payInfo', payInfo);
				
				// 4. 发起微信支付 --- --- --- --- 
				const [err, succ] = await uni.requestPayment(payInfo);
				if (err) return uni.$showMsg('订单未支付！')
				console.log('succ', succ);

				const {
					data: res3
				} = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
					order_number: order_number
				})
				// 4.1 检测到订单未支付
				if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
				// 4.2 检测到订单支付完成
				uni.showToast({
					title: '支付完成！',
					icon: 'success'
				})
			}
		}
	}
</script>

<style lang="scss">
	.my-settle-container {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		// 将背景色从 cyan 改为 white
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 5px;
		font-size: 14px;

		.radio {
			display: flex;
			align-items: center;
		}

		.amount {
			color: #c00000;
		}

		.btn-settle {
			height: 50px;
			min-width: 100px;
			background-color: #c00000;
			color: white;
			line-height: 50px;
			text-align: center;
			padding: 0 10px;
		}
	}
</style>
