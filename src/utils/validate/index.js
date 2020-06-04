/* ===================================
 * 校验规则
 * Created by cjking on 2020/05/02.
 * Copyright 2020, Inc.
 * =================================== */
import { isCarId } from './modules/idCard';
import { debounce, isEmpty, logger } from '@/utils';
import Vue from 'vue';
import { IMessage } from '@/http/message';

export const EmailReg = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
export const AmountReg = /(^[1-9]([0-9]{1,9})?(\.[0-9]{1,2})?$)|(^(0)$)|(^[0-9]\.[0-9]([0-9])?$)/;
export const AllNumberReg = /^\d+$/;
export const PhoneReg = /^[1][3-9][0-9]{9}$/;
export const TelReg = /[0-9\\-]{11,12}/;
export const IdCardReg = isCarId;
export const BankCardReg = /^([1-9])(\d{15}|\d{18})$/;
export const DepartmentNameReg = /^[A-Za-z0-9_.\-()（）\u4e00-\u9fa5]+$/; // 单位名
export const UserNameReg = /^[A-Za-z0-9_.\-\u4e00-\u9fa5]+$/;   // 用户名
export const RoleCodeReg = /^\w+$/;                             // 只能由英文、数字、下划线组成
export const HasZH_CNReg = /[\u4e00-\u9fa5]/gm;                 // 匹配中文字符
export const OnlyCN_EN_NumReg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/i; // 只能输入汉字、英文字母和数字

const TypeMap = {
	phone: PhoneReg,
	tel: TelReg,
	idCard: IdCardReg,
	bankCard: BankCardReg,
	email: EmailReg,
	allNumber: AllNumberReg,
	amount: AmountReg,
	departmentName: DepartmentNameReg,
	userName: UserNameReg
};

/**
 * form表单验证规则
 */
