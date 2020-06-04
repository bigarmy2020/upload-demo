<template>
	<a-config-provider :locale="locale">
		<div id="app">
			<router-view />
		</div>
	</a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import enquireScreen from '@/utils/device';
import { STORE_DATA } from '@/constant';

export default {
	data () {
		return {
			locale: zhCN,
			deviceConfMap: {
				0: () => { // tablet
					this.$store.commit('TOGGLE_DEVICE', 'mobile');
					this.$store.dispatch('setSidebar', false);
				},
				1: () => { // mobile
					this.$store.commit('TOGGLE_DEVICE', 'mobile');
					this.$store.dispatch('setSidebar', false);
				}
			}
		};
	},
	created () {
		if (sessionStorage.getItem('store')) {   // 页面加载前读取sessionStorage里的状态信息
			try {
				this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem(STORE_DATA))));
			} catch (e) {
			}
		}

		/**
		 * 监听浏览器关闭和刷新事件
		 */
		window.addEventListener('beforeunload', () => {   // 在页面刷新前将vuex里的信息保存到sessionStorage里
			sessionStorage.setItem(STORE_DATA, JSON.stringify(this.$store.state));
		});

		enquireScreen(deviceType => {
			const fun = this.deviceConfMap[deviceType];
			if (fun) {
				fun();
			} else {
				this.$store.commit('TOGGLE_DEVICE', 'desktop');
				this.$store.dispatch('setSidebar', true);
			}
		});
	}
};
</script>
<style>
#app {
	height: 100%;
}
</style>
