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
		<view class="btn-settle">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import { mapState, mapGetters , mapMutations} from 'vuex'
 	export default {
		data() {
			return {}
		},
		computed: {
			...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsPrice']),
			// 动态绑定全选按钮
			isFullcheck() {
				return this.total === this.checkedCount
			}
		},
		methods: {
			...mapMutations('m_cart', ['updateAllGoodsState']),
			changeAllState() {
				this.updateAllGoodsState(!this.isFullcheck)
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
