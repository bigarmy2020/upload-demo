/* ===================================
 * 全局spin(加载中)
 * Created by cjking on 2020/05/03.
 * Copyright 2020, Inc.
 * =================================== */
import store from '@/store';

export const spinService = {
	/**
	 * 开启加载中
	 * @param {Object} options 参数 [可选]
	 * @param {Object} [options.tip='Loading...'] options.tip 描述文案, 默认 "Loading..." [可选]
	 * @param {Object} [options.size='default'] options.size 组件大小, 默认 "default"。可选值为 small default large [可选]
	 * @param {Object} [options.delayTime=200] options.delayTime 延迟加载时间, 默认 200 [可选]
	 */
	open (options = {}) {
		if (Object.keys(options).length) {
			store.dispatch('initSpin', options);
		}
		store.dispatch('openSpin');
	},

	/**
	 * 关闭加载中
	 */
	close () {
		store.dispatch('closeSpin');
	}
};
