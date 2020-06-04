import Cookies from 'js-cookie';
import { baseValidate } from '@/utils/validate';
import store from '@/store';

/**
 * 获取url参数
 * @param key 可选
 * @param url 可选
 */
export const getUrlParams = (key, url) => {
	url = url || window.location.href;
	const params = {};
	url.replace(/([^?&]+)=([^?&]+)/g, (s, v, k) => {
		params[decodeURIComponent(v)] = decodeURIComponent(k);
		return k + '=' + v;
	});
	return (key ? params[key] : params) || '';
};

/**
 * 判断是否微信平台
 * @returns {boolean}
 */
export const isWeiXin = () => /micromessenger/i.test(navigator.userAgent);

/**
 * 空对象验证
 * @param obj
 * @returns {boolean}
 */
export const isEmptyObject = (obj) => {
	if (!obj) return true;
	if (typeof obj !== 'object') return true;
	for (let t in obj) return false;
	return true;
};

/**
 * 去除左右空格
 */
export const trim = (str) => {
	if (!str || typeof str !== 'string') return str;
	return str.replace(/^\s+|\s+$/g, '');
};

/**
 * 空判断
 * @param args
 * @return {boolean}
 */
export const isEmpty = (args) => args === null || args === undefined || args === '';

/**
 * 判断是否数字
 */
export const isNumber = (args) => /^[0-9]*$/.test(trim(args));

/**
 * 转换为number
 */
export const toNumber = (num) => {
	if (typeof num === 'number') return num;
	if (num && /^[0-9].*$/.test(num)) {
		return Number(num);
	}
	return null;
};

/**
 * 设置cookie
 * @param key
 * @param value
 * @param maxTime   过期时间(天)
 * @return {*}
 */
export const setCookie = (key, value, maxTime) => Cookies.set(key, value, maxTime ? { expires: maxTime } : '');

/**
 * 获取cookie
 * @param key
 * @return {*}
 */
export const getCookie = (key) => Cookies.get(key);

/**
 * 删除cookie
 * @param name
 */
export const removeCookie = (name) => {
	const cookie = getCookie(name);
	if (cookie !== null) {
		Cookies.remove(name);
	}
};

/**
 * 删除当前域名下的所有cookie
 */
export const removeAllCookie = () => {
	const keys = document.cookie.match(/[^ =;]+(?==)/g);
	if (keys) {
		for (let i = keys.length; i--;) {
			document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();
			document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();
		}
	}
};

/**
 * 清除用户登录数据
 */
export const clearUserData = () => store.dispatch('ClearLoginData');

/**
 * 文件转base64
 * @param {File|Blob} file
 * @returns {Promise<string>}
 */
export function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

/**
 * 文件转text
 * @param {File|Blob} file
 * @returns {Promise<string>}
 */
export function getText(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsText(file, 'utf8');
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

/**
 * 文件十六进制转换
 * @param {File|Blob} file
 * @returns {Promise<Array<string>>}
 */
export const getHex = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onload = () => {
			let u = new Uint8Array(reader.result),
				a = new Array(u.length),
				i = u.length;
			while (i--) // map to hex
				a[i] = (u[i] < 16 ? '0' : '') + u[i].toString(16);
			u = null; // free memory
			resolve(a);
		};
		reader.onerror = error => reject(error);
	});
};

/**
 * 判断是否rar压缩文件
 * 判断文件头 rar的文件头前4个字节为52617221
 * @param {File|Blob} file
 * @returns {Promise<boolean>}
 */
export const isRar = (file) => {
	return new Promise(async resolve => {
		const hexArray = await getHex(file);
		const res = hexArray?.slice(0, 4);
		resolve(res.join('') === '52617221');
	});
};

/**
 * 将base64转换为文件
 * @param base64     base64字符串
 * @param type       mime类型
 */
