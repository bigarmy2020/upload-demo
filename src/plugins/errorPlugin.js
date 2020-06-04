import { captureException, /*captureMessage,*/ init, setTag } from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import Vue from 'vue';
import * as pkg from '../../package.json';
import { Config } from '@/config';
import { logger } from '@/utils';

/**
 * 全局异常处理
 * @param {*} ret
 */

function isPromise(ret) {
	return (ret && typeof ret.then === 'function' && typeof ret.catch === 'function');
}

const errorHandler = (error, vm, info) => {
	// 指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和 Vue 实例。
	// handle error
	// `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
	// 只在 2.2.0+ 可用
	if (Config.sentry.open && error) {
		captureException(error?.originalError || error);
		logger.error('Capture Global Exception!', error);
	}
};

function registerActionHandle(actions) {
	Object.keys(actions).forEach(key => {
		let fn = actions[key];
		actions[key] = function (...args) {
			let ret = fn.apply(this, args);
			if (isPromise(ret)) {
				return ret.catch(errorHandler);
			} else { // 默认错误处理
				return ret;
			}
		};
	});
}

const registerVuex = (instance) => {
	if (instance.$options['store']) {
		let actions = instance.$options['store']['_actions'] || {};
		if (actions) {
			let tempActions = {};
			Object.keys(actions).forEach(key => {
				tempActions[key] = actions[key][0];
			});
			registerActionHandle(tempActions);
		}
	}
};
const registerVue = (instance) => {
	if (instance.$options.methods) {
		let actions = instance.$options.methods || {};
		if (actions) {
			registerActionHandle(actions);
		}
	}
};

/**
 * 前端错误监控
 */
export const SentryInit = () => {
	logger.log('前端错误监控 init');
	init({
		dsn: Config.sentry.dsn,
		debug: Config.sentry.debug,
		integrations: [new VueIntegration({ Vue, attachProps: true })]
		// integrations: integrations => {
		// 	// 关闭Breadcrumbs集成自动收集console的功能
		// 	return [...integrations, new VueIntegration({ Vue, attachProps: true }), new Integrations.Breadcrumbs({ console: false })];
		// }
	});
	// APPLICATION.NAME: 项目名称
	// PROFILE: 所属于的环境. 一般写死生产
	// ENV_PROJECT_GROUP: 项目所在的机器组
	// ENV_HOST_IP: 详细的机器 ip
	// GIT_TAG: 你项目的 git tag 打包内容.
	// PRODUCTION: 开发环境.
	setTag('APPLICATION.NAME', pkg && pkg.default.name || '');
	setTag('PRODUCTION', `${ Config.production }`);
	// if (window.commit_id) {
	// 	setTag('GIT_TAG', window.commit_id);
	// }
};

const GlobalError = {
	install: (Vue, options) => {
		/**
		 * 全局异常处理
		 * @param {*} vm
		 */
		Vue.config.errorHandler = errorHandler;
		Vue.mixin({
			beforeCreate() {
				registerVue(this);
				registerVuex(this);
			}
		});
		Vue.prototype.$throw = errorHandler;

		SentryInit();
	}
};

export default GlobalError;
