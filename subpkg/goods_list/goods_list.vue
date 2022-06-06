<template>
	<view>
		<view class="goods-list">
			<block v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(item)">
				<my-goodsitem :goods="goods"></my-goodsitem>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					query: '', // 搜索关键词
					cid: '', // 商品分类ID
					pagenum: 1, // 页码值
					pagesize: 10, // 每页显示多少条数据
				},
				total: 0, // 总页数
				goodsList: [], // 商品列表数据
				isLoding: false, // 节流阀
			};
		},
		onLoad(options) {
			this.queryObj.query = options.query || '';
			this.queryObj.cid = options.cid || '';
			console.log(options);
			this.getGoodsList();
		},
		methods: {
			// 获取商品数据
			async getGoodsList(callback) {
				this.isLoding = true; // 开启节流阀
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj);
				if (res.meta.status !== 200) return uni.$showMsg()
				callback && callback();
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
				this.isLoding = false; // 开启节流阀
			},
			// 监听下拉事件
			onPullDownRefresh() {
				// 将对应数据清空
				this.queryObj.pagenum = 1;
				this.total = 0;
				this.isLoding = false;
				this.goodsList = [];
				
				this.getGoodsList(() => uni.stopPullDownRefresh())
			},
			// 点击跳转到商品详情页面
			gotoDetail(){
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}
		},
		onReachBottom() {
			// 8 * 10 < 90
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
			if (this.isLoding) return
			this.queryObj.pagenum += 1;
			this.getGoodsList();
		}
	}
</script>

<style lang="scss">

</style>
