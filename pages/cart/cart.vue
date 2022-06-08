<template>
	<view class="cart-container">
		<!-- 收货地址组件 -->
		<my-address></my-address>
		<!-- 商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 右侧的文本 -->
			<text class="cart-title-text">购物车</text>
		</view>
		<!-- 循环渲染购物车中的商品信息 -->
		<uni-swipe-action>
			<block v-for="(goods, i) in cart" :key="i">
				<uni-swipe-action-item :options="options" @click="swipeItemClickHandler(goods)">
					<my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler"
						@num-change="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		<my-settle></my-settle>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'

	export default {
		mixins: [badgeMix],
		computed: {
			/**goods_count: 9
				goods_id: 57405
				goods_name: "凌度车载充电器车充汽车用点烟器插头usb手机多功能24v一拖二快充凌度c80"
				goods_price: 49
				goods_small_logo: "http://image3.suning.cn/uimg/b2c/newcatentries/0070065265-000000000688066437_1_400x400.jpg"
				goods_state: true
			 * */
			...mapState('m_cart', ['cart']),
			...mapGetters('m_cart', ['total']),
		},
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#C00000'
					}
				}]
			};
		},
		methods: {
			setBadge() {
				uni.setTabBarBadge({
					index:2,
					// 注意：text 的值必须是字符串，不能是数字
					text:this.total + ''
				})
			},
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			radioChangeHandler(e) {
			  this.updateGoodsState(e)
			},
			numberChangeHandler(e) {
			  this.updateGoodsCount(e)
			},
			swipeItemClickHandler(goods) {
			  this.removeGoodsById(goods.goods_id)
			}
		},

		onShow() {
			this.setBadge();
			console.log(this.cart);
		}
	}
</script>

<style lang="scss">
	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		padding-left: 5px;
		border-bottom: 1px solid #EFEFEF;

		.cart-title-text {
			font-size: 14px;
			margin-left: 10px;
		}
	}
	.cart-container {
	  padding-bottom: 50px;
	}
</style>
