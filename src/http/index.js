/* ===================================
 * http请求封装
 * Created by cjking on 2020/05/02.
 * Copyright 2020, Inc.
 * =================================== */
import Vue from 'vue';
import axios from 'axios';
import router from '../router';
import { IMessage } from './message';
import { Config } from '../config';
import { Base64Crypt, isEmpty, isEmptyObject, isNumber, vModal } from '../utils';
import { spinService } from '@/utils/spin';
import { ACCESS_TOKEN, USER_INFO } from '@/store/mutation-types';
import { clearUserData, randomString, toUrlString } from '@/utils';
import { Crypt } from '@/utils/crypt/crypt';
import { configureScope } from '@sentry/browser';
import { notification } from 'ant-design-vue';

let isLoginWarned = false;
let timestampServer = Date.now();
let timestampClient = Date.now();
const headerEncryptStr = 'love';

/**
 * 默认参数
 */
const defaultOptions = {
	method: 'get',              // 请求方法类型
	url: '',                    // 请求地址
	timeout: 40000,             // 请求超时时间（毫秒）40s
	headers: {},                // 头信息
	localUrl: false,            // 是否本地url，false: 根据配置文件 url会被重写, true: url保持原样不变
	params: null,               // 参数(get类型)
	data: null,                 // 参数(body类型)
	interceptRes: true,         // 是否开启统一错误处理
	isEncrypt: false,  	        // 是否加密传输数据
	cache: false,               // 是否开启缓存
	reportProgress: false,      // 是否开启进度条
	fileName: '',  		        // 文件名
	loading: true,		        // 是否开启loading状态
	withCredentials: false,	    // 是否携带cookie信息
	clipResponseData: false,    // 修剪请求返回的数据(即：去掉最外层的data包装,直接返回内部数据)
	responseType: 'json'	    // 响应格式: 可选项 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
};

/**
 * 格式化url
 */
export function formatUrl(url) {
	let baseUrl = '';
	url = url.replace(/\/\//g, '/');
	if (Config.basePath) {
		baseUrl = Config.basePath;
		if (baseUrl.endsWith('/')) { // 判断是否作为结尾
			baseUrl = baseUrl.substring(0, baseUrl.length - 1);
		}
	}
	if (url && !url.startsWith('/')) { // 判断当前字符串是否以 "/" 作为开头
		baseUrl += '/';
	}
	baseUrl += url;
	return baseUrl;
}

/**
 * 获取token
 * @returns {string}
 */
const getToken = () => Vue.ls.get(ACCESS_TOKEN) || '';

/**
 * 获取头信息
 * @param {Object} [options=] options
 */
const getHeaders = (options = {}) => {
	const defaultHeaders = {
		'X-Access-Token': getToken(),
		'X-From-Source': 'pc'  // 固定来源
	};
	if (options && options.headers && typeof options.headers === 'object') {
		const headers = options.headers;
		for (const key in headers) {
			if (key && Object.prototype.hasOwnProperty.call(headers, key)) {
				defaultHeaders[key] = headers[key];
			}
		}
	}
	return defaultHeaders;
};

/**
 * 处理请求结果
 * @param {Object} result
 * @param {Boolean} publicCall 是否外部(公共)调用
 */
export const handleResponse = (result, publicCall = false) => {
	result = publicCall && result && result.data ? result.data : result;
	let message = '';
	if (!result) {
		message = '网络繁忙,未返回数据';
	} else {
		message = result.message ? result.message : (result.msg ? result.msg : (result.code ? '网络繁忙,未返回MSG' : '网络繁忙,未返回CODE'));
	}
	if (result && [IMessage.UserNotLogin.code].includes(result.code) || ([IMessage.TokenExpired.code].includes(result.code) && result.message === IMessage.TokenExpired.msg)) {
		if (!isLoginWarned) noLoginIntercept();
	} else {
		notification?.error({ message: '温馨提示', description: message });
	}
};

/**
 * 拦截非200请求响应
 * @param result
 */
const interceptResponse = (result) => {
	if (result && isNumber(result.code)) {
		result.code = Number(result.code);
	}
	if (!result || (result.code !== IMessage.OK.code && result.code !== IMessage.Success.code)) {
		handleResponse(result);
		return null;
	}
	return result;
};

/**
 * 未登录拦截
 * @param {function} [cancelCallback=] cancelCallback   自定义取消回调函数
 * @param {function} [confirmCallback=] confirmCallback 自定义确认回调函数
 */
export const noLoginIntercept = (cancelCallback, confirmCallback) => {

	isLoginWarned = true;
	setTimeout(() => isLoginWarned = false, 500);

	if (window.location.pathname !== '/user/login') {
		vModal.confirm({
			title: '温馨提示',
			content: '登录已过期，请重新登录',
			okText: '重新登录',
			onCancel: () => {
				if (cancelCallback) {
					if (typeof cancelCallback === 'function') {
						cancelCallback();
					}
				}
			},
			onOk: async () => {
				if (confirmCallback) {
					if (typeof confirmCallback === 'function') {
						confirmCallback();
					}
				} else {
					clearUserData(); // 清理过期数据
					return router.push('/user/login');
				}
			}
		});
	} else {
		return clearUserData(); // 清理过期数据
	}
};

/**
 * 处理请求错误
 * @param error
 */
export const handleError = (error) => {
	let message = error.message || '';
	if (error.status === 400) {
		message = '请求无效 (Bad request)';
	}
	if (error.status === 404) {
		message = '请检查URL，以确保路径正确';
	}
	if (message.includes('Unknown Error')) message = '';
	// 超时处理
	if (String(error).includes('timeout') || error.hasOwnProperty('name') && error.name === 'TimeoutError') {
		message = '请求超时';
	}
	if (message?.toLowerCase() === IMessage.TokenExpired.msg.toLowerCase() && error.status === IMessage.TokenExpired.code) {
		if (!isLoginWarned) noLoginIntercept();
		return;
	}
	notification?.error({ message: '温馨提示', description: message });
};

const request = (method, url, params, options = {}) => {
	const sourceUrl = url || '';
	return new Promise(async (resolve, reject) => {
		params = params || {};
		url = (/^https?/.test(url) || options.localUrl) ? url : formatUrl(url);
		options.headers = getHeaders(options);
		options = Object.assign({ ...defaultOptions }, options, { method, url });
		if (options.isEncrypt) {
			const { encryptData, signatureData } = await getEncryptData(params);
			params = encryptData;
			options.headers = signatureData;
		}
		if (!options.cache) {
			params._ = Date.now();
		}
		if (method === 'delete' || method === 'get') {
			if (!isEmptyObject(params)) {
				options.params = params;
			}
		} else {
			if (!isEmptyObject(params)) {
				const contentType = options.headers['Content-Type'];
				if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
					options.data = toUrlString(params);
				} else {
					options.data = params;
				}
			}
		}
		if (options.loading) spinService.open();
		axios.request(options).then(response => {
			if (options.loading) spinService.close();
			if (response && response.data) {
				if (isNumber(response.data.code)) {
					response.data.code = parseInt(response.data.code, 10);
				}
				if (isNumber(response.data.errcode)) {
					response.data.errcode = parseInt(response.data.errcode, 10);
				}
			}

			updateTimestamp(response);

			// 对返回结果统一处理
			if (options.interceptRes) {
				if (interceptResponse(response.data)) {
					return resolve(options.clipResponseData ? (response.data && !isEmpty(response.data?.result) ? response.data.result : response.data) : response.data);
				} else {
					setSentryExtra(sourceUrl, params, response);
					return reject('NetWork Error');
				}
			} else {
				if (response?.data?.code !== IMessage.OK.code) {
					setSentryExtra(sourceUrl, params, response);
				}
				return resolve(response.data);
			}
		}).catch(error => {
			setSentryExtra(sourceUrl, params);
			if (options.loading) spinService.close();
			if (options.interceptRes) handleError(error);
			reject(error);
		});
	});
};

