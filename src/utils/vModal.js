import router from '@/router';
import { Modal } from 'ant-design-vue';

const PREFIX = 'v-modal';

/**
 * 验证是否Object对象
 * @param input
 * @returns {boolean}
 */
const isObject = input => typeof input === 'object';

/**
 * 根据类型选择对应Modal
 * @param {String} type
 * @returns {null|Function}
 */
const chooseModalByType = (type) => {
	if (['info', 'success', 'error', 'warning', 'confirm'].includes(type)) {
		return Modal[type];
	}
	return null;
};

export const vModal = {
	/**
	 * 提示弹框(单按钮)
	 * @param {String|Object} message
	 * @param {Object} [options={}] options
	 * @returns {Object}
	 *
	 * example
	 *  vModal.alert({
	 *      content: '未登录或登录已过期', // 内容
	 *		okText: '确定',      		// 确认按钮文字
	 *		onOk: () => {
	 *			console.log('onOk');
	 *		}
	 *	});
	 */
	alert (message, options = {}) {
		if (isObject(message)) {
			options = message;
			message = '';
		}
		options = Object.assign({
			icon: '',                   // 自定义图标
			type: 'info',               // modal类型, 默认值：'info'，可选参数：'info', 'success', 'error', 'warning'
			content: '',                // 内容
			cancelText: '取消',          // 取消按钮文字
			okText: '确认',              // 确认按钮文字
			okType: 'primary',          // 确认按钮类型
			title: '温馨提示',           // 标题
			closable: false,            // 是否显示右上角的关闭按钮
			centered: true,             // 垂直居中展示 Modal
			onCancel: null,             // 取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
			onOk: null,                 // 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
			class: `${ PREFIX }-alert ${ options.closable ? 'close-show' : '' }`    // 容器类名
		}, options);
		return Modal.info(options);
	},

	/**
	 * 确认提示弹框(双按钮)
	 * @param {String|Object} message
	 * @param {Object} [options={}] options
	 * @returns {Object}
	 *
	 * example
	 *  vModal.confirm({
	 *      content: '未登录或登录已过期',     // 内容
	 *		okText: '重新登录',      		// 确认按钮文字
	 *		onCancel: () => {
	 *			console.log('onCancel');
	 *		},
	 *		onOk: () => {
	 *			console.log('onOk');
	 *		}
	 *	});
	 */
	confirm (message, options = {}) {
		if (isObject(message)) {
			options = message;
			message = '';
		}
		options = Object.assign({
			icon: '',                   // 自定义图标
			content: '',                // 内容
			cancelText: '取消',          // 取消按钮文字
			okText: '确认',              // 确认按钮文字
			okType: 'primary',          // 确认按钮类型
			title: '温馨提示',           // 标题
			closable: false,            // 是否显示右上角的关闭按钮
			centered: true,             // 垂直居中展示 Modal
			onCancel: null,             // 取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
			onOk: null,                 // 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
			class: `${ PREFIX }-confirm ${ options.closable ? 'close-show' : '' }`    // 容器类名
		}, options);
		return Modal.confirm(options);
	},

	/**
	 * 提示弹框(ant原生方法)
	 * @param {String|Object} message
	 * @param {Object} [options={}] options
	 * @returns {Object}
	 *
	 * example
	 *  vModal.choose({
	 *      content: '未登录或登录已过期', // 内容
	 *		okText: '确定',      		// 确认按钮文字
	 *		onOk: () => {
	 *			console.log('onOk');
	 *		}
	 *	});
	 */
	choose (message, options = {}) {
		if (isObject(message)) {
			options = message;
			message = '';
		}
		options = Object.assign({
			icon: '',                   // 自定义图标
			type: 'info',               // modal类型, 默认值：'info'，可选参数：'info', 'success', 'error', 'warning'
			content: '',                // 内容
			cancelText: '取消',          // 取消按钮文字
			okText: '确认',              // 确认按钮文字
			okType: 'primary',          // 确认按钮类型
			title: '温馨提示',           // 标题
			closable: false,            // 是否显示右上角的关闭按钮
			centered: true,             // 垂直居中展示 Modal
			onCancel: null,             // 取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
			onOk: null,                 // 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
			class: ''                   // 容器类名
		}, options);
		const type = options.type;
		delete options.type;
		options.class = options.class || `${ PREFIX }-icon icon-${ type }`;
		const fun = chooseModalByType(type);
		return fun ? fun(options) : null;
	},

	/**
	 * 返回上一页
	 * @param {String} message
	 */
	goBack (message) {
		const options = {
			icon: '',                   // 自定义图标
			content: message || '',     // 内容
			okText: '返回上一页',        // 确认按钮文字
			okType: 'primary',          // 确认按钮类型
			title: '温馨提示',           // 标题
			closable: false,            // 是否显示右上角的关闭按钮
			centered: true,             // 垂直居中展示 Modal
			onCancel: null,             // 取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
			onOk: () => router.back(),  // 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
			class: `${ PREFIX }-alert`  // 容器类名
		};
		Modal.info(options);
	}
};
