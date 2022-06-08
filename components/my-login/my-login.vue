<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<button type="primary" class="btn-login" @click="getUserInfo()">一键登录</button>
		<!-- <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button> -->
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		name: "my-login",
		data() {
			return {};
		},
		computed: {
			...mapState('m_user', ['redirectInfo'])
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			getUserInfo() {
				uni.getUserProfile({
					desc: "获取你的昵称、头像、地区及性别",
					success: (res) => {
						console.log("所有", res)
						// 获取用户信息
						this.updateUserInfo(res.userInfo)
						// 获取Token
						this.getToken(res)
					},
					fail(e) {
						// 取消授权 - 不让登录
						if (e.errMsg === 'getUserProfile:fail auth deny') return uni.$showMsg('您取消了登录授权！')
					}
				})
			},
			// 获取Token数据
			async getToken(info) {
				// 获取微信登录接口
				const [err, res] = await uni.login().catch(err => err)
				// 判断是否登录失败
				if (err || res.errMsg !== "login:ok") return uni.$showError('登录失败！')
				const {
					data: result
				} = await uni.$http.post('/api/public/v1/users/wxlogin', {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				})
				// 跳转回调
				this.navigatedBack()
				console.log("result", result);
				// if (result.meta.status !== 200) return uni.$showMsg('登录失败！')
				// uni.$showMsg('登录成功') - 记录 token接口坏了
				let token =
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
				this.updateToken(token);

			},
			// 跳转到之前的购物车页面
			navigatedBack() {
				console.log(this.redirectInfo);
				if (this.redirectInfo && this.redirectInfo?.openType === 'switchTab') {
					console.log('info', this.redirectInfo.from);
					uni.switchTab({
						url: this.redirectInfo.from, // 要导航到的页面地址
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		// 登录盒子的样式
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;

		// 绘制登录盒子底部的半椭圆造型
		&::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}

		// 登录按钮的样式
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #c00000;
		}

		// 按钮下方提示消息的样式
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>
