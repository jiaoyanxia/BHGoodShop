<template>
	<view>
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
				<block v-for="(item, i) in cateList" :key="i">
					<view @click="activeChanged(i)" :class="['left-scroll-view-item', i === active ? 'active':'']">
						{{item.cat_name}}</view>
				</block>
			</scroll-view>
			<!-- 右侧的滚动视图区域 -->
			<scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2" > 
					<view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
					 <view class="cate-lv3-list">
					      <!-- 三级分类 Item 项 -->
					      <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
					        <!-- 图片 -->
					        <image :src="item3.cat_icon"></image>
					        <!-- 文本 -->
					        <text>{{item3.cat_name}}</text>
					      </view>
					    </view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wh: 0, // 屏幕高度
				cateList: [], // 分类数据
				cateLevel2: [], // 二级分类数据
				active: 0 ,// 选中项的索引
				scrollTop: 0, // 滚动条距离顶部的距离
			};
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync();
			console.log(sysInfo);
			this.wh = sysInfo.windowHeight

			this.getCateList()
		},
		methods: {
			// 获取分类数据
			async getCateList() {
				// 1. 请求分类数据
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				// 2. 判断是否请求成功
				if (res.meta.status !== 200) return uni.$showMsg();
				// 3. 请求完成后数据赋值
				console.log(res);
				this.cateList = res.message
				console.log(res.message[0].children);
				this.cateLevel2 = res.message[0].children
			},
			// 切换分类框选中状态
			activeChanged(i) {
				this.active = i
				this.cateLevel2 = this.cateList[i].children
				
				// 如果为 true - 1 则为 false - 0  
				this.scrollTop = this.scrollTop ? 0 : 1;
			},
			// 三级分类跳转到商品列表页面
			gotoGoodsList(item) {
				console.log(item);
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;
	}

	.scroll-view-container .left-scroll-view {
		width: 120px;
	}

	.scroll-view-container .left-scroll-view .left-scroll-view-item {
		line-height: 60px;
		background-color: #f7f7f7;
		text-align: center;
		font-size: 12px;
	}

	.scroll-view-container .left-scroll-view .left-scroll-view-item.active {
		background-color: #ffffff;
		position: relative;
	}

	.scroll-view-container .left-scroll-view .left-scroll-view-item.active::before {
		content: ' ';
		display: block;
		width: 3px;
		height: 30px;
		background-color: #c00000;
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
	}
	.cate-lv2-title {
	  font-size: 12px;
	  font-weight: bold;
	  text-align: center;
	  padding: 15px 0;
	}
	.cate-lv3-list {
	  display: flex;
	  flex-wrap: wrap;
	
	  .cate-lv3-item {
	    width: 33.33%;
	    margin-bottom: 10px;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	
	    image {
	      width: 60px;
	      height: 60px;
	    }
	
	    text {
	      font-size: 12px;
	    }
	  }
	}
</style>