/**
 * 保存最近一次服务器时间
 * @param res
 */
const updateTimestamp = (res) => {
	if (res && res.headers) {
		timestampServer = new Date(res?.headers?.date).getTime();
		timestampClient = new Date().getTime();
	}
};

/**
 * 获取加密数据
 */
const getEncryptData = async (bodyParams) => {
	const timestamp = timestampServer + (new Date().getTime() - timestampClient);
	const token = getToken();
	const pkgInfo = await import('../../package.json'); // 有缓存机制，只会加载一次
	const signatureData = {
		[`X-${ headerEncryptStr }-Version`]: pkgInfo.version,
		[`X-${ headerEncryptStr }-Timestamp`]: timestamp.toString(),
		[`X-${ headerEncryptStr }-Expire`]: '10000', // 10s, headers 的值必须为字符串类型
		[`X-${ headerEncryptStr }-Nonce`]: randomString(6)
	};
	if (token) { // 登录后的操作需要token认证
		signatureData[`X-${ headerEncryptStr }-Token`] = token;
	}
	const values = Object.values(signatureData).sort();
	let str = '';
	for (const value of values) {
		str += value;
	}
	const signature = Crypt.sha1(str).slice(16, 32);
	signatureData[`X-${ headerEncryptStr }-Check`] = '1'; // 是否进行加密处理, '0' : 表示未加密，'1' : 表示已加密
	return { signatureData, encryptData: { cipherText: Base64Crypt.encrypt(Crypt.encrypt(bodyParams, signature)) } };
};

/**
 * 设置附加数据（日志记录）
 * @param {String} sourceUrl
 * @param {Object} params
 * @param {Object} [res=] res
 */
const setSentryExtra = (sourceUrl, params, res) => {
	configureScope(scope => {
		// 设置附加数据
		scope.setExtra('request', params);
		if (res) {
			scope.setExtra('response', res);
		}
		const userInfo = Vue.ls.get(USER_INFO) || {};
		scope.setUser({
			userId: String(userInfo.id),
			username: userInfo.name,
			realName: userInfo.realname,
			email: userInfo.email,
			avatar: userInfo.avatar,
			createTime: userInfo.createTime,
			phone: userInfo.phone
		});
	});
};

/**
 * get方法
 * @param {String} url 接口地址
 * @param {Object} [params=] params 参数 [可选]
 * @param options 参数 [可选]
 * @returns {Promise}
 */
export const get = (url, params, options) => request('get', url, params, options);

/**
 * post请求
 * @param {String} url 接口地址
 * @param {Object} [params=] params 参数 [可选]
 * @param options 参数 [可选]
 * @returns {Promise}
 */
export const post = (url, params, options) => request('post', url, params, options);

/**
 * patch请求
 * @param {String} url 接口地址
 * @param {Object} [params=] params 参数 [可选]
 * @param options 参数 [可选]
 * @returns {Promise}
 */
export const patch = (url, params, options) => request('patch', url, params, options);

/**
 * put请求
 * @param {String} url 接口地址
 * @param {Object} [params=] params 参数 [可选]
 * @param options 参数 [可选]
 * @returns {Promise}
 */
export const put = (url, params, options) => request('put', url, params, options);

/**
 * delete请求
 * @param {String} url 接口地址
 * @param {Object} [params=] params 参数 [可选]
 * @param options 参数 [可选]
 * @returns {Promise}
 */
export const del = (url, params, options) => request('delete', url, params, options);