export const base64ToBlob = (base64, type) => {
	const arr = base64.split(',');
	const mime = arr[0].match(/:(.*?);/)[1] || type;
	// 去掉url的头，并转化为byte
	const bytes = window.atob(arr[1]);
	// 处理异常,将ascii码小于0的转换为大于0
	const ab = new ArrayBuffer(bytes.length);
	// 生成视图（直接针对内存）：8位无符号整数，长度1个字节
	const ia = new Uint8Array(ab);
	for (let i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
	}
	return new Blob([ab], { type: mime });
};

/**
 * 获取自定义id
 * @param count
 * @returns {string}
 */
export const getCustomId = (count) => {
	count = count || 6;
	let id = '';
	for (let i = 0; i < count; i++) {
		id += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return id;
};

/**
 * 可用于判断是否成功
 * @type {symbol}
 */
export const succeedSymbol = Symbol();

/**
 * 可用于判断是否失败
 * @type {symbol}
 */
export const failedSymbol = Symbol();

/**
 * 使 promise 无论如何都会 resolve，除非传入的参数不是一个Promise对象或返回Promise对象的方法
 * 一般用在 Promise.all 中
 *
 * @param promise 可传Promise对象或返回Promise对象的方法
 * @returns {Promise<any>}
 */
export function alwaysResolve(promise) {
	return new Promise((resolve, reject) => {
		let p = promise;
		if (typeof promise === 'function') {
			p = promise();
		}
		if (p instanceof Promise) {
			p.then(data => {
				resolve({ type: succeedSymbol, data });
			}).catch(error => {
				resolve({ type: failedSymbol, error });
			});
		} else {
			reject('alwaysResolve: 传入的参数不是一个Promise对象或返回Promise对象的方法');
		}
	});
}

/**
 * 防抖函数 (如果一个函数持续地触发，那么只在它结束后过一段时间只执行一次)
 * @param func 传入函数
 * @param wait 表示时间窗口的间隔
 * @param immediate 是否立即触发
 * @return {Function}
 */
export const debounce = (func, wait, immediate) => {
	let timeout;
	return function () {
		/*eslint no-invalid-this: "off"*/
		const self = this;
		// 参数转为数组
		let args = Array.prototype.slice.call(arguments);
		return new Promise(function (resolve) { // 返回一个promise对象
			if (timeout) {
				clearTimeout(timeout);
			}
			if (immediate) {
				const callNow = !timeout;
				timeout = setTimeout(function () {
					timeout = null;
				}, wait);
				if (callNow) {
					resolve(func.apply(self, args)); //值操作
				}
			} else {
				timeout = setTimeout(function () {
					resolve(func.apply(self, args));
				}, wait);
			}
		});
	};
};

/**
 * 节流函数 (如果一个函数持续的，频繁地触发，那么让它在一定的时间间隔后再触发)
 * @param func 传入函数
 * @param wait 表示时间窗口的间隔
 * @return {Function}
 */
export const throttle = (func, wait) => {
	let timeout;
	return function () {
		const context = this;
		const args = arguments;
		if (!timeout) {
			timeout = setTimeout(function () {
				func.apply(context, args);
				timeout = null;
			}, wait);
		}
	};
};

/**
 * 对象合并
 * @param {Object} source
 * @param {Object} target
 * @param {Array<string>} [exclude=] exclude
 * @returns {Object}
 */
export const extend = (source, target, exclude = []) => {
	for (const prop in source) {
		if (Object.prototype.hasOwnProperty.call(source, prop) && Object.prototype.hasOwnProperty.call(source, prop) && !exclude.includes(prop)) {
			source[prop] = target[prop];
		}
	}
	return source;
};

/**
 * 将当前时间换成时间格式字符串
 * @param time      时间戳
 * @param format    格式
 * @param options   可选项
 * @param options.firstDayOfMonth   获取当月第一天
 * @param options.firstDayOfSeason  获取当季第一天
 * @param options.firstDayOfYear    获取当年第一天
 * @returns {string}
 *
 * 将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 * 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 *    (Common.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2018-07-02 08:09:04.423
 *    (Common.formatDate(new Date(), "yyyy-MM-dd E HH:mm:ss") ==> 2018-03-10 二 20:09:04
 *    (Common.formatDate(new Date(), "yyyy-MM-dd EE hh:mm:ss") ==> 2018-03-10 周二 08:09:04
 *    (Common.formatDate(new Date(), "yyyy-MM-dd EEE hh:mm:ss") ==> 2018-03-10 星期二 08:09:04
 *    (Common.formatDate(new Date(), "yyyy-M-d h:m:s.S") ==> 2018-7-2 8:9:4.18
 */
export const formatDate = (time, format = 'yyyy-MM-dd', options) => {
	time = time || new Date();
	let date;
	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(time)) {
		date = new Date(time);
	} else if (/^[0-9]*$/.test(time)) {
		date = new Date(Number(time));
	} else if (typeof time === 'string' && time.includes(' ') && time.includes('-')) {
		date = new Date(time.replace(/-/g, '/'));
	} else if (typeof time === 'string' && (time.includes('年') || time.includes('月') || time.includes('日'))) {
		date = new Date(time.replace(/[年月日]/g, '/'));
	} else {
		date = new Date(time);
	}
	if (options) {
		// 获取当月第一天
		if (options.firstDayOfMonth) {
			return date.setDate(1) && formatDate(date, format);
		}
		// 获取当季第一天
		if (options.firstDayOfSeason) {
			const month = date.getMonth();
			if (month < 3) {
				date.setMonth(0);
			} else if (month > 2 && month < 6) {
				date.setMonth(3);
			} else if (month > 5 && month < 9) {
				date.setMonth(6);
			} else if (month > 8 && month < 11) {
				date.setMonth(9);
			}
			date.setDate(1);
			return formatDate(date, format);
		}
		// 获取当年第一天
		if (options.firstDayOfYear) {
			return date.setDate(1) && date.setMonth(0) && formatDate(date, format);
		}
		// 获取本周第一天
		if (options.firstWeekOfDay) {
			let weekday = date.getDay() || 7; // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
			date.setDate(date.getDate() - weekday + 1);//往前算（weekday-1）天，年份、月份会自动变化
			return formatDate(date, format);
		}
	}
	const dateObj = {
		'M+': date.getMonth() + 1, // 月份
		'd+': date.getDate(), 		// 日
		'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
		'H+': date.getHours(), 	// 小时
		'm+': date.getMinutes(), 	// 分
		's+': date.getSeconds(), 	// 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		'S+': date.getMilliseconds() // 毫秒
	};
	const week = {
		0: '\u65e5',
		1: '\u4e00',
		2: '\u4e8c',
		3: '\u4e09',
		4: '\u56db',
		5: '\u4e94',
		6: '\u516d'
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(format)) {
		format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + '']);
	}
	for (const k in dateObj) {
		if (Object.prototype.hasOwnProperty.call(dateObj, k) && new RegExp('(' + k + ')').test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? dateObj[k] : ('00' + dateObj[k]).substr(('' + dateObj[k]).length));
		}
	}
	return format;
};

