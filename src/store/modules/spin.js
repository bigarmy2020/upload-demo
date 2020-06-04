const spin = {
	state: {
		spinning: false,    // 是否为加载中状态
		tip: 'Loading...',  // 当作为包裹元素时，可以自定义描述文案
		size: 'default',    // 组件大小，可选值为 small default large
		delayTime: 200      // 延迟显示加载效果的时间（防止闪烁）
	},

	mutations: {
		UPDATE_STATUS: (state, status) => {
			state.spinning = status;
		},
		INIT_SPIN: (state, options) => {
			state.tip = options ? options.tip : 'Loading...';
			state.size = options ? options.size : 'default';
			state.delayTime = options ? options.delayTime : 200;
		}
	},

	actions: {
		/**
		 * 开启加载中
		 * @param commit
		 *
		 * example:
		 *  import store from '@/store'
		 *  store.dispatch('openSpin');
		 */
		openSpin ({ commit }) {
			commit('UPDATE_STATUS', true);
		},

		/**
		 * 关闭加载中
		 * @param commit
		 * @param delayTime
		 *
		 * example:
		 *  import store from '@/store'
		 *  store.dispatch('closeSpin');
		 */
		closeSpin ({ commit }) {
			commit('UPDATE_STATUS', false);
		},

		/**
		 * 初始化spin
		 * @param commit
		 * @param {Object} options 参数 [可选]
		 * @param {Object} [options.tip='Loading...'] options.tip 描述文案, 默认 "Loading..." [可选]
		 * @param {Object} [options.size='default'] options.size 组件大小, 默认 "default"。可选值为 small default large [可选]
		 * @param {Object} [options.delayTime=200] options.delayTime 延迟加载时间, 默认 200 [可选]
		 *
		 * example:
		 *  import store from '@/store'
		 *  store.dispatch('initSpin'); // 重置为初始态
		 *  store.dispatch('initSpin', { tip: '加载中...' });
		 *  store.dispatch('initSpin', { tip: '加载中...', size: 'large' });
		 *  store.dispatch('initSpin', { tip: '加载中...', size: 'large', delayTime: 200 });
		 */
		initSpin ({ commit }, options = {}) {
			options = Object.assign({
				tip: 'Loading...',  // 描述文案
				size: 'default',    // 组件大小
				delayTime: 200      // 延迟加载时间
			}, options);
			commit('INIT_SPIN', options);
		}
	}
};

export default spin;
