<template>
	<view class="">
		<view class="search-box">
			<!-- 使用 uni-ui 提供的搜索组件 -->
			<uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clearHistory"></uni-icons>
			</view>
			<!-- 列表 -->
			<view class="history-list">
				<uni-tag class="uni-tag" v-for="(item,index) in historys" :key="index" :text="item" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null, // 延时器
				kw: '', // 搜索关键字
				searchResults: [], // 搜索结果列表
				historyList: [], // 搜索历史
			};
		},
		methods: {
			// 监听搜索框
			input(e) {
				// 清除 timer 对应的定时器
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.kw = e;
					this.getSearchList()
				}, 500)
			},
			// 获取搜索建议列表
			async getSearchList() {
				// 如果搜索框为空则清空搜索列表
				if (this.kw === '') {
					this.searchResults = []
					return
				}
				// 发起搜索请求
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.kw
				})
				// 如果请求失败 则返回
				if (res.meta.status !== 200) return uni.$showMsg()
				// 数据赋值
				this.searchResults = res.message


				this.saveSearchHistory()
			},
			// 清空历史记录
			clearHistory() {
				this.historyList = [] // 清空搜索记录
				uni.clearStorageSync('kw') // 清空本地搜索记录 
			},
			// 跳转商品详情页面
			gotoDetail(goods_id) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},
			// 保存关键字
			saveSearchHistory() {
				// 1. 将搜索记录转换为集合对象
				const set = new Set(this.historyList)
				// 2. 删除掉已有的记录
				set.delete(this.kw)
				// 3. 添加当前记录 
				set.add(this.kw)
				// 4. 将集合转换为数组 
				this.historyList = Array.from(set)
				// 5. 将搜索记录保存到本地
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			// 跳转搜索历史商品详情页
			gotoGoodsList(kw){
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' +kw
				})
			}
		},
		computed: {
			historys() {
				return [...this.historyList].reverse()
			}
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw' || '[]'))
		}
	}
</script>

<style lang="scss">
	.uni-searchbar {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		position: relative;
		padding: 16rpx;
		background-color: #c00000;
	}

	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-name {
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>