/**
 * 对象深拷贝
 * @param {Object} obj
 * @returns {null|*}
 */
export const deepCopy = (obj) => {
	if (obj === null) return null;
	let result;
	// 判断是否是简单数据类型
	if (typeof obj === 'object') {
		// 复杂数据类型
		result = obj.constructor === Array ? [] : {};
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				result[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
			}
		}
	} else {
		// 简单数据类型,直接赋值
		result = obj;
	}
	return result;
};

/**
 * 优雅的处理 async/await
 * @param asyncFunc
 * @return {Promise<*[]>}
 */
export const errorCaptured = async (asyncFunc) => {
	try {
		const res = asyncFunc instanceof Promise ? await asyncFunc : await asyncFunc();
		return [null, res];
	} catch (e) {
		return [e, null];
	}
};

/**
 * 判断是否为base64字符串
 * @param {String} str
 */
export const isBase64 = (str) => {
	const base64Pattern = '^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$';
	if (/^data:image/.test(str)) return true;
	return !!str.match(base64Pattern);
};

/**
 * 中横线(下划线)转换驼峰
 * @param {String} str
 * @returns {*}
 */
export const camelCase = (str) => {
	return str.replace(/([:\-_]+(.))/g, (_, separator, letter, offset) => offset ? letter.toUpperCase() : letter)
		.replace(/^moz([A-Z])/, 'Moz$1');
};

