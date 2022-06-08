import { mapGetters } from 'vuex'
// 该模块用于在其他页面显示徽标
export default {
  computed: {
    ...mapGetters('m_cart', ['total'])
  },
  onShow() {
    this.setBadge()
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
