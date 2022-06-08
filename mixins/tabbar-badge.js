import { mapGetters } from 'vuex'
// 该模块用于在其他页面显示徽标
export default {
  computed: {
    ...mapGetters('m_cart', ['total'])
  },
  // 首次渲染时更新
  onShow() {
    this.setBadge()
  },
  // 每次渲染时更新
  watch:{
	total(){
		this.setBadge()
	}
  },
  methods: {
    setBadge() {
      uni.setTabBarBadge({
        index: 2,
        text: this.total + ''
      })
    }
  }
}