/**
 * 首字母大写
 * @param str
 * @returns {string}
 */
export const firstUpperCase = (str) => str.toString()[0].toUpperCase() + str.toString().slice(1);

/**
 * 驼峰转换下划线
 * @param {String} str
 * @returns {string}
 */
export const camelcaseToHyphen = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * 驼峰转换中横线
 * @param {String} str
 * @returns {string}
 */
export const camelcaseToUnderline = (str) => str.replace(/([a_z])([A_Z])/g, '$1_$2').toLowerCase();

/**
 * 判断是否为Trident内核浏览器(IE等)
 */
export const browserIsIe = () => !!window.ActiveXObject || 'ActiveXObject' in window;

/**
 * 获取字符串的长度ascii长度为1 中文长度为2
 * @param str
 * @returns {number}
 */
export const getStrFullLength = (str = '') =>
	str.split('').reduce((pre, cur) => {
		const charCode = cur.charCodeAt(0);
		if (charCode >= 0 && charCode <= 128) {
			return pre + 1;
		}
		return pre + 2;
	}, 0);

/**
 * 给定一个字符串和一个长度,将此字符串按指定长度截取
 * @param str
 * @param maxLength
 * @returns {string}
 */
export const cutStrByFullLength = (str = '', maxLength) => {
	let showLength = 0;
	return str.split('').reduce((pre, cur) => {
		const charCode = cur.charCodeAt(0);
		if (charCode >= 0 && charCode <= 128) {
			showLength += 1;
		} else {
			showLength += 2;
		}
		if (showLength <= maxLength) {
			return pre + cur;
		}
		return pre;
	}, '');
};

/**
 * 触发 window.resize
 */
export const triggerWindowResizeEvent = () => {
	const event = document.createEvent('HTMLEvents');
	event.initEvent('resize', true, true);
	event.eventType = 'message';
	window.dispatchEvent(event);
};

export const welcome = () => {
	const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了'];
	const index = Math.floor((Math.random() * arr.length));
	return arr[index];
};

export const timeFix = () => {
	const time = new Date();
	const hour = time.getHours();
	return hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好')));
};

/**
 * 随机生成数字
 *
 * 示例：生成长度为 12 的随机数：randomNumber(12)
 * 示例：生成 3~23 之间的随机数：randomNumber(3, 23)
 *
 * @param1 最小值 | 长度
 * @param2 最大值
 * @return int 生成后的数字
 */
export function randomNumber(...args) {
	// 生成 最小值 到 最大值 区间的随机数
	const random = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};
	if (args.length === 1) {
		let [length] = args;
		// 生成指定长度的随机数字，首位一定不是 0
		let nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)));
		return parseInt(nums.join(''));
	} else if (args.length >= 2) {
		let [min, max] = args;
		return random(min, max);
	} else {
		return Number.NaN;
	}
}

/**
 * 随机生成字符串
 * @param {Number} length 字符串的长度
 * @param {String} [chats] chats 可选字符串区间（只会生成传入的字符串中的字符）
 * @return string 生成的字符串
 */
export function randomString(length, chats) {
	if (!length) length = 1;
	if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm';
	let str = '';
	for (let i = 0; i < length; i++) {
		let num = randomNumber(0, chats.length - 1);
		str += chats[num];
	}
	return str;
}

/**
 * 随机生成uuid
 * @return string 生成的uuid
 */
export function randomUUID() {
	let chats = '0123456789abcdef';
	return randomString(32, chats);
}

/**
 * 如果值不存在就 push 进数组，反之不处理
 * @param array 要操作的数据
 * @param value 要添加的值
 * @param key 可空，如果比较的是对象，可能存在地址不一样但值实际上是一样的情况，可以传此字段判断对象中唯一的字段，例如 id。不传则直接比较实际值
 * @returns {boolean} 成功 push 返回 true，不处理返回 false
 */
