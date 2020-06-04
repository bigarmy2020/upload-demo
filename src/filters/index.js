/* ===================================
 * 自定义拦截器
 * Created by cjking on 2020/05/02.
 * Copyright 2020, Inc.
 * =================================== */
import Vue from 'vue';
import { formatDate } from '../utils';

/**
 * 转人民币
 * @param num 数值
 * @param places 单位 'yuan' | 'angle' | 'points'
 * @returns {number}
 */
export const CurrencyPipe = (num, places = 'yuan') => Number(num || 0) / (places === 'yuan' ? 100 : (places === 'angle' ? 10 : 1));
Vue.filter('CurrencyPipe', CurrencyPipe);

/**
 * 将number数值转化成为货币格式
 * @param num
 * @param places 保留小数位数
 * @param symbol 货币符号 ($、￥、€、￡、₣、¥、₩)
 * @param thousand 整数部分千位分隔符
 * @param decimal 小数分隔符
 * @returns {string}
 */
export const formatMoney = (num, places, symbol, thousand, decimal) => {
	num = num || 0;
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol ? symbol : '';
	thousand = thousand || ',';
	decimal = decimal || '.';
	let negative,
		i,
		j;
	negative = num < 0 ? '-' : '';
	i = parseInt(num = Math.abs(+num || 0).toFixed(places), 10) + '';
	j = (j = i.length) > 3 ? j % 3 : 0;
	return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(num - i).toFixed(places).slice(2) : '');
};
Vue.filter('formatMoney', formatMoney);

/**
 * 时间转换管道
 * @param time
 * @param format
 * @returns {string}
 */
export const DatePipe = (time, format) => formatDate(time, format);
Vue.filter('DatePipe', DatePipe);

/**
 * 清理空值，对象
 * @param children
 * @returns {*[]}
 */
export const filterEmpty = (children = []) => children.filter(c => c.tag || (c.text && c.text.trim() !== ''));
Vue.filter('filterEmpty', filterEmpty);

/**
 * 字符串超长截取省略号显示
 * @param value
 * @param length
 * @returns {string}
 */
export const ellipsis = (value, length = 25) => {
	if (!value) {
		return '';
	}
	if (value.length > length) {
		return value.slice(0, length) + '...';
	}
	return value;
};
Vue.filter('ellipsis', ellipsis);

/**
 * 字符串处理(将整数部分逢三一断)
 * @param value
 * @returns {string}
 */
export const NumberFormat = (value) => {
	if (!value) {
		return '0';
	}
	return value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
};
Vue.filter('NumberFormat', NumberFormat);

/**
 * json字符串输出
 * @param {Object|Array} value
 * @returns {String}
 */
export const Json = (value) => {
	if (typeof value !== 'object') {
		return value;
	}
	return JSON.stringify(value);
};
Vue.filter('Json', Json);

/**
 * join字符串拼接
 * @param {Array} list
 * @param {String} separator    分隔符
 * @returns {String}
 */
export const Join = (list, separator = ',') => {
	if (!Array.isArray(list)) {
		return list;
	}
	return list.join(separator);
};
Vue.filter('Join', Join);

/**
 * 回显字典
 * @param {String} fieldValue   比较(条件)字段值
 * @param {Array} list          字典列表
 * @param {String} fieldKey     比较(条件)字段key
 * @param {String} echoKey      回显字段key
 * @returns {String}
 */
export const EchoDict = (fieldValue, list = [], fieldKey = 'value', echoKey = 'title') => {
	const item = list.find(item => item && String(item[fieldKey]) === String(fieldValue));
	return item ? item[echoKey] : '';
};
Vue.filter('EchoDict', EchoDict);