export const formValidate = {
	noNull: (msg, trigger = 'change') => [
		{ required: true, message: msg || '请输入', trigger }
	],
	name: (msg, trigger = 'change') => [
		{ required: true, message: msg || '请输入名称', trigger },
		// 名称支持特殊字符，如新疆名称等
		{ type: 'string', validator: /^[a-zA-Z\u4e00-\u9fa5]*$/, message: '只能输入中英文字符', trigger }
	],
	maxLength: (max, trigger = 'change') => [
		{ type: 'string', max, message: `长度不能超过${ max }位`, trigger }
	],
	minLength: (min, trigger = 'change') => [
		{ type: 'string', min, message: `长度不能小于${ min }位`, trigger }
	],
	phone: (msg, trigger = 'change') => [
		{ required: true, message: msg || '请输入手机号' },
		{ type: 'string', min: 11, message: `手机号长度错误，请重新输入`, trigger: 'blur' },
		{ type: 'string', max: 11, message: `手机号长度错误，请重新输入`, trigger: 'blur' },
		{
			type: 'string',
			validator: (rule, value) => /^\d+$/.test(value),
			message: '只能输入数字',
			trigger
		},
		{
			type: 'string',
			validator: (rule, value) => /^[1][3-9][0-9]{9}$/.test(value),
			message: '手机号错误，请重新输入',
			trigger
		},
		// {
		// 	trigger,
		// 	asyncValidator: debounce(function (rule, phone) { // debounce时，外层不能用箭头函数，不然this指向错误！
		// 		logger.log('rule, phone: ', rule, phone);
		// 		return new Promise((resolve, reject) => {
		// 			if (!baseValidate.phone(phone)) {
		// 				return reject('请输入正确格式的手机号码!');
		// 			}
		// 			const userInfo = Vue.ls.get(USER_INFO);
		// 			const params = {
		// 				tableName: 'sys_user',
		// 				fieldName: 'phone',
		// 				fieldVal: phone,
		// 				dataId: userInfo?.userId
		// 			};
		// 			duplicateCheck(params, { interceptRes: false }).then(res => {
		// 				logger.log('res: ', res);
		// 				if (res?.code === IMessage.OK.code) {
		// 					return resolve();
		// 				}
		// 				return reject('手机号已存在!');
		// 			});
		// 		});
		// 	}, 300)
		// }
	],
	tel: (msg, trigger = 'change') => [
		{ required: true, message: msg || '请输入电话号码' },
		{
			type: 'string',
			validator: (rule, value) => /[0-9\\-]{11,12}/.test(value),
			message: '请输入正确的电话号码',
			trigger
		}
	],
	idCard: (msg, trigger = 'change') => [
		{ required: true, message: msg || '请输入身份证号码' },
		{ type: 'string', validator: (rule, value) => isCarId(value), message: '请输入正确的身份证号码', trigger }
	],
	bankCard: (msg, trigger = 'change') => [
		{ required: true, message: msg || '请输入银行卡号' },
		{ type: 'string', validator: (rule, value) => /^([1-9])(\d{15}|\d{18})$/.test(value), message: '请输入正确的银行卡号', trigger }
	],
	email: (msg, trigger = 'change') => [
		{ required: true, message: msg || '请输入邮箱账号' },
		{ type: 'string', validator: (rule, value) => EmailReg.test(value), message: '请输入正确的邮箱账号', trigger }
	],
	amount: (msg, trigger = 'change') => [
		{ required: true, message: msg || '请输入金额' },
		{ type: 'string', validator: (rule, value) => AmountReg.test(value), message: '请输入正确的金额', trigger }
	],

	/** 输入时验证（非必填验证）
	 * @param {string} msg
	 * @param {string} type 验证类型 有 phone、tel、idCard、bankCard、email、amount、allNumber、departmentName、userName
	 * @param {string} trigger 触发类型 有 change、blur、['change', 'blur']
	 */
	inputValidation: (msg, type, trigger = 'change') => [{
		trigger,
		required: false,
		asyncValidator: (rule, value) => {
			return new Promise((resolve, reject) => {
				if (!value) {
					return resolve();
				}
				if (TypeMap[type]?.test(value)) {
					return resolve();
				}
				return reject(msg || '请确认输入的值是否正确');
			});
		}
	}],

	/**
	 * 3级联动验证
	 * @param {string} msg
	 * @param {string} trigger 触发类型 有 change、blur、['change', 'blur']
	 */
	areaLinkage: (msg, trigger = 'change') => [{
		trigger,
		required: true,
		asyncValidator: (rule, value) => {
			return new Promise((resolve, reject) => {
				if (!value || !Object.keys(value || {}).length) {
					return reject(msg || '请选择所在位置');
				}
				return resolve();
			});
		}
	}],

	/**
	 * 上传
	 * @param {string} msg
	 * @param {string} trigger 触发类型 有 change、blur、['change', 'blur']
	 * @param {function=} callback
	 */
	upload: (msg, trigger = 'change', callback) => [{
		trigger,
		required: true,
		asyncValidator: (rule, value) => {
			typeof callback === 'function' && callback(value);
			return new Promise((resolve, reject) => {
				if (!value || !value.length) {
					return reject(msg || '请上传');
				}
				return resolve();
			});
		}
	}],

	/**
	 * 长度校验
	 * @param {object} option
	 * @param {boolean=} option.required        是否验证必填
	 * @param {string=} option.fieldDesc        字段名称描述
	 * @param {number=} option.minLength        是否验证最小长度
	 * @param {number=} option.maxLength        是否验证最大长度
	 * @param {string=} option.trigger          触发类型 有 change、blur、['change', 'blur'], 默认 'blur'
	 */
	checkLength: (option = {}) => [{
		trigger: option.trigger || 'change',
		required: option.required,
		asyncValidator: debounce(function (rule, value) { // debounce时，外层不能用箭头函数，不然this指向错误！
			logger.log('rule, value: ', rule, value);
			return new Promise((resolve, reject) => {
				if (option.required && !baseValidate.required(value)) {
					return reject(`请输入${ option.fieldDesc || '' }!`);
				}
				if (!isEmpty(option.minLength) && value && !baseValidate.minlength(value, option.minLength)) {
					return reject(`不能少于${ option.minLength }个字符!`);
				}
				if (!isEmpty(option.maxLength) && value && !baseValidate.maxlength(value, option.maxLength)) {
					return reject(`不能大于${ option.maxLength }个字符!`);
				}
				return resolve();
			});
		}, 300)
	}],

	/**
	 * 重复检查
	 * @param {object} option
	 * @param {string} option.fieldName         字段名称
	 * @param {string} option.fieldDesc         字段名称描述
	 * @param {string=} option.tableName        表名
	 * @param {boolean=} option.isPhone         是否验证手机号
	 * @param {boolean=} option.isUsername      是否验证用户名(账号)
	 * @param {boolean=} option.isEmail         是否验证邮箱
	 * @param {boolean=} option.isWorkNo        是否验证学号
	 * @param {function=} option.isEdit         编辑模式下是否验证唯一性(通过function调用获取，避免作用域问题)
	 * @param {function=} option.initValue      初始值(通过function调用获取，避免作用域问题)
	 * @param {boolean=} option.noCN            不含中文字符
	 * @param {boolean=} option.noSpecial       不含特殊字符
	 * @param {boolean=} option.required        是否验证必填
	 * @param {string=} option.workNoDesc       学号错误提示信息
	 * @param {number=} option.minLength        是否验证最小长度
	 * @param {number=} option.maxLength        是否验证最大长度
	 * @param {string=} option.trigger          触发类型 有 change、blur、['change', 'blur'], 默认 'blur'
	 */
	duplicateCheck: (option = {}) => [{
		trigger: option.trigger || 'change',
		required: option.required,
		asyncValidator: debounce(function (rule, value) { // debounce时，外层不能用箭头函数，不然this指向错误！
			logger.log('重复检查 value, initValue: ', value, option.initValue && option.initValue());
			return new Promise((resolve, reject) => {
				if (option.required && !baseValidate.required(value)) {
					return reject(`请输入${ option.fieldDesc }!`);
				}
				if (option.isPhone && value && !baseValidate.phone(value)) {
					return reject(`请输入正确的${ option.fieldDesc }!`);
				}
				if (option.isUsername && value && !baseValidate.name(value)) {
					return reject(`请输入正确的${ option.fieldDesc }!`);
				}
				if (option.isEmail && value && !baseValidate.checkEmail(value)) {
					return reject(`请输入正确的${ option.fieldDesc }!`);
				}
				if (option.isWorkNo && value && !baseValidate.length(value, 12)) {
					return reject(option.workNoDesc || `请输入正确的学号!`);
				}
				if (option.noCN && value && baseValidate.hasZH_CN(value)) {
					return reject(`请输入正确的${ option.fieldDesc }，不能含有中文!`);
				}
				if (option.noSpecial && value && baseValidate.noSpecial(value)) {
					return reject(`请输入正确的${ option.fieldDesc }，不能含有特殊字符!`);
				}
				if (!isEmpty(option.minLength) && value && !baseValidate.minlength(value, option.minLength)) {
					return reject(`不能少于${ option.minLength }个字符!`);
				}
				if (!isEmpty(option.maxLength) && value && !baseValidate.maxlength(value, option.maxLength)) {
					return reject(`不能大于${ option.maxLength }个字符!`);
				}

				if (option.isEdit && option.isEdit() && option.initValue && option.initValue() === value) {
					return resolve();
				}

				// const userInfo = Vue.ls.get(USER_INFO);
				// const params = {
				// 	tableName: option.tableName || 'sys_user',
				// 	fieldName: option.fieldName,
				// 	fieldVal: value,
				// 	dataId: userInfo?.userId
				// };
				// duplicateCheck(params, { interceptRes: false }).then(res => {
				// 	if (res?.code === IMessage.OK.code) {
				// 		return resolve();
				// 	}
				// 	return reject(`${ option.fieldDesc }已存在!`);
				// });
			});
		}, 300)
	}],

	/**
	 * 自定义验证
	 * @param {string} msg
	 * @param {function} callback
	 * @param {string} trigger 触发类型 有 change、blur、['change', 'blur']
	 */
	custom: (msg, callback, trigger = 'change') => [{
		trigger,
		required: true,
		validator: callback,
		message: msg || ''
	}]
};