export function pushIfNotExist(array, value, key) {
	for (let item of array) {
		if (key && (item[key] === value[key])) {
			return false;
		} else if (item === value) {
			return false;
		}
	}
	array.push(value);
	return true;
}

/**
 * 创建一个从 object 中选中的属性的对象。
 * @param {Object} obj
 * @param {Array<String>|String} keys
 * @returns {{}}
 */
export const pick = (obj, ...keys) => {
	if (keys.length === 1 && keys[0] instanceof Array) {
		keys = keys[0];
	}
	const result = {};
	for (const key of keys) {
		result[key] = obj[key];
	}
	return result;
};

/**
 * 删除对象中值为空的属性（null、undefined、''）
 * @param {Object} obj       参数对象
 * @param {Array<*>} includes  包含值属性，一并删除
 * @returns {object}
 */
export const deleteNullAttr = (obj, includes = []) => {
	const newObj = deepCopy(obj);
	for (const propName in newObj) {
		if (newObj.hasOwnProperty(propName)) {
			if (newObj[propName] && newObj[propName] instanceof Object) {
				const values = Object.values(newObj[propName]);
				const results = values.filter(value => isEmpty(value) || includes.includes(value));
				if (!results.length && includes.length) {
					delete newObj[propName];
				} else {
					deleteNullAttr(newObj[propName], includes);
				}
			} else if (isEmpty(newObj[propName])) {
				delete newObj[propName];
			}
		}
	}
	return newObj;
};

/**
 * 判断是否同一天
 * @param {String|number} timeStampA
 * @param {String|number} timeStampB
 * @returns {boolean}
 */
export function isSameDay(timeStampA, timeStampB) {
	const dateA = new Date(timeStampA);
	const dateB = new Date(timeStampB);
	return dateA.setHours(0, 0, 0, 0) === dateB.setHours(0, 0, 0, 0);
}

/**
 * 是否modal右上角的x取消
 * @param element
 * @returns {boolean|boolean}
 */
export const isCloseBtn = (element) => {
	return (element.target.tagName === 'svg' && element.target.dataset === 'close') ||
		element.target.classList.contains('ant-modal-close-x') ||
		(element.path?.length > 3 && element.path[2].classList.contains('ant-modal-close-icon') || element.path[2].classList.contains('ant-modal-close-x'));
};

/**
 * 对象转换为url参数
 * @param {Object} data
 * @returns {string}
 */
export const toUrlString = (data) => {
	const result = [];
	for (let key in data) {
		const value = data[key];
		if (value.constructor === Array) {
			value.forEach(val => result.push(encodeURIComponent(key) + '=' + encodeURIComponent(val)));
		} else {
			result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
		}
	}
	return result.join('&');
};

/**
 * 获取文件名
 * @param {String} str
 * @returns {string}
 */
export const basename = (str = '') => {
	if (!str) return '';
	let idx = str.lastIndexOf('/');
	idx = idx > -1 ? idx : str.lastIndexOf('\\');
	if (idx < 0) {
		return str;
	}
	return str.substring(idx + 1);
};

/**
 * 获取文件扩展名
 * @param {String} filename
 * @returns {string}
 */
export const getFileExtensionName = (filename) => {
	if (!filename) return '';
	// 文件扩展名匹配正则
	const reg = /\.[^.]+$/;
	const matches = reg.exec(filename);
	if (matches) {
		return matches[0];
	}
	return '';
};

/**
 * 字符串转boolean
 * @param boolStr
 * @returns {boolean}
 */
export const toBoolean = boolStr => boolStr === 'false';

/**
 * 模糊查询格式化
 * @param param
 * @returns {*}
 */
export const fuzzyFormat = (param) => {
	// 模糊查询
	for (let key in param) {
		if (Object.prototype.hasOwnProperty.call(param, key)) {
			if (key.match(/_fuzzy$/)) {
				const innerKey = key.replace(/_fuzzy$/, '');
				if (param[key]) {
					param[innerKey] = '*' + param[key] + '*';
				} else {
					param[innerKey] = param[key];
				}
				delete param[key];
			}
		}
	}
	return param;
};