/**
 * 基本验证规则
 */
export const baseValidate = {
	/**
	 * 必填
	 * @param {string} value
	 * @returns {boolean}
	 */
	required: (value) => !!value,

	/**
	 * 比较长度
	 * @param {string} value
	 * @param {number} len
	 * @returns {boolean}
	 */
	length: (value, len) => (value || '').trim().length === len,

	/**
	 * 最小长度
	 * @param {string} value
	 * @param {number} len
	 * @returns {boolean}
	 */
	minlength: (value, len) => (value || '').trim().length >= len,

	/**
	 * 最大长度
	 * @param {string} value
	 * @param {number} len
	 * @returns {boolean}
	 */
	maxlength: (value, len) => (value || '').trim().length <= len,

	/**
	 * 名称验证
	 * @param {string} value
	 * @return {boolean}
	 */
	name: (value) => UserNameReg.test(value),

	/**
	 * 手机号验证
	 * @param {string} value
	 * @return {boolean}
	 */
	phone: (value) => PhoneReg.test(value),

	/**
	 * 电话号码验证
	 * @param {string} value
	 * @return {boolean}
	 */
	tel: (value) => TelReg.test(value),

	/**
	 * 座机号码验证
	 * @param {string} value
	 * @return {boolean}
	 */
	specialPlane: (value) => /^0\d{2,3}-[1-9]\d{6,7}$/.test(value),

	/**
	 * 身份证验证
	 * @param {string} value
	 * @return {boolean}
	 */
	idCard: (value) => isCarId(value),

	/**
	 * 验证码验证
	 * @param {string} value
	 * @return {boolean}
	 */
	captcha: (value) => /[a-z0-9A-Z]{4,6}/.test(value),

	/**
	 * 金额验证
	 * @param {string} value
	 * @return {boolean}
	 */
	amount: (value) => AmountReg.test(value),

	/**
	 * 工作时长：整数两位数，小数保留两位数
	 * @param {string} value
	 * @returns {boolean}
	 */
	workTime: (value) => /(^[0-9]([0-9])?(\.[0-9]{1,2})?$)/.test(value),

	/***
	 * 邮箱校验
	 * @param {string} value
	 * @returns {boolean}
	 */
	checkEmail: (value) => EmailReg.test(value),

	/**
	 * URL地址校验
	 * @param {string} value
	 */
	isURL: (value) => /^http[s]?:\/\/.*/.test(value),

	/**
	 * 角色编码校验
	 *  只能由英文、数字、下划线组成
	 * @param {string} value
	 */
	roleCode: (value) => RoleCodeReg.test(value),

	/**
	 * 匹配中文字符
	 * @param {string} value
	 */
	hasZH_CN: (value) => HasZH_CNReg.test(value),

	/**
	 * 只能输入汉字、英文字母和数字
	 * @param {string} value
	 */
	onlyCnEn: (value) => OnlyCN_EN_NumReg.test(value),

	/**
	 * 不能含有特殊字符
	 * @param {string} value
	 */
	noSpecial: (value) => !OnlyCN_EN_NumReg.test(value)
};
